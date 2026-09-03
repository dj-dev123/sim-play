<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use App\Models\Classes;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function admin_dashboard()
    {
        return response()->json([]);
    }

    public function teacher_dashboard()
    {
        $classes = Classes::withCount(['students as student_count' => function ($query) {
            $query->role('student');
        }])->where('teacher_id', Auth::id())->get();

        // Total counts
        $totalClasses = $classes->count();
        $totalStudents = $classes->sum('student_count');

        // Total activities across all classes
        $totalActivities = Activities::whereIn('class_id', $classes->pluck('id'))->count();
        $teacherName = Auth::user()->firstname . ' ' . Auth::user()->lastname;

        return response()->json([
            'totalClasses' => $totalClasses,
            'totalStudents' => $totalStudents,
            'totalActivities' => $totalActivities,
            'classes' => $classes,
            'teacherName' => $teacherName,
        ]);
    }


    public function student_dashboard()
    {
        return response()->json([]);
    }

    public function app_guide()
    {
        return response()->json([]);
    }
}
