<?php
include_once "course.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

$course=new Course();


if($course->deleteCourse($crn))
{
    echo "true";
} 
else 
{
    echo "false";
}

?>