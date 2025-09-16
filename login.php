<?php
// login.php

require 'db_connect.php';

session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$response = [];

if (empty($data['phone']) || empty($data['password'])) {
    $response = ['status' => 'error', 'message' => 'Phone and password are required.'];
    echo json_encode($response);
    exit;
}

$phone = $data['phone'];
$password = $data['password'];

// Find user by phone number
$stmt = $conn->prepare("SELECT id, password_hash FROM users WHERE phone = ?");
$stmt->bind_param("s", $phone);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Verify the password
    if (password_verify($password, $user['password_hash'])) {
        $response = ['status' => 'success', 'message' => 'Signed in. Redirecting…'];
    } else {
        $response = ['status' => 'error', 'message' => 'Invalid credentials.'];
    }
} else {
    $response = ['status' => 'error', 'message' => 'Invalid credentials.'];
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>