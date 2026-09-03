import { useAuth } from '@/context/AuthContext';
import { usePageTitle } from '@/hooks/use-page-title';

export default function Dashboard() {
    usePageTitle('Admin Dashboard');
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome, {user?.firstname}
                </h1>
                <p className="mt-2 text-gray-600">Admin dashboard.</p>
            </div>
        </div>
    );
}
