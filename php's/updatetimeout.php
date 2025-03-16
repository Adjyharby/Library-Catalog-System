<?php
include_once './connect.php';

// Set headers for CORS
header("Access-Control-Allow-Origin: http://localhost:5173"); // Match frontend URL for consistency
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Respond with 200 OK for preflight request
    exit;
}

// Handle POST request to update TimeOut
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the posted data
    $postdata = file_get_contents("php://input");

    // If no data is received, send an error response
    if (empty($postdata)) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "No data received"]);
        exit;
    }

    // Decode the JSON data into an object
    $request = json_decode($postdata);

    // Validate if required fields exist
    if (!isset($request->AttendeeID) || !isset($request->TimeOut)) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Missing required fields (AttendeeID, TimeOut)"]);
        exit;
    }

    // Extract the data from the request
    $attendeeID = $request->AttendeeID;
    $timeOut = $request->TimeOut;

    // Validate the data
    if (empty($attendeeID) || empty($timeOut)) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "AttendeeID and TimeOut cannot be empty"]);
        exit;
    }

    // Prepare and execute the update query
    $stmt = $conn->prepare("UPDATE attendance SET TimeOut = ? WHERE AttendeeID = ?");
    $stmt->bind_param("ss", $timeOut, $attendeeID);

    // Check for errors while executing the query
    if ($stmt->execute()) {
        // Check if any rows were affected (optional, for better feedback)
        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "TimeOut updated successfully"]);
        } else {
            http_response_code(404); // Not Found
            echo json_encode(["error" => "No record found with AttendeeID: $attendeeID"]);
        }
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(["error" => "Database update failed: " . $stmt->error]);
    }

    // Close the statement and database connection
    $stmt->close();
    mysqli_close($conn);
    exit;
}

// If no valid request method is matched
http_response_code(405); // Method Not Allowed
echo json_encode(["error" => "Method not allowed"]);
?>