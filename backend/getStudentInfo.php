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
$sql = "SELECT *, TIME_FORMAT( start_time ,  '%h:%i %p' ) AS start_time, TIME_FORMAT(end_time ,  '%h:%i %p' ) AS end_time  FROM Student NATURAL JOIN Registration NATURAL JOIN Student_Full_Time NATURAL JOIN Class NATURAL JOIN Course NATURAL JOIN Timeslot NATURAL JOIN Timeperiod WHERE semester_over=0 AND student_id = ".$student_id;
$result = $conn->query($sql);

$arr = [];
if ($result->num_rows > 0) {
     // output data of each row
     while($row = $result->fetch_assoc()) {
         array_push($arr, $row);
     }
    echo json_encode($arr);
}
else {
     echo "0";
}
?>