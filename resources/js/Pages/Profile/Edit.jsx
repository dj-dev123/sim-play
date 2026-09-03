import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ user, mustVerifyEmail, status }) {
const { data, setData, patch, processing, errors } = useForm({
    firstname: user.firstname || '',
    middlename: user.middlename || '',
    lastname: user.lastname || '',
    username: user.username || '',
    email: user.email || '',
    password: '',
    password_confirmation: '',
    profile_image: null,
});

// On form submit
const handleSubmit = (e) => {
    e.preventDefault();

    // For file upload, Inertia requires FormData
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.append(key, value);
        }
    });

    patch(route('profile.update'), {
        preserveScroll: true,
        forceFormData: true, // important for file uploads
        onSuccess: () => alert('Profile updated successfully!'),
    });

};

    const [preview, setPreview] = useState(user.profile_image || null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('profile_image', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <TeacherLayout>
            <Head title="Edit Profile" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-green-700">
                    Edit Profile
                </h1>
                <p className="text-gray-600 mt-1">Update your account information</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                {/* Profile Image */}
                <div className="flex flex-col items-center">
                    {preview && (
                        <img
                            src={preview}
                            alt="Profile Preview"
                            className="w-24 h-24 rounded-full object-cover mb-2"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange} //  setData('profile_image', file)

                        className="text-sm text-gray-700"
                    />
                </div>

                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            value={data.firstname}
                            onChange={(e) => setData('firstname', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                        <input
                            type="text"
                            value={data.middlename}
                            onChange={(e) => setData('middlename', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.middlename && <p className="text-red-500 text-sm">{errors.middlename}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            value={data.lastname}
                            onChange={(e) => setData('lastname', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
                    </div>
                </div>

                {/* Username & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                        {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation}</p>}
                    </div>
                </div>

                {/* Submit */}
                <div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </TeacherLayout>
    );
}
