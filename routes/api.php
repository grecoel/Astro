<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SellerController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ActivationController;
use App\Http\Controllers\Api\SellerProductController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\Admin\SellerVerificationController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\BannerController;


// SRS-01: Registrasi Seller
Route::post('/sellers', [SellerController::class, 'store']);

// Auth & Activation
Route::post('/login', [AuthController::class, 'login']);
Route::post('/validate-token', [ActivationController::class, 'validateToken']);
Route::post('/aktivasi-akun', [ActivationController::class, 'activate']);
Route::get('/catalog', [CatalogController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    
    // Common Auth Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Seller Routes
    Route::prefix('seller')->group(function () {
        Route::get('/status', [SellerController::class, 'getActivationStatus']);
        Route::get('/products', [SellerProductController::class, 'index']);
        Route::get('/products/create', [SellerProductController::class, 'create']); 
        Route::post('/products', [SellerProductController::class, 'store']);
    });
    
    // ADMIN ROUTES
    Route::prefix('admin')->middleware('admin')->group(function () {
        
        // 1. Seller Verification (SRS-02)
        Route::get('/pending-sellers', [SellerVerificationController::class, 'index']);
        Route::get('/sellers/{seller}', [SellerVerificationController::class, 'show']);
        Route::post('/sellers/{seller}/verify', [SellerVerificationController::class, 'verify']);

        // 2. Category Management
        // 'apiResource' otomatis membuat rute: index, store, show, update, destroy
        Route::apiResource('categories', CategoryController::class);

        //3. banner management
        Route::apiResource('banners', BannerController::class);
        Route::post('banners/{banner}/toggle', [BannerController::class, 'toggleActive']);
    });

});