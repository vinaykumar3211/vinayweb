<?php
// register.php

require 'db_connect.php';

// Set the content type to JSON
header('Content-Type: application/json');

// Get the posted data.
$data = json_decode(file_get_contents('php://input'), true);

$response = [];

// Basic validation
if (empty($data['name']) || empty($data['phone']) || empty($data['password'])) {
    $response = ['status' => 'error', 'message' => 'All fields are required.'];
    echo json_encode($response);
    exit;
}

$name = $data['name'];
$phone = $data['phone'];
$password = $data['password'];

// Check if user already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE phone = ?");
$stmt->bind_param("s", $phone);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $response = ['status' => 'error', 'message' => 'A user with this phone number already exists.'];
} else {
    // Hash the password securely
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Insert the new user
    $stmt = $conn->prepare("INSERT INTO users (full_name, phone, password_hash) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $phone, $passwordHash);

    if ($stmt->execute()) {
        $response = ['status' => 'success', 'message' => 'Account created. Check SMS/email to verify.'];
    } else {
        $response = ['status' => 'error', 'message' => 'Server error, please try again.'];
    }
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>