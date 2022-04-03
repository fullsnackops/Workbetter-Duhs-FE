/**
 * Auth Module
 */
import Nprogress from 'nprogress'
import VueNotifications from 'vue-notifications'
import router from '@/router'
import { store } from '../../store'
import { subscribe, signOut, signUp } from '@/helpers/authenticator'

const state = {
    user: null,
    token: null,
    signupResult: null,
    writeAccessRequired: false,
    loginError: null,
    doRedirect: false,
}

subscribe((err, session) => {
    if (err) return store.commit('onLoginError', err)
    store.commit('onSessionUpdate', session)
    store.commit('doRedirect', false)
    const { user } = session || {}
    if (user && !store.getters.userProps) {
        store.dispatch('loadUserProps')
    }
})

// getters
const getters = {
    user: state => {
        return state.user
    },
    token: state => {
        return state.token
    },
    signupResult: state => {
        return state.signupResult
    },
    writeAccessRequired: state => {
        return state.writeAccessRequired
    },
    loginError: state => {
        return state.loginError
    },
    doRedirect: state => {
        return state.doRedirect
    },
}

// actions
const actions = {
    async signupUser(context, code) {
        Nprogress.start()
        try {
            const username = await signUp(code)
            context.commit('onSignupCompleted', username)
            context.commit('writeAccessRequired', false)
            context.commit('onLoginError', null)
        } catch (e) {
            VueNotifications.error({
                message: e.message || e.error || e || 'Unexpected error',
            })
            console.error(e)
            context.commit('onSignupCompleted', false)
        }
        Nprogress.done()
    },
    async logoutUser(context) {
        Nprogress.start()
        try {
            const { user } = context.state
            await signOut()
            context.commit('logoutUser', user)
            router.push('/session/login')
        } catch (e) {
            VueNotifications.error({
                message: e.message || e.error || e || 'Unexpected error',
            })
            console.error(e)
        }
        Nprogress.done()
    },
}

// mutations
const mutations = {
    logoutUser(state) {
        state.user = null
        state.token = null
        state.signupResult = null
    },
    onSessionUpdate(state, session) {
        if (!session) return
        state.token = session.token
        state.user = session.user
        const { IntercomPromise } = window
        if (IntercomPromise) {
            IntercomPromise.then(() =>
                window.Intercom('update', {
                    email: state.user.email,
                    user_id: state.user.username,
                    name: state.user.name,
                })
            )
        }
        Nprogress.doneAll()
        state.doRedirect && router.push(router.currentRoute.query.redirect || '/')
    },
    onSignupCompleted(state, username) {
        state.signupResult = !!username
    },
    writeAccessRequired(state, val) {
        state.writeAccessRequired = !!val
    },
    onLoginError(state, err) {
        state.loginError = err
    },
    doRedirect(state, val) {
        state.doRedirect = val
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}
