<?php

include_once "database.php";
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_GET);
$conn = Database::connect();
//getting all the registered courses
$sql = "SELECT *FROM Semester_Year WHERE '".$today."' BETWEEN date_start AND date_end";
$result = $conn->query($sql);
$arr=[];
     while($row = $result->fetch_assoc()){
             array_push($arr, $row);
          }

    echo json_encode($arr);   //this will return the current semester, deadline for registration and when semester ends;

?>