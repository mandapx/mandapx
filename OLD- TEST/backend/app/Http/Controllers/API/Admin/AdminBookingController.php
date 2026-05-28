<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['user', 'venue'])->latest()->get();
        return response()->json($bookings);
    }

    public function show($id)
    {
        $booking = Booking::with(['user', 'venue', 'payment'])->findOrFail($id);
        return response()->json($booking);
    }
}
