/**
 * Auth Module
 */
import Nprogress from 'nprogress'
import VueNotifications from 'vue-notifications'
import { call } from '@/helpers/api'
import router from '@/router'

function getFreshState() {
    return {
        importResult: null,
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
}

// actions
const actions = {
    async importEvents(context) {
        try {
            if (ustate('import')) {
                return
            }

            ustate('import', 1)
            Nprogress.start()
            const res = await call('/calendar/import')
            context.commit('onImportCompleted', !!(res && !res.errorType))
            ustate('import', 2)
        } catch (e) {
            VueNotifications.error({
                message: e.message || e || 'Unexpected error',
            })
            console.error(e)
            context.commit('onImportCompleted', false)
            ustate('import', 0)
        }
        Nprogress.done()
        router.push('/')
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
}

export default {
    state,
    getters,
    actions,
    mutations,
}
