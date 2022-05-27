<template>
    <div>
        <v-navigation-drawer app clipped v-model="toggle" :width="350" right :temporary="temporary">
            <v-toolbar color="primary" dark>
                <v-toolbar-side-icon icon @click="toggleSidebar"></v-toolbar-side-icon>
                <v-toolbar-title>
                    {{ $t('message.calendarEvents') }}
                </v-toolbar-title>
            </v-toolbar>
        </v-navigation-drawer>

        <div class="right-sidebar">
            <a class="customizer-toggle primary v-step-3" href="javascript:;" @click="toggleSidebar">
                <i class="zmdi ti-menu font-lg"></i>
            </a>
        </div>
    </div>
</template>

<script>
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
