<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Auth\AuthController;
use App\Http\Controllers\API\VenueController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\WishlistController;
use App\Http\Controllers\API\CityController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\Owner\OwnerVenueController;
use App\Http\Controllers\API\Owner\OwnerBookingController;
use App\Http\Controllers\API\Owner\OwnerDashboardController;
use App\Http\Controllers\API\Admin\AdminVenueController;
use App\Http\Controllers\API\Admin\AdminUserController;
use App\Http\Controllers\API\Admin\AdminBookingController;
use App\Http\Controllers\API\Admin\AdminDashboardController;
use App\Http\Controllers\API\Admin\AdminCategoryController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('register',         [AuthController::class, 'register']);
    Route::post('login',            [AuthController::class, 'login']);
    Route::post('forgot-password',  [AuthController::class, 'forgotPassword']);
    Route::post('reset-password',   [AuthController::class, 'resetPassword']);
});

// Venues - public
Route::get('venues',                  [VenueController::class, 'index']);
Route::get('venues/featured',         [VenueController::class, 'featured']);
Route::get('venues/filters',          [VenueController::class, 'filters']);
Route::get('venues/{slug}',           [VenueController::class, 'show']);
Route::get('venues/{id}/availability',[VenueController::class, 'availability']);
Route::get('venues/{id}/reviews',     [ReviewController::class, 'index']);

// Cities & lookups - public
Route::get('cities',                  [CityController::class, 'index']);
Route::get('cities/{slug}',           [CityController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes (all roles)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('auth/me',              [AuthController::class, 'me']);
    Route::post('auth/logout',         [AuthController::class, 'logout']);
    Route::put('auth/profile',         [AuthController::class, 'updateProfile']);
    Route::put('auth/password',        [AuthController::class, 'changePassword']);

    // Bookings (user)
    Route::get('bookings',             [BookingController::class, 'index']);
    Route::post('bookings',            [BookingController::class, 'store']);
    Route::get('bookings/{id}',        [BookingController::class, 'show']);
    Route::put('bookings/{id}/cancel', [BookingController::class, 'cancel']);

    // Payments
    Route::post('payments/order',      [PaymentController::class, 'createOrder']);
    Route::post('payments/verify',     [PaymentController::class, 'verify']);

    // Reviews (user)
    Route::post('reviews',             [ReviewController::class, 'store']);
    Route::put('reviews/{id}/helpful', [ReviewController::class, 'markHelpful']);

    // Wishlist (user)
    Route::get('wishlist',             [WishlistController::class, 'index']);
    Route::post('wishlist/{venueId}',  [WishlistController::class, 'toggle']);

    /*
    |----------------------------------------------------------------------
    | Owner Routes
    |----------------------------------------------------------------------
    */
    Route::middleware('role:owner')->prefix('owner')->group(function () {

        Route::get('dashboard',              [OwnerDashboardController::class, 'index']);

        // Venue management
        Route::get('venues',                 [OwnerVenueController::class, 'index']);
        Route::post('venues',                [OwnerVenueController::class, 'store']);
        Route::get('venues/{id}',            [OwnerVenueController::class, 'show']);
        Route::put('venues/{id}',            [OwnerVenueController::class, 'update']);
        Route::delete('venues/{id}',         [OwnerVenueController::class, 'destroy']);
        Route::post('venues/{id}/photos',    [OwnerVenueController::class, 'uploadPhotos']);
        Route::delete('photos/{id}',         [OwnerVenueController::class, 'deletePhoto']);

        // Bookings management
        Route::get('bookings',               [OwnerBookingController::class, 'index']);
        Route::put('bookings/{id}/accept',   [OwnerBookingController::class, 'accept']);
        Route::put('bookings/{id}/decline',  [OwnerBookingController::class, 'decline']);
        Route::post('venues/{id}/availability', [OwnerBookingController::class, 'updateAvailability']);

        // Reviews management
        Route::get('reviews',                [ReviewController::class, 'ownerIndex']);
        Route::put('reviews/{id}/reply',     [ReviewController::class, 'reply']);
    });

    /*
    |----------------------------------------------------------------------
    | Admin Routes
    |----------------------------------------------------------------------
    */
    Route::middleware('role:admin')->prefix('admin')->group(function () {

        Route::get('dashboard',              [AdminDashboardController::class, 'index']);

        // Venue moderation
        Route::get('venues',                 [AdminVenueController::class, 'index']);
        Route::get('venues/pending',         [AdminVenueController::class, 'pending']);
        Route::put('venues/{id}/approve',    [AdminVenueController::class, 'approve']);
        Route::put('venues/{id}/reject',     [AdminVenueController::class, 'reject']);
        Route::put('venues/{id}/feature',    [AdminVenueController::class, 'toggleFeatured']);
        Route::delete('venues/{id}',         [AdminVenueController::class, 'destroy']);

        // User management
        Route::get('users',                  [AdminUserController::class, 'index']);
        Route::get('users/{id}',             [AdminUserController::class, 'show']);
        Route::put('users/{id}/ban',         [AdminUserController::class, 'ban']);
        Route::put('users/{id}/unban',       [AdminUserController::class, 'unban']);

        // Bookings
        Route::get('bookings',               [AdminBookingController::class, 'index']);
        Route::get('bookings/{id}',          [AdminBookingController::class, 'show']);

        // Category management
        Route::get('categories',             [AdminCategoryController::class, 'index']);
        Route::get('categories/{id}',        [AdminCategoryController::class, 'show']);
        Route::post('categories',            [AdminCategoryController::class, 'store']);
        Route::put('categories/{id}',        [AdminCategoryController::class, 'update']);
        Route::delete('categories/{id}',     [AdminCategoryController::class, 'destroy']);
        Route::put('categories/{id}/reorder',[AdminCategoryController::class, 'reorder']);

        // Subcategory management
        Route::post('categories/{categoryId}/subcategories',                [AdminCategoryController::class, 'storeSubcategory']);
        Route::put('subcategories/{id}',                                    [AdminCategoryController::class, 'updateSubcategory']);
        Route::delete('subcategories/{id}',                                 [AdminCategoryController::class, 'destroySubcategory']);
        Route::put('categories/{categoryId}/subcategories/reorder',         [AdminCategoryController::class, 'reorderSubcategories']);

        // Venue type management
        Route::post('subcategories/{subcategoryId}/venue-types',            [AdminCategoryController::class, 'storeVenueType']);
        Route::put('venue-types/{id}',                                      [AdminCategoryController::class, 'updateVenueType']);
        Route::delete('venue-types/{id}',                                   [AdminCategoryController::class, 'destroyVenueType']);
        Route::put('subcategories/{subcategoryId}/venue-types/reorder',     [AdminCategoryController::class, 'reorderVenueTypes']);
    });
});
