<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'icon_url', 
    ];

    public function getIconUrlAttribute($value)
    {
        // Jika database kosong, kembalikan null
        if (!$value) return null;

        // Jika di database sudah tersimpan link lengkap (http...), kembalikan apa adanya
        if (str_starts_with($value, 'http')) {
            return $value;
        }

        // Jika isinya cuma path (misal: "categories/foto.jpg"), kita lengkapi
        $projectUrl = config('services.supabase.url');
        $bucketName = 'categories'; 

        // Bersihkan slash
        $projectUrl = rtrim($projectUrl, '/');
        $path = ltrim($value, '/');

        // Gabungkan jadi URL lengkap
        return "{$projectUrl}/storage/v1/object/public/{$bucketName}/{$path}";
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}