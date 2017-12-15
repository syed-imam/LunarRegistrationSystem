<?php
include_once "user.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    // This is for php to understand angular http service...
    // Angular http service works //with application/json header not be url encoded header 
    $_POST = json_decode(file_get_contents('php://input'), true);  
} 

extract($_POST);

$loginID = 0;

if($loginInfo = $user->login($username, $password)){
    $loginID = 1234;
    echo json_encode($loginInfo); 
} else {
    echo "false";
}

?>