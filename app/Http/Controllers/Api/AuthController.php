<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Memproses permintaan login Admin.
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
            
            // Periksa ROLE (Hanya Admin yang boleh login ke sini)
            if ($user->role !== 'admin') {
                Auth::logout();
                return response()->json(['message' => 'Akses ditolak. Anda bukan Admin.'], 403);
            }

            // Hapus token lama jika ada
            $user->tokens()->delete();
            
            // Generate token baru untuk SPA
            $token = $user->createToken('admin-token')->plainTextToken;
            
            return response()->json([
                'message' => 'Login berhasil!',
                'user' => $user->only('id', 'name', 'email', 'role'),
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
        // Hapus semua token pengguna (antisipasi jika currentAccessToken null atau tidak mendukung delete)
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }
        
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
}