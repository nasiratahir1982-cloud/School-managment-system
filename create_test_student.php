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
$enrollments_table = $wpdb->prefix . 'boa_student_course_enrollments';
$courses_table = $wpdb->prefix . 'boa_courses';
$fees_table = $wpdb->prefix . 'boa_fees';

// Create students table if it doesn't exist
$create_students_table = "CREATE TABLE IF NOT EXISTS $student_table (
    id int(11) NOT NULL AUTO_INCREMENT,
    user_id int(11) NOT NULL,
    student_id varchar(50) NOT NULL,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    email varchar(100) NOT NULL,
    phone varchar(20) DEFAULT NULL,
    date_of_birth date DEFAULT NULL,
    address text DEFAULT NULL,
    emergency_contact varchar(200) DEFAULT NULL,
    parent_name varchar(200) DEFAULT NULL,
    parent_phone varchar(20) DEFAULT NULL,
    admission_date datetime DEFAULT CURRENT_TIMESTAMP,
    status enum('active','inactive','graduated','dropped') DEFAULT 'active',
    notes text DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY user_id (user_id)
);";

$result = $wpdb->query($create_students_table);
if ($result !== false) {
    echo "<p>✅ Students table ready</p>";
} else {
    echo "<p>❌ Error creating students table: " . $wpdb->last_error . "</p>";
}

// Create courses table if needed
$create_courses_table = "CREATE TABLE IF NOT EXISTS $courses_table (
    id int(11) NOT NULL AUTO_INCREMENT,
    course_name varchar(200) NOT NULL,
    course_code varchar(50) NOT NULL,
    course_duration varchar(50) NOT NULL,
    fee_structure decimal(10,2) NOT NULL,
    description text DEFAULT NULL,
    prerequisites text DEFAULT NULL,
    max_students int(11) DEFAULT NULL,
    status enum('active','inactive') DEFAULT 'active',
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);";

$result = $wpdb->query($create_courses_table);
if ($result !== false) {
    echo "<p>✅ Courses table ready</p>";
} else {
    echo "<p>❌ Error creating courses table: " . $wpdb->last_error . "</p>";
}

// Create enrollments table if needed
$create_enrollments_table = "CREATE TABLE IF NOT EXISTS $enrollments_table (
    id int(11) NOT NULL AUTO_INCREMENT,
    student_id int(11) NOT NULL,
    course_id int(11) NOT NULL,
    enrollment_date datetime DEFAULT CURRENT_TIMESTAMP,
    status enum('active','completed','dropped','pending') DEFAULT 'active',
    completion_date datetime DEFAULT NULL,
    final_grade varchar(5) DEFAULT NULL,
    notes text DEFAULT NULL,
    PRIMARY KEY (id)
);";

$result = $wpdb->query($create_enrollments_table);
if ($result !== false) {
    echo "<p>✅ Enrollments table ready</p>";
} else {
    echo "<p>❌ Error creating enrollments table: " . $wpdb->last_error . "</p>";
}

// Create fees table if needed
$create_fees_table = "CREATE TABLE IF NOT EXISTS $fees_table (
    id int(11) NOT NULL AUTO_INCREMENT,
    student_id int(11) NOT NULL,
    course_id int(11) DEFAULT NULL,
    fee_type varchar(100) NOT NULL,
    amount decimal(10,2) NOT NULL,
    amount_paid decimal(10,2) DEFAULT 0.00,
    due_date date NOT NULL,
    payment_date date DEFAULT NULL,
    payment_status enum('pending','partial','paid','overdue') DEFAULT 'pending',
    payment_method varchar(50) DEFAULT NULL,
    transaction_id varchar(100) DEFAULT NULL,
    notes text DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);";

$result = $wpdb->query($create_fees_table);
if ($result !== false) {
    echo "<p>✅ Fees table ready</p>";
} else {
    echo "<p>❌ Error creating fees table: " . $wpdb->last_error . "</p>";
}

// Check if student record already exists
$existing_student = $wpdb->get_var($wpdb->prepare(
    "SELECT id FROM $student_table WHERE user_id = %d",
    $current_user->ID
));

if ($existing_student) {
    echo "<p>✅ Student record already exists (ID: $existing_student)</p>";
} else {
    // Create student record
    $student_data = array(
        'user_id' => $current_user->ID,
        'student_id' => 'STU' . $current_user->ID . time(),
        'first_name' => 'Test',
        'last_name' => 'Student',
        'email' => $current_user->user_email,
        'phone' => '0300-1234567',
        'admission_date' => current_time('mysql'),
        'status' => 'active'
    );

    $result = $wpdb->insert($student_table, $student_data);
    if ($result !== false) {
        $student_id = $wpdb->insert_id;
        echo "<p>✅ Student record created successfully (ID: $student_id)</p>";
    } else {
        echo "<p>❌ Error creating student record: " . $wpdb->last_error . "</p>";
        exit;
    }
}

// Create a test course if none exists
$existing_course = $wpdb->get_var("SELECT id FROM $courses_table LIMIT 1");
if (!$existing_course) {
    $course_data = array(
        'course_name' => 'Computer Basics',
        'course_code' => 'CB001',
        'course_duration' => '3 Months',
        'fee_structure' => 5000.00,
        'description' => 'Learn basic computer skills',
        'status' => 'active'
    );

    $result = $wpdb->insert($courses_table, $course_data);
    if ($result !== false) {
        $course_id = $wpdb->insert_id;
        echo "<p>✅ Test course created (ID: $course_id)</p>";
    }
}

// Enroll student in course
if (isset($student_id) && isset($course_id)) {
    $existing_enrollment = $wpdb->get_var($wpdb->prepare(
        "SELECT id FROM $enrollments_table WHERE student_id = %d AND course_id = %d",
        $student_id, $course_id
    ));

    if (!$existing_enrollment) {
        $enrollment_data = array(
            'student_id' => $student_id,
            'course_id' => $course_id,
            'enrollment_date' => current_time('mysql'),
            'status' => 'active'
        );

        $result = $wpdb->insert($enrollments_table, $enrollment_data);
        if ($result !== false) {
            echo "<p>✅ Student enrolled in course</p>";
        }
    } else {
        echo "<p>✅ Student already enrolled in course</p>";
    }
}

// Create test fee record
if (isset($student_id)) {
    $existing_fee = $wpdb->get_var($wpdb->prepare(
        "SELECT id FROM $fees_table WHERE student_id = %d",
        $student_id
    ));

    if (!$existing_fee) {
        $fee_data = array(
            'student_id' => $student_id,
            'fee_type' => 'Course Fee',
            'amount' => 5000.00,
            'amount_paid' => 2000.00,
            'due_date' => date('Y-m-d', strtotime('+30 days')),
            'payment_status' => 'partial'
        );

        $result = $wpdb->insert($fees_table, $fee_data);
        if ($result !== false) {
            echo "<p>✅ Test fee record created</p>";
        }
    } else {
        echo "<p>✅ Fee record already exists</p>";
    }
}

echo "<h3>✅ Setup Complete!</h3>";
echo "<p>Now refresh your frontend page to see the student dashboard.</p>";
echo "<p><strong>User:</strong> " . $current_user->user_login . "</p>";
echo "<p><strong>Dashboard URL:</strong> <a href='" . home_url('/student-dashboard-page/') . "' target='_blank'>Student Dashboard</a></p>";

?>