<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use App\Models\Classes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ActivitiesController extends Controller
{
    // List all classes for the teacher
    public function teacher_activities()
    {
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

    // List activities for a specific class
    public function list_of_activities($classId)
    {
        $class = Classes::with([
                'activities' => function ($query) {
                    $query->latest();
                }
            ])
            ->where('teacher_id', Auth::id())
            ->findOrFail($classId);

        return response()->json([
            'classroom' => $class,
            'activities' => $class->activities,
        ]);
    }

    // Store new activity
    public function store_activity(Request $request, $classId)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'instructions' => 'nullable|string',
            'image' => 'required|image|mimes:jpg,png,jpeg|max:2048',
        ]);

        $path = $request->file('image')->store('activities', config('filesystems.default'));

        $activity = Activities::create([
            'class_id' => $classId,
            'title' => $request->title,
            'instructions' => $request->instructions,
            'image_path' => $path,
            'created_by' => Auth::id(),
        ]);

        return response()->json(['activity' => $activity], 201);
    }

    // Update existing activity
    public function update_activity(Request $request, $activityId)
    {
        $activity = Activities::where('created_by', Auth::id())
            ->findOrFail($activityId);

        $request->validate([
            'title' => 'required|string|max:255',
            'instructions' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
        ]);

        // Update image if uploaded
        if ($request->hasFile('image')) {
            // Delete old image
            if ($activity->image_path && Storage::disk(config('filesystems.default'))->exists($activity->image_path)) {
                Storage::disk(config('filesystems.default'))->delete($activity->image_path);
            }
            $activity->image_path = $request->file('image')->store('activities', config('filesystems.default'));
        }

        $activity->title = $request->title;
        $activity->instructions = $request->instructions;
        $activity->save();

        return response()->json(['activity' => $activity]);
    }

    // Delete activity
    public function delete_activity($activityId)
    {
        $activity = Activities::where('created_by', Auth::id())
            ->findOrFail($activityId);

        // Delete image
        if ($activity->image_path && Storage::disk(config('filesystems.default'))->exists($activity->image_path)) {
            Storage::disk(config('filesystems.default'))->delete($activity->image_path);
        }

        $activity->delete();

        return response()->json(['message' => 'Activity deleted successfully.']);
    }
}
