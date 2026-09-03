<?php

use App\Http\Controllers\ActivitiesController;
use App\Http\Controllers\ClassesController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentActivitiesController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherActivityRecordController;
use App\Models\StudentActivities;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('dashboard');

// Route::get('/', function () {
//     if (Auth::check()) {
//         $user = Auth::user();

//         if ($user->roles->contains('name', 'admin')) {
//             return redirect()->route('admin.admin_dashboard');
//         } elseif ($user->roles->contains('name', 'teacher')) {
//             return redirect()->route('teacher.teacher_dashboard');
//         } elseif ($user->roles->contains('name', 'student')) {
//             return redirect()->route('student.student_dashboard');
//         }

//         // fallback if no role
//         Auth::logout();
//         request()->session()->invalidate();
//         request()->session()->regenerateToken();

//         return redirect()->route('login')->withErrors([
//             'username' => 'Your account does not have an assigned role.',
//         ]);
//     }

//     // guest user → go to login route
//     return redirect()->route('login');
// });





// Admin routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/', [LoginController::class, 'admin_dashboard'])->name('admin.admin_dashboard');
});

// Requester routes
Route::middleware(['auth', 'role:teacher'])->prefix('teacher')->group(function () {
    Route::get('/', [LoginController::class, 'teacher_dashboard'])->name('teacher.teacher_dashboard');
    Route::get('/classes', [ClassesController::class, 'classes'])->name('teacher.teacher_classes');
    Route::post('/add_class', [ClassesController::class, 'add_class'])->name('teacher.add_class');
    Route::post('/add_student/{classId}', [StudentController::class, 'add_student'])->name('teacher.add_student');

    Route::get('/activities', [ActivitiesController::class, 'teacher_activities'])->name('teacher.teacher_activities');
    Route::get('/list_of_activities/{classId}', [ActivitiesController::class, 'list_of_activities'])->name('teacher.list_of_activities');
    Route::post('/classes/{classId}/activities', [ActivitiesController::class, 'store_activity'])->name('teacher.store_activity');
    Route::post('/activities/{activityId}/update', [ActivitiesController::class, 'update_activity'])->name('teacher.update_activity');
    Route::delete('/activities/{activityId}/delete', [ActivitiesController::class, 'delete_activity'])->name('teacher.delete_activity');

    Route::get(
  '/teacher/activities/{activity}/records',
  [TeacherActivityRecordController::class, 'index']
)->name('teacher.activity.records');

Route::post(
  '/teacher/activities/{activity}/records/{student}/toggle',
  [TeacherActivityRecordController::class, 'toggleStatus']
)->name('teacher.activity.records.toggle');

});



// Approver routes
Route::middleware(['auth', 'role:student'])->prefix('student')->group(function () {
    Route::get('/', [LoginController::class, 'student_dashboard'])->name('student.student_dashboard');
    Route::get('/guide', [LoginController::class, 'app_guide'])->name('student.app_guide');
    Route::get('/activities', [StudentActivitiesController::class, 'student_activities'])->name('student.activities');
    Route::get('/student/activity/{id}', [StudentActivitiesController::class, 'show'])->name('student.activity.show');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Auth scaffolding
require __DIR__.'/auth.php';
