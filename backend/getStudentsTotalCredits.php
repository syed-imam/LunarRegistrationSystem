<?php
include_once "database.php";
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_GET);
$conn = Database::connect();

//  echo "U the man";

//getting all the registered courses
$sql = "SELECT SUM( Course.credits ) AS total_credits
FROM Enrollment
NATURAL JOIN Class
NATURAL JOIN Course
WHERE student_id=".$student_id;
$result = $conn->query($sql);

$arr = [];
if ($result->num_rows > 0){
     // output data of each row
     while($row = $result->fetch_assoc()) {
         array_push($arr, $row);
     }
    echo json_encode($arr);
}
else
{
     echo "0";
}



?>