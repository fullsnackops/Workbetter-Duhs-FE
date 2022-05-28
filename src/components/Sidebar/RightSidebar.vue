<template>
    <div>
        <v-navigation-drawer app clipped v-model="toggle" :width="350" right :temporary="temporary">
            <v-toolbar color="primary" dark>
                <v-toolbar-side-icon icon @click="toggleSidebar"></v-toolbar-side-icon>
                <v-toolbar-title>
                    {{ $t('message.calendarEvents') }}
                </v-toolbar-title>
            </v-toolbar>
            <event-details :events="events" :settings="settings" ref="refDetails"></event-details>
        </v-navigation-drawer>

        <div class="right-sidebar">
            <a class="customizer-toggle primary v-step-3" href="javascript:;" @click="toggleSidebar">
                <i class="zmdi ti-menu font-lg"></i>
            </a>
        </div>
    </div>
</template>

<script>
import EventDetails from '@/components/Sidebar/EventDetails'

export default {
    data() {
        return {
            toggle: false,
            settings: {
                maxScrollbarLength: 160,
            },
        }
    },
    methods: {
        toggleSidebar() {
            this.toggle = !this.toggle
        },
        getDayForScroll() {
            // const { timezone } = this.$store.getters.user
            const timezone = 'America/Chicaco'
            const today = moment.tz(timezone).format('YYYY-MM-DD')

            let dayForScroll = ''
            const weekDays = Object.keys(this.events)
            if (weekDays.length && !weekDays.includes(today)) {
                // If today and weekDays are on the same year/month
                if (weekDays[0].substring(0, 7) === today.substring(0, 7)) {
                    // If today is on the out of weekDays arange
                    if (
                        weekDays[0].substring(8, 10) > today.substring(8, 10) ||
                        weekDays[weekDays.length - 1].substring(8, 10) < today.substring(8, 10)
                    ) {
                        dayForScroll = weekDays[0]
                    } else {
                        // If today is in the weekDays arange
                        for (const day of weekDays) {
                            if (day.substring(8, 10) > today.substring(8, 10)) {
                                dayForScroll = day
                                break
                            }
                        }
                    }
                } else {
                    // If today and weekDays are on the different year/month
                    dayForScroll = weekDays[0]
                }
            } else {
                dayForScroll = today
            }
            return dayForScroll
        },
    },
    computed: {
        temporary() {
            if (this.$breadcrumbs[0]) {
                return this.$breadcrumbs[0].meta.type !== 'wplanner'
            }
            return undefined
        },
    },
}
</script>
