<template>
    <v-layout row>
        <v-flex xs11>
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
}
</script>
