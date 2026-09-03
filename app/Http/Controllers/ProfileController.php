<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Return the authenticated user's profile data.
     */
public function edit(Request $request): JsonResponse
{
    return response()->json([
        'user' => $request->user(),
        'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
    ]);
}

/**
 * Update the user's profile information.
 */
public function update(Request $request): JsonResponse
{
    $user = $request->user();

    $validated = $request->validate([
        'firstname' => ['sometimes', 'string', 'max:255'],
        'middlename' => ['nullable', 'string', 'max:255'],
        'lastname' => ['sometimes', 'string', 'max:255'],
        'username' => ['sometimes', 'string', 'max:255', 'unique:users,username,' . $user->id],
        'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $user->id],
        'password' => ['nullable', 'string', 'min:5', 'confirmed'],
        'profile_image' => ['nullable', 'image', 'max:2048'],
    ]);


    if (isset($validated['firstname'])) {
    $user->firstname = $validated['firstname'];
}
if (array_key_exists('middlename', $validated)) {
    $user->middlename = $validated['middlename'];
}
if (isset($validated['lastname'])) {
    $user->lastname = $validated['lastname'];
}
if (isset($validated['username'])) {
    $user->username = $validated['username'];
}
if (isset($validated['email']) && $user->email !== $validated['email']) {
    $user->email = $validated['email'];
    $user->email_verified_at = null;
}
if (!empty($validated['password'])) {
    $user->password = Hash::make($validated['password']);
}
if ($request->hasFile('profile_image')) {
    $path = $request->file('profile_image')->store('profile_images', config('filesystems.default'));
    $user->profile_image = $path;
}

$user->save();


    return response()->json(['user' => $user, 'status' => 'Profile updated successfully!']);
}

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Account deleted successfully.']);
    }
}
