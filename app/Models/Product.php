<?php

namespace App/Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Product extends Model{
    use HasFactory, HasUuid;

    public function seller(){
        return $this->belongsTo(Seller::class);
    }

    

    public function reviews(){
        return $this->hasMany(Review::class);
    }
}