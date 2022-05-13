<template>
    <div class="mf-calendar-day">
        <!-- Calendar cell(quarter) view -->
        <w-d-calendar-cell
            v-for="(quarter, index) in day.date_hours"
            :key="`${day.date}_${index}`"
            :day="day"
            :index="index"
            :cell-data.sync="quarter"
        />
    </div>
</template>

<script>
import WDCalendarCell from './WDCalendarCell'

export default {
    name: 'WDCalendarDay',
    props: ['day'],
    inject: ['calendarOptions'],
    components: {
        WDCalendarCell,
    },
}
</script>
