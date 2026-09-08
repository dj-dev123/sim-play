import { Link } from 'react-router-dom';
import { paths } from '@/routes';
import { usePageTitle } from '@/hooks/use-page-title';

export default function Welcome() {
    usePageTitle('Welcome');

    return (
        <div className="min-h-screen bg-[#96b190] text-gray-800 flex items-center justify-center px-4 sm:px-6 md:px-8 py-10">
            <div className="
                w-full
                max-w-md
                sm:max-w-lg
                md:max-w-xl
                text-center
            ">
                <img
                    src="/images/primath.png"
                    alt="PriMath"
                    className="
                        mx-auto
                        h-20
                        sm:h-24
                        md:h-28
                        object-contain
                        drop-shadow-md
                    "
                />

                {/* Login Button */}
                <div className="mt-10 sm:mt-12">
                    <Link
                        to={paths.login}
                        className="
                            inline-block
                            rounded-xl
                            bg-green-600
                            px-6 sm:px-8 md:px-10
                            py-2 sm:py-3 md:py-4
                            text-sm
                            sm:text-base
                            md:text-lg
                            lg:text-xl
                            font-semibold
                            text-white
                            shadow
                            hover:bg-green-700
                            transition-colors
                        "
                    >
                        Log in to Start
                    </Link>
                </div>

                {/* Credits */}
                <div className="mt-16 sm:mt-20">
                    <p className="
                        font-bold
                        text-lg
                        sm:text-sm
                        md:text-base
                        lg:text-lg
                        text-orange-500 text-outline-white
                    ">
                        ROWENA B. RESPOSO
                    </p>
                    <p className="
                    font-bold
                        text-xl
                        sm:text-sm
                        md:text-base
                        lg:text-lg
                        text-black
                    ">
                        Master Teacher II
                    </p>
                </div>
            </div>
        </div>
    );
}
