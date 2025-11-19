<?php
use App\Http\Controllers\Api\SellerController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\SellerVerificationController;
use App\Http\Controllers\Api\AuthController;


// SRS-01: Route untuk registrasi seller (POST /api/sellers)
Route::post('/sellers', [SellerController::class, 'store']);

// Auth routes - using token authentication
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/pending-sellers', [SellerVerificationController::class, 'index']);
        Route::get('/sellers/{seller}', [SellerVerificationController::class, 'show']);
        Route::post('/sellers/{seller}/verify', [SellerVerificationController::class, 'verify']);
    });
});