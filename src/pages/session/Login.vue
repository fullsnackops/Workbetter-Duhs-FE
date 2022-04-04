<template>
    <div>
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
    </div>
</template>

<script>
import AppConfig from '@/constants/AppConfig'
import SocialButtons from '@/components/SocialButtons'
import { mapGetters } from 'vuex'

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
            this.$authenticator.googleSignIn()
            this.$store.commit('doRedirect', true)
            this.$store.commit('onLoginError', null)
        },
    },
    computed: {
        ...mapGetters(['loginError']),
    },
}
</script>

<style lang="scss" scoped>
.signup {
    color: pink;
}
</style>
