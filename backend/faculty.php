<?php
include_once "files.php";

class Faculty extends User {

    function addFaculty($firstname, $lastname, $email, $password, $phonenumber, $streetaddress, $city, $state, $zipcode, $gender, $birthday, $department){  
        $type = "f";
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
        
        // Part 2 - Insert to Faculty
        $statement2 = "INSERT INTO Faculty (faculty_id, department_name) VALUES (".$conn->insert_id.", '".$department."')";   //gives me the inserted id of last query
        $conn->query($statement2);
        
        // Commit both at once
        if($conn->commit())
             return true;
        else
             return false;

    }
    
    function getAllFaculty() {
        $conn = Database::connect();
        $statement = "SELECT * FROM Faculty JOIN User ON faculty_id = user_id";
        $result = $conn->query($statement);
        $arr = [];
        while ($row = $result->fetch_assoc()){
            array_push($arr, $row);
        }
        return $arr;
    }
    
    function getFacultyById($id) {
        $conn = Database::connect();
        $statement = "SELECT * FROM Faculty JOIN User ON faculty_id = user_id WHERE faculty_id = ".$id;
        $result = $conn->query($statement);
        return $result->fetch_assoc();
    }
    
    function updateFaculty($id, $firstname, $lastname, $email, $password, $phonenumber, $streetaddress, $city, $state, $zipcode, $gender, $birthday, $department){
        $type = "f";
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
        
        // Part 2 - Insert to Faculty
        // Will update faculty specific info, but there is none yet.
        $statement2 = "Update Faculty SET department_name = '".$department."' WHERE faculty_id = ".$id."";
        $conn->query($statement2);
        
        // Commit both at once
        if($conn->commit())
             return true;
        else
             return false;
    }
}

$faculty = new Faculty();

?>