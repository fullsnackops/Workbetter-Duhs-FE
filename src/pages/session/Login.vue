<template>
    <v-layout align-start justify-center fill-height class="session-container">
        <v-flex md6 text-center>
            <v-flex xs12 sm6 offset-sm3>
                <img :src="appLogo" class="img-responsive mb-3" />
            </v-flex>
            <h3 class="my-3">{{ $t('message.loginToDashboard') }}</h3>
            <social-buttons v-bind="{ googleCallback }" />
            <p class="fs-14 my-3">
                {{ $t('message.dontHaveAccount') }}
                <router-link to="/session/sign-up">
                    <h5 class="signup">{{ $t('message.clickHere') }}</h5>
                </router-link>
                {{ $t('message.toCreateOne') }}
            </p>
            <p class="fs-14 my-3" v-if="loginError && loginError.code === 'UserNotFoundException'">
                {{ $t('message.userNotFound') }}
            </p>
        </v-flex>
    </v-layout>
</template>

<script>
import AppConfig from '@/constants/AppConfig'
import SocialButtons from '@/components/SocialButtons'

export default {
    components: {
        SocialButtons,
    },
    data() {
        return {
            appLogo: AppConfig.appLogo2,
            brand: AppConfig.brand,
        }
    },
    methods: {
        googleCallback() {
            this.$store.dispatch('signinUser')
        },
    },
    computed: {
        loginError() {
            return this.$store.getters.loginError
        },
    },
}
</script>

<style lang="scss" scoped>
.session-container {
    padding-top: 10%;
    background: url('/static/img/signup-bg.png') center/cover no-repeat;
    color: #fff;
}
.signup {
    color: pink;
}
</style>
