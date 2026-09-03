<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassStudents extends Model
{
    protected $table = 'class_students';

    protected $fillable = ['class_id', 'student_id'];

}
