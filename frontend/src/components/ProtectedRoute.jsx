import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { paths } from '@/routes';

export default function ProtectedRoute({ role, children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to={paths.login} replace />;
    }

    if (role && !user.roles?.some((r) => r.name === role)) {
        return <Navigate to={paths.home} replace />;
    }

    return children;
}
