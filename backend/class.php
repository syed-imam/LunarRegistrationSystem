<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
include_once "database.php";


class Classlist{    

public function addClass($crn, $firstprofessor, $section, $year, $semester, $building, $room, $days, $timeperiod,$capacity){  
      
       $conn1 = Database::connect();
       $conn2 = Database::connect();
       $conn3 = Database::connect();
    
     $sql="SELECT *FROM  Faculty_Classes NATURAL JOIN Class WHERE faculty_id=".$firstprofessor." AND semester='".$semester."' AND YEAR = ".$year."";
    
     $result=$conn3->query($sql);
    
     if($result->num_rows<4)
     {  
         
        //Check times
         
         
    
      $sql = "SELECT timeslot_id FROM Timeslot WHERE time_period=? AND  day1=? AND day2=?";
      $statement1 = $conn1->prepare($sql);
      $statement1->bind_param("iss",$timeperiod,$days[0],$days[1]);
      $statement1->execute();
      $statement1->bind_result($timeslot);  //timeslot is the object where result is sent back in
      $statement1->fetch();   
  
    
    
      $sql = "INSERT INTO Class(section,course_id, timeslot_id, room_number, building_name, semester, year, class_capacity) 
              VALUES (?,?,?,?,?,?,?,?)";
      $statement2 = $conn2->prepare($sql);
      $statement2->bind_param("siiissii",$section, $crn, $timeslot, $room, $building, $semester, $year, $capacity);
      $statement2->execute();    
    
     $sql = "INSERT INTO Faculty_Classes(faculty_id,class_id) VALUES (".$firstprofessor.",".$conn2->insert_id.")";
     
    if($conn3->query($sql))
     {
            $conn1->close();
            $conn2->close();
            $conn3->close();
         
         echo "true";
         return;
     }            
     else
     {
            $conn1->close();
            $conn2->close();
            $conn3->close();
         
                  
     }       
     }
      echo "problem4";
     
}

      
    
public function updateClass($classid,$building,$room,$year,$semester,$timeperiod, $section, $day1, $day2, $capacity, $professor)
{      
        $conn1 = Database::connect(); 
        $conn2 = Database::connect(); 
        $conn3 = Database::connect(); 
         
     $sql="SELECT *FROM  Faculty_Classes NATURAL JOIN Class WHERE faculty_id=".$professor." AND semester='".$semester."' AND YEAR = ".$year."";
    
     $result=$conn1->query($sql);
    
     if($result->num_rows<4)
     {     
        $sql = "SELECT timeslot_id FROM Timeslot WHERE time_period=? AND  day1=? AND day2=?";
        $statement1 = $conn1->prepare($sql);
        $statement1->bind_param("iss",$timeperiod,$day1,$day2);
        $statement1->execute();
        $statement1->bind_result($timeslot);  //timeslot is the object where result is sent 
        $statement1->fetch();   
       // var_dump($timeslot);
        
    
             
        $sql = "UPDATE Faculty_Classes SET faculty_id=? WHERE class_id=?";
        $statement2 = $conn2->prepare($sql);
        $statement2->bind_param("ii", $professor, $classid);
        $statement2->execute(); 
    
            
        $sql = "UPDATE Class SET section=?, timeslot_id=?, room_number=?, building_name=?, semester=?, year=?, class_capacity=? WHERE class_id=?";
        $statement3 = $conn3->prepare($sql);
        $statement3->bind_param("siissiii", $section, $timeslot, $room, $building, $semester, $year, $capacity, $classid);
     
    
     if($statement3->execute()){
            
            $conn1->close();
            $conn2->close();
            $conn3->close();
         
            echo "true";
            return;
        }            
        else
        {             
            
            $conn1->close();
            $conn2->close();
            $conn3->close();
                
        }
     }
    
    echo "problem4";
        
    
      
}
       
public function getAllClasses(){
       
        $conn = Database::connect();
        $statement = "SELECT user_id, user_fname, user_lname, credits, class_id, course_id, course_description, department, section, room_number, room_capacity, building_name, semester, YEAR, course_name, day1, day2, TIME_FORMAT( start_time,  '%h:%i %p' ) AS start_time, TIME_FORMAT( end_time,  '%h:%i %p') AS end_time, time_period, class_capacity - count_registered AS seats_available
        FROM Class
        NATURAL JOIN Course
        NATURAL JOIN Timeslot
        NATURAL JOIN Timeperiod
        NATURAL JOIN Room
        NATURAL JOIN Faculty_Classes
        INNER JOIN User ON User.user_id = Faculty_Classes.faculty_id
        WHERE 1";
        $result = $conn->query($statement);
        $arr = [];
        while ($row = $result->fetch_assoc()){
            array_push($arr, $row);
        }
        $conn->close(); 
        return $arr;   
}
    
public function getClassesTaught($id, $semester, $year){
        $conn = Database::connect();
        $statement = "SELECT * 
                        FROM Class
                        NATURAL JOIN Course
                        NATURAL JOIN Timeslot
                        NATURAL JOIN Timeperiod
                        NATURAL JOIN Room
                        NATURAL JOIN Faculty_Classes
                        WHERE faculty_id =".$id." AND semester='".$semester."' AND year=".$year." ORDER BY class_id ASC";
        $result = $conn->query($statement);
        $arr = [];
        while ($row = $result->fetch_assoc()){
            array_push($arr, $row);
        }
        $conn->close(); 
        return $arr;   
}
    
public function getAllStudentsInClass($cid) {
    $conn = Database::connect();
        $statement = "SELECT * 
                    FROM User
                    NATURAL JOIN Enrollment
                    WHERE class_id = ".$cid."
                    AND User.user_id = Enrollment.student_id  ORDER BY user_id ASC";
        $result = $conn->query($statement);
        $arr = [];
        while ($row = $result->fetch_assoc()){
            array_push($arr, $row);
        }
        $conn->close(); 
        return $arr;   
}
    
public function deleteCourse($crn){
    
        $conn = Database::connect();
             
        $sql = "DELETE FROM Course WHERE course_id=?";
        $statement = $conn->prepare($sql);
        $statement->bind_param("",$crn);
        if($statement->execute()){
            return true;
        }            
        else
        {            
            return false;
        }
       $conn->close();
    
}

    
}


?>