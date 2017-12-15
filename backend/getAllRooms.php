<?php

include_once "database.php";
include_once "room.php";

echo json_encode($room->getAllRooms());

?>