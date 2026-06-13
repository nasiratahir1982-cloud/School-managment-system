<?php
/**
 * Create Test Student Record
 * Add this code to your theme's functions.php or create a temporary plugin
 * Run this script once to create test data
 */

// Only run if this file is accessed directly
if (!defined('ABSPATH')) {
    // WordPress functions
    define('ABSPATH', '/var/www/html/');
    require_once('/var/www/html/wp-config.php');
    require_once('/var/www/html/wp-load.php');
}

echo "<h2>Creating Test Student Record...</h2>";

// Get the first user (or specific user)
$users = get_users(array('number' => 1, 'orderby' => 'ID'));
if (empty($users)) {
    echo "<p>No users found. Please create a user first.</p>";
    exit;
}

$current_user = $users[0];
echo "<p>Using user: " . $current_user->user_login . " (ID: " . $current_user->ID . ")</p>";

// Global WordPress database
global $wpdb;

// Check and create tables if needed
$student_table = $wpdb->prefix . 'boa_students';
$courses_table = $wpdb->prefix . 'boa_courses';
$categories_table = $wpdb->prefix . 'boa_categories';
$fees_table = $wpdb->prefix . 'boa_fees';

// Ensure tables are created via plugin database manager
if (class_exists('BOA_DB')) {
    BOA_DB::maybe_create_tables();
    echo "<p>✅ Database tables initialized via Academic Hub DB manager.</p>";
} else {
    echo "<p>❌ Academic Hub DB class not found. Please activate the plugin first.</p>";
    exit;
}

// 1. Resolve or Create Test Category
$category_id = $wpdb->get_var("SELECT category_id FROM $categories_table LIMIT 1");
if (!$category_id) {
    $result = $wpdb->insert($categories_table, array(
        'category_name' => 'Information Technology',
        'status' => 'active'
    ));
    if ($result !== false) {
        $category_id = $wpdb->insert_id;
        echo "<p>✅ Created test category 'Information Technology' (ID: $category_id)</p>";
    } else {
        echo "<p>❌ Error creating category: " . $wpdb->last_error . "</p>";
        exit;
    }
} else {
    echo "<p>✅ Using existing category (ID: $category_id)</p>";
}

// 2. Resolve or Create Test Course
$course_id = $wpdb->get_var("SELECT course_id FROM $courses_table LIMIT 1");
if (!$course_id) {
    $course_data = array(
        'course_name' => 'Computer Basics',
        'category_id' => $category_id,
        'duration' => '3 Months',
        'fee_amount' => 5000.00,
        'description' => 'Learn basic computer skills',
        'status' => 'active',
        'created_at' => current_time('mysql')
    );

    $result = $wpdb->insert($courses_table, $course_data);
    if ($result !== false) {
        $course_id = $wpdb->insert_id;
        echo "<p>✅ Created test course 'Computer Basics' (ID: $course_id)</p>";
    } else {
        echo "<p>❌ Error creating course: " . $wpdb->last_error . "</p>";
        exit;
    }
} else {
    echo "<p>✅ Using existing course (ID: $course_id)</p>";
}

// 3. Resolve or Create Student Record linked to the WP User
$existing_student_id = $wpdb->get_var($wpdb->prepare(
    "SELECT student_id FROM $student_table WHERE user_id = %d",
    $current_user->ID
));

if ($existing_student_id) {
    $student_id = $existing_student_id;
    echo "<p>✅ Student record already exists (ID: $student_id)</p>";
} else {
    // Generate unique student UID
    $student_uid = 'BOA-' . (1000 + $current_user->ID);
    
    $student_data = array(
        'user_id' => $current_user->ID,
        'student_uid' => $student_uid,
        'name' => $current_user->display_name ?: $current_user->user_login,
        'email' => $current_user->user_email,
        'phone' => '0300-1234567',
        'course_id' => $course_id,
        'admission_date' => current_time('mysql'),
        'status' => 'active',
        'created_at' => current_time('mysql')
    );

    $result = $wpdb->insert($student_table, $student_data);
    if ($result !== false) {
        $student_id = $wpdb->insert_id;
        echo "<p>✅ Student record created successfully (ID: $student_id, UID: $student_uid)</p>";
    } else {
        echo "<p>❌ Error creating student record: " . $wpdb->last_error . "</p>";
        exit;
    }
}

// 4. Resolve or Create Test Fee Record
if (isset($student_id)) {
    $existing_fee_id = $wpdb->get_var($wpdb->prepare(
        "SELECT fee_id FROM $fees_table WHERE student_id = %d AND course_id = %d",
        $student_id, $course_id
    ));

    if ($existing_fee_id) {
        echo "<p>✅ Fee record already exists (ID: $existing_fee_id)</p>";
    } else {
        $fee_data = array(
            'student_id' => $student_id,
            'course_id' => $course_id,
            'invoice_id' => 'INV-' . date('Ymd') . '-' . $student_id,
            'amount_due' => 5000.00,
            'amount_paid' => 2000.00,
            'due_date' => date('Y-m-d', strtotime('+30 days')),
            'status' => 'pending',
            'created_at' => current_time('mysql')
        );

        $result = $wpdb->insert($fees_table, $fee_data);
        if ($result !== false) {
            $fee_id = $wpdb->insert_id;
            echo "<p>✅ Test fee record created (ID: $fee_id)</p>";
        } else {
            echo "<p>❌ Error creating fee record: " . $wpdb->last_error . "</p>";
        }
    }
}

echo "<h3>✅ Setup Complete!</h3>";
echo "<p>Now refresh your frontend page to see the student dashboard.</p>";
echo "<p><strong>User:</strong> " . $current_user->user_login . "</p>";
echo "<p><strong>Dashboard URL:</strong> <a href='" . home_url('/student-dashboard-page/') . "' target='_blank'>Student Dashboard</a></p>";
?>