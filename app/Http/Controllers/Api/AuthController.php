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
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }

        // Check password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }

        // If login as seller → check seller status must APPROVED
        if ($user->role === 'seller') {
            if (!$user->seller) {
                return response()->json([
                    'message' => 'Akun seller tidak ditemukan.'
                ], 403);
            }

            if ($user->seller->status !== 'APPROVED') {
                return response()->json([
                    'message' => 'Akun Anda belum diverifikasi admin.'
                ], 403);
            }
        }

        // Create Sanctum Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'data' => [
                'user'  => $user,
                'token' => $token
            ]
        ], 200);
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
            'data'    => $user
        ]);
    }
}