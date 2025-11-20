<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Product extends Model{
    use HasFactory, HasUuids;

    public function seller(){
        return $this->belongsTo(Seller::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images() {
        return $this->hasMany(ProductImage::class);
    }

    public function reviews(){
        return $this->hasMany(Review::class);
    }
};