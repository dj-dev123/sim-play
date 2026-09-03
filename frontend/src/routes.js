// Frontend (react-router) paths. Centralized so links stay consistent
// without shipping Laravel's route list to a public frontend (as Ziggy did).
export const paths = {
    home: '/',
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: (token) => `/reset-password/${token}`,
    confirmPassword: '/confirm-password',
    verifyEmail: '/verify-email',
    profile: '/profile',

    admin: '/admin',

    teacher: '/teacher',
    teacherClasses: '/teacher/classes',
    teacherActivities: '/teacher/activities',
    teacherActivitiesForClass: (classId) => `/teacher/activities/class/${classId}`,
    teacherActivityRecords: (activityId) => `/teacher/activities/${activityId}/records`,

    student: '/student',
    studentGuide: '/student/guide',
    studentActivities: '/student/activities',
    studentActivity: (id) => `/student/activities/${id}`,
};
