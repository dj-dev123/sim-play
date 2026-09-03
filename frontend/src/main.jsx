import './index.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import App from './App';

const root = createRoot(document.getElementById('app'));

root.render(
    <BrowserRouter>
        <AuthProvider>
            <App />
            <Toaster />
        </AuthProvider>
    </BrowserRouter>,
);
