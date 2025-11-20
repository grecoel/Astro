<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasUuids;

    protected $fillable = ['product_id', 'image_path', 'is_primary'];
    protected $appends = ['image_url']; // Kirim URL otomatis ke React

    public function getImageUrlAttribute()
    {
        if (!$this->image_path) return null;
        if (str_starts_with($this->image_path, 'http')) return $this->image_path;

        $projectUrl = config('services.supabase.project_url');
        $bucketName = 'products'; // HARDCODE BUCKET 'products' DISINI
        $path = $this->image_path;

        return rtrim($projectUrl, '/') . "/storage/v1/object/public/{$bucketName}/" . ltrim($path, '/');
    }
}