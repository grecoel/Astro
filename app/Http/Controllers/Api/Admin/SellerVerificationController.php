<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use App\Enums\SellerStatus; 
use App\Notifications\SellerApproved; 
use App\Notifications\SellerRejected; 
use Illuminate\Http\Request;

class SellerVerificationController extends Controller
{
    /**
     * Ambil daftar semua seller yang statusnya PENDING 
     */
    public function index()
    {
        $pendingSellers = Seller::where('status', SellerStatus::PENDING)
                                ->select('id', 'store_name', 'pic_name', 'pic_email', 'created_at')
                                ->orderBy('created_at', 'asc')
                                ->get();
        
        return response()->json($pendingSellers);
    }

    /**
     * Tampilkan detail 1 seller (termasuk 14 data) [cite: 27-42]
     */
    public function show(Seller $seller)
    {
        // Route-model binding otomatis menemukan seller berdasarkan ID
        return response()->json($seller);
    }

    /**
     * Proses verifikasi (Approve / Reject) 
     */
    public function verify(Request $request, Seller $seller)
    {
        // 1. Validasi input dari Admin
        $request->validate([
            'action' => 'required|string|in:APPROVE,REJECT'
        ]);

        // 2. Cek apakah seller masih PENDING
        if ($seller->status !== SellerStatus::PENDING) {
            return response()->json(['message' => 'Seller ini sudah diproses.'], 409); 
        }

        // 3. Lakukan Aksi
        if ($request->action === 'APPROVE') {
            
            $seller->status = SellerStatus::ACTIVE; 
            $seller->save();
            
            // Kirim notifikasi email 
            $seller->notify(new SellerApproved());
            
            return response()->json(['message' => 'Seller disetujui.']);

        } 
        
        if ($request->action === 'REJECT') {

            $seller->status = SellerStatus::REJECTED; 
            $seller->save();
            
            // Kirim notifikasi email 
            $seller->notify(new SellerRejected()); // (Tambahkan alasan jika perlu)
            
            return response()->json(['message' => 'Seller ditolak.']);
        }
    }
}