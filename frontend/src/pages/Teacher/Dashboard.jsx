import TeacherLayout from "@/layouts/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ClipboardList, Folder } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { paths } from "@/routes";
import api from "@/lib/api";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TeacherDashboard() {
  usePageTitle("Teacher Dashboard");

  const [stats, setStats] = useState({
    teacherName: "",
    totalClasses: 0,
    totalStudents: 0,
    totalActivities: 0,
    classes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/teacher").then(({ data }) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <TeacherLayout>
        <div className="p-6">Loading...</div>
      </TeacherLayout>
    );
  }

  const { teacherName, totalClasses, totalStudents, totalActivities, classes } = stats;

  return (
    <TeacherLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-green-50 p-6 rounded-2xl shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green-700">
              Welcome, Teacher {teacherName} 👋
            </h1>
            <p className="text-gray-700 mt-1">
              Here’s a quick overview of your classes and activities.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Folder /> Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalClasses}</p>
              <Button asChild className="mt-3">
                <Link to={paths.teacherClasses}>Manage Classes</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Users /> Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalStudents}</p>
              <Button asChild className="mt-3">
                <Link to={paths.teacherClasses}>Manage Students</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <ClipboardList /> Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalActivities}</p>
              <Button asChild className="mt-3">
                <Link to={paths.teacherActivities}>Manage Activities</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Classes List */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Your Classes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((c) => (
              <Card key={c.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-green-700">{c.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Students: {c.student_count}</p>
                  <Button asChild className="mt-2">
                    <Link to={paths.teacherActivitiesForClass(c.id)}>View Activities</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
