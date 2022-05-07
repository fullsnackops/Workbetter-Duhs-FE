<template>
    <div>
        Workbetter-Duhs Calendar
    </div>
</template>

<script>
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
}
</script>
