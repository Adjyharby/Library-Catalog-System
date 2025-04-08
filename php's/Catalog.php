<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once './connect.php';

// Fetch single book by CatalogID
if (isset($_GET['CatalogID'])) {
    $id = (int) $_GET['CatalogID'];
    $result = mysqli_query($conn, "SELECT * FROM catalog WHERE CatalogID = $id");
    if ($result && mysqli_num_rows($result) > 0) {
        $book = mysqli_fetch_assoc($result);
        $book = array_map(function($value) { return $value === null ? "" : $value; }, $book);
        echo json_encode($book);
    } else {
        echo json_encode(['error' => 'Book not found']);
    }
}
// Fetch books by type (search by type)
elseif (isset($_GET['type'])) {
    $type = mysqli_real_escape_string($conn, $_GET['type']);
    $typeQuery = "SELECT * FROM catalog WHERE Type LIKE '%$type%' ORDER BY CatalogID DESC";
    $data = mysqli_query($conn, $typeQuery);
    $results = [];
    while ($row = mysqli_fetch_assoc($data)) {
        $results[] = array_map(function($value) { return $value === null ? "" : $value; }, $row);
    }
    echo json_encode($results);
}
// Fetch books by search query (searching in Book Name, ShortDesc, or AuthorName)
elseif (isset($_GET['q'])) {
    $search = mysqli_real_escape_string($conn, $_GET['q']);
    $searchQuery = "SELECT * FROM catalog 
                    WHERE `Book Name` LIKE '%$search%' 
                       OR `ShortDesc` LIKE '%$search%' 
                       OR AuthorName LIKE '%$search%' 
                    ORDER BY CatalogID DESC";
    $data = mysqli_query($conn, $searchQuery);
    $results = [];
    while ($row = mysqli_fetch_assoc($data)) {
        $results[] = array_map(function($value) { return $value === null ? "" : $value; }, $row);
    }
    echo json_encode($results);
}
// Add a new book (POST)
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $title       = mysqli_real_escape_string($conn, $data['Book Name']);
    $author      = mysqli_real_escape_string($conn, $data['AuthorName']);
    $type        = mysqli_real_escape_string($conn, $data['Type']);
    $desc        = mysqli_real_escape_string($conn, $data['ShortDesc']);
    $img         = mysqli_real_escape_string($conn, $data['ImageDir'] ?? '');
    $status      = mysqli_real_escape_string($conn, $data['Status'] ?? 'Available');
    $publisher   = mysqli_real_escape_string($conn, $data['PublisherName'] ?? '');
    $publishDate = mysqli_real_escape_string($conn, $data['DateOfPublish'] ?? '0000-00-00');
    $quantity    = (int) $data['Quantity'];
    $ssid        = mysqli_real_escape_string($conn, $data['SSID'] ?? '');
    $dateModified= mysqli_real_escape_string($conn, $data['DateModified'] ?? date('Y-m-d H:i:s'));

    // BookID and AdminID are left as null in the insert statement
    $query = "INSERT INTO catalog (`Book Name`, AuthorName, Type, ShortDesc, ImageDir, Status, PublisherName, DateOfPublish, Quantity, SSID, DateModified) 
              VALUES ('$title', '$author', '$type', '$desc', '$img', '$status', '$publisher', '$publishDate', $quantity, '$ssid', '$dateModified')";
    
    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true, 'CatalogID' => mysqli_insert_id($conn)]);
    } else {
        echo json_encode(['error' => mysqli_error($conn)]);
    }
}
// Update a book (PUT)
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id          = (int) $data['CatalogID'];
    $title       = mysqli_real_escape_string($conn, $data['Book Name']);
    $author      = mysqli_real_escape_string($conn, $data['AuthorName']);
    $type        = mysqli_real_escape_string($conn, $data['Type']);
    $desc        = mysqli_real_escape_string($conn, $data['ShortDesc']);
    $img         = mysqli_real_escape_string($conn, $data['ImageDir'] ?? '');
    $status      = mysqli_real_escape_string($conn, $data['Status'] ?? 'Available');
    $publisher   = mysqli_real_escape_string($conn, $data['PublisherName'] ?? '');
    $publishDate = mysqli_real_escape_string($conn, $data['DateOfPublish'] ?? '0000-00-00');
    $quantity    = (int) $data['Quantity'];
    $ssid        = mysqli_real_escape_string($conn, $data['SSID'] ?? '');
    $dateModified= mysqli_real_escape_string($conn, $data['DateModified'] ?? date('Y-m-d H:i:s'));

    $query = "UPDATE catalog 
              SET `Book Name` = '$title',
                  AuthorName = '$author',
                  Type = '$type',
                  ShortDesc = '$desc',
                  ImageDir = '$img',
                  Status = '$status',
                  PublisherName = '$publisher',
                  DateOfPublish = '$publishDate',
                  Quantity = $quantity,
                  SSID = '$ssid',
                  DateModified = '$dateModified'
              WHERE CatalogID = $id";

    if (mysqli_query($conn, $query)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => mysqli_error($conn)]);
    }
}
// Delete a book (DELETE)
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (isset($_GET['CatalogID'])) {
        $id = (int) $_GET['CatalogID'];
        $query = "DELETE FROM catalog WHERE CatalogID = $id";
        if (mysqli_query($conn, $query)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => mysqli_error($conn)]);
        }
    } else {
        echo json_encode(['error' => 'CatalogID is required']);
    }
}
// Fetch all books (sorted by CatalogID DESC)
else {
    $data = mysqli_query($conn, "SELECT * FROM catalog ORDER BY CatalogID DESC");
    $results = [];
    while ($row = mysqli_fetch_assoc($data)) {
        $results[] = array_map(function($value) { return $value === null ? "" : $value; }, $row);
    }
    echo json_encode($results);
}

$conn->close();
?>
