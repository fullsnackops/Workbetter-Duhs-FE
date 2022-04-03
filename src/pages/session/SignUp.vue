<template>
    <v-layout align-start justify-center fill-height class="session-container">
        <v-flex md6 text-center>
            <template v-if="step === 1">
                <v-flex xs12 sm6 offset-sm3>
                    <img :src="appLogo" class="img-responsive mb-3" />
                </v-flex>
                <h2 class="my-3">{{ $t('message.signupToDashboard') }}</h2>
                <social-buttons v-bind="{ googleCallback }" />
                <p class="fs-14 my-3">
                    {{ $t('message.havingAnAccount') }}
                    <router-link to="/session/login">
                        <h5 class="login">{{ $t('message.login') }}</h5>
                    </router-link>
                </p>
            </template>
            <template v-else-if="step === 2">
                registering
            </template>
            <template v-else-if="step === 3">
                importing events
            </template>
        </v-flex>
    </v-layout>
</template>

<script>
import SocialButtons from '@/components/SocialButtons'
import AppConfig from '@/constants/AppConfig'

export default {
    components: {
        SocialButtons,
    },
    data() {
        return {
            valid: false,
            appLogo: AppConfig.appLogo2,
            brand: AppConfig.brand,
            termsLink: AppConfig.termsLink,
            policyLink: AppConfig.policyLink,
            step: 1,
        }
    },
    methods: {
        googleCallback() {
            this.$store.dispatch('signinUser')
        },
    },
}
</script>

<style lang="scss" scoped>
.login {
    color: pink;
}
</style>
