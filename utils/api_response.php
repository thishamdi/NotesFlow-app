<?php
// Function to return API responses
function sendResponse($success, $message, $data = null) {
    // Set appropriate HTTP status code
    http_response_code($success ? 200 : 400);
    
    // Create response array
    $response = [
        "success" => $success,
        "message" => $message
    ];
    
    // Add data if provided
    if ($data !== null) {
        $response["data"] = $data;
    }
    
    // Return JSON response
    echo json_encode($response);
    exit;
}
?>
