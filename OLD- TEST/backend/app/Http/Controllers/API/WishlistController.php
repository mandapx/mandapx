<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlists = $request->user()->wishlists()
            ->with(['venue.city', 'venue.type', 'venue.primaryPhoto'])
            ->latest()
            ->get();

        return response()->json($wishlists);
    }

    public function toggle($venueId, Request $request)
    {
        $existing = Wishlist::where('user_id', $request->user()->id)
            ->where('venue_id', $venueId)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['wishlisted' => false, 'message' => 'Removed from wishlist']);
        }

        Wishlist::create([
            'user_id'  => $request->user()->id,
            'venue_id' => $venueId,
        ]);

        return response()->json(['wishlisted' => true, 'message' => 'Added to wishlist'], 201);
    }
}
