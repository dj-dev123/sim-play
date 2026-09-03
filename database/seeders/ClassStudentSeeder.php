<?php

// database/seeders/ClassStudentSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Classes;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ClassStudentSeeder extends Seeder
{
    public function run(): void
    {
        // Get classes
        $class1 = Classes::where('name', 'Grade 1 - A')->first();
        $class2 = Classes::where('name', 'Grade 2 - B')->first();

        // Get students
        $student1 = User::where('firstname', 'Juan')->first();
        $student2 = User::where('firstname', 'Lebron')->first();
        $student3 = User::where('firstname', 'Stephanie')->first();

        // Assign students to class 1
        DB::table('class_students')->insert([
            'class_id' => $class1->id,
            'student_id' => $student1->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('class_students')->insert([
            'class_id' => $class1->id,
            'student_id' => $student2->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Assign students to class 2
        DB::table('class_students')->insert([
            'class_id' => $class2->id,
            'student_id' => $student3->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Add more manually as needed
    }
}
