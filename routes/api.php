<?php
use App\Http\Controllers\Api\SellerController;
use Illuminate\Support\Facades\Route;


// SRS-01: Route untuk registrasi seller (POST /api/sellers)
Route::post('/sellers', [SellerController::class, 'store']);