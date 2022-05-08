<template>
    <div>
        Workbetter-Duhs Calendar
    </div>
</template>

<script>
import moment from 'moment-timezone'

export default {
    name: 'WDCalendar',
    props: {
        appointments: {
            required: true,
            type: Array,
        },
        configuration: {
            type: Object,
            required: false,
            validator: val => {
                return typeof val === 'object'
            },
        },
    },
    data() {
        return {
            default_options: {
                current_week: null,
                currently_working_on_date: null,
                current_day: null,
                existing_appointments: {},
            },
            weeks: {},
        }
    },
    computed: {
        calendar_options: {
            get() {
                let options = this.default_options
                let providedProps = this.configuration
                // const { timezone } = this.$store.getters.user
                const timezone = 'America/Chicago'
                const today = moment.tz(timezone)
                if (today.day() > 5 || (today.day() === 5 && today.hours() > 11)) {
                    today.add(1, 'week').startOf('week')
                }
                today.add(this.$store.getters.wplannerOffset, 'weeks')

                options.current_day = today
                for (let key in providedProps) {
                    options[key] = providedProps[key]
                }
                return options
            },
            set(val) {
                this.configuration = val
            },
        },
    },
}
</script>
