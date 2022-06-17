<template>
    <v-container fluid grid-list-xl>
        <v-layout row wrap border-rad-sm overflow-hidden>
            <app-card :heading="$t('message.meetingTimeCalendar')" colClasses="xs12" :fullScreen="true">
                <week-look-ahead-view :events="events"></week-look-ahead-view>
            </app-card>
        </v-layout>
    </v-container>
</template>

<script>
import WeekLookAheadView from '@/components/Widgets/WeekLookAheadView'
import moment from 'moment-timezone'
import Blocks from '@/components/Calendar/Blocks'
import orderBy from 'lodash/orderBy'

export default {
    name: 'WeeklyPlanner',
    components: {
        WeekLookAheadView,
    },
    mounted: function() {
        this.$store.dispatch('loadWPlanner', 0)
        this.$store.dispatch('viewDashboard', {
            dashboard: 'Weekly Planner',
            dateRange: this.currentWeek(),
        })
    },
    computed: {
        events() {
            const { events } = this.$store.getters.planner
            if (!events) return null
            const blocks = {}
            let res = []

            for (const date of Object.keys(events)) {
                const timezone = this.$store.getters.user.timezone
                // const timezone = 'America/Chicago'
                const mdate = moment.tz(date, 'YYYY-MM-DD', timezone)

                const agg = new Blocks(mdate)
                for (const event of events[date]) {
                    agg.addEvent(event)
                }

                agg.calculate()
                blocks[date] = orderBy(
                    agg.blocks.filter(
                        block => block.data.category === 'meeting' || block.data.category === 'tentative'
                    ),
                    ['from']
                )
                res = res.concat(agg.blocks)
            }
            this.$store.commit('calculatedBlocks', blocks)

            return res
        },
    },
    methods: {
        currentWeek() {
            const { timezone } = this.$store.getters.user
            const dateFormatter = 'MM/DD/YYYY'
            const startDate = moment
                .tz(timezone)
                .startOf('week')
                .day(1)
            const f = moment
                .tz(timezone)
                .day(5)
                .set({ hours: 12, minutes: 0, seconds: 0 })
            const now = moment.tz(timezone)

            if (now.isAfter(f)) {
                startDate.add(1, 'week')
            }
            startDate.add(this.$store.getters.plannerOffset, 'weeks')

            const endDate = startDate
                .clone()
                .endOf('week')
                .day(5)

            return `${startDate.format(dateFormatter)} - ${endDate.format(dateFormatter)}`
        },
    },
}
</script>
