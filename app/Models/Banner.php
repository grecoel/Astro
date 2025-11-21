<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory, HasUuids;

    // Sesuaikan dengan kolom di gambar database Anda
    protected $fillable = [
        'title',
        'image_url',
        'link_url',
        'condition', 
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Agar URL otomatis muncul di JSON
    protected $appends = ['image_full_url'];

    // ACCESSOR URL LENGKAP
    public function getImageFullUrlAttribute()
    {
        if (!$this->image_url) return null;
        if (str_starts_with($this->image_url, 'http')) return $this->image_url;

        $projectUrl = config('services.supabase.url');
        $bucketName = 'banners'; // Hardcode bucket
        $path = $this->image_url;

        return rtrim($projectUrl, '/') . "/storage/v1/object/public/{$bucketName}/" . ltrim($path, '/');
    }
}