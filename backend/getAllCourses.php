<?php

include_once "database.php";
include_once "course.php";

$course=new Course();

echo json_encode($course->getAllCourses());

?>