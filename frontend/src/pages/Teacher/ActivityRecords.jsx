import TeacherLayout from "@/layouts/TeacherLayout";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import api, { errorMessage } from "@/lib/api";
import { paths } from "@/routes";
import { usePageTitle } from "@/hooks/use-page-title";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ActivityRecords() {
  const { activityId } = useParams();
  usePageTitle("Activity Records");

  const [activity, setActivity] = useState(null);
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadRecords = () => {
    api.get(`/teacher/activities/${activityId}/records`).then(({ data }) => {
      setActivity(data.activity);
      setClassroom(data.classroom);
      setStudents(data.students);
      setLoading(false);
    });
  };

  useEffect(loadRecords, [activityId]);

  // Show confirmation dialog
  const confirmToggle = (student) => {
    setSelectedStudent(student);
    setConfirmOpen(true);
  };

  // Toggle status after confirmation
  const toggleStatus = async () => {
    if (!selectedStudent) return;

    const studentId = selectedStudent.id;

    try {
      const response = await api.post(
        `/teacher/activities/${activityId}/records/${studentId}/toggle`
      );

      setDialogMessage(response.data.message || "Status updated successfully!");
      setDialogOpen(true);
      setConfirmOpen(false);

      loadRecords();
    } catch (error) {
      console.error(error);
      setDialogMessage(errorMessage(error, "Failed to update status."));
      setDialogOpen(true);
      setConfirmOpen(false);
    }
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
      <div className="p-6 max-w-6xl mx-auto">
        <div className="relative mb-12">
            {/* Back Button */}
            <Link
                to={paths.teacherActivitiesForClass(classroom.id)}
                className="absolute -top-10 left-0 bg-white border border-[#3f5f1f] text-[#3f5f1f] font-semibold px-4 py-2 rounded-full shadow hover:bg-[#eef6ea] transition"
            >
                ← Back to Activities
            </Link>

            {/* Title */}
            <h1 className="text-2xl font-bold text-green-700 mt-8">
                {activity.title} – Records
            </h1>
            <p className="text-gray-600 mt-1">Class: {classroom.name}</p>
            </div>



        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const record = student.student_activities?.[0];
                const completed = record?.status === "completed";

                return (
                  <tr key={student.id} className="border-b">
                    <td className="px-4 py-3">
                      {student.lastname}, {student.firstname} {student.middlename}
                    </td>

                    <td className="px-4 py-3">
                      {completed ? (
                        <span className="text-green-600 font-semibold">
                          ✔ Completed
                        </span>
                      ) : (
                        <span className="text-gray-500">In Progress</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => confirmToggle(student)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white ${
                          completed
                            ? "bg-gray-500 hover:bg-gray-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {completed ? (
                          <>
                            <XCircle className="w-4 h-4" />
                            Mark As In Progress
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Mark Done
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to{" "}
              {selectedStudent?.student_activities?.[0]?.status === "completed"
                ? "mark this activity as In Progress"
                : "mark this activity as Done"}{" "}
              for {selectedStudent?.firstname} {selectedStudent?.lastname}?
            </DialogDescription>
            <DialogFooter className="space-x-2">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button onClick={toggleStatus}>Yes, Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Feedback Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notification</DialogTitle>
            </DialogHeader>
            <DialogDescription>{dialogMessage}</DialogDescription>
            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TeacherLayout>
  );
}
