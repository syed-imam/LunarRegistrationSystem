<?php
include_once "database.php";

class Researcher{    

public function getMajorEnrollmentInfo(){
       
        $conn = Database::connect();
	
		$statement = "SELECT major_name, COUNT( * ) AS  `count` FROM Student_Major GROUP BY major_name";
        $result = $conn->query($statement);
        $arr = [];
        while ($row = $result->fetch_assoc()){
            array_push($arr, $row);
        }
        $conn->close(); 
        return $arr;  
}

public function getMinorEnrollmentInfo(){
       
        $conn = Database::connect();
	
		$statement = "SELECT minor_name, COUNT( * ) AS  `count` FROM Student_Minor GROUP BY minor_name";
        $result = $conn->query($statement);
        $arr = [];
        while ($row = $result->fetch_assoc()){
            array_push($arr, $row);
        }
        $conn->close(); 
        return $arr;  
}

public function getCourseEnrollmentInfo(){
       
        $conn = Database::connect();
	
		$statement = "SELECT course_id, course_name, CONCAT( semester,  ' ', YEAR ) AS  'Term', SUM( count_registered ) AS  'Total' FROM Class NATURAL JOIN Course GROUP BY course_name, semester, YEAR ORDER BY semester AND YEAR";
	
		$result = $conn->query($statement);

		if ($result->num_rows > 0) {
			$arr = array();
    		while ($row = $result->fetch_assoc()) {
        		if (isset($arr[$row['Term']])) {
            		array_push($arr[$row['Term']], $row);
        		} else {
            		$arr[$row['Term']] = array();
            		array_push($arr[$row['Term']], $row);
        		}
    		}
		}
	    return $arr; 
}

public function getCourseGradeAverageInfo(){
       
        $conn = Database::connect();
	
		$statement = "SELECT course_id, course_name, CONCAT( semester,  ' ', YEAR ) AS  'Term', SUM( enrol_grade ) / COUNT(enrol_grade ) AS  'Average' FROM Enrollment NATURAL JOIN Class NATURAL JOIN Course GROUP BY course_name, semester, YEAR ORDER BY semester AND YEAR";
	
		$result = $conn->query($statement);

		if ($result->num_rows > 0) {
			$arr = array();
    		while ($row = $result->fetch_assoc()) {
        		if (isset($arr[$row['Term']])) {
            		array_push($arr[$row['Term']], $row);
        		} else {
            		$arr[$row['Term']] = array();
            		array_push($arr[$row['Term']], $row);
        		}
    		}
		}
	    return $arr; 
}
}

?>
