<?php

/**
 * Script untuk test koneksi database PostgreSQL Supabase
 */

echo "=== Testing Database Connection ===\n\n";

// Load environment variables dari .env
if (file_exists(__DIR__ . '/.env')) {
    $envFile = file_get_contents(__DIR__ . '/.env');
    $lines = explode("\n", $envFile);
    
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) {
            continue;
        }
        
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            // Remove quotes if present
            $value = trim($value, '"\'');
            putenv("$key=$value");
        }
    }
}

// Ambil credentials dari environment
$host = getenv('DB_HOST');
$port = getenv('DB_PORT');
$database = getenv('DB_DATABASE');
$username = getenv('DB_USERNAME');
$password = getenv('DB_PASSWORD');
$sslmode = getenv('DB_SSLMODE') ?: 'require';

echo "Testing with configuration:\n";
echo "Host: $host\n";
echo "Port: $port\n";
echo "Database: $database\n";
echo "Username: $username\n";
echo "Password: " . str_repeat('*', strlen($password)) . "\n";
echo "SSL Mode: $sslmode\n\n";

// Test DNS Resolution
echo "Step 1: Testing DNS Resolution...\n";
$ip = gethostbyname($host);
if ($ip === $host) {
    echo "❌ FAILED: Cannot resolve hostname '$host'\n";
    echo "   This might be a DNS issue.\n\n";
} else {
    echo "SUCCESS: Hostname resolved to $ip\n\n";
}

// Test Port Connection
echo "Step 2: Testing Port Connection...\n";
$connection = @fsockopen($host, $port, $errno, $errstr, 10);
if (!$connection) {
    echo "FAILED: Cannot connect to $host:$port\n";
    echo "   Error: $errstr ($errno)\n\n";
} else {
    echo "SUCCESS: Port $port is reachable\n";
    fclose($connection);
    echo "\n";
}

// Test PostgreSQL Connection
echo "Step 3: Testing PostgreSQL Connection...\n";
try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$database;sslmode=$sslmode";
    echo "Connection string: $dsn\n";
    
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 10,
    ]);
    
    echo "SUCCESS: Connected to PostgreSQL!\n\n";
    
    // Test query
    echo "Step 4: Testing Query Execution...\n";
    $stmt = $pdo->query('SELECT version()');
    $version = $stmt->fetchColumn();
    echo "SUCCESS: Query executed\n";
    echo "PostgreSQL Version: $version\n\n";
    
    // Test table query
    echo "Step 5: Testing Schema Access...\n";
    $stmt = $pdo->query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'");
    $count = $stmt->fetchColumn();
    echo "SUCCESS: Found $count tables in public schema\n\n";
    
    echo "=================================\n";
    echo "ALL TESTS PASSED!\n";
    echo "Database connection is working perfectly.\n";
    echo "=================================\n";
    
} catch (PDOException $e) {
    echo "FAILED: Cannot connect to database\n";
    echo "Error: " . $e->getMessage() . "\n\n";
    
    // Suggestions based on error
    $errorMsg = $e->getMessage();
    echo "=== Troubleshooting Suggestions ===\n";
    
    if (strpos($errorMsg, 'could not translate host name') !== false) {
        echo "• DNS Resolution Issue:\n";
        echo "  - Check your internet connection\n";
        echo "  - Try using Google DNS (8.8.8.8, 8.8.4.4)\n";
        echo "  - Flush DNS cache: ipconfig /flushdns\n";
        echo "  - Try using IP address instead of hostname\n\n";
    }
    
    if (strpos($errorMsg, 'Tenant or user not found') !== false) {
        echo "• Authentication Issue:\n";
        echo "  - Verify username format (should be 'postgres' for direct connection)\n";
        echo "  - Check if using correct pooler vs direct connection\n";
        echo "  - Verify password in Supabase dashboard\n\n";
    }
    
    if (strpos($errorMsg, 'Connection refused') !== false || strpos($errorMsg, 'timeout') !== false) {
        echo "• Network Issue:\n";
        echo "  - Check firewall settings\n";
        echo "  - Verify port number (5432 for direct, 6543 for pooler)\n";
        echo "  - Check if your IP is whitelisted in Supabase\n\n";
    }
    
    if (strpos($errorMsg, 'authentication failed') !== false) {
        echo "• Password Issue:\n";
        echo "  - Verify password is correct\n";
        echo "  - Check for special characters in password\n";
        echo "  - Try resetting password in Supabase dashboard\n\n";
    }
    
    echo "=================================\n";
    exit(1);
}
