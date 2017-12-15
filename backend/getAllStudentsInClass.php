<?php

include_once "database.php";
include_once "class.php";

$class = new Classlist();
echo json_encode($class->getAllStudentsInClass($_GET["classid"]));

?>