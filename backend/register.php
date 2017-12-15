<?php
include_once "database.php";
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);
extract($_GET);
// Check redundancy
$conn = Database::connect();

$sql5="SELECT prereq_id 
FROM  Class 
NATURAL JOIN Prerequisite
WHERE  class_id=".$class_id."";

$result = $conn->query($sql5);

while($obj=mysqli_fetch_object($result))   //check all prereqs in c
{    
 $sql6="SELECT *from Enrollment NATURAL JOIN Class WHERE course_id=".$obj->prereq_id." AND student_id=".$student_id."";

  $result1=$conn->query($sql6);

  if($result1->num_rows===0)
  {
      echo "Missing prereq courseID ".$obj->prereq_id;
      return;
  }
    
}

//Before transaction
$conn->begin_transaction();
$conn->autocommit(FALSE);


$sql3 = "UPDATE Class SET count_registered=count_registered+1 WHERE class_id=".$class_id." AND count_registered < class_capacity AND count_registered >= 0";
$conn->query($sql3);
if($conn->affected_rows>0){

    //Before registration make sure the course doesnt have any prereqs
    $sql = "INSERT INTO Registration (Student_id, Class_id) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $student_id, $class_id );
    $stmt->execute();


    $sql2 = "INSERT INTO Student_Full_Time (Student_id, current_semester_credits) VALUES (?,?) ON DUPLICATE KEY UPDATE current_semester_credits = ?";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("iii", $student_id, $student_credits, $student_credits);
    $stmt2->execute();

    $room_capacity = $room_capacity-1;
    $sql3 = "UPDATE Room SET room_capacity = ? WHERE room_number = ?";
    $stmt3 = $conn->prepare($sql3);
    $stmt3->bind_param("ii", $room_capacity, $room_number);
    $stmt3->execute();

    if($conn->commit())
         echo "true";
    else
         echo "false";
} else {
    echo "Class is full!";
}
$conn->close();

?>