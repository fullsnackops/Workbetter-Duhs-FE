<template>
    <v-container fluid grid-list-xl>
        <v-layout row wrap border-rad-sm overflow-hidden>
            <app-card :heading="$t('message.meetingTimeCalendar')" colClasses="xs12" :fullScreen="true" />
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'WeeklyPlanner',
    mounted: function() {
        this.$store.dispatch('viewDashboard', {
            dashboard: 'Weekly Planner',
            dateRange: this.currentWeek(),
        })
    },
}
</script>
