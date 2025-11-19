<?php

namespace App\Models;

use App\Enums\SellerStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Seller extends Model
{
    use HasFactory, HasUuids, Notifiable;

    protected $fillable = [
        'store_name',
        'store_description',
        'pic_name',
        'pic_phone',
        'pic_email',
        'pic_address',
        'pic_rt',
        'pic_rw',
        'pic_district',
        'pic_city',
        'pic_province',
        'pic_ktp_number',
        'pic_photo_path',
        'pic_ktp_file_path',
    ];

    protected $casts = [
        'status' => SellerStatus::class,
    ];

    public function products() {
        return $this->hasMany(Product::class);
    }

    public function routeNotificationForMail($notification){
        return $this->pic_email;
    }

/**
     * Field tambahan yang akan dikirim ke JSON (Frontend).
     */
    protected $appends = ['ktp_url', 'photo_url'];

    /**
     * Accessor untuk URL KTP
     * Cara panggil: $seller->ktp_url
     */
    public function getKtpUrlAttribute()
    {
        if (!$this->pic_ktp_file_path) return null;

        if (str_starts_with($this->pic_ktp_file_path, 'http')) {
            return $this->pic_ktp_file_path;
        }

        $projectUrl = config('services.supabase.url'); 
        $bucketName = config('services.supabase.bucket');
        $path       = $this->pic_ktp_file_path;

        $projectUrl = rtrim($projectUrl, '/');
        $path       = ltrim($path, '/');

        return "{$projectUrl}/storage/v1/object/public/{$bucketName}/{$path}";
    }

    public function getPhotoUrlAttribute()
    {
        if (!$this->pic_photo_path) return null;

        if (str_starts_with($this->pic_photo_path, 'http')) {
            return $this->pic_photo_path;
        }

        $projectUrl = config('services.supabase.url');
        $bucketName = config('services.supabase.bucket');
        $path       = $this->pic_photo_path;

        $projectUrl = rtrim($projectUrl, '/');
        $path       = ltrim($path, '/');

        return "{$projectUrl}/storage/v1/object/public/{$bucketName}/{$path}";
    }
};
