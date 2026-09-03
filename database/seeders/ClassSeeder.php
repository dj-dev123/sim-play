<?php

// database/seeders/ClassSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Classes;
use App\Models\User;

class ClassSeeder extends Seeder
{
    public function run(): void
    {
        // Get all teachers
        $teachers = User::role('teacher')->get();

        $classNames = [
            'Grade 1 - A', 'Grade 1 - B', 
            'Grade 2 - A', 'Grade 2 - B', 
            'Grade 3 - A', 'Grade 3 - B'
        ];

        $i = 0;
        foreach ($teachers as $teacher) {
            // Assign classes to each teacher manually
            for ($j = 0; $j < 3; $j++) {
                Classes::create([
                    'name' => $classNames[$i % count($classNames)],
                    'teacher_id' => $teacher->id,
                ]);
                $i++;
            }
        }
    }
}


