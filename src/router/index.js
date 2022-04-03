import Vue from 'vue'
import Router from 'vue-router'

// routes
import routes from './routes'

// Session Components
const SignUp = () => import('@/pages/session/SignUp')
const Login = () => import('@/pages/session/Login')
const NotFound = () => import('@/pages/NotFound')

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        routes,
        {
            path: '/session/sign-up',
            component: SignUp,
            meta: {
                title: 'message.signUp',
                breadcrumb: 'Session / Sign Up',
            },
        },
        {
            path: '/session/login',
            component: Login,
            meta: {
                title: 'message.login',
                breadcrumb: 'Session / Login',
            },
        },
        {
            path: '*',
            component: NotFound,
            meta: {
                title: 'message.pageNotFound',
                breadcrumb: 'Page Not Found',
            },
        },
    ],
})
