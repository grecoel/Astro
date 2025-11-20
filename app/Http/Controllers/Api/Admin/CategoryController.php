<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    // GET /api/admin/categories
    public function index()
    {
        return response()->json(['data' => Category::orderBy('name')->get()]);
    }

    // POST /api/admin/categories
    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255|unique:categories']);
        
        $category = Category::create(['name' => $request->name]);
        
        return response()->json(['message' => 'Kategori dibuat', 'data' => $category]);
    }

    // PUT /api/admin/categories/{id}
    public function update(Request $request, Category $category)
    {
        $request->validate(['name' => 'required|string|max:255|unique:categories,name,' . $category->id]);
        
        $category->update(['name' => $request->name]);
        
        return response()->json(['message' => 'Kategori diupdate', 'data' => $category]);
    }

    // DELETE /api/admin/categories/{id}
    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json(['message' => 'Kategori dihapus']);
    }
}