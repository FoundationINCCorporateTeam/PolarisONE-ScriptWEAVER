<?php
/**
 * PolarisONE ScriptWEAVER Contact Form Handler
 * Processes contact form submissions
 */

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Please use POST.'
    ]);
    exit;
}

// Sanitize and validate input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Get form data
$name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$subject = isset($_POST['subject']) ? sanitize_input($_POST['subject']) : '';
$message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Please enter a valid name (at least 2 characters).';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

if (empty($subject) || strlen($subject) < 5) {
    $errors[] = 'Please enter a valid subject (at least 5 characters).';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Please enter a valid message (at least 10 characters).';
}

// Check for validation errors
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed.',
        'errors' => $errors
    ]);
    exit;
}

// Email configuration
$to = 'support@scriptweaver.ai'; // Replace with your actual email
$email_subject = 'ScriptWEAVER Contact Form: ' . $subject;

// Email body
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4; }
        .header { background: linear-gradient(135deg, #06b6d4, #a855f7); color: white; padding: 20px; text-align: center; }
        .content { background: white; padding: 30px; margin-top: 20px; }
        .label { font-weight: bold; color: #06b6d4; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🚀 PolarisONE ScriptWEAVER</h1>
            <p>New Contact Form Submission</p>
        </div>
        <div class='content'>
            <p><span class='label'>Name:</span><br>{$name}</p>
            <p><span class='label'>Email:</span><br>{$email}</p>
            <p><span class='label'>Subject:</span><br>{$subject}</p>
            <p><span class='label'>Message:</span><br>{$message}</p>
        </div>
        <div class='footer'>
            <p>This email was sent from the ScriptWEAVER contact form.</p>
            <p>&copy; 2024 PolarisONE ScriptWEAVER. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: ScriptWEAVER <noreply@scriptweaver.ai>" . "\r\n";
$headers .= "Reply-To: {$email}" . "\r\n";

// Attempt to send email
$mail_sent = mail($to, $email_subject, $email_body, $headers);

if ($mail_sent) {
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for contacting us! We will get back to you soon.'
    ]);
    
    // Optional: Log submission to database or file
    $log_entry = date('Y-m-d H:i:s') . " - Name: {$name}, Email: {$email}, Subject: {$subject}\n";
    file_put_contents('contact_log.txt', $log_entry, FILE_APPEND);
    
} else {
    // Error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again later or contact us directly.'
    ]);
}

exit;
?>
