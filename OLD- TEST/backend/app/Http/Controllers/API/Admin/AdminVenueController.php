<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use Illuminate\Http\Request;

class AdminVenueController extends Controller
{
    public function index()
    {
        $venues = Venue::with(['type', 'city'])->latest()->get();
        return response()->json($venues);
    }

    public function pending()
    {
        $venues = Venue::with(['type', 'city'])->where('status', 'pending')->latest()->get();
        return response()->json($venues);
    }

    public function approve($id)
    {
        $venue = Venue::findOrFail($id);
        $venue->update([
            'status' => 'approved',
            'approved_at' => now()
        ]);
        return response()->json(['message' => 'Venue approved successfully', 'venue' => $venue]);
    }

    public function reject(Request $request, $id)
    {
        $venue = Venue::findOrFail($id);
        $venue->update([
            'status' => 'rejected',
            'rejection_reason' => $request->input('reason', 'Does not meet visual design standards')
        ]);
        return response()->json(['message' => 'Venue rejected successfully', 'venue' => $venue]);
    }

    public function toggleFeatured($id)
    {
        $venue = Venue::findOrFail($id);
        $venue->update([
            'featured' => !$venue->featured
        ]);
        return response()->json([
            'message' => $venue->featured ? 'Venue set as featured' : 'Venue removed from featured',
            'venue' => $venue
        ]);
    }

    public function destroy($id)
    {
        $venue = Venue::findOrFail($id);
        $venue->delete();
        return response()->json(['message' => 'Venue deleted successfully']);
    }
}
