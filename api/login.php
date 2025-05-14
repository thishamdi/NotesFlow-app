<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include database and model files
include_once '../config/database.php';
include_once '../models/User.php';
include_once '../utils/api_response.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Create user object
$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Check if data is complete
if(
    empty($data->email) ||
    empty($data->password)
){
    sendResponse(false, "Incomplete data. Email and password are required.");
}

// Set user property values
$user->email = $data->email;
$user->password = $data->password;

// Attempt to login
if($user->login()){
    // Create user data for response
    $user_data = array(
        "id" => $user->id,
        "name" => $user->name,
        "email" => $user->email
    );
    
    sendResponse(true, "Login successful.", $user_data);
}
else{
    sendResponse(false, "Invalid email or password.");
}
?>
