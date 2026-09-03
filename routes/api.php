<?php

use App\Http\Controllers\ActivitiesController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\ClassesController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentActivitiesController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherActivityRecordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Guest auth endpoints
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.store');

// Hit via a browser navigation from the emailed signed link, not the SPA
Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth:sanctum', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json($request->user()->load('roles'));
    });
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::post('/confirm-password', [ConfirmablePasswordController::class, 'store']);
    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
    Route::put('/password', [PasswordController::class, 'update']);

    Route::get('/profile', [ProfileController::class, 'edit']);
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);

    // Admin
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/', [LoginController::class, 'admin_dashboard']);
    });

    // Teacher
    Route::middleware('role:teacher')->prefix('teacher')->group(function () {
        Route::get('/', [LoginController::class, 'teacher_dashboard']);
        Route::get('/classes', [ClassesController::class, 'classes']);
        Route::post('/add_class', [ClassesController::class, 'add_class']);
        Route::post('/add_student/{classId}', [StudentController::class, 'add_student']);

        Route::get('/activities', [ActivitiesController::class, 'teacher_activities']);
        Route::get('/list_of_activities/{classId}', [ActivitiesController::class, 'list_of_activities']);
        Route::post('/classes/{classId}/activities', [ActivitiesController::class, 'store_activity']);
        Route::post('/activities/{activityId}/update', [ActivitiesController::class, 'update_activity']);
        Route::delete('/activities/{activityId}/delete', [ActivitiesController::class, 'delete_activity']);

        Route::get('/activities/{activity}/records', [TeacherActivityRecordController::class, 'index']);
        Route::post('/activities/{activity}/records/{student}/toggle', [TeacherActivityRecordController::class, 'toggleStatus']);
    });

    // Student
    Route::middleware('role:student')->prefix('student')->group(function () {
        Route::get('/', [LoginController::class, 'student_dashboard']);
        Route::get('/guide', [LoginController::class, 'app_guide']);
        Route::get('/activities', [StudentActivitiesController::class, 'student_activities']);
        Route::get('/activities/{id}', [StudentActivitiesController::class, 'show']);
    });
});
