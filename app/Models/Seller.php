<?php

namespace App\Models;

use App\Enums\SellerStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Seller extends Model
{
    use HasFactory, HasUuids;

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

    public function products()
    {
        return $this->hasMany(Product::class);
    }
};
