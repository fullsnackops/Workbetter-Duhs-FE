const moment = require('moment-timezone')

const MIN_FOCUS_TIME = 60
const MIN_TRANSITION_PREV = 15
const MIN_TRANSITION_POST = 30

const EventTypes = {
    meeting: 1,
    ooo: 2,
    tentative: 3,
    cancelled: 4,
}

function chooseOverlapped(left, right) {
    if (left.isOOO) {
        if (right.isOOO) {
            left.end = right.end
        }
        return left
    }

    if (right.isOOO) {
        return right
    }

    const isOrganizer = left.isOrganizer - right.isOrganizer
    if (isOrganizer === -1) return right
    if (isOrganizer === 1) return left

    const isRecurring = left.isRecurring - right.isRecurring
    if (isRecurring === -1) return left
    if (isRecurring === 1) return right

    return left.created > right.created ? left : right
}

function replaceNode(list, node, replacement) {
    if (list.head === node) {
        list.head = replacement
    } else {
        let prev = list.head
        while (prev && prev.next !== node) {
            prev = prev.next
        }
        if (prev) {
            prev.next = replacement
        }
    }
    if (list.tail === node) {
        list.tail = replacement
    }
}

function appendNode(list, node) {
    if (!list.head) list.head = node
    if (list.tail && list.tail !== node) list.tail.next = node
    list.tail = node
}

export default class Blocks {
    constructor(date) {
        this.start = date.clone().set({ hours: 8, minutes: 0, seconds: 0, milliseconds: 0 })
        this.end = date.clone().set({ hours: 17, minutes: 0, seconds: 0, milliseconds: 0 })
        this.head = null
        this.tail = null
        this.current = null
        this.blocks = []

        this.last = this.start
        this.date = date
        this.addEvent = this.addEvent.bind(this)
        this.addBlock = this.addBlock.bind(this)
        this.calculateHead = this.calculateHead.bind(this)
        this.calculateNode = this.calculateNode.bind(this)
        this.calculate = this.calculate.bind(this)
    }

    addEvent(event) {
        if (event.status === 'cancelled') {
            return
        }

        const node = {
            start: moment.tz(event.start * 1000, event.timezone),
            end: moment.tz(event.end * 1000, event.timezone),
            isOOO: event.type === EventTypes.ooo,
            isTentative: event.type === EventTypes.tentative,
            isRecurring: event.rcr ? 1 : 0,
            isOrganizer: event.org ? 1 : 0,
            summary: event.summary,
            created: event.created,
        }

        if (node.isTentative) {
            this.addBlock('tentative', node)
            return
        }

        const overlapped = this.tail && this.tail.end.isAfter(node.start)
        if (!overlapped) {
            return appendNode(this, node)
        }

        const selected = chooseOverlapped(this.tail, node)
        if (selected === node) {
            // new node selected
            this.tail.isTentative = 1
            this.addBlock('tentative', this.tail)
            replaceNode(this, this.tail, node)
        } else {
            // old node selected
            if (!node.isOOO) {
                node.isTentative = 1
                this.addBlock('tentative', node)
            }
        }
    }

    addBlock(category, node) {
        const block = {
            from: node.start.valueOf(),
            to: node.end.valueOf(),
            date: this.date.format('YYYY-MM-DD'),
            data: {
                title: node.summary || category,
                category,
            },
        }
        this.blocks.push(block)

        if (category !== 'tentative') {
            this.last = moment(block.to)
        }

        if (category === 'focus') {
            const diff = Math.round(block.to - block.from) / 60000
            this.focusTime += diff
        }
    }

    calculateHead() {
        if (!this.head) {
            this.addBlock('focus', {
                start: this.start,
                end: this.end,
            })
            return
        }

        const { start } = this.head
        // don't add transition in after hours
        if (start.isSameOrBefore(this.start)) return

        const totalTimeBetween = start.diff(this.start, 'minutes')
        let actualTransition = Math.min(MIN_TRANSITION_PREV, totalTimeBetween)

        if (this.head.isOOO) {
            if (totalTimeBetween > MIN_FOCUS_TIME) {
                this.addBlock('focus', {
                    start: this.start,
                    end: start,
                })
            }
            return
        }

        const possibleFocusTime = totalTimeBetween - actualTransition

        if (possibleFocusTime >= MIN_FOCUS_TIME) {
            this.addBlock('focus', {
                start: this.last,
                end: this.start.clone().add(possibleFocusTime, 'minutes'),
            })
            this.addBlock('transition', {
                start: this.last,
                end: this.last.clone().add(actualTransition, 'minutes'),
            })
        } else {
            this.addBlock('transition', {
                start: this.last,
                end: this.last.clone().add(totalTimeBetween, 'minutes'),
            })
        }
    }

    calculateNode() {
        const node = this.current
        if (!node) return
        this.current = this.current.next
        const nextStart = node.next ? node.next.start : this.end

        if (node.isOOO) {
            this.addBlock('ooo', node)
        } else {
            this.addBlock('meeting', node)
        }

        // do not add transition in after hours or when next meeting starts immediately after current one
        if (this.last.isSameOrAfter(nextStart)) return

        const totalTimeBetweenEvents = nextStart.diff(this.last, 'minutes')
        const nextTransition = node.next ? MIN_TRANSITION_PREV : 0
        const maxPossibleTransition = MIN_TRANSITION_POST + nextTransition
        const actualTransition = Math.min(maxPossibleTransition, totalTimeBetweenEvents)

        const possibleFocusTime = totalTimeBetweenEvents - actualTransition
        if (possibleFocusTime >= MIN_FOCUS_TIME) {
            this.addBlock('transition', {
                start: this.last,
                end: this.last.clone().add(MIN_TRANSITION_POST, 'minutes'),
            })
            this.addBlock('focus', {
                start: this.last,
                end: this.last.clone().add(possibleFocusTime, 'minutes'),
            })
            if (nextTransition > 0) {
                this.addBlock('transition', {
                    start: this.last,
                    end: this.last.clone().add(nextTransition, 'minutes'),
                })
            }
        } else {
            this.addBlock('transition', {
                start: this.last,
                end: this.last.clone().add(totalTimeBetweenEvents, 'minutes'),
            })
        }
    }

    calculate() {
        this.focusTime = 0
        this.current = this.head
        // check if has all day OOO
        const { start, end } = this
        const allDayOOO = this.blocks.filter(
            block => block.data.category === 'ooo' && block.from <= start.valueOf() && block.to >= end.valueOf()
        )
        if (!allDayOOO.length) {
            this.calculateHead()
        }
        while (this.current) {
            this.calculateNode()
        }
        this.calculated = true
    }
}
