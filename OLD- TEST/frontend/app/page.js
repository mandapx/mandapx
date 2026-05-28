"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  Star, 
  Building, 
  Calendar, 
  Users, 
  Filter, 
  Check, 
  ShieldCheck, 
  HelpCircle,
  Info,
  Car,
  Zap,
  Hotel,
  X,
  Map
} from "lucide-react";
import Header from "../components/Header";

export default function ZomatoListing() {
  // Search parameters
  const [selectedCity, setSelectedCity] = useState("Ahmedabad");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Banquet Hall"); 
  const [indoorOutdoor, setIndoorOutdoor] = useState("Both");
  const [eventType, setEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  
  // Filter pills
  const [hasParking, setHasParking] = useState(false);
  const [hasPowerBackup, setHasPowerBackup] = useState(false);
  const [hasRooms, setHasRooms] = useState(false);

  // Modal States
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationToast, setLocationToast] = useState("");

  // Simulated location detection
  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    setTimeout(() => {
      setIsDetectingLocation(false);
      setSelectedCity("Mumbai");
      setIsCityModalOpen(false);
      setLocationToast("Detected Location: Mumbai, Maharashtra");
      setTimeout(() => setLocationToast(""), 4000);
      
      // Scroll to venues section
      const venuesSection = document.getElementById("venues-section");
      if (venuesSection) {
        venuesSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 1500);
  };

  const popularCitiesList = [
    { name: "Mumbai", key: "mumbai", icon: "/img/FINAL/mumbai.svg", activeIcon: "/img/FINAL/mumbai-selected.png" },
    { name: "Delhi-NCR", key: "delhi-ncr", icon: "/img/FINAL/ncr.svg", activeIcon: "/img/FINAL/ncr-selected.png" },
    { name: "Bengaluru", key: "bengluru", icon: "/img/FINAL/bang.svg", activeIcon: "/img/FINAL/bang-selected.png" },
    { name: "Hyderabad", key: "hyderabad", icon: "/img/FINAL/hyd.png", activeIcon: "/img/FINAL/hyd-selected.png" },
    { name: "Chandigarh", key: "chandigarh", icon: "/img/FINAL/chd.svg", activeIcon: "/img/FINAL/chd-selected.svg" },
    { name: "Ahmedabad", key: "ahmedabad", icon: "/img/FINAL/ahd.svg", activeIcon: "/img/FINAL/ahd-selected.svg" },
    { name: "Pune", key: "pune", icon: "/img/FINAL/pune.png", activeIcon: "/img/FINAL/pune-selected.png" },
    { name: "Chennai", key: "chennai", icon: "/img/FINAL/chen.svg", activeIcon: "/img/FINAL/chen-selected.svg" },
    { name: "Kolkata", key: "kolkata", icon: "/img/FINAL/kolk.svg", activeIcon: "/img/FINAL/kolk-selected.svg" },
    { name: "Kochi", key: "kochi", icon: "/img/FINAL/koch.svg", activeIcon: "/img/FINAL/koch-selected.svg" }
  ];

  const allAvailableCities = [
    "Aalo", "Abohar", "Abu Road", "Achampet", "Acharapakkam", "Addanki", "Adilabad", "Adimali", "Adipur", "Adoni", "Agar Malwa", "Agartala", "Agiripalli", "Agra", "Ahilyanagar", "Ahmedabad", "Ahore", "Aizawl", "Ajmer", "Akaltara", "Akbarpur", "Akividu", "Akluj", "Akola", "Akot", "Alakode", "Alangudi", "Alangulam", "Alappuzha", "Alathur", "Alibaug", "Aligarh", "Alipurduar", "Allagadda", "Almora",
    "Bangalore", "Bhavnagar", "Bhopal", "Bhubaneswar", "Bhuj", "Bikaner", "Bilaspur", "Bodh Gaya",
    "Chandigarh", "Chennai", "Coimbatore", "Cuttack",
    "Dehradun", "Delhi-NCR", "Dhanbad", "Dharamsala", "Dibrugarh", "Diu", "Durgapur",
    "Ernakulam", "Erode",
    "Faridabad", "Firozabad",
    "Gandhinagar", "Gangtok", "Gaya", "Ghaziabad", "Goa", "Gorakhpur", "Guntur", "Gwalior",
    "Haldwani", "Haridwar", "Hassan", "Hubli", "Hyderabad",
    "Imphal", "Indore", "Itanagar",
    "Jabalpur", "Jaipur", "Jalandhar", "Jammu", "Jamnagar", "Jamshedpur", "Jhansi", "Jodhpur",
    "Kakinada", "Kalyan", "Kannur", "Kanpur", "Kanyakumari", "Kargil", "Karimnagar", "Karnal", "Kochi", "Kohima", "Kolhapur", "Kolkata", "Kollam", "Kota", "Kottayam", "Kozhikode", "Kurnool",
    "Latur", "Lonavala", "Lucknow", "Ludhiana",
    "Madurai", "Mahabaleshwar", "Mangalore", "Mapusa", "Mathura", "Meerut", "Mumbai", "Muzaffarpur", "Mysore",
    "Nadiad", "Nagpur", "Nainital", "Nanded", "Nashik", "Navi Mumbai", "Nellore", "Noida",
    "Ongole", "Ooty",
    "Palakkad", "Palanpur", "Panaji", "Panchkula", "Panipat", "Pathankot", "Patiala", "Patna", "Pondicherry", "Porbandar", "Pune", "Puri",
    "Raipur", "Rajahmundry", "Rajkot", "Ranchi", "Rishikesh", "Rohtak", "Rourkela",
    "Salem", "Sambalpur", "Satara", "Secunderabad", "Shillong", "Shimla", "Shivamogga", "Siliguri", "Silvassa", "Solapur", "Srinagar", "Surat",
    "Thane", "Thanjavur", "Thiruvananthapuram", "Thrissur", "Tiruchirappalli", "Tirunelveli", "Tirupati", "Tiruppur", "Tumkur", "Tuticorin",
    "Udaipur", "Udupi", "Ujjain",
    "Vadodara", "Varanasi", "Vashi", "Vellore", "Vijayawada", "Visakhapatnam",
    "Warangal", "Wayanad",
    "Yamunanagar", "Yavatmal",
    "Zirakpur"
  ];

  const filteredCities = allAvailableCities.filter(city => 
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const groupedCities = {};
  filteredCities.forEach(city => {
    const firstLetter = city[0].toUpperCase();
    if (!groupedCities[firstLetter]) {
      groupedCities[firstLetter] = [];
    }
    groupedCities[firstLetter].push(city);
  });

  const alphabetHeaders = Object.keys(groupedCities).sort();

  const allVenues = [
    {
      id: 1,
      name: "Kaffa Coffee Roasters & Events",
      category: "Banquet Hall",
      city: "Ahmedabad",
      area: "Vastrapur",
      pincode: "380015",
      state: "Gujarat",
      address: "Ground Floor, Sunrise Centre, Near Vastrapur Lake, Ahmedabad, GJ",
      phone: "+91 79 4000 1111",
      email: "info@kaffacoeffee.com",
      website: "www.kaffacoffee.site",
      owner: "Rohan Vyas",
      owner_mobile: "9825011111",
      owner_email: "rohan@kaffacoeffee.com",
      contractor: "Devang Shah",
      contractor_mobile: "9978911111",
      contractor_email: "devang@shahdecor.com",
      rating: "4.9",
      reviews_count: 148,
      approx_cost: "₹850",
      capacity: 250,
      indoor_outdoor: "Indoor",
      parking: "Available (50 Cars)",
      power_backup: "100% Backed Up",
      rooms: "4 Deluxe AC Rooms",
      washrooms: "6 Clean Executive Washrooms",
      best_for: ["Wedding", "Party", "Social Functions", "Get Together", "Corporate Event"],
      decoration: "Monopoly",
      decor_details: {
        name: "Shreeji Floral & Decorators",
        address: "102, Shivalik Plaza, Vastrapur, Ahmedabad",
        phone: "+91 79 2630 2222",
        owner: "Haresh Patel",
        mobile: "9824022222",
        email: "haresh@shreejidecor.com"
      },
      catering: "Open",
      catering_details: null,
      food_menu: "Pure Vegetarian. Specialty mocktail bar, wood-fired artisanal pizza station, premium North Indian & live Italian pasta bar.",
      availability: "OPEN",
      recommendations: 94,
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
      ],
      bank_details: "HDFC Bank - A/C: 50200012345678 - IFSC: HDFC0000048"
    },
    {
      id: 2,
      name: "The Sabarmati Lawn & Banquet",
      category: "Party Plot",
      city: "Ahmedabad",
      area: "Sindhu Bhavan Road",
      pincode: "380054",
      state: "Gujarat",
      address: "Opposite SBR Park, Sindhu Bhavan Road, Bodakdev, Ahmedabad, GJ",
      phone: "+91 79 4000 2222",
      email: "events@sabarmatilawn.com",
      website: "www.sabarmatilawn.site",
      owner: "Harshil Patel",
      owner_mobile: "9825022222",
      owner_email: "harshil@sabarmatilawn.com",
      contractor: "Manthan Mehta",
      contractor_mobile: "9978922222",
      contractor_email: "manthan@primecatering.com",
      rating: "4.8",
      reviews_count: 94,
      approx_cost: "₹1,200",
      capacity: 1500,
      indoor_outdoor: "Outdoor",
      parking: "Expansive (200 Cars)",
      power_backup: "Full Power Backup",
      rooms: "8 Luxury Guest Rooms",
      washrooms: "10 Executive Washrooms",
      best_for: ["Wedding", "Social Functions", "Corporate Event"],
      decoration: "Open",
      decor_details: null,
      catering: "Monopoly",
      catering_details: {
        name: "Prime Gujarati & Multi-cuisine Caterers",
        address: "Block B, SBR Arcade, Sindhu Bhavan Road, Ahmedabad",
        phone: "+91 79 2640 3333",
        owner: "Mukesh Shah",
        mobile: "9824033333",
        email: "mukesh@primecatering.com"
      },
      food_menu: "Exquisite Multi-course Gujarati heritage thali, live charcoal chaat counters, and custom designer sweet platters.",
      availability: "OPEN",
      recommendations: 88,
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=80",
      images: [
        "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80"
      ],
      bank_details: "ICICI Bank - A/C: 002401012345 - IFSC: ICIC0000024"
    },
    {
      id: 3,
      name: "The Club O7 Grand Resort",
      category: "Clubs & Resorts",
      city: "Ahmedabad",
      area: "Bopal",
      pincode: "380058",
      state: "Gujarat",
      address: "Off S.P. Ring Road, Shela, Bopal, Ahmedabad, GJ",
      phone: "+91 79 4000 3333",
      email: "stay@clubo7.com",
      website: "www.clubo7resort.site",
      owner: "Nilesh Shah",
      owner_mobile: "9825033333",
      owner_email: "nilesh@clubo7.com",
      contractor: "Amit Sharma",
      contractor_mobile: "9978933333",
      contractor_email: "decor@clubo7.com",
      rating: "4.7",
      reviews_count: 215,
      approx_cost: "₹1,800",
      capacity: 800,
      indoor_outdoor: "Both",
      parking: "Available (400 Cars + Valet)",
      power_backup: "100% Backed Up",
      rooms: "50 Premium Lodging Suites",
      washrooms: "20 Luxury Washrooms",
      best_for: ["Wedding", "Party", "Social Functions", "Get Together", "Corporate Event"],
      decoration: "Monopoly",
      decor_details: {
        name: "Elite Artistry Event Planners",
        address: "Club O7 Premises, Shela, Ahmedabad",
        phone: "+91 79 2650 4444",
        owner: "Karan Johar",
        mobile: "9824044444",
        email: "karan@eliteartistry.com"
      },
      catering: "Monopoly",
      catering_details: {
        name: "O7 Signature Kitchens",
        address: "Club O7 Resort, Shela, Ahmedabad",
        phone: "+91 79 2650 5555",
        owner: "Sanjay Chef",
        mobile: "9824055555",
        email: "sanjay@clubo7kitchens.com"
      },
      food_menu: "Elite multi-cuisine catering featuring Authentic Mexican, Royal Awadhi, live wood-fired bakery, and Belgian chocolate fountains.",
      availability: "BOOKED",
      recommendations: 120,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      images: [
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=80"
      ],
      bank_details: "State Bank of India - A/C: 30012345678 - IFSC: SBIN0001234"
    },
    {
      id: 4,
      name: "The Royal Palms Community Hall",
      category: "Community Halls",
      city: "Ahmedabad",
      area: "Satellite",
      pincode: "380015",
      state: "Gujarat",
      address: "Ramdevnagar Road, Satellite, Ahmedabad, GJ",
      phone: "+91 79 4000 4444",
      email: "satellite@communityhalls.org",
      website: "www.satellitehalls.org",
      owner: "Pravin Patel",
      owner_mobile: "9825044444",
      owner_email: "pravin@communityhalls.org",
      contractor: "Shailesh Decor",
      contractor_mobile: "9978944444",
      contractor_email: "shailesh@decor.com",
      rating: "4.5",
      reviews_count: 52,
      approx_cost: "₹500",
      capacity: 400,
      indoor_outdoor: "Indoor",
      parking: "Street Parking & Basement (20 Cars)",
      power_backup: "Available",
      rooms: "2 Deluxe AC Rooms",
      washrooms: "4 Standard Washrooms",
      best_for: ["Social Functions", "Get Together"],
      decoration: "Open",
      decor_details: null,
      catering: "Open",
      catering_details: null,
      food_menu: "Open layout for any choice of professional vegetarian caterer. Fully-equipped separate washing & kitchen layout area.",
      availability: "BLOCKED",
      recommendations: 30,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=80"
      ],
      bank_details: "Bank of Baroda - A/C: 10020100012345 - IFSC: BARB0SATELL"
    },
    {
      id: 5,
      name: "The Taj Mahal Palace & Banquets",
      category: "Clubs & Resorts",
      city: "Mumbai",
      area: "Colaba",
      pincode: "400001",
      state: "Maharashtra",
      address: "Apollo Bunder, Colaba, Mumbai, MH - 400001",
      phone: "+91 22 6665 3366",
      email: "banquets.mumbai@tajhotels.com",
      website: "www.tajhotels-mumbai.site",
      owner: "J. N. Tata Trust",
      owner_mobile: "9930055511",
      owner_email: "trustee@tajhotels.com",
      contractor: "Grand Decorators India",
      contractor_mobile: "9820066778",
      contractor_email: "orders@granddecorators.com",
      rating: "5.0",
      reviews_count: 512,
      approx_cost: "₹3,200",
      capacity: 1200,
      indoor_outdoor: "Indoor",
      parking: "Available (250 Cars + Valet)",
      power_backup: "100% Backed Up",
      rooms: "15 Luxury Suites Included",
      washrooms: "12 VIP Executive Washrooms",
      best_for: ["Wedding", "Social Functions", "Corporate Event"],
      decoration: "Monopoly",
      decor_details: {
        name: "Taj Floral Designers",
        address: "Taj Palace Annex, Colaba, Mumbai",
        phone: "+91 22 6665 4400",
        owner: "Vikram Malhotra",
        mobile: "9819922334",
        email: "vikram@tajfloral.com"
      },
      catering: "Monopoly",
      catering_details: {
        name: "Chef Hemant Chef Artistry",
        address: "Central Kitchen, Taj Mahal Palace",
        phone: "+91 22 6665 5500",
        owner: "Hemant Oberoi",
        mobile: "9820033445",
        email: "hemant@tajkitchens.com"
      },
      food_menu: "World-class gourmet catering featuring authentic Mughlai, French fine dining, live sushi and caviar counters, and artisan dessert stations.",
      availability: "OPEN",
      recommendations: 99,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      images: [
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
      ],
      bank_details: "State Bank of India - A/C: 11098234765 - IFSC: SBIN0000001"
    },
    {
      id: 6,
      name: "The Imperial Grand Ballroom",
      category: "Banquet Hall",
      city: "Delhi-NCR",
      area: "Connaught Place",
      pincode: "110001",
      state: "Delhi",
      address: "Janpath, Connaught Place, New Delhi - 110001",
      phone: "+91 11 4150 1234",
      email: "luxury@theimperialindia.site",
      website: "www.theimperialindia.site",
      owner: "S.P.S. Bahadur",
      owner_mobile: "9811022334",
      owner_email: "bahadur@theimperial.com",
      contractor: "Royal Weddings Delhi",
      contractor_mobile: "9810055667",
      contractor_email: "info@royalweddings.in",
      rating: "4.9",
      reviews_count: 280,
      approx_cost: "₹2,800",
      capacity: 800,
      indoor_outdoor: "Indoor",
      parking: "Available (150 Cars + Valet)",
      power_backup: "100% Backed Up",
      rooms: "6 Premium Guest Rooms",
      washrooms: "8 Luxury Washrooms",
      best_for: ["Wedding", "Social Functions", "Corporate Event"],
      decoration: "Monopoly",
      decor_details: {
        name: "Lutyens Floristry & Designs",
        address: "The Imperial Arcade, Janpath, Delhi",
        phone: "+91 11 4150 2200",
        owner: "Jaspreet Singh",
        mobile: "9810088990",
        email: "jaspreet@lutyensflorals.com"
      },
      catering: "Monopoly",
      catering_details: {
        name: "Imperial Artisanal Kitchens",
        address: "Connaught Place Complex, New Delhi",
        phone: "+91 11 4150 3300",
        owner: "Chef Devendra",
        mobile: "9811099887",
        email: "devendra@imperialkitchens.com"
      },
      food_menu: "Exquisite heritage North Indian, Awadhi live dum biryani stations, premium continental spreads, and custom Belgian chocolate fountains.",
      availability: "OPEN",
      recommendations: 96,
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
      ],
      bank_details: "HDFC Bank - A/C: 0003098273645 - IFSC: HDFC0000003"
    },
    {
      id: 7,
      name: "Palace Grounds Royal Lawn",
      category: "Party Plot",
      city: "Bengaluru",
      area: "Sadashivanagar",
      pincode: "560006",
      state: "Karnataka",
      address: "Gate No. 4, Palace Grounds, Bellary Road, Bengaluru - 560006",
      phone: "+91 80 2336 0888",
      email: "info@royalpalacelawns.site",
      website: "www.royalpalacelawns.site",
      owner: "Maharaja Trust Bangalore",
      owner_mobile: "9845011223",
      owner_email: "palacegrounds@karnataka.gov",
      contractor: "Elite Floral Art Bangalore",
      contractor_mobile: "9880033445",
      contractor_email: "eliteflowers@bangalore.in",
      rating: "4.8",
      reviews_count: 340,
      approx_cost: "₹1,500",
      capacity: 2500,
      indoor_outdoor: "Outdoor",
      parking: "Massive (600 Cars)",
      power_backup: "Full Generator Backup",
      rooms: "10 Luxury Royal Cottages",
      washrooms: "16 Clean Executive Washrooms",
      best_for: ["Wedding", "Social Functions", "Party"],
      decoration: "Open",
      decor_details: null,
      catering: "Open",
      catering_details: null,
      food_menu: "Open catering facility. Fully-functional royal kitchen layout capable of processing South Indian traditional banana leaf feasts as well as global barbecues.",
      availability: "OPEN",
      recommendations: 92,
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=80",
      images: [
        "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
      ],
      bank_details: "Canara Bank - A/C: 0684101009827 - IFSC: CNRB0000684"
    },
    {
      id: 8,
      name: "Leela Palace Grand Pavilion",
      category: "Clubs & Resorts",
      city: "Chennai",
      area: "Adyar",
      pincode: "600028",
      state: "Tamil Nadu",
      address: "Adyar Seaface, MRC Nagar, Chennai, TN - 600028",
      phone: "+91 44 3366 1234",
      email: "events@leela-chennai.site",
      website: "www.leela-chennai.site",
      owner: "C. P. Krishnan Nair",
      owner_mobile: "9444011223",
      owner_email: "krishnan@theleela.com",
      contractor: "Chennai Royal Decorators",
      contractor_mobile: "9840033221",
      contractor_email: "designs@chennairoyal.com",
      rating: "4.9",
      reviews_count: 198,
      approx_cost: "₹2,200",
      capacity: 1000,
      indoor_outdoor: "Both",
      parking: "Available (300 Cars + Valet)",
      power_backup: "100% Backed Up",
      rooms: "8 Sea-facing AC Suites",
      washrooms: "10 Clean Executive Washrooms",
      best_for: ["Wedding", "Party", "Social Functions", "Corporate Event"],
      decoration: "Monopoly",
      decor_details: {
        name: "Lila Coastal Artistry",
        address: "Leela Premises, MRC Nagar, Chennai",
        phone: "+91 44 3366 2200",
        owner: "Meenakshi Sundaram",
        mobile: "9840988776",
        email: "meenakshi@lilacoastal.com"
      },
      catering: "Monopoly",
      catering_details: {
        name: "The Leela Royal Chefs",
        address: "Seafront Kitchen, Leela Palace Chennai",
        phone: "+91 44 3366 3300",
        owner: "Chef N. Subramanian",
        mobile: "9841022334",
        email: "subramanian@theleela.com"
      },
      food_menu: "Royal South Indian Chettinad, live coastal seafood stations, premium vegetarian heritage thalis, and custom Italian gelato counters.",
      availability: "OPEN",
      recommendations: 97,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80"
      ],
      bank_details: "Indian Bank - A/C: 6012837465 - IFSC: IDIB000M001"
    },
    {
      id: 9,
      name: "Grand Backwater Resort Lawn",
      category: "Party Plot",
      city: "Kochi",
      area: "Marine Drive",
      pincode: "682031",
      state: "Kerala",
      address: "Shanmugham Road, Marine Drive, Kochi - 682031",
      phone: "+91 484 238 8888",
      email: "info@grandkochi-resorts.site",
      website: "www.grandkochi-resorts.site",
      owner: "Jose Kuriakose",
      owner_mobile: "9447012345",
      owner_email: "jose@grandkochi.com",
      contractor: "Malabar Event Planners",
      contractor_mobile: "9846055443",
      contractor_email: "malabar@events.in",
      rating: "4.7",
      reviews_count: 110,
      approx_cost: "₹1,600",
      capacity: 1800,
      indoor_outdoor: "Outdoor",
      parking: "Available (150 Cars + Boat jetty access)",
      power_backup: "Available",
      rooms: "6 Premium Backwater Cottages",
      washrooms: "6 Executive Washrooms",
      best_for: ["Wedding", "Party", "Social Functions", "Get Together"],
      decoration: "Open",
      decor_details: null,
      catering: "Open",
      catering_details: null,
      food_menu: "Open catering policy. Traditional Kerala Sadya feast layout, specialized live charcoal grilled fish and backwater pearl spot stations, and global Mocktail bars.",
      availability: "OPEN",
      recommendations: 90,
      image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=600&q=80",
      images: [
        "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80"
      ],
      bank_details: "Federal Bank - A/C: 10090200087645 - IFSC: FDRL0001009"
    },
    {
      id: 10,
      name: "Taj Falaknuma Palace Gardens",
      category: "Clubs & Resorts",
      city: "Hyderabad",
      area: "Falaknuma",
      pincode: "500053",
      state: "Telangana",
      address: "Engine Bowli, Falaknuma, Hyderabad - 500053",
      phone: "+91 40 6629 8585",
      email: "falaknuma.palace@tajhotels.com",
      website: "www.tajhotels-falaknuma.site",
      owner: "Nizam Charitable Trust",
      owner_mobile: "9849055443",
      owner_email: "secretary@nizamtrust.org",
      contractor: "Royal Nizam Planners",
      contractor_mobile: "9848011223",
      contractor_email: "design@royalnizam.com",
      rating: "5.0",
      reviews_count: 678,
      approx_cost: "₹3,500",
      capacity: 1500,
      indoor_outdoor: "Outdoor",
      parking: "Available (400 Cars + Horse buggy escort)",
      power_backup: "100% Backed Up",
      rooms: "12 Royal Suites Included",
      washrooms: "14 Italian Marble Executive Washrooms",
      best_for: ["Wedding", "Social Functions", "Corporate Event"],
      decoration: "Monopoly",
      decor_details: {
        name: "Nizam Floral Palace Planners",
        address: "Gardens Office, Taj Falaknuma",
        phone: "+91 40 6629 9000",
        owner: "Mirza Adil Baig",
        mobile: "9849099887",
        email: "mirza@nizamflorals.com"
      },
      catering: "Monopoly",
      catering_details: {
        name: "Nizami Royal Kitchens",
        address: "Taj Falaknuma Central Palace Kitchen",
        phone: "+91 40 6629 9100",
        owner: "Chef Sajid Qureshi",
        mobile: "9848033445",
        email: "sajid@tajkitchens.com"
      },
      food_menu: "Authentic Nizami Shahi feasts featuring slow-cooked Kachhe Gosht ki Biryani, Haleem live counters, premium dry-fruit desserts, and royalty tea spreads.",
      availability: "OPEN",
      recommendations: 100,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      images: [
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80"
      ],
      bank_details: "State Bank of India - A/C: 30092348574 - IFSC: SBIN0000008"
    }
  ];

  const filteredVenues = allVenues.filter((v) => {
    if (v.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (selectedArea && !v.area.toLowerCase().includes(selectedArea.toLowerCase())) return false;
    if (selectedCategory && v.category !== selectedCategory) return false;
    if (indoorOutdoor !== "Both" && v.indoor_outdoor !== indoorOutdoor && v.indoor_outdoor !== "Both") return false;
    if (eventType && !v.best_for.includes(eventType)) return false;
    if (guestCount && v.capacity < parseInt(guestCount)) return false;
    if (hasParking && !v.parking.toLowerCase().includes("available")) return false;
    if (hasPowerBackup && !v.power_backup.toLowerCase().includes("backed up") && !v.power_backup.toLowerCase().includes("available")) return false;
    if (hasRooms && v.rooms.toLowerCase().includes("no")) return false;
    return true;
  });

  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    if (selectedVenue) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedVenue]);

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-rose-500 selection:text-white font-sans">
      
      <Header
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        setSelectedCategory={setSelectedCategory}
        setSelectedVenue={setSelectedVenue}
        onVenueCategoryClick={(value) => {
          setSelectedCategory(value);
          const section = document.getElementById("venues-section");
          if (section) section.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {locationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs py-3.5 px-6 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <Check className="w-5 h-5 bg-white/20 p-0.5 rounded-full" />
          <span>{locationToast}</span>
        </div>
      )}

      {selectedVenue ? (
        <VenueDetailPage venue={selectedVenue} onBack={() => setSelectedVenue(null)} />
      ) : (
        <>
          <section className="relative h-[480px] bg-slate-900 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80" 
                alt="Beautiful Indian Wedding Hall Backdrop" 
                className="w-full h-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl font-black font-outfit text-white tracking-tight leading-tight">
                  India&apos;s Largest Wedding <span className="text-rose-500 underline decoration-rose-500/30 decoration-wavy">Venue</span>
                </h1>
                <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-white">
                  <span className="text-rose-500">Booking</span> Platform with 50,000+ venues
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/20 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
                <div 
                  onClick={() => { setCitySearchQuery(""); setIsCityModalOpen(true); }}
                  className="md:col-span-3 text-left border-b md:border-b-0 md:border-r border-slate-200 pb-3.5 md:pb-0 pr-0 md:pr-4 cursor-pointer group flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Wedding City</label>
                    <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 group-hover:text-rose-600 transition-colors">
                      <MapPin className="w-4 h-4 text-rose-500" /> {selectedCity}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>

                <div className="md:col-span-4 text-left border-b md:border-b-0 md:border-r border-slate-200 pb-3.5 md:pb-0 pr-0 md:pr-4">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-2.5">Locality</label>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Search className="w-4.5 h-4.5 text-slate-400 shrink-0 ml-2" />
                    <input 
                      type="text"
                      placeholder="e.g. Vastrapur, Marine Drive..."
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-800 outline-none placeholder-slate-400 w-full"
                    />
                    {selectedArea && (
                      <button onClick={() => setSelectedArea("")} className="text-slate-400 hover:text-slate-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="md:col-span-3 text-left pb-3.5 md:pb-0 pr-0 md:pr-4">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-2">Venue Type</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none cursor-pointer mt-1"
                  >
                    <option value="Banquet Hall">Banquet Hall</option>
                    <option value="Party Plot">Party Plot</option>
                    <option value="Clubs & Resorts">Clubs & Resorts</option>
                    <option value="Community Halls">Community Halls</option>
                  </select>
                </div>

                <button 
                  onClick={() => {
                    const section = document.getElementById("venues-section");
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="md:col-span-2 w-full py-3.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <span>Find venues</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          <section className="py-16 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black font-outfit text-slate-900 tracking-tight">
                  Wedding Venues by City
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Explore thousands of matching banquet spaces, party plots, and resorts across India&apos;s primary hubs
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-6">
                {popularCitiesList.map((cityObj, idx) => {
                  const isActive = selectedCity.toLowerCase() === cityObj.name.toLowerCase();
                  const iconSrc = isActive ? cityObj.activeIcon : cityObj.icon;

                  return (
                    <div 
                      key={idx}
                      onClick={() => {
                        setSelectedCity(cityObj.name);
                        setSelectedVenue(null);
                        const vSec = document.getElementById("venues-section");
                        if (vSec) vSec.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 shadow-sm group flex flex-col items-center justify-center space-y-4 hover:shadow-xl hover:-translate-y-1 text-center ${
                        isActive 
                          ? "border-rose-500 bg-rose-50/30 text-rose-600 font-black shadow-md shadow-rose-500/5" 
                          : "border-slate-200/80 hover:border-rose-300 bg-white text-slate-600 hover:text-rose-600"
                      }`}
                    >
                      <div className={`p-3 rounded-2xl transition-all ${
                        isActive ? "bg-rose-100 text-rose-600" : "bg-slate-100/70 text-rose-600 group-hover:bg-rose-50"
                      }`}>
                        <img 
                          src={iconSrc} 
                          alt={cityObj.name} 
                          className="w-14 h-14 object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <span className="text-[13px] font-black tracking-tight block text-slate-800 group-hover:text-rose-600 transition-colors">
                        {cityObj.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => { setCitySearchQuery(""); setIsCityModalOpen(true); }}
                  className="px-6 py-2.5 rounded-full border border-slate-200 hover:border-rose-300 hover:bg-rose-50/20 text-xs font-extrabold text-rose-600 flex items-center gap-1.5 mx-auto transition-all"
                >
                  <span>Other Cities</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          <section id="venues-section" className="bg-slate-50 border-b border-slate-200 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-10 overflow-x-auto py-5 scrollbar-none">
                {[
                  { id: "Banquet Hall", name: "Banquet Halls", desc: "Premium AC halls", icon: Hotel },
                  { id: "Party Plot", name: "Party Plots", desc: "Open-air scenic lawns", icon: Sparkles },
                  { id: "Clubs & Resorts", name: "Clubs & Resorts", desc: "Luxury resort spaces", icon: Building },
                  { id: "Community Halls", name: "Community Halls", desc: "Affordable spaces", icon: Hotel }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = selectedCategory === tab.id;
                  
                  return (
                    <div
                      key={tab.id}
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`cursor-pointer pb-2 flex items-center gap-3 shrink-0 border-b-4 transition-all duration-200 ${
                        isActive 
                          ? "border-rose-600 text-rose-600" 
                          : "border-transparent text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                        isActive ? "bg-rose-50 border-rose-200" : "bg-white border-slate-200"
                      }`}>
                        <Icon className={`w-5 h-5 ${isActive ? "text-rose-600" : "text-slate-600"}`} />
                      </div>
                      <div className="text-left">
                        <p className="font-extrabold text-sm tracking-tight">{tab.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{tab.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-4 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                <span>Occasion:</span>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer text-slate-800"
                >
                  <option value="">Any Events</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Party">Party / Social</option>
                  <option value="Corporate Event">Corporate</option>
                  <option value="Get Together">Get Together</option>
                </select>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                <span>Space Layout:</span>
                <select
                  value={indoorOutdoor}
                  onChange={(e) => setIndoorOutdoor(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer text-slate-800"
                >
                  <option value="Both">Both (Indoor/Outdoor)</option>
                  <option value="Indoor">Indoor Only</option>
                  <option value="Outdoor">Outdoor Only</option>
                </select>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                <span>Min Capacity:</span>
                <input
                  type="number"
                  placeholder="e.g. 500 Guests"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-24 bg-transparent outline-none text-slate-800 font-semibold text-center"
                />
              </div>

              <button
                onClick={() => setHasParking(!hasParking)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                  hasParking 
                    ? "bg-rose-50 border-rose-200 text-rose-600" 
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Parking Facility
              </button>

              <button
                onClick={() => setHasPowerBackup(!hasPowerBackup)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                  hasPowerBackup 
                    ? "bg-rose-50 border-rose-200 text-rose-600" 
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Power Back Up
              </button>

              <button
                onClick={() => setHasRooms(!hasRooms)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                  hasRooms 
                    ? "bg-rose-50 border-rose-200 text-rose-600" 
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Guest Rooms
              </button>
            </div>
          </section>

          <section className="py-12 bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-black font-outfit text-slate-900 mb-8 text-left">
                {selectedCategory} options in <span className="text-rose-600">{selectedCity}</span>
                <span className="text-xs text-slate-400 block font-normal mt-1 font-sans">
                  Showing {filteredVenues.length} highly vetted host profiles matching parameters
                </span>
              </h2>

              {filteredVenues.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-8">
                  {filteredVenues.map((venue) => (
                    <div
                      key={venue.id}
                      onClick={() => setSelectedVenue(venue)}
                      className="cursor-pointer bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                        <img
                          src={venue.image}
                          alt={venue.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
                        <div className="absolute top-4 left-4 flex gap-1.5">
                          <span className="bg-white/95 backdrop-blur text-slate-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border border-slate-200">
                            {venue.indoor_outdoor} Category
                          </span>
                          <span className="bg-rose-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md shadow">
                            {venue.category}
                          </span>
                        </div>
                        <div className={`absolute bottom-4 left-4 text-[10px] font-extrabold px-3 py-1 rounded-lg shadow-sm border ${
                          venue.availability === "OPEN" 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                            : venue.availability === "BLOCKED" 
                            ? "bg-amber-50 border-amber-200 text-amber-700" 
                            : "bg-rose-50 border-rose-200 text-rose-700"
                        }`}>
                          Availability: {venue.availability}
                        </div>
                      </div>

                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-left">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors leading-tight font-outfit">
                              {venue.name}
                            </h3>
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-xs font-black shrink-0 shadow-sm">
                              {venue.rating} <Star className="w-3 h-3 fill-white text-white" />
                            </div>
                          </div>
                          <p className="text-xs text-rose-500 font-bold mt-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {venue.area}, {venue.city}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {venue.best_for.slice(0, 3).map((item, i) => (
                            <span key={i} className="text-[10px] bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md text-slate-600 font-bold">
                              ✓ {item}
                            </span>
                          ))}
                        </div>
                        <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Approximate Cost</p>
                            <p className="text-base font-black text-slate-900">{venue.approx_cost} <span className="text-[10px] text-slate-400 font-normal">/ Veg Plate</span></p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Max Capacity</p>
                            <p className="text-xs font-bold text-slate-800 mt-1">{venue.capacity} Guests</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-50 mt-1">
                          <span className="text-[10px] font-semibold text-slate-500">
                            {venue.parking} &middot; {venue.rooms}
                          </span>
                          <span className="text-xs font-black text-rose-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                            View Info <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mx-auto">
                    <Info className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 font-outfit">No Matching Venues</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No verified <strong>{selectedCategory}</strong> listings match your strict filters in <strong>{selectedCity}</strong>. Try resetting filters or choosing another popular city.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedArea("");
                      setIndoorOutdoor("Both");
                      setEventType("");
                      setGuestCount("");
                      setHasParking(false);
                      setHasPowerBackup(false);
                      setHasRooms(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </section>

          <section id="partner-section" className="py-20 bg-white border-t border-slate-200 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
              <div className="max-w-2xl mx-auto space-y-3">
                <span className="text-rose-600 font-black text-xs uppercase tracking-widest px-3 py-1 bg-rose-50 border border-rose-100 rounded-full">
                  Partner Listing Program
                </span>
                <h2 className="text-3xl font-black font-outfit text-slate-900 pt-1">
                  Add Your Venue in 5 Easy Steps
                </h2>
                <p className="text-xs text-slate-400">
                  Join India&apos;s premium verified booking data bank and start receiving reservations instantly
                </p>
              </div>

              <div className="grid md:grid-cols-5 gap-6 text-left relative">
                {[
                  { step: "01", title: "Add Your Venue", desc: "Log in, complete your listing profile, and submit your venue details for quick approval.", badge: "Submit Profile" },
                  { step: "02", title: "Get Approved", desc: "Our vetting team screens every venue profile for absolute accuracy and legitimacy.", badge: "Quality Check" },
                  { step: "03", title: "Start Selling", desc: "Add your pictures, connect your profile on LinkedIn/Facebook, confirm accuracy of availability, pricing, policies.", badge: "Go Live" },
                  { step: "04", title: "Communicate", desc: "We connect you with looking event discoverers. We encourage communication via questions and Site Visits.", badge: "Engage Leads" },
                  { step: "05", title: "Get Booked", desc: "Receive booking requests with 24 hours to act. Deposit is securely sent 24 hours after the successful event date.", badge: "Fast Pay" }
                ].map((s, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-slate-200/60 p-6 rounded-3xl relative space-y-4 hover:shadow-lg transition-all duration-300">
                    <span className="w-10 h-10 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center shadow shadow-rose-600/20">
                      {s.step}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 font-outfit">{s.title}</h4>
                      <p className="text-[11px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">{s.badge}</p>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {isCityModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-4xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
                <button 
                  onClick={() => setIsCityModalOpen(false)}
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="space-y-6 text-left border-b border-slate-100 pb-6">
                  <div className="space-y-1 pr-12">
                    <h3 className="text-xl font-black font-outfit text-slate-900">Choose Your Wedding City</h3>
                    <p className="text-xs text-slate-400">Select popular city hubs or search for your custom city below</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200/80 px-4 py-2.5 flex items-center gap-2">
                      <Search className="w-5 h-5 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="Search for your city..."
                        value={citySearchQuery}
                        onChange={(e) => setCitySearchQuery(e.target.value)}
                        className="bg-transparent text-sm font-bold text-slate-800 outline-none w-full placeholder-slate-400"
                      />
                      {citySearchQuery && (
                        <button onClick={() => setCitySearchQuery("")} className="text-slate-400 hover:text-slate-600">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button 
                      onClick={handleDetectLocation}
                      disabled={isDetectingLocation}
                      className="px-5 py-3 rounded-2xl bg-rose-50 border border-rose-100 hover:bg-rose-100/50 text-rose-600 text-xs font-black flex items-center justify-center gap-2 shrink-0 transition-all active:scale-[0.98] disabled:opacity-60"
                    >
                      {isDetectingLocation ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-rose-600 border-t-transparent animate-spin" />
                          <span>Locating...</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-rose-500 animate-pulse" />
                          <span>Detect my location</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="py-6 space-y-4 text-left border-b border-slate-100">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Popular Cities</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {popularCitiesList.map((cityObj, idx) => {
                      const CityIcon = cityObj.icon;
                      return (
                        <div 
                          key={idx}
                          onClick={() => {
                            setSelectedCity(cityObj.name);
                            setIsCityModalOpen(false);
                            const element = document.getElementById("venues-section");
                            if (element) element.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="cursor-pointer p-3 rounded-xl border border-slate-100 hover:border-rose-200 hover:bg-rose-50/10 flex flex-col items-center justify-center space-y-2 text-center group transition-all"
                        >
                          <CityIcon />
                          <span className="text-[11px] font-extrabold text-slate-700 group-hover:text-rose-600 transition-colors">
                            {cityObj.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="py-6 space-y-4 text-left">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Other Cities</h4>
                  {alphabetHeaders.length > 0 ? (
                    <div className="space-y-6">
                      {alphabetHeaders.map((letter) => (
                        <div key={letter} className="flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-6 border-b border-slate-50 pb-4">
                          <span className="text-base font-black text-rose-600 shrink-0 w-8">{letter}</span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2.5 w-full">
                            {groupedCities[letter].map((city, cIdx) => (
                              <div 
                                key={cIdx}
                                onClick={() => {
                                  setSelectedCity(city);
                                  setIsCityModalOpen(false);
                                  const sec = document.getElementById("venues-section");
                                  if (sec) sec.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="text-xs font-semibold text-slate-600 hover:text-rose-600 cursor-pointer transition-colors"
                              >
                                {city}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400 font-medium text-xs">
                      No matching cities found for &quot;{citySearchQuery}&quot;
                    </div>
                  )}
                </div>
                <div className="pt-6 border-t border-slate-100 flex justify-center">
                  <button 
                    onClick={() => setIsCityModalOpen(false)}
                    className="text-rose-600 hover:text-rose-700 text-xs font-black hover:underline cursor-pointer"
                  >
                    Hide all cities
                  </button>
                </div>
              </div>
            </div>
          )}

        </>
      )}

      <footer id="footer-section" className="bg-slate-950 py-12 text-slate-400 text-xs border-t border-slate-900 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4 text-left">
            <h3 className="text-lg font-black text-white font-outfit">ClickMy<span className="text-rose-500">Venue</span></h3>
            <p className="font-light leading-relaxed text-slate-400">
              India&apos;s highly verified, premium local venue discovery portal matching planners with perfect event setups.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-[10px]">Venue Directory</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white transition-colors">Banquet Halls in Ahmedabad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Party Plots in Satellite</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Clubs & Resorts in Bopal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community Halls near Vastrapur</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-[10px]">For Partners</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white transition-colors">List Your Venue</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Monopoly Decorator Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Escrow Pay Protection</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SMS & WhatsApp Alerts</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-[10px]">Contact Host</h4>
            <p className="leading-relaxed">
              Sharma Events Arcade, Sindhu Bhavan Road, Bodakdev, Ahmedabad - 380054.<br />
              Email: support@clickmyvenue.com<br />
              Phone: +91 79 4000 8888
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ClickMyVenue.com (Hosted on venuehub.site). All rights reserved.</p>
          <div className="flex gap-4">
            <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800 font-semibold text-[10px] text-white">Vetted Escrow Only</span>
            <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800 font-semibold text-[10px] text-white">Razorpay Guaranteed</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// ----------------------------------------------------------------------------------
// SUBCOMPONENT: ZOMATO-INSPIRED VENUE DETAIL PAGE (kaffa-coffee-roasters Vastrapur layout)
// ----------------------------------------------------------------------------------
function VenueDetailPage({ venue, onBack }) {
  const [selectedTab, setSelectedTab] = useState("Overview");
  
  // Checking widget states
  const [requestDate, setRequestDate] = useState("");
  const [requestGuests, setRequestGuests] = useState("");
  const [checkedAvailability, setCheckedAvailability] = useState(null);

  const checkSlotStatus = (e) => {
    e.preventDefault();
    if (!requestDate) return;
    // Simple mock logic reflecting user specs
    if (venue.availability === "OPEN") {
      setCheckedAvailability("OPEN - Available to Book Instantly!");
    } else {
      setCheckedAvailability(`${venue.availability} - Slot is occupied on this date.`);
    }
  };

  return (
    <div className="bg-white py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Back navigation button */}
      <button 
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-rose-600 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
      >
        ← Back to Listings
      </button>

      {/* 1. ZOMATO MULTI-PHOTO GALLERY GRID ( 1 large left, 2x2 grid right ) */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-2.5 rounded-2xl overflow-hidden shadow-sm mb-8 h-96">
        
        {/* Main Photo (Left) */}
        <div className="md:col-span-2 relative bg-slate-100 overflow-hidden h-full">
          <img 
            src={venue.images[0]} 
            alt={venue.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Small Photos (2x2 Grid Right) */}
        <div className="hidden md:grid grid-cols-2 col-span-2 gap-2.5 h-full">
          {venue.images.slice(1, 5).map((img, i) => (
            <div key={i} className="overflow-hidden bg-slate-100 h-full relative">
              <img 
                src={img} 
                alt="Venue Layout" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              {i === 3 && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-slate-900/50">
                  View All Photos
                </div>
              )}
            </div>
          ))}
        </div>

      </section>

      {/* 2. VENUE HEADER INFO */}
      <section className="flex flex-col md:flex-row md:items-start justify-between border-b border-slate-200 pb-6 mb-6 gap-4">
        <div className="space-y-2 text-left">
          <h1 className="text-3xl font-black font-outfit text-slate-900 tracking-tight">{venue.name}</h1>
          <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">{venue.category} &middot; {venue.indoor_outdoor}</p>
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-2xl">{venue.address}</p>
        </div>

        {/* Big Rating Box */}
        <div className="flex items-center gap-3 self-start">
          <div className="text-right">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-sm font-black shadow-md">
              {venue.rating} <Star className="w-4 h-4 fill-white text-white" />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{venue.reviews_count} Reviews</p>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="text-left">
            <p className="text-sm font-black text-rose-600">{venue.recommendations}%</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Recommendation</p>
          </div>
        </div>
      </section>

      {/* 3. ZOMATO NAV TABS (Overview, Photos, Reviews, Maps) */}
      <section className="border-b border-slate-200 mb-8">
        <div className="flex items-center gap-8 text-sm font-extrabold text-slate-500">
          {["Overview", "Photos", "Reviews", "Maps & Contact"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTab(t)}
              className={`pb-3 border-b-2 font-outfit text-base transition-all ${
                selectedTab === t 
                  ? "border-rose-600 text-rose-600" 
                  : "border-transparent hover:text-slate-950"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* 4. TAB PANELS */}
      <section className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Side Info Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {selectedTab === "Overview" && (
            <div className="space-y-8 text-left">
              
              {/* About description */}
              <div className="space-y-3">
                <h3 className="text-lg font-black font-outfit text-slate-900">About this place</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light font-sans">{venue.address} was established by {venue.owner} to bring high quality, vetted events spaces with full transparent utility configurations.</p>
              </div>

              {/* Best utility occasions */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-black font-outfit text-slate-900">Best utility of venue</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {venue.best_for.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities checkmarks */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-black font-outfit text-slate-900">Venue facilities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-1.5">
                    <Car className="w-5 h-5 text-indigo-600" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Parking</p>
                    <p className="text-xs font-bold text-slate-800">{venue.parking}</p>
                  </div>
                  
                  <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-1.5">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Electricity</p>
                    <p className="text-xs font-bold text-slate-800">{venue.power_backup}</p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-1.5">
                    <Hotel className="w-5 h-5 text-rose-500" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Guest Rooms</p>
                    <p className="text-xs font-bold text-slate-800">{venue.rooms}</p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-1.5">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Washrooms</p>
                    <p className="text-xs font-bold text-slate-800">{venue.washrooms}</p>
                  </div>
                </div>
              </div>

              {/* Monopoly details (Decorator / Caterer) */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-lg font-black font-outfit text-slate-900">Vendor configuration</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Decorator monopoly */}
                  <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                    <h4 className="font-extrabold text-sm text-slate-900 font-outfit border-b border-slate-200 pb-2">Decoration Policy</h4>
                    <p className="text-xs text-slate-500">Option Type: <strong className="text-rose-600 font-bold uppercase">{venue.decoration} Decorator</strong></p>
                    {venue.decor_details ? (
                      <div className="space-y-1 text-slate-600 text-xs font-semibold pt-1">
                        <p className="font-bold text-slate-800 text-xs">{venue.decor_details.name}</p>
                        <p className="font-light">{venue.decor_details.address}</p>
                        <p className="pt-1.5">Owner: {venue.decor_details.owner}</p>
                        <p>Mobile: {venue.decor_details.mobile}</p>
                        <p>Phone: {venue.decor_details.phone}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 leading-relaxed font-light">Open decorator policy. You are permitted to invite any certified decorator as per your event layouts.</p>
                    )}
                  </div>

                  {/* Caterer monopoly */}
                  <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                    <h4 className="font-extrabold text-sm text-slate-900 font-outfit border-b border-slate-200 pb-2">Catering Policy</h4>
                    <p className="text-xs text-slate-500">Option Type: <strong className="text-rose-600 font-bold uppercase">{venue.catering} Catering</strong></p>
                    {venue.catering_details ? (
                      <div className="space-y-1 text-slate-600 text-xs font-semibold pt-1">
                        <p className="font-bold text-slate-800 text-xs">{venue.catering_details.name}</p>
                        <p className="font-light">{venue.catering_details.address}</p>
                        <p className="pt-1.5">Owner: {venue.catering_details.owner}</p>
                        <p>Mobile: {venue.catering_details.mobile}</p>
                        <p>Phone: {venue.catering_details.phone}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 leading-relaxed font-light">Open catering policy. Planners are free to appoint external professional caterers for multi-cuisine menus.</p>
                    )}
                  </div>

                </div>
              </div>

              {/* Food menu and options */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-lg font-black font-outfit text-slate-900">Food Menu & Options</h3>
                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 text-xs text-slate-700 leading-relaxed font-medium">
                  {venue.food_menu}
                </div>
              </div>

            </div>
          )}

          {selectedTab === "Photos" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {venue.images.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden bg-slate-100 aspect-video relative shadow-sm border border-slate-200">
                  <img src={img} alt="Venue layout detail" className="w-full h-full object-cover hover:scale-105 transition-all duration-300" />
                </div>
              ))}
            </div>
          )}

          {selectedTab === "Reviews" && (
            <div className="space-y-6 text-left">
              <h3 className="text-lg font-black font-outfit text-slate-900">Reviews & Social Recommendation</h3>
              
              <div className="space-y-4">
                {[
                  { name: "Suresh Rawat", date: "May 2026", text: "Stunning experience booking this venue! The decorator was extremely prompt, and our wedding guests loved the overall layout and facilities.", rating: "5.0" },
                  { name: "Priya Mehta", date: "April 2026", text: "Excellent spaces and perfect location. Parking is extremely massive, and the clean guest rooms made overnight guests very comfortable.", rating: "4.8" }
                ].map((rev, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-slate-200/80 bg-white space-y-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">{rev.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{rev.date}</p>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 text-white text-xs font-black">
                        {rev.rating} ★
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-light">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "Maps & Contact" && (
            <div className="space-y-6 text-left">
              <h3 className="text-lg font-black font-outfit text-slate-900">Map & Contact Details</h3>
              
              <div className="rounded-2xl overflow-hidden border border-slate-200 h-64 bg-slate-100 relative">
                {/* Mock Map Frame */}
                <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center p-4 text-center space-y-3">
                  <Map className="w-10 h-10 text-rose-500 animate-pulse" />
                  <p className="text-xs font-bold text-slate-900 font-outfit">{venue.name}</p>
                  <p className="text-[11px] text-slate-500 max-w-sm">{venue.address}</p>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md">
                    Open in Google Maps
                  </a>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-1 text-slate-600 text-xs font-semibold">
                  <p className="text-slate-900 font-bold border-b pb-1 mb-2 text-sm">Venue Contacts</p>
                  <p>Email ID: {venue.email}</p>
                  <p>Phone No: {venue.phone}</p>
                  <p>Website: <a href={`http://${venue.website}`} target="_blank" rel="noreferrer" className="text-rose-600 font-bold">{venue.website}</a></p>
                  <p>PIN Code: {venue.pincode}</p>
                </div>
                <div className="space-y-1 text-slate-600 text-xs font-semibold">
                  <p className="text-slate-900 font-bold border-b pb-1 mb-2 text-sm">Owner Details</p>
                  <p>Name of Owner: {venue.owner}</p>
                  <p>Owner Mobile: {venue.owner_mobile}</p>
                  <p>Owner Email: {venue.owner_email}</p>
                  <p className="pt-2 text-[10px] text-slate-400">GST Registration and VAT files verified by ClickMyVenue.</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Side Sticky Check-Availability Widget (Zomato-inspired) */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl space-y-6 text-left">
            
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Plate Price (Veg)</span>
              <p className="text-2xl font-black text-slate-900">{venue.approx_cost} <span className="text-xs text-slate-400 font-normal">/ Veg Plate</span></p>
            </div>

            <form onSubmit={checkSlotStatus} className="space-y-4">
              
              {/* Date select */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Requested Date</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={requestDate}
                    onChange={(e) => { setRequestDate(e.target.value); setCheckedAvailability(null); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Guest count */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Approx Guest Count</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    placeholder="e.g. 350 Guests"
                    value={requestGuests}
                    onChange={(e) => setRequestGuests(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                Check Date Availability & Booking Cost
              </button>

            </form>

            {/* Availability response alerts */}
            {checkedAvailability && (
              <div className={`p-4 rounded-xl border text-xs font-bold ${
                checkedAvailability.includes("OPEN") 
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                  : "bg-rose-50 border-rose-100 text-rose-800"
              }`}>
                {checkedAvailability}
              </div>
            )}

            {/* Static Host Details & Bank Information */}
            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600 font-semibold">
              <p className="text-slate-900 font-bold border-b pb-1 text-xs">Host Verification</p>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>100% Escrow safe Bank Account</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-[10px] font-mono text-slate-500 leading-relaxed pt-1">
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[9px] mb-1">Owner Escrow Account</p>
                {venue.bank_details}
              </div>
            </div>

          </div>
        </div>

      </section>

    </div>
  );
}
