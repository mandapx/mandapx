<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Venue;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_venues' => Venue::count(),
            'pending_venues' => Venue::where('status', 'pending')->count(),
            'total_bookings' => Booking::count(),
            'total_users' => User::count(),
            'total_owners' => User::where('role', 'owner')->count(),
            'total_revenue' => Payment::where('status', 'captured')->sum('amount') / 100, // stored in paise
        ];

        $recent_bookings = Booking::with(['user', 'venue'])
            ->latest()
            ->take(5)
            ->get();

        $recent_venues = Venue::with('type')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'stats' => $stats,
            'recent_bookings' => $recent_bookings,
            'recent_venues' => $recent_venues
        ]);
    }

    public function analytics()
    {
        $revenue_by_month = Payment::where('status', 'captured')
            ->selectRaw('SUM(amount)/100 as total, MONTHNAME(created_at) as month')
            ->groupBy('month')
            ->get();

        $bookings_by_status = Booking::selectRaw('COUNT(*) as count, status')
            ->groupBy('status')
            ->get();

        return response()->json([
            'revenue_by_month' => $revenue_by_month,
            'bookings_by_status' => $bookings_by_status
        ]);
    }
}
