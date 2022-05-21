<template>
    <v-menu
        bottom
        offset-y
        right
        content-class="calendar-action-dropdown"
        nudge-top="-10"
        nudge-right="0"
        transition="slide-y-transition"
    >
        <v-btn dark small icon slot="activator" class="ma-0">
            <v-icon small>more_vert</v-icon>
        </v-btn>
        <div class="dropdown-content">
            <div class="dropdown-top white--text primary">
                <span class="white--text fs-14 fw-bold d-block">
                    {{ eventData.title }}
                    <span class="fs-12 fw-light" v-if="eventData.isRecurring">(Recurring)</span>
                </span>
            </div>
            <v-list class="dropdown-list">
                <template v-for="(action, index) in actionTypes">
                    <v-list-tile @click="setEvent(action.type)" :key="index" ripple>
                        <v-list-tile-action>
                            <v-icon v-if="action.isActive" color="secondary">done</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <span>{{ action.title }}</span>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </div>
        <!-- Confirm Modal -->
        <calendar-action-confirm
            ref="calendarActionConfirmModal"
            :appointment="appointment"
            :actionType="selectedAction"
        ></calendar-action-confirm>
    </v-menu>
</template>

<script>
import CalendarActionConfirm from './CalendarActionConfirm'

export default {
    components: {
        CalendarActionConfirm,
    },
    props: ['appointment'],
    data() {
        return {
            actionTypes: [
                {
                    type: 'meeting',
                    title: 'Consider this Meeting Time',
                    isActive: this.appointment.data.category === 'meeting',
                },
                {
                    type: 'no-meeting',
                    title: 'Do not consider this Meeting Time',
                    isActive: this.appointment.data.category === 'tentative',
                },
                {
                    type: 'non-working',
                    title: 'Consider this non-working Time',
                    isActive: this.appointment.data.category === 'ooo',
                },
                {
                    type: 'ignore',
                    title: 'Ignore this Event',
                    isActive: false,
                },
            ],
            selectedAction: '',
        }
    },
    methods: {
        openConfirmModal() {
            this.$refs.calendarActionConfirmModal.open()
        },
        setEvent(type) {
            console.log(type)
            this.selectedAction = type
            // open confirm modal for the recurring event only
            if (this.eventData.isRecurring) {
                this.openConfirmModal()
            } else {
                // save event settings here
            }
        },
    },
    computed: {
        eventData: function() {
            return this.appointment.data
        },
    },
}
</script>

<style lang="scss" scoped>
.calendar-action-dropdown {
    background-color: $base-light;
    .dropdown-content {
        //width: 225px;
        .dropdown-top {
            padding: 1rem 1.25rem;
        }
        .dropdown-list {
            background: transparent;
            > div {
                box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.11);
                margin: 0.3125rem;
                .v-list__tile {
                    background-color: $light;
                    span {
                        font-size: $font-size-sm;
                        transition: color 0.3s ease;
                    }
                    &:hover {
                        span {
                            color: $primary !important;
                        }
                        background-color: $light !important;
                    }
                    .v-list__tile__action {
                        min-width: 40px;
                    }
                }
            }
        }
    }
}
</style>
