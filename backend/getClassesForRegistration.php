<?php

include_once "database.php";
include_once "class.php";


if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_GET);


        $conn = Database::connect();
        $statement = "SELECT user_fname, user_lname, credits, class_id, course_id, course_description, department, section, room_number, room_capacity, building_name, semester, YEAR, course_name, day1, day2, TIME_FORMAT( start_time,  '%h:%i %p' ) AS start_time, TIME_FORMAT( end_time,  '%h:%i %p') AS end_time, time_period, class_capacity - count_registered AS seats_available
        FROM Class
        NATURAL JOIN Course
        NATURAL JOIN Timeslot
        NATURAL JOIN Timeperiod
        NATURAL JOIN Room
        NATURAL JOIN Faculty_Classes
        INNER JOIN User ON User.user_id = Faculty_Classes.faculty_id
        WHERE Class.semester='".$nextSemester."' AND Class.year=".$nextYear."";
    
        $result = $conn->query($statement);
        $arr = [];
        while ($row = $result->fetch_assoc()){
            array_push($arr, $row);
        }
        $conn->close(); 
       



echo json_encode($arr);


?>