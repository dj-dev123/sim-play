<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClassesController extends Controller
{
    public function classes(){
        $classes = Classes::withCount(['students as student_count' => function($query) {
            $query->role('student');
        }])
        ->with(['students' => function ($query) {
            $query->role('student');
        }])
        ->where('teacher_id', Auth::id())
        ->get();

        return response()->json([
            'classes' => $classes,
        ]);
    }
    public function add_class(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $class = Classes::create([
            'name' => $request->name,
            'teacher_id' => Auth::id(),
        ]);

        return response()->json(['class' => $class], 201);
    }
}
