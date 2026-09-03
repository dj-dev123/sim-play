<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Classes extends Model
{
    use HasFactory;

    protected $table = 'classes';
    protected $fillable = ['name', 'teacher_id'];

    /**
     * Teacher of this class
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Students belonging to this class
     */
    public function students()
    {
        // Belongs to many relationship with pivot table class_students
        return $this->belongsToMany(User::class, 'class_students', 'class_id', 'student_id');
    }
    public function activities()
    {
        return $this->hasMany(Activities::class, 'class_id');
    }
}
