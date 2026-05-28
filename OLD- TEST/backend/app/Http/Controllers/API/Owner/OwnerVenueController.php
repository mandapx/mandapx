<?php

namespace App\Http\Controllers\API\Owner;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use App\Models\VenueType;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OwnerVenueController extends Controller
{
    private function ownerVenues()
    {
        return auth()->user()->venueOwner->venues();
    }

    public function index(Request $request)
    {
        $venues = $this->ownerVenues()
            ->with(['type', 'city', 'amenities', 'photos'])
            ->latest()
            ->paginate(15);

        return response()->json($venues);
    }

    public function show($id)
    {
        $venue = $this->ownerVenues()
            ->with(['type', 'city', 'amenities', 'photos', 'eventTypes', 'availability'])
            ->findOrFail($id);

        return response()->json($venue);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:200',
            'description'      => 'nullable|string',
            'address'          => 'required|string',
            'area'             => 'required|string|max:100',
            'city_id'          => 'required|integer|exists:cities,id',
            'pincode'          => 'required|string|max:10',
            'state'            => 'required|string|max:100',
            'phone'            => 'required|string|max:20',
            'email'            => 'nullable|email',
            'website'          => 'nullable|string',
            'venue_type_id'    => 'required|integer|exists:venue_types,id',
            'category'         => 'required|in:indoor,outdoor,both',
            'capacity_min'     => 'required|integer|min:1',
            'capacity_max'     => 'required|integer|min:1',
            'price_per_plate'  => 'required|numeric|min:0',
            'parking'          => 'nullable|string',
            'power_backup'     => 'nullable|string',
            'rooms'            => 'nullable|string',
            'washrooms'        => 'nullable|string',
            'decoration_option'=> 'required|in:monopoly,open',
            'catering_option'  => 'required|in:monopoly,open',
            'food_menu'        => 'nullable|string',

            // Monopoly Decorator
            'decor_name'       => 'nullable|string',
            'decor_address'    => 'nullable|string',
            'decor_city'       => 'nullable|string',
            'decor_pincode'    => 'nullable|string',
            'decor_phone'      => 'nullable|string',
            'decor_owner'      => 'nullable|string',
            'decor_mobile'     => 'nullable|string',
            'decor_email'      => 'nullable|email',
            'decor_website'    => 'nullable|string',

            // Monopoly Caterer
            'caterer_name'     => 'nullable|string',
            'caterer_address'  => 'nullable|string',
            'caterer_city'     => 'nullable|string',
            'caterer_pincode'  => 'nullable|string',
            'caterer_phone'    => 'nullable|string',
            'caterer_owner'    => 'nullable|string',
            'caterer_mobile'   => 'nullable|string',
            'caterer_email'    => 'nullable|email',
            'caterer_website'  => 'nullable|string',

            // Bank Details
            'bank_name'        => 'required|string',
            'bank_account'     => 'required|string',
            'bank_ifsc'        => 'required|string',
            'account_holder'   => 'required|string',
        ]);

        $owner = auth()->user()->venueOwner;

        $venue = $owner->venues()->create([
            'name'              => $validated['name'],
            'slug'              => Str::slug($validated['name']) . '-' . Str::random(6),
            'description'       => $validated['description'] ?? null,
            'address'           => $validated['address'],
            'area'              => $validated['area'],
            'city_id'           => $validated['city_id'],
            'pincode'           => $validated['pincode'],
            'state'             => $validated['state'],
            'phone'             => $validated['phone'],
            'email'             => $validated['email'] ?? null,
            'website'           => $validated['website'] ?? null,
            'venue_type_id'     => $validated['venue_type_id'],
            'category'          => $validated['category'],
            'capacity_min'      => $validated['capacity_min'],
            'capacity_max'      => $validated['capacity_max'],
            'price_per_plate'   => $validated['price_per_plate'],
            'parking'           => $validated['parking'] ?? null,
            'power_backup'      => $validated['power_backup'] ?? null,
            'rooms'             => $validated['rooms'] ?? null,
            'washrooms'         => $validated['washrooms'] ?? null,
            'decoration_option' => $validated['decoration_option'],
            'catering_option'   => $validated['catering_option'],
            'food_menu'         => $validated['food_menu'] ?? null,
            // Decorator
            'decor_name'        => $validated['decor_name'] ?? null,
            'decor_address'     => $validated['decor_address'] ?? null,
            'decor_city'        => $validated['decor_city'] ?? null,
            'decor_pincode'     => $validated['decor_pincode'] ?? null,
            'decor_phone'       => $validated['decor_phone'] ?? null,
            'decor_owner'       => $validated['decor_owner'] ?? null,
            'decor_mobile'      => $validated['decor_mobile'] ?? null,
            'decor_email'       => $validated['decor_email'] ?? null,
            'decor_website'     => $validated['decor_website'] ?? null,
            // Caterer
            'caterer_name'      => $validated['caterer_name'] ?? null,
            'caterer_address'   => $validated['caterer_address'] ?? null,
            'caterer_city'      => $validated['caterer_city'] ?? null,
            'caterer_pincode'   => $validated['caterer_pincode'] ?? null,
            'caterer_phone'     => $validated['caterer_phone'] ?? null,
            'caterer_owner'     => $validated['caterer_owner'] ?? null,
            'caterer_mobile'    => $validated['caterer_mobile'] ?? null,
            'caterer_email'     => $validated['caterer_email'] ?? null,
            'caterer_website'   => $validated['caterer_website'] ?? null,
            // Bank
            'bank_name'         => $validated['bank_name'],
            'bank_account'      => $validated['bank_account'],
            'bank_ifsc'         => $validated['bank_ifsc'],
            'account_holder'    => $validated['account_holder'],
            'status'            => 'pending',
        ]);

        return response()->json([
            'message' => 'Venue submitted for admin moderation. You will be notified upon approval.',
            'venue'   => $venue,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $venue = $this->ownerVenues()->findOrFail($id);

        $venue->update($request->only([
            'name', 'description', 'address', 'area', 'pincode', 'state',
            'phone', 'email', 'website', 'category', 'capacity_min', 'capacity_max',
            'price_per_plate', 'parking', 'power_backup', 'rooms', 'washrooms',
            'decoration_option', 'catering_option', 'food_menu',
            'decor_name', 'decor_address', 'decor_city', 'decor_pincode',
            'decor_phone', 'decor_owner', 'decor_mobile', 'decor_email', 'decor_website',
            'caterer_name', 'caterer_address', 'caterer_city', 'caterer_pincode',
            'caterer_phone', 'caterer_owner', 'caterer_mobile', 'caterer_email', 'caterer_website',
            'bank_name', 'bank_account', 'bank_ifsc', 'account_holder',
        ]));

        return response()->json(['message' => 'Venue updated successfully', 'venue' => $venue]);
    }

    public function destroy($id)
    {
        $venue = $this->ownerVenues()->findOrFail($id);
        $venue->delete();
        return response()->json(['message' => 'Venue deleted']);
    }

    public function uploadPhotos(Request $request, $id)
    {
        $venue = $this->ownerVenues()->findOrFail($id);
        // Cloudinary upload integration placeholder
        return response()->json(['message' => 'Photos upload endpoint ready. Integrate Cloudinary SDK here.']);
    }
}
