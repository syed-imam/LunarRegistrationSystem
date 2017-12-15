<?php
include_once "database.php";
/*
error_reporting(E_ALL);
ini_set('display_errors', 1);
*/
class User {
    // protected $firstName, $lastName, $phoneNumber, $address, $dateCreated, $email, $password, $type;
    public function login($email, $pass) {
    
        $conn = Database::connect();
        $sql = "SELECT user_fname, user_lname, user_id, user_type FROM mydb.User where user_email='$email' && user_password='$pass'";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();  
        }  
        else {
            return false;
        }
    }
    
    public function logout() {
        // End session
    }
    
    public function addUser($firstname, $lastname, $email, $password, $phonenumber, $streetaddress, $city, $state, $zipcode, $gender, $birthday){
        $type = "s";
        $conn = Database::connect();
        
        $conn->begin_transaction();
        $conn->autocommit(FALSE);
        
        $statement1 = "INSERT INTO User (user_fname, user_lname, user_phone, user_street, user_city, user_zipcode, user_state, user_type, user_email, user_password, user_gender, user_birthday) 
                       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
        
        // Fix the date
        $bday = strtotime($birthday);
        $birthday = date('y-m-d', $bday);
        
        $stmt1 = $conn->prepare($statement1);
        $stmt1->bind_param("ssssssssssss", $firstname, $lastname, $phonenumber, $streetaddress, $city, $zipcode, $state, $type, $email, $password, $gender, $birthday);
        
        $stmt1->execute();

        
        $statement2 = "INSERT INTO Student (student_id) VALUES (".$conn->insert_id.")";   //gives me the inserted id of last query
        $conn->query($statement2);
 
        if($conn->commit())
             return true;
        else
             return false;

    }
}

$user = new User();

?>