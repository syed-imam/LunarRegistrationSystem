<?php
include_once "room.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

if($room->deleteRoom($roomNumber, $buildingName)) {
    echo "true";
} else {
    echo "false";
}

?>