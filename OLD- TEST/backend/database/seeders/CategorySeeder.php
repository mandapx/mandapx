<?php

namespace Database\Seeders;

use App\Models\VenueCategory;
use App\Models\VenueSubcategory;
use App\Models\VenueType;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Wedding Venues',
                'slug' => 'wedding-venues',
                'icon' => 'Heart',
                'description' => 'Venues for weddings, engagements, and bridal ceremonies',
                'sort_order' => 1,
                'desc_suffix' => 'wedding events',
                'subcategories' => [
                    ['name' => 'Banquet Halls', 'slug' => 'banquet-halls', 'icon' => 'Building', 'description' => 'AC indoor halls for premium elegance', 'types' => ['Banquet Hall', 'Marriage Hall', 'Wedding Hall']],
                    ['name' => 'Gardens & Lawns', 'slug' => 'gardens-lawns', 'icon' => 'Trees', 'description' => 'Beautiful open-air gardens for outdoor weddings', 'types' => ['Lawn / Garden', 'Marriage Garden', 'Lawn', 'Garden Lawn']],
                    ['name' => 'Farmhouses', 'slug' => 'farmhouses', 'icon' => 'Home', 'description' => 'Private expansive properties for rustic celebrations', 'types' => ['Farm House', 'Farmhouse', 'Farm Villa']],
                    ['name' => 'Destination Resorts', 'slug' => 'destination-resorts', 'icon' => 'MapPin', 'description' => 'Exotic destination venues with lodging', 'types' => ['Destination Wedding Resort', 'Wedding Resort']],
                    ['name' => 'Palace & Heritage', 'slug' => 'palace-heritage', 'icon' => 'Castle', 'description' => 'Grand palaces and heritage properties', 'types' => ['Palace', 'Heritage Venue', 'Historical Venue']],
                    ['name' => 'Beach Venues', 'slug' => 'beach-venues', 'icon' => 'Waves', 'description' => 'Romantic beachside wedding locations', 'types' => ['Beach Wedding Venue', 'Beach Resort']],
                ]
            ],
            [
                'name' => 'Corporate Venues',
                'slug' => 'corporate-venues',
                'icon' => 'Building2',
                'description' => 'Professional spaces for corporate events',
                'sort_order' => 2,
                'desc_suffix' => 'corporate events',
                'subcategories' => [
                    ['name' => 'Conference Rooms', 'slug' => 'conference-rooms', 'icon' => 'Users', 'description' => 'Professional conference and meeting spaces', 'types' => ['Conference Room', 'Meeting Room', 'Boardroom']],
                    ['name' => 'Convention Centers', 'slug' => 'convention-centers', 'icon' => 'Building', 'description' => 'Large scale convention and event centers', 'types' => ['Convention Center', 'Conference Center', 'Exhibition Hall']],
                    ['name' => 'Business Lounges', 'slug' => 'business-lounges', 'icon' => 'Armchair', 'description' => 'Corporate lounge and hospitality spaces', 'types' => ['Business Lounge', 'Corporate Lounge', 'VIP Lounge']],
                    ['name' => 'Seminar & Training', 'slug' => 'seminar-training', 'icon' => 'Presentation', 'description' => 'Halls for seminars, workshops and training', 'types' => ['Seminar Hall', 'Training Room', 'Workshop Space']],
                ]
            ],
            [
                'name' => 'Party & Social Venues',
                'slug' => 'party-social-venues',
                'icon' => 'Zap',
                'description' => 'Vibrant venues for parties and social gatherings',
                'sort_order' => 3,
                'desc_suffix' => 'parties and social events',
                'subcategories' => [
                    ['name' => 'Party Halls', 'slug' => 'party-halls', 'icon' => 'Music', 'description' => 'Party halls for celebrations and gatherings', 'types' => ['Party Hall', 'Birthday Venue', 'Celebration Hall']],
                    ['name' => 'Private Lounges', 'slug' => 'private-lounges', 'icon' => 'Armchair', 'description' => 'Exclusive private lounge spaces', 'types' => ['Private Lounge', 'Private Dining', 'Exclusive Club']],
                    ['name' => 'Clubhouses', 'slug' => 'clubhouses', 'icon' => 'Club', 'description' => 'Clubhouses and community party spaces', 'types' => ['Clubhouse', 'Community Club', 'Social Club']],
                    ['name' => 'Rooftop Venues', 'slug' => 'rooftop-venues', 'icon' => 'Sunset', 'description' => 'Chic rooftop party spaces with great views', 'types' => ['Rooftop Lounge', 'Rooftop Party Venue', 'Sky Terrace']],
                ]
            ],
            [
                'name' => 'Hotel & Hospitality Venues',
                'slug' => 'hotel-hospitality-venues',
                'icon' => 'Hotel',
                'description' => 'Hotel and resort event spaces',
                'sort_order' => 4,
                'desc_suffix' => 'hospitality events',
                'subcategories' => [
                    ['name' => 'Hotel Ballrooms', 'slug' => 'hotel-ballrooms', 'icon' => 'Hotel', 'description' => 'Luxury hotel grand ballroom settings', 'types' => ['Hotel Ballroom', 'Luxury Ballroom', 'Grand Ballroom']],
                    ['name' => 'Resort Event Spaces', 'slug' => 'resort-event-spaces', 'icon' => 'Palmtree', 'description' => 'Resort event spaces with full hospitality', 'types' => ['Resort', 'Resort Event Space', 'Resort Venue', 'Resort Hall']],
                    ['name' => 'Poolside Venues', 'slug' => 'poolside-venues', 'icon' => 'Waves', 'description' => 'Poolside event and dining spaces', 'types' => ['Poolside Venue', 'Pool Terrace', 'Pool Deck']],
                    ['name' => 'Terrace & Outdoor', 'slug' => 'terrace-outdoor', 'icon' => 'Trees', 'description' => 'Hotel terrace and outdoor event spaces', 'types' => ['Terrace Venue', 'Outdoor Terrace', 'Garden Terrace']],
                ]
            ],
            [
                'name' => 'Restaurant & Dining Venues',
                'slug' => 'restaurant-dining-venues',
                'icon' => 'Utensils',
                'description' => 'Restaurant and dining event spaces',
                'sort_order' => 5,
                'desc_suffix' => 'dining events',
                'subcategories' => [
                    ['name' => 'Fine Dining Halls', 'slug' => 'fine-dining-halls', 'icon' => 'Utensils', 'description' => 'Upscale fine dining event spaces', 'types' => ['Fine Dining Hall', 'Upscale Restaurant', 'Premium Dining']],
                    ['name' => 'Restaurant Private Dining', 'slug' => 'restaurant-private-dining', 'icon' => 'Users', 'description' => 'Private dining rooms in restaurants', 'types' => ['Restaurant Private Dining', 'Private Dining Room', 'Banquet Restaurant']],
                    ['name' => 'Café & Bistro', 'slug' => 'cafe-bistro', 'icon' => 'Coffee', 'description' => 'Café and bistro event spaces', 'types' => ['Café Event Space', 'Bistro Venue', 'Casual Dining']],
                    ['name' => 'Brewery & Pub', 'slug' => 'brewery-pub', 'icon' => 'Beer', 'description' => 'Brewery and pub event venues', 'types' => ['Brewery Venue', 'Pub Event Space', 'Gastropub Venue']],
                ]
            ],
            [
                'name' => 'Outdoor Venues',
                'slug' => 'outdoor-venues',
                'icon' => 'Trees',
                'description' => 'Open-air outdoor event venues',
                'sort_order' => 6,
                'desc_suffix' => 'outdoor events',
                'subcategories' => [
                    ['name' => 'Gardens & Lawns', 'slug' => 'outdoor-gardens-lawns', 'icon' => 'Flower', 'description' => 'Landscaped gardens and open lawns', 'types' => ['Garden Lawn', 'Open Ground', 'Manicured Garden']],
                    ['name' => 'Amphitheaters', 'slug' => 'amphitheaters', 'icon' => 'Users', 'description' => 'Amphitheater and arena-style venues', 'types' => ['Amphitheater', 'Open Air Theater', 'Arena Space']],
                    ['name' => 'Beach Venues', 'slug' => 'outdoor-beach-venues', 'icon' => 'Waves', 'description' => 'Beachfront outdoor event spaces', 'types' => ['Beach Venue', 'Beachfront Venue', 'Seaside Venue']],
                    ['name' => 'Camping Venues', 'slug' => 'camping-venues', 'icon' => 'Tent', 'description' => 'Camping and glamping event venues', 'types' => ['Camping Venue', 'Glamping Site', 'Campground']],
                ]
            ],
            [
                'name' => 'Entertainment Venues',
                'slug' => 'entertainment-venues',
                'icon' => 'Music',
                'description' => 'Entertainment and live performance venues',
                'sort_order' => 7,
                'desc_suffix' => 'entertainment events',
                'subcategories' => [
                    ['name' => 'Concert Halls', 'slug' => 'concert-halls', 'icon' => 'Music', 'description' => 'Concert halls for live music events', 'types' => ['Concert Hall', 'Concert Venue', 'Music Hall']],
                    ['name' => 'Theaters', 'slug' => 'theaters', 'icon' => 'Theater', 'description' => 'Theater spaces for performances', 'types' => ['Theater', 'Drama Theater', 'Performing Arts Theater']],
                    ['name' => 'Cinemas', 'slug' => 'cinemas', 'icon' => 'Film', 'description' => 'Cinema and screening venues', 'types' => ['Cinema Hall', 'Movie Theater', 'Screening Theater']],
                    ['name' => 'Comedy & Nightclubs', 'slug' => 'comedy-nightclubs', 'icon' => 'Zap', 'description' => 'Comedy clubs and nightclub venues', 'types' => ['Comedy Club', 'Nightclub', 'Music Arena']],
                ]
            ],
            [
                'name' => 'Exhibition & Trade Venues',
                'slug' => 'exhibition-trade-venues',
                'icon' => 'ShoppingBag',
                'description' => 'Exhibition halls and trade fair venues',
                'sort_order' => 8,
                'desc_suffix' => 'exhibitions and trade events',
                'subcategories' => [
                    ['name' => 'Exhibition Halls', 'slug' => 'exhibition-halls', 'icon' => 'Building', 'description' => 'Large exhibition hall spaces', 'types' => ['Exhibition Hall', 'Expo Hall', 'Convention Hall']],
                    ['name' => 'Expo Centers', 'slug' => 'expo-centers', 'icon' => 'Building2', 'description' => 'Dedicated expo and trade centers', 'types' => ['Expo Center', 'Trade Center', 'Event Center']],
                    ['name' => 'Trade Fair Grounds', 'slug' => 'trade-fair-grounds', 'icon' => 'Flag', 'description' => 'Trade fair and market grounds', 'types' => ['Trade Fair Ground', 'Market Ground', 'Fair Ground']],
                    ['name' => 'Gallery Spaces', 'slug' => 'gallery-spaces', 'icon' => 'Frame', 'description' => 'Art gallery and exhibition spaces', 'types' => ['Gallery Space', 'Art Gallery', 'Showcase Venue']],
                ]
            ],
            [
                'name' => 'Sports Venues',
                'slug' => 'sports-venues',
                'icon' => 'Activity',
                'description' => 'Sports and athletic event venues',
                'sort_order' => 9,
                'desc_suffix' => 'sports events',
                'subcategories' => [
                    ['name' => 'Stadiums', 'slug' => 'stadiums', 'icon' => 'Trophy', 'description' => 'Large open stadiums for major events', 'types' => ['Stadium', 'Sports Stadium', 'Open Stadium']],
                    ['name' => 'Indoor Sports Arenas', 'slug' => 'indoor-sports-arenas', 'icon' => 'Target', 'description' => 'Indoor sports and athletic arenas', 'types' => ['Indoor Sports Arena', 'Multi-purpose Arena', 'Indoor Hall']],
                    ['name' => 'Sports Grounds', 'slug' => 'sports-grounds', 'icon' => 'Users', 'description' => 'Cricket, football and multipurpose grounds', 'types' => ['Cricket Ground', 'Football Turf', 'Sports Complex']],
                    ['name' => 'Court Venues', 'slug' => 'court-venues', 'icon' => 'Target', 'description' => 'Tennis courts and other court venues', 'types' => ['Tennis Court', 'Basketball Court', 'Badminton Hall']],
                ]
            ],
            [
                'name' => 'Educational Venues',
                'slug' => 'educational-venues',
                'icon' => 'BookOpen',
                'description' => 'Educational and learning venues',
                'sort_order' => 10,
                'desc_suffix' => 'educational events',
                'subcategories' => [
                    ['name' => 'Auditoriums', 'slug' => 'auditoriums', 'icon' => 'Volume2', 'description' => 'Auditorium spaces for lectures and presentations', 'types' => ['Auditorium', 'School Auditorium', 'College Auditorium']],
                    ['name' => 'Classrooms', 'slug' => 'classrooms', 'icon' => 'BookOpen', 'description' => 'Classroom spaces for educational events', 'types' => ['Classroom', 'Class Room', 'Learning Space']],
                    ['name' => 'Lecture Halls', 'slug' => 'lecture-halls', 'icon' => 'Users', 'description' => 'Large lecture hall spaces', 'types' => ['Lecture Hall', 'Lecture Room', 'Lecture Theater']],
                    ['name' => 'Workshop Spaces', 'slug' => 'workshop-spaces', 'icon' => 'Wrench', 'description' => 'Workshop and training institute halls', 'types' => ['Workshop Space', 'Training Institute Hall', 'Lab Space']],
                ]
            ],
            [
                'name' => 'Religious & Community Venues',
                'slug' => 'religious-community-venues',
                'icon' => 'Heart',
                'description' => 'Religious and community gathering spaces',
                'sort_order' => 11,
                'desc_suffix' => 'community events',
                'subcategories' => [
                    ['name' => 'Temple Halls', 'slug' => 'temple-halls', 'icon' => 'Landmark', 'description' => 'Temple and religious ceremony halls', 'types' => ['Temple Hall', 'Prayer Hall', 'Mandir Hall']],
                    ['name' => 'Church Halls', 'slug' => 'church-halls', 'icon' => 'Cross', 'description' => 'Church and Christian community spaces', 'types' => ['Church Hall', 'Fellowship Hall', 'Church Community Center']],
                    ['name' => 'Mosque Halls', 'slug' => 'mosque-halls', 'icon' => 'Landmark2', 'description' => 'Mosque and Islamic community spaces', 'types' => ['Mosque Community Hall', 'Prayer House', 'Community Prayer Space']],
                    ['name' => 'Community Centers', 'slug' => 'community-centers', 'icon' => 'Users', 'description' => 'General community gathering centers', 'types' => ['Community Center', 'Cultural Center', 'Civic Center']],
                ]
            ],
            [
                'name' => 'Creative & Media Venues',
                'slug' => 'creative-media-venues',
                'icon' => 'Palette',
                'description' => 'Creative and media production venues',
                'sort_order' => 12,
                'desc_suffix' => 'creative events',
                'subcategories' => [
                    ['name' => 'Photography Studios', 'slug' => 'photography-studios', 'icon' => 'Camera', 'description' => 'Photography studio spaces', 'types' => ['Photography Studio', 'Portrait Studio', 'Photo Booth']],
                    ['name' => 'Film Studios', 'slug' => 'film-studios', 'icon' => 'Film', 'description' => 'Film and video production studios', 'types' => ['Film Studio', 'Production Studio', 'Soundstage']],
                    ['name' => 'Recording Studios', 'slug' => 'recording-studios', 'icon' => 'Mic2', 'description' => 'Music and audio recording studios', 'types' => ['Recording Studio', 'Music Studio', 'Audio Studio']],
                    ['name' => 'Art Studios', 'slug' => 'art-studios', 'icon' => 'Palette', 'description' => 'Art and creative studio spaces', 'types' => ['Art Studio', 'Creative Studio', 'Podcast Studio']],
                ]
            ],
            [
                'name' => 'Wellness & Lifestyle Venues',
                'slug' => 'wellness-lifestyle-venues',
                'icon' => 'Heart',
                'description' => 'Wellness and lifestyle event venues',
                'sort_order' => 13,
                'desc_suffix' => 'wellness events',
                'subcategories' => [
                    ['name' => 'Yoga Studios', 'slug' => 'yoga-studios', 'icon' => 'Zap', 'description' => 'Yoga and meditation studios', 'types' => ['Yoga Studio', 'Wellness Studio', 'Meditation Hall']],
                    ['name' => 'Spa Venues', 'slug' => 'spa-venues', 'icon' => 'Wind', 'description' => 'Spa and wellness event spaces', 'types' => ['Spa Event Space', 'Wellness Spa', 'Spa Resort']],
                    ['name' => 'Retreat Centers', 'slug' => 'retreat-centers', 'icon' => 'MapPin', 'description' => 'Wellness retreat and retreat centers', 'types' => ['Retreat Center', 'Wellness Resort', 'Retreat Venue']],
                    ['name' => 'Fitness Centers', 'slug' => 'fitness-centers', 'icon' => 'Activity', 'description' => 'Gym and fitness venue spaces', 'types' => ['Fitness Center', 'Gym Venue', 'Wellness Center']],
                ]
            ],
            [
                'name' => 'Virtual & Hybrid Venues',
                'slug' => 'virtual-hybrid-venues',
                'icon' => 'Monitor',
                'description' => 'Digital and hybrid event platforms',
                'sort_order' => 14,
                'desc_suffix' => 'virtual and hybrid events',
                'subcategories' => [
                    ['name' => 'Webinar Studios', 'slug' => 'webinar-studios', 'icon' => 'Video', 'description' => 'Webinar and virtual conference studios', 'types' => ['Webinar Studio', 'Virtual Studio', 'Online Conference Studio']],
                    ['name' => 'Streaming Studios', 'slug' => 'streaming-studios', 'icon' => 'Radio', 'description' => 'Live streaming and broadcast studios', 'types' => ['Live Streaming Studio', 'Broadcast Studio', 'Streaming Venue']],
                    ['name' => 'Hybrid Conference Rooms', 'slug' => 'hybrid-conference-rooms', 'icon' => 'Users', 'description' => 'Hybrid meeting and conference spaces', 'types' => ['Hybrid Conference Room', 'Hybrid Meeting Space', 'Virtual Conference Room']],
                    ['name' => 'Virtual Platforms', 'slug' => 'virtual-platforms', 'icon' => 'Globe', 'description' => 'Online event platforms and metaverse venues', 'types' => ['Virtual Event Platform', 'Metaverse Venue', 'Online Platform']],
                ]
            ]
        ];

        foreach ($categories as $catData) {
            $subCats = $catData['subcategories'];
            $suffix = $catData['desc_suffix'];
            unset($catData['subcategories']);
            unset($catData['desc_suffix']);

            $category = VenueCategory::updateOrCreate(
                ['slug' => $catData['slug']],
                $catData
            );

            foreach ($subCats as $subCat) {
                $types = $subCat['types'];
                unset($subCat['types']);

                $subcategory = VenueSubcategory::updateOrCreate(
                    ['slug' => $subCat['slug']],
                    array_merge($subCat, [
                        'category_id' => $category->id,
                        'sort_order' => 0,
                        'active' => true
                    ])
                );

                foreach ($types as $index => $type) {
                    VenueType::updateOrCreate(
                        ['slug' => str($type)->slug()],
                        [
                            'subcategory_id' => $subcategory->id,
                            'name' => $type,
                            'icon' => $subCat['icon'],
                            'description' => "{$type} for {$suffix}",
                            'sort_order' => $index,
                            'active' => true,
                        ]
                    );
                }
            }
        }
    }
}
