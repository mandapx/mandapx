<?php

namespace App\Http\Controllers\API\Owner;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Venue;
use Illuminate\Http\Request;

class OwnerDashboardController extends Controller
{
    public function index(Request $request)
    {
        $owner    = auth()->user()->venueOwner;
        $venueIds = $owner->venues()->pluck('id');

        $totalVenues   = Venue::whereIn('id', $venueIds)->count();
        $totalBookings = Booking::whereIn('venue_id', $venueIds)->count();
        $pendingBookings = Booking::whereIn('venue_id', $venueIds)
            ->where('status', 'pending')->count();
        $confirmedBookings = Booking::whereIn('venue_id', $venueIds)
            ->where('status', 'confirmed')->count();
        $totalRevenue  = Booking::whereIn('venue_id', $venueIds)
            ->where('status', 'confirmed')
            ->sum('total_price');

        $recentBookings = Booking::whereIn('venue_id', $venueIds)
            ->with(['user', 'venue', 'eventType'])
            ->latest()
            ->take(5)
            ->get();

        // Calendar bookings: all non-cancelled bookings with dates
        $calendarBookings = Booking::whereIn('venue_id', $venueIds)
            ->whereNotIn('status', ['cancelled', 'declined'])
            ->with(['user', 'venue', 'eventType'])
            ->orderBy('event_date')
            ->get()
            ->map(fn($b) => [
                'id'         => $b->id,
                'day'        => (int) date('j', strtotime($b->event_date)),
                'month'      => strtoupper(date('M', strtotime($b->event_date))),
                'year'       => (int) date('Y', strtotime($b->event_date)),
                'client'     => strtoupper($b->user->name ?? 'CLIENT'),
                'type'       => strtoupper($b->eventType->name ?? $b->event_type ?? 'EVENT'),
                'time'       => ($b->start_time ?? '11:00 AM') . ' - ' . ($b->end_time ?? '11:00 PM'),
                'address'    => $b->user->address ?? ($b->venue->address ?? 'Venue Address'),
                'mobile'     => $b->user->phone ?? '—',
                'status'     => $b->status,
                'venue_name' => $b->venue->name ?? 'Venue',
                'guests'     => $b->guests_count,
                'total'      => $b->total_price,
            ]);

        return response()->json([
            'stats' => [
                'total_venues'      => $totalVenues,
                'total_bookings'    => $totalBookings,
                'pending_bookings'  => $pendingBookings,
                'confirmed_bookings'=> $confirmedBookings,
                'total_revenue'     => (float) $totalRevenue,
            ],
            'recent_bookings'   => $recentBookings,
            'calendar_bookings' => $calendarBookings,
        ]);
    }
}
