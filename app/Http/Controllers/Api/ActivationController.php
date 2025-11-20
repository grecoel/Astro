<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ActivationController extends Controller
{
    /**
     * Validasi token aktivasi
     */
    public function validateToken(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Cek token di database
        $passwordReset = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$passwordReset) {
            return response()->json(['message' => 'Token tidak valid atau sudah kadaluarsa.'], 400);
        }

        // Cek apakah token cocok dan belum kadaluarsa (60 menit)
        $isValid = Hash::check($request->token, $passwordReset->token) &&
                   now()->diffInMinutes($passwordReset->created_at) <= 60;

        if (!$isValid) {
            return response()->json(['message' => 'Token tidak valid atau sudah kadaluarsa.'], 400);
        }

        // Cek seller
        $seller = Seller::where('pic_email', $request->email)->first();
        
        if (!$seller) {
            return response()->json(['message' => 'Data seller tidak ditemukan.'], 404);
        }

        return response()->json([
            'message' => 'Token valid',
            'seller' => $seller->only('store_name', 'pic_name', 'pic_email')
        ]);
    }

    /**
     * Aktivasi akun dengan membuat password
     */
    public function activate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Validasi token
        $passwordReset = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$passwordReset || 
            !Hash::check($request->token, $passwordReset->token) ||
            now()->diffInMinutes($passwordReset->created_at) > 60) {
            return response()->json(['message' => 'Token tidak valid atau sudah kadaluarsa.'], 400);
        }

        // Ambil seller
        $seller = Seller::where('pic_email', $request->email)->first();
        
        if (!$seller) {
            return response()->json(['message' => 'Data seller tidak ditemukan.'], 404);
        }

        // Buat atau update user
        $user = User::updateOrCreate(
            ['email' => $request->email],
            [
                'name' => $seller->pic_name,
                'password' => Hash::make($request->password),
                'role' => 'seller',
                'seller_id' => $seller->id,
            ]
        );

        // Hapus token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Akun berhasil diaktivasi! Silakan login.',
            'user' => $user->only('id', 'name', 'email', 'role')
        ]);
    }
}
