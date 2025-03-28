<?php
include_once './connect.php';

// Set headers for CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Handle POST request for admin login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the posted data
    $postdata = file_get_contents("php://input");
    if (empty($postdata)) {
        http_response_code(400);
        echo json_encode(["error" => "No data received"]);
        exit;
    }
    
    $request = json_decode($postdata);
    
    // Validate required fields
    if (!isset($request->username) || !isset($request->password)) {
        http_response_code(400);
        echo json_encode(["error" => "Missing credentials"]);
        exit;
    }
    
    // Sanitize inputs to prevent SQL injection
    $username = mysqli_real_escape_string($conn, $request->username);
    $password = mysqli_real_escape_string($conn, $request->password);
    
    // Query the admin table for a row where the Name and Password match exactly (case-sensitive)
    $query = "SELECT * FROM admin WHERE BINARY Name = '$username' AND BINARY Password = '$password' LIMIT 1";
    $result = mysqli_query($conn, $query);
    
    if ($result && mysqli_num_rows($result) > 0) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "error" => "Invalid username or password"]);
    }
    
    mysqli_close($conn);
    exit;
}

// Handle GET request to return all admin records (if needed)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = mysqli_query($conn, "SELECT * FROM admin");
    
    if (!$data) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed: " . mysqli_error($conn)]);
        exit;
    }
    
    $adminArr = [];
    while ($row = mysqli_fetch_assoc($data)) {
        $adminArr[] = $row;
    }
    
    mysqli_close($conn);
    echo json_encode($adminArr);
    exit;
}

// If no valid request method is matched
http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
?>
