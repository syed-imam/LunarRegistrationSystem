<?php
include_once "room.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

if($room->updateRoom($data["number"], $data["buildingName"], $data["capacity"]))
{
    echo "true";
} 
else 
{
    echo "false";
}

?>