<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Banner;
use Illuminate\Support\Facades\Validator;
use App\Services\SupabaseStorageService;

class BannerController extends Controller
{
    protected $supabaseStorage;

    public function __construct(SupabaseStorageService $supabaseStorage)
    {
        $this->supabaseStorage = $supabaseStorage;
    }

    /**
     * Menampilkan semua banner.
     */
    public function index()
    {
        $banners = Banner::orderBy('created_at', 'desc')->get();

        return response()->json([
            'message' => 'Daftar banner berhasil diambil.',
            'data' => $banners
        ]);
    }

    /**
     * Membuat banner baru.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'       => 'required|string|max:255',
            'image'       => 'required|image|max:4096', // 4 MB
            'redirect_url'=> 'nullable|url',
            'is_active'   => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = null;

        try {
            // Upload image
            if ($request->hasFile('image')) {
                $file     = $request->file('image');
                $filename = 'banners/' . uniqid() . '_' . $file->getClientOriginalName();
                $imagePath = $this->supabaseStorage->upload($filename, $file->getContent());
            }

            $banner = Banner::create([
                'title' => $request->title,
                'redirect_url' => $request->redirect_url,
                'image_path' => $imagePath,
                'is_active' => $request->is_active ?? true,
            ]);

            return response()->json([
                'message' => 'Banner berhasil ditambahkan.',
                'data' => $banner
            ], 201);

        } catch (\Exception $e) {

            // Rollback file if failed
            if ($imagePath) {
                $this->supabaseStorage->delete($imagePath);
            }

            return response()->json([
                'message' => 'Gagal membuat banner.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Detail banner.
     */
    public function show($id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json(['message' => 'Banner tidak ditemukan.'], 404);
        }

        return response()->json([
            'message' => 'Detail banner berhasil diambil.',
            'data' => $banner
        ]);
    }

    /**
     * Update banner.
     */
    public function update(Request $request, $id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json(['message' => 'Banner tidak ditemukan.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title'       => 'sometimes|required|string|max:255',
            'image'       => 'sometimes|image|max:4096',
            'redirect_url'=> 'nullable|url',
            'is_active'   => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = $banner->image_path;

        try {
            // jika upload gambar baru → hapus lama & upload baru
            if ($request->hasFile('image')) {
                if ($imagePath) {
                    $this->supabaseStorage->delete($imagePath);
                }

                $file = $request->file('image');
                $filename = 'banners/' . uniqid() . '_' . $file->getClientOriginalName();
                $imagePath = $this->supabaseStorage->upload($filename, $file->getContent());
            }

            $banner->update([
                'title' => $request->title ?? $banner->title,
                'redirect_url' => $request->redirect_url ?? $banner->redirect_url,
                'image_path' => $imagePath,
                'is_active' => $request->is_active ?? $banner->is_active,
            ]);

            return response()->json([
                'message' => 'Banner berhasil diperbarui.',
                'data' => $banner
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui banner.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menghapus banner.
     */
    public function destroy($id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json(['message' => 'Banner tidak ditemukan.'], 404);
        }

        // hapus file dari Supabase Storage
        if ($banner->image_path) {
            $this->supabaseStorage->delete($banner->image_path);
        }

        $banner->delete();

        return response()->json(['message' => 'Banner berhasil dihapus.']);
    }
}