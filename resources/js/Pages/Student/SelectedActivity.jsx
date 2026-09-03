import StudentLayout from "@/Layouts/StudentLayout";
import { Head, Link } from "@inertiajs/react";

export default function SelectedActivity({
  activity,
  nextActivityId,
  previousActivityId,
  isCompleted,
}) {
  return (
    <StudentLayout>
      <Head title={activity.title} />

      <div className="min-h-screen bg-[#cfe9c8] flex justify-center px-4 py-10">
        <div className="relative w-full max-w-5xl bg-[#dff0d8] rounded-3xl shadow-xl p-6 sm:p-10">

          {/* Back Button */}
          <Link
            href={route("student.activities")}
            className="absolute top-6 left-6 bg-white border border-[#3f5f1f] text-[#3f5f1f] font-semibold px-4 py-2 rounded-full shadow hover:bg-[#eef6ea] transition"
          >
            ← Back to Activities
          </Link>

          {/* Completed Badge */}
          {isCompleted && (
            <div className="absolute top-6 right-6 bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow">
              ✔ Completed
            </div>
          )}

          {/* Header */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#3f5f1f] rounded-full px-10 py-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#cfe9c8] tracking-wide">
                ACTIVITY CARD
              </h1>
            </div>
          </div>

          {/* Intro Section */}
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            <img
              src="/images/kids.png"
              alt="Kids"
              className="w-32 sm:w-40 flex-shrink-0"
            />

            <p className="text-[#2f4816] text-base sm:text-lg leading-relaxed">
              Hi, this is our first activity. Did you know that the greatest
              common factor (GCF) of a set of numbers is the largest factor that
              all the numbers share? Follow the example below and answer the
              activities that follow.
            </p>
          </div>

          {/* Activity Info */}
          <div className="bg-white/70 rounded-2xl p-5 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#3f5f1f]">
              {activity.title}
            </h2>

            {activity.instructions && (
              <p className="mt-2 text-[#2f4816] text-base sm:text-lg">
                {activity.instructions}
              </p>
            )}
          </div>

          {/* Worksheet Image */}
          {activity.image_path && (
            <div className="flex justify-center mb-10">
              <img
                src={`/storage/${activity.image_path}`}
                alt={activity.title}
                className="w-full max-w-4xl rounded-xl shadow-lg border border-[#b6d7a8]"
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[#b6d7a8]">

            {/* Previous */}
            {previousActivityId ? (
              <Link
                href={route("student.activity.show", previousActivityId)}
                className="bg-white border-2 border-[#3f5f1f] text-[#3f5f1f] font-bold text-lg px-8 py-3 rounded-full shadow hover:bg-[#eef6ea] transition"
              >
                ← Previous
              </Link>
            ) : (
              <span />
            )}

            {/* Next / Completed */}
            {isCompleted ? (
              <button
                disabled
                className="bg-green-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow cursor-not-allowed"
              >
                Activity Completed ✅
              </button>
            ) : nextActivityId ? (
              <Link
                href={route("student.activity.show", nextActivityId)}
                className="bg-[#3f5f1f] hover:bg-[#2f4816] text-white font-bold text-lg px-10 py-4 rounded-full shadow-md transition"
              >
                Next →
              </Link>
            ) : (
              <button
                disabled
                className="bg-gray-400 text-white font-bold text-lg px-10 py-4 rounded-full shadow cursor-not-allowed"
              >
                No More Activities
              </button>
            )}
          </div>

        </div>
      </div>
    </StudentLayout>
  );
}
