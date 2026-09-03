import TeacherLayout from "@/Layouts/TeacherLayout";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Head, router } from "@inertiajs/react";

export default function Classes({ initialClasses = [] }) {
  const classes = initialClasses;

  const goToActivities = (classId) => {
    router.visit(route("teacher.list_of_activities", classId));
  };

  return (
    <TeacherLayout>
      <Head title="Classes" />

      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700">
            My Classes
          </h1>
        </div>

        {/* Classes List */}
        <div className="space-y-4">
          {classes.length === 0 && (
            <div className="text-gray-500 text-center py-10">
              No classes found.
            </div>
          )}

          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-2xl shadow-md px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-lg transition"
            >
              {/* Class Info */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-green-800">
                  {cls.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {cls.students?.length || 0} students
                </p>
              </div>

              {/* Actions */}
              <Button
                onClick={() => goToActivities(cls.id)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Eye className="h-4 w-4" />
                View Activities
              </Button>
            </div>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}
