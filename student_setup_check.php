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
$courses_table = $wpdb->prefix . 'boa_courses';
$categories_table = $wpdb->prefix . 'boa_categories';

// Show database table info
$tables_exist = $wpdb->get_var("SHOW TABLES LIKE '$student_table'") == $student_table;
if ($tables_exist) {
    echo "<p>✅ Database table exists: " . $student_table . "</p>";
} else {
    echo "<p>❌ Database table missing: " . $student_table . "</p>";
    echo "<p><strong>Solution:</strong> Please deactivate and reactivate the Academic Hub plugin from WordPress admin.</p>";
    exit;
}

// Check if student record exists
$existing_student_id = $wpdb->get_var($wpdb->prepare(
    "SELECT student_id FROM $student_table WHERE user_id = %d",
    $current_user->ID
));

if ($existing_student_id) {
    echo "<p>✅ <strong>Student record already exists!</strong></p>";
    echo "<p>Student ID: " . $existing_student_id . "</p>";
    echo "<p><a href='" . home_url('/your-dashboard-page/') . "' target='_blank'>View Student Dashboard</a></p>";
} else {
    echo "<p>❌ <strong>No student record found.</strong></p>";
    
    // Resolve or create a default course
    $course_id = $wpdb->get_var("SELECT course_id FROM $courses_table LIMIT 1");
    if (!$course_id) {
        // Resolve or create a category first
        $category_id = $wpdb->get_var("SELECT category_id FROM $categories_table LIMIT 1");
        if (!$category_id) {
            $wpdb->insert($categories_table, array('category_name' => 'General', 'status' => 'active'));
            $category_id = $wpdb->insert_id;
        }
        
        $wpdb->insert($courses_table, array(
            'course_name' => 'General Class',
            'category_id' => $category_id,
            'duration' => '3 Months',
            'fee_amount' => 1000.00,
            'status' => 'active'
        ));
        $course_id = $wpdb->insert_id;
        echo "<p>✅ Created default course (ID: $course_id)</p>";
    }

    // Create student record
    $student_data = array(
        'user_id' => $current_user->ID,
        'student_uid' => 'BOA-' . (1000 + $current_user->ID),
        'name' => $current_user->display_name ?: $current_user->user_login,
        'email' => $current_user->user_email,
        'phone' => '0300-1234567',
        'course_id' => $course_id,
        'admission_date' => current_time('mysql'),
        'status' => 'active'
    );
    
    $result = $wpdb->insert($student_table, $student_data);
    
    if ($result !== false) {
        $new_student_id = $wpdb->insert_id;
        echo "<p>✅ <strong>Student record created successfully!</strong></p>";
        echo "<p>Student ID: " . $new_student_id . "</p>";
        echo "<p><a href='" . home_url('/your-dashboard-page/') . "' target='_blank'>View Student Dashboard</a></p>";
    } else {
        echo "<p>❌ Error creating student record: " . $wpdb->last_error . "</p>";
    }
}
?>