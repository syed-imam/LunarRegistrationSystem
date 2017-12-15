<?php

include_once "database.php";
include_once "files.php";

echo json_encode($faculty->getFacultyById($_GET["id"]));

?>