<?php

// Set headers for CORS
header("Access-Control-Allow-Origin: http://localhost:5173"); // Replace with your front-end URL
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Set response content type to JSON

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Respond with 200 OK for preflight requests
    exit;
}

include_once './connect.php';

// Fetch single book by CatalogID
if (isset($_GET['CatalogID'])) {
    $id = (int) $_GET['CatalogID'];
    $result = mysqli_query($conn, "SELECT * FROM catalog WHERE CatalogID = $id");

    if ($result && mysqli_num_rows($result) > 0) {
        $book = mysqli_fetch_assoc($result);
        $book = array_map(function($value) {
            return $value === null ? "" : $value;
        }, $book);
        echo json_encode($book);
    } else {
        echo json_encode(['error' => 'Book not found']);
    }
}
// Fetch books by genre
elseif (isset($_GET['genre'])) {
    $genre = mysqli_real_escape_string($conn, $_GET['genre']);
    $genreQuery = "SELECT * FROM catalog WHERE Genre LIKE '%$genre%'";

    $data = mysqli_query($conn, $genreQuery);
    $results = [];

    while ($row = mysqli_fetch_assoc($data)) {
        $results[] = array_map(function($value) {
            return $value === null ? "" : $value;
        }, $row);
    }

    echo json_encode($results);
}
// Fetch books based on search query (q parameter)
elseif (isset($_GET['q'])) {
    $search = mysqli_real_escape_string($conn, $_GET['q']);
    $searchQuery = "SELECT * FROM catalog 
                    WHERE `Book Name` LIKE '%$search%' 
                       OR `ShortDesc` LIKE '%$search%' 
                       OR AuthorName LIKE '%$search%'";

    $data = mysqli_query($conn, $searchQuery);
    $results = [];

    while ($row = mysqli_fetch_assoc($data)) {
        $results[] = array_map(function($value) {
            return $value === null ? "" : $value;
        }, $row);
    }

    echo json_encode($results);
}
// Fetch all catalog data
else {
    $data = mysqli_query($conn, "SELECT * FROM catalog");
    $results = [];

    while ($row = mysqli_fetch_assoc($data)) {
        $results[] = array_map(function($value) {
            return $value === null ? "" : $value;
        }, $row);
    }

    echo json_encode($results);
}

$conn->close();
?>