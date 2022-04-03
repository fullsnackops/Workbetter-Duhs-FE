<!-- App Main Structure -->
<template>
    <div id="app" class="app-default-layout">
        <template v-if="!getUser">
            <rotate-square2></rotate-square2>
        </template>
        <template v-else-if="getUser">
            <!-- App Header -->
            <app-header></app-header>
            <!-- App Main Content -->
            <v-content>
                <!-- App Router -->
                <transition name="router-anim" :enter-active-class="`animated ${selectedRouterAnimation}`">
                    <router-view></router-view>
                </transition>
            </v-content>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Header from '@/components/Header/Header.vue'

export default {
    name: 'default',
    components: {
        appHeader: Header,
    },
    computed: {
        ...mapGetters(['selectedRouterAnimation', 'getUser']),
    },
}
</script>

<style lang="scss" scoped>
.app-default-layout {
    height: 100vh;

    .spinner:after {
        background: $secondary;
    }
}
</style>
