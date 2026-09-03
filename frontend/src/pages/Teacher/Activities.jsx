import { useEffect, useState } from "react";
import TeacherLayout from "@/layouts/TeacherLayout";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/use-page-title";
import { paths } from "@/routes";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function Activities() {
  usePageTitle("Classes");
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/teacher/activities").then(({ data }) => {
      setClasses(data.classes);
      setLoading(false);
    });
  }, []);

  const goToActivities = (classId) => {
    navigate(paths.teacherActivitiesForClass(classId));
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="p-6">Loading...</div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
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
