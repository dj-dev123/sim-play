import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />

            <div className="min-h-screen bg-[#96b190] text-gray-800 flex flex-col">
                {/* Top Logo Section */}
                <header className="bg-gray-200 shadow-sm">
                    <div className="flex flex-col items-center py-4 sm:py-6 md:py-8">
                        <img
                            src="salindingan_logo.jpg"
                            alt="School Logo"
                            className="
                                h-16 
                                sm:h-32  
                                md:h-48 
                                lg:h-64 
                                xl:h-48
                                mb-3
                                object-contain
                                
                            "
                        />
                    </div>
                </header>

                {/* Center Content */}
                <main className="flex flex-1 items-center justify-center px-4 sm:px-6 md:px-8">
                    <div className="
                        w-full 
                        max-w-md 
                        sm:max-w-lg 
                        md:max-w-xl 
                        lg:max-w-2xl 
                        text-center
                    ">
                        <h2 className="
                            text-2xl 
                            sm:text-3xl 
                            md:text-4xl 
                            lg:text-5xl 
                            font-extrabold 
                            tracking-wide
                        ">
                            COME ON, LET’S{" "}
                            <span className="text-orange-500">PLAY</span>
                        </h2>

                        <p className="
                            mt-4 
                            text-sm 
                            sm:text-base 
                            md:text-lg 
                            lg:text-xl 
                            font-medium
                        ">
                            <span className="text-orange-500">P</span>lan to Solve •{" "}
                            <span className="text-orange-500">L</span>ocate Common
                            Denominator •{" "}
                            <span className="text-orange-500">A</span>dd Numerators •{" "}
                            <span className="text-orange-500">Y</span>ield the Final
                            Result
                        </p>

                        <p className="
                            mt-4 
                            sm:mt-6 
                            text-xs 
                            sm:text-sm 
                            md:text-base 
                            lg:text-lg 
                            uppercase 
                            tracking-wider 
                            text-black
                            font-bold
                        ">
                            A Strategic Intervention Material in Adding Dissimilar
                            Fractions
                        </p>

                        {/* Login / Dashboard Button */}
                        <div className="mt-6 sm:mt-8 md:mt-10">
                            
                                <Link
                                    href={route("login")}
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
                                    "
                                >
                                    Log in to Start
                                </Link>
                            
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-[#96b190] py-3 sm:py-4 md:py-6 text-center">
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
                </footer>
            </div>
        </>
    );
}
