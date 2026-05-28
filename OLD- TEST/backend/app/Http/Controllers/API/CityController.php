<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function index()
    {
        $cities = City::orderBy('name')
            ->get(['id', 'name', 'state', 'country', 'slug', 'image', 'featured', 'venue_count']);

        return response()->json($cities);
    }

    public function show($slug)
    {
        $city = City::where('slug', $slug)
            ->withCount('venues')
            ->firstOrFail();

        $city->load(['venues' => fn($q) => $q->approved()->with(['city', 'type', 'primaryPhoto'])->take(20)]);

        return response()->json($city);
    }
}
