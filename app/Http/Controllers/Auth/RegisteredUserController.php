<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        // Validate only name and username (no password)
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:'.User::class,
        ]);

        // Create user without password
        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => null, // password-less
        ]);

        // Optional: assign default role for students
        $user->assignRole('student');

        // Fire registered event (optional)
        event(new Registered($user));

        // Auto login user
        Auth::login($user);

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'user' => $user->load('roles'),
            'token' => $token,
        ], 201);
    }
}
