-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2026 at 11:33 AM
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
-- Database: `venue_platform`
--

-- --------------------------------------------------------

--
-- Table structure for table `amenities`
--

CREATE TABLE `amenities` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `icon` varchar(191) DEFAULT NULL,
  `category` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `amenities`
--

INSERT INTO `amenities` (`id`, `name`, `icon`, `category`) VALUES
('1de821b0-e22b-4f71-9604-876d2e4e348b', 'In-house Catering', 'utensils', 'Food'),
('22bc210d-63bb-4946-a5c2-921795fd52dc', 'Stage', 'mic', 'Event'),
('238a84af-dce6-4b89-b608-a8df61096711', 'Bridal Room', 'heart', 'Wedding'),
('315ebcf6-7b51-475c-b8a9-6e4fae44c37d', 'Swimming Pool', 'waves', 'Recreation'),
('72560287-60d3-4820-b2b3-fed79b7b3d49', 'WiFi', 'wifi', 'Tech'),
('8adeba2b-36dc-40f3-a61c-c32bbd207667', 'Garden', 'tree', 'Outdoor'),
('ba89e812-36d6-4747-9fd2-ef354459c765', 'Parking', 'car', 'Facility'),
('bd9d7a3a-5349-4331-bb3a-f090465809b8', 'Air Conditioning', 'snowflake', 'Comfort'),
('d2399da6-b089-4922-97a3-d4c2737173c9', 'Valet Parking', 'key', 'Facility'),
('dcd1b5c9-4d81-49b2-92fc-16e44677e8d7', 'Bar Counter', 'wine', 'Food'),
('e8b68ca2-9605-4a29-9211-343058b57453', 'Sound System', 'speaker', 'Event'),
('fcfd11ea-6c22-4f94-a237-8156b3130399', 'Lighting', 'lightbulb', 'Event');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `action` varchar(191) NOT NULL,
  `entity` varchar(191) NOT NULL,
  `entityId` varchar(191) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `ipAddress` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `availability_slots`
--

CREATE TABLE `availability_slots` (
  `id` varchar(191) NOT NULL,
  `venueId` varchar(191) NOT NULL,
  `date` date NOT NULL,
  `isBlocked` tinyint(1) NOT NULL DEFAULT 0,
  `note` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` varchar(191) NOT NULL,
  `bookingNumber` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `venueId` varchar(191) NOT NULL,
  `eventType` enum('WEDDING','CORPORATE','BIRTHDAY','CONFERENCE','EXHIBITION','PARTY','OTHER') NOT NULL,
  `eventDate` date NOT NULL,
  `eventEndDate` date DEFAULT NULL,
  `guestCount` int(11) NOT NULL,
  `status` enum('AVAILABLE','BLOCKED','PENDING_PROPOSAL','PROPOSAL_SENT','PROPOSAL_ACCEPTED','PAYMENT_PENDING','CONFIRMED','COMPLETED','CANCELLED','EXPIRED','REJECTED') NOT NULL DEFAULT 'BLOCKED',
  `blockedAt` datetime(3) DEFAULT NULL,
  `blockExpiresAt` datetime(3) DEFAULT NULL,
  `queuePosition` int(11) DEFAULT NULL,
  `specialRequests` text DEFAULT NULL,
  `totalAmount` decimal(12,2) DEFAULT NULL,
  `tokenAmount` decimal(12,2) DEFAULT NULL,
  `confirmedAt` datetime(3) DEFAULT NULL,
  `cancelledAt` datetime(3) DEFAULT NULL,
  `cancelReason` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `bookingNumber`, `userId`, `venueId`, `eventType`, `eventDate`, `eventEndDate`, `guestCount`, `status`, `blockedAt`, `blockExpiresAt`, `queuePosition`, `specialRequests`, `totalAmount`, `tokenAmount`, `confirmedAt`, `cancelledAt`, `cancelReason`, `createdAt`, `updatedAt`) VALUES
('14c6c3ee-e41a-4efa-a197-c7c477feb9df', 'BK-MPI5PPI7-ZLRL', 'b8ae9cca-bafd-46db-9f30-38237246fc16', '50dd8c0d-7eb6-4eeb-8ad6-a1b1bdf6fccd', 'WEDDING', '2026-05-29', NULL, 60, 'PROPOSAL_SENT', '2026-05-23 09:39:17.215', '2026-05-23 10:09:17.213', 1, NULL, 50000.00, 10000.00, NULL, NULL, NULL, '2026-05-23 09:39:17.216', '2026-05-23 09:40:19.930');

-- --------------------------------------------------------

--
-- Table structure for table `booking_queue`
--

CREATE TABLE `booking_queue` (
  `id` varchar(191) NOT NULL,
  `bookingId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `position` int(11) NOT NULL,
  `priority` int(11) NOT NULL DEFAULT 0,
  `joinedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `isActive` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `booking_queue`
--

INSERT INTO `booking_queue` (`id`, `bookingId`, `userId`, `position`, `priority`, `joinedAt`, `isActive`) VALUES
('f008a6ba-064d-4be8-98af-6459b77310b5', '14c6c3ee-e41a-4efa-a197-c7c477feb9df', 'b8ae9cca-bafd-46db-9f30-38237246fc16', 1, 10, '2026-05-23 09:39:17.228', 1);

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` varchar(191) NOT NULL,
  `roomId` varchar(191) NOT NULL,
  `senderId` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cms_pages`
--

CREATE TABLE `cms_pages` (
  `id` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `content` longtext NOT NULL,
  `isPublished` tinyint(1) NOT NULL DEFAULT 0,
  `seoTitle` varchar(191) DEFAULT NULL,
  `seoDescription` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cms_pages`
--

INSERT INTO `cms_pages` (`id`, `slug`, `title`, `content`, `isPublished`, `seoTitle`, `seoDescription`, `createdAt`, `updatedAt`) VALUES
('67929397-189b-4cf3-adda-e4c95516e132', 'faq', 'FAQ', '<h1>Frequently Asked Questions</h1><p>How do I book a venue? Search, select, block, and pay.</p>', 1, NULL, NULL, '2026-05-23 09:35:01.430', '2026-05-23 09:35:01.430'),
('95231a25-6587-487e-852c-1ed243dfe544', 'pricing', 'Pricing', '<h1>Pricing Plans</h1><p>Free for customers. Commission-based for venue owners.</p>', 1, NULL, NULL, '2026-05-23 09:35:01.439', '2026-05-23 09:35:01.439'),
('ea264558-21cc-4499-8210-ca4343d7d5e7', 'about', 'About Us', '<h1>About VenueHub</h1><p>India\'s premier venue booking marketplace.</p>', 1, NULL, NULL, '2026-05-23 09:35:01.422', '2026-05-23 09:35:01.422');

-- --------------------------------------------------------

--
-- Table structure for table `commission_settings`
--

CREATE TABLE `commission_settings` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `percent` decimal(5,2) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `commission_settings`
--

INSERT INTO `commission_settings` (`id`, `name`, `percent`, `isActive`, `createdAt`, `updatedAt`) VALUES
('default-commission', 'Platform Commission', 10.00, 1, '2026-05-23 09:35:01.416', '2026-05-23 09:35:01.416');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` enum('BOOKING','PAYMENT','PROPOSAL','REVIEW','SYSTEM','SUPPORT') NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `data` text DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `userId`, `type`, `title`, `message`, `data`, `isRead`, `createdAt`) VALUES
('0919be94-87dc-4039-aa39-41b5b7cb920f', 'b8ae9cca-bafd-46db-9f30-38237246fc16', 'PROPOSAL', 'New proposal received', 'Proposal for Sunset Garden Resort', NULL, 0, '2026-05-23 09:40:19.938'),
('90d37fff-a833-4a1f-9a66-487a86f0609f', '65dfad5b-397f-4134-8e44-ed1f0039f1cc', 'BOOKING', 'New booking request', 'Priya blocked a slot at Sunset Garden Resort', NULL, 0, '2026-05-23 09:39:17.233');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` varchar(191) NOT NULL,
  `bookingId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(191) NOT NULL DEFAULT 'INR',
  `type` enum('TOKEN','FULL','REFUND','COMMISSION') NOT NULL,
  `status` enum('PENDING','PROCESSING','COMPLETED','FAILED','REFUNDED','PARTIALLY_REFUNDED') NOT NULL DEFAULT 'PENDING',
  `razorpayOrderId` varchar(191) DEFAULT NULL,
  `razorpayPaymentId` varchar(191) DEFAULT NULL,
  `razorpaySignature` varchar(191) DEFAULT NULL,
  `stripePaymentId` varchar(191) DEFAULT NULL,
  `invoiceNumber` varchar(191) DEFAULT NULL,
  `invoiceUrl` varchar(191) DEFAULT NULL,
  `refundAmount` decimal(12,2) DEFAULT NULL,
  `refundReason` varchar(191) DEFAULT NULL,
  `metadata` text DEFAULT NULL,
  `paidAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `platform_settings`
--

CREATE TABLE `platform_settings` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `proposals`
--

CREATE TABLE `proposals` (
  `id` varchar(191) NOT NULL,
  `bookingId` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `tokenAmount` decimal(12,2) NOT NULL,
  `validUntil` datetime(3) NOT NULL,
  `status` enum('DRAFT','SENT','ACCEPTED','REJECTED','EXPIRED') NOT NULL DEFAULT 'DRAFT',
  `pdfUrl` varchar(191) DEFAULT NULL,
  `sentAt` datetime(3) DEFAULT NULL,
  `acceptedAt` datetime(3) DEFAULT NULL,
  `rejectedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `proposals`
--

INSERT INTO `proposals` (`id`, `bookingId`, `title`, `description`, `amount`, `tokenAmount`, `validUntil`, `status`, `pdfUrl`, `sentAt`, `acceptedAt`, `rejectedAt`, `createdAt`, `updatedAt`) VALUES
('b0de75a8-9027-4356-ac10-e35331cf92f7', '14c6c3ee-e41a-4efa-a197-c7c477feb9df', 'test', 'sadsa', 50000.00, 10000.00, '2026-05-22 00:00:00.000', 'EXPIRED', NULL, '2026-05-23 09:40:19.918', NULL, NULL, '2026-05-23 09:40:19.919', '2026-05-23 09:41:26.410');

-- --------------------------------------------------------

--
-- Table structure for table `recently_viewed`
--

CREATE TABLE `recently_viewed` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `venueId` varchar(191) NOT NULL,
  `viewedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recently_viewed`
--

INSERT INTO `recently_viewed` (`id`, `userId`, `venueId`, `viewedAt`) VALUES
('bc30241b-6a38-45ac-887d-5eecf7051a79', 'b8ae9cca-bafd-46db-9f30-38237246fc16', '50dd8c0d-7eb6-4eeb-8ad6-a1b1bdf6fccd', '2026-05-23 09:38:59.589');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` varchar(191) NOT NULL,
  `venueId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `bookingId` varchar(191) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `title` varchar(191) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `isApproved` tinyint(1) NOT NULL DEFAULT 0,
  `isFlagged` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `saved_venues`
--

CREATE TABLE `saved_venues` (
  `userId` varchar(191) NOT NULL,
  `venueId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` varchar(191) NOT NULL,
  `venueId` varchar(191) NOT NULL,
  `managerId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `role` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` varchar(191) NOT NULL,
  `ticketNumber` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `assigneeId` varchar(191) DEFAULT NULL,
  `subject` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `status` enum('OPEN','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'OPEN',
  `priority` enum('LOW','MEDIUM','HIGH','URGENT') NOT NULL DEFAULT 'MEDIUM',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) DEFAULT NULL,
  `firstName` varchar(191) NOT NULL,
  `lastName` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `avatar` varchar(191) DEFAULT NULL,
  `role` enum('SUPER_ADMIN','VENUE_OWNER','CUSTOMER','STAFF_MANAGER') NOT NULL DEFAULT 'CUSTOMER',
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING_VERIFICATION') NOT NULL DEFAULT 'PENDING_VERIFICATION',
  `emailVerified` tinyint(1) NOT NULL DEFAULT 0,
  `googleId` varchar(191) DEFAULT NULL,
  `otp` varchar(191) DEFAULT NULL,
  `otpExpires` datetime(3) DEFAULT NULL,
  `resetToken` varchar(191) DEFAULT NULL,
  `resetTokenExpires` datetime(3) DEFAULT NULL,
  `refreshToken` text DEFAULT NULL,
  `lastLoginAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `firstName`, `lastName`, `phone`, `avatar`, `role`, `status`, `emailVerified`, `googleId`, `otp`, `otpExpires`, `resetToken`, `resetTokenExpires`, `refreshToken`, `lastLoginAt`, `createdAt`, `updatedAt`) VALUES
('2b8b3508-bcb9-4485-ae59-f70af0021f07', 'admin@venuehub.com', '$2b$12$3eXIeiYDUmKDqiMyv1aOdeXnXyfKKab0cmikWVJsJ.SCwvwHvV8hu', 'Super', 'Admin', NULL, NULL, 'SUPER_ADMIN', 'ACTIVE', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-23 09:37:28.129', '2026-05-23 09:33:54.993', '2026-05-23 09:38:06.738'),
('65dfad5b-397f-4134-8e44-ed1f0039f1cc', 'owner@venuehub.com', '$2b$12$3eXIeiYDUmKDqiMyv1aOdeXnXyfKKab0cmikWVJsJ.SCwvwHvV8hu', 'Rajesh', 'Kumar', '+919876543210', NULL, 'VENUE_OWNER', 'ACTIVE', 1, NULL, NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWRmYWQ1Yi0zOTdmLTQxMzQtOGU0NC1lZDFmMDAzOWYxY2MiLCJpYXQiOjE3Nzk1MjkzMTYsImV4cCI6MTc4MDEzNDExNn0.rFyL_fUnwZMPsuIFSoIZ4U-8Ox6sm6ejnyq_hKaCw7Y', '2026-05-23 09:41:56.927', '2026-05-23 09:33:55.051', '2026-05-23 09:41:56.928'),
('b8ae9cca-bafd-46db-9f30-38237246fc16', 'customer@venuehub.com', '$2b$12$3eXIeiYDUmKDqiMyv1aOdeXnXyfKKab0cmikWVJsJ.SCwvwHvV8hu', 'Priya', 'Sharma', '+919123456789', NULL, 'CUSTOMER', 'ACTIVE', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-23 09:41:14.381', '2026-05-23 09:33:55.057', '2026-05-23 09:41:43.796');

-- --------------------------------------------------------

--
-- Table structure for table `venues`
--

CREATE TABLE `venues` (
  `id` varchar(191) NOT NULL,
  `ownerId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `venueType` enum('BANQUET_HALL','HOTEL','RESORT','FARMHOUSE','CONVENTION_CENTER','RESTAURANT','ROOFTOP','GARDEN','BEACH','OTHER') NOT NULL,
  `eventTypes` text NOT NULL,
  `isIndoor` tinyint(1) NOT NULL DEFAULT 1,
  `isOutdoor` tinyint(1) NOT NULL DEFAULT 0,
  `capacityMin` int(11) NOT NULL,
  `capacityMax` int(11) NOT NULL,
  `priceMin` decimal(12,2) NOT NULL,
  `priceMax` decimal(12,2) NOT NULL,
  `dynamicPricing` tinyint(1) NOT NULL DEFAULT 0,
  `city` varchar(191) NOT NULL,
  `area` varchar(191) NOT NULL,
  `state` varchar(191) NOT NULL,
  `country` varchar(191) NOT NULL DEFAULT 'India',
  `address` text NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `hasParking` tinyint(1) NOT NULL DEFAULT 0,
  `hasCatering` tinyint(1) NOT NULL DEFAULT 0,
  `hasDecoration` tinyint(1) NOT NULL DEFAULT 0,
  `policies` text DEFAULT NULL,
  `status` enum('DRAFT','PENDING_APPROVAL','APPROVED','REJECTED','SUSPENDED') NOT NULL DEFAULT 'DRAFT',
  `ratingAvg` double NOT NULL DEFAULT 0,
  `ratingCount` int(11) NOT NULL DEFAULT 0,
  `viewCount` int(11) NOT NULL DEFAULT 0,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `seoTitle` varchar(191) DEFAULT NULL,
  `seoDescription` varchar(191) DEFAULT NULL,
  `seoKeywords` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `venues`
--

INSERT INTO `venues` (`id`, `ownerId`, `name`, `slug`, `description`, `venueType`, `eventTypes`, `isIndoor`, `isOutdoor`, `capacityMin`, `capacityMax`, `priceMin`, `priceMax`, `dynamicPricing`, `city`, `area`, `state`, `country`, `address`, `latitude`, `longitude`, `hasParking`, `hasCatering`, `hasDecoration`, `policies`, `status`, `ratingAvg`, `ratingCount`, `viewCount`, `featured`, `seoTitle`, `seoDescription`, `seoKeywords`, `createdAt`, `updatedAt`) VALUES
('49d76165-ec44-43ba-8585-07122a9ea856', '65dfad5b-397f-4134-8e44-ed1f0039f1cc', 'The Grand Palace Banquet', 'grand-palace-banquet-mumbai', 'An exquisite banquet hall perfect for weddings and corporate events. Features crystal chandeliers, marble flooring, and world-class catering facilities.', 'BANQUET_HALL', '[\"WEDDING\",\"CORPORATE\",\"BIRTHDAY\"]', 1, 0, 100, 800, 150000.00, 500000.00, 0, 'Mumbai', 'Bandra West', 'Maharashtra', 'India', '123 Linking Road, Bandra West, Mumbai 400050', 19.0596, 72.8295, 1, 1, 1, NULL, 'APPROVED', 4.8, 124, 0, 1, NULL, NULL, NULL, '2026-05-23 09:33:55.161', '2026-05-23 09:33:55.161'),
('50dd8c0d-7eb6-4eeb-8ad6-a1b1bdf6fccd', '65dfad5b-397f-4134-8e44-ed1f0039f1cc', 'Sunset Garden Resort', 'sunset-garden-resort-goa', 'Beachfront resort with lush gardens, perfect for destination weddings and intimate celebrations under the stars.', 'RESORT', '[\"WEDDING\",\"PARTY\"]', 0, 1, 50, 300, 200000.00, 800000.00, 0, 'Goa', 'Calangute', 'Goa', 'India', 'Beach Road, Calangute, Goa 403516', 15.5439, 73.7553, 1, 1, 0, NULL, 'APPROVED', 4.9, 89, 1, 1, NULL, NULL, NULL, '2026-05-23 09:33:55.239', '2026-05-23 09:38:59.582'),
('754257bf-d0e3-4299-96a3-2dc34ff649e1', '65dfad5b-397f-4134-8e44-ed1f0039f1cc', 'Heritage Farmhouse', 'heritage-farmhouse-gurgaon', 'Rustic charm meets modern luxury at this sprawling farmhouse with manicured lawns and a vintage aesthetic.', 'FARMHOUSE', '[\"WEDDING\",\"BIRTHDAY\",\"PARTY\"]', 1, 1, 80, 500, 100000.00, 400000.00, 0, 'Gurgaon', 'Sohna Road', 'Haryana', 'India', 'Village Mangar, Sohna Road, Gurgaon 122102', NULL, NULL, 1, 0, 1, NULL, 'APPROVED', 4.7, 45, 0, 0, NULL, NULL, NULL, '2026-05-23 09:33:55.345', '2026-05-23 09:33:55.345'),
('9bb12838-19fa-4fee-a818-866817d6fe14', '65dfad5b-397f-4134-8e44-ed1f0039f1cc', 'Lakeview Garden Venue', 'lakeview-garden-udaipur', 'Enchanting lakeside garden venue with traditional Rajasthani architecture for royal weddings.', 'GARDEN', '[\"WEDDING\"]', 1, 1, 100, 600, 250000.00, 1000000.00, 0, 'Udaipur', 'Fateh Sagar', 'Rajasthan', 'India', 'Lake Fateh Sagar Road, Udaipur, Rajasthan 313001', NULL, NULL, 1, 1, 1, NULL, 'APPROVED', 4.9, 156, 0, 1, NULL, NULL, NULL, '2026-05-23 09:35:01.367', '2026-05-23 09:35:01.367'),
('deae3b9e-35ed-48a1-8be0-80b7332f24a5', '65dfad5b-397f-4134-8e44-ed1f0039f1cc', 'Skyline Rooftop Lounge', 'skyline-rooftop-bangalore', 'Stunning rooftop venue with panoramic city views, perfect for cocktail parties and corporate gatherings.', 'ROOFTOP', '[\"CORPORATE\",\"PARTY\",\"BIRTHDAY\"]', 1, 0, 30, 150, 80000.00, 250000.00, 0, 'Bangalore', 'Indiranagar', 'Karnataka', 'India', '100 Feet Road, Indiranagar, Bangalore 560038', NULL, NULL, 0, 1, 0, NULL, 'APPROVED', 4.5, 38, 0, 0, NULL, NULL, NULL, '2026-05-23 09:33:55.385', '2026-05-23 09:33:55.385'),
('e23f5efa-73f5-45d0-bd4e-b527d442421d', '65dfad5b-397f-4134-8e44-ed1f0039f1cc', 'Royal Convention Center', 'royal-convention-center-delhi', 'State-of-the-art convention center with multiple halls, advanced AV systems, and professional event management support.', 'CONVENTION_CENTER', '[\"CONFERENCE\",\"EXHIBITION\",\"CORPORATE\"]', 1, 0, 200, 2000, 300000.00, 1500000.00, 0, 'Delhi', 'Dwarka', 'Delhi', 'India', 'Sector 10, Dwarka, New Delhi 110075', 28.5921, 77.046, 1, 1, 0, NULL, 'APPROVED', 4.6, 67, 0, 1, NULL, NULL, NULL, '2026-05-23 09:33:55.299', '2026-05-23 09:33:55.299');

-- --------------------------------------------------------

--
-- Table structure for table `venue_amenities`
--

CREATE TABLE `venue_amenities` (
  `venueId` varchar(191) NOT NULL,
  `amenityId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `venue_amenities`
--

INSERT INTO `venue_amenities` (`venueId`, `amenityId`) VALUES
('49d76165-ec44-43ba-8585-07122a9ea856', '1de821b0-e22b-4f71-9604-876d2e4e348b'),
('49d76165-ec44-43ba-8585-07122a9ea856', '22bc210d-63bb-4946-a5c2-921795fd52dc'),
('49d76165-ec44-43ba-8585-07122a9ea856', '238a84af-dce6-4b89-b608-a8df61096711'),
('49d76165-ec44-43ba-8585-07122a9ea856', '315ebcf6-7b51-475c-b8a9-6e4fae44c37d'),
('49d76165-ec44-43ba-8585-07122a9ea856', '72560287-60d3-4820-b2b3-fed79b7b3d49'),
('49d76165-ec44-43ba-8585-07122a9ea856', '8adeba2b-36dc-40f3-a61c-c32bbd207667'),
('50dd8c0d-7eb6-4eeb-8ad6-a1b1bdf6fccd', '1de821b0-e22b-4f71-9604-876d2e4e348b'),
('50dd8c0d-7eb6-4eeb-8ad6-a1b1bdf6fccd', '22bc210d-63bb-4946-a5c2-921795fd52dc'),
('50dd8c0d-7eb6-4eeb-8ad6-a1b1bdf6fccd', '238a84af-dce6-4b89-b608-a8df61096711'),
('50dd8c0d-7eb6-4eeb-8ad6-a1b1bdf6fccd', '315ebcf6-7b51-475c-b8a9-6e4fae44c37d'),
('50dd8c0d-7eb6-4eeb-8ad6-a1b1bdf6fccd', '72560287-60d3-4820-b2b3-fed79b7b3d49'),
('50dd8c0d-7eb6-4eeb-8ad6-a1b1bdf6fccd', '8adeba2b-36dc-40f3-a61c-c32bbd207667'),
('754257bf-d0e3-4299-96a3-2dc34ff649e1', '1de821b0-e22b-4f71-9604-876d2e4e348b'),
('754257bf-d0e3-4299-96a3-2dc34ff649e1', '22bc210d-63bb-4946-a5c2-921795fd52dc'),
('754257bf-d0e3-4299-96a3-2dc34ff649e1', '238a84af-dce6-4b89-b608-a8df61096711'),
('754257bf-d0e3-4299-96a3-2dc34ff649e1', '315ebcf6-7b51-475c-b8a9-6e4fae44c37d'),
('754257bf-d0e3-4299-96a3-2dc34ff649e1', '72560287-60d3-4820-b2b3-fed79b7b3d49'),
('754257bf-d0e3-4299-96a3-2dc34ff649e1', '8adeba2b-36dc-40f3-a61c-c32bbd207667'),
('9bb12838-19fa-4fee-a818-866817d6fe14', '1de821b0-e22b-4f71-9604-876d2e4e348b'),
('9bb12838-19fa-4fee-a818-866817d6fe14', '22bc210d-63bb-4946-a5c2-921795fd52dc'),
('9bb12838-19fa-4fee-a818-866817d6fe14', '238a84af-dce6-4b89-b608-a8df61096711'),
('9bb12838-19fa-4fee-a818-866817d6fe14', '315ebcf6-7b51-475c-b8a9-6e4fae44c37d'),
('9bb12838-19fa-4fee-a818-866817d6fe14', '72560287-60d3-4820-b2b3-fed79b7b3d49'),
('9bb12838-19fa-4fee-a818-866817d6fe14', '8adeba2b-36dc-40f3-a61c-c32bbd207667'),
('deae3b9e-35ed-48a1-8be0-80b7332f24a5', '1de821b0-e22b-4f71-9604-876d2e4e348b'),
('deae3b9e-35ed-48a1-8be0-80b7332f24a5', '22bc210d-63bb-4946-a5c2-921795fd52dc'),
('deae3b9e-35ed-48a1-8be0-80b7332f24a5', '238a84af-dce6-4b89-b608-a8df61096711'),
('deae3b9e-35ed-48a1-8be0-80b7332f24a5', '315ebcf6-7b51-475c-b8a9-6e4fae44c37d'),
('deae3b9e-35ed-48a1-8be0-80b7332f24a5', '72560287-60d3-4820-b2b3-fed79b7b3d49'),
('deae3b9e-35ed-48a1-8be0-80b7332f24a5', '8adeba2b-36dc-40f3-a61c-c32bbd207667'),
('e23f5efa-73f5-45d0-bd4e-b527d442421d', '1de821b0-e22b-4f71-9604-876d2e4e348b'),
('e23f5efa-73f5-45d0-bd4e-b527d442421d', '22bc210d-63bb-4946-a5c2-921795fd52dc'),
('e23f5efa-73f5-45d0-bd4e-b527d442421d', '238a84af-dce6-4b89-b608-a8df61096711'),
('e23f5efa-73f5-45d0-bd4e-b527d442421d', '315ebcf6-7b51-475c-b8a9-6e4fae44c37d'),
('e23f5efa-73f5-45d0-bd4e-b527d442421d', '72560287-60d3-4820-b2b3-fed79b7b3d49'),
('e23f5efa-73f5-45d0-bd4e-b527d442421d', '8adeba2b-36dc-40f3-a61c-c32bbd207667');

-- --------------------------------------------------------

--
-- Table structure for table `venue_images`
--

CREATE TABLE `venue_images` (
  `id` varchar(191) NOT NULL,
  `venueId` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `publicId` varchar(191) DEFAULT NULL,
  `isPrimary` tinyint(1) NOT NULL DEFAULT 0,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `venue_images`
--

INSERT INTO `venue_images` (`id`, `venueId`, `url`, `publicId`, `isPrimary`, `order`, `createdAt`) VALUES
('1409ca61-1a6c-423f-97d2-8d77b54fa7d1', 'deae3b9e-35ed-48a1-8be0-80b7332f24a5', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', NULL, 1, 0, '2026-05-23 09:35:01.351'),
('19d7de51-b43a-44b2-8b7a-f2274854f48f', '49d76165-ec44-43ba-8585-07122a9ea856', 'https://images.unsplash.com/photo-1519167758481-83f29da8c2f3?w=800', NULL, 1, 0, '2026-05-23 09:35:01.227'),
('5e2bcd42-129e-4087-806c-3d8e0ae5fb12', '50dd8c0d-7eb6-4eeb-8ad6-a1b1bdf6fccd', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', NULL, 1, 0, '2026-05-23 09:35:01.260'),
('77e373ae-bd61-4347-afc8-9eb45c964351', '754257bf-d0e3-4299-96a3-2dc34ff649e1', 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800', NULL, 1, 0, '2026-05-23 09:35:01.326'),
('90ae307e-cf6d-442b-ba45-26392842439b', 'e23f5efa-73f5-45d0-bd4e-b527d442421d', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', NULL, 1, 0, '2026-05-23 09:35:01.294'),
('99f31684-1c14-41b4-aa46-20726a4ccb49', '49d76165-ec44-43ba-8585-07122a9ea856', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', NULL, 0, 1, '2026-05-23 09:35:01.233'),
('b00a5b2a-fdde-4921-b65d-ba50824c85d1', '50dd8c0d-7eb6-4eeb-8ad6-a1b1bdf6fccd', 'https://images.unsplash.com/photo-1465495976277-153a4696a118?w=800', NULL, 0, 1, '2026-05-23 09:35:01.264'),
('dde23177-9b66-472a-9878-ecc499d14b3b', '9bb12838-19fa-4fee-a818-866817d6fe14', 'https://images.unsplash.com/photo-1606800052052-680ff852af66?w=800', NULL, 1, 0, '2026-05-23 09:35:01.373');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `amenities`
--
ALTER TABLE `amenities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `amenities_name_key` (`name`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audit_logs_entity_entityId_idx` (`entity`,`entityId`),
  ADD KEY `audit_logs_createdAt_idx` (`createdAt`),
  ADD KEY `audit_logs_userId_fkey` (`userId`);

--
-- Indexes for table `availability_slots`
--
ALTER TABLE `availability_slots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `availability_slots_venueId_date_key` (`venueId`,`date`),
  ADD KEY `availability_slots_venueId_date_idx` (`venueId`,`date`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bookings_bookingNumber_key` (`bookingNumber`),
  ADD KEY `bookings_userId_idx` (`userId`),
  ADD KEY `bookings_venueId_idx` (`venueId`),
  ADD KEY `bookings_status_idx` (`status`),
  ADD KEY `bookings_eventDate_idx` (`eventDate`);

--
-- Indexes for table `booking_queue`
--
ALTER TABLE `booking_queue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_queue_bookingId_position_idx` (`bookingId`,`position`),
  ADD KEY `booking_queue_userId_fkey` (`userId`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_messages_roomId_createdAt_idx` (`roomId`,`createdAt`),
  ADD KEY `chat_messages_senderId_fkey` (`senderId`);

--
-- Indexes for table `cms_pages`
--
ALTER TABLE `cms_pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cms_pages_slug_key` (`slug`);

--
-- Indexes for table `commission_settings`
--
ALTER TABLE `commission_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_userId_isRead_idx` (`userId`,`isRead`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_invoiceNumber_key` (`invoiceNumber`),
  ADD KEY `payments_bookingId_idx` (`bookingId`),
  ADD KEY `payments_userId_idx` (`userId`);

--
-- Indexes for table `platform_settings`
--
ALTER TABLE `platform_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `platform_settings_key_key` (`key`);

--
-- Indexes for table `proposals`
--
ALTER TABLE `proposals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proposals_bookingId_idx` (`bookingId`);

--
-- Indexes for table `recently_viewed`
--
ALTER TABLE `recently_viewed`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `recently_viewed_userId_venueId_key` (`userId`,`venueId`),
  ADD KEY `recently_viewed_userId_viewedAt_idx` (`userId`,`viewedAt`),
  ADD KEY `recently_viewed_venueId_fkey` (`venueId`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reviews_venueId_userId_bookingId_key` (`venueId`,`userId`,`bookingId`),
  ADD KEY `reviews_venueId_idx` (`venueId`),
  ADD KEY `reviews_userId_fkey` (`userId`),
  ADD KEY `reviews_bookingId_fkey` (`bookingId`);

--
-- Indexes for table `saved_venues`
--
ALTER TABLE `saved_venues`
  ADD PRIMARY KEY (`userId`,`venueId`),
  ADD KEY `saved_venues_venueId_fkey` (`venueId`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_venueId_idx` (`venueId`),
  ADD KEY `staff_managerId_fkey` (`managerId`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `support_tickets_ticketNumber_key` (`ticketNumber`),
  ADD KEY `support_tickets_userId_idx` (`userId`),
  ADD KEY `support_tickets_status_idx` (`status`),
  ADD KEY `support_tickets_assigneeId_fkey` (`assigneeId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD UNIQUE KEY `users_googleId_key` (`googleId`),
  ADD KEY `users_email_idx` (`email`),
  ADD KEY `users_role_idx` (`role`);

--
-- Indexes for table `venues`
--
ALTER TABLE `venues`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `venues_slug_key` (`slug`),
  ADD KEY `venues_city_area_idx` (`city`,`area`),
  ADD KEY `venues_venueType_idx` (`venueType`),
  ADD KEY `venues_status_idx` (`status`),
  ADD KEY `venues_ownerId_idx` (`ownerId`);

--
-- Indexes for table `venue_amenities`
--
ALTER TABLE `venue_amenities`
  ADD PRIMARY KEY (`venueId`,`amenityId`),
  ADD KEY `venue_amenities_amenityId_fkey` (`amenityId`);

--
-- Indexes for table `venue_images`
--
ALTER TABLE `venue_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venue_images_venueId_idx` (`venueId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `availability_slots`
--
ALTER TABLE `availability_slots`
  ADD CONSTRAINT `availability_slots_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `venues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `bookings_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `venues` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `booking_queue`
--
ALTER TABLE `booking_queue`
  ADD CONSTRAINT `booking_queue_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `booking_queue_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `proposals`
--
ALTER TABLE `proposals`
  ADD CONSTRAINT `proposals_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `recently_viewed`
--
ALTER TABLE `recently_viewed`
  ADD CONSTRAINT `recently_viewed_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recently_viewed_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `venues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `venues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `saved_venues`
--
ALTER TABLE `saved_venues`
  ADD CONSTRAINT `saved_venues_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `saved_venues_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `venues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `staff_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `staff_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `venues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `support_tickets_assigneeId_fkey` FOREIGN KEY (`assigneeId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `support_tickets_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `venues`
--
ALTER TABLE `venues`
  ADD CONSTRAINT `venues_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `venue_amenities`
--
ALTER TABLE `venue_amenities`
  ADD CONSTRAINT `venue_amenities_amenityId_fkey` FOREIGN KEY (`amenityId`) REFERENCES `amenities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `venue_amenities_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `venues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `venue_images`
--
ALTER TABLE `venue_images`
  ADD CONSTRAINT `venue_images_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `venues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
