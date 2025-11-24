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

    protected $appends = ['icon_full_url'];

    public function getIconFullUrlAttribute()
    {
        // Jika icon_url kosong, kembalikan null
        if (!$this->icon_url) return null;

        // Jika sudah URL lengkap (http...), kembalikan apa adanya
        if (str_starts_with($this->icon_url, 'http')) {
            return $this->icon_url;
        }

        // Jika isinya cuma path, lengkapi dengan Supabase URL
        $projectUrl = config('services.supabase.url');
        $bucketName = 'categories'; 

        $projectUrl = rtrim($projectUrl, '/');
        $path = ltrim($this->icon_url, '/');

        return "{$projectUrl}/storage/v1/object/public/{$bucketName}/{$path}";
    }

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