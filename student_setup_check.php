<?php
/**
 * Simple script to create student record for current user
 * Add this to your WordPress theme's functions.php file temporarily
 * OR create a simple page template with this code
 */

echo "<h2>Student Dashboard Setup</h2>";

// Check if user is logged in
if (!is_user_logged_in()) {
    echo "<p>Please <a href='" . wp_login_url() . "'>log in</a> first to create student record.</p>";
    exit;
}

$current_user = wp_get_current_user();
echo "<p>Welcome, <strong>" . $current_user->user_login . "</strong> (ID: " . $current_user->ID . ")</p>";

global $wpdb;
$student_table = $wpdb->prefix . 'boa_students';

// Check if student record exists
$existing_student = $wpdb->get_var($wpdb->prepare(
    "SELECT id FROM $student_table WHERE user_id = %d",
    $current_user->ID
));

if ($existing_student) {
    echo "<p>✅ <strong>Student record already exists!</strong></p>";
    echo "<p>Student ID: " . $existing_student . "</p>";
    echo "<p><a href='" . home_url('/your-dashboard-page/') . "' target='_blank'>View Student Dashboard</a></p>";
} else {
    echo "<p>❌ <strong>No student record found.</strong></p>";
    
    // Create student record
    $student_data = array(
        'user_id' => $current_user->ID,
        'student_id' => 'STU' . $current_user->ID . date('Y'),
        'first_name' => 'Student',
        'last_name' => $current_user->user_login,
        'email' => $current_user->user_email,
        'phone' => '',
        'admission_date' => current_time('mysql'),
        'status' => 'active'
    );
    
    $result = $wpdb->insert($student_table, $student_data);
    
    if ($result !== false) {
        $student_id = $wpdb->insert_id;
        echo "<p>✅ <strong>Student record created successfully!</strong></p>";
        echo "<p>Student ID: " . $student_id . "</p>";
        echo "<p><a href='" . home_url('/your-dashboard-page/') . "' target='_blank'>View Student Dashboard</a></p>";
    } else {
        echo "<p>❌ Error creating student record: " . $wpdb->last_error . "</p>";
    }
}

// Show database table info
$tables_exist = $wpdb->get_var("SHOW TABLES LIKE '$student_table'") == $student_table;
if ($tables_exist) {
    echo "<p>✅ Database table exists: " . $student_table . "</p>";
} else {
    echo "<p>❌ Database table missing: " . $student_table . "</p>";
    echo "<p><strong>Solution:</strong> Please deactivate and reactivate the Academic Hub plugin from WordPress admin.</p>";
}

?>