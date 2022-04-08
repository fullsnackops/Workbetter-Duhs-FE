<template>
    <v-app
        :dark="darkMode"
        id="inspire"
        :class="[
            {
                'box-layout': boxLayout,
                'collapse-sidebar': collapseSidebar,
                'rtl-layout': rtlLayout,
            },
        ]"
    >
        <div class="app-default-layout">
            <template v-if="!user">
                <rotate-square2></rotate-square2>
            </template>
            <template v-else-if="user">
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
    </v-app>
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
        ...mapGetters(['darkMode', 'collapseSidebar', 'boxLayout', 'rtlLayout', 'selectedRouterAnimation', 'user']),
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
