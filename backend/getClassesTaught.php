<?php

include_once "database.php";
include_once "class.php";

$class = new Classlist();

echo json_encode($class->getClassesTaught($_GET["uid"], $_GET["semester"], $_GET["year"]));

?>