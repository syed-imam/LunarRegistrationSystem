<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

date_default_timezone_set('America/New_York');
include_once "files.php";

class Student extends User {
    
    function addStudent($firstname, $lastname, $email, $password, $phonenumber, $streetaddress, $city, $state, $zipcode, $gender, $birthday, $major, $minor, $faculty){  
        $type = "s";
        $conn = Database::connect();
        
        // Fix the date
        $bday = strtotime($birthday);
        $birthday = date('y-m-d', $bday);
        
        // Insertion with transaction
        $conn->begin_transaction();
        $conn->autocommit(FALSE);
        
        // Part 1 - Insert to User
        $statement1 = "INSERT INTO User (user_fname, user_lname, user_phone, user_street, user_city, user_zipcode, user_state, user_type, user_email, user_password, user_gender, user_birthday) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
        $stmt1 = $conn->prepare($statement1);
        $stmt1->bind_param("ssssssssssss", $firstname, $lastname, $phonenumber, $streetaddress, $city, $zipcode, $state, $type, $email, $password, $gender, $birthday);
        $stmt1->execute();
        $iddd = $conn->insert_id;
        // Part 2 - Insert to Student
        $statement2 = "INSERT INTO Student (student_id, student_advisor) VALUES (".$iddd.", ".$faculty.")";   //gives me the inserted id of last query
        $conn->query($statement2);
        

        if($major != ""){
			$statement3 = "INSERT INTO Student_Major (student_id, major_name) VALUES (".$iddd.", '".$major."')";
        	$conn->query($statement3);
		}

        
        if($minor != ""){
            $statement4 = "INSERT INTO Student_Minor (student_id, minor_name) VALUES (".$iddd.", '".$minor."')";
            $conn->query($statement4);        
        }

        // Commit both at once
        if($conn->commit())
             return true;
        else
             return false;
    }
    
    function getAllStudents() {
        $conn = Database::connect();
            $statement = "
                    SELECT * 
                    FROM User
                    LEFT JOIN Student ON Student.student_id = user_id
                    LEFT JOIN Faculty ON Faculty.faculty_id = user_id
                    LEFT JOIN Student_Major ON Student_Major.student_id = user_id
                    LEFT JOIN Student_Minor ON Student_Minor.student_id = user_id
                "; 
        //we used left join coz we had to get all the unmatched from left and 
        //matched from the right!!
        $result = $conn->query($statement);
        $arr = [];
        while ($row = $result->fetch_assoc()){
            array_push($arr, $row);
        }
        return $arr;
    }
    
    function getStudentById($id) {
        $conn = Database::connect();
        $sql = "SELECT * FROM Student JOIN User ON student_id = user_id WHERE student_id = ".$id;
        $result = $conn->query($sql);
        
        $sql2 = "SELECT * FROM Student_Hold NATURAL JOIN Hold NATURAL JOIN Student_Major WHERE student_id = ".$id;
        $result2 = $conn->query($sql2);

        $arr = [];
        if ($result->num_rows > 0) {
             // output data of each row
             while($row = $result->fetch_assoc()) {
                 array_push($arr, $row);
             }

            while($row2 = $result2->fetch_assoc()) {
                 array_push($arr, $row2);
             }
            return $arr;
        }
        else {
             return 0;
        }
    }
	
    function getStudentHolds($id) {
        $conn = Database::connect();

        $sql = "SELECT * 
                FROM Student_Hold
                NATURAL JOIN Hold
                WHERE student_id = ".$id;
        $result = $conn->query($sql);

        $arr = [];
        if ($result->num_rows > 0) {
             while($row = $result->fetch_assoc()) {
                 array_push($arr, $row);
             }
            return $arr;
        } else {
             return 0;
        }
    }
    
    function updateStudent($id, $firstname, $lastname, $email, $password, $phonenumber, $streetaddress, $city, $state, $zipcode, $gender, $birthday, $hold, $major, $minor, $faculty){
      
        
       // echo "ID ".$id;
        
       
        $type = "s";
        $conn = Database::connect();
        
        // Fix the date
        $bday = strtotime($birthday);
        $birthday = date('y-m-d', $bday);
        
        // Insertion with transaction
        $conn->begin_transaction();
        $conn->autocommit(FALSE);
        
        // Part 1 - Insert to User
        $statement1 = "UPDATE User SET user_fname = ?, user_lname = ?, user_phone = ?, user_street = ?, user_city = ?, user_zipcode = ?, user_state = ?, user_type = ?, user_email = ?, user_password = ?, user_gender = ?, user_birthday = ? WHERE user_id = ?";
        $stmt1 = $conn->prepare($statement1);
        $stmt1->bind_param("ssssssssssssi", $firstname, $lastname, $phonenumber, $streetaddress, $city, $zipcode, $state, $type, $email, $password, $gender, $birthday, $id);
        $stmt1->execute();
        
		
		$statementsa = "Update Student SET student_advisor=? WHERE student_id=?";
        $stmtsa = $conn->prepare($statementsa);
        $stmtsa->bind_param("ii", $faculty, $id);
        $stmtsa->execute(); 
        
        // Commit both at once
        $sql2="DELETE FROM Student_Hold WHERE student_id=?";
        $stmt2 = $conn->prepare($sql2);
        $stmt2->bind_param("i", $id);
        $stmt2->execute();
		
		 $sqlsm = "SELECT * 
                FROM Student_Major
                WHERE student_id = ".$id;
        $resultsm = $conn->query($sqlsm);


        if ($resultsm->num_rows > 0) {
        
         if($major != ""){
			$sql3="UPDATE Student_Major SET major_name = ? WHERE student_id = ?";
        $stmt4 = $conn->prepare($sql3);
        $stmt4->bind_param("si", $major, $id);
        $stmt4->execute();
		 }
			
		}
		
		else{
			
			 if($major != ""){
			$statementsm = "INSERT INTO Student_Major (student_id, major_name) VALUES (".$id.", '".$major."')";
        	$conn->query($statementsm);
		}
			
		}
        
		
		 $sqlsmi = "SELECT * 
                FROM Student_Minor
                WHERE student_id = ".$id;
        
		$resultsmi = $conn->query($sqlsmi);
		
		if ($resultsmi->num_rows > 0) {
        

			 if($minor != ""){
            $sql4="UPDATE Student_Minor SET minor_name = ? WHERE student_id = ?";
            $stmt5 = $conn->prepare($sql4);
            $stmt5->bind_param("si", $minor, $id);
            $stmt5->execute();
				 }
			
		}
		
		else{
			
			 if($minor != ""){
			$statementsmi = "INSERT INTO Student_Minor (student_id, minor_name) VALUES (".$id.", '".$minor."')";
        	$conn->query($statementsmi);
		}
			
		}
		
	
        
        for($i=0;$i<sizeof($hold);$i++){
            $sql3 = "INSERT INTO Student_Hold VALUES(?,?)";
            $stmt3 = $conn->prepare($sql3);
            $stmt3->bind_param("ii",$id, $hold[$i]);
            $stmt3->execute();        
        }
        
        if($conn->commit())        
             return true;   
         else
             return false;
        
        /*    
    */
    //  return true;  
            
    }
    
    function deleteStudent($id){
        $conn = Database::connect();
        
        // Insertion with transaction
        $conn->begin_transaction();
        $conn->autocommit(FALSE);
        
        // Part 1 - Delete from student
        $statement1 = "DELETE FROM Student WHERE student_id = ?";
        $stmt1 = $conn->prepare($statement1);
        $stmt1->bind_param("i", $id);
        $stmt1->execute();
        
        // Part 2 - Delete from user
        $statement2 = "DELETE FROM User WHERE user_id = ?";
        $stmt2 = $conn->prepare($statement2);
        $stmt2->bind_param("i", $id);
        $stmt2->execute();
        
        // Commit both at once
        if($conn->commit())
             return true;
        else
             return false;
    }
}

$student = new Student();

?>
