import { useState } from "react";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { ChevronDown, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Head } from "@inertiajs/react";

export default function Classes({ initialClasses = [], students = [] }) {
  const [expanded, setExpanded] = useState(null);
  const [classes, setClasses] = useState(initialClasses);
  const [loading, setLoading] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);


  const { toast } = useToast();

  const [className, setClassName] = useState("");
  const [studentData, setStudentData] = useState({
    student_id: "",
    firstname: "",
    middlename: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    message: "",
    type: "info", // "success" | "error" | "confirm"
  });
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  const toggleAccordion = (index) => setExpanded(expanded === index ? null : index);

  // ---------- Dialog helper ----------
  const showDialog = (title, message, type = "info", confirmAction = null) => {
    setDialogContent({ title, message, type });
    setOnConfirmAction(() => confirmAction);
    setDialogOpen(true);
  };

  // ---------- Add Class ----------
// ---------- Add Class ----------
const handleAddClass = async (e) => {
  e.preventDefault();
  if (!className) return;

  setLoading(true);
  try {
    const res = await axios.post(route("teacher.add_class"), { name: className });
    toast({ title: "Class added successfully!", description: className });
    showDialog("Success", `Class "${className}" added successfully!`, "success");

    // Update classes state without reloading
    setClasses([...classes, res.data.class]); // assuming backend returns the new class as res.data.class

    setClassName("");
    setCurrentClass(null); // close modal
  } catch (err) {
    console.error(err);
    const message = err.response?.data?.message || "Failed to add class";
    toast({ title: "Error", description: message, variant: "destructive" });
    showDialog("Error", message, "error");
  } finally {
    setLoading(false);
  }
};

// ---------- Add Student ----------
const handleAddStudent = async (e, classId) => {
  e.preventDefault();

  if (!studentData.student_id && (!studentData.firstname || !studentData.lastname)) {
    const message = "Provide existing student or first & last name";
    toast({ title: "Error", description: message, variant: "destructive" });
    showDialog("Error", message, "error");
    return;
  }

  setLoading(true);
  try {
    const res = await axios.post(route("teacher.add_student", classId), studentData);

    toast({ title: "Student added successfully!" });
    showDialog("Success", "Student added to class successfully!", "success");

    setStudentData({
      student_id: "",
      firstname: "",
      middlename: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
    });
    setCurrentClass(null); // close modal

    // Update classes state
    const updatedClasses = classes.map((cls) => {
      if (cls.id === classId) {
        return { ...cls, students: [...cls.students, res.data.student] };
      }
      return cls;
    });
    setClasses(updatedClasses);
  } catch (err) {
    console.error(err);
    const message = err.response?.data?.message || "Failed to add student";
    toast({ title: "Error", description: message, variant: "destructive" });
    showDialog("Error", message, "error");
  } finally {
    setLoading(false);
  }
};


  return (
    <TeacherLayout>
      <Head title="Classes" />
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700">My Classes</h1>

          {/* Add Class Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow">
                <Plus className="h-4 w-4" /> Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddClass} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Class Name"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
                <DialogFooter>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full" disabled={loading}>
                    {loading ? "Adding..." : "Add Class"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Classes Accordion */}
        <div className="space-y-4">
          {classes.map((cls, index) => (
            <div key={cls.id} className="bg-white rounded-2xl shadow-md overflow-hidden transition-all">
              {/* Accordion Header */}
              
                <div
                  onClick={() => toggleAccordion(index)}
                  className="flex justify-between items-center px-6 py-4 bg-green-100 hover:bg-green-200 transition-colors cursor-pointer"
                >
                  <div className="flex-1 text-left text-green-700 font-semibold text-lg sm:text-xl">
                    {cls.name} ({cls.students?.length || 0})
                  </div>

                {/* Add Student Modal */}
                <Dialog open={currentClass === cls.id} onOpenChange={(open) => setCurrentClass(open ? cls.id : null)}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg shadow ml-4"
                    >
                      <Plus className="h-3 w-3" /> Add Student
                    </Button>

                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Student to {cls.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => handleAddStudent(e, cls.id)} className="flex flex-col gap-4">
                      {/* Existing student */}
                      <select
                        className="w-full border border-gray-300 rounded-lg p-2"
                        value={studentData.student_id}
                        onChange={(e) => setStudentData({ ...studentData, student_id: e.target.value })}
                      >
                        <option value="">Select Existing Student</option>
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.firstname} {student.lastname} ({student.username})
                          </option>
                        ))}
                      </select>

                      <div className="text-center text-gray-500 font-medium my-2">— OR —</div>

                      {/* New Student Inputs */}
                      <input
                        type="text"
                        placeholder="First Name"
                        value={studentData.firstname}
                        onChange={(e) => setStudentData({ ...studentData, firstname: e.target.value })}
                        required={!studentData.student_id}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                      <input
                        type="text"
                        placeholder="Middle Name (optional)"
                        value={studentData.middlename}
                        onChange={(e) => setStudentData({ ...studentData, middlename: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={studentData.lastname}
                        onChange={(e) => setStudentData({ ...studentData, lastname: e.target.value })}
                        required={!studentData.student_id}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                      <input
                        type="text"
                        placeholder="Username (optional)"
                        value={studentData.username}
                        onChange={(e) => setStudentData({ ...studentData, username: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                      <input
                        type="email"
                        placeholder="Email (optional)"
                        value={studentData.email}
                        onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                      <input
                        type="password"
                        placeholder="Password (optional)"
                        value={studentData.password}
                        onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />

                      <DialogFooter>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full" disabled={loading}>
                          {loading ? "Adding..." : "Add Student"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <ChevronDown
                  className={`h-5 w-5 text-green-700 transform transition-transform duration-300 ml-2 ${
                    expanded === index ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Accordion Content */}
              <div
                className={`px-6 pb-4 transition-max-height duration-500 overflow-hidden ${
                  expanded === index ? "max-h-[1000px]" : "max-h-0"
                }`}
              >
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-green-700 font-semibold">Name</th>
                        <th className="px-4 py-2 text-left text-green-700 font-semibold">Username</th>
                        <th className="px-4 py-2 text-left text-green-700 font-semibold">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(cls.students || []).map((student) => (
                        <tr key={student.id} className="hover:bg-green-50 transition-colors">
                          <td className="px-4 py-2 text-green-800 font-medium">
                            {student.firstname} {student.lastname}
                          </td>
                          <td className="px-4 py-2 text-green-800">{student.username || "-"}</td>
                          <td className="px-4 py-2 text-green-800">{student.email || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback / Confirm Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle
                className={
                  dialogContent.type === "error"
                    ? "text-red-600"
                    : dialogContent.type === "success"
                    ? "text-green-600"
                    : dialogContent.type === "confirm"
                    ? "text-yellow-600"
                    : ""
                }
              >
                {dialogContent.title}
              </DialogTitle>
              <DialogDescription>{dialogContent.message}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              {dialogContent.type === "confirm" ? (
                <>
                  <Button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                    onClick={() => {
                      setDialogOpen(false);
                      setOnConfirmAction(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                    onClick={() => {
                      if (typeof onConfirmAction === "function") onConfirmAction();
                      setDialogOpen(false);
                      setOnConfirmAction(null);
                    }}
                  >
                    Confirm
                  </Button>
                </>
              ) : (
                <Button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TeacherLayout>
  );
}
