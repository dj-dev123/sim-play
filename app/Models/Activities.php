<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Activities extends Model
{
    protected $table = 'activities';
    protected $fillable = [
        'class_id',
        'title',
        'instructions',
        'image_path',
        'is_sequential',
        'created_by',
    ];
    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path
            ? Storage::disk(config('filesystems.default'))->url($this->image_path)
            : null;
    }

    public function class()
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function studentActivities()
    {
        return $this->hasMany(StudentActivities::class, 'activity_id');
    }
}
