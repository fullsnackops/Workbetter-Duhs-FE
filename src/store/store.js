import Vue from 'vue'
import Vuex from 'vuex'

// modules
import auth from './modules/auth'
import settings from './modules/settings'
import sidebar from './modules/sidebar'

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {
        auth,
        sidebar,
        settings,
    },
})
