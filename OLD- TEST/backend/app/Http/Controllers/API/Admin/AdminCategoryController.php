<?php

namespace App\Http\Controllers\API\Admin;

use App\Models\VenueCategory;
use App\Models\VenueSubcategory;
use App\Models\VenueType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminCategoryController
{
    public function index(): JsonResponse
    {
        $categories = VenueCategory::with(['subcategories.venueTypes'])
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => $categories,
            'message' => 'Categories retrieved successfully'
        ]);
    }

    public function show($id): JsonResponse
    {
        $category = VenueCategory::with(['subcategories.venueTypes'])
            ->findOrFail($id);

        return response()->json([
            'data' => $category,
            'message' => 'Category retrieved successfully'
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|unique:venue_categories|string|max:255',
            'slug' => 'required|unique:venue_categories|string|max:255',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'sort_order' => 'integer|min:0',
            'active' => 'boolean',
        ]);

        $category = VenueCategory::create($validated);

        return response()->json([
            'data' => $category,
            'message' => 'Category created successfully'
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $category = VenueCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|unique:venue_categories,name,' . $id . '|string|max:255',
            'slug' => 'required|unique:venue_categories,slug,' . $id . '|string|max:255',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'sort_order' => 'integer|min:0',
            'active' => 'boolean',
        ]);

        $category->update($validated);

        return response()->json([
            'data' => $category,
            'message' => 'Category updated successfully'
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $category = VenueCategory::findOrFail($id);
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }

    public function storeSubcategory(Request $request, $categoryId): JsonResponse
    {
        $category = VenueCategory::findOrFail($categoryId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'sort_order' => 'integer|min:0',
            'active' => 'boolean',
        ]);

        $validated['category_id'] = $categoryId;
        $subcategory = VenueSubcategory::create($validated);

        return response()->json([
            'data' => $subcategory,
            'message' => 'Subcategory created successfully'
        ], 201);
    }

    public function updateSubcategory(Request $request, $id): JsonResponse
    {
        $subcategory = VenueSubcategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'sort_order' => 'integer|min:0',
            'active' => 'boolean',
        ]);

        $subcategory->update($validated);

        return response()->json([
            'data' => $subcategory,
            'message' => 'Subcategory updated successfully'
        ]);
    }

    public function destroySubcategory($id): JsonResponse
    {
        $subcategory = VenueSubcategory::findOrFail($id);
        $subcategory->delete();

        return response()->json([
            'message' => 'Subcategory deleted successfully'
        ]);
    }

    public function storeVenueType(Request $request, $subcategoryId): JsonResponse
    {
        $subcategory = VenueSubcategory::findOrFail($subcategoryId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'sort_order' => 'integer|min:0',
            'active' => 'boolean',
        ]);

        $validated['subcategory_id'] = $subcategoryId;
        $venueType = VenueType::create($validated);

        return response()->json([
            'data' => $venueType,
            'message' => 'Venue type created successfully'
        ], 201);
    }

    public function updateVenueType(Request $request, $id): JsonResponse
    {
        $venueType = VenueType::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'sort_order' => 'integer|min:0',
            'active' => 'boolean',
        ]);

        $venueType->update($validated);

        return response()->json([
            'data' => $venueType,
            'message' => 'Venue type updated successfully'
        ]);
    }

    public function destroyVenueType($id): JsonResponse
    {
        $venueType = VenueType::findOrFail($id);
        $venueType->delete();

        return response()->json([
            'message' => 'Venue type deleted successfully'
        ]);
    }

    public function reorder(Request $request, $categoryId): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer',
            'items.*.sort_order' => 'required|integer',
        ]);

        foreach ($validated['items'] as $item) {
            VenueCategory::where('id', $item['id'])
                ->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json([
            'message' => 'Categories reordered successfully'
        ]);
    }

    public function reorderSubcategories(Request $request, $categoryId): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer',
            'items.*.sort_order' => 'required|integer',
        ]);

        foreach ($validated['items'] as $item) {
            VenueSubcategory::where('id', $item['id'])
                ->where('category_id', $categoryId)
                ->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json([
            'message' => 'Subcategories reordered successfully'
        ]);
    }

    public function reorderVenueTypes(Request $request, $subcategoryId): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer',
            'items.*.sort_order' => 'required|integer',
        ]);

        foreach ($validated['items'] as $item) {
            VenueType::where('id', $item['id'])
                ->where('subcategory_id', $subcategoryId)
                ->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json([
            'message' => 'Venue types reordered successfully'
        ]);
    }
}
