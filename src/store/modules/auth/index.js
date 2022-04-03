/**
 * Auth Module
 */

import router from '../../../router'

const state = {
    user: localStorage.getItem('userId'),
}

// getters
const getters = {
    getUser: state => {
        return state.user
    },
}

// actions
const actions = {
    signinUser(context) {
        context.commit('signinUserSuccess', { userId: 111 })
    },
    signoutUser(context) {
        context.commit('signoutUserSuccess')
    },
}

// mutations
const mutations = {
    signinUserSuccess(state, user) {
        localStorage.setItem('userId', JSON.stringify(user))
        state.user = user
        router.push('/main/analytics-meeting/')
    },
    signoutUserSuccess(state) {
        state.user = null
        localStorage.removeItem('userId')
        router.push('/session/login')
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}
