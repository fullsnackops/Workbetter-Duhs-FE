<template>
    <v-layout row wrap mx-auto class="login-button-container">
        <v-flex xs12 mx-auto my-2>
            <v-img
                src="/static/img/btn_google_signin.png"
                srcset="/static/img/btn_google_signin.png 1x, /static/img/btn_google_signin@2x.png 2x"
                @click="google()"
                :contain="true"
                position="center"
                max-height="42"
            />
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    props: {
        googleCallback: {
            type: Function,
            default: () => {},
        },
    },
    data() {
        return {
            googleEnabled: false,
        }
    },
    methods: {
        google() {
            this.googleCallback && this.googleCallback()
        },
    },
}
</script>

<style lang="scss" scoped>
.login-button-container {
    max-width: 500px;

    .v-image {
        cursor: pointer;
        width: 200px;
    }
}
</style>
