<template>
    <div class="details-card">
        <span class="font-xs ml-2">
            <v-icon>fa fa-user{{ appointment.tag_critical ? 's' : '' }}</v-icon>
            {{ appointment.tag_critical ? 'Workbetter-Duhs Critical Meeting' : 'Workbetter-Duhs Personal Meeting' }}
        </span>
    </div>
</template>

<script>
import moment from 'moment-timezone'
import { differenceInMinutes } from 'date-fns'

export default {
    props: ['appointment'],
    data() {
        return {
            interval: undefined,
            diffMinsFromEventStart: NaN,
        }
    },
    methods: {
        calcDiffMinsFromEvent() {
            if (this.diffMinsFromEventStart <= 0) return
            // const { timezone } = this.$store.getters.user
            const timezone = 'America/Chicago'
            this.diffMinsFromEventStart = differenceInMinutes(moment(this.appointment.from), moment.tz(timezone))
        },
    },
    created() {
        this.calcDiffMinsFromEvent()
        this.interval = setInterval(this.calcDiffMinsFromEvent, 60 * 1000)
    },
    beforeDestroy() {
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = undefined
        }
    },
}
</script>
