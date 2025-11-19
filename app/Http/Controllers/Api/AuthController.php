<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * LOGIN (admin & seller)
     * Route: POST /auth/login
     *
     * Requirements:
     * - Seller hanya bisa login jika status SELLER = APPROVED
     * - Admin bisa login kapan saja
     * - Token menggunakan Laravel Sanctum
     */
    public function login(Request $request)
    {
        // Log untuk debug
        \Log::info('Login attempt:', $request->all());

        $validator = Validator::make($request->all(), [
            'email' => 'required|email', // PENTING: Pastikan ada validasi email
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Data tidak lengkap',
                'errors' => $validator->errors() // Tampilkan detail error
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email tidak ditemukan'
            ], 404);
        }

        // Check password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Password salah'
            ], 401);
        }

        // Admin bisa login kapan saja
        // Seller hanya bisa login jika APPROVED
        if ($user->role === 'seller') {
            $seller = \App\Models\Seller::where('user_id', $user->id)->first();
            if (!$seller || $seller->status !== 'APPROVED') {
                return response()->json([
                    'message' => 'Akun seller belum disetujui'
                ], 403);
            }
        }

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user,
            'token' => $token
        ]);
    }

    /**
     * LOGOUT
     * Route: POST /auth/logout
     *
     * - Menghapus token aktif
     */
    public function logout(Request $request)
    {
        $token = $request->user()->currentAccessToken();
        if ($token) {
            $request->user()->tokens()->where('id', $token->id)->delete();
        }

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }

    /**
     * PROFILE
     * Route: GET /auth/me
     *
     * - Mendapatkan data user + seller (jika role seller)
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('seller');

        return response()->json([
            'message' => 'Data profil berhasil diambil',
            'data' => $user
        ]);
    }
}