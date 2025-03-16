<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbName ="library_catalog";
$conn = mysqli_connect($servername, $username, $password, $dbName);

if (!$conn) {
    echo json_encode(['error' => 'Database connection failed: ' . mysqli_connect_error()]);
    exit;
}


?>