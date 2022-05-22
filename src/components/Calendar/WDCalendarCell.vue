<template>
    <div class="mf-calendar-cell">
        <div
            class="calendar-cell"
            :class="{
                'is-an-hour': (cellData.index + 1) % (60 / calendarOptions.split_value) === 0,
            }"
            :style="`height: ${calendarOptions.cell_height}px`"
        ></div>
        <div
            v-for="(appointment, aIndex) in cellAppointments"
            :key="`appointment-${appointment.id}`"
            class="cell_content_block"
            :class="{
                is_meeting: isCategory('meeting', aIndex),
                is_transition: isCategory('transition', aIndex),
                is_focus: isCategory('focus', aIndex),
                is_ooo: isCategory('ooo', aIndex),
                is_tentative: isCategory('tentative', aIndex),
                is_non_working: isCategory('non-working', aIndex),
            }"
            :style="appointmentStyle(aIndex)"
        >
            <div v-if="appointment.data" class="existing-event">
                <template
                    v-if="
                        appointment.data.category === 'meeting' ||
                            appointment.data.category === 'ooo' ||
                            appointment.data.category === 'tentative'
                    "
                >
                    <cell-title :appointment="appointment" :style="appointmentTitleStyle(aIndex)" />
                    <small v-if="calendarOptions.show_description && appointment.end - appointment.start > 2">
                        {{ appointment.data.description }}
                    </small>
                    <span class="time" v-if="calendarOptions.show_hours">
                        {{ appointment.data.from | normalizeDate('hh:mm A') }} -
                        {{ appointment.data.to | normalizeDate('hh:mm A') }}
                    </span>
                    <div class="buttons" v-if="false && appointment.data.category === 'meeting'">
                        <v-btn flat icon small><v-icon class="font-sm" color="primary">group</v-icon></v-btn>
                        <v-btn flat icon small><v-icon class="font-sm" color="primary">videocam</v-icon></v-btn>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import isSameDay from 'date-fns/is_same_day'
import CalendarActions from './CalendarActions'
import CellTitle from './MFCalendarCellTitle'
export default {
    components: {
        CalendarActions,
        CellTitle,
    },
    props: ['cellData', 'dayTentatives'],
    inject: ['calendarOptions'],
    computed: {
        cellAppointments() {
            const { cellData } = this
            const { existing_appointments: appointments } = this.calendarOptions
            return appointments
                .filter(
                    appointment =>
                        appointment.start === cellData.index && isSameDay(appointment.data.from, cellData.value)
                )
                .map(appointment => appointment)
        },
    },
    methods: {
        isCategory(category, index) {
            const { cellAppointments } = this
            return cellAppointments[index] && cellAppointments[index].data.category === category
        },
        distance(index) {
            const { cellAppointments } = this
            if (!cellAppointments[index]) {
                return false
            }
            const { cell_height: cellHeight } = this.calendarOptions
            return (cellAppointments[index].end - cellAppointments[index].start + 1) * cellHeight
        },
        appointmentStyle(index) {
            let left = '0%'
            let right = '1px'
            let height = this.distance(index) + 'px'
            if (this.isCategory('tentative', index)) {
                const { dayTentatives, cellAppointments } = this
                const appointment = cellAppointments[index]
                let tCount = dayTentatives.length
                let tIndex = dayTentatives.reduce(
                    (tNum, tentatives, hIndex) => {
                        if (tentatives.includes(appointment)) {
                            tNum = { h: hIndex, v: tentatives.indexOf(appointment) }
                        }
                        return tNum
                    },
                    { h: 0, v: 0 }
                )
                if (tCount < 2) tCount = 2
                left = `${100 - ((tIndex.h + 1) * 100) / tCount}%`
                right = `${(tIndex.h * 100) / tCount}%`
            }
            return {
                left,
                right,
                height,
            }
        },
        appointmentTitleStyle(index) {
            let width = '100%'
            const { dayTentatives, cellAppointments } = this
            const appointment = cellAppointments[index]
            let tCount = dayTentatives.length
            if (tCount < 2) tCount = 2
            let overlappings = 0
            if (this.isCategory('meeting', index) || this.isCategory('ooo', index)) {
                for (const tentatives of dayTentatives) {
                    for (const tentative of tentatives) {
                        if (tentative.start < appointment.start && tentative.end > appointment.start) {
                            overlappings = overlappings + 1
                        }
                    }
                }
            }
            width = `${100 - (overlappings * 100) / tCount}%`
            return {
                width,
            }
        },
    },
}
</script>

<style lang="scss" scoped>
$alpha: 0.75;
$meeting-color: rgba(
    $color: $meeting-color,
    $alpha: $alpha,
);
$transition-color: rgba(
    $color: $transition-color,
    $alpha: $alpha,
);
$focus-color: rgba(
    $color: $focus-color,
    $alpha: $alpha,
);
$ooo-color: rgba(
    $color: $gray-dark,
    $alpha: $alpha,
);
$meeting-color: rgba(
    $color: $meeting-color,
    $alpha: $alpha,
);
$tentative-color: rgba(0, 0, 0, 0.05);
$non-working-color: darken(
    $color: $transition-color,
    $amount: 20%,
);

.mf-calendar-cell {
    position: relative;

    .calendar-cell {
        border-right: solid 1px $border-color;
        z-index: 0;
        &.is-an-hour {
            border-bottom: solid 1px $border-color;
        }
    }

    .cell_content_block {
        position: absolute;
        top: 0;
        left: 0;
        right: 1px;
        z-index: 1;
        opacity: 1;
        // pointer-events: none;
        user-select: none;
        will-change: height; //padding: 4px 6px;

        .existing-event {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            cursor: default;
            word-break: break-word;
            font-size: $font-size-sm;
            background-color: #bfecff;
            opacity: 1;
            color: #1f6570;
            p,
            span {
                margin: 0;
            }
            .buttons {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                position: absolute;
                bottom: 0;
                left: 6px;
                button {
                    margin: 0;
                    width: 20px;
                    height: 20px;
                }
            }
            .time {
                position: absolute;
                bottom: 4px;
                right: 6px;
                font-size: 11px;
            }
        }

        &.is_meeting {
            .existing-event {
                color: white;
                background: $meeting-color;
                opacity: 1;
                cursor: pointer;
                @include border(1px solid, $border-color, bottom);
                &:hover {
                    background: darken($color: $meeting-color, $amount: 10%);
                }
            }
        }
        &.is_focus .existing-event {
            background: $focus-color url('/static/logos/logo-white.png') no-repeat;
            background-size: 34px 34px;
            background-position: center;
        }
        &.is_ooo {
            .existing-event {
                color: white;
                background: $ooo-color;
                opacity: 1;
                cursor: pointer;
                @include border(1px solid, $border-color, bottom);
                &:hover {
                    background: darken($color: $ooo-color, $amount: 10%);
                }
            }
        }
        &.is_transition .existing-event {
            background: $transition-color;
            opacity: 1;
        }
        &.is_tentative {
            z-index: 5;
            .existing-event {
                color: white;
                background-color: $tentative-color;
                cursor: pointer;
                @include border(1px solid, $border-color, top left right bottom);
                &:hover {
                    background: rgba(0, 0, 0, 0.35);
                }
                h4 {
                    font-weight: $font-weight-semi-bold;
                }
            }
        }
        &.is_non_working .existing-event {
            background-color: lighten($color: $non-working-color, $amount: 20%);
            border-left: solid 3px $non-working-color;
            color: darken($color: $non-working-color, $amount: 10%);
        }
    }
}
</style>
