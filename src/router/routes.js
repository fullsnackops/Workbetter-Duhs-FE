// Session Components
const SignUp = () => import('@/pages/session/SignUp')
const Login = () => import('@/pages/session/Login')

// Reports Components
const AnalyticsMeeting = () => import('@/pages/main/AnalyticsMeeting')

// Other
const NotFound = () => import('@/pages/NotFound')

export default [
    {
        path: '/',
        name: 'home',
        redirect: '/main/analytics-meeting',
    },

    // Session
    {
        path: '/session/sign-up',
        component: SignUp,
        meta: {
            title: 'message.signUp',
            breadcrumb: 'Session / Sign Up',
            layout: 'preauth',
        },
    },
    {
        path: '/session/login',
        name: 'login',
        component: Login,
        meta: {
            title: 'message.login',
            breadcrumb: 'Session / Login',
            layout: 'preauth',
        },
    },

    // Analytics Meeting
    {
        path: '/main/analytics-meeting',
        name: 'analytics-meeting',
        component: AnalyticsMeeting,
        meta: {
            requiresAuth: true,
            title: 'message.analyticsmeeting',
            page: 'analytics-meeting',
            type: 'meeting',
            breadcrumb: 'Analytics / Meeting',
            layout: 'preauth',
        },
    },

    // 404
    {
        path: '*',
        component: NotFound,
        meta: {
            title: 'Page Not Found',
            breadcrumb: 'Page Not Found',
        },
    },
]
