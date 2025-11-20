<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    /**
     * Memproses permintaan login Admin dan Seller.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Coba otentikasi
        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            
            // Untuk seller, cek apakah akun sudah teraktivasi
            if ($user->role === 'seller') {
                // Seller sudah bisa login jika User record exists dengan password yang benar
                // Berarti sudah teraktivasi dari activation flow
            } elseif ($user->role !== 'admin') {
                // Role yang tidak dikenal
                Auth::logout();
                return response()->json(['message' => 'Akses ditolak.'], 403);
            }

            // Hapus token lama jika ada
            $user->tokens()->delete();
            
            // Generate token baru untuk SPA
            $token = $user->createToken('auth-token')->plainTextToken;
            
            return response()->json([
                'message' => 'Login berhasil!',
                'user' => $user->only('id', 'name', 'email', 'role', 'seller_id'),
                'token' => $token
            ]);
        }

        return response()->json(['message' => 'Kredensial tidak valid.'], 401);
    }

    /**
     * Memproses permintaan logout.
     */
    public function logout(Request $request)
    {
        // Hapus token saat ini
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'Logout berhasil!']);
    }

    /**
     * Get current authenticated user.
     */
    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user()->only('id', 'name', 'email', 'role')
        ]);
    }

    public function activateAccount(Request $request)
    {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed', // password_confirmation wajib
    ]);

    // Gunakan broker password Laravel untuk reset password
    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->setRememberToken(Str::random(60));

            $user->save();

            event(new \Illuminate\Auth\Events\PasswordReset($user));
        }
    );

    if ($status == Password::PASSWORD_RESET) {
        return response()->json(['message' => 'Akun berhasil diaktifkan! Silakan login.']);
    }
    }
}