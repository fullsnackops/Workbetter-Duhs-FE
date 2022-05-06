<template>
    <v-container fluid grid-list-xl>
        <v-layout row wrap border-rad-sm overflow-hidden>
            <app-card :heading="$t('message.meetingTimeCalendar')" colClasses="xs12" :fullScreen="true" />
        </v-layout>
    </v-container>
</template>

<script>
import moment from 'moment-timezone'

export default {
    name: 'WeeklyPlanner',
    mounted: function() {
        this.$store.dispatch('viewDashboard', {
            dashboard: 'Weekly Planner',
            dateRange: this.currentWeek(),
        })
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
