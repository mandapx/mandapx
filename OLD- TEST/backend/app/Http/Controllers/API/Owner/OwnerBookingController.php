<?php

namespace App\Http\Controllers\API\Owner;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\VenueAvailability;
use Illuminate\Http\Request;

class OwnerBookingController extends Controller
{
    private function getOwnerVenueIds()
    {
        return auth()->user()->venueOwner->venues()->pluck('id');
    }

    public function index(Request $request)
    {
        $venueIds = $this->getOwnerVenueIds();

        $bookings = Booking::whereIn('venue_id', $venueIds)
            ->with(['user', 'venue', 'eventType', 'payment'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(10);

        return response()->json($bookings);
    }

    public function accept($id)
    {
        $booking = Booking::whereIn('venue_id', $this->getOwnerVenueIds())
            ->where('status', 'pending')
            ->findOrFail($id);

        if ($booking->isExpired()) {
            return response()->json(['message' => 'Booking request has expired (24h window passed)'], 422);
        }

        $booking->update([
            'status'      => 'accepted',
            'accepted_at' => now(),
        ]);

        return response()->json([
            'message' => 'Booking accepted. User will now complete the payment.',
            'booking' => $booking,
        ]);
    }

    public function decline(Request $request, $id)
    {
        $request->validate(['reason' => 'nullable|string|max:500']);

        $booking = Booking::whereIn('venue_id', $this->getOwnerVenueIds())
            ->where('status', 'pending')
            ->findOrFail($id);

        $booking->update([
            'status'         => 'declined',
            'declined_at'    => now(),
            'decline_reason' => $request->reason,
        ]);

        // Free up the date
        VenueAvailability::where('venue_id', $booking->venue_id)
            ->where('date', $booking->event_date)
            ->update(['status' => 'open']);

        return response()->json(['message' => 'Booking declined']);
    }

    public function updateAvailability(Request $request, $venueId)
    {
        $request->validate([
            'dates'  => 'required|array',
            'dates.*'=> 'date',
            'status' => 'required|in:open,blocked',
        ]);

        $owner = auth()->user()->venueOwner;
        $venue = $owner->venues()->findOrFail($venueId);

        foreach ($request->dates as $date) {
            VenueAvailability::updateOrCreate(
                ['venue_id' => $venue->id, 'date' => $date],
                ['status'   => $request->status]
            );
        }

        return response()->json(['message' => 'Availability updated']);
    }
}
