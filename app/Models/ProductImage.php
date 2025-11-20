<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ProductImage extends Model
{
    use HasUuids;
    protected $fillable = ['product_id', 'image_path', 'is_primary'];
    protected $appends = ['image_url'];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function getImageUrlAttribute()
    {
        if (!$this->image_path) return null;
        if (str_starts_with($this->image_path, 'http')) return $this->image_path;

        // Construct Supabase URL
        $supabaseUrl = config('services.supabase.url') ?? env('SUPABASE_URL');
        $bucketName = 'products';

        return rtrim($supabaseUrl, '/') . "/storage/v1/object/public/{$bucketName}/" . ltrim($this->image_path, '/');
    }
}