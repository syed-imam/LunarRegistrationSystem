<?php
include_once "database.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

$conn = Database::connect();

$lw = strtolower($data["type"]);

$sql = "INSERT INTO ".$data["type"]." (".$lw."_name, department_name) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $data["name"], $data["department"]);
if ($stmt->execute()) {
    echo "true";
} else {
    echo "false";
}

?>