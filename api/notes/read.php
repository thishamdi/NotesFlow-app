<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include database and model files
include_once '../../config/database.php';
include_once '../../models/Note.php';
include_once '../../utils/api_response.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Create note object
$note = new Note($db);

// Check if user_id is provided
if(!isset($_GET['user_id'])){
    sendResponse(false, "User ID is required.");
}

// Set note property values
$note->user_id = $_GET['user_id'];

// Read notes
$stmt = $note->readAllByUser();
$num = $stmt->rowCount();

// Check if any notes found
if($num > 0){
    // Notes array
    $notes_arr = array();
    
    // Retrieve notes
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        
        $note_item = array(
            "id" => $id,
            "title" => $title,
            "content" => $content,
            "created_at" => $created_at,
            "updated_at" => $updated_at
        );
        
        $notes_arr[] = $note_item;
    }
    
    sendResponse(true, "Notes retrieved successfully.", $notes_arr);
}
else{
    sendResponse(true, "No notes found.", []);
}
?>
