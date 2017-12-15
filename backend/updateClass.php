<?php
include_once "class.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);


if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);


$class=new Classlist();

return ($class->updateClass($classid,$building,$room,$year, $semester,$time, $section, $days[0], $days[1], $capacity, $professor));


?>