<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Activities;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherActivityRecordController extends Controller
{
    public function index(Activities $activity)
    {
        $classroom = $activity->class;

        $students = $classroom->students()->with([
            'studentActivities' => function ($q) use ($activity) {
                $q->where('activity_id', $activity->id);
            }
        ])->get();

        return response()->json([
            'activity' => $activity,
            'classroom' => $classroom,
            'students' => $students,
        ]);
    }

public function toggleStatus(Activities $activity, User $student)
{
    $record = $student->studentActivities()
        ->where('activity_id', $activity->id)
        ->first();

    $status = 'completed';
    $markedBy = Auth::id();

    if ($record) {
        $status = $record->status === 'completed' ? 'in_progress' : 'completed';
        $record->update([
            'status' => $status,
            'marked_by' => $markedBy
        ]);
    } else {
        $student->studentActivities()->create([
            'activity_id' => $activity->id,
            'status' => $status,
            'marked_by' => $markedBy
        ]);
    }

    return response()->json(['status' => $record->status ?? 'completed']);
}

}

