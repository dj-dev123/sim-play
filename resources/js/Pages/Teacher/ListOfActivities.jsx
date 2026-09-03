import { useState } from "react";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Edit, Trash, BookCheckIcon } from "lucide-react";

export default function ListOfActivities({ classroom, activities: initialActivities }) {
  const [activities, setActivities] = useState(initialActivities || []);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [form, setForm] = useState({
    id: null,
    title: "",
    instructions: "",
    image: null,
  });

  // ---------------- Add or Edit Activity ----------------
  const handleSaveActivity = async () => {
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("instructions", form.instructions);
      if (form.image) data.append("image", form.image);

      let res;
      if (form.id) {
        // EDIT
        res = await axios.post(
          route("teacher.update_activity", form.id),
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setActivities((prev) =>
          prev.map((a) => (a.id === res.data.activity.id ? res.data.activity : a))
        );
        setFeedbackMessage("Activity updated successfully!");
      } else {
        // ADD
        res = await axios.post(
          route("teacher.store_activity", classroom.id),
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setActivities((prev) => [res.data.activity, ...prev]);
        setFeedbackMessage("Activity added successfully!");
      }

      setAddOpen(false);
      setEditOpen(false);
      setConfirmOpen(false);
      setFeedbackOpen(true);
      setForm({ id: null, title: "", instructions: "", image: null });
    } catch (error) {
      console.error(error);
      alert("Failed to save activity. Please try again.");
    }
  };

  // ---------------- Delete Activity ----------------
  const handleDeleteActivity = async () => {
    try {
      await axios.delete(route("teacher.delete_activity", form.id));
      setActivities((prev) => prev.filter((a) => a.id !== form.id));
      setDeleteOpen(false);
      setFeedbackMessage("Activity deleted successfully!");
      setFeedbackOpen(true);
    } catch (error) {
      console.error(error);
      alert("Failed to delete activity. Please try again.");
    }
  };

  return (
    <TeacherLayout>
      <Head title={`${classroom.name} – Activities`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-700">
              {classroom.name} – Activities
            </h1>
            <p className="text-gray-600">Manage class activities</p>
          </div>

          <Button
            onClick={() => setAddOpen(true)}
            className="bg-green-600 hover:bg-green-700 flex gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Activity
          </Button>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={`/storage/${activity.image_path}`}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h2 className="font-semibold text-green-800">{activity.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">{activity.instructions}</p>

                <div className="flex gap-2 mt-2">
                  <Button
                  asChild
                  className="flex-1 bg-purple-600 flex items-center justify-center gap-2"
                >
                  <Link href={route("teacher.activity.records", activity.id)}>
                    <BookCheckIcon className="h-4 w-4" />
                    Records
                  </Link>
                </Button>


                  <Button
                    onClick={() => {
                      setForm({
                        id: activity.id,
                        title: activity.title,
                        instructions: activity.instructions,
                        image: null,
                      });
                      setEditOpen(true);
                    }}
                    className="flex-1 bg-yellow-500 flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    onClick={() => {
                      setForm({ id: activity.id });
                      setDeleteOpen(true);
                    }}
                    className="flex-1 bg-red-600 flex items-center justify-center gap-2"
                  >
                    <Trash className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- View Activity Modal ---------------- */}
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="max-w-4xl">
            {selectedActivity && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-green-700">{selectedActivity.title}</DialogTitle>
                </DialogHeader>
                <p className="text-gray-700">{selectedActivity.instructions}</p>
                <img
                  src={`/storage/${selectedActivity.image_path}`}
                  className="w-full max-h-[70vh] object-contain rounded-xl border mt-4"
                />
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ---------------- Add / Edit Activity Modal ---------------- */}
        <Dialog open={addOpen || editOpen} onOpenChange={() => { setAddOpen(false); setEditOpen(false); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{form.id ? "Edit Activity" : "Add Activity"}</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setConfirmOpen(true);
              }}
              className="space-y-4 mt-2"
            >
              <input
                className="w-full border rounded-lg p-2"
                placeholder="Activity Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <textarea
                className="w-full border rounded-lg p-2"
                placeholder="Instructions"
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              />

              <Button type="submit" className="w-full bg-green-600">
                {form.id ? "Update Activity" : "Save Activity"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* ---------------- Confirmation Dialog ---------------- */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm {form.id ? "Update" : "Add"} Activity</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to {form.id ? "update" : "add"} this activity?</p>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveActivity} className="bg-green-600">
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ---------------- Delete Confirmation Dialog ---------------- */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Activity</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this activity? This action cannot be undone.</p>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button className="bg-red-600" onClick={handleDeleteActivity}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ---------------- Feedback Dialog ---------------- */}
        <Dialog open={feedbackOpen} onOpenChange={() => setFeedbackOpen(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Success!</DialogTitle>
            </DialogHeader>
            <p>{feedbackMessage}</p>
            <DialogFooter className="flex justify-end mt-4">
              <Button className="bg-green-600" onClick={() => setFeedbackOpen(false)}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TeacherLayout>
  );
}
