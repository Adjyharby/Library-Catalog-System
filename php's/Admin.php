<?php
include_once './connect.php';

// Set headers for CORS and content type
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// Utility function: Check if a given username is librarian (case-insensitive)
function isLibrarian($username) {
    return strtolower($username) === 'librarian';
}

// -------------------
// POST: Login OR Create New Account
// -------------------
if ($method === 'POST') {
    $postdata = file_get_contents("php://input");
    if (empty($postdata)) {
        http_response_code(400);
        echo json_encode(["error" => "No data received"]);
        exit;
    }
    
    $request = json_decode($postdata);
    
    // If login request (using "username" field)
    if (isset($request->username) && isset($request->password)) {
        $username = mysqli_real_escape_string($conn, $request->username);
        $password = mysqli_real_escape_string($conn, $request->password);
        // Normalize librarian name
        if (isLibrarian($username)) {
            $username = 'librarian';
        }
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
    // Else, treat it as a request to create a new account
    else if (isset($request->Name) && isset($request->Password)) {
        // Check if the creator is librarian via GET parameter
        if (!isset($_GET['currentUser']) || !isLibrarian($_GET['currentUser'])) {
            http_response_code(403);
            echo json_encode(["error" => "Permission denied, you are not librarian"]);
            exit;
        }
        // Validate required fields
        if (empty($request->Name) || empty($request->Password)) {
            http_response_code(400);
            echo json_encode(["error" => "Name and Password are required"]);
            exit;
        }
        // Disallow creation of an account named "librarian" (any case)
        if (isLibrarian($request->Name)) {
            http_response_code(400);
            echo json_encode(["error" => "Cannot create account with reserved name 'librarian'"]);
            exit;
        }
        
        $name = mysqli_real_escape_string($conn, $request->Name);
        $password = mysqli_real_escape_string($conn, $request->Password);
        
        // Insert new admin record
        $query = "INSERT INTO admin (Name, Password) VALUES ('$name', '$password')";
        if (mysqli_query($conn, $query)) {
            $newID = mysqli_insert_id($conn);
            echo json_encode([
                "message" => "Admin account created",
                "AdminID" => $newID,
                "Name" => $name,
                "Password" => $password
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create admin account"]);
        }
        mysqli_close($conn);
        exit;
    }
    else {
        http_response_code(400);
        echo json_encode(["error" => "Invalid POST data"]);
        mysqli_close($conn);
        exit;
    }
}

// -------------------
// GET: Retrieve Admin Records (with password masking based on currentUser)
// -------------------
if ($method === 'GET') {
    $currentUser = isset($_GET['currentUser']) ? $_GET['currentUser'] : null;
    $data = mysqli_query($conn, "SELECT * FROM admin");
    
    if (!$data) {
        http_response_code(500);
        echo json_encode(["error" => "Database query failed: " . mysqli_error($conn)]);
        exit;
    }
    
    $adminArr = [];
    while ($row = mysqli_fetch_assoc($data)) {
        // Normalize librarian name to lowercase
        if (isLibrarian($row['Name'])) {
            $row['Name'] = 'librarian';
        }
        // If currentUser is not librarian, mask passwords for accounts other than the current user.
        if (!isLibrarian($currentUser) && $row['Name'] !== $currentUser) {
            $row['Password'] = "******";
        }
        $adminArr[] = $row;
    }
    
    mysqli_close($conn);
    echo json_encode($adminArr);
    exit;
}

// -------------------
// PUT: Update an Existing Admin Account
// -------------------
if ($method === 'PUT') {
    $putData = file_get_contents("php://input");
    if (empty($putData)) {
        http_response_code(400);
        echo json_encode(["error" => "No data received"]);
        exit;
    }
    
    $data = json_decode($putData);
    if (!isset($data->AdminID) || !isset($data->Name) || !isset($data->Password) || !isset($data->currentUser)) {
        http_response_code(400);
        echo json_encode(["error" => "AdminID, Name, Password, and currentUser are required"]);
        exit;
    }
    
    // Only librarian may update accounts
    if (!isLibrarian($data->currentUser)) {
        http_response_code(403);
        echo json_encode(["error" => "Permission denied, you are not librarian"]);
        exit;
    }
    
    $adminID = (int)$data->AdminID;
    $name = mysqli_real_escape_string($conn, $data->Name);
    $password = mysqli_real_escape_string($conn, $data->Password);
    
    // Fetch the current record to check if it's the librarian account
    $query = "SELECT * FROM admin WHERE AdminID = $adminID";
    $result = mysqli_query($conn, $query);
    if (!$result || mysqli_num_rows($result) === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Admin not found"]);
        exit;
    }
    $existing = mysqli_fetch_assoc($result);
    
    // Prevent non-librarian from editing any account (already checked)
    // For the librarian account, only librarian can change its password.
    // (Here, since currentUser is librarian, it’s allowed to update any field.)
    
    $updateQuery = "UPDATE admin SET Name = '$name', Password = '$password' WHERE AdminID = $adminID";
    if (mysqli_query($conn, $updateQuery)) {
        echo json_encode([
            "message" => "Admin account updated",
            "AdminID" => $adminID,
            "Name" => $name,
            "Password" => $password
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update admin account"]);
    }
    mysqli_close($conn);
    exit;
}

// -------------------
// DELETE: Delete an Admin Account
// -------------------
if ($method === 'DELETE') {
    // Require AdminID and currentUser via GET parameters
    if (!isset($_GET['AdminID']) || !isset($_GET['currentUser'])) {
        http_response_code(400);
        echo json_encode(["error" => "AdminID and currentUser are required for deletion"]);
        exit;
    }
    if (!isLibrarian($_GET['currentUser'])) {
        http_response_code(403);
        echo json_encode(["error" => "Permission denied, you are not librarian"]);
        exit;
    }
    $adminID = (int) $_GET['AdminID'];
    $query = "SELECT * FROM admin WHERE AdminID = $adminID";
    $result = mysqli_query($conn, $query);
    if (!$result || mysqli_num_rows($result) === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Admin not found"]);
        exit;
    }
    $admin = mysqli_fetch_assoc($result);
    // Prevent deletion of the librarian account
    if (isLibrarian($admin['Name'])) {
        http_response_code(403);
        echo json_encode(["error" => "Cannot delete the librarian account"]);
        exit;
    }
    
    $deleteQuery = "DELETE FROM admin WHERE AdminID = $adminID";
    if (mysqli_query($conn, $deleteQuery)) {
        echo json_encode(["message" => "Admin account deleted", "AdminID" => $adminID]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete admin account"]);
    }
    mysqli_close($conn);
    exit;
}

// If no valid request method is matched
http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
mysqli_close($conn);
?>
