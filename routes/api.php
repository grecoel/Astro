<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SellerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\Admin\SellerVerificationController;

/*
|--------------------------------------------------------------------------
| Public Routes (tanpa login)
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/seller/register', [SellerController::class, 'register']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/category/{id}', [ProductController::class, 'byCategory']);
Route::get('/products/seller/{id}', [ProductController::class, 'bySeller']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/banners', [BannerController::class, 'index']);

Route::get('/reviews', [ReviewController::class, 'index']);
Route::get('/reviews/{id}', [ReviewController::class, 'show']);


/*
|--------------------------------------------------------------------------
| Protected Routes (Semua user login)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'user']);

    // Review (user umum, seller, admin boleh kasih review)
    Route::post('/reviews', [ReviewController::class, 'store']);
});


/*
|--------------------------------------------------------------------------
| Admin Routes (role = admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    // Seller Management
    Route::get('/admin/sellers', [SellerController::class, 'index']);
    Route::get('/admin/sellers/{id}', [SellerController::class, 'show']);
    Route::put('/admin/sellers/{id}', [SellerController::class, 'update']);
    Route::post('/admin/sellers/{id}/verify', [SellerController::class, 'verifyStatus']);

    // Category CRUD
    Route::apiResource('/categories', CategoryController::class)
        ->except(['index']); // index sudah public

    // Banner CRUD
    Route::apiResource('/banners', BannerController::class)
        ->except(['index']); // index sudah public

    // Optional: admin kelola semua produk
    Route::apiResource('/admin/products', ProductController::class);
});


/*
|--------------------------------------------------------------------------
| Seller Routes (role = seller)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'seller'])->group(function () {

    // CRUD produk
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // List produk milik seller login
    Route::get('/seller/products', function () {
        return \App\Models\Product::where('seller_id', \Illuminate\Support\Facades\Auth::id())->get();
    });
});

    Route::get('/user', [AuthController::class, 'user']);
    
    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/pending-sellers', [SellerVerificationController::class, 'index']);
        Route::get('/sellers/{seller}', [SellerVerificationController::class, 'show']);
        Route::post('/sellers/{seller}/verify', [SellerVerificationController::class, 'verify']);
    });