<?php

include_once "database.php";

extract($_GET);
$conn = Database::connect();

$sql = "select * from Student join User on student_id = user_id where student_advisor = ".$uid;
$result = $conn->query($sql);

$arr = [];
if ($result->num_rows > 0){
    // output data of each row
    while($row = $result->fetch_assoc()) {
        array_push($arr, $row);
    }
    echo json_encode($arr);
} else {
    echo "0";
}

?>