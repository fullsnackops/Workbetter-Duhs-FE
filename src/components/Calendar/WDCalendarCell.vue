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
                is_tentative: isCategory('tentative', aIndex),
                is_non_working: isCategory('non-working', aIndex),
            }"
            :style="appointmentStyle(aIndex)"
        >
            <portal-target
                name="calendar-card-details"
                :slot-props="appointment"
                v-if="appointment.data"
            ></portal-target>
        </div>
    </div>
</template>

<script>
import isSameDay from 'date-fns/is_same_day'
import orderBy from 'lodash/orderBy'
import indexOf from 'lodash/indexOf'
export default {
    props: ['cellData'],
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
        dayTentatives() {
            const { cellData } = this
            const { existing_appointments: appointments } = this.calendarOptions
            return orderBy(
                appointments.filter(
                    appointment =>
                        appointment.data.category === 'tentative' && isSameDay(appointment.data.from, cellData.value)
                ),
                ['start']
            )
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
            let left = 0
            let right = 1
            let width = 100
            let height = this.distance(index)
            if (this.isCategory('tentative', index)) {
                const { dayTentatives, cellAppointments } = this
                let tCount = dayTentatives.length
                let tIndex = indexOf(dayTentatives, cellAppointments[index])
                left = (tIndex * 100) / tCount
                right = ((tCount - tIndex - 1) * 100) / tCount
                width = 100 / tCount
            }
            return {
                left: left + '%',
                right: right + '%',
                width: width + '%',
                height: height + 'px',
            }
        },
    },
}
</script>

<style lang="scss">
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
$meeting-color: rgba(
    $color: $meeting-color,
    $alpha: $alpha,
);
$tentative-color: transparent;
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
            h4,
            p,
            span {
                margin: 0;
            }
            h4 {
                padding: 5px;
                font-size: 0.75rem;
                font-weight: $font-weight-bold;
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

        &.is_meeting .existing-event {
            background: $meeting-color;
            opacity: 1;
            color: white;
            @include border(1px solid, $border-color, bottom);
        }
        &.is_focus .existing-event {
            background: $focus-color url('/static/logos/logo-white.png') no-repeat;
            background-size: 34px 34px;
            background-position: center;
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
                @include border(1px solid, $border-color, top bottom);
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
