<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SellerController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ActivationController;
use App\Http\Controllers\Api\SellerProductController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\ReviewController;
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
Route::get('/catalog/{id}', [CatalogController::class, 'show']);

// Review Routes
Route::post('/reviews', [ReviewController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    
    // Common Auth Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Seller Routes
    Route::prefix('seller')->group(function () {
        Route::get('/status', [SellerController::class, 'getActivationStatus']);
        
        // Dashboard data endpoints
        Route::get('/dashboard/products', [SellerController::class, 'getProducts']);
        Route::get('/dashboard/reviews', [SellerController::class, 'getReviews']);
        Route::get('/dashboard/stats', [SellerController::class, 'getStats']);
        Route::get('/dashboard/data', [SellerController::class, 'getDashboardData']); // Comprehensive dashboard data
        
        // PDF Report Generation
        Route::get('/reports/{type}', [SellerController::class, 'generateReport']);
        
        // Product management (existing)
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
        Route::apiResource('categories', CategoryController::class);

        //3. banner management
        Route::apiResource('banners', BannerController::class);
        Route::post('banners/{banner}/toggle', [BannerController::class, 'toggleActive']);
    });

});