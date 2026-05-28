-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2026 at 11:32 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clickmyvenue`
--

-- --------------------------------------------------------

--
-- Table structure for table `amenities`
--

CREATE TABLE `amenities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `category` enum('basic','av','food','recreation','safety','accessibility') NOT NULL DEFAULT 'basic',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `amenities`
--

INSERT INTO `amenities` (`id`, `name`, `icon`, `category`, `active`, `created_at`, `updated_at`) VALUES
(1, 'Central Air Conditioning', 'Wind', 'basic', 1, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(2, 'Valet Parking', 'Car', 'basic', 1, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(3, 'Full Power Backup', 'Zap', 'basic', 1, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(4, 'Guest Rooms (Lodging)', 'Bed', 'basic', 1, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(5, 'In-house Catering', 'Utensils', 'food', 1, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(6, 'Swimming Pool Access', 'Droplet', 'recreation', 1, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(7, 'Audio / Visual Systems (Mic & Projector)', 'Mic', 'av', 1, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(8, 'CCTV & Guarded Security', 'Shield', 'safety', 1, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(9, 'Wheelchair Friendly Accessibility', 'UserCheck', 'accessibility', 1, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(10, 'WiFi Internet', 'Wifi', 'basic', 1, '2026-05-23 09:16:56', '2026-05-23 09:16:56');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_number` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `venue_id` bigint(20) UNSIGNED NOT NULL,
  `event_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `event_date` date NOT NULL,
  `event_time` varchar(255) DEFAULT NULL,
  `guest_count` int(10) UNSIGNED NOT NULL,
  `special_requirements` text DEFAULT NULL,
  `status` enum('pending','accepted','declined','confirmed','completed','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `deposit_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `commission_rate` decimal(5,2) NOT NULL DEFAULT 10.00,
  `commission_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `accepted_at` timestamp NULL DEFAULT NULL,
  `declined_at` timestamp NULL DEFAULT NULL,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `accept_deadline` timestamp NULL DEFAULT NULL,
  `decline_reason` text DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL DEFAULT 'India',
  `slug` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `venue_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `name`, `state`, `country`, `slug`, `image`, `featured`, `venue_count`, `created_at`, `updated_at`) VALUES
(1, 'Ahmedabad', 'Gujarat', 'India', 'ahmedabad', 'https://images.unsplash.com/photo-1595818987114-11a5b8da2f48?auto=format&fit=crop&w=600&q=80', 1, 1, '2026-05-23 09:16:56', '2026-05-23 09:16:57'),
(2, 'Mumbai', 'Maharashtra', 'India', 'mumbai', 'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=600&q=80', 1, 1, '2026-05-23 09:16:56', '2026-05-23 09:16:57'),
(3, 'Delhi NCR', 'Delhi', 'India', 'delhi-ncr', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80', 1, 0, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(4, 'Bangalore', 'Karnataka', 'India', 'bangalore', 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80', 1, 0, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(5, 'Goa', 'Goa', 'India', 'goa', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', 1, 0, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(6, 'Jaipur', 'Rajasthan', 'India', 'jaipur', 'https://images.unsplash.com/photo-1477584322813-ac04ee8dfb5a?auto=format&fit=crop&w=600&q=80', 0, 0, '2026-05-23 09:16:56', '2026-05-23 09:16:56');

-- --------------------------------------------------------

--
-- Table structure for table `event_types`
--

CREATE TABLE `event_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` enum('wedding','social','corporate','party','cultural','outdoor') NOT NULL DEFAULT 'social',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event_types`
--

INSERT INTO `event_types` (`id`, `name`, `slug`, `icon`, `image`, `category`, `active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Wedding Ceremony & Reception', 'wedding', NULL, NULL, 'wedding', 1, 1, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(2, 'Pre-Wedding (Sangeet / Mehendi)', 'pre-wedding', NULL, NULL, 'wedding', 1, 2, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(3, 'Birthday Party', 'birthday', NULL, NULL, 'social', 1, 3, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(4, 'Corporate Conference / Seminar', 'corporate-conference', NULL, NULL, 'corporate', 1, 4, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(5, 'Cocktail & Bachelor Party', 'bachelor-cocktail', NULL, NULL, 'party', 1, 5, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(6, 'Anniversary & Social Gathering', 'social-gathering', NULL, NULL, 'social', 1, 6, '2026-05-23 09:16:56', '2026-05-23 09:16:56');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2026_05_23_143905_create_cities_table', 1),
(6, '2026_05_23_143906_create_event_types_table', 1),
(7, '2026_05_23_143906_create_venue_types_table', 1),
(8, '2026_05_23_143907_create_amenities_table', 1),
(9, '2026_05_23_143907_create_venue_owners_table', 1),
(10, '2026_05_23_143908_create_venues_table', 1),
(11, '2026_05_23_144000_create_venue_event_types_table', 1),
(12, '2026_05_23_144001_create_venue_amenities_table', 1),
(13, '2026_05_23_144002_create_venue_photos_table', 1),
(14, '2026_05_23_144003_create_venue_availability_table', 1),
(15, '2026_05_23_144004_create_bookings_table', 1),
(16, '2026_05_23_144005_create_payments_table', 1),
(17, '2026_05_23_144006_create_reviews_table', 1),
(18, '2026_05_23_144007_create_wishlists_table', 1),
(19, '2026_05_23_144008_create_subscription_plans_table', 1),
(20, '2026_05_23_144009_create_owner_subscriptions_table', 1),
(21, '2026_05_23_144010_create_support_tickets_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `owner_subscriptions`
--

CREATE TABLE `owner_subscriptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `plan_id` bigint(20) UNSIGNED NOT NULL,
  `billing_cycle` enum('monthly','yearly') NOT NULL DEFAULT 'monthly',
  `status` enum('active','cancelled','expired','past_due') NOT NULL DEFAULT 'active',
  `razorpay_subscription_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `starts_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ends_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(5) NOT NULL DEFAULT 'INR',
  `type` enum('deposit','full','refund') NOT NULL DEFAULT 'deposit',
  `gateway` enum('razorpay') NOT NULL DEFAULT 'razorpay',
  `gateway_order_id` varchar(255) DEFAULT NULL,
  `gateway_payment_id` varchar(255) DEFAULT NULL,
  `gateway_signature` varchar(255) DEFAULT NULL,
  `status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `gateway_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gateway_response`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', '53df1898d2463e347fab44a6be6072b77bceaf141a08290b02f5b71cf01eaf63', '[\"*\"]', '2026-05-24 05:24:35', NULL, '2026-05-24 04:39:21', '2026-05-24 05:24:35');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `booking_id` bigint(20) UNSIGNED NOT NULL,
  `venue_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `body` text NOT NULL,
  `photos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`photos`)),
  `helpful_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `owner_reply` text DEFAULT NULL,
  `owner_replied_at` timestamp NULL DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'approved',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plans`
--

CREATE TABLE `subscription_plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price_monthly` decimal(10,2) NOT NULL DEFAULT 0.00,
  `price_yearly` decimal(10,2) NOT NULL DEFAULT 0.00,
  `max_venues` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `max_photos_per_venue` int(10) UNSIGNED NOT NULL DEFAULT 5,
  `featured_listing` tinyint(1) NOT NULL DEFAULT 0,
  `priority_support` tinyint(1) NOT NULL DEFAULT 0,
  `analytics_access` tinyint(1) NOT NULL DEFAULT 0,
  `commission_rate` decimal(5,2) NOT NULL DEFAULT 10.00,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `razorpay_plan_id_monthly` varchar(255) DEFAULT NULL,
  `razorpay_plan_id_yearly` varchar(255) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscription_plans`
--

INSERT INTO `subscription_plans` (`id`, `name`, `slug`, `description`, `price_monthly`, `price_yearly`, `max_venues`, `max_photos_per_venue`, `featured_listing`, `priority_support`, `analytics_access`, `commission_rate`, `features`, `razorpay_plan_id_monthly`, `razorpay_plan_id_yearly`, `active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Free', 'free', 'Perfect to get started listing your venue', 0.00, 0.00, 1, 5, 0, 0, 0, 15.00, '\"[\\\"1 Active Venue\\\",\\\"5 Photos Max\\\",\\\"15% Booking Commission\\\",\\\"Standard Listing\\\"]\"', NULL, NULL, 1, 1, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(2, 'Basic', 'basic', 'Grow your event business with priority visibility', 999.00, 9999.00, 3, 15, 0, 1, 1, 10.00, '\"[\\\"3 Active Venues\\\",\\\"15 Photos Max\\\",\\\"10% Booking Commission\\\",\\\"Priority Support\\\",\\\"Dashboard Analytics\\\"]\"', NULL, NULL, 1, 2, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(3, 'Pro Premium', 'pro', 'Maximum visibility, zero commission, unlimited leads', 2499.00, 24999.00, 10, 30, 1, 1, 1, 0.00, '\"[\\\"Up to 10 Venues\\\",\\\"30 Photos Max\\\",\\\"0% Booking Commission\\\",\\\"Featured Badge on Search\\\",\\\"Unlimited Enquiries\\\",\\\"Premium Analytics\\\"]\"', NULL, NULL, 1, 3, '2026-05-23 09:16:56', '2026-05-23 09:16:56');

-- --------------------------------------------------------

--
-- Table structure for table `support_messages`
--

CREATE TABLE `support_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ticket_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `message` text NOT NULL,
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
  `is_staff` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ticket_number` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `subject` varchar(255) NOT NULL,
  `category` enum('booking','payment','venue','account','other') NOT NULL DEFAULT 'other',
  `status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `resolved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `phone_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','owner','admin') NOT NULL DEFAULT 'user',
  `avatar` varchar(255) DEFAULT NULL,
  `status` enum('active','banned','pending') NOT NULL DEFAULT 'active',
  `otp` varchar(6) DEFAULT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `phone_verified_at`, `password`, `role`, `avatar`, `status`, `otp`, `otp_expires_at`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Super Admin', 'admin@clickmyvenue.com', '9999999999', NULL, NULL, '$2y$10$5ECAO6E11DkBwdpqNonNju26dZiec8kStBWZxnwLYKDqNejatSdCm', 'admin', NULL, 'active', NULL, NULL, NULL, '2026-05-23 09:16:57', '2026-05-23 09:16:57', NULL),
(2, 'Rajesh Sharma', 'owner@clickmyvenue.com', '9888888888', NULL, NULL, '$2y$10$xdf5vlbXrYUqqpZjBt4G5uXEmv3kT610ZFNGGTtVIImjRJN9/z7ae', 'owner', NULL, 'active', NULL, NULL, NULL, '2026-05-23 09:16:57', '2026-05-23 09:16:57', NULL),
(3, 'Amit Patel', 'user@clickmyvenue.com', '9777777777', NULL, NULL, '$2y$10$yU6IXrqNdNUL2Kcho3yPIuBXA4b8dmQtHmltYWxT3Cd4MeoEtJz12', 'user', NULL, 'active', NULL, NULL, NULL, '2026-05-23 09:16:57', '2026-05-23 09:16:57', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `venues`
--

CREATE TABLE `venues` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `owner_id` bigint(20) UNSIGNED NOT NULL,
  `city_id` bigint(20) UNSIGNED NOT NULL,
  `type_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `address` text NOT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `capacity_min` int(10) UNSIGNED NOT NULL DEFAULT 10,
  `capacity_max` int(10) UNSIGNED NOT NULL DEFAULT 100,
  `price_per_plate` decimal(10,2) DEFAULT NULL,
  `flat_rent_price` decimal(12,2) DEFAULT NULL,
  `price_min` decimal(12,2) DEFAULT NULL,
  `category` enum('indoor','outdoor','both') NOT NULL DEFAULT 'indoor',
  `parking_available` tinyint(1) NOT NULL DEFAULT 0,
  `parking_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `power_backup` tinyint(1) NOT NULL DEFAULT 0,
  `rooms_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `alcohol_allowed` tinyint(1) NOT NULL DEFAULT 0,
  `dj_allowed` tinyint(1) NOT NULL DEFAULT 0,
  `catering_type` enum('inhouse','external','both','monopoly') NOT NULL DEFAULT 'inhouse',
  `catering_details` varchar(255) DEFAULT NULL,
  `decoration_type` enum('inhouse','external','both','monopoly') NOT NULL DEFAULT 'inhouse',
  `decoration_details` varchar(255) DEFAULT NULL,
  `status` enum('draft','pending','approved','rejected','suspended') NOT NULL DEFAULT 'draft',
  `rejection_reason` text DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `views_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `avg_rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `reviews_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `venues`
--

INSERT INTO `venues` (`id`, `owner_id`, `city_id`, `type_id`, `name`, `slug`, `description`, `area`, `address`, `latitude`, `longitude`, `capacity_min`, `capacity_max`, `price_per_plate`, `flat_rent_price`, `price_min`, `category`, `parking_available`, `parking_count`, `power_backup`, `rooms_count`, `alcohol_allowed`, `dj_allowed`, `catering_type`, `catering_details`, `decoration_type`, `decoration_details`, `status`, `rejection_reason`, `featured`, `views_count`, `avg_rating`, `reviews_count`, `approved_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 1, 'The Grand Monarch Palace', 'the-grand-monarch-palace', 'A royal and breathtaking luxury banquet hall designed for high-profile weddings, corporate awards, and grand social gatherings. Features Italian marble flooring, majestic crystal chandeliers, and ultra-modern acoustic sound systems.', 'Sindhu Bhavan Road', 'Plot 45, Monarch Arcade, Opposite SBR Park, Sindhu Bhavan Road, Bodakdev, Ahmedabad, Gujarat 380054', 23.0416000, 72.5075000, 150, 1200, 1200.00, 75000.00, 1200.00, 'indoor', 1, 350, 1, 12, 0, 1, 'inhouse', 'Pure vegetarian menu only. 5-Star master chefs specialize in Gujarati, Punjabi, Continental, and live Asian counters.', 'monopoly', 'Elite decorators list provided. Outsiders not permitted for structural safety reasons.', 'approved', NULL, 1, 1240, 4.85, 12, '2026-05-23 09:16:57', '2026-05-23 09:16:57', '2026-05-24 04:40:47', NULL),
(2, 1, 2, 2, 'Royal Palms Ocean Lawn', 'royal-palms-ocean-lawn', 'A magical oceanfront lawn facing the Arabian Sea, perfect for romantic sunset vows, premium cocktail parties, and grand musical events. Offers an elegant poolside lounge and starry night skies.', 'Juhu Beach', 'Seaside Avenue, Juhu, Mumbai, Maharashtra 400049', 19.1026000, 72.8242000, 200, 2000, 1800.00, 150000.00, 1800.00, 'both', 1, 150, 1, 4, 1, 1, 'both', 'In-house catering premium non-veg options available. External vendors permitted with royalty.', 'both', 'Choose our premium sets or bring your own licensed event planners.', 'approved', NULL, 0, 3110, 4.90, 18, '2026-05-23 09:16:57', '2026-05-23 09:16:57', '2026-05-24 04:40:54', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `venue_amenities`
--

CREATE TABLE `venue_amenities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `venue_id` bigint(20) UNSIGNED NOT NULL,
  `amenity_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `venue_amenities`
--

INSERT INTO `venue_amenities` (`id`, `venue_id`, `amenity_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 1, 6),
(7, 2, 1),
(8, 2, 2),
(9, 2, 3),
(10, 2, 4),
(11, 2, 5),
(12, 2, 6),
(13, 2, 7),
(14, 2, 8),
(15, 2, 9),
(16, 2, 10);

-- --------------------------------------------------------

--
-- Table structure for table `venue_availability`
--

CREATE TABLE `venue_availability` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `venue_id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `status` enum('open','blocked','booked') NOT NULL DEFAULT 'open',
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `venue_event_types`
--

CREATE TABLE `venue_event_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `venue_id` bigint(20) UNSIGNED NOT NULL,
  `event_type_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `venue_event_types`
--

INSERT INTO `venue_event_types` (`id`, `venue_id`, `event_type_id`) VALUES
(6, 1, 1),
(4, 1, 2),
(2, 1, 3),
(3, 1, 4),
(1, 1, 5),
(5, 1, 6),
(8, 2, 3),
(9, 2, 4),
(7, 2, 5);

-- --------------------------------------------------------

--
-- Table structure for table `venue_owners`
--

CREATE TABLE `venue_owners` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `business_name` varchar(255) DEFAULT NULL,
  `gstin` varchar(20) DEFAULT NULL,
  `pan` varchar(15) DEFAULT NULL,
  `bank_account` varchar(255) DEFAULT NULL,
  `bank_ifsc` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_holder_name` varchar(255) DEFAULT NULL,
  `razorpay_contact_id` varchar(255) DEFAULT NULL,
  `razorpay_fund_account_id` varchar(255) DEFAULT NULL,
  `status` enum('pending','verified','rejected','suspended') NOT NULL DEFAULT 'pending',
  `verified_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `venue_owners`
--

INSERT INTO `venue_owners` (`id`, `user_id`, `business_name`, `gstin`, `pan`, `bank_account`, `bank_ifsc`, `bank_name`, `account_holder_name`, `razorpay_contact_id`, `razorpay_fund_account_id`, `status`, `verified_at`, `rejection_reason`, `created_at`, `updated_at`) VALUES
(1, 2, 'Sharma Events & Hospitality Group', '24AAAAS1234A1Z1', 'AAAAS1234A', '123456789012', 'SBIN0000001', 'State Bank of India', 'Rajesh Sharma', NULL, NULL, 'verified', '2026-05-23 09:16:57', NULL, '2026-05-23 09:16:57', '2026-05-23 09:16:57');

-- --------------------------------------------------------

--
-- Table structure for table `venue_photos`
--

CREATE TABLE `venue_photos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `venue_id` bigint(20) UNSIGNED NOT NULL,
  `url` varchar(255) NOT NULL,
  `cloudinary_public_id` varchar(255) DEFAULT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `venue_photos`
--

INSERT INTO `venue_photos` (`id`, `venue_id`, `url`, `cloudinary_public_id`, `caption`, `is_primary`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 1, 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80', NULL, 'The Grand Ballroom Main Hall', 1, 1, '2026-05-23 09:16:57', '2026-05-23 09:16:57'),
(2, 1, 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80', NULL, 'Stage Setup & Flower Decor', 0, 2, '2026-05-23 09:16:57', '2026-05-23 09:16:57'),
(3, 2, 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80', NULL, 'Breathtaking Ocean Lawn Theme', 1, 1, '2026-05-23 09:16:57', '2026-05-23 09:16:57');

-- --------------------------------------------------------

--
-- Table structure for table `venue_types`
--

CREATE TABLE `venue_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `venue_types`
--

INSERT INTO `venue_types` (`id`, `name`, `slug`, `icon`, `image`, `description`, `active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Banquet Hall', 'banquet-hall', 'Building', NULL, 'AC indoor halls for premium elegance', 1, 0, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(2, 'Lawn / Garden', 'lawn-garden', 'Tree', NULL, 'Beautiful open-air lush green gardens', 1, 0, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(3, 'Resort', 'resort', 'Palmtree', NULL, 'Destination retreats with lodging and halls', 1, 0, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(4, 'Hotel Ballroom', 'hotel-ballroom', 'Hotel', NULL, 'Luxury hotel grand settings with excellent hospitality', 1, 0, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(5, 'Rooftop Lounge', 'rooftop-lounge', 'Sunset', NULL, 'Chic rooftop venues with starry sky views', 1, 0, '2026-05-23 09:16:56', '2026-05-23 09:16:56'),
(6, 'Farm House', 'farm-house', 'Home', NULL, 'Private expansive properties for rustic celebrations', 1, 0, '2026-05-23 09:16:56', '2026-05-23 09:16:56');

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `venue_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `amenities`
--
ALTER TABLE `amenities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bookings_booking_number_unique` (`booking_number`),
  ADD KEY `bookings_user_id_foreign` (`user_id`),
  ADD KEY `bookings_venue_id_foreign` (`venue_id`),
  ADD KEY `bookings_event_type_id_foreign` (`event_type_id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cities_slug_unique` (`slug`);

--
-- Indexes for table `event_types`
--
ALTER TABLE `event_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `event_types_slug_unique` (`slug`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `owner_subscriptions`
--
ALTER TABLE `owner_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner_subscriptions_user_id_foreign` (`user_id`),
  ADD KEY `owner_subscriptions_plan_id_foreign` (`plan_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_booking_id_foreign` (`booking_id`),
  ADD KEY `payments_user_id_foreign` (`user_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reviews_booking_id_user_id_unique` (`booking_id`,`user_id`),
  ADD KEY `reviews_venue_id_foreign` (`venue_id`),
  ADD KEY `reviews_user_id_foreign` (`user_id`);

--
-- Indexes for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscription_plans_slug_unique` (`slug`);

--
-- Indexes for table `support_messages`
--
ALTER TABLE `support_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `support_messages_ticket_id_foreign` (`ticket_id`),
  ADD KEY `support_messages_user_id_foreign` (`user_id`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `support_tickets_ticket_number_unique` (`ticket_number`),
  ADD KEY `support_tickets_user_id_foreign` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_phone_unique` (`phone`);

--
-- Indexes for table `venues`
--
ALTER TABLE `venues`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `venues_slug_unique` (`slug`),
  ADD KEY `venues_owner_id_foreign` (`owner_id`),
  ADD KEY `venues_city_id_foreign` (`city_id`),
  ADD KEY `venues_type_id_foreign` (`type_id`);

--
-- Indexes for table `venue_amenities`
--
ALTER TABLE `venue_amenities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `venue_amenities_venue_id_amenity_id_unique` (`venue_id`,`amenity_id`),
  ADD KEY `venue_amenities_amenity_id_foreign` (`amenity_id`);

--
-- Indexes for table `venue_availability`
--
ALTER TABLE `venue_availability`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `venue_availability_venue_id_date_unique` (`venue_id`,`date`);

--
-- Indexes for table `venue_event_types`
--
ALTER TABLE `venue_event_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `venue_event_types_venue_id_event_type_id_unique` (`venue_id`,`event_type_id`),
  ADD KEY `venue_event_types_event_type_id_foreign` (`event_type_id`);

--
-- Indexes for table `venue_owners`
--
ALTER TABLE `venue_owners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venue_owners_user_id_foreign` (`user_id`);

--
-- Indexes for table `venue_photos`
--
ALTER TABLE `venue_photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venue_photos_venue_id_foreign` (`venue_id`);

--
-- Indexes for table `venue_types`
--
ALTER TABLE `venue_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `venue_types_slug_unique` (`slug`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wishlists_user_id_venue_id_unique` (`user_id`,`venue_id`),
  ADD KEY `wishlists_venue_id_foreign` (`venue_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `amenities`
--
ALTER TABLE `amenities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `event_types`
--
ALTER TABLE `event_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `owner_subscriptions`
--
ALTER TABLE `owner_subscriptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `support_messages`
--
ALTER TABLE `support_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `venues`
--
ALTER TABLE `venues`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `venue_amenities`
--
ALTER TABLE `venue_amenities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `venue_availability`
--
ALTER TABLE `venue_availability`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `venue_event_types`
--
ALTER TABLE `venue_event_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `venue_owners`
--
ALTER TABLE `venue_owners`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `venue_photos`
--
ALTER TABLE `venue_photos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `venue_types`
--
ALTER TABLE `venue_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_event_type_id_foreign` FOREIGN KEY (`event_type_id`) REFERENCES `event_types` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_venue_id_foreign` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`);

--
-- Constraints for table `owner_subscriptions`
--
ALTER TABLE `owner_subscriptions`
  ADD CONSTRAINT `owner_subscriptions_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`),
  ADD CONSTRAINT `owner_subscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_venue_id_foreign` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `support_messages`
--
ALTER TABLE `support_messages`
  ADD CONSTRAINT `support_messages_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `support_messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `support_tickets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `venues`
--
ALTER TABLE `venues`
  ADD CONSTRAINT `venues_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`),
  ADD CONSTRAINT `venues_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `venue_owners` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `venues_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `venue_types` (`id`);

--
-- Constraints for table `venue_amenities`
--
ALTER TABLE `venue_amenities`
  ADD CONSTRAINT `venue_amenities_amenity_id_foreign` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `venue_amenities_venue_id_foreign` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `venue_availability`
--
ALTER TABLE `venue_availability`
  ADD CONSTRAINT `venue_availability_venue_id_foreign` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `venue_event_types`
--
ALTER TABLE `venue_event_types`
  ADD CONSTRAINT `venue_event_types_event_type_id_foreign` FOREIGN KEY (`event_type_id`) REFERENCES `event_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `venue_event_types_venue_id_foreign` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `venue_owners`
--
ALTER TABLE `venue_owners`
  ADD CONSTRAINT `venue_owners_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `venue_photos`
--
ALTER TABLE `venue_photos`
  ADD CONSTRAINT `venue_photos_venue_id_foreign` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlists_venue_id_foreign` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
