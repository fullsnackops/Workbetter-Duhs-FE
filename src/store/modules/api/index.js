/**
 * Auth Module
 */
import Nprogress from 'nprogress'
import VueNotifications from 'vue-notifications'
import { call } from '@/helpers/api'
import router from '@/router'

// Import recap dummy data
import { recap } from './recap'

function getFreshState() {
    return {
        importResult: null,
        recap: recap,
        settings: {
            notifications: {
                email_wanalyzer: false,
                email_wplanner: false,
                email_manalyzer: false,
            },
        },
    }
}

const state = getFreshState()
let _unobservableState = {}

function refreshUnobservableState() {
    _unobservableState = {}
}

function ustate(key, value) {
    if (value === undefined) {
        return _unobservableState[key]
    }
    _unobservableState[key] = value
}

// getters
const getters = {
    importResult: state => {
        return state.importResult
    },
    recap: state => {
        return state.recap
    },
    settings: state => {
        return state.settings
    },
}

// actions
const actions = {
    async importEvents(context) {
        try {
            if (ustate('import')) {
                return
            }

            ustate('import', 1)
            const res = await call('/calendar/import')
            context.commit('onImportCompleted', !!(res && !res.errors))
            ustate('import', 2)
        } catch (e) {
            VueNotifications.error({
                message: e.message || e || 'Unexpected error',
            })
            console.error(e)
            context.commit('onImportCompleted', false)
            ustate('import', 0)
        }
        router.push('/')
    },
    async loadRecap(context, offset) {
        try {
            // call get recap api for offset ${offset}
            // once fetched recap data, call mutation
            setTimeout(() => {
                Nprogress.start()
            }, 1500)
        } catch (e) {
            // process error
        }
        Nprogress.done()
    },
    async getSettings(context) {
        try {
            // call get user settings api
            // once fetched settings data, call mutation
            setTimeout(() => {
                Nprogress.start()
            }, 1500)
        } catch (e) {
            // process error
        }
        Nprogress.done()
    },
    async setSettings(context, settings) {
        try {
            // call set user settings api
            // once saved settings data, call mutation
            setTimeout(() => {
                Nprogress.start()
            }, 1500)
            context.commit('settingsLoaded', settings)
        } catch (e) {
            // process error
        }
        Nprogress.done()
    },
}

// mutations
const mutations = {
    onImportCompleted(state, result) {
        state.importResult = result
    },
    logoutUser(state) {
        const fresh = getFreshState()
        for (const k of Object.keys(fresh)) {
            state[k] = fresh[k]
        }
        refreshUnobservableState()
    },
    settingsLoaded(state, value) {
        state.settings = value
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}
