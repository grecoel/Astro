<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Seller;
use Illuminate\Support\Facades\Validator;
use App\Services\SupabaseStorageService;

class SellerController extends Controller
{
    protected $supabaseStorage;

    public function __construct(SupabaseStorageService $supabaseStorage)
    {
        $this->supabaseStorage = $supabaseStorage;
    }

    /**
     * ================================
     * 1. REGISTRASI SELLER (PUBLIC)
     * ================================
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'store_name'        => 'required|string|max:255',
            'store_description' => 'nullable|string',
            'pic_name'          => 'required|string|max:255',
            'pic_phone'         => 'required|string|max:13',
            'pic_email'         => 'required|email|unique:sellers,pic_email',
            'pic_address'       => 'required|string',
            'pic_rt'            => 'required|string|max:3',
            'pic_rw'            => 'required|string|max:3',
            'pic_district'      => 'required|string',
            'pic_city'          => 'required|string',
            'pic_province'      => 'required|string',
            'pic_ktp_number'    => 'required|string|max:20|unique:sellers,pic_ktp_number',
            'pic_photo'         => 'nullable|image|max:2048',
            'pic_ktp_file'      => 'required|file|mimes:jpg,png,pdf|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $ktpPath = null;
        $photoPath = null;

        try {
            if ($request->hasFile('pic_ktp_file')) {
                $file = $request->file('pic_ktp_file');
                $filename = 'ktp_files/' . uniqid() . '_' . $file->getClientOriginalName();
                $ktpPath = $this->supabaseStorage->upload($filename, $file->getContent());
            }

            if ($request->hasFile('pic_photo')) {
                $file = $request->file('pic_photo');
                $filename = 'pic_photos/' . uniqid() . '_' . $file->getClientOriginalName();
                $photoPath = $this->supabaseStorage->upload($filename, $file->getContent());
            }

            $seller = Seller::create([
                'store_name'        => $request->store_name,
                'store_description' => $request->store_description,
                'pic_name'          => $request->pic_name,
                'pic_phone'         => $request->pic_phone,
                'pic_email'         => $request->pic_email,
                'pic_address'       => $request->pic_address,
                'pic_rt'            => $request->pic_rt,
                'pic_rw'            => $request->pic_rw,
                'pic_district'      => $request->pic_district,
                'pic_city'          => $request->pic_city,
                'pic_province'      => $request->pic_province,
                'pic_ktp_number'    => $request->pic_ktp_number,
                'pic_ktp_file_path' => $ktpPath,
                'pic_photo_path'    => $photoPath,
                'status'            => 'PENDING',
            ]);

            return response()->json([
                'message' => 'Registrasi berhasil! Data Anda sedang diverifikasi.',
                'seller_id' => $seller->id
            ], 201);

        } catch (\Exception $e) {
            if ($ktpPath) $this->supabaseStorage->delete($ktpPath);
            if ($photoPath) $this->supabaseStorage->delete($photoPath);

            return response()->json([
                'message' => 'Registrasi gagal.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ================================
     * 2. DETAIL SELLER
     * ================================
     */
    public function show($id)
    {
        $seller = Seller::find($id);

        if (!$seller) {
            return response()->json(['message' => 'Seller tidak ditemukan.'], 404);
        }

        return response()->json([
            'message' => 'Detail seller berhasil diambil.',
            'data' => $seller
        ]);
    }

    /**
     * ================================
     * 3. UPDATE DATA SELLER
     * ================================
     * Seller hanya bisa update data PIC & store, bukan status.
     */
    public function update(Request $request, $id)
    {
        $seller = Seller::find($id);

        if (!$seller) {
            return response()->json(['message' => 'Seller tidak ditemukan.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'store_name'        => 'sometimes|string|max:255',
            'store_description' => 'nullable|string',
            'pic_name'          => 'sometimes|string|max:255',
            'pic_phone'         => 'sometimes|string|max:13',
            'pic_email'         => 'sometimes|email|unique:sellers,pic_email,' . $seller->id,
            'pic_address'       => 'sometimes|string',
            'pic_rt'            => 'sometimes|string|max:3',
            'pic_rw'            => 'sometimes|string|max:3',
            'pic_district'      => 'sometimes|string',
            'pic_city'          => 'sometimes|string',
            'pic_province'      => 'sometimes|string',
            'pic_ktp_number'    => 'sometimes|string|max:20|unique:sellers,pic_ktp_number,' . $seller->id,
            'pic_photo'         => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $photoPath = $seller->pic_photo_path;

            if ($request->hasFile('pic_photo')) {
                if ($photoPath) $this->supabaseStorage->delete($photoPath);

                $file = $request->file('pic_photo');
                $filename = 'pic_photos/' . uniqid() . '_' . $file->getClientOriginalName();
                $photoPath = $this->supabaseStorage->upload($filename, $file->getContent());
            }

            $seller->update([
                'store_name'        => $request->store_name ?? $seller->store_name,
                'store_description' => $request->store_description ?? $seller->store_description,
                'pic_name'          => $request->pic_name ?? $seller->pic_name,
                'pic_phone'         => $request->pic_phone ?? $seller->pic_phone,
                'pic_email'         => $request->pic_email ?? $seller->pic_email,
                'pic_address'       => $request->pic_address ?? $seller->pic_address,
                'pic_rt'            => $request->pic_rt ?? $seller->pic_rt,
                'pic_rw'            => $request->pic_rw ?? $seller->pic_rw,
                'pic_district'      => $request->pic_district ?? $seller->pic_district,
                'pic_city'          => $request->pic_city ?? $seller->pic_city,
                'pic_province'      => $request->pic_province ?? $seller->pic_province,
                'pic_ktp_number'    => $request->pic_ktp_number ?? $seller->pic_ktp_number,
                'pic_photo_path'    => $photoPath,
            ]);

            return response()->json([
                'message' => 'Data seller berhasil diperbarui.',
                'data' => $seller
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui data seller.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ================================
     * 4. ADMIN: VERIFIKASI SELLER
     * ================================
     * Status: APPROVED / REJECTED
     */
    public function verifyStatus(Request $request, $id)
    {
        $seller = Seller::find($id);

        if (!$seller) {
            return response()->json(['message' => 'Seller tidak ditemukan.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:APPROVED,REJECTED',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $seller->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status verifikasi berhasil diperbarui.',
            'data' => $seller
        ]);
    }
}