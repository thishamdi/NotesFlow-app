<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
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

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Check if data is complete
if(
    empty($data->id) ||
    empty($data->user_id) ||
    empty($data->title) ||
    empty($data->content)
){
    sendResponse(false, "Incomplete data. ID, user ID, title, and content are required.");
}

// Set note property values
$note->id = $data->id;
$note->user_id = $data->user_id;
$note->title = $data->title;
$note->content = $data->content;

// Update note
if($note->update()){
    // Create note data for response
    $note_data = array(
        "id" => $note->id,
        "user_id" => $note->user_id,
        "title" => $note->title,
        "content" => $note->content
    );
    
    sendResponse(true, "Note updated successfully.", $note_data);
}
else{
    sendResponse(false, "Unable to update note.");
}
?>
