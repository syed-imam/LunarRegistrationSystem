<?php
include_once "faculty.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

if($faculty->updateFaculty($data["id"], $data["firstname"], $data["lastname"], $data["email"], $data["password"], $data["phonenumber"], $data["streetaddress"], $data["city"], $data["state"], $data["zipcode"], $data["gender"], $data["birthday"], $data["department"])) {
    echo "true";
} else {
    echo "false";
}
?>