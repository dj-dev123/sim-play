<?php

namespace App\Http\Controllers;

use App\Models\Classes;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function add_student(Request $request, $classId)
    {
        $request->validate([
            'student_id' => 'nullable|exists:users,id',
            'firstname' => 'required_without:student_id|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'lastname' => 'required_without:student_id|string|max:255',
            'username' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|string|min:6',
        ]);

        $class = Classes::findOrFail($classId);

        if ($request->student_id) {
            // Attach existing student
            $studentId = $request->student_id;
        } else {
            // Create a new student
            $student = User::create([
                'firstname' => $request->firstname,
                'middlename' => $request->middlename ?? null,
                'lastname'  => $request->lastname,
                'username'  => $request->username ?? null,
                'email'     => $request->email ?? null,
                'password'  => isset($request->password) ? Hash::make($request->password) : Hash::make('password'),
                'email_verified_at' => now(),
            ]);

            // Assign student role
            $student->assignRole('student');

            $studentId = $student->id;
        }

        // Attach student to class without detaching existing ones
        $class->students()->syncWithoutDetaching([$studentId]);

        // Return JSON response for Axios
        return response()->json([
            'student' => [
                'id' => $student->id,
                'firstname' => $student->firstname,
                'lastname' => $student->lastname,
                'username' => $student->username,
                'email' => $student->email,
            ]
        ]);

    }

    public function update_student(Request $request, $classId, $studentId)
    {
        $class = Classes::where('teacher_id', Auth::id())->findOrFail($classId);
        $student = $class->students()->where('users.id', $studentId)->firstOrFail();

        $request->validate([
            'firstname' => 'required|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'lastname' => 'required|string|max:255',
            'username' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $student->id,
            'password' => 'nullable|string|min:6',
        ]);

        $student->firstname = $request->firstname;
        $student->middlename = $request->middlename ?? null;
        $student->lastname = $request->lastname;
        $student->username = $request->username ?? null;
        $student->email = $request->email ?? null;

        if ($request->filled('password')) {
            $student->password = Hash::make($request->password);
        }

        $student->save();

        return response()->json([
            'student' => [
                'id' => $student->id,
                'firstname' => $student->firstname,
                'middlename' => $student->middlename,
                'lastname' => $student->lastname,
                'username' => $student->username,
                'email' => $student->email,
            ]
        ]);
    }

    public function delete_student($classId, $studentId)
    {
        $class = Classes::where('teacher_id', Auth::id())->findOrFail($classId);
        $class->students()->where('users.id', $studentId)->firstOrFail();

        // Remove the student from this class only; the account itself is left intact
        $class->students()->detach($studentId);

        return response()->json(['message' => 'Student removed from class successfully.']);
    }
}
