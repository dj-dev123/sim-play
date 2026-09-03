import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';

import Welcome from '@/pages/Welcome';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import ResetPassword from '@/pages/Auth/ResetPassword';
import ConfirmPassword from '@/pages/Auth/ConfirmPassword';
import VerifyEmail from '@/pages/Auth/VerifyEmail';

import ProfileEdit from '@/pages/Profile/Edit';

import AdminDashboard from '@/pages/Admin/Dashboard';

import TeacherDashboard from '@/pages/Teacher/Dashboard';
import TeacherClasses from '@/pages/Teacher/Classes';
import TeacherActivities from '@/pages/Teacher/Activities';
import TeacherListOfActivities from '@/pages/Teacher/ListOfActivities';
import TeacherActivityRecords from '@/pages/Teacher/ActivityRecords';

import StudentDashboard from '@/pages/Student/Dashboard';
import StudentGuide from '@/pages/Student/Guide';
import StudentActivities from '@/pages/Student/Activities';
import StudentSelectedActivity from '@/pages/Student/SelectedActivity';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route
                path="/confirm-password"
                element={
                    <ProtectedRoute>
                        <ConfirmPassword />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/verify-email"
                element={
                    <ProtectedRoute>
                        <VerifyEmail />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfileEdit />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute role="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/teacher"
                element={
                    <ProtectedRoute role="teacher">
                        <TeacherDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teacher/classes"
                element={
                    <ProtectedRoute role="teacher">
                        <TeacherClasses />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teacher/activities"
                element={
                    <ProtectedRoute role="teacher">
                        <TeacherActivities />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teacher/activities/class/:classId"
                element={
                    <ProtectedRoute role="teacher">
                        <TeacherListOfActivities />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teacher/activities/:activityId/records"
                element={
                    <ProtectedRoute role="teacher">
                        <TeacherActivityRecords />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student"
                element={
                    <ProtectedRoute role="student">
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/guide"
                element={
                    <ProtectedRoute role="student">
                        <StudentGuide />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/activities"
                element={
                    <ProtectedRoute role="student">
                        <StudentActivities />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/activities/:id"
                element={
                    <ProtectedRoute role="student">
                        <StudentSelectedActivity />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
