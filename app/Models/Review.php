<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Review extends Model
{
    use HasUuids;

    protected $fillable = [
        'product_id',
        'reviewer_name',
        'reviewer_phone',   
        'reviewer_email',   
        'reviewer_province',
        'reviewer_city',     
        'rating',
        'comment'
    ];

    protected $casts = [
        'rating' => 'double',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}