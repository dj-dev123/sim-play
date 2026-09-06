import { useEffect, useState } from "react";
import TeacherLayout from "@/layouts/TeacherLayout";
import { ChevronDown, Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/use-page-title";
import api, { errorMessage } from "@/lib/api";

export default function Classes() {
  usePageTitle("Classes");

  const [expanded, setExpanded] = useState(null);
  const [classes, setClasses] = useState([]);
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

  // Edit Class state
  const [editClassId, setEditClassId] = useState(null);
  const [editClassName, setEditClassName] = useState("");

  // Edit Student state
  const [editStudent, setEditStudent] = useState(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    message: "",
    type: "info", // "success" | "error" | "confirm"
  });
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  useEffect(() => {
    api.get("/teacher/classes").then(({ data }) => setClasses(data.classes));
  }, []);

  const toggleAccordion = (index) => setExpanded(expanded === index ? null : index);

  // ---------- Dialog helper ----------
  const showDialog = (title, message, type = "info", confirmAction = null) => {
    setDialogContent({ title, message, type });
    setOnConfirmAction(() => confirmAction);
    setDialogOpen(true);
  };

  // ---------- Add Class ----------
  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!className) return;

    setLoading(true);
    try {
      const res = await api.post("/teacher/add_class", { name: className });
      toast({ title: "Class added successfully!", description: className });
      showDialog("Success", `Class "${className}" added successfully!`, "success");

      // Update classes state without reloading
      setClasses([...classes, { ...res.data.class, students: [], student_count: 0 }]);

      setClassName("");
      setCurrentClass(null); // close modal
    } catch (err) {
      console.error(err);
      const message = errorMessage(err, "Failed to add class");
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
      const res = await api.post(`/teacher/add_student/${classId}`, studentData);

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
          return { ...cls, students: [...(cls.students || []), res.data.student] };
        }
        return cls;
      });
      setClasses(updatedClasses);
    } catch (err) {
      console.error(err);
      const message = errorMessage(err, "Failed to add student");
      toast({ title: "Error", description: message, variant: "destructive" });
      showDialog("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Edit Class ----------
  const openEditClass = (e, cls) => {
    e.stopPropagation();
    setEditClassId(cls.id);
    setEditClassName(cls.name);
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    if (!editClassName) return;

    setLoading(true);
    try {
      const res = await api.post(`/teacher/classes/${editClassId}/update`, { name: editClassName });
      setClasses(classes.map((c) => (c.id === editClassId ? { ...c, name: res.data.class.name } : c)));
      toast({ title: "Class updated successfully!" });
      setEditClassId(null);
    } catch (err) {
      console.error(err);
      const message = errorMessage(err, "Failed to update class");
      toast({ title: "Error", description: message, variant: "destructive" });
      showDialog("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Delete Class ----------
  const handleDeleteClass = (e, cls) => {
    e.stopPropagation();
    showDialog(
      "Delete Class",
      `Are you sure you want to delete "${cls.name}"? This will also remove its students and activities.`,
      "confirm",
      async () => {
        try {
          await api.delete(`/teacher/classes/${cls.id}/delete`);
          setClasses(classes.filter((c) => c.id !== cls.id));
          toast({ title: "Class deleted successfully!" });
        } catch (err) {
          console.error(err);
          const message = errorMessage(err, "Failed to delete class");
          toast({ title: "Error", description: message, variant: "destructive" });
        }
      }
    );
  };

  // ---------- Edit Student ----------
  const openEditStudent = (classId, student) => {
    setEditStudent({
      classId,
      id: student.id,
      firstname: student.firstname || "",
      middlename: student.middlename || "",
      lastname: student.lastname || "",
      username: student.username || "",
      email: student.email || "",
      password: "",
    });
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!editStudent) return;

    setLoading(true);
    try {
      const { classId, id, ...payload } = editStudent;
      const res = await api.post(`/teacher/classes/${classId}/students/${id}/update`, payload);

      setClasses(
        classes.map((cls) => {
          if (cls.id !== classId) return cls;
          return {
            ...cls,
            students: (cls.students || []).map((s) => (s.id === id ? { ...s, ...res.data.student } : s)),
          };
        })
      );
      toast({ title: "Student updated successfully!" });
      setEditStudent(null);
    } catch (err) {
      console.error(err);
      const message = errorMessage(err, "Failed to update student");
      toast({ title: "Error", description: message, variant: "destructive" });
      showDialog("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Delete Student ----------
  const handleDeleteStudent = (classId, student) => {
    showDialog(
      "Remove Student",
      `Remove ${student.firstname} ${student.lastname} from this class?`,
      "confirm",
      async () => {
        try {
          await api.delete(`/teacher/classes/${classId}/students/${student.id}/delete`);
          setClasses(
            classes.map((cls) => {
              if (cls.id !== classId) return cls;
              return { ...cls, students: (cls.students || []).filter((s) => s.id !== student.id) };
            })
          );
          toast({ title: "Student removed successfully!" });
        } catch (err) {
          console.error(err);
          const message = errorMessage(err, "Failed to remove student");
          toast({ title: "Error", description: message, variant: "destructive" });
        }
      }
    );
  };


  return (
    <TeacherLayout>
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

                <button
                  onClick={(e) => openEditClass(e, cls)}
                  title="Edit class"
                  className="flex items-center justify-center bg-white hover:bg-gray-100 text-gray-600 p-2 rounded-lg shadow ml-2"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  onClick={(e) => handleDeleteClass(e, cls)}
                  title="Delete class"
                  className="flex items-center justify-center bg-white hover:bg-red-50 text-red-600 p-2 rounded-lg shadow ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

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
                        <th className="px-4 py-2 text-left text-green-700 font-semibold">Actions</th>
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
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditStudent(cls.id, student)}
                                title="Edit student"
                                className="flex items-center justify-center bg-white hover:bg-gray-100 text-gray-600 p-1.5 rounded-lg shadow"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(cls.id, student)}
                                title="Remove student"
                                className="flex items-center justify-center bg-white hover:bg-red-50 text-red-600 p-1.5 rounded-lg shadow"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Class Modal */}
        <Dialog open={editClassId !== null} onOpenChange={(open) => !open && setEditClassId(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Class</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateClass} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Class Name"
                value={editClassName}
                onChange={(e) => setEditClassName(e.target.value)}
                className="border border-gray-300 rounded-lg p-2"
                required
              />
              <DialogFooter>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Student Modal */}
        <Dialog open={editStudent !== null} onOpenChange={(open) => !open && setEditStudent(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
            </DialogHeader>
            {editStudent && (
              <form onSubmit={handleUpdateStudent} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={editStudent.firstname}
                  onChange={(e) => setEditStudent({ ...editStudent, firstname: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Middle Name (optional)"
                  value={editStudent.middlename}
                  onChange={(e) => setEditStudent({ ...editStudent, middlename: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={editStudent.lastname}
                  onChange={(e) => setEditStudent({ ...editStudent, lastname: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Username (optional)"
                  value={editStudent.username}
                  onChange={(e) => setEditStudent({ ...editStudent, username: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={editStudent.email}
                  onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
                <input
                  type="password"
                  placeholder="New Password (leave blank to keep current)"
                  value={editStudent.password}
                  onChange={(e) => setEditStudent({ ...editStudent, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />

                <DialogFooter>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

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
