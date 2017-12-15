<?php

include_once "database.php";
include_once "files.php";

echo json_encode($student->getStudentById($_GET["id"]));

?>