import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex flex-col items-center pt-6 sm:justify-center sm:pt-0 px-4">

            <div className="
                mt-6 
                w-full
                px-6 py-6 
                shadow-md
                sm:rounded-lg 
                md:rounded-2xl 
                lg:rounded-3xl
                sm:max-w-full 
                md:max-w-full 
                lg:max-w-full
            ">
                {children}
            </div>
        </div>
    );
}
