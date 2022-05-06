<template>
    <div class="week-look-ahead-view">
        <app-section-loader :status="loader"></app-section-loader>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <v-flex xs12 py-0>
                    <skeleton-list :data="events" :repeat="15" :enable-animation="true" />
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import { config } from '@/components/Calendar/CalendarConfig'

export default {
    name: 'WeekLookAheadView',
    props: ['events'],
    data() {
        return {
            loader: false,
            config,
        }
    },
}
</script>

<style lang="scss" scoped>
.legend-container {
    display: flex;
    flex-direction: column;
    justify-content: center;

    & > div {
        display: flex;
        align-items: center;

        .v-badge {
            padding: 0;
            height: 12px;
            width: 12px;
            @include border-radius(50%);
        }
    }
}
</style>
