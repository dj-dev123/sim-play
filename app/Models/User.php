<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use App\Models\Classes; // ✅ REQUIRED

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'firstname',
        'middlename',
        'lastname',
        'username',
        'email',
        'profile_image',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Classes where user is the teacher
    public function classesAsTeacher()
    {
        return $this->hasMany(Classes::class, 'teacher_id');
    }

    // Classes where user is a student
    public function classesAsStudent()
    {
        return $this->belongsToMany(
            Classes::class,
            'class_students',
            'student_id',
            'class_id'
        );
    }
    public function studentActivities()
    {
        return $this->hasMany(StudentActivities::class, 'student_id');
    }
}
