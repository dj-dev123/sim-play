import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Lock, Smile } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="min-h-screen flex items-center justify-center bg-[#96b190] px-4">
                <div className="
                    w-full 
                    max-w-sm 
                    sm:max-w-md 
                    md:max-w-lg 
                    bg-white 
                    rounded-3xl 
                    shadow-xl 
                    p-6 
                    sm:p-8 
                    md:p-10
                ">
                    {/* Title */}
                    <div className="text-center mb-6">
                        <div className="flex justify-center mb-2">
                            <Smile className="h-10 w-10 sm:h-12 sm:w-12 text-orange-500" />
                        </div>
                        <h2 className="
                            text-2xl 
                            sm:text-3xl 
                            md:text-4xl 
                            font-extrabold 
                            text-green-700
                        ">
                            Welcome Back!
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600">
                            Let’s start learning 🎒
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <InputLabel
                                htmlFor="username"
                                value="Username"
                                className="text-sm sm:text-base font-semibold"
                            />
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 h-5 w-5" />
                                <TextInput
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={data.username}
                                    className="
                                        block w-full 
                                        pl-10 
                                        rounded-xl 
                                        text-sm sm:text-base md:text-lg
                                    "
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('username', e.target.value)
                                    }
                                />
                            </div>
                            <InputError message={errors.username} className="mt-2" />
                        </div>

                        {/* Password */}
                        <div>
                            <InputLabel
                                htmlFor="password"
                                value="Password (optional)"
                                className="text-sm sm:text-base font-semibold"
                            />
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 h-5 w-5" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="
                                        block w-full 
                                        pl-10 
                                        rounded-xl 
                                        text-sm sm:text-base md:text-lg
                                    "
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Remember */}
                        <div className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                            />
                            <span className="ms-2 text-xs sm:text-sm md:text-base text-gray-600">
                                Remember me
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs sm:text-sm text-gray-600 underline hover:text-gray-900"
                                >
                                    Forgot password?
                                </Link>
                            )}

                            <PrimaryButton
                                className="
                                    w-full sm:w-auto 
                                    bg-green-600 
                                    hover:bg-green-700 
                                    rounded-xl 
                                    px-6 sm:px-8 
                                    py-2 sm:py-3 
                                    text-sm sm:text-base md:text-lg
                                "
                                disabled={processing}
                            >
                                Log in
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
