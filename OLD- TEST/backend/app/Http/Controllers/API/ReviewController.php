<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Venue;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index($venueId)
    {
        $reviews = Review::where('venue_id', $venueId)
            ->where('status', 'approved')
            ->with('user:id,name,avatar')
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'rating'     => 'required|integer|min:1|max:5',
            'title'      => 'nullable|string|max:255',
            'body'       => 'required|string|max:5000',
            'photos'     => 'nullable|array',
            'photos.*'   => 'string',
        ]);

        $booking = $request->user()->bookings()
            ->where('id', $data['booking_id'])
            ->where('status', 'completed')
            ->firstOrFail();

        $existing = Review::where('booking_id', $data['booking_id'])
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($existing) {
            return response()->json(['message' => 'You have already reviewed this booking'], 409);
        }

        $data['user_id']  = $request->user()->id;
        $data['venue_id'] = $booking->venue_id;

        $review = Review::create($data);

        return response()->json($review, 201);
    }

    public function markHelpful($id, Request $request)
    {
        $review = Review::findOrFail($id);
        $review->increment('helpful_count');

        return response()->json(['helpful_count' => $review->fresh()->helpful_count]);
    }

    public function ownerIndex(Request $request)
    {
        $owner  = $request->user()->venueOwner;
        $venues = Venue::where('owner_id', $owner->id)->pluck('id');

        $reviews = Review::whereIn('venue_id', $venues)
            ->with('user:id,name,avatar')
            ->with('venue:id,name,slug')
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }

    public function reply($id, Request $request)
    {
        $data = $request->validate(['reply' => 'required|string|max:5000']);

        $owner  = $request->user()->venueOwner;
        $review = Review::whereHas('venue', fn($q) => $q->where('owner_id', $owner->id))
            ->findOrFail($id);

        $review->update([
            'owner_reply'      => $data['reply'],
            'owner_replied_at' => now(),
        ]);

        return response()->json($review);
    }
}
