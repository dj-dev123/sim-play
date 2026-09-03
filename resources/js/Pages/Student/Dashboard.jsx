import StudentLayout from "@/Layouts/StudentLayout";

export default function Dashboard() {
    return (
        <StudentLayout>
        <div className="p-6 bg-white border-b border-gray-200">
            You're logged in as Student!
        </div>
        </StudentLayout>
    );
}