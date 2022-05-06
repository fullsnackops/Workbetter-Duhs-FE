const moment = require('moment-timezone')

const MIN_FOCUS_TIME = 60
const MIN_TRANSITION_PREV = 15
const MIN_TRANSITION_POST = 30

export default class Blocks {
  constructor (date) {
    this.start = date.clone().set({hours: 8, minutes: 0, seconds: 0, milliseconds: 0})
    this.end = date.clone().set({hours: 17, minutes: 0, seconds: 0, milliseconds: 0})
    this.head = null
    this.tail = null
    this.current = null
    this.blocks = []
    this.events = []

    this.last = this.start
    this.date = date
    this.addEvent = this.addEvent.bind(this)
    this.addBlock = this.addBlock.bind(this)
  }

  addEvent (event) {
    if (event.status === 'cancelled') {
      return
    }

    const node = {
      start: moment.tz(event.start * 1000, event.timeZone),
      end: moment.tz(event.end * 1000, event.timeZone),
      isOOO: event.isOOO,
      isTentative: event.isTentative,
      summary: event.summary
    }

    Blocks.appendNode(this, node)
  }

  addBlock (block) {
    this.blocks.push(block)
    this.last = moment.tz(block.to, this.date.tz())
  }

  static appendNode (list, node) {
    if (!list.head) list.head = node
    if (list.tail && list.tail !== node) list.tail.next = node
    list.tail = node
  }

  static calculateHead (list) {
    if (!list.head) return
    const {start} = list.head
    const date = list.date.format('YYYY-MM-DD')

    // don't add transition in after hours
    if (start.isSameOrBefore(list.start)) return

    const totalTimeBetween = start.diff(list.start, 'minutes')

    if (list.head.isOOO) {
      if (totalTimeBetween > MIN_FOCUS_TIME) {
        const from = list.start.toISOString()
        const to = start.toISOString()
        const block = {
          from,
          to,
          date,
          data: {
            title: 'Focus Block',
            description: 'Lorem ipsum dolor sit amet.',
            category: 'focus'
          }
        }
        list.addBlock(block)
      }
      return
    }

    const actualTransition = Math.min(MIN_TRANSITION_PREV, totalTimeBetween)
    const possibleFocusTime = totalTimeBetween - actualTransition

    if (possibleFocusTime >= MIN_FOCUS_TIME) {
      const focus = {
        from: list.last.toISOString(),
        to: list.start.clone().add(possibleFocusTime, 'minutes').toISOString(),
        date,
        data: {
          title: 'Focus Block',
          description: 'Lorem ipsum dolor sit amet.',
          category: 'focus'
        }
      }
      list.addBlock(focus)
    }

    if (actualTransition > 0) {
      const transition = {
        from: list.last.toISOString(),
        to: list.last.clone().add(actualTransition, 'minutes').toISOString(),
        date,
        data: {
          title: 'Transition Block',
          description: 'Lorem ipsum dolor sit amet.',
          category: 'transition'
        }
      }
      list.addBlock(transition)
    }
  }

  static calculateNode (list) {
    const node = list.current
    if (!node) return
    const date = list.date.format('YYYY-MM-DD')
    const {end} = node
    const nextStart = node.next ? node.next.start : list.end

    if (node.isOOO) {
      list.last = node.end.clone()
      return
    }

    const block = {
      from: list.last.toISOString(),
      to: node.end.toISOString(),
      date,
      data: {
        title: 'Meeting Block',
        description: node.summary,
        category: 'meeting'
      }
    }
    list.addBlock(block)

    // do not add transition in after hours or when next meeting starts immediately after current one
    if (end.isSameOrAfter(nextStart)) return

    const totalTimeBetweenEvents = nextStart.diff(end, 'minutes')

    const nextTransition = node.next ? (node.next.isOOO ? 0 : MIN_TRANSITION_PREV) : 0
    const maxPossibleTransition = MIN_TRANSITION_POST + nextTransition
    const actualTransition = Math.min(maxPossibleTransition, totalTimeBetweenEvents)

    const possibleFocusTime = totalTimeBetweenEvents - actualTransition
    if (possibleFocusTime >= MIN_FOCUS_TIME) {
      const t1 = {
        from: list.last.toISOString(),
        to: list.last.clone().add(MIN_TRANSITION_POST, 'minutes'),
        date,
        data: {
          title: 'Transition Block',
          description: 'transition',
          category: 'transition'
        }
      }
      list.addBlock(t1)

      const f = {
        from: list.last.toISOString(),
        to: list.last.clone().add(possibleFocusTime, 'minutes'),
        date,
        data: {
          title: 'Focus Block',
          description: 'transition',
          category: 'focus'
        }
      }
      list.addBlock(f)

      if (nextTransition > 0) {
        const t2 = {
          from: list.last.toISOString(),
          to: list.last.clone().add(nextTransition, 'minutes'),
          date,
          data: {
            title: 'Transition Block',
            description: 'transition',
            category: 'transition'
          }
        }
        list.addBlock(t2)
      }
    } else {
      const t = {
        from: list.last.toISOString(),
        to: list.last.clone().add(actualTransition, 'minutes'),
        date,
        data: {
          title: 'Transition Block',
          description: 'transition',
          category: 'transition'
        }
      }
      list.addBlock(t)
    }

    list.current = list.current.next

    return list.current
  }

  calculate () {
    this.current = this.head
    if (this.current) {
      Blocks.calculateHead(this)
      while (Blocks.calculateNode(this)) {}
    }
    this.calculated = true
  }
}
