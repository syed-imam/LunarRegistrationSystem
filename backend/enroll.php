<?php
date_default_timezone_set('America/New_York');
include_once "database.php";
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

// Check redundancy
$conn = Database::connect();

//$conn->begin_transaction();
//$conn->autocommit(FALSE);
//currentSemester
$sql="SELECT * 
FROM  Registration NATURAL JOIN Class WHERE semester='".$currentSemester."' AND year=".$currentYear."";   //select all active ones to enrollment

$result=$conn->query($sql);

while($obj=mysqli_fetch_object($result))
        {    
        $sql1 = "INSERT INTO Enrollment(student_id,class_id) VALUES(?,?)";
        $stmt = $conn->prepare($sql1);
        $stmt->bind_param("ii", $obj->student_id, $obj->class_id);
        $stmt->execute();
        }

//i wana delete everything from registration when semester ends

     $sql2 = "DELETE Registration FROM Registration NATURAL JOIN Class WHERE semester='".$currentSemester."' AND year=".$currentYear."";    //make them inactive now
     $stmt1 = $conn->prepare($sql2);
     $stmt1->execute();
  


/*
$sql3="SELECT DISTINCT `Semester/Year`.date_end
FROM Registration
NATURAL JOIN Class
NATURAL JOIN  `Semester/Year`";

$result=$conn->query($sql3);

$obj=mysqli_fetch_object($result);
$today=date("Y-m-d"); 
//$today=date("2017-06-09"); 


if($obj->date_end<$today)  //if the date has passed the 
{
     $sql4 = "UPDATE Registration SET semester_over=1";    //make them inactive now
     $stmt2 = $conn->prepare($sql4);
     $stmt2->execute();  
}

*/

$conn->close();

?> 
