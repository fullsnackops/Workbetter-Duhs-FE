// Session Components
const SignUp = () => import('@/pages/session/SignUp')
const Login = () => import('@/pages/session/Login')

// Weekly Components
const WeeklyAnalyzer = () => import('@/pages/weekly/Analyzer')
const WeeklyPlanner = () => import('@/pages/weekly/Planner')

// Monthly Components
const MonthlyAnalyzer = () => import('@/pages/monthly/Analyzer')

// Other
const NotFound = () => import('@/pages/NotFound')

export default [
    {
        path: '/',
        name: 'home',
        redirect: '/weekly/analyzer',
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

    // Weekly Dashboards
    {
        path: '/weekly/analyzer',
        alias: ['/', '/settings'],
        name: 'weekly-analyzer',
        component: WeeklyAnalyzer,
        meta: {
            requiresAuth: true,
            title: 'message.weeklyAnalyzer',
            page: 'weekly-analyzer',
            type: 'wanalyzer',
            breadcrumb: 'W Dashboards / Weekly Analyzer',
            layout: 'default',
        },
    },
    {
        path: '/weekly/planner',
        name: 'weekly-planner',
        component: WeeklyPlanner,
        meta: {
            requiresAuth: true,
            title: 'message.weeklyPlanner',
            page: 'weekly-planner',
            type: 'wplanner',
            breadcrumb: 'W Dashboards / Weekly Planner',
            layout: 'default',
        },
    },

    // Monthly Dashboards
    {
        path: '/monthly/analyzer',
        name: 'monthly-analyzer',
        component: MonthlyAnalyzer,
        meta: {
            requiresAuth: true,
            title: 'message.monthlyAnalyzer',
            page: 'monthly-analyzer',
            type: 'manalyzer',
            breadcrumb: 'M Dashboards / Monthly Analyzer',
            layout: 'default',
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
