<?php
include_once './connect.php';
header(header: "Access-Control-Allow-Origin: *");
header(header: "Access-Control-Allow-Methods: GET");
$data = mysqli_query(mysql: $connect, query: "SELECT * FROM admin ");
$catArr = [];
while ($row = mysqli_fetch_assoc(result: $data)) {
    $catArr[] = $row;
}
$connect->close();
echo json_encode($catArr);