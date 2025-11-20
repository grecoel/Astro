<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Category::orderBy('name')->get()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'icon' => 'nullable|image|mimes:jpeg,png,gif,webp|max:2048'
        ]);
        
        $iconFilename = null;
        
        if ($request->hasFile('icon')) {
            $file = $request->file('icon');
            $iconFilename = Str::uuid() . '.' . $file->getClientOriginalExtension();

            
            $path = $file->storeAs('', $iconFilename, 'supabase_categories');

            // CEK KEBERHASILAN (DEBUGGING)
            if (!$path) {
                return response()->json([
                    'error' => 'Gagal upload ke Supabase. Cek Permission/Policy Bucket.',
                    'debug_disk' => config('filesystems.disks.supabase_categories') // Cek config
                ], 500);
            }
        }
        
        $category = Category::create([
            'name' => $request->name,
            'icon_url' => $iconFilename 
        ]);
        
        return response()->json(['message' => 'Kategori dibuat', 'data' => $category]);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'icon' => 'nullable|image|mimes:jpeg,png,gif,webp|max:2048'
        ]);
        
        $data = ['name' => $request->name];
        
        if ($request->hasFile('icon')) {
            // Hapus icon lama jika ada
            if ($category->icon_url) {
                $oldFilename = basename($category->icon_url); 
                Storage::disk('supabase_categories')->delete($oldFilename);
            }
            
            $file = $request->file('icon');
            $iconFilename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            
            try {
                // Upload icon baru
                Storage::disk('supabase_categories')->put($iconFilename, file_get_contents($file));
                $data['icon_url'] = $iconFilename;
            } catch (\Exception $e) {
                return response()->json(['error' => 'Gagal upload icon: ' . $e->getMessage()], 500);
            }
        }
        
        $category->update($data);
        
        return response()->json(['message' => 'Kategori diupdate', 'data' => $category]);
    }

    public function destroy(Category $category)
    {
        if ($category->icon_url) {
            $oldFilename = basename($category->icon_url);
            Storage::disk('supabase_categories')->delete($oldFilename);
        }
        
        $category->delete();
        return response()->json(['message' => 'Kategori dihapus']);
    }
}