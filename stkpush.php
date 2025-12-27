<?php
header("Content-Type: application/json");

// Read JSON sent from JavaScript
$data = json_decode(file_get_contents("php://input"), true);

$phone = $data['phone'];
$items = $data['items'];

// Calculate total
$total = 0;
foreach ($items as $item) {
    $total += $item['price'];
}

// TEMP response (we'll add M-Pesa next)
echo json_encode([
    "status" => "success",
    "message" => "Order received. Total is Ksh $total"
]);

$consumerKey = "YOUR_CONSUMER_KEY";
$consumerSecret = "YOUR_CONSUMER_SECRET";

$credentials = base64_encode("$consumerKey:$consumerSecret");

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials");
curl_setopt($curl, CURLOPT_HTTPHEADER, ["Authorization: Basic $credentials"]);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);
$result = json_decode($response);

$accessToken = $result->access_token;

$timestamp = date("YmdHis");
$password = base64_encode($shortcode . $passkey . $timestamp);

$requestData = [
    "BusinessShortCode" => $shortcode,
    "Password" => $password,
    "Timestamp" => $timestamp,
    "TransactionType" => "CustomerPayBillOnline",
    "Amount" => $total,
    "PartyA" => $phone,
    "PartyB" => $shortcode,
    "PhoneNumber" => $phone,
    "CallBackURL" => "https://yourdomain.com/php/callback.php",
    "AccountReference" => "PicassoRestaurant",
    "TransactionDesc" => "Food Order Payment"
];
