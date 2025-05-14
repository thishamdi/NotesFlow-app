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

// Check if required parameters are provided
if(!isset($_GET['id']) || !isset($_GET['user_id'])){
    sendResponse(false, "Note ID and user ID are required.");
}

// Set note property values
$note->id = $_GET['id'];
$note->user_id = $_GET['user_id'];

// Read note
if($note->readOne()){
    // Create note data for response
    $note_data = array(
        "id" => $note->id,
        "title" => $note->title,
        "content" => $note->content,
        "created_at" => $note->created_at,
        "updated_at" => $note->updated_at
    );
    
    sendResponse(true, "Note retrieved successfully.", $note_data);
}
else{
    sendResponse(false, "Note not found.");
}
?>
