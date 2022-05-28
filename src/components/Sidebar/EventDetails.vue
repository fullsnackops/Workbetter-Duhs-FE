<template>
    <vue-perfect-scrollbar class="rightsidebar-scroll-area" id="details-scroll" :settings="settings">
        <div class="inner-toolbar">
            <v-timeline dense clipped align-top class="pt-0"> </v-timeline>
        </div>
    </vue-perfect-scrollbar>
</template>

<script>
export default {
    props: ['events', 'settings'],
}
</script>
