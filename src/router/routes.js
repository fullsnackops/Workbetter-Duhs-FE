import defaultContainer from '@/container/default'

// Reports Components
const AnalyticsMeeting = () => import('@/pages/main/AnalyticsMeeting')

export default {
    path: '/',
    component: defaultContainer,
    redirect: '/main/analytics-meeting',
    children: [
        {
            path: '/main/analytics-meeting',
            name: 'analytics-meeting',
            component: AnalyticsMeeting,
            meta: {
                requiresAuth: true,
                title: 'message.analyticsmeeting',
                breadcrumb: 'Analytics / Meeting',
            },
        },
    ],
}
