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
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ReportController;


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
        Route::get('/products', [SellerProductController::class, 'index']);
        Route::get('/products/create', [SellerProductController::class, 'create']); 
        Route::post('/products', [SellerProductController::class, 'store']);
    });
    
    // ADMIN ROUTES
    Route::prefix('admin')->middleware('admin')->group(function () {
        
        // Dashboard Statistics (SRS-MartPlace-07)
        Route::get('/dashboard', [DashboardController::class, 'index']);
        
        // Seller Status Toggle - Aktifkan/Nonaktifkan seller
        Route::post('/sellers/{seller}/toggle-status', [DashboardController::class, 'toggleSellerStatus']);
        
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

        // 4. Reports - Laporan Penjual
        Route::get('/reports/sellers/data', [ReportController::class, 'getSellersData']);
        Route::get('/reports/sellers/pdf', [ReportController::class, 'generateSellersPdf']);
        
        // 5. Reports - Laporan Penjual Per Provinsi
        Route::get('/reports/sellers/province/data', [ReportController::class, 'getSellersDataByProvince']);
        Route::get('/reports/sellers/province/pdf', [ReportController::class, 'generateSellersByProvincePdf']);
        
        // 6. Reports - Laporan Produk Berdasarkan Rating
        Route::get('/reports/products/rating/data', [ReportController::class, 'getProductsByRatingData']);
        Route::get('/reports/products/rating/pdf', [ReportController::class, 'generateProductsByRatingPdf']);
    });

});