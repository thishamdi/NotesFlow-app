<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database and model files
include_once '../../config/database.php';
include_once '../../models/Note.php';
include_once '../../utils/api_response.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Create note object
$note = new Note($db);

// Get posted data - try from JSON body first
$data = json_decode(file_get_contents("php://input"));

// If body is empty or invalid, try to get from URL parameters
if (!$data || (empty($data->id) && empty($data->user_id))) {
    $data = new stdClass();
    $data->id = isset($_GET['id']) ? $_GET['id'] : null;
    $data->user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;
}

// Check if data is complete
if (empty($data->id) || empty($data->user_id)) {
    sendResponse(false, "Incomplete data. ID and user ID are required.");
    exit;
}

// Set note property values
$note->id = $data->id;
$note->user_id = $data->user_id;

// Delete note
if ($note->delete()) {
    sendResponse(true, "Note deleted successfully.");
} else {
    sendResponse(false, "Unable to delete note.");
}
?>
