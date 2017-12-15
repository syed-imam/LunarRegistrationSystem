<?php
include_once "student.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

//print_r($holds);

if($student->updateStudent($data["id"], $data["firstname"], $data["lastname"], $data["email"], $data["password"], $data["phonenumber"], $data["streetaddress"], $data["city"], $data["state"], $data["zipcode"], $data["gender"], $data["birthday"], $holds, $data["majorthing"], $data["minorthing"], $data["facultyID"])) {
    echo "true";
} else {
    echo "false";
}

?>