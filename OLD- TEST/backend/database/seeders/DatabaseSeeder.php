<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\City;
use App\Models\VenueType;
use App\Models\EventType;
use App\Models\Amenity;
use App\Models\SubscriptionPlan;
use App\Models\VenueOwner;
use App\Models\Venue;
use App\Models\VenuePhoto;
use App\Models\VenueAvailability;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 0. Seed Categories and Subcategories
        $this->call(CategorySeeder::class);
        $plans = [
            [
                'name' => 'Free',
                'slug' => 'free',
                'description' => 'Perfect to get started listing your venue',
                'price_monthly' => 0.00,
                'price_yearly' => 0.00,
                'max_venues' => 1,
                'max_photos_per_venue' => 5,
                'featured_listing' => false,
                'priority_support' => false,
                'analytics_access' => false,
                'commission_rate' => 15.00,
                'features' => json_encode(['1 Active Venue', '5 Photos Max', '15% Booking Commission', 'Standard Listing']),
                'sort_order' => 1,
            ],
            [
                'name' => 'Basic',
                'slug' => 'basic',
                'description' => 'Grow your event business with priority visibility',
                'price_monthly' => 999.00,
                'price_yearly' => 9999.00,
                'max_venues' => 3,
                'max_photos_per_venue' => 15,
                'featured_listing' => false,
                'priority_support' => true,
                'analytics_access' => true,
                'commission_rate' => 10.00,
                'features' => json_encode(['3 Active Venues', '15 Photos Max', '10% Booking Commission', 'Priority Support', 'Dashboard Analytics']),
                'sort_order' => 2,
            ],
            [
                'name' => 'Pro Premium',
                'slug' => 'pro',
                'description' => 'Maximum visibility, zero commission, unlimited leads',
                'price_monthly' => 2499.00,
                'price_yearly' => 24999.00,
                'max_venues' => 10,
                'max_photos_per_venue' => 30,
                'featured_listing' => true,
                'priority_support' => true,
                'analytics_access' => true,
                'commission_rate' => 0.00,
                'features' => json_encode(['Up to 10 Venues', '30 Photos Max', '0% Booking Commission', 'Featured Badge on Search', 'Unlimited Enquiries', 'Premium Analytics']),
                'sort_order' => 3,
            ]
        ];
        foreach ($plans as $plan) {
            SubscriptionPlan::create($plan);
        }

        // 2. Seed Cities (High Quality placeholders)
        $cities = [
            ['name' => 'Ahmedabad', 'state' => 'Gujarat', 'slug' => 'ahmedabad', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1595818987114-11a5b8da2f48?auto=format&fit=crop&w=600&q=80'],
            ['name' => 'Mumbai', 'state' => 'Maharashtra', 'slug' => 'mumbai', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=600&q=80'],
            ['name' => 'Delhi NCR', 'state' => 'Delhi', 'slug' => 'delhi-ncr', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80'],
            ['name' => 'Bangalore', 'state' => 'Karnataka', 'slug' => 'bangalore', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80'],
            ['name' => 'Goa', 'state' => 'Goa', 'slug' => 'goa', 'featured' => true, 'image' => 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80'],
            ['name' => 'Jaipur', 'state' => 'Rajasthan', 'slug' => 'jaipur', 'featured' => false, 'image' => 'https://images.unsplash.com/photo-1477584322813-ac04ee8dfb5a?auto=format&fit=crop&w=600&q=80'],
        ];
        foreach ($cities as $city) {
            City::create($city);
        }

        // 3. Retrieve Venue Types created by CategorySeeder
        // (CategorySeeder creates all 80+ types - we just need the old ones for sample venues)

        // 4. Seed Event Types
        $eventTypes = [
            ['name' => 'Wedding Ceremony & Reception', 'slug' => 'wedding', 'category' => 'wedding', 'sort_order' => 1],
            ['name' => 'Pre-Wedding (Sangeet / Mehendi)', 'slug' => 'pre-wedding', 'category' => 'wedding', 'sort_order' => 2],
            ['name' => 'Birthday Party', 'slug' => 'birthday', 'category' => 'social', 'sort_order' => 3],
            ['name' => 'Corporate Conference / Seminar', 'slug' => 'corporate-conference', 'category' => 'corporate', 'sort_order' => 4],
            ['name' => 'Cocktail & Bachelor Party', 'slug' => 'bachelor-cocktail', 'category' => 'party', 'sort_order' => 5],
            ['name' => 'Anniversary & Social Gathering', 'slug' => 'social-gathering', 'category' => 'social', 'sort_order' => 6],
        ];
        foreach ($eventTypes as $et) {
            EventType::create($et);
        }

        // 5. Seed Amenities
        $amenities = [
            ['name' => 'Central Air Conditioning', 'category' => 'basic', 'icon' => 'Wind'],
            ['name' => 'Valet Parking', 'category' => 'basic', 'icon' => 'Car'],
            ['name' => 'Full Power Backup', 'category' => 'basic', 'icon' => 'Zap'],
            ['name' => 'Guest Rooms (Lodging)', 'category' => 'basic', 'icon' => 'Bed'],
            ['name' => 'In-house Catering', 'category' => 'food', 'icon' => 'Utensils'],
            ['name' => 'Swimming Pool Access', 'category' => 'recreation', 'icon' => 'Droplet'],
            ['name' => 'Audio / Visual Systems (Mic & Projector)', 'category' => 'av', 'icon' => 'Mic'],
            ['name' => 'CCTV & Guarded Security', 'category' => 'safety', 'icon' => 'Shield'],
            ['name' => 'Wheelchair Friendly Accessibility', 'category' => 'accessibility', 'icon' => 'UserCheck'],
            ['name' => 'WiFi Internet', 'category' => 'basic', 'icon' => 'Wifi'],
        ];
        foreach ($amenities as $am) {
            Amenity::create($am);
        }

        // 6. Seed Users & Owners
        // Super Admin
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@clickmyvenue.com',
            'phone' => '9999999999',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        // Venue Owner
        $ownerUser = User::create([
            'name' => 'Rajesh Sharma',
            'email' => 'owner@clickmyvenue.com',
            'phone' => '9888888888',
            'password' => Hash::make('password'),
            'role' => 'owner',
            'status' => 'active',
        ]);

        $ownerProfile = VenueOwner::create([
            'user_id' => $ownerUser->id,
            'business_name' => 'Sharma Events & Hospitality Group',
            'gstin' => '24AAAAS1234A1Z1',
            'pan' => 'AAAAS1234A',
            'bank_account' => '123456789012',
            'bank_ifsc' => 'SBIN0000001',
            'bank_name' => 'State Bank of India',
            'account_holder_name' => 'Rajesh Sharma',
            'status' => 'verified',
            'verified_at' => now(),
        ]);

        // Regular Organizer User
        User::create([
            'name' => 'Amit Patel',
            'email' => 'user@clickmyvenue.com',
            'phone' => '9777777777',
            'password' => Hash::make('password'),
            'role' => 'user',
            'status' => 'active',
        ]);

        // 7. Seed Sample Venues
        $venue1 = Venue::create([
            'owner_id' => $ownerProfile->id,
            'city_id' => City::where('slug', 'ahmedabad')->first()->id,
            'type_id' => VenueType::where('slug', 'banquet-hall')->first()->id,
            'name' => 'The Grand Monarch Palace',
            'slug' => 'the-grand-monarch-palace',
            'description' => 'A royal and breathtaking luxury banquet hall designed for high-profile weddings, corporate awards, and grand social gatherings. Features Italian marble flooring, majestic crystal chandeliers, and ultra-modern acoustic sound systems.',
            'area' => 'Sindhu Bhavan Road',
            'address' => 'Plot 45, Monarch Arcade, Opposite SBR Park, Sindhu Bhavan Road, Bodakdev, Ahmedabad, Gujarat 380054',
            'latitude' => 23.0416,
            'longitude' => 72.5075,
            'capacity_min' => 150,
            'capacity_max' => 1200,
            'price_per_plate' => 1200.00,
            'flat_rent_price' => 75000.00,
            'price_min' => 1200.00,
            'category' => 'indoor',
            'parking_available' => true,
            'parking_count' => 350,
            'power_backup' => true,
            'rooms_count' => 12,
            'alcohol_allowed' => false,
            'dj_allowed' => true,
            'catering_type' => 'inhouse',
            'catering_details' => 'Pure vegetarian menu only. 5-Star master chefs specialize in Gujarati, Punjabi, Continental, and live Asian counters.',
            'decoration_type' => 'monopoly',
            'decoration_details' => 'Elite decorators list provided. Outsiders not permitted for structural safety reasons.',
            'status' => 'approved',
            'featured' => true,
            'views_count' => 1240,
            'avg_rating' => 4.85,
            'reviews_count' => 12,
            'approved_at' => now(),
        ]);

        // Add photos for Grand Monarch
        VenuePhoto::create([
            'venue_id' => $venue1->id,
            'url' => 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
            'is_primary' => true,
            'sort_order' => 1,
            'caption' => 'The Grand Ballroom Main Hall'
        ]);
        VenuePhoto::create([
            'venue_id' => $venue1->id,
            'url' => 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80',
            'is_primary' => false,
            'sort_order' => 2,
            'caption' => 'Stage Setup & Flower Decor'
        ]);

        // Connect Event Types & Amenities to venue
        $venue1->eventTypes()->attach(EventType::pluck('id')->toArray());
        $venue1->amenities()->attach(Amenity::take(6)->pluck('id')->toArray());

        $venue2 = Venue::create([
            'owner_id' => $ownerProfile->id,
            'city_id' => City::where('slug', 'mumbai')->first()->id,
            'type_id' => VenueType::where('slug', 'lawn-garden')->first()->id,
            'name' => 'Royal Palms Ocean Lawn',
            'slug' => 'royal-palms-ocean-lawn',
            'description' => 'A magical oceanfront lawn facing the Arabian Sea, perfect for romantic sunset vows, premium cocktail parties, and grand musical events. Offers an elegant poolside lounge and starry night skies.',
            'area' => 'Juhu Beach',
            'address' => 'Seaside Avenue, Juhu, Mumbai, Maharashtra 400049',
            'latitude' => 19.1026,
            'longitude' => 72.8242,
            'capacity_min' => 200,
            'capacity_max' => 2000,
            'price_per_plate' => 1800.00,
            'flat_rent_price' => 150000.00,
            'price_min' => 1800.00,
            'category' => 'both',
            'parking_available' => true,
            'parking_count' => 150,
            'power_backup' => true,
            'rooms_count' => 4,
            'alcohol_allowed' => true,
            'dj_allowed' => true,
            'catering_type' => 'both',
            'catering_details' => 'In-house catering premium non-veg options available. External vendors permitted with royalty.',
            'decoration_type' => 'both',
            'decoration_details' => 'Choose our premium sets or bring your own licensed event planners.',
            'status' => 'approved',
            'featured' => true,
            'views_count' => 3110,
            'avg_rating' => 4.90,
            'reviews_count' => 18,
            'approved_at' => now(),
        ]);

        VenuePhoto::create([
            'venue_id' => $venue2->id,
            'url' => 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80',
            'is_primary' => true,
            'sort_order' => 1,
            'caption' => 'Breathtaking Ocean Lawn Theme'
        ]);

        $venue2->eventTypes()->attach(EventType::take(3)->pluck('id')->toArray());
        $venue2->amenities()->attach(Amenity::pluck('id')->toArray());

        // Update counts
        City::where('slug', 'ahmedabad')->first()->increment('venue_count');
        City::where('slug', 'mumbai')->first()->increment('venue_count');
    }
}
