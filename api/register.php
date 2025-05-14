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
    empty($data->name) ||
    empty($data->email) ||
    empty($data->password)
){
    sendResponse(false, "Incomplete data. Name, email, and password are required.");
}

// Set user property values
$user->name = $data->name;
$user->email = $data->email;
$user->password = $data->password;

// Check if email already exists
if($user->emailExists()){
    sendResponse(false, "Email already exists.");
}

// Register the user
if($user_id = $user->register()){
    // Create user data for response
    $user_data = array(
        "id" => $user_id,
        "name" => $user->name,
        "email" => $user->email
    );
    
    sendResponse(true, "User registered successfully.", $user_data);
}
else{
    sendResponse(false, "Unable to register user.");
}
?>
