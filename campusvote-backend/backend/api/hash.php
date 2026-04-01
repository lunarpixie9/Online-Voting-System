<?php
$passwords = [
    'admin1' => 'admin123',        // for Admin User
    'admin2' => 'rewa@ai123',      // for Rewa
];

foreach ($passwords as $label => $pass) {
    echo $label . ': ' . password_hash($pass, PASSWORD_BCRYPT) . '<br>';
}