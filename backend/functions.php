<?php

include_once "files.php";

if($_POST["f"] == "login"){
    echo "here";
    
    $username = $_POST["username"];
    $password = $_POST["password"];
    
    if($user->login($username, $password)){
        echo "true"; 
    } else {
        echo "false";
    }
}

?>