<?php

include_once "database.php";
include_once "minor.php";

echo json_encode($minor->getAllMinors());

?>