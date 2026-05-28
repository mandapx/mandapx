<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use App\Models\City;
use App\Models\VenueType;
use App\Models\VenueCategory;
use App\Models\EventType;
use App\Models\Amenity;
use Illuminate\Http\Request;

class VenueController extends Controller
{
    public function index(Request $request)
    {
        $query = Venue::approved()
            ->with(['city', 'type', 'primaryPhoto', 'eventTypes']);

        // Search
        if ($request->filled('q')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->q . '%')
                  ->orWhere('description', 'like', '%' . $request->q . '%')
                  ->orWhere('area', 'like', '%' . $request->q . '%');
            });
        }

        // Filters
        if ($request->filled('city_id'))      $query->where('city_id', $request->city_id);
        if ($request->filled('type_id'))      $query->where('type_id', $request->type_id);
        if ($request->filled('category'))     $query->where('category', $request->category);
        if ($request->filled('min_capacity')) $query->where('capacity_max', '>=', $request->min_capacity);
        if ($request->filled('max_capacity')) $query->where('capacity_min', '<=', $request->max_capacity);
        if ($request->filled('min_price'))    $query->where('price_min', '>=', $request->min_price);
        if ($request->filled('max_price'))    $query->where('price_min', '<=', $request->max_price);
        if ($request->filled('parking'))      $query->where('parking_available', true);
        if ($request->filled('power_backup')) $query->where('power_backup', true);
        if ($request->filled('alcohol'))      $query->where('alcohol_allowed', true);

        if ($request->filled('event_type_id')) {
            $query->whereHas('eventTypes', fn($q) => $q->where('event_type_id', $request->event_type_id));
        }

        if ($request->filled('amenity_ids')) {
            $ids = explode(',', $request->amenity_ids);
            foreach ($ids as $id) {
                $query->whereHas('amenities', fn($q) => $q->where('amenity_id', $id));
            }
        }

        // Sort
        match($request->get('sort', 'relevance')) {
            'price_asc'   => $query->orderBy('price_min', 'asc'),
            'price_desc'  => $query->orderBy('price_min', 'desc'),
            'rating'      => $query->orderBy('avg_rating', 'desc'),
            'newest'      => $query->orderBy('approved_at', 'desc'),
            default       => $query->orderBy('featured', 'desc')->orderBy('avg_rating', 'desc'),
        };

        $venues = $query->paginate($request->get('per_page', 12));

        return response()->json($venues);
    }

    public function show($slug)
    {
        $venue = Venue::approved()
            ->with(['city', 'type', 'photos', 'eventTypes', 'amenities',
                    'owner.user', 'reviews' => fn($q) => $q->with('user')->latest()->take(10)])
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment views
        $venue->increment('views_count');

        return response()->json($venue);
    }

    public function filters()
    {
        $categories = VenueCategory::with(['subcategories.venueTypes'])
            ->where('active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'icon' => $category->icon,
                    'image' => $category->image,
                    'description' => $category->description,
                    'subcategories' => $category->subcategories
                        ->where('active', true)
                        ->map(function ($subcategory) {
                            return [
                                'id' => $subcategory->id,
                                'name' => $subcategory->name,
                                'slug' => $subcategory->slug,
                                'icon' => $subcategory->icon,
                                'image' => $subcategory->image,
                                'description' => $subcategory->description,
                                'venue_types' => $subcategory->venueTypes
                                    ->where('active', true)
                                    ->map(fn ($type) => [
                                        'id' => $type->id,
                                        'name' => $type->name,
                                        'slug' => $type->slug,
                                        'icon' => $type->icon,
                                        'description' => $type->description,
                                    ])
                                    ->values(),
                            ];
                        })
                        ->values(),
                ];
            });

        return response()->json([
            'categories'  => $categories,
            'cities'      => City::orderBy('name')->get(['id', 'name', 'slug']),
            'event_types' => EventType::where('active', true)->orderBy('sort_order')->get(),
            'amenities'   => Amenity::where('active', true)->get(),
        ]);
    }

    public function availability($id, Request $request)
    {
        $request->validate(['month' => 'required|date_format:Y-m']);
        $venue = Venue::approved()->findOrFail($id);

        [$year, $month] = explode('-', $request->month);
        $availability = $venue->availability()
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get(['date', 'status']);

        return response()->json($availability);
    }

    public function featured()
    {
        $venues = Venue::approved()->featured()
            ->with(['city', 'type', 'primaryPhoto'])
            ->take(8)->get();
        return response()->json($venues);
    }
}
