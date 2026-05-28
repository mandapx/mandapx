<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Venue;
use App\Models\VenueAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'venue_id'             => 'required|exists:venues,id',
            'event_type_id'        => 'nullable|exists:event_types,id',
            'event_date'           => 'required|date|after:today',
            'event_time'           => 'nullable|string',
            'guest_count'          => 'required|integer|min:1',
            'special_requirements' => 'nullable|string|max:1000',
        ]);

        $venue = Venue::approved()->findOrFail($validated['venue_id']);

        // Check availability
        $blocked = VenueAvailability::where('venue_id', $venue->id)
            ->where('date', $validated['event_date'])
            ->whereIn('status', ['blocked', 'booked'])
            ->exists();

        if ($blocked) {
            return response()->json(['message' => 'Venue is not available on selected date'], 422);
        }

        $booking = Booking::create([
            ...$validated,
            'user_id'  => auth()->id(),
            'status'   => 'pending',
        ]);

        // Mark date as booked
        VenueAvailability::updateOrCreate(
            ['venue_id' => $venue->id, 'date' => $validated['event_date']],
            ['status' => 'booked']
        );

        return response()->json([
            'message' => 'Booking request sent! Venue owner will respond within 24 hours.',
            'booking' => $booking->load('venue.city', 'eventType'),
        ], 201);
    }

    public function index(Request $request)
    {
        $bookings = Booking::where('user_id', auth()->id())
            ->with(['venue.primaryPhoto', 'venue.city', 'eventType', 'payment'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(10);

        return response()->json($bookings);
    }

    public function show($id)
    {
        $booking = Booking::where('user_id', auth()->id())
            ->with(['venue', 'eventType', 'payment', 'review'])
            ->findOrFail($id);

        return response()->json($booking);
    }

    public function cancel(Request $request, $id)
    {
        $booking = Booking::where('user_id', auth()->id())
            ->whereIn('status', ['pending', 'accepted'])
            ->findOrFail($id);

        $request->validate(['reason' => 'nullable|string|max:500']);

        $booking->update([
            'status'              => 'cancelled',
            'cancelled_at'        => now(),
            'cancellation_reason' => $request->reason,
        ]);

        // Free up the date
        VenueAvailability::where('venue_id', $booking->venue_id)
            ->where('date', $booking->event_date)
            ->update(['status' => 'open']);

        return response()->json(['message' => 'Booking cancelled successfully']);
    }
}
