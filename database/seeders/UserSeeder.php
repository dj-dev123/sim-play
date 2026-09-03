<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $teacherRole = Role::firstOrCreate(['name' => 'teacher']);
        $studentRole = Role::firstOrCreate(['name' => 'student']);

        $admin = User::create([
            'firstname' => 'System',
            'lastname' => 'Administrator',
            'middlename' => '',
            'email' => 'admin@email.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password123'),
        ]);
        $admin->assignRole($adminRole);

        $teachers = [
            [
                'firstname' => 'Rowena',
                'lastname' => 'Resposo',
                'email' => 'rowena.resposo@gmail.com',
                'username' => 'rowena',
            ],
            [
                'firstname' => 'Ana',
                'lastname' => 'Reyes',
                'middlename' => 'S.',
                'email' => 'ana.reyes@gmail.com',
                'username' => 'ana',
            ],
            [
                'firstname' => 'Carlos',
                'lastname' => 'Tan',
                'middlename' => 'G.',
                'email' => 'carlos.tan@gmail.com',
                'username' => 'carlos',
            ],
        ];

        foreach ($teachers as $data) {
            $user = User::create(array_merge($data, [
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
            ]));
            $user->assignRole($teacherRole);
        }

        $students = [
            [
                'firstname' => 'Juan',
                'lastname' => 'Dela Cruz',
                'middlename' => 'M.',
                'email' => 'juan.delacruz@gmail.com',
                'username' => 'juan',
            ],
            [
                'firstname' => 'LeBron',
                'lastname' => 'James',
                'middlename' => 'R.',
                'email' => 'lebron.james@gmail.com',
                'username' => 'lebron',
            ],
            [
                'firstname' => 'Stephanie',
                'lastname' => 'Tan',
                'middlename' => 'G.',
                'email' => 'stephanie.tan@gmail.com',
                'username' => 'stephanie',
            ],
        ];

        foreach ($students as $data) {
            $user = User::create(array_merge($data, [
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
            ]));
            $user->assignRole($studentRole);
        }
    }
}
