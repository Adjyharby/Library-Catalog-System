-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 08, 2025 at 01:18 PM
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
-- Database: `library_catalog`
--

-- --------------------------------------------------------

--
-- Table structure for table `catalog`
--

CREATE TABLE `catalog` (
  `CatalogID` int(11) NOT NULL,
  `BookID` int(11) NOT NULL,
  `AdminID` int(11) NOT NULL,
  `Book Name` varchar(5000) DEFAULT NULL,
  `Status` varchar(500) NOT NULL,
  `Genre` varchar(100) NOT NULL,
  `Type` varchar(100) NOT NULL,
  `Quantity` int(2) DEFAULT NULL,
  `AuthorName` varchar(500) NOT NULL,
  `PublisherName` varchar(2500) NOT NULL,
  `DateOfPublish` varchar(100) NOT NULL,
  `SSID` varchar(200) NOT NULL,
  `ShortDesc` varchar(2500) NOT NULL,
  `Location` varchar(1000) DEFAULT NULL,
  `ImageDir` text NOT NULL DEFAULT ' ',
  `DateModified` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `catalog`
--

INSERT INTO `catalog` (`CatalogID`, `BookID`, `AdminID`, `Book Name`, `Status`, `Genre`, `Type`, `Quantity`, `AuthorName`, `PublisherName`, `DateOfPublish`, `SSID`, `ShortDesc`, `Location`, `ImageDir`, `DateModified`) VALUES
(1, 1, 1, 'Book of mushrooms', 'gone', 'Bading', 'book', 2, 'Mushroom girl', 'Du kararaw', '2024-12-13', '123-321-123-321', 'du kapayspra spray naw du mushroom ni marianne am namarin danas libru. kapanbuklat mu \"hudeo\" vatahen na daw', NULL, ' ', '2025-03-03'),
(2, 0, 0, 'The Lost Kingdom', 'available', 'Fantasy', 'Book', 1, 'Alice Thompson', 'Dreamscape Press', '2024-12-10', '978-1-23456-789-0', '', NULL, ' ', '2025-03-03'),
(3, 0, 0, 'Echoes in the Silence', 'Available', 'Mystery', 'Book', 2, ' John Smith', 'Horizon Books', '2019-07-23', '978-1-98765-432-1', '', NULL, ' ', '2025-03-03'),
(4, 0, 0, 'Shadows of the Past', 'Available', 'Fiction', 'Book', 1, 'Sarah Johnson', 'Silver Linings', '2024-06-13', '978-0-12345-678-9', '', NULL, ' ', '2025-03-03'),
(5, 0, 0, ' Journey to the Unknown', 'Available', 'Adventure', 'Book', 5, 'Michael Brown', ' Adventure Press', '2025-01-17', '978-3-45678-901-2', '', NULL, ' ', '2025-03-03'),
(6, 0, 0, ' Whispers of the Heart', 'Available', 'Romance', 'Book', 0, 'Emily Davis', 'Heartfelt Publishing', '2024-02-14', ' 978-1-23456-789-1', '', NULL, ' ', '2025-03-03'),
(7, 0, 0, 'The Time Traveler\'s Diary', 'Available', 'Sci-Fi', 'Book\r\n', 2, 'David Wilson\r\n', 'Timeless Books\r\n', '2025-02-13', '978-4-56789-012-3', '', NULL, ' ', '2025-03-03'),
(8, 0, 0, 'Beneath the Surface', 'Available', 'Thriller', 'Book', 2, 'Jessica Lee', 'Oceanic Press', '2024-11-04', '978-5-67890-123-4', '', NULL, ' ', '2025-03-03'),
(9, 0, 0, 'A Symphony of Stars', 'Available', 'Sci-Fi', 'Book', 0, 'Robert Garcia', 'Cosmic Publications', '2025-02-13', '978-6-78901-234-5', '', NULL, ' ', '2025-03-03'),
(10, 0, 0, 'Beyond the Horizon', 'Available', 'Fantasy', 'Book', 2, 'Thomas Clark', 'New World Publishing', '0000-00-00', '978-0-12345-678-0', '', NULL, ' ', '2025-03-03'),
(11, 0, 0, 'The Secrets We Keep', 'Available', 'Psychological Thriller', 'Book', 3, 'Patricia White', 'Hidden Truths', '0000-00-00', '978-9-01234-567-8', '', NULL, ' ', '2025-03-03'),
(12, 0, 0, 'Chasing Dreams', 'Available', 'Inspirational', 'Book', 8, 'Kevin Anderson', 'Dreamcatcher Books', '2025-03-13', '978-8-90123-456-7', '', NULL, ' ', '2025-03-03'),
(13, 0, 0, 'The Last Leaf', 'Available', 'Drama', 'Book', 3, 'Linda Martinez', 'Evergreen Press', '2025-02-26', ' 978-7-89012-345-6', '', NULL, ' ', '2025-03-03'),
(14, 0, 0, 'The Enchanted Garden', 'Available', 'Fantasy', 'Book', 2, 'Alice Green', 'Dreamscape Press', '2025-02-08', ' 978-1-23456-789-12', '', NULL, ' ', '2025-03-03'),
(15, 0, 0, 'The Last Train Home\r\n\r\n', 'Available', 'Historical Fiction', 'Book', 2, 'Mark Robinson', 'Journey Books', '2024-12-01', '978-1-23456-789-13', '', NULL, ' ', '2025-03-03'),
(16, 0, 0, ' Echoes of the Past', 'Available', 'Mystery', 'Book', 3, 'Julia White', 'Echo Publishing', '2024-11-14', '978-1-23456-789-14', '', NULL, ' ', '2025-03-03'),
(17, 0, 0, 'The Quantum Realm', 'Available', ' Science Fiction', 'Book', 1, 'George King', 'Science Frontier', '2024-11-29', '978-1-23456-789-15', '', NULL, ' ', '2025-03-03'),
(18, 0, 0, 'Cooking with Love', 'Available', 'Cookbook', 'Book', 6, 'Laura Adams', 'Heartfelt Recipes', '2024-12-28', ' 978-1-23456-789-16\r\n', '', NULL, ' ', '2025-03-03'),
(19, 0, 0, ' The Art of Storytelling', 'Available', 'Self-Help', 'Book', 14, 'Steven Wright', 'Creative Minds Press', '2024-08-20', '978-1-23456-789-17', '', NULL, ' ', '2025-03-03'),
(20, 0, 0, 'The Secret Life of Trees', 'Available', ' Non-Fiction', 'Book', 10, 'Emma Scott', 'Nature\'s Wisdom', '2024-09-10', '978-1-23456-789-18', '', NULL, ' ', '2025-03-03'),
(21, 0, 0, 'The Time Traveler\'s Dilemma', 'Available', 'Science Fiction', 'Book', 2, 'Henry Carter', 'Future Vision', '2024-11-20', '978-1-23456-789-19', '', NULL, ' ', '2025-03-03'),
(22, 0, 0, 'Love Beyond Borders', 'Available', 'Romance', 'Book', 1, 'Mia Turner', ' Global Romance Press\r\n', '2024-10-22', ' 978-1-23456-789-20', '', NULL, ' ', '2025-03-03'),
(23, 0, 0, 'The Hidden Truth', 'Available', 'Thriller', 'Book', 2, 'Oliver Reed', ' Truth Seekers', '2024-12-21', '978-1-23456-789-21', '', NULL, ' ', '2025-03-03'),
(24, 0, 0, 'Beyond the Horizon', 'Available', 'Adventure', 'Book', 2, 'Clara T. Walcott', 'Ocean View Press', '2024-08-27', '978-1-56789-012-3', '', NULL, ' ', '2025-03-03'),
(25, 0, 0, 'Heartstrings', 'Available', 'Romance', 'Book', 8, 'David W. Sinclair', 'Maple Leaf Publishers', '2024-09-09', '978-0-12345-678-9', '', NULL, ' ', '2025-03-03'),
(26, 0, 0, 'The Art of Tomorrow', 'Available', 'Science Fiction  ', 'Book', 3, 'Sarah L. Montgomery', 'Horizon Books', '2024-09-10', '978-1-11111-222-3', '', NULL, ' ', '2025-03-03'),
(27, 0, 0, 'Shadows in the Rain', 'Available', 'Mystery  ', 'Book', 2, 'Michael J. Reynolds', ' Silver Lining Publishing', '2024-12-20', '978-0-98765-432-1', '', NULL, ' ', '2025-03-03'),
(28, 0, 0, 'Whispers of the Forgotten', 'Available', 'Fantasy', 'Book', 1, 'Emily Hart', 'Dreamscape Press', '2024-12-15', ' 978-1-23456-789-0', '', NULL, ' ', '2025-03-03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `catalog`
--
ALTER TABLE `catalog`
  ADD PRIMARY KEY (`CatalogID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `catalog`
--
ALTER TABLE `catalog`
  MODIFY `CatalogID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
