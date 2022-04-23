<template>
    <div>
        <v-container fluid grid-list-xl>
            <v-layout row wrap border-rad-sm overflow-hidden>
                <!-- Meeting Stats -->
                <app-card
                    :heading="$t('message.meetingStats')"
                    colClasses="xl4 lg4 md6 sm12 xs12"
                    :fullBlock="true"
                    :withTabs="true"
                    :tabs="[$t('message.lastWeek'), $t('message.last30Days')]"
                    @onChangeTabCallback="onChangeTab"
                >
                    <skeleton-list :data="recapStatsData" :repeat="5" :enable-animation="true">
                        <meeting-stats :statsOption="meetingStatsOption" :stats="meetingStats"></meeting-stats>
                    </skeleton-list>
                </app-card>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import moment from 'moment-timezone'
import MeetingStats from '@/components/Widgets/MeetingStats'

export default {
    name: 'WeeklyAnalyzer',
    components: {
        MeetingStats,
    },
    data() {
        return {
            meetingStatsOption: 'last-week',
        }
    },
    mounted: async function() {
        this.$store.dispatch('loadRecap', -1)
        this.$store.dispatch('viewDashboard', {
            dashboard: 'Weekly Recap',
            dateRange: this.currentWeek(),
        })
    },
    computed: {
        recapStatsData() {
            return this.$store.getters.recap.stats
        },
        meetingStats() {
            const { stats } = this.$store.getters.recap
            if (!stats) return { week: {}, month: {} }
            return {
                week: stats.week,
                month: stats.month,
            }
        },
    },
    methods: {
        onChangeTab(value) {
            switch (value) {
                case 0:
                    this.meetingStatsOption = 'last-week'
                    break
                case 1:
                    this.meetingStatsOption = 'last-month'
                    break
                default:
                    break
            }
        },
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
            startDate.add(this.$store.getters.recapOffset, 'weeks')

            const endDate = startDate
                .clone()
                .endOf('week')
                .day(5)

            return `${startDate.format(dateFormatter)} - ${endDate.format(dateFormatter)}`
        },
    },
}
</script>
