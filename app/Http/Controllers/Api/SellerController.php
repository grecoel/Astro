<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Seller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class SellerController extends Controller
{
    /**
     * Menyimpan seller baru (Registrasi SRS-01).
     * Method 'store()' ini sesuai dengan PDF [cite: 105, 129].
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            'store_name' => 'required|string|max:255',
            'store_description' => 'nullable|string',
            'pic_name' => 'required|string|max:255',
            'pic_phone' => 'required|string|max:13',
            'pic_email' => 'required|email|unique:sellers,pic_email',
            'pic_address' => 'required|string',
            'pic_rt' => 'required|string|max:3',
            'pic_rw' => 'required|string|max:3',
            'pic_district' => 'required|string',
            'pic_city' => 'required|string',
            'pic_province' => 'required|string',
            'pic_ktp_number' => 'required|string|max:20|unique:sellers,pic_ktp_number',
            'pic_photo' => 'nullable|image|max:2048', 
            'pic_ktp_file' => 'required|file|mimes:jpg,png,pdf|max:5120', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $ktpPath = $request->file('pic_ktp_file')->store('ktp_files', 'public');
        $photoPath = $request->hasFile('pic_photo') ? $request->file('pic_photo')->store('pic_photos', 'public') : null;

        try {
            $seller = Seller::create([
                'store_name' => $request->store_name,
                'pic_name' => $request->pic_name,
                'pic_email' => $request->pic_email,
                'pic_phone' => $request->pic_phone,
                'pic_address' => $request->pic_address,
                'pic_rt' => $request->pic_rt,
                'pic_rw' => $request->pic_rw,
                'pic_district' => $request->pic_district,
                'pic_city' => $request->pic_city,
                'pic_province' => $request->pic_province,
                'pic_ktp_number' => $request->pic_ktp_number,
                'store_description' => $request->store_description,
                'pic_ktp_file_path' => $ktpPath,
                'pic_photo_path' => $photoPath,
                // Status 'PENDING' sudah di-set default di migrasi
            ]);

            return response()->json([
                'message' => 'Registrasi berhasil! Data Anda sedang diverifikasi.',
                'seller_id' => $seller->id
            ], 201);


            } catch (\Exception $e) {
            Storage::disk('public')->delete($ktpPath);
            if ($photoPath) Storage::disk('public')->delete($photoPath);
            
            return response()->json(['error' => 'Registrasi gagal.', 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id) {
        // $seller = Seller::find($id);
        // return response()->json($seller);
    }
}
