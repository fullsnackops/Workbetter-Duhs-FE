<template>
  <li :class="{ 'is_meeting': isCategory('meeting'), 'is_transition': isCategory('transition'), 'is_focus': isCategory('focus'), 'is_tentative': isCategory('tentative'), 'is_non_working': isCategory('non-working'), 'inbetween': isInBetween, 'first_of_appointment': cellBlockData.first, 'last_of_appointment': cellBlockData.last, 'is-an-hour': (index+1)%(60/calendarOptions.split_value) === 0}" :style="`height: ${calendarOptions.cell_height}px`">
    <div v-if="cellBlockData && cellBlockData.first" class="cell_content_block" :style="`height: ${distance}px`">
      <portal-target name="calendar-card-details" :slot-props="appointment_props" v-if="appointment_props.data"></portal-target>
    </div>
  </li>
</template>

<script>
export default {
  props: ['creator', 'day', 'index', 'cellData'],
  inject: ['calendarOptions'],
  computed: {
    appointments () {
      return this.calendarOptions.existing_appointments
    },
    distance () {
      if (!this.cellBlockData) {
        return false
      }
      let appointment = this.appointments[this.cellData.appointment_id]
      return ((appointment.end - appointment.start) + 1) * this.calendarOptions.cell_height
    },
    isInBetween () {
      let appointment = this.appointments[this.cellData.appointment_id]
      let { index } = this.cellData
      return appointment && index > appointment['start'] && index < appointment['end']
    },
    cellBlockData () {
      let appoints = this.appointments
      let cDId = this.cellData.appointment_id
      if (!cDId) {
        return false
      }
      return appoints.hasOwnProperty(cDId) && { first: parseInt(appoints[cDId]['start']) === this.cellData.index, last: parseInt(appoints[cDId]['end']) === this.cellData.index }
    },
    status () {
      if (!this.appointment) {
        return
      }
      return this.appointments[this.cellData.appointment_id]['status']
    },
    appointment () {
      return this.appointments[this.cellData.appointment_id]
    },
    appointment_props () {
      if (!this.appointment) {
        return
      }
      /* Prevent cutting previous hours block
      let { start, end } = this.appointment
      let hourStartData = this.day.date_hours[start]
      let hourEndData = this.day.date_hours[end + 1]
      if (!hourEndData) {
        hourEndData = this.day.date_hours[end]
        hourEndData['value'] = new Date(this.day.date)
        hourEndData['value'].setHours(24, 0, 0)
      }
      return { ...this.appointment, 'start_value': hourStartData, 'end_value': hourEndData }
      */
      return this.appointment
    }
  },
  methods: {
    isCategory (category) {
      return this.appointment && this.appointment.data.category === category
    }
  }
}
</script>

<style lang="scss">

$gray-light:#dde2e8 !default;
$focus-color: lighten($color: #e5f5e5, $amount: 2%);

ul.building-blocks {
	li {
    position: relative;
    border-right: solid 1px $border-color;
		z-index: 0;

		&.first_of_appointment {
			z-index: 1;
			opacity: 1;

			&.is-active {
				z-index: 3;
			}		
			&.last_of_appointment  {
				.new-event, .existing-event {
					font-size: 80%;
				}
				.time {
					opacity: 0;
				}
			}

			.cell_content_block {
				display: flex;
				flex-direction: column;
				>* {
					flex: 1;
				}
				position: absolute;
				pointer-events: none;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				width: 100%;
				user-select: none;
				will-change: height; //padding: 4px 6px;
			}
    }
    
    &.is-an-hour {
			border-bottom: solid 1px $border-color;
		}
		
		.cell_content_block {
			display: none;
			h4, p, span {
				margin: 0;
      }
      h4 {
        font-size: 0.75rem;
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
		}
		
		.time {
			position: absolute;
			bottom: 4px;
			right: 6px;
			font-size: 11px;
		}
	}
}
</style>
