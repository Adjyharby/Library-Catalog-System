<?php
include_once './connect.php';

// Set headers for CORS
header("Access-Control-Allow-Origin: *"); // Replace with your front-end URL
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Respond with 200 OK for preflight requests
    exit;
}

// Handle POST request to insert new attendance record
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the posted data
    $postdata = file_get_contents("php://input");
    if (empty($postdata)) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "No data received"]);
        exit;
    }

    $request = json_decode($postdata);

    // Validate required fields
    if (!isset($request->Name) || !isset($request->TimeIn) || !isset($request->Date)) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Missing required fields (Name, TimeIn, Date)"]);
        exit;
    }

    // Extract data from the request (with defaults for optional fields)
    $attendeeID = $request->AttendeeID ?? ""; // Empty string if not provided
    $name = $request->Name ?? "";
    $gender = $request->Gender ?? "";
    $age = $request->Age ?? "";
    $dept = $request->Dept ?? "";
    $timeIn = $request->TimeIn ?? "";
    $date = $request->Date ?? "";
    $yearLevel = $request->YearLevel ?? "";
    $purpose = $request->purpose ?? "";

    // Prepare and execute the insert query
    $stmt = $conn->prepare("INSERT INTO attendance (AttendeeID, Name, Gender, Age, Dept, TimeIn, Date, YearLevel, purpose) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssss", $attendeeID, $name, $gender, $age, $dept, $timeIn, $date, $yearLevel, $purpose);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Record inserted successfully"]);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "Database insert failed: " . $stmt->error, "data" => $request]);
    }

    // Close the statement and connection
    $stmt->close();
    mysqli_close($conn);
    exit;
}

// Handle GET request to retrieve attendance data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Query the database
    $data = mysqli_query($conn, "SELECT * FROM attendance ORDER BY AttendeeID DESC");

    if (!$data) {
        // Handle query error
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "Database query failed: " . mysqli_error($conn)]);
        exit;
    }

    $regArr = [];

    // Fetch data and build the array
    while ($row = mysqli_fetch_assoc($data)) {
        $regArr[] = $row;
    }

    // Close the database connection
    mysqli_close($conn);

    // Return the JSON encoded data
    echo json_encode($regArr);
    exit;
}

// If no valid request method is matched
http_response_code(405); // Method Not Allowed
echo json_encode(["error" => "Method not allowed"]);
?>