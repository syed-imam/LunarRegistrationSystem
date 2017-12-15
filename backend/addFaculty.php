<?php
include_once "faculty.php";
include_once "database.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

// Check redundancy
$conn = Database::connect();
$sql = "SELECT user_email FROM User WHERE user_email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $data["email"]);
$stmt->execute();
$stmt->bind_result($checkEmail);
$stmt->fetch();


if ($checkEmail != $data["email"]) {
    if($faculty->addFaculty($data["firstname"], $data["lastname"], $data["email"], $data["password"], $data["phonenumber"], $data["streetaddress"], $data["city"], $data["state"], $data["zipcode"], $data["gender"]["type"], $data["birthday"], $data["department"])) {
        echo "true";
    } else {
        echo "false";
    }
} else {
    echo "redundant";
}
?>