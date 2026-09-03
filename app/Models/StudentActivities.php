<?php

// app/Models/StudentActivity.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentActivities extends Model
{
    protected $fillable = [
        'student_id',
        'activity_id',
        'status',
        'marked_by',
        'marked_at',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function activity()
    {
        return $this->belongsTo(Activities::class, 'activity_id');
    }

    public function marker()
    {
        return $this->belongsTo(User::class, 'marked_by');
    }
}
