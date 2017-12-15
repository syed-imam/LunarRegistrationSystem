<?php

include_once "database.php";
include_once "major.php";

echo json_encode($major->getAllMajors());

?>