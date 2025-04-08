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
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `AttendeeID` int(11) NOT NULL,
  `Name` varchar(2500) NOT NULL,
  `Gender` varchar(2500) NOT NULL,
  `Age` int(11) NOT NULL,
  `Dept` varchar(2500) NOT NULL,
  `TimeIn` time NOT NULL,
  `TimeOut` time NOT NULL,
  `Date` date NOT NULL,
  `YearLevel` varchar(15) NOT NULL,
  `purpose` varchar(2500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`AttendeeID`, `Name`, `Gender`, `Age`, `Dept`, `TimeIn`, `TimeOut`, `Date`, `YearLevel`, `purpose`) VALUES
(1, 'Noel Salazar', 'Male', 21, 'N/A', '14:57:51', '00:00:00', '2025-03-02', 'N/A', 'Study'),
(2, 'Noel Salazar', 'Male', 21, 'N/A', '14:57:56', '00:00:00', '2025-03-02', 'N/A', 'Study'),
(3, 'Noel Salazar', 'Male', 21, 'N/A', '14:58:05', '00:00:00', '2025-03-02', 'N/A', 'Study'),
(4, 'Noel Salazar', 'Male', 21, 'N/A', '14:58:14', '15:36:16', '2025-03-02', 'N/A', 'Study'),
(5, 'Noel Salazar', 'Male', 21, 'N/A', '14:58:21', '20:06:02', '2025-03-02', 'N/A', 'Study'),
(6, 'Noel Salazar', 'Male', 21, 'N/A', '14:58:28', '20:06:01', '2025-03-02', 'N/A', 'Study'),
(7, 'Santo papa', 'lgbt', 999, 'katen', '20:05:31', '20:05:59', '2025-03-04', '10', 'katen');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`AttendeeID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `AttendeeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
