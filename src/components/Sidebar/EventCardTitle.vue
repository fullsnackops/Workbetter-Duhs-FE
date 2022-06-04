<template>
    <v-layout row>
        <v-flex xs11>
            <span class="white--text font-sm fw-bold">
                {{ eventTitle }}
            </span>
        </v-flex>
    </v-layout>
</template>

<script>
import AppConfig from '@/constants/AppConfig'

export default {
    props: ['appointment'],
    data() {
        return {
            TAG_CRITICAL: AppConfig.meetingTag.critical,
            TAG_PERSONAL: AppConfig.meetingTag.personal,
        }
    },
    computed: {
        eventTitle() {
            if (this.appointment.title.includes(this.TAG_CRITICAL)) {
                return this.appointment.title.replace(this.TAG_CRITICAL, '')
            }

            if (this.appointment.title.includes(this.TAG_PERSONAL)) {
                return this.appointment.title.replace(this.TAG_PERSONAL, '')
            }

            return this.appointment.title
        },
    },
}
</script>
