import StudentLayout from "@/Layouts/StudentLayout";
import { Head, Link } from "@inertiajs/react";
export default function Guide({ nextUrl = "/student/activity" }) {
  return (
    <StudentLayout>
    <div className="min-h-screen bg-[#cfe9c8] flex justify-center px-4 py-10">
      <Head title="Guide Card" />

      <div className="relative max-w-4xl w-full bg-[#cfe9c8] rounded-3xl p-6 sm:p-10">

        {/* Decorative Leaves */}
        <div className="absolute top-6 right-6 opacity-30 text-green-700 text-6xl select-none">
          🍃
        </div>

        {/* Header */}
        <div className="bg-[#3f5f1f] rounded-full px-10 py-4 inline-block mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-[#cfe9c8]">
            GUIDE CARD
          </h1>
        </div>

        {/* Content with Wrapped Image */}
        <div className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium">

          {/* Floating Image */}
          <img
            src="/images/kids.png"
            alt="Kids"
            className="
              float-left
              w-36 sm:w-44
              mr-6 mb-4
              rounded-lg
              sm:float-left
              block
            "
          />

          <p className="mb-4">
            Hi, kids! We are Joe and Sha! We are your little helpers for you to
            better understand our lesson.
          </p>

          <p className="mb-4">
            We know that you are having a hard time in the competency, adding
            dissimilar fractions. Don’t worry, we are here to make things
            easier for you.
          </p>

          <p className="mb-4">
            First, we will give you activities on how to get the Least Common
            Multiple (LCM) and Greatest Common Factors (GCF) of numbers. This
            will prepare you in finding the Least Common Denominators (LCD) of
            a dissimilar fraction.
          </p>

          <p className="mb-4">
            If you master these activities, it will make easier steps in
            converting your answers to its lowest term, a much needed way in
            coming up with the final and correct answer in adding dissimilar
            fractions.
          </p>

          <p className="mb-4">
            Do not be afraid in answering our activities, we are sure that our
            teacher is there to help you. After you complete our activities,
            you will be confident and ready to face any fractions you are
            going to add.
          </p>

          <p className="font-bold text-green-900">
            Good luck! We know you can do it! 💚
          </p>

          {/* Clear float so button stays below */}
          <div className="clear-both"></div>
        </div>

        {/* Bottom Decoration */}
        <div className="absolute bottom-6 left-6 opacity-30 text-green-700 text-6xl select-none">
          🍃
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-10">
          <Link
            href={route('student.activities')}
            className="bg-[#3f5f1f] hover:bg-[#2f4816] text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition"
          >
            Next →
          </Link>
        </div>
      </div>
    </div>
    </StudentLayout>
  );
}
