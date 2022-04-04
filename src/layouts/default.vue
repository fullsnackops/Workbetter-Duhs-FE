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
        <router-view />
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'default',
    computed: {
        ...mapGetters(['darkMode', 'collapseSidebar', 'boxLayout', 'rtlLayout']),
    },
}
</script>
