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
$sql = "SELECT class_id, course_name, enrol_grade, credits, CONCAT( semester,  ' ', year ) AS  'semester'
FROM Enrollment
NATURAL JOIN Class
NATURAL JOIN Course
WHERE student_id =".$id." ORDER BY semester AND year";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
     // output data of each row
    $arr = array();
    while ($row = $result->fetch_assoc()) {
        if (isset($arr[$row['semester']])) {
            array_push($arr[$row['semester']], $row);
        } else {
            $arr[$row['semester']] = array();
            array_push($arr[$row['semester']], $row);
        }
    }
    
    echo json_encode($arr);
    /*
     while($row = $result->fetch_assoc()) {
         array_push($arr, $row);
     }
    echo json_encode($arr);*/
}
else {
     echo "0";
}
?>