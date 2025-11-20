<?php
use App\Http\Controllers\Api\SellerController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\SellerVerificationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ActivationController;


// SRS-01: Route untuk registrasi seller (POST /api/sellers)
Route::post('/sellers', [SellerController::class, 'store']);

// Auth routes - using token authentication
Route::post('/login', [AuthController::class, 'login']);

// Activation routes
Route::post('/validate-token', [ActivationController::class, 'validateToken']);
Route::post('/aktivasi-akun', [ActivationController::class, 'activate']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Seller routes
    Route::prefix('seller')->group(function () {
        Route::get('/status', [SellerController::class, 'getActivationStatus']);
    });
    
    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/pending-sellers', [SellerVerificationController::class, 'index']);
        Route::get('/sellers/{seller}', [SellerVerificationController::class, 'show']);
        Route::post('/sellers/{seller}/verify', [SellerVerificationController::class, 'verify']);
    });
});