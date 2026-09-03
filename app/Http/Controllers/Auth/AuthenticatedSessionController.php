<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        // Authenticate user (password optional if configured)
        $request->authenticate();

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Determine the frontend path for this user's role
        $redirect = match (true) {
            $user->hasRole('admin') => '/admin',
            $user->hasRole('teacher') => '/teacher',
            $user->hasRole('student') => '/student/guide',
            default => null,
        };

        if ($redirect === null) {
            Auth::logout();

            return response()->json([
                'message' => 'Your account does not have an assigned role.',
                'errors' => ['username' => ['Your account does not have an assigned role.']],
            ], 422);
        }

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'user' => $user->load('roles'),
            'token' => $token,
            'redirect' => $redirect,
        ]);
    }

    /**
     * Destroy an authenticated session (revoke the presented token).
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out.']);
    }
}
