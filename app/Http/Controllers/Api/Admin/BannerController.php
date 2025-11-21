<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BannerController extends Controller
{
    public function index()
    {
        return response()->json(Banner::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|max:5120', 
            'link_url' => 'required|string|max:255',
        ]);

        $filename = null;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->extension();
            
            // Upload ke bucket 'banners'
            Storage::disk('supabase_banners')->put($filename, file_get_contents($file));
        }

        $banner = Banner::create([
            'title' => $request->title,
            'image_url' => $filename, 
            'link_url' => $request->link_url,
            'is_active' => true, 
            'condition' => 'Promo', 
        ]);

        return response()->json(['message' => 'Banner berhasil dibuat', 'data' => $banner]);
    }

    public function destroy(Banner $banner)
    {
        // Hapus file di Supabase
        if ($banner->image_url) {
            Storage::disk('supabase_banners')->delete($banner->image_url);
        }
        
        $banner->delete();
        return response()->json(['message' => 'Banner dihapus']);
    }
    
    // Opsional: Toggle Active
    public function toggleActive(Banner $banner)
    {
        $banner->update(['is_active' => !$banner->is_active]);
        return response()->json(['message' => 'Status banner diubah']);
    }
}