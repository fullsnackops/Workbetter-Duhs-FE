const moment = require('moment-timezone')

const MIN_FOCUS_TIME = 60
const MIN_TRANSITION_PREV = 15
const MIN_TRANSITION_POST = 30

export default class Blocks {
    constructor(date) {
        this.start = date.clone().set({ hours: 8, minutes: 0, seconds: 0, milliseconds: 0 })
        this.end = date.clone().set({ hours: 17, minutes: 0, seconds: 0, milliseconds: 0 })
        this.head = null
        this.tail = null
        this.current = null
        this.blocks = []
        this.events = []

        this.last = this.start
        this.date = date
        this.addEvent = this.addEvent.bind(this)
        this.addBlock = this.addBlock.bind(this)
        this.calculate = this.calculate.bind(this)
    }

    addEvent(event) {
        if (event.status === 'cancelled') {
            return
        }

        const node = {
            start: moment.tz(event.start * 1000, event.timeZone),
            end: moment.tz(event.end * 1000, event.timeZone),
            isOOO: event.isOOO,
            isTentative: event.isTentative,
            isRecurring: event.isRecurring,
            isOrganizer: event.isOrganizer,
            summary: event.summary,
        }

        const overlapped = this.tail && this.tail.end.isAfter(node.start)
        if (!overlapped) {
            return Blocks.appendNode(this, node)
        }

        const selected = Blocks.chooseOverlapped(this.tail, node)
        if (selected === node) {
            // new node selected
            if (!node.isOOO) {
                this.tail.isTentative = 1
                Blocks.replaceNode(this, this.tail, node)
            }
        } else {
            // old node selected
            if (!node.isOOO) {
                node.isTentative = 1
                Blocks.appendNode(this, node)
            }
        }
    }

    addBlock(block) {
        this.blocks.push(block)
        this.last = moment(block.to)
        if (block.data.category === 'focus') {
            const diff = Math.round(block.to - block.from) / 60000
            this.focusTime += diff
        }
    }

    static chooseOverlapped(left, right) {
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

        if (left.isRecurring && right.isRecurring) {
            left.end = right.end
            return left
        }

        return left.created > right.created ? left : right
    }

    static replaceNode(list, node, replacement) {
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

    static appendNode(list, node) {
        if (!list.head) list.head = node
        if (list.tail && list.tail !== node) list.tail.next = node
        list.tail = node
    }

    static calculateHead(list) {
        const date = list.date.format('YYYY-MM-DD')

        if (!list.head) {
            const focus = {
                from: list.start.valueOf(),
                to: list.end.valueOf(),
                date,
                data: {
                    title: 'Focus Block',
                    category: 'focus',
                },
            }
            list.addBlock(focus)
            return
        }

        const { start } = list.head
        // don't add transition in after hours
        if (start.isSameOrBefore(list.start)) return

        const totalTimeBetween = start.diff(list.start, 'minutes')
        let actualTransition = Math.min(MIN_TRANSITION_PREV, totalTimeBetween)

        if (list.head.isOOO) {
            if (totalTimeBetween > MIN_FOCUS_TIME) {
                const from = list.start.valueOf()
                const to = start.valueOf()
                const block = {
                    from,
                    to,
                    date,
                    data: {
                        title: 'Focus Block',
                        category: 'focus',
                    },
                }
                list.addBlock(block)
            }
            return
        } else if (list.head.isTentative) {
            const from = list.start.valueOf()
            const to = start.valueOf()
            const block = {
                from,
                to,
                date,
                data: {
                    title: 'Tentative Block',
                    description: list.head.summary,
                    category: 'tentative',
                },
            }
            list.addBlock(block)
            actualTransition = 0
        }

        const possibleFocusTime = totalTimeBetween - actualTransition

        if (possibleFocusTime >= MIN_FOCUS_TIME) {
            const focus = {
                from: list.last.valueOf(),
                to: list.start
                    .clone()
                    .add(possibleFocusTime, 'minutes')
                    .valueOf(),
                date,
                data: {
                    title: 'Focus Block',
                    category: 'focus',
                },
            }
            list.addBlock(focus)

            const transition = {
                from: list.last.valueOf(),
                to: list.last
                    .clone()
                    .add(actualTransition, 'minutes')
                    .valueOf(),
                date,
                data: {
                    title: 'Transition Block',
                    category: 'transition',
                },
            }
            list.addBlock(transition)
        } else {
            const transition = {
                from: list.last.valueOf(),
                to: list.last
                    .clone()
                    .add(totalTimeBetween, 'minutes')
                    .valueOf(),
                date,
                data: {
                    title: 'Transition Block',
                    category: 'transition',
                },
            }
            list.addBlock(transition)
        }
    }

    static calculateNode(list) {
        const node = list.current
        if (!node) return
        list.current = list.current.next

        const date = list.date.format('YYYY-MM-DD')
        const { end } = node
        const nextStart = node.next ? node.next.start : list.end

        if (node.isOOO) {
            list.last = node.end.clone()
            return
        }

        if (node.isTentative) {
            const block = {
                from: list.last.valueOf(),
                to: node.end.valueOf(),
                date,
                data: {
                    title: 'Tentative Block',
                    description: node.summary,
                    category: 'tentative',
                },
            }
            list.addBlock(block)
        } else {
            const block = {
                from: list.last.valueOf(),
                to: node.end.valueOf(),
                date,
                data: {
                    title: node.summary || 'Meeting block',
                    description: node.summary,
                    category: 'meeting',
                },
            }
            list.addBlock(block)
        }

        // do not add transition in after hours or when next meeting starts immediately after current one
        if (end.isSameOrAfter(nextStart)) return

        const totalTimeBetweenEvents = nextStart.diff(end, 'minutes')
        const nextTransition = node.next ? (node.next.isOOO || node.next.isTentative ? 0 : MIN_TRANSITION_PREV) : 0
        const maxPossibleTransition = MIN_TRANSITION_POST + nextTransition
        const actualTransition = node.isTentative ? 0 : Math.min(maxPossibleTransition, totalTimeBetweenEvents)

        const possibleFocusTime = totalTimeBetweenEvents - actualTransition
        if (possibleFocusTime >= MIN_FOCUS_TIME) {
            const t1 = {
                from: list.last.valueOf(),
                to: list.last
                    .clone()
                    .add(MIN_TRANSITION_POST, 'minutes')
                    .valueOf(),
                date,
                data: {
                    title: 'Transition Block',
                    category: 'transition',
                },
            }
            list.addBlock(t1)

            const f = {
                from: list.last.valueOf(),
                to: list.last
                    .clone()
                    .add(possibleFocusTime, 'minutes')
                    .valueOf(),
                date,
                data: {
                    title: 'Focus Block',
                    category: 'focus',
                },
            }
            list.addBlock(f)

            if (nextTransition > 0) {
                const t2 = {
                    from: list.last.valueOf(),
                    to: list.last
                        .clone()
                        .add(nextTransition, 'minutes')
                        .valueOf(),
                    date,
                    data: {
                        title: 'Transition Block',
                        category: 'transition',
                    },
                }
                list.addBlock(t2)
            }
        } else {
            const t = {
                from: list.last.valueOf(),
                to: list.last
                    .clone()
                    .add(totalTimeBetweenEvents, 'minutes')
                    .valueOf(),
                date,
                data: {
                    title: 'Transition Block',
                    category: 'transition',
                },
            }
            list.addBlock(t)
        }
    }

    calculate() {
        this.focusTime = 0
        this.current = this.head
        Blocks.calculateHead(this)
        while (this.current) {
            Blocks.calculateNode(this)
        }
        this.calculated = true
    }
}
