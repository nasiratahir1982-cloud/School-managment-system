<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * BABA Online Academy - Database Management
 *
 * (2025 BABA ARCHITECT - REFACTOR 8)
 * - نیا فنکشن apply_partial_discount() شامل کیا گیا ہے
 * جو فیس انٹری کو تقسیم (split) کر سکتا ہے۔
 */
class BOA_DB {

    // (maybe_create_tables, Settings, Categories, Courses, Dashboard, and Students functions...
    // ... پچھلے کوڈ سے تمام فنکشنز یہاں تک موجود ہیں ...)

    public static function maybe_create_tables() {
        global $wpdb;
        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        $charset_collate = $wpdb->get_charset_collate();
        $tables = array();
        
        error_log('BOA DB - Starting table creation');
        
        // 1. Categories Table
        $table_name = $wpdb->prefix . 'boa_categories';
        error_log('BOA DB - Creating categories table: ' . $table_name);
        $tables[] = "CREATE TABLE $table_name (
            category_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            category_name VARCHAR(255) NOT NULL, 
            status VARCHAR(20) NOT NULL DEFAULT 'active',
            PRIMARY KEY (category_id)
        ) $charset_collate;";
        
        // Add Form Submissions Table
        $table_name = $wpdb->prefix . 'boa_form_submissions';
        error_log('BOA DB - Creating form submissions table: ' . $table_name);
        $tables[] = "CREATE TABLE $table_name (
            submission_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            student_id BIGINT(20) UNSIGNED DEFAULT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(50) DEFAULT NULL,
            course_id BIGINT(20) UNSIGNED NOT NULL,
            student_name VARCHAR(255) NOT NULL,
            tracking_token VARCHAR(64) NOT NULL,
            submission_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(20) NOT NULL DEFAULT 'pending_review',
            status_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status_notes TEXT DEFAULT NULL,
            receipt_file_hash VARCHAR(64) DEFAULT NULL,
            receipt_original_name VARCHAR(255) DEFAULT NULL,
            discount_amount DECIMAL(10, 2) DEFAULT 0.00,
            discount_reason TEXT DEFAULT NULL,
            PRIMARY KEY (submission_id),
            UNIQUE KEY email_course (email, course_id),
            UNIQUE KEY tracking_token (tracking_token),
            KEY phone (phone),
            KEY course_id (course_id),
            KEY student_id (student_id)
        ) $charset_collate;";
        
        // 2. Courses Table
        $table_name = $wpdb->prefix . 'boa_courses';
        error_log('BOA DB - Creating courses table: ' . $table_name);
        $tables[] = "CREATE TABLE $table_name (
            course_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            course_name VARCHAR(255) NOT NULL, 
            category_id BIGINT(20) UNSIGNED NOT NULL,
            duration VARCHAR(100) DEFAULT NULL, 
            fee_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
            start_date DATE DEFAULT NULL, 
            end_date DATE DEFAULT NULL,
            description TEXT DEFAULT NULL, 
            status VARCHAR(20) NOT NULL DEFAULT 'active',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (course_id), 
            KEY category_id (category_id)
        ) $charset_collate;";
        
        // 3. Students Table
        $table_name = $wpdb->prefix . 'boa_students';
        error_log('BOA DB - Creating students table: ' . $table_name);
        $tables[] = "CREATE TABLE $table_name (
            student_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            student_uid VARCHAR(100) NOT NULL, 
            name VARCHAR(255) NOT NULL,
            email VARCHAR(100) NOT NULL, 
            phone VARCHAR(50) DEFAULT NULL,
            course_id BIGINT(20) UNSIGNED NOT NULL, 
            admission_date DATE DEFAULT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'active', 
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (student_id), 
            UNIQUE KEY student_uid (student_uid),
            KEY course_id (course_id), 
            KEY email (email)
        ) $charset_collate;";
        
        // 4. Fees Table
        $table_name = $wpdb->prefix . 'boa_fees';
        error_log('BOA DB - Creating fees table: ' . $table_name);
        $tables[] = "CREATE TABLE $table_name (
            fee_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            student_id BIGINT(20) UNSIGNED NOT NULL, 
            course_id BIGINT(20) UNSIGNED NOT NULL,
            invoice_id VARCHAR(100) DEFAULT NULL, 
            amount_due DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
            amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00, 
            due_date DATE DEFAULT NULL,
            payment_date DATE DEFAULT NULL, 
            status VARCHAR(20) NOT NULL DEFAULT 'pending',
            receipt_url VARCHAR(1000) DEFAULT NULL, 
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (fee_id), 
            KEY student_id (student_id), 
            KEY course_id (course_id)
        ) $charset_collate;";
        
        // 5. Fee Receipts Table
        $table_name = $wpdb->prefix . 'boa_fee_receipts';
        error_log('BOA DB - Creating fee receipts table: ' . $table_name);
        $tables[] = "CREATE TABLE $table_name (
            receipt_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            fee_id BIGINT(20) UNSIGNED NOT NULL,
            student_id BIGINT(20) UNSIGNED NOT NULL,
            file_url VARCHAR(1000) NOT NULL,
            file_hash VARCHAR(64) DEFAULT NULL,
            file_name VARCHAR(255) DEFAULT NULL,
            file_type VARCHAR(100) DEFAULT NULL,
            uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (receipt_id),
            KEY fee_id (fee_id),
            KEY student_id (student_id),
            KEY file_hash (file_hash)
        ) $charset_collate;";

        // 6. Live Sessions Table
        $table_name = $wpdb->prefix . 'boa_live_sessions';
        error_log('BOA DB - Creating live sessions table: ' . $table_name);
        $tables[] = "CREATE TABLE $table_name (
            session_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            course_id BIGINT(20) UNSIGNED DEFAULT NULL,
            session_title VARCHAR(255) NOT NULL,
            platform VARCHAR(50) DEFAULT 'custom',
            join_url VARCHAR(1000) DEFAULT NULL,
            host_url VARCHAR(1000) DEFAULT NULL,
            start_time DATETIME NOT NULL,
            end_time DATETIME DEFAULT NULL,
            duration_minutes INT UNSIGNED DEFAULT NULL,
            instructor_name VARCHAR(255) DEFAULT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (session_id),
            KEY course_id (course_id),
            KEY status (status),
            KEY start_time (start_time)
        ) $charset_collate;";

        // 7. Live Attendance Table
        $table_name = $wpdb->prefix . 'boa_live_attendance';
        error_log('BOA DB - Creating live attendance table: ' . $table_name);
        $tables[] = "CREATE TABLE $table_name (
            attendance_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            session_id BIGINT(20) UNSIGNED NOT NULL,
            student_id BIGINT(20) UNSIGNED DEFAULT NULL,
            student_name VARCHAR(255) DEFAULT NULL,
            student_email VARCHAR(100) DEFAULT NULL,
            join_time DATETIME NOT NULL,
            leave_time DATETIME DEFAULT NULL,
            watch_minutes INT UNSIGNED DEFAULT 0,
            device_info VARCHAR(255) DEFAULT NULL,
            ip_address VARCHAR(100) DEFAULT NULL,
            status VARCHAR(20) DEFAULT 'joined',
            PRIMARY KEY (attendance_id),
            KEY session_id (session_id),
            KEY student_id (student_id),
            KEY status (status)
        ) $charset_collate;";

        // 8. Instructor to Course Mapping
        $table_name = $wpdb->prefix . 'boa_instructor_courses';
        $tables[]   = "CREATE TABLE $table_name (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id BIGINT(20) UNSIGNED NOT NULL,
            course_id BIGINT(20) UNSIGNED NOT NULL,
            assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY user_course (user_id, course_id),
            KEY course_id (course_id)
        ) $charset_collate;";

        // 8. Daily Attendance Table
        $table_name = $wpdb->prefix . 'boa_daily_attendance';
        $tables[]   = "CREATE TABLE $table_name (
            attendance_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            student_id BIGINT(20) UNSIGNED NOT NULL,
            course_id BIGINT(20) UNSIGNED NOT NULL,
            attendance_date DATE NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'present',
            remarks TEXT DEFAULT NULL,
            recorded_by BIGINT(20) UNSIGNED NOT NULL,
            recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (attendance_id),
            UNIQUE KEY student_date (student_id, attendance_date),
            KEY course_date (course_id, attendance_date)
        ) $charset_collate;";
        
        // 5. Fee Receipts Table
        $table_name = $wpdb->prefix . 'boa_fee_receipts';
        error_log('BOA DB - Creating fee receipts table: ' . $table_name);
        $tables[] = "CREATE TABLE $table_name (
            receipt_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            fee_id BIGINT(20) UNSIGNED NOT NULL,
            student_id BIGINT(20) UNSIGNED NOT NULL,
            file_url VARCHAR(1000) NOT NULL,
            file_hash VARCHAR(64) DEFAULT NULL,
            file_name VARCHAR(255) DEFAULT NULL,
            file_type VARCHAR(100) DEFAULT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (receipt_id),
            KEY fee_id (fee_id),
            KEY student_id (student_id),
            KEY file_hash (file_hash)
        ) $charset_collate;";

        // 6. Fee Transactions Table
        $table_name = $wpdb->prefix . 'boa_fee_transactions';
        error_log( 'BOA DB - Creating fee transactions table: ' . $table_name );
        $tables[] = "CREATE TABLE $table_name (
            transaction_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            fee_id BIGINT(20) UNSIGNED NOT NULL,
            student_id BIGINT(20) UNSIGNED NOT NULL,
            gateway VARCHAR(50) NOT NULL,
            transaction_reference VARCHAR(150) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
            status VARCHAR(20) NOT NULL DEFAULT 'initiated',
            request_payload LONGTEXT NULL,
            response_payload LONGTEXT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (transaction_id),
            KEY fee_id (fee_id),
            KEY student_id (student_id),
            KEY transaction_reference (transaction_reference)
        ) $charset_collate;";

        // Quizzes Table
        $table_name = $wpdb->prefix . 'boa_quizzes';
        error_log( 'BOA DB - Creating quizzes table: ' . $table_name );
        $tables[] = "CREATE TABLE $table_name (
            quiz_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            course_id BIGINT(20) UNSIGNED NOT NULL,
            title VARCHAR(255) NOT NULL,
            instructions TEXT DEFAULT NULL,
            total_marks DECIMAL(6,2) DEFAULT NULL,
            pass_percentage DECIMAL(5,2) DEFAULT NULL,
            time_limit INT UNSIGNED DEFAULT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'draft',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (quiz_id),
            KEY course_id (course_id),
            KEY status (status)
        ) $charset_collate;";

        // Quiz Questions
        $table_name = $wpdb->prefix . 'boa_quiz_questions';
        error_log( 'BOA DB - Creating quiz questions table: ' . $table_name );
        $tables[] = "CREATE TABLE $table_name (
            question_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            quiz_id BIGINT(20) UNSIGNED NOT NULL,
            question_text TEXT NOT NULL,
            question_type VARCHAR(50) NOT NULL DEFAULT 'mcq',
            marks DECIMAL(5,2) DEFAULT 1.00,
            question_order INT UNSIGNED DEFAULT 0,
            PRIMARY KEY (question_id),
            KEY quiz_id (quiz_id)
        ) $charset_collate;";

        // Question Options
        $table_name = $wpdb->prefix . 'boa_question_options';
        error_log( 'BOA DB - Creating question options table: ' . $table_name );
        $tables[] = "CREATE TABLE $table_name (
            option_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            question_id BIGINT(20) UNSIGNED NOT NULL,
            option_text TEXT NOT NULL,
            is_correct TINYINT(1) NOT NULL DEFAULT 0,
            option_order INT UNSIGNED DEFAULT 0,
            PRIMARY KEY (option_id),
            KEY question_id (question_id)
        ) $charset_collate;";

        // Quiz Attempts
        $table_name = $wpdb->prefix . 'boa_quiz_attempts';
        error_log( 'BOA DB - Creating quiz attempts table: ' . $table_name );
        $tables[] = "CREATE TABLE $table_name (
            attempt_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            quiz_id BIGINT(20) UNSIGNED NOT NULL,
            student_id BIGINT(20) UNSIGNED NOT NULL,
            score DECIMAL(6,2) NOT NULL DEFAULT 0.00,
            total_marks DECIMAL(6,2) DEFAULT NULL,
            answers LONGTEXT DEFAULT NULL,
            attempt_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (attempt_id),
            KEY quiz_id (quiz_id),
            KEY student_id (student_id)
        ) $charset_collate;";

        // Assignments
        $table_name = $wpdb->prefix . 'boa_assignments';
        error_log( 'BOA DB - Creating assignments table: ' . $table_name );
        $tables[] = "CREATE TABLE $table_name (
            assignment_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            course_id BIGINT(20) UNSIGNED NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT DEFAULT NULL,
            instructions TEXT DEFAULT NULL,
            attachment_url VARCHAR(1000) DEFAULT NULL,
            max_marks DECIMAL(6,2) DEFAULT NULL,
            due_date DATE DEFAULT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'published',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (assignment_id),
            KEY course_id (course_id),
            KEY due_date (due_date)
        ) $charset_collate;";

        // Assignment Submissions
        $table_name = $wpdb->prefix . 'boa_assignment_submissions';
        error_log( 'BOA DB - Creating assignment submissions table: ' . $table_name );
        $tables[] = "CREATE TABLE $table_name (
            submission_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            assignment_id BIGINT(20) UNSIGNED NOT NULL,
            student_id BIGINT(20) UNSIGNED NOT NULL,
            file_url VARCHAR(1000) NOT NULL,
            submission_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            marks DECIMAL(6,2) DEFAULT NULL,
            remarks TEXT DEFAULT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'submitted',
            feedback TEXT DEFAULT NULL,
            PRIMARY KEY (submission_id),
            KEY assignment_id (assignment_id),
            KEY student_id (student_id)
        ) $charset_collate;";

        // 8. Notice Board Table
        $table_name = $wpdb->prefix . 'boa_notices';
        error_log( 'BOA DB - Creating notices table: ' . $table_name );
        $tables[] = "CREATE TABLE $table_name (
            notice_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            audience VARCHAR(20) NOT NULL DEFAULT 'all',
            priority VARCHAR(20) NOT NULL DEFAULT 'normal',
            start_date DATE DEFAULT NULL,
            end_date DATE DEFAULT NULL,
            is_active TINYINT(1) NOT NULL DEFAULT 1,
            created_by BIGINT(20) UNSIGNED DEFAULT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (notice_id),
            KEY audience (audience),
            KEY is_active (is_active),
            KEY start_date (start_date),
            KEY end_date (end_date)
        ) $charset_collate;";
        
        foreach ( $tables as $sql ) { 
            error_log('BOA DB - Executing: ' . $sql);
            $result = dbDelta( $sql );
            error_log('BOA DB - dbDelta result: ' . print_r($result, true));
        }
        error_log('BOA DB - Table creation completed');
    }

    // ===== Settings Helpers (wp_options) =====
    public static function get_settings() { $settings = get_option( 'boa_settings', array() ); return is_array( $settings ) ? $settings : array(); }
    public static function save_settings( array $data ) { $current = self::get_settings(); $settings = array_merge( $current, $data ); update_option( 'boa_settings', $settings ); return $settings; }

    // ===== Categories (Custom Table) =====
    public static function get_categories() { global $wpdb; $table_name = $wpdb->prefix . 'boa_categories'; $categories = $wpdb->get_results( "SELECT * FROM $table_name WHERE status = 'active' ORDER BY category_name ASC", ARRAY_A ); return $categories ? $categories : array(); }
    public static function add_category( $name ) { global $wpdb; $table_name = $wpdb->prefix . 'boa_categories'; if ( empty( $name ) ) return new WP_Error( 'empty_name', 'Category name cannot be empty.' ); $result = $wpdb->insert( $table_name, array( 'category_name' => sanitize_text_field( $name ), 'status' => 'active' ), array( '%s', '%s' ) ); return $result ? $wpdb->insert_id : new WP_Error( 'db_insert_error', 'Could not add category.' ); }
    public static function update_category( $id, $name ) { global $wpdb; $table_name = $wpdb->prefix . 'boa_categories'; if ( empty( $name ) ) return new WP_Error( 'empty_name', 'Category name cannot be empty.' ); return $wpdb->update( $table_name, array( 'category_name' => sanitize_text_field( $name ) ), array( 'category_id' => absint( $id ) ), array( '%s' ), array( '%d' ) ); }
    public static function delete_category( $id ) { global $wpdb; $table_name = $wpdb->prefix . 'boa_categories'; return $wpdb->delete( $table_name, array( 'category_id' => absint( $id ) ), array( '%d' ) ); }

    // ===== Courses (Custom Table) =====
    public static function get_courses( $args = array() ) {
        global $wpdb; $defaults = array( 'page' => 1, 'per_page' => 10, 'search' => '', 'status_filter' => '', 'category_filter' => '', 'allowed_courses' => array() ); $args = wp_parse_args( $args, $defaults );
        $courses_table = $wpdb->prefix . 'boa_courses'; $categories_table = $wpdb->prefix . 'boa_categories';
        $sql_select = "SELECT c.*, cat.category_name"; $sql_from = "FROM $courses_table AS c LEFT JOIN $categories_table AS cat ON c.category_id = cat.category_id";
        $sql_where = "WHERE 1=1"; $params = array();
        if ( ! empty( $args['search'] ) ) { $search = '%' . $wpdb->esc_like( $args['search'] ) . '%'; $sql_where .= " AND (c.course_name LIKE %s OR c.course_id LIKE %s)"; $params[] = $search; $params[] = $search; }
        if ( ! empty( $args['status_filter'] ) ) { $sql_where .= " AND c.status = %s"; $params[] = $args['status_filter']; }
        if ( ! empty( $args['category_filter'] ) ) { $sql_where .= " AND c.category_id = %d"; $params[] = $args['category_filter']; }
        if ( ! empty( $args['allowed_courses'] ) ) {
            $allowed = array_map( 'absint', (array) $args['allowed_courses'] );
            $allowed = array_filter( $allowed );
            if ( empty( $allowed ) ) {
                return array( 'items' => array(), 'total' => 0 );
            }
            $placeholders = implode( ',', array_fill( 0, count( $allowed ), '%d' ) );
            $sql_where .= " AND c.course_id IN ($placeholders)";
            $params     = array_merge( $params, $allowed );
        }
        $total_items_sql = "SELECT COUNT(c.course_id) $sql_from $sql_where";
        if ( ! empty( $params ) ) { $total_items_sql = $wpdb->prepare( $total_items_sql, $params ); }
        $total_items = $wpdb->get_var( $total_items_sql );
        $sql_order = "ORDER BY c.created_at DESC"; $sql_limit = "LIMIT %d, %d";
        $params[] = ( $args['page'] - 1 ) * $args['per_page']; $params[] = $args['per_page'];
        $full_sql = "$sql_select $sql_from $sql_where $sql_order $sql_limit";
        if ( ! empty( $params ) ) { $full_sql = $wpdb->prepare( $full_sql, $params ); }
        $items = $wpdb->get_results( $full_sql, ARRAY_A );
        if ( $items ) {
            foreach ( $items as &$item ) {
                $item['instructors'] = self::get_course_instructors( $item['course_id'] );
            }
        }
        return array( 'items' => $items ? $items : array(), 'total' => (int) $total_items );
    }

    public static function get_course_by_id( $course_id ) {
        global $wpdb;
        $course_id = absint( $course_id );
        if ( ! $course_id ) {
            return null;
        }
        $courses_table = $wpdb->prefix . 'boa_courses';
        $sql           = $wpdb->prepare( "SELECT * FROM $courses_table WHERE course_id = %d", $course_id );
        return $wpdb->get_row( $sql, ARRAY_A );
    }
    /**
     * Safe helper: fetch instructors linked to a course. Returns an empty array if the map table is missing.
     */
    public static function get_course_instructors( $course_id ) {
        global $wpdb;
        $course_id = absint( $course_id );
        if ( ! $course_id ) {
            return array();
        }

        $map_table = $wpdb->prefix . 'boa_instructor_courses';
        $users     = $wpdb->users;

        // If table does not exist, avoid fatal and return empty.
        $table_exists = $wpdb->get_var( $wpdb->prepare( "SHOW TABLES LIKE %s", $map_table ) );
        if ( $table_exists !== $map_table ) {
            return array();
        }

        $sql = $wpdb->prepare(
            "SELECT mic.user_id, u.user_login, u.display_name, u.user_email, mic.assigned_at
             FROM {$map_table} mic
             LEFT JOIN {$users} u ON mic.user_id = u.ID
             WHERE mic.course_id = %d",
            $course_id
        );

        $rows = $wpdb->get_results( $sql, ARRAY_A );
        return $rows ? $rows : array();
    }

    public static function get_course_stats() { global $wpdb; $table_name = $wpdb->prefix . 'boa_courses'; $stats = $wpdb->get_row("SELECT COUNT(course_id) AS total, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active, SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactive FROM $table_name", ARRAY_A); return array( 'total' => (int) ( $stats['total'] ?? 0 ), 'active' => (int) ( $stats['active'] ?? 0 ), 'inactive' => (int) ( $stats['inactive'] ?? 0 ) ); }
    public static function save_course( $data ) { 
        global $wpdb; 
        $table_name = $wpdb->prefix . 'boa_courses'; 
        $course_id = isset( $data['course_id'] ) && ! empty( $data['course_id'] ) ? absint( $data['course_id'] ) : 0; 
        
        // Debug logging
        error_log('BOA DB Save Course - Table: ' . $table_name);
        error_log('BOA DB Save Course - Course ID: ' . $course_id);
        error_log('BOA DB Save Course - Data: ' . print_r($data, true));
        
        // Validate and sanitize dates
        $start_date = ! empty( $data['start_date'] ) ? sanitize_text_field( $data['start_date'] ) : null;
        $end_date = ! empty( $data['end_date'] ) ? sanitize_text_field( $data['end_date'] ) : null;
        
        $fields = array( 
            'course_name' => sanitize_text_field( $data['course_name'] ), 
            'category_id' => absint( $data['category_id'] ), 
            'duration' => sanitize_text_field( $data['duration'] ), 
            'fee_amount' => (float) $data['fee_amount'], 
            'start_date' => $start_date,
            'end_date' => $end_date,
            'description' => sanitize_textarea_field( $data['description'] ), 
            'status' => sanitize_text_field( $data['status'] ) 
        ); 
        $formats = array( '%s', '%d', '%s', '%f', '%s', '%s', '%s', '%s' ); 
        
        error_log('BOA DB Save Course - Fields: ' . print_r($fields, true));
        error_log('BOA DB Save Course - Formats: ' . print_r($formats, true));
        
        // Check if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name;
        error_log('BOA DB Save Course - Table exists: ' . ($table_exists ? 'Yes' : 'No'));
        
        if ( $course_id > 0 ) { 
            error_log('BOA DB Save Course - UPDATE operation');
            $result = $wpdb->update( $table_name, $fields, array( 'course_id' => $course_id ), $formats, array( '%d' ) ); 
            $error_message = $wpdb->last_error;
            if (!empty($error_message)) {
                error_log('BOA DB Save Course - Database error: ' . $error_message);
            }
            return $result !== false ? $course_id : new WP_Error( 'db_update_error', 'Could not update course.' . ($error_message ? ' DB Error: ' . $error_message : '') ); 
        } else { 
            error_log('BOA DB Save Course - INSERT operation');
            $fields['created_at'] = current_time( 'mysql' ); 
            $formats[] = '%s'; 
            $result = $wpdb->insert( $table_name, $fields, $formats ); 
            $error_message = $wpdb->last_error;
            if (!empty($error_message)) {
                error_log('BOA DB Save Course - Database error: ' . $error_message);
            }
            return $result ? $wpdb->insert_id : new WP_Error( 'db_insert_error', 'Could not add course.' . ($error_message ? ' DB Error: ' . $error_message : '') ); 
        } 
    }
    public static function delete_course( $id ) { global $wpdb; $table_name = $wpdb->prefix . 'boa_courses'; return $wpdb->delete( $table_name, array( 'course_id' => absint( $id ) ), array( '%d' ) ); }
    public static function get_course_category_stats() { global $wpdb; $courses_table = $wpdb->prefix . 'boa_courses'; $categories_table = $wpdb->prefix . 'boa_categories'; $sql = "SELECT cat.category_name, COUNT(c.course_id) AS course_count FROM $categories_table AS cat LEFT JOIN $courses_table AS c ON cat.category_id = c.category_id WHERE cat.status = 'active' GROUP BY cat.category_id ORDER BY course_count DESC, cat.category_name ASC"; $results = $wpdb->get_results( $sql, ARRAY_A ); return $results ? $results : array(); }
    public static function get_course_fee_public( $course_id ) {
        global $wpdb;
        $course_id = absint( $course_id );
        if ( $course_id === 0 ) {
            return 0.00;
        }
        $table_name = $wpdb->prefix . 'boa_courses';
        $fee = $wpdb->get_var( $wpdb->prepare( "SELECT fee_amount FROM $table_name WHERE course_id = %d AND status = 'active'", $course_id ) );
        return (float) $fee;
    }

    // ===== Dashboard Helpers =====
    public static function get_dashboard_summary_stats() { 
        global $wpdb; 
        $students_table = $wpdb->prefix . 'boa_students'; 
        $fees_table = $wpdb->prefix . 'boa_fees'; 
        $courses_table = $wpdb->prefix . 'boa_courses'; 
        
        $total_students = $wpdb->get_var( "SELECT COUNT(student_id) FROM $students_table WHERE status = 'active'" ); 
        
        $total_income = $wpdb->get_var( $wpdb->prepare( 
            "SELECT SUM(amount_paid) FROM $fees_table WHERE status = 'paid' AND MONTH(payment_date) = MONTH(CURDATE()) AND YEAR(payment_date) = YEAR(CURDATE())", array() 
        ) ); 
        
        $pending_fees = $wpdb->get_var( "SELECT COUNT(fee_id) FROM $fees_table WHERE status = 'pending' OR status = 'overdue'" ); 
        
        $active_courses = $wpdb->get_var( "SELECT COUNT(course_id) FROM $courses_table WHERE status = 'active'" ); 
        
        $total_discounted = $wpdb->get_var( "SELECT SUM(amount_due) FROM $fees_table WHERE status = 'discounted'" );

        return array( 
            'total_students' => (int) $total_students, 
            'total_income' => (float) $total_income, 
            'pending_fees' => (int) $pending_fees, 
            'active_courses' => (int) $active_courses,
            'total_discounted' => (float) $total_discounted
        ); 
    }
    public static function get_dashboard_upcoming_deadlines() { global $wpdb; $fees_table = $wpdb->prefix . 'boa_fees'; $students_table = $wpdb->prefix . 'boa_students'; $courses_table = $wpdb->prefix . 'boa_courses'; $sql = $wpdb->prepare( "SELECT f.due_date, f.status, s.name as student_name, c.course_name FROM $fees_table AS f LEFT JOIN $students_table AS s ON f.student_id = s.student_id LEFT JOIN $courses_table AS c ON f.course_id = c.course_id WHERE (f.status = 'pending' OR f.status = 'overdue') AND f.due_date >= CURDATE() ORDER BY f.due_date ASC LIMIT %d", 5 ); $results = $wpdb->get_results( $sql, ARRAY_A ); return $results ? $results : array(); }
    public static function get_dashboard_monthly_income_data() { global $wpdb; $fees_table = $wpdb->prefix . 'boa_fees'; $sql = "SELECT DATE_FORMAT(payment_date, '%Y-%m') AS month, SUM(amount_paid) AS total FROM $fees_table WHERE status = 'paid' AND payment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) GROUP BY month ORDER BY month ASC"; $results = $wpdb->get_results( $sql, ARRAY_A ); $labels = array(); $data = array(); if ($results) { foreach ($results as $row) { $labels[] = date( 'M Y', strtotime( $row['month'] . '-01' ) ); $data[] = (float) $row['total']; } } for ( $i = 5; $i >= 0; $i-- ) { $month_label = date( 'M Y', strtotime( "-$i months" ) ); if ( ! in_array( $month_label, $labels ) ) { $labels[] = $month_label; $data[] = 0; } } return array( 'labels' => $labels, 'data' => $data ); }
    public static function get_dashboard_course_income_data() { global $wpdb; $fees_table = $wpdb->prefix . 'boa_fees'; $courses_table = $wpdb->prefix . 'boa_courses'; $sql = "SELECT c.course_name, SUM(f.amount_paid) AS total FROM $fees_table AS f LEFT JOIN $courses_table AS c ON f.course_id = c.course_id WHERE f.status = 'paid' GROUP BY f.course_id ORDER BY total DESC LIMIT 5"; $results = $wpdb->get_results( $sql, ARRAY_A ); $labels = array(); $data = array(); if ($results) { foreach ($results as $row) { $labels[] = $row['course_name']; $data[] = (float) $row['total']; } } return array( 'labels' => $labels, 'data' => $data ); }
    public static function get_dashboard_recent_activity() { global $wpdb; $students_table = $wpdb->prefix . 'boa_students'; $courses_table = $wpdb->prefix . 'boa_courses'; $sql = "SELECT s.name, s.created_at, c.course_name FROM $students_table AS s LEFT JOIN $courses_table AS c ON s.course_id = c.course_id ORDER BY s.created_at DESC LIMIT 5"; $results = $wpdb->get_results( $sql, ARRAY_A ); return $results ? $results : array(); }
    public static function get_dashboard_fee_status_overview() { global $wpdb; $fees_table = $wpdb->prefix . 'boa_fees'; $students_table = $wpdb->prefix . 'boa_students'; $courses_table = $wpdb->prefix . 'boa_courses'; $sql = "SELECT f.due_date, f.amount_paid, f.status, s.name as student_name, c.course_name FROM $fees_table AS f LEFT JOIN $students_table AS s ON f.student_id = s.student_id LEFT JOIN $courses_table AS c ON f.course_id = c.course_id ORDER BY f.created_at DESC LIMIT 10"; $results = $wpdb->get_results( $sql, ARRAY_A ); return $results ? $results : array(); }
    public static function get_dashboard_insights() {
        global $wpdb;

        $submissions_table = $wpdb->prefix . 'boa_form_submissions';
        $fees_table        = $wpdb->prefix . 'boa_fees';
        $students_table    = $wpdb->prefix . 'boa_students';
        $courses_table     = $wpdb->prefix . 'boa_courses';
        $receipts_table    = $wpdb->prefix . 'boa_fee_receipts';

        $pending_reviews = array(
            'total'          => 0,
            'oldest_days'    => 0,
            'stale_count'    => 0,
            'stale_threshold'=> 3,
        );

        $pending_reviews['total'] = (int) $wpdb->get_var(
            "SELECT COUNT(*) FROM $submissions_table WHERE status = 'pending_review'"
        );

        $oldest_days = $wpdb->get_var(
            "SELECT MAX(DATEDIFF(NOW(), COALESCE(status_updated_at, submission_date)))
             FROM $submissions_table
             WHERE status = 'pending_review'"
        );
        $pending_reviews['oldest_days'] = $oldest_days !== null ? max( 0, (int) $oldest_days ) : 0;

        $pending_reviews['stale_count'] = (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM $submissions_table
                 WHERE status = 'pending_review'
                 AND COALESCE(status_updated_at, submission_date) <= DATE_SUB(NOW(), INTERVAL %d DAY)",
                $pending_reviews['stale_threshold']
            )
        );

        $receipt_condition = "((f.receipt_url IS NULL OR f.receipt_url = '') AND NOT EXISTS (SELECT 1 FROM $receipts_table AS r WHERE r.fee_id = f.fee_id))";

        $missing_receipts_total = (int) $wpdb->get_var(
            "SELECT COUNT(*) FROM $fees_table AS f
             WHERE (f.status = 'pending' OR f.status = 'pending_review' OR f.status = 'overdue')
             AND $receipt_condition"
        );

        $missing_receipts_rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT f.fee_id, f.due_date, f.amount_due, s.name AS student_name, c.course_name
                 FROM $fees_table AS f
                 LEFT JOIN $students_table AS s ON f.student_id = s.student_id
                 LEFT JOIN $courses_table AS c ON f.course_id = c.course_id
                 WHERE (f.status = 'pending' OR f.status = 'pending_review' OR f.status = 'overdue')
                   AND $receipt_condition
                 ORDER BY f.due_date ASC
                 LIMIT %d",
                3
            ),
            ARRAY_A
        );
        if ( ! $missing_receipts_rows ) {
            $missing_receipts_rows = array();
        }

        $top_dues = $wpdb->get_results(
            "SELECT c.course_name, SUM(GREATEST(f.amount_due - f.amount_paid, 0)) AS pending_amount, COUNT(f.fee_id) AS invoice_count
             FROM $fees_table AS f
             LEFT JOIN $courses_table AS c ON f.course_id = c.course_id
             WHERE f.status = 'pending' OR f.status = 'overdue'
             GROUP BY f.course_id
             HAVING pending_amount > 0
             ORDER BY pending_amount DESC
             LIMIT 3",
            ARRAY_A
        );
        if ( ! $top_dues ) {
            $top_dues = array();
        }

        return array(
            'pending_reviews' => $pending_reviews,
            'missing_receipts' => array(
                'total' => $missing_receipts_total,
                'rows'  => $missing_receipts_rows,
            ),
            'top_dues' => $top_dues,
        );
    }

    // ===== Course-wise Statistics (Dashboard Extensions) =====
    public static function get_upcoming_courses() { 
        global $wpdb; 
        $courses_table = $wpdb->prefix . 'boa_courses'; 
        $sql = "SELECT course_name, start_date, end_date, fee_amount, duration FROM $courses_table WHERE status = 'active' AND start_date > CURDATE() ORDER BY start_date ASC LIMIT 5"; 
        $results = $wpdb->get_results( $sql, ARRAY_A ); 
        return $results ? $results : array(); 
    }
    
    public static function get_course_wise_admissions() { 
        global $wpdb; 
        $courses_table = $wpdb->prefix . 'boa_courses'; 
        $students_table = $wpdb->prefix . 'boa_students'; 
        $sql = "SELECT c.course_id, c.course_name, COUNT(s.student_id) as admission_count FROM $courses_table AS c LEFT JOIN $students_table AS s ON c.course_id = s.course_id WHERE c.status = 'active' GROUP BY c.course_id ORDER BY admission_count DESC LIMIT 5"; 
        $results = $wpdb->get_results( $sql, ARRAY_A ); 
        return $results ? $results : array(); 
    }
    
    public static function get_course_wise_fees_collected() { 
        global $wpdb; 
        $courses_table = $wpdb->prefix . 'boa_courses'; 
        $fees_table = $wpdb->prefix . 'boa_fees'; 
        $sql = "SELECT c.course_id, c.course_name, SUM(f.amount_paid) as total_collected FROM $courses_table AS c LEFT JOIN $fees_table AS f ON c.course_id = f.course_id WHERE f.status = 'paid' AND c.status = 'active' GROUP BY c.course_id ORDER BY total_collected DESC LIMIT 5"; 
        $results = $wpdb->get_results( $sql, ARRAY_A ); 
        return $results ? $results : array(); 
    }
    
    public static function get_course_wise_pending_fees() { 
        global $wpdb; 
        $courses_table = $wpdb->prefix . 'boa_courses'; 
        $fees_table = $wpdb->prefix . 'boa_fees'; 
        $sql = "SELECT c.course_id, c.course_name, SUM(f.amount_due - f.amount_paid) as pending_amount, COUNT(f.fee_id) as pending_count FROM $courses_table AS c LEFT JOIN $fees_table AS f ON c.course_id = f.course_id WHERE (f.status = 'pending' OR f.status = 'overdue') AND c.status = 'active' GROUP BY c.course_id ORDER BY pending_amount DESC LIMIT 5"; 
        $results = $wpdb->get_results( $sql, ARRAY_A ); 
        return $results ? $results : array(); 
    }

    // ===== نیا: کورس میٹریل ہیلپرز =====
    public static function get_materials_by_course_id( $course_id ) {
        global $wpdb;
        $course_id = absint( $course_id );
        if ( ! $course_id ) {
            return array();
        }

        $materials_table = $wpdb->prefix . 'boa_course_materials';
        $sql = $wpdb->prepare(
            "SELECT * FROM $materials_table WHERE course_id = %d ORDER BY created_at DESC",
            $course_id
        );

        $results = $wpdb->get_results( $sql, ARRAY_A );
        return $results ? $results : array();
    }

    public static function get_materials_by_student_id( $student_id ) {
        global $wpdb;
        $student_id = absint( $student_id );
        if ( ! $student_id ) {
            return array();
        }

        $students_table = $wpdb->prefix . 'boa_students';
        $materials_table = $wpdb->prefix . 'boa_course_materials';
        $courses_table = $wpdb->prefix . 'boa_courses';

        $sql = $wpdb->prepare(
            "SELECT m.*, c.course_name
             FROM $materials_table m
             JOIN $courses_table c ON m.course_id = c.course_id
             WHERE m.course_id IN (SELECT DISTINCT course_id FROM $students_table WHERE student_id = %d)
             ORDER BY c.course_name, m.created_at DESC",
            $student_id
        );

        $results = $wpdb->get_results( $sql, ARRAY_A );
        
        // کورس کے لحاظ سے گروپ کریں
        $grouped_materials = array();
        if ( $results ) {
            foreach ( $results as $material ) {
                $grouped_materials[ $material['course_name'] ][] = $material;
            }
        }
        
        return $grouped_materials;
    }

    public static function save_material( $data ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'boa_course_materials';
        $material_id = isset( $data['material_id'] ) && ! empty( $data['material_id'] ) ? absint( $data['material_id'] ) : 0;

        $fields = array(
            'course_id' => absint( $data['course_id'] ),
            'title' => sanitize_text_field( $data['title'] ),
            'material_type' => sanitize_text_field( $data['material_type'] ),
            'content_url' => esc_url_raw( $data['content_url'] ),
            'description' => sanitize_textarea_field( $data['description'] ),
        );

        $formats = array( '%d', '%s', '%s', '%s', '%s' );

        if ( $material_id > 0 ) {
            $result = $wpdb->update( $table_name, $fields, array( 'material_id' => $material_id ), $formats, array( '%d' ) );
            return $result !== false ? $material_id : new WP_Error( 'db_update_error', 'Could not update material.' );
        } else {
            $fields['created_at'] = current_time( 'mysql' );
            $formats[] = '%s';
            $result = $wpdb->insert( $table_name, $fields, $formats );
            return $result ? $wpdb->insert_id : new WP_Error( 'db_insert_error', 'Could not add material.' );
        }
    }

    public static function delete_material( $material_id ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'boa_course_materials';
        return $wpdb->delete( $table_name, array( 'material_id' => absint( $material_id ) ), array( '%d' ) );
    }
    
    // ===== Students Helpers =====
    public static function get_students( $args = array() ) { global $wpdb; $defaults = array( 'page' => 1, 'per_page' => 10, 'search' => '', 'status' => '', 'course' => '', 'dateFrom' => '', 'dateTo' => '' ); $args = wp_parse_args( $args, $defaults ); $students_table = $wpdb->prefix . 'boa_students'; $courses_table = $wpdb->prefix . 'boa_courses'; $sql_select = "SELECT s.*, c.course_name"; $sql_from = "FROM $students_table AS s LEFT JOIN $courses_table AS c ON s.course_id = c.course_id"; $sql_where = "WHERE 1=1"; $params = array(); if ( ! empty( $args['search'] ) ) { $search = '%' . $wpdb->esc_like( $args['search'] ) . '%'; $sql_where .= " AND (s.name LIKE %s OR s.email LIKE %s OR s.student_uid LIKE %s OR s.phone LIKE %s)"; $params[] = $search; $params[] = $search; $params[] = $search; $params[] = $search; } if ( ! empty( $args['status'] ) ) { $sql_where .= " AND s.status = %s"; $params[] = $args['status']; } if ( ! empty( $args['status__not_in'] ) ) { $status_not_in = $args['status__not_in']; $sql_where .= " AND s.status NOT IN ('" . implode( "','", array_map( 'esc_sql', $status_not_in ) ) . "')"; } if ( ! empty( $args['course'] ) ) { $sql_where .= " AND s.course_id = %d"; $params[] = $args['course']; } if ( ! empty( $args['dateFrom'] ) ) { $sql_where .= " AND s.admission_date >= %s"; $params[] = $args['dateFrom']; } if ( ! empty( $args['dateTo'] ) ) { $sql_where .= " AND s.admission_date <= %s"; $params[] = $args['dateTo']; } $total_items_sql = "SELECT COUNT(s.student_id) $sql_from $sql_where"; if ( ! empty( $params ) ) { $total_items_sql = $wpdb->prepare( $total_items_sql, $params ); } $total_items = $wpdb->get_var( $total_items_sql ); $sql_order = "ORDER BY s.created_at DESC"; $sql_limit = "LIMIT %d, %d"; $params[] = ( $args['page'] - 1 ) * $args['per_page']; $params[] = $args['per_page']; $full_sql = "$sql_select $sql_from $sql_where $sql_order $sql_limit"; if ( ! empty( $params ) ) { $full_sql = $wpdb->prepare( $full_sql, $params ); } $items = $wpdb->get_results( $full_sql, ARRAY_A ); return array( 'items' => $items ? $items : array(), 'total' => (int) $total_items ); }
    public static function save_student( $data ) {
        global $wpdb;

        $table_name = $wpdb->prefix . 'boa_students';
        $student_id = isset( $data['student_id'] ) && ! empty( $data['student_id'] ) ? absint( $data['student_id'] ) : 0;

        $fields = array(
            'name'           => sanitize_text_field( $data['name'] ),
            'email'          => sanitize_email( $data['email'] ),
            'phone'          => sanitize_text_field( $data['phone'] ),
            'course_id'      => absint( $data['course_id'] ),
            'admission_date' => sanitize_text_field( $data['admission_date'] ),
            'status'         => sanitize_text_field( $data['status'] ),
        );

        $formats = array( '%s', '%s', '%s', '%d', '%s', '%s' );

        $duplicate_id = self::student_exists_for_course(
            $fields['email'],
            $fields['phone'],
            $fields['course_id'],
            $student_id
        );

        if ( $duplicate_id ) {
            return new WP_Error( 'duplicate_student', __( 'A student with the same contact details already exists for this course.', 'baba-online-academy' ) );
        }

        if ( $student_id > 0 ) {
            $result = $wpdb->update( $table_name, $fields, array( 'student_id' => $student_id ), $formats, array( '%d' ) );
            return $result !== false ? $student_id : new WP_Error( 'db_update_error', 'Could not update student.' );
        }

        $fields['student_uid'] = 'BOA-' . time();
        $fields['created_at']  = current_time( 'mysql' );
        $formats[]             = '%s';
        $formats[]             = '%s';

        $result = $wpdb->insert( $table_name, $fields, $formats );
        return $result ? $wpdb->insert_id : new WP_Error( 'db_insert_error', 'Could not add student.' );
    }

    public static function student_exists_for_course( $email, $phone, $course_id, $exclude_student_id = 0 ) {
        global $wpdb;

        $table   = $wpdb->prefix . 'boa_students';
        $clauses = array( '(email = %s AND course_id = %d)' );
        $params  = array( sanitize_email( $email ), absint( $course_id ) );

        if ( ! empty( $phone ) ) {
            $clauses[] = '(phone = %s AND course_id = %d)';
            $params[]  = sanitize_text_field( $phone );
            $params[]  = absint( $course_id );
        }

        $sql = "SELECT student_id FROM $table WHERE (" . implode( ' OR ', $clauses ) . ")";

        if ( $exclude_student_id > 0 ) {
            $sql    .= ' AND student_id != %d';
            $params[] = absint( $exclude_student_id );
        }

        $sql .= ' LIMIT 1';

        $prepared = $wpdb->prepare( $sql, $params );
        return (int) $wpdb->get_var( $prepared );
    }
    public static function delete_student( $id ) { global $wpdb; $table_name = $wpdb->prefix . 'boa_students'; return $wpdb->delete( $table_name, array( 'student_id' => absint( $id ) ), array( '%d' ) ); }
    public static function get_student_summary_stats() { global $wpdb; $table_name = $wpdb->prefix . 'boa_students'; $stats = $wpdb->get_row("SELECT COUNT(student_id) AS total, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active, SUM(CASE WHEN status = 'inactive' OR status = 'completed' THEN 1 ELSE 0 END) AS inactive, SUM(CASE WHEN admission_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS new_this_month FROM $table_name", ARRAY_A); return array( 'total' => (int) ( $stats['total'] ?? 0 ), 'active' => (int) ( $stats['active'] ?? 0 ), 'inactive' => (int) ( $stats['inactive'] ?? 0 ), 'new_this_month' => (int) ( $stats['new_this_month'] ?? 0 ) ); }
    public static function get_student_course_snapshot_stats() { global $wpdb; $students_table = $wpdb->prefix . 'boa_students'; $courses_table = $wpdb->prefix . 'boa_courses'; $sql = "SELECT c.course_name, COUNT(s.student_id) AS student_count FROM $courses_table AS c LEFT JOIN $students_table AS s ON c.course_id = s.course_id WHERE c.status = 'active' GROUP BY c.course_id ORDER BY student_count DESC, c.course_name ASC"; $results = $wpdb->get_results( $sql, ARRAY_A ); return $results ? $results : array(); }
    
    /**
     * نیا فنکشن: اسٹوڈنٹ آئی ڈی کی بنیاد پر اسٹوڈنٹ کا ڈیٹا حاصل کرتا ہے
     */
    public static function get_student_by_id( $student_id ) {
        global $wpdb;
        $student_id = absint( $student_id );
        if ( ! $student_id ) {
            return null;
        }
        $students_table = $wpdb->prefix . 'boa_students';
        $sql = $wpdb->prepare( "SELECT * FROM $students_table WHERE student_id = %d", $student_id );
        return $wpdb->get_row( $sql, ARRAY_A );
    }

    /**
     * نیا فنکشن: سرٹیفکیٹ ٹوکن کی بنیاد پر اسٹوڈنٹ کا ڈیٹا حاصل کرتا ہے
     */
    public static function get_student_by_certificate_token( $token ) {
        global $wpdb;
        $token = sanitize_text_field( $token );
        if ( empty( $token ) ) {
            return null;
        }
        $students_table = $wpdb->prefix . 'boa_students';
        $sql = $wpdb->prepare( "SELECT * FROM $students_table WHERE certificate_token = %s", $token );
        return $wpdb->get_row( $sql, ARRAY_A );
    }

    /**
     * نیا فنکشن: اسٹوڈنٹ آئی ڈی کی بنیاد پر کورسز حاصل کرتا ہے
     */
    public static function get_courses_by_student_id( $student_id ) {
        global $wpdb;
        $student_id = absint( $student_id );
        if ( ! $student_id ) {
            return array();
        }

        $students_table = $wpdb->prefix . 'boa_students';
        $courses_table = $wpdb->prefix . 'boa_courses';

        $sql = $wpdb->prepare(
            "SELECT DISTINCT c.* 
             FROM $courses_table c
             JOIN $students_table s ON c.course_id = s.course_id
             WHERE s.student_id = %d",
            $student_id
        );

        $results = $wpdb->get_results( $sql, ARRAY_A );
        return $results ? $results : array();
    }

    public static function get_student_recent_admissions() { global $wpdb; $students_table = $wpdb->prefix . 'boa_students'; $courses_table = $wpdb->prefix . 'boa_courses'; $sql = $wpdb->prepare( "SELECT s.name, s.admission_date, c.course_name FROM $students_table AS s LEFT JOIN $courses_table AS c ON s.course_id = c.course_id ORDER BY s.admission_date DESC LIMIT %d", 5 ); $results = $wpdb->get_results( $sql, ARRAY_A ); return $results ? $results : array(); }

    /**
     * نیا فنکشن: ورڈپریس یوزر آئی ڈی کی بنیاد پر اسٹوڈنٹ کا ڈیٹا حاصل کرتا ہے
     */
    public static function get_student_by_wp_user_id( $user_id ) {
        global $wpdb;
        $user_id = absint( $user_id );
        if ( ! $user_id ) {
            return null;
        }
        $students_table = $wpdb->prefix . 'boa_students';
        $sql = $wpdb->prepare( "SELECT * FROM $students_table WHERE user_id = %d", $user_id );
        $student = $wpdb->get_row( $sql, ARRAY_A );
        return $student;
    }

    // ===== Fees Helpers =====

    /**
     * نیا فنکشن: اسٹوڈنٹ آئی ڈی کی بنیاد پر فیس ہسٹری حاصل کرتا ہے
     */
    public static function get_fees_by_student_id( $student_id ) {
        global $wpdb;
        $student_id = absint( $student_id );
        if ( ! $student_id ) {
            return array();
        }

        $fees_table = $wpdb->prefix . 'boa_fees';
        $courses_table = $wpdb->prefix . 'boa_courses';

        $sql = $wpdb->prepare(
            "SELECT f.*, c.course_name 
             FROM $fees_table f
             LEFT JOIN $courses_table c ON f.course_id = c.course_id
             WHERE f.student_id = %d
             ORDER BY f.created_at DESC",
            $student_id
        );

        $results = $wpdb->get_results( $sql, ARRAY_A );
        return $results ? $results : array();
    }

    public static function get_fees( $args = array() ) { global $wpdb; $defaults = array( 'page' => 1, 'per_page' => 10, 'search' => '', 'status' => '', 'course' => '', 'dateFrom' => '', 'dateTo' => '' ); $args = wp_parse_args( $args, $defaults ); $fees_table = $wpdb->prefix . 'boa_fees'; $students_table = $wpdb->prefix . 'boa_students'; $courses_table = $wpdb->prefix . 'boa_courses'; $sql_select = "SELECT f.*, s.name as student_name, c.course_name"; $sql_from = "FROM $fees_table AS f LEFT JOIN $students_table AS s ON f.student_id = s.student_id LEFT JOIN $courses_table AS c ON f.course_id = c.course_id"; $sql_where = "WHERE 1=1"; $params = array(); if ( ! empty( $args['search'] ) ) { $search = '%' . $wpdb->esc_like( $args['search'] ) . '%'; $sql_where .= " AND (s.name LIKE %s OR c.course_name LIKE %s OR f.invoice_id LIKE %s)"; $params[] = $search; $params[] = $search; $params[] = $search; } if ( ! empty( $args['status'] ) ) { $sql_where .= " AND f.status = %s"; $params[] = $args['status']; } if ( ! empty( $args['course'] ) ) { $sql_where .= " AND f.course_id = %d"; $params[] = $args['course']; } if ( ! empty( $args['dateFrom'] ) ) { $sql_where .= " AND f.due_date >= %s"; $params[] = $args['dateFrom']; } if ( ! empty( $args['dateTo'] ) ) { $sql_where .= " AND f.due_date <= %s"; $params[] = $args['dateTo']; } $total_items_sql = "SELECT COUNT(f.fee_id) $sql_from $sql_where"; if ( ! empty( $params ) ) { $total_items_sql = $wpdb->prepare( $total_items_sql, $params ); } $total_items = $wpdb->get_var( $total_items_sql ); $sql_order = "ORDER BY f.due_date DESC"; $sql_limit = "LIMIT %d, %d"; $params[] = ( $args['page'] - 1 ) * $args['per_page']; $params[] = $args['per_page']; $full_sql = "$sql_select $sql_from $sql_where $sql_order $sql_limit"; if ( ! empty( $params ) ) { $full_sql = $wpdb->prepare( $full_sql, $params ); } $items = $wpdb->get_results( $full_sql, ARRAY_A ); return array( 'items' => $items ? $items : array(), 'total' => (int) $total_items ); }
    public static function save_fee( $data ) {
        global $wpdb;

        $table_name = $wpdb->prefix . 'boa_fees';
        $fee_id     = isset( $data['fee_id'] ) && ! empty( $data['fee_id'] ) ? absint( $data['fee_id'] ) : 0;

        $fields = array(
            'student_id'   => absint( $data['student_id'] ),
            'course_id'    => absint( $data['course_id'] ),
            'amount_due'   => (float) $data['amount_due'],
            'amount_paid'  => (float) $data['amount_paid'],
            'due_date'     => sanitize_text_field( $data['due_date'] ),
            'payment_date' => sanitize_text_field( $data['payment_date'] ),
            'status'       => sanitize_text_field( $data['status'] ),
            'invoice_id'   => sanitize_text_field( $data['invoice_id'] ),
            'receipt_url'  => esc_url_raw( $data['receipt_url'] ),
        );

        $formats = array( '%d', '%d', '%f', '%f', '%s', '%s', '%s', '%s', '%s' );

        if ( $fee_id > 0 ) {
            $result = $wpdb->update( $table_name, $fields, array( 'fee_id' => $fee_id ), $formats, array( '%d' ) );
            return $result !== false ? $fee_id : new WP_Error( 'db_update_error', 'Could not update fee.' );
        }

        $fields['created_at'] = current_time( 'mysql' );
        $formats[]            = '%s';

        $result = $wpdb->insert( $table_name, $fields, $formats );
        return $result ? $wpdb->insert_id : new WP_Error( 'db_insert_error', 'Could not add fee.' );
    }

    public static function delete_fee( $id ) {
        global $wpdb;

        $fee_id = absint( $id );
        if ( $fee_id === 0 ) {
            return false;
        }

        self::delete_fee_receipts( $fee_id );

        return $wpdb->delete(
            $wpdb->prefix . 'boa_fees',
            array( 'fee_id' => $fee_id ),
            array( '%d' )
        );
    }

    public static function get_fee( $fee_id ) {
        global $wpdb;

        $table = $wpdb->prefix . 'boa_fees';
        return $wpdb->get_row(
            $wpdb->prepare( "SELECT * FROM $table WHERE fee_id = %d", absint( $fee_id ) ),
            ARRAY_A
        );
    }

    public static function mark_fee_paid( $fee_id, $amount = null ) {
        global $wpdb;
        $table = $wpdb->prefix . 'boa_fees';
        $fee_id = absint( $fee_id );
        if ( 0 === $fee_id ) {
            return false;
        }

        $data   = array(
            'status'       => 'paid',
            'payment_date' => current_time( 'Y-m-d' ),
        );
        $formats = array( '%s', '%s' );

        if ( null !== $amount ) {
            $data['amount_paid'] = (float) $amount;
            $formats[] = '%f';
        }

        return $wpdb->update(
            $table,
            $data,
            array( 'fee_id' => $fee_id ),
            $formats,
            array( '%d' )
        );
    }

    public static function add_transaction( $data ) {
        global $wpdb;
        $table = $wpdb->prefix . 'boa_fee_transactions';

        $insert = array(
            'fee_id'                => absint( $data['fee_id'] ?? 0 ),
            'student_id'            => absint( $data['student_id'] ?? 0 ),
            'gateway'               => sanitize_key( $data['gateway'] ?? '' ),
            'transaction_reference' => sanitize_text_field( $data['transaction_reference'] ?? '' ),
            'amount'                => (float) ( $data['amount'] ?? 0 ),
            'status'                => sanitize_text_field( $data['status'] ?? 'initiated' ),
            'request_payload'       => isset( $data['request_payload'] ) ? maybe_serialize( $data['request_payload'] ) : '',
            'response_payload'      => isset( $data['response_payload'] ) ? maybe_serialize( $data['response_payload'] ) : '',
        );

        $formats = array( '%d', '%d', '%s', '%s', '%f', '%s', '%s', '%s' );
        $result  = $wpdb->insert( $table, $insert, $formats );

        return $result ? $wpdb->insert_id : false;
    }

    public static function update_transaction( $transaction_id, $fields ) {
        global $wpdb;
        $table = $wpdb->prefix . 'boa_fee_transactions';

        if ( isset( $fields['request_payload'] ) ) {
            $fields['request_payload'] = maybe_serialize( $fields['request_payload'] );
        }
        if ( isset( $fields['response_payload'] ) ) {
            $fields['response_payload'] = maybe_serialize( $fields['response_payload'] );
        }

        $result = $wpdb->update(
            $table,
            $fields,
            array( 'transaction_id' => absint( $transaction_id ) ),
            null,
            array( '%d' )
        );

        return $result;
    }

    public static function get_transaction_by_reference( $reference, $gateway ) {
        global $wpdb;
        $table = $wpdb->prefix . 'boa_fee_transactions';

        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM $table WHERE transaction_reference = %s AND gateway = %s LIMIT 1",
                $reference,
                sanitize_key( $gateway )
            ),
            ARRAY_A
        );
    }

    public static function get_transactions( $args = array() ) {
        global $wpdb;

        $defaults = array(
            'page'     => 1,
            'per_page' => 10,
            'gateway'  => '',
            'status'   => '',
            'search'   => '',
        );

        $args = wp_parse_args( $args, $defaults );

        $transactions_table = $wpdb->prefix . 'boa_fee_transactions';
        $fees_table         = $wpdb->prefix . 'boa_fees';
        $students_table     = $wpdb->prefix . 'boa_students';

        $sql_select = "SELECT t.*, f.invoice_id, s.name AS student_name, s.email AS student_email";
        $sql_from   = " FROM $transactions_table AS t
                        LEFT JOIN $fees_table AS f ON t.fee_id = f.fee_id
                        LEFT JOIN $students_table AS s ON t.student_id = s.student_id";
        $sql_where  = " WHERE 1=1";
        $params     = array();

        if ( ! empty( $args['gateway'] ) ) {
            $sql_where .= " AND t.gateway = %s";
            $params[] = sanitize_key( $args['gateway'] );
        }

        if ( ! empty( $args['status'] ) ) {
            $sql_where .= " AND t.status = %s";
            $params[] = sanitize_text_field( $args['status'] );
        }

        if ( ! empty( $args['search'] ) ) {
            $like = '%' . $wpdb->esc_like( $args['search'] ) . '%';
            $sql_where .= " AND (t.transaction_reference LIKE %s OR f.invoice_id LIKE %s OR s.name LIKE %s)";
            $params[] = $like;
            $params[] = $like;
            $params[] = $like;
        }

        $total_sql = "SELECT COUNT(*) $sql_from $sql_where";
        if ( ! empty( $params ) ) {
            $total_sql = $wpdb->prepare( $total_sql, $params );
        }
        $total = (int) $wpdb->get_var( $total_sql );

        $offset = max( 0, ( $args['page'] - 1 ) * $args['per_page'] );
        $sql_order = " ORDER BY t.created_at DESC";
        $sql_limit = $wpdb->prepare( " LIMIT %d, %d", $offset, $args['per_page'] );

        $items_sql = $sql_select . $sql_from . $sql_where . $sql_order . $sql_limit;
        if ( ! empty( $params ) ) {
            $items_sql = $wpdb->prepare( $items_sql, $params );
        }

        $items = $wpdb->get_results( $items_sql, ARRAY_A );

        return array(
            'items' => $items ? $items : array(),
            'total' => $total,
        );
    }

    public static function add_fee_receipt( $fee_id, $student_id, $file_url, $file_name = '', $file_type = '', $file_hash = '' ) {
        global $wpdb;

        $table = $wpdb->prefix . 'boa_fee_receipts';

        return $wpdb->insert(
            $table,
            array(
                'fee_id'     => absint( $fee_id ),
                'student_id' => absint( $student_id ),
                'file_url'   => esc_url_raw( $file_url ),
                'file_name'  => sanitize_text_field( $file_name ),
                'file_type'  => sanitize_text_field( $file_type ),
                'file_hash'  => ! empty( $file_hash ) ? sanitize_text_field( $file_hash ) : null,
            ),
            array( '%d', '%d', '%s', '%s', '%s', '%s' )
        );
    }

    public static function get_fee_receipts( $fee_id ) {
        global $wpdb;

        $table = $wpdb->prefix . 'boa_fee_receipts';
        return $wpdb->get_results(
            $wpdb->prepare(
                "SELECT receipt_id, fee_id, file_url, file_name, file_type FROM $table WHERE fee_id = %d ORDER BY uploaded_at ASC",
                absint( $fee_id )
            ),
            ARRAY_A
        );
    }

    public static function get_fee_receipts_map( $fee_ids ) {
        global $wpdb;

        $fee_ids = array_filter( array_map( 'absint', (array) $fee_ids ) );
        if ( empty( $fee_ids ) ) {
            return array();
        }

        $placeholders = implode( ',', array_fill( 0, count( $fee_ids ), '%d' ) );
        $table        = $wpdb->prefix . 'boa_fee_receipts';

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT fee_id, file_url, file_name, file_type FROM $table WHERE fee_id IN ($placeholders) ORDER BY uploaded_at ASC",
                $fee_ids
            ),
            ARRAY_A
        );

        $map = array();
        if ( $rows ) {
            foreach ( $rows as $row ) {
                $fee_id = (int) $row['fee_id'];
                if ( ! isset( $map[ $fee_id ] ) ) {
                    $map[ $fee_id ] = array();
                }
                $map[ $fee_id ][] = $row;
            }
        }

        return $map;
    }

    public static function delete_fee_receipts( $fee_id ) {
        global $wpdb;

        $table = $wpdb->prefix . 'boa_fee_receipts';
        $wpdb->delete( $table, array( 'fee_id' => absint( $fee_id ) ), array( '%d' ) );
    }

    // ===== Notice Board =====

    public static function get_notices( $args = array() ) {
        global $wpdb;

        $defaults = array(
            'page'     => 1,
            'per_page' => 20,
            'status'   => '',
            'audience' => '',
            'search'   => '',
        );

        $args   = wp_parse_args( $args, $defaults );
        $table  = $wpdb->prefix . 'boa_notices';
        $where  = array( '1=1' );
        $params = array();

        if ( ! empty( $args['audience'] ) ) {
            $where[] = 'audience = %s';
            $params[] = sanitize_text_field( $args['audience'] );
        }

        if ( ! empty( $args['search'] ) ) {
            $search = '%' . $wpdb->esc_like( $args['search'] ) . '%';
            $where[] = '(title LIKE %s OR message LIKE %s)';
            $params[] = $search;
            $params[] = $search;
        }

        $today = current_time( 'Y-m-d' );
        if ( ! empty( $args['status'] ) ) {
            switch ( $args['status'] ) {
                case 'active':
                    $where[] = "is_active = 1 AND (start_date IS NULL OR start_date <= %s) AND (end_date IS NULL OR end_date >= %s)";
                    $params[] = $today;
                    $params[] = $today;
                    break;
                case 'scheduled':
                    $where[] = '(start_date IS NOT NULL AND start_date > %s)';
                    $params[] = $today;
                    break;
                case 'expired':
                    $where[] = '(end_date IS NOT NULL AND end_date < %s)';
                    $params[] = $today;
                    break;
                case 'inactive':
                    $where[] = 'is_active = 0';
                    break;
            }
        }

        $where_clause = implode( ' AND ', $where );
        $offset       = ( $args['page'] - 1 ) * $args['per_page'];

        $count_sql = "SELECT COUNT(*) FROM $table WHERE $where_clause";
        if ( ! empty( $params ) ) {
            $count_sql = $wpdb->prepare( $count_sql, $params );
        }
        $total = (int) $wpdb->get_var( $count_sql );

        $sql = "SELECT * FROM $table WHERE $where_clause ORDER BY is_active DESC, start_date DESC, priority DESC LIMIT %d, %d";
        $query_params = array_merge( $params, array( $offset, $args['per_page'] ) );
        $sql = $wpdb->prepare( $sql, $query_params );
        $items = $wpdb->get_results( $sql, ARRAY_A );

        return array(
            'items' => $items ? $items : array(),
            'total' => $total,
        );
    }

    public static function save_notice( $data ) {
        global $wpdb;

        $table     = $wpdb->prefix . 'boa_notices';
        $notice_id = isset( $data['notice_id'] ) ? absint( $data['notice_id'] ) : 0;
        $audience  = isset( $data['audience'] ) && in_array( $data['audience'], array( 'all', 'student', 'instructor' ), true )
            ? $data['audience']
            : 'all';
        $priority = isset( $data['priority'] ) && in_array( $data['priority'], array( 'low', 'normal', 'high', 'critical' ), true )
            ? $data['priority']
            : 'normal';

        $start_date = ! empty( $data['start_date'] ) ? sanitize_text_field( $data['start_date'] ) : null;
        $end_date   = ! empty( $data['end_date'] ) ? sanitize_text_field( $data['end_date'] ) : null;
        $is_active  = isset( $data['is_active'] ) ? (int) (bool) $data['is_active'] : 1;

        $fields = array(
            'title'     => sanitize_text_field( $data['title'] ?? '' ),
            'message'   => wp_kses_post( $data['message'] ?? '' ),
            'audience'  => $audience,
            'priority'  => $priority,
            'start_date'=> $start_date,
            'end_date'  => $end_date,
            'is_active' => $is_active,
        );

        if ( ! empty( $data['created_by'] ) ) {
            $fields['created_by'] = absint( $data['created_by'] );
        }

        $formats = array( '%s', '%s', '%s', '%s', '%s', '%s', '%d' );

        if ( $notice_id > 0 ) {
            $result = $wpdb->update( $table, $fields, array( 'notice_id' => $notice_id ), $formats, array( '%d' ) );
            return $result !== false ? $notice_id : new WP_Error( 'db_update_error', __( 'Unable to update notice.', 'baba-online-academy' ) );
        }

        $fields['created_at'] = current_time( 'mysql' );
        $formats[] = '%s';

        $result = $wpdb->insert( $table, $fields, $formats );
        return $result ? $wpdb->insert_id : new WP_Error( 'db_insert_error', __( 'Unable to add notice.', 'baba-online-academy' ) );
    }

    public static function delete_notice( $notice_id ) {
        global $wpdb;
        $notice_id = absint( $notice_id );
        if ( ! $notice_id ) {
            return false;
        }

        return $wpdb->delete(
            $wpdb->prefix . 'boa_notices',
            array( 'notice_id' => $notice_id ),
            array( '%d' )
        );
    }

    public static function get_active_notices_for_role( $role ) {
        global $wpdb;

        $role = sanitize_text_field( $role );
        $table = $wpdb->prefix . 'boa_notices';
        $today = current_time( 'Y-m-d' );

        $sql = "SELECT notice_id, title, message, priority, start_date, end_date
                FROM $table
                WHERE is_active = 1
                  AND (audience = %s OR audience = 'all')
                  AND (start_date IS NULL OR start_date <= %s)
                  AND (end_date IS NULL OR end_date >= %s)
                ORDER BY CASE priority
                    WHEN 'critical' THEN 1
                    WHEN 'high' THEN 2
                    WHEN 'normal' THEN 3
                    ELSE 4
                END, start_date DESC
                LIMIT 10";

        return $wpdb->get_results(
            $wpdb->prepare( $sql, $role, $today, $today ),
            ARRAY_A
        );
    }
    public static function get_fee_summary_stats() { 
        global $wpdb; $fees_table = $wpdb->prefix . 'boa_fees'; 
        $sql = " SELECT 
            SUM(CASE WHEN status = 'paid' AND MONTH(payment_date) = MONTH(CURDATE()) AND YEAR(payment_date) = YEAR(CURDATE()) THEN amount_paid ELSE 0 END) AS total_collected, 
            SUM(CASE WHEN status = 'pending' THEN (amount_due - amount_paid) ELSE 0 END) AS pending_amount, 
            COUNT(CASE WHEN status = 'overdue' THEN 1 ELSE NULL END) AS overdue_fees, 
            COUNT(CASE WHEN status = 'pending' AND due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE NULL END) AS upcoming_deadlines,
            SUM(CASE WHEN status = 'discounted' THEN amount_due ELSE 0 END) AS total_discounted 
            FROM $fees_table "; 
        $stats = $wpdb->get_row( $sql, ARRAY_A ); 
        return array( 
            'total_collected' => (float) ( $stats['total_collected'] ?? 0 ), 
            'pending_amount' => (float) ( $stats['pending_amount'] ?? 0 ), 
            'overdue_fees' => (int) ( $stats['overdue_fees'] ?? 0 ), 
            'upcoming_deadlines' => (int) ( $stats['upcoming_deadlines'] ?? 0 ),
            'total_discounted' => (float) ( $stats['total_discounted'] ?? 0 )
        ); 
    }

    public static function get_overdue_fees() {
        global $wpdb;

        $fees_table     = $wpdb->prefix . 'boa_fees';
        $students_table = $wpdb->prefix . 'boa_students';

        $sql = "SELECT f.*, s.name AS student_name, s.email, s.phone
                FROM $fees_table AS f
                LEFT JOIN $students_table AS s ON f.student_id = s.student_id
                WHERE f.status = 'pending'
                    AND f.due_date IS NOT NULL
                    AND f.due_date < CURDATE()";

        $results = $wpdb->get_results( $sql, ARRAY_A );
        return $results ? $results : array();
    }

    // ===== Quizzes =====
    public static function get_quizzes( $args = array() ) {
        global $wpdb;
        $defaults = array(
            'page'     => 1,
            'per_page' => 10,
            'search'   => '',
            'status'   => '',
            'course'   => 0,
        );
        $args = wp_parse_args( $args, $defaults );

        $quizzes_table = $wpdb->prefix . 'boa_quizzes';
        $courses_table = $wpdb->prefix . 'boa_courses';
        $sql_select = "SELECT q.*, c.course_name,
            (SELECT COUNT(*) FROM {$wpdb->prefix}boa_quiz_questions WHERE quiz_id = q.quiz_id) AS question_count";
        $sql_from   = " FROM $quizzes_table AS q LEFT JOIN $courses_table AS c ON q.course_id = c.course_id";
        $sql_where  = " WHERE 1=1";
        $params     = array();

        if ( ! empty( $args['search'] ) ) {
            $search = '%' . $wpdb->esc_like( $args['search'] ) . '%';
            $sql_where .= " AND (q.title LIKE %s OR c.course_name LIKE %s)";
            $params[] = $search;
            $params[] = $search;
        }

        if ( ! empty( $args['status'] ) ) {
            $sql_where .= " AND q.status = %s";
            $params[] = $args['status'];
        }

        if ( ! empty( $args['course'] ) ) {
            $sql_where .= " AND q.course_id = %d";
            $params[] = absint( $args['course'] );
        }

        $count_sql = "SELECT COUNT(*) $sql_from $sql_where";
        if ( ! empty( $params ) ) {
            $count_sql = $wpdb->prepare( $count_sql, $params );
        }
        $total = (int) $wpdb->get_var( $count_sql );

        $offset = ( $args['page'] - 1 ) * $args['per_page'];
        $limit  = $wpdb->prepare( ' LIMIT %d, %d', $offset, $args['per_page'] );
        $items_sql = $sql_select . $sql_from . $sql_where . ' ORDER BY q.created_at DESC' . $limit;
        if ( ! empty( $params ) ) {
            $items_sql = $wpdb->prepare( $items_sql, $params );
        }

        $items = $wpdb->get_results( $items_sql, ARRAY_A );

        return array(
            'items' => $items ?? array(),
            'total' => $total,
        );
    }

    public static function save_quiz( $data ) {
        global $wpdb;
        $table = $wpdb->prefix . 'boa_quizzes';
        $quiz_id = isset( $data['quiz_id'] ) ? absint( $data['quiz_id'] ) : 0;

        $fields = array(
            'course_id'       => absint( $data['course_id'] ?? 0 ),
            'title'           => sanitize_text_field( $data['title'] ?? '' ),
            'instructions'    => wp_kses_post( $data['instructions'] ?? '' ),
            'total_marks'     => isset( $data['total_marks'] ) ? (float) $data['total_marks'] : null,
            'pass_percentage' => isset( $data['pass_percentage'] ) ? (float) $data['pass_percentage'] : null,
            'time_limit'      => isset( $data['time_limit'] ) ? absint( $data['time_limit'] ) : null,
            'status'          => sanitize_text_field( $data['status'] ?? 'draft' ),
        );

        $formats = array( '%d', '%s', '%s', '%f', '%f', '%d', '%s' );

        if ( $quiz_id > 0 ) {
            $wpdb->update( $table, $fields, array( 'quiz_id' => $quiz_id ), $formats, array( '%d' ) );
            return $quiz_id;
        }

        $fields['created_at'] = current_time( 'mysql' );
        $formats[] = '%s';

        $result = $wpdb->insert( $table, $fields, $formats );
        return $result ? $wpdb->insert_id : false;
    }

    public static function delete_quiz( $quiz_id ) {
        global $wpdb;
        $quiz_id = absint( $quiz_id );
        if ( ! $quiz_id ) {
            return false;
        }

        $questions_table = $wpdb->prefix . 'boa_quiz_questions';
        $options_table   = $wpdb->prefix . 'boa_question_options';
        $attempts_table  = $wpdb->prefix . 'boa_quiz_attempts';
        $question_ids = $wpdb->get_col( $wpdb->prepare( "SELECT question_id FROM $questions_table WHERE quiz_id = %d", $quiz_id ) );

        if ( $question_ids ) {
            $ids = implode( ',', array_map( 'absint', $question_ids ) );
            $wpdb->query( "DELETE FROM $options_table WHERE question_id IN ($ids)" );
        }

        $wpdb->delete( $questions_table, array( 'quiz_id' => $quiz_id ), array( '%d' ) );
        $wpdb->delete( $attempts_table, array( 'quiz_id' => $quiz_id ), array( '%d' ) );

        return $wpdb->delete( $wpdb->prefix . 'boa_quizzes', array( 'quiz_id' => $quiz_id ), array( '%d' ) );
    }

    public static function get_quiz_questions( $quiz_id ) {
        global $wpdb;
        $quiz_id = absint( $quiz_id );
        if ( ! $quiz_id ) {
            return array();
        }

        $questions_table = $wpdb->prefix . 'boa_quiz_questions';
        $options_table   = $wpdb->prefix . 'boa_question_options';
        $questions = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM $questions_table WHERE quiz_id = %d ORDER BY question_order ASC, question_id ASC",
                $quiz_id
            ),
            ARRAY_A
        );

        if ( empty( $questions ) ) {
            return array();
        }

        $question_ids = wp_list_pluck( $questions, 'question_id' );
        $placeholders = implode( ',', array_fill( 0, count( $question_ids ), '%d' ) );
        $options = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM $options_table WHERE question_id IN ($placeholders) ORDER BY option_order ASC, option_id ASC",
                $question_ids
            ),
            ARRAY_A
        );

        $option_map = array();
        if ( $options ) {
            foreach ( $options as $option ) {
                $option_map[ $option['question_id'] ][] = $option;
            }
        }

        foreach ( $questions as &$question ) {
            $question_id = (int) $question['question_id'];
            $question['options'] = $option_map[ $question_id ] ?? array();
        }

        return $questions;
    }

    public static function save_quiz_question( $data ) {
        global $wpdb;
        $questions_table = $wpdb->prefix . 'boa_quiz_questions';
        $options_table   = $wpdb->prefix . 'boa_question_options';
        $question_id = isset( $data['question_id'] ) ? absint( $data['question_id'] ) : 0;

        $fields = array(
            'quiz_id'        => absint( $data['quiz_id'] ?? 0 ),
            'question_text'  => wp_kses_post( $data['question_text'] ?? '' ),
            'question_type'  => sanitize_text_field( $data['question_type'] ?? 'mcq' ),
            'marks'          => isset( $data['marks'] ) ? (float) $data['marks'] : 1.0,
            'question_order' => isset( $data['question_order'] ) ? absint( $data['question_order'] ) : 0,
        );

        if ( $question_id > 0 ) {
            $wpdb->update( $questions_table, $fields, array( 'question_id' => $question_id ), array( '%d', '%s', '%s', '%f', '%d' ), array( '%d' ) );
        } else {
            $wpdb->insert( $questions_table, $fields, array( '%d', '%s', '%s', '%f', '%d' ) );
            $question_id = $wpdb->insert_id;
        }

        if ( empty( $question_id ) ) {
            return false;
        }

        if ( isset( $data['options'] ) && is_array( $data['options'] ) ) {
            $wpdb->delete( $options_table, array( 'question_id' => $question_id ), array( '%d' ) );
            $order = 0;
            foreach ( $data['options'] as $option ) {
                if ( empty( $option['option_text'] ) ) {
                    continue;
                }
                $wpdb->insert(
                    $options_table,
                    array(
                        'question_id'  => $question_id,
                        'option_text'  => wp_kses_post( $option['option_text'] ),
                        'is_correct'   => ! empty( $option['is_correct'] ) ? 1 : 0,
                        'option_order' => $order++,
                    ),
                    array( '%d', '%s', '%d', '%d' )
                );
            }
        }

        return $question_id;
    }

    public static function delete_quiz_question( $question_id ) {
        global $wpdb;
        $question_id = absint( $question_id );
        if ( ! $question_id ) {
            return false;
        }
        $wpdb->delete( $wpdb->prefix . 'boa_question_options', array( 'question_id' => $question_id ), array( '%d' ) );
        return $wpdb->delete( $wpdb->prefix . 'boa_quiz_questions', array( 'question_id' => $question_id ), array( '%d' ) );
    }

    public static function record_quiz_attempt( $quiz_id, $student_id, $score, $total, $answers = array() ) {
        global $wpdb;
        $table = $wpdb->prefix . 'boa_quiz_attempts';

        return $wpdb->insert(
            $table,
            array(
                'quiz_id'     => absint( $quiz_id ),
                'student_id'  => absint( $student_id ),
                'score'       => (float) $score,
                'total_marks' => (float) $total,
                'answers'     => wp_json_encode( $answers ),
                'attempt_date'=> current_time( 'mysql' ),
            ),
            array( '%d', '%d', '%f', '%f', '%s', '%s' )
        );
    }

    public static function get_student_quizzes( $student_id ) {
        global $wpdb;
        $student_id = absint( $student_id );
        if ( ! $student_id ) {
            return array();
        }

        $students_table = $wpdb->prefix . 'boa_students';
        $quizzes_table  = $wpdb->prefix . 'boa_quizzes';
        $courses_table  = $wpdb->prefix . 'boa_courses';
        $attempts_table = $wpdb->prefix . 'boa_quiz_attempts';

        $sql = $wpdb->prepare(
            "SELECT q.*, c.course_name,
                (SELECT attempt_id FROM $attempts_table WHERE quiz_id = q.quiz_id AND student_id = %d ORDER BY attempt_date DESC LIMIT 1) AS attempt_id,
                (SELECT score FROM $attempts_table WHERE quiz_id = q.quiz_id AND student_id = %d ORDER BY attempt_date DESC LIMIT 1) AS last_score
             FROM $quizzes_table q
             JOIN $students_table s ON q.course_id = s.course_id
             LEFT JOIN $courses_table c ON q.course_id = c.course_id
             WHERE s.student_id = %d AND q.status = 'published'
             ORDER BY q.created_at DESC",
            $student_id,
            $student_id,
            $student_id
        );

        return $wpdb->get_results( $sql, ARRAY_A ) ?: array();
    }

    public static function get_quiz_with_questions( $quiz_id, $student_id ) {
        global $wpdb;
        $quiz_id = absint( $quiz_id );
        $student_id = absint( $student_id );
        if ( ! $quiz_id || ! $student_id ) {
            return null;
        }

        $quizzes_table = $wpdb->prefix . 'boa_quizzes';
        $students_table = $wpdb->prefix . 'boa_students';

        $quiz = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT q.* FROM $quizzes_table q
                 JOIN $students_table s ON q.course_id = s.course_id
                 WHERE q.quiz_id = %d AND s.student_id = %d AND q.status = 'published'",
                $quiz_id,
                $student_id
            ),
            ARRAY_A
        );

        if ( ! $quiz ) {
            return null;
        }

        $quiz['questions'] = self::get_quiz_questions( $quiz_id );
        return $quiz;
    }

    // ===== Assignments =====
    public static function get_assignments( $args = array() ) {
        global $wpdb;
        $defaults = array(
            'page'     => 1,
            'per_page' => 10,
            'search'   => '',
            'course'   => 0,
            'status'   => '',
        );
        $args = wp_parse_args( $args, $defaults );

        $assignments_table = $wpdb->prefix . 'boa_assignments';
        $courses_table     = $wpdb->prefix . 'boa_courses';
        $sql_select = "SELECT a.*, c.course_name";
        $sql_from   = " FROM $assignments_table a LEFT JOIN $courses_table c ON a.course_id = c.course_id";
        $sql_where  = " WHERE 1=1";
        $params     = array();

        if ( ! empty( $args['search'] ) ) {
            $search = '%' . $wpdb->esc_like( $args['search'] ) . '%';
            $sql_where .= " AND (a.title LIKE %s OR c.course_name LIKE %s)";
            $params[] = $search;
            $params[] = $search;
        }

        if ( ! empty( $args['course'] ) ) {
            $sql_where .= " AND a.course_id = %d";
            $params[] = absint( $args['course'] );
        }

        if ( ! empty( $args['status'] ) ) {
            $sql_where .= " AND a.status = %s";
            $params[] = sanitize_text_field( $args['status'] );
        }

        $count_sql = "SELECT COUNT(*) $sql_from $sql_where";
        if ( ! empty( $params ) ) {
            $count_sql = $wpdb->prepare( $count_sql, $params );
        }
        $total = (int) $wpdb->get_var( $count_sql );

        $offset = ( $args['page'] - 1 ) * $args['per_page'];
        $limit  = $wpdb->prepare( ' LIMIT %d, %d', $offset, $args['per_page'] );
        $items_sql = $sql_select . $sql_from . $sql_where . ' ORDER BY a.created_at DESC' . $limit;
        if ( ! empty( $params ) ) {
            $items_sql = $wpdb->prepare( $items_sql, $params );
        }

        $items = $wpdb->get_results( $items_sql, ARRAY_A );

        return array(
            'items' => $items ?? array(),
            'total' => $total,
        );
    }

    public static function save_assignment( $data ) {
        global $wpdb;
        $table = $wpdb->prefix . 'boa_assignments';
        $assignment_id = isset( $data['assignment_id'] ) ? absint( $data['assignment_id'] ) : 0;

        $fields = array(
            'course_id'      => absint( $data['course_id'] ?? 0 ),
            'title'          => sanitize_text_field( $data['title'] ?? '' ),
            'description'    => wp_kses_post( $data['description'] ?? '' ),
            'instructions'   => wp_kses_post( $data['instructions'] ?? '' ),
            'attachment_url' => esc_url_raw( $data['attachment_url'] ?? '' ),
            'max_marks'      => isset( $data['max_marks'] ) ? (float) $data['max_marks'] : null,
            'due_date'       => ! empty( $data['due_date'] ) ? sanitize_text_field( $data['due_date'] ) : null,
            'status'         => sanitize_text_field( $data['status'] ?? 'published' ),
        );

        $formats = array( '%d', '%s', '%s', '%s', '%s', '%f', '%s', '%s' );

        if ( $assignment_id > 0 ) {
            $wpdb->update( $table, $fields, array( 'assignment_id' => $assignment_id ), $formats, array( '%d' ) );
            return $assignment_id;
        }

        $fields['created_at'] = current_time( 'mysql' );
        $formats[] = '%s';
        $wpdb->insert( $table, $fields, $formats );
        return $wpdb->insert_id;
    }

    public static function delete_assignment( $assignment_id ) {
        global $wpdb;
        $assignment_id = absint( $assignment_id );
        if ( ! $assignment_id ) {
            return false;
        }
        $wpdb->delete( $wpdb->prefix . 'boa_assignment_submissions', array( 'assignment_id' => $assignment_id ), array( '%d' ) );
        return $wpdb->delete( $wpdb->prefix . 'boa_assignments', array( 'assignment_id' => $assignment_id ), array( '%d' ) );
    }

    public static function get_assignment_submissions( $assignment_id ) {
        global $wpdb;
        $assignment_id = absint( $assignment_id );
        if ( ! $assignment_id ) {
            return array();
        }

        $submissions_table = $wpdb->prefix . 'boa_assignment_submissions';
        $students_table    = $wpdb->prefix . 'boa_students';

        $sql = $wpdb->prepare(
            "SELECT s.*, st.name AS student_name, st.email AS student_email
             FROM $submissions_table s
             LEFT JOIN $students_table st ON s.student_id = st.student_id
             WHERE s.assignment_id = %d ORDER BY s.submission_date DESC",
            $assignment_id
        );

        return $wpdb->get_results( $sql, ARRAY_A ) ?: array();
    }

    public static function save_assignment_submission( $data ) {
        global $wpdb;
        $table = $wpdb->prefix . 'boa_assignment_submissions';

        $assignment_id = absint( $data['assignment_id'] ?? 0 );
        $student_id    = absint( $data['student_id'] ?? 0 );
        if ( ! $assignment_id || ! $student_id ) {
            return false;
        }

        $existing = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT submission_id FROM $table WHERE assignment_id = %d AND student_id = %d LIMIT 1",
                $assignment_id,
                $student_id
            )
        );

        $fields = array(
            'assignment_id' => $assignment_id,
            'student_id'    => $student_id,
            'file_url'      => esc_url_raw( $data['file_url'] ?? '' ),
            'status'        => 'submitted',
            'submission_date' => current_time( 'mysql' ),
        );

        if ( $existing ) {
            $wpdb->update( $table, $fields, array( 'submission_id' => $existing ), array( '%d', '%d', '%s', '%s', '%s' ), array( '%d' ) );
            return $existing;
        }

        $wpdb->insert( $table, $fields, array( '%d', '%d', '%s', '%s', '%s' ) );
        return $wpdb->insert_id;
    }

    public static function grade_assignment_submission( $submission_id, $marks = null, $remarks = '', $status = 'graded', $feedback = '' ) {
        global $wpdb;
        $submission_id = absint( $submission_id );
        if ( ! $submission_id ) {
            return false;
        }

        $fields = array(
            'status'  => sanitize_text_field( $status ),
            'remarks' => wp_kses_post( $remarks ),
            'feedback'=> wp_kses_post( $feedback ),
        );
        if ( null !== $marks ) {
            $fields['marks'] = (float) $marks;
        }

        return $wpdb->update(
            $wpdb->prefix . 'boa_assignment_submissions',
            $fields,
            array( 'submission_id' => $submission_id ),
            null,
            array( '%d' )
        );
    }

    public static function get_student_assignments( $student_id ) {
        global $wpdb;
        $student_id = absint( $student_id );
        if ( ! $student_id ) {
            return array();
        }

        $students_table    = $wpdb->prefix . 'boa_students';
        $assignments_table = $wpdb->prefix . 'boa_assignments';
        $submissions_table = $wpdb->prefix . 'boa_assignment_submissions';

        $sql = $wpdb->prepare(
            "SELECT a.*, c.course_name,
                (SELECT submission_id FROM $submissions_table WHERE assignment_id = a.assignment_id AND student_id = %d LIMIT 1) AS submission_id,
                (SELECT file_url FROM $submissions_table WHERE assignment_id = a.assignment_id AND student_id = %d LIMIT 1) AS submission_file,
                (SELECT status FROM $submissions_table WHERE assignment_id = a.assignment_id AND student_id = %d LIMIT 1) AS submission_status,
                (SELECT marks FROM $submissions_table WHERE assignment_id = a.assignment_id AND student_id = %d LIMIT 1) AS submission_marks
             FROM $assignments_table a
             JOIN $students_table s ON a.course_id = s.course_id
             LEFT JOIN {$wpdb->prefix}boa_courses c ON a.course_id = c.course_id
             WHERE s.student_id = %d AND a.status IN ('published','draft')
             ORDER BY a.due_date ASC, a.created_at DESC",
            $student_id,
            $student_id,
            $student_id,
            $student_id,
            $student_id
        );

        return $wpdb->get_results( $sql, ARRAY_A ) ?: array();
    }
    
    /**
     * نیا: جزوی ڈسکاؤنٹ فنکشن
     * فیس انٹری کو تقسیم کرتا ہے
     */
    public static function apply_partial_discount( $fee_id, $discount_amount ) {
        global $wpdb;
        $fees_table = $wpdb->prefix . 'boa_fees';
        $fee_id = absint( $fee_id );
        $discount_amount = (float) $discount_amount;

        // 1. اصل فیس انٹری حاصل کریں
        $original_fee = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $fees_table WHERE fee_id = %d", $fee_id ), ARRAY_A );

        if ( ! $original_fee ) {
            return new WP_Error( 'not_found', 'Original fee record not found.' );
        }

        $original_amount_due = (float) $original_fee['amount_due'];

        // 2. ویلیڈیشن
        if ( $discount_amount <= 0 ) {
            return new WP_Error( 'invalid_amount', 'Discount amount must be greater than zero.' );
        }
        if ( $discount_amount > $original_amount_due ) {
            return new WP_Error( 'invalid_amount', 'Discount cannot be greater than the due amount.' );
        }

        // 3. منطق (Logic)
        if ( $discount_amount == $original_amount_due ) {
            // اگر ڈسکاؤنٹ پوری رقم کا ہے، تو صرف اسٹیٹس اپ ڈیٹ کریں
            $result = $wpdb->update(
                $fees_table,
                array( 'status' => 'discounted' ),
                array( 'fee_id' => $fee_id ),
                array( '%s' ),
                array( '%d' )
            );
            return $result !== false;

        } else {
            // اگر ڈسکاؤنٹ جزوی ہے، تو انٹری کو تقسیم کریں
            
            // 3a. اصل انٹری کو اپ ڈیٹ کریں (نئی بقایا رقم کے ساتھ)
            $new_due_amount = $original_amount_due - $discount_amount;
            $wpdb->update(
                $fees_table,
                array( 'amount_due' => $new_due_amount ),
                array( 'fee_id' => $fee_id ),
                array( '%f' ),
                array( '%d' )
            );

            // 3b. ڈسکاؤنٹ کے لیے نئی انٹری بنائیں
            $discount_entry = $original_fee;
            unset( $discount_entry['fee_id'] ); // ID ہٹائیں تاکہ نئی انٹری بنے
            $discount_entry['amount_due'] = $discount_amount;
            $discount_entry['amount_paid'] = 0.00;
            $discount_entry['status'] = 'discounted';
            $discount_entry['payment_date'] = null;
            $discount_entry['receipt_url'] = null;
            $discount_entry['invoice_id'] = $original_fee['invoice_id'] . '-DISC'; // انوائس ID میں فرق کریں
            $discount_entry['created_at'] = current_time( 'mysql' );

            $result = $wpdb->insert( $fees_table, $discount_entry );
            return $result !== false;
        }
    }


    public static function get_fee_status_snapshot() { global $wpdb; $table_name = $wpdb->prefix . 'boa_fees'; $sql = "SELECT status, COUNT(fee_id) as count FROM $table_name GROUP BY status"; $results = $wpdb->get_results( $sql, ARRAY_A ); return $results ? $results : array(); }
    public static function get_today_collections() { global $wpdb; $fees_table = $wpdb->prefix . 'boa_fees'; $students_table = $wpdb->prefix . 'boa_students'; $courses_table = $wpdb->prefix . 'boa_courses'; $sql = $wpdb->prepare( " SELECT f.amount_paid, f.created_at, s.name as student_name, c.course_name FROM $fees_table AS f LEFT JOIN $students_table AS s ON f.student_id = s.student_id LEFT JOIN $courses_table AS c ON f.course_id = c.course_id WHERE f.status = 'paid' AND DATE(f.payment_date) = CURDATE() ORDER BY f.created_at DESC LIMIT %d", 5 ); $results = $wpdb->get_results( $sql, ARRAY_A ); return $results ? $results : array(); }
    public static function get_fees_upcoming_deadlines_list() { global $wpdb; $fees_table = $wpdb->prefix . 'boa_fees'; $students_table = $wpdb->prefix . 'boa_students'; $courses_table = $wpdb->prefix . 'boa_courses'; $sql = $wpdb->prepare( " SELECT f.due_date, f.status, f.amount_due, s.name as student_name, c.course_name FROM $fees_table AS f LEFT JOIN $students_table AS s ON f.student_id = s.student_id LEFT JOIN $courses_table AS c ON f.course_id = c.course_id WHERE (f.status = 'pending' OR f.status = 'overdue') AND f.due_date >= CURDATE() ORDER BY f.due_date ASC LIMIT %d", 5 ); $results = $wpdb->get_results( $sql, ARRAY_A ); return $results ? $results : array(); }
    public static function get_pending_admissions( $args = array() ) {
        global $wpdb;
        $defaults = array( 'page' => 1, 'per_page' => 10 );
        $args = wp_parse_args( $args, $defaults );
        $fees_table = $wpdb->prefix . 'boa_fees';
        $students_table = $wpdb->prefix . 'boa_students';
        $courses_table = $wpdb->prefix . 'boa_courses';
        $sql_select = "SELECT f.*, s.name as student_name, s.email as student_email, s.phone as phone, c.course_name";
        $sql_from = "FROM $fees_table AS f
                     LEFT JOIN $students_table AS s ON f.student_id = s.student_id
                     LEFT JOIN $courses_table AS c ON f.course_id = c.course_id";
        $sql_where = "WHERE f.status = 'pending_review'";
        $total_items_sql = "SELECT COUNT(f.fee_id) $sql_from $sql_where";
        $total_items = (int) $wpdb->get_var( $total_items_sql );

        $sql_order = "ORDER BY f.created_at ASC";
        $sql_limit = "LIMIT %d, %d";
        $params    = array(
            ( $args['page'] - 1 ) * $args['per_page'],
            $args['per_page'],
        );

        $full_sql = "$sql_select $sql_from $sql_where $sql_order $sql_limit";
        $items    = $wpdb->get_results( $wpdb->prepare( $full_sql, $params ), ARRAY_A );

        if ( $items ) {
            $fee_ids      = wp_list_pluck( $items, 'fee_id' );
            $receipts_map = self::get_fee_receipts_map( $fee_ids );

            foreach ( $items as &$item ) {
                $fee_id            = (int) $item['fee_id'];
                $item['receipts'] = isset( $receipts_map[ $fee_id ] ) ? $receipts_map[ $fee_id ] : array();
            }
        }

        return array(
            'items' => $items ? $items : array(),
            'total' => $total_items,
        );
    }


    // ===== نیا: اخراجات ہیلپرز =====
    public static function get_expenses( $args = array() ) {
        global $wpdb;
        $defaults = array( 'page' => 1, 'per_page' => 10 );
        $args = wp_parse_args( $args, $defaults );
        
        $table_name = $wpdb->prefix . 'boa_expenses';
        
        $total_items = $wpdb->get_var( "SELECT COUNT(expense_id) FROM $table_name" );
        
        $sql = $wpdb->prepare(
            "SELECT * FROM $table_name ORDER BY expense_date DESC LIMIT %d, %d",
            ( $args['page'] - 1 ) * $args['per_page'],
            $args['per_page']
        );
        $items = $wpdb->get_results( $sql, ARRAY_A );

        return array( 'items' => $items ? $items : array(), 'total' => (int) $total_items );
    }

    public static function save_expense( $data ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'boa_expenses';
        $expense_id = isset( $data['expense_id'] ) && ! empty( $data['expense_id'] ) ? absint( $data['expense_id'] ) : 0;

        $fields = array(
            'title' => sanitize_text_field( $data['title'] ),
            'category' => sanitize_text_field( $data['category'] ),
            'amount' => (float) $data['amount'],
            'expense_date' => sanitize_text_field( $data['expense_date'] ),
            'notes' => sanitize_textarea_field( $data['notes'] ),
        );
        $formats = array( '%s', '%s', '%f', '%s', '%s' );

        if ( $expense_id > 0 ) {
            $result = $wpdb->update( $table_name, $fields, array( 'expense_id' => $expense_id ), $formats, array( '%d' ) );
            return $result !== false ? $expense_id : new WP_Error( 'db_update_error', 'Could not update expense.' );
        } else {
            $fields['created_at'] = current_time( 'mysql' );
            $formats[] = '%s';
            $result = $wpdb->insert( $table_name, $fields, $formats );
            return $result ? $wpdb->insert_id : new WP_Error( 'db_insert_error', 'Could not add expense.' );
        }
    }

    public static function delete_expense( $expense_id ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'boa_expenses';
        return $wpdb->delete( $table_name, array( 'expense_id' => absint( $expense_id ) ), array( '%d' ) );
    }

    // ===== Reports Helpers (نئے فنکشنز) =====
    private static function build_report_query_parts( $filters ) {
        global $wpdb;
        $fees_table = $wpdb->prefix . 'boa_fees';
        $students_table = $wpdb->prefix . 'boa_students';
        $courses_table = $wpdb->prefix . 'boa_courses';
        $categories_table = $wpdb->prefix . 'boa_categories';
        $sql_from = "FROM $fees_table AS f
                     LEFT JOIN $students_table AS s ON f.student_id = s.student_id
                     LEFT JOIN $courses_table AS c ON f.course_id = c.course_id
                     LEFT JOIN $categories_table AS cat ON c.category_id = cat.category_id";
        $sql_where = "WHERE f.status = 'paid'"; 
        $params = array();
        if ( ! empty( $filters['dateFrom'] ) ) { $sql_where .= " AND f.payment_date >= %s"; $params[] = $filters['dateFrom']; }
        if ( ! empty( $filters['dateTo'] ) ) { $sql_where .= " AND f.payment_date <= %s"; $params[] = $filters['dateTo']; }
        if ( ! empty( $filters['course'] ) ) { $sql_where .= " AND f.course_id = %d"; $params[] = $filters['course']; }
        if ( ! empty( $filters['category'] ) ) { $sql_where .= " AND c.category_id = %d"; $params[] = $filters['category']; }
        return array( 'from' => $sql_from, 'where' => $sql_where, 'params' => $params );
    }
    public static function get_report_income_trend( $filters ) {
        global $wpdb;
        $query_parts = self::build_report_query_parts( $filters );
        $sql = "SELECT DATE_FORMAT(f.payment_date, '%Y-%m') AS month, SUM(f.amount_paid) AS total
                {$query_parts['from']}
                {$query_parts['where']}
                GROUP BY month ORDER BY month ASC";
        if ( ! empty( $query_parts['params'] ) ) {
            $sql = $wpdb->prepare( $sql, $query_parts['params'] );
        }
        $results = $wpdb->get_results( $sql, ARRAY_A );
        $labels = array(); $data = array();
        if ($results) { foreach ($results as $row) { $labels[] = date( 'M Y', strtotime( $row['month'] . '-01' ) ); $data[] = (float) $row['total']; } }
        return array( 'labels' => $labels, 'data' => $data );
    }
    public static function get_report_course_income_summary( $filters ) {
        global $wpdb;
        $query_parts = self::build_report_query_parts( $filters );
        $sql = "SELECT c.course_name, SUM(f.amount_paid) AS total
                {$query_parts['from']}
                {$query_parts['where']}
                GROUP BY f.course_id ORDER BY total DESC LIMIT 5";
        if ( ! empty( $query_parts['params'] ) ) {
            $sql = $wpdb->prepare( $sql, $query_parts['params'] );
        }
        $results = $wpdb->get_results( $sql, ARRAY_A );
        $labels = array(); $data = array();
        if ($results) { foreach ($results as $row) { $labels[] = $row['course_name']; $data[] = (float) $row['total']; } }
        return array( 'labels' => $labels, 'data' => $data );
    }
    public static function get_report_income_details( $filters ) {
        global $wpdb;
        $query_parts = self::build_report_query_parts( $filters );
        $sql = "SELECT f.payment_date, s.name as student_name, c.course_name, f.amount_paid, f.status
                {$query_parts['from']}
                {$query_parts['where']}
                ORDER BY f.payment_date DESC";
        if ( ! empty( $query_parts['params'] ) ) {
            $sql = $wpdb->prepare( $sql, $query_parts['params'] );
        }
        $results = $wpdb->get_results( $sql, ARRAY_A );
        return $results ? $results : array();
    }

    private static function build_expense_query( $filters ) {
        global $wpdb;
        $table = $wpdb->prefix . 'boa_expenses';
        $where = "WHERE 1=1";
        $params = array();

        if ( ! empty( $filters['dateFrom'] ) ) {
            $where .= " AND expense_date >= %s";
            $params[] = $filters['dateFrom'];
        }

        if ( ! empty( $filters['dateTo'] ) ) {
            $where .= " AND expense_date <= %s";
            $params[] = $filters['dateTo'];
        }

        if ( ! empty( $filters['category'] ) ) {
            $where .= " AND category = %s";
            $params[] = $filters['category'];
        }

        return array( 'table' => $table, 'where' => $where, 'params' => $params );
    }

    private static function get_expense_total( $filters ) {
        global $wpdb;
        $parts = self::build_expense_query( $filters );
        $sql   = "SELECT SUM(amount) FROM {$parts['table']} {$parts['where']}";

        if ( ! empty( $parts['params'] ) ) {
            $sql = $wpdb->prepare( $sql, $parts['params'] );
        }

        return (float) $wpdb->get_var( $sql );
    }

    private static function get_income_total( $filters ) {
        global $wpdb;

        $query_parts = self::build_report_query_parts( $filters );
        $sql = "SELECT SUM(f.amount_paid) AS total
                {$query_parts['from']}
                {$query_parts['where']}";

        if ( ! empty( $query_parts['params'] ) ) {
            $sql = $wpdb->prepare( $sql, $query_parts['params'] );
        }

        return (float) $wpdb->get_var( $sql );
    }

    public static function get_expense_summary( $filters = array() ) {
        global $wpdb;

        $filtered_total = self::get_expense_total( $filters );
        $table          = $wpdb->prefix . 'boa_expenses';

        $current_month_total = (float) $wpdb->get_var(
            "SELECT SUM(amount) FROM $table WHERE DATE_FORMAT(expense_date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')"
        );

        $previous_month_total = (float) $wpdb->get_var(
            "SELECT SUM(amount) FROM $table WHERE DATE_FORMAT(expense_date, '%Y-%m') = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m')"
        );

        $difference = $current_month_total - $previous_month_total;

        return array(
            'filtered_total'     => $filtered_total,
            'current_month'      => $current_month_total,
            'previous_month'     => $previous_month_total,
            'difference'         => $difference,
            'difference_percent' => $previous_month_total > 0 ? round( ( $difference / $previous_month_total ) * 100, 2 ) : 0,
        );
    }

    public static function get_expense_breakdown( $filters = array() ) {
        global $wpdb;
        $parts = self::build_expense_query( $filters );

        $sql = "SELECT category, SUM(amount) AS total
                FROM {$parts['table']}
                {$parts['where']}
                GROUP BY category
                ORDER BY total DESC";

        if ( ! empty( $parts['params'] ) ) {
            $sql = $wpdb->prepare( $sql, $parts['params'] );
        }

        $results = $wpdb->get_results( $sql, ARRAY_A );
        return $results ? $results : array();
    }

    public static function get_profit_snapshot( $filters = array() ) {
        $income   = self::get_income_total( $filters );
        $expenses = self::get_expense_total( $filters );
        $net      = $income - $expenses;

        return array(
            'income'        => $income,
            'expenses'      => $expenses,
            'net_profit'    => $net,
            'profit_margin' => $income > 0 ? round( ( $net / $income ) * 100, 2 ) : 0,
        );
    }
    
    // ===== ENHANCED FEATURES FUNCTIONS =====
    
    /**
     * Check if student already submitted form for this course
     */
    public static function check_form_submission_exists( $email, $course_id, $phone = '' ) {
        global $wpdb;

        $table_name  = $wpdb->prefix . 'boa_form_submissions';
        $course_id   = absint( $course_id );
        $email       = sanitize_email( $email );
        $phone_value = sanitize_text_field( $phone );

        $conditions = array( '(email = %s AND course_id = %d)' );
        $params     = array( $email, $course_id );

        if ( ! empty( $phone_value ) ) {
            $conditions[] = '(phone = %s AND course_id = %d)';
            $params[]     = $phone_value;
            $params[]     = $course_id;
        }

        $sql = "SELECT submission_id FROM $table_name WHERE " . implode( ' OR ', $conditions ) . ' LIMIT 1';
        $result = $wpdb->get_var( $wpdb->prepare( $sql, $params ) );
        return $result ? true : false;
    }

    public static function get_form_submission_conflict( $email, $phone, $course_id ) {
        global $wpdb;

        $table_name = $wpdb->prefix . 'boa_form_submissions';
        $course_id  = absint( $course_id );

        if ( ! empty( $email ) ) {
            $exists = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT submission_id FROM $table_name WHERE email = %s AND course_id = %d LIMIT 1",
                    sanitize_email( $email ),
                    $course_id
                )
            );
            if ( $exists ) {
                return 'email';
            }
        }

        if ( ! empty( $phone ) ) {
            $exists = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT submission_id FROM $table_name WHERE phone = %s AND course_id = %d LIMIT 1",
                    sanitize_text_field( $phone ),
                    $course_id
                )
            );
            if ( $exists ) {
                return 'phone';
            }
        }

        return false;
    }
    
    /**
     * Get form submission details
     */
    public static function get_form_submission( $submission_id ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'boa_form_submissions';
        return $wpdb->get_row( $wpdb->prepare( 
            "SELECT * FROM $table_name WHERE submission_id = %d", 
            $submission_id 
        ), ARRAY_A );
    }
    
    /**
     * Get student submissions by email
     */
    public static function get_student_submissions( $email ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'boa_form_submissions';
        $courses_table = $wpdb->prefix . 'boa_courses';
        return $wpdb->get_results( $wpdb->prepare( 
            "SELECT fs.*, c.course_name FROM $table_name fs 
             LEFT JOIN $courses_table c ON fs.course_id = c.course_id 
             WHERE fs.email = %s ORDER BY fs.submission_date DESC", 
            $email 
        ), ARRAY_A );
    }

    public static function get_applicant_history( $email = '', $phone = '' ) {
        global $wpdb;
        $email = sanitize_email( $email );
        $phone = sanitize_text_field( $phone );

        $history = array(
            'submissions' => array(),
            'enrollments' => array(),
        );

        $submissions_table = $wpdb->prefix . 'boa_form_submissions';
        $courses_table     = $wpdb->prefix . 'boa_courses';

        $conditions = array();
        $params     = array();

        if ( ! empty( $email ) ) {
            $conditions[] = 'fs.email = %s';
            $params[]     = $email;
        }
        if ( ! empty( $phone ) ) {
            $conditions[] = 'fs.phone = %s';
            $params[]     = $phone;
        }

        if ( $conditions ) {
            $where = implode( ' OR ', $conditions );
            $sql   = "SELECT fs.submission_id, fs.course_id, fs.student_name, fs.email, fs.phone, fs.status, fs.submission_date, c.course_name 
                      FROM $submissions_table fs
                      LEFT JOIN $courses_table c ON fs.course_id = c.course_id
                      WHERE $where
                      ORDER BY fs.submission_date DESC
                      LIMIT 5";
            $history['submissions'] = $wpdb->get_results( $wpdb->prepare( $sql, $params ), ARRAY_A );
        }

        $students_table = $wpdb->prefix . 'boa_students';
        $student_conditions = array();
        $student_params     = array();

        if ( ! empty( $email ) ) {
            $student_conditions[] = 's.email = %s';
            $student_params[]     = $email;
        }
        if ( ! empty( $phone ) ) {
            $student_conditions[] = 's.phone = %s';
            $student_params[]     = $phone;
        }

        if ( $student_conditions ) {
            $where = implode( ' OR ', $student_conditions );
            $sql   = "SELECT s.student_id, s.name, s.email, s.phone, s.status, s.admission_date, c.course_name
                      FROM $students_table s
                      LEFT JOIN $courses_table c ON s.course_id = c.course_id
                      WHERE $where
                      ORDER BY s.admission_date DESC
                      LIMIT 5";
            $history['enrollments'] = $wpdb->get_results( $wpdb->prepare( $sql, $student_params ), ARRAY_A );
        }

        return $history;
    }
    
    /**
     * Add new form submission
     */
    public static function add_form_submission( $data ) {
        global $wpdb;


        $table_name = $wpdb->prefix . 'boa_form_submissions';

        $conflict   = self::get_form_submission_conflict( $data['email'], $data['phone'], $data['course_id'] );



        if ( $conflict === 'email' ) {

            return new WP_Error( 'duplicate_submission', __( 'This email has already been used for this course.', 'baba-online-academy' ) );

        } elseif ( $conflict === 'phone' ) {

            return new WP_Error( 'duplicate_submission', __( 'This phone number has already been used for this course.', 'baba-online-academy' ) );

        }



        $tracking_token = self::generate_tracking_token();



        $insert_data = array(

            'student_id'           => isset( $data['student_id'] ) ? absint( $data['student_id'] ) : null,

            'email'                => sanitize_email( $data['email'] ),

            'phone'                => sanitize_text_field( $data['phone'] ),

            'course_id'            => absint( $data['course_id'] ),

            'student_name'         => sanitize_text_field( $data['name'] ),

            'tracking_token'       => $tracking_token,

            'status'               => sanitize_text_field( $data['status'] ?? 'pending_review' ),

            'status_updated_at'    => current_time( 'mysql' ),

            'status_notes'         => sanitize_textarea_field( $data['status_notes'] ?? '' ),

            'discount_amount'      => floatval( $data['discount_amount'] ?? 0 ),

            'discount_reason'      => sanitize_textarea_field( $data['discount_reason'] ?? '' ),

            'receipt_file_hash'    => ! empty( $data['receipt_file_hash'] ) ? sanitize_text_field( $data['receipt_file_hash'] ) : null,

            'receipt_original_name'=> ! empty( $data['receipt_original_name'] ) ? sanitize_text_field( $data['receipt_original_name'] ) : null,

        );



        $formats = array( '%d', '%s', '%s', '%d', '%s', '%s', '%s', '%s', '%s', '%.2f', '%s', '%s' );



        $result = $wpdb->insert( $table_name, $insert_data, $formats );

        return $result ? $wpdb->insert_id : new WP_Error( 'db_insert_error', 'Failed to save form submission.' );
    }

    public static function generate_tracking_token( $length = 14 ) {
        global $wpdb;

        $table  = $wpdb->prefix . 'boa_form_submissions';
        $length = max( 8, min( 32, absint( $length ) ) );

        do {
            $token = strtoupper( wp_generate_password( $length, false, false ) );
            $exists = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT submission_id FROM $table WHERE tracking_token = %s LIMIT 1",
                    $token
                )
            );
        } while ( ! empty( $exists ) );

        return sanitize_text_field( $token );
    }

    public static function get_submission_tracking_token( $submission_id ) {
        global $wpdb;
        $table = $wpdb->prefix . 'boa_form_submissions';

        return $wpdb->get_var(
            $wpdb->prepare(
                "SELECT tracking_token FROM $table WHERE submission_id = %d",
                absint( $submission_id )
            )
        );
    }

    public static function get_submission_by_student( $student_id ) {
        global $wpdb;
        $table = $wpdb->prefix . 'boa_form_submissions';

        return $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM $table WHERE student_id = %d LIMIT 1",
                absint( $student_id )
            ),
            ARRAY_A
        );
    }

    public static function update_form_submission_status_by_student( $student_id, $status, $notes = '' ) {
        global $wpdb;

        $student_id = absint( $student_id );
        if ( $student_id === 0 ) {
            return false;
        }

        $table = $wpdb->prefix . 'boa_form_submissions';

        return $wpdb->update(
            $table,
            array(
                'status'            => sanitize_text_field( $status ),
                'status_updated_at' => current_time( 'mysql' ),
                'status_notes'      => sanitize_textarea_field( $notes ),
            ),
            array( 'student_id' => $student_id ),
            array( '%s', '%s', '%s' ),
            array( '%d' )
        );
    }

    public static function get_submission_status_public( $tracking_token, $email = '', $phone = '' ) {
        global $wpdb;

        $tracking_token = strtoupper( sanitize_text_field( $tracking_token ) );
        $email          = sanitize_email( $email );
        $phone          = sanitize_text_field( $phone );

        $table_name   = $wpdb->prefix . 'boa_form_submissions';
        $courses_table= $wpdb->prefix . 'boa_courses';

        $conditions = array( 'fs.tracking_token = %s' );
        $params     = array( $tracking_token );

        if ( ! empty( $email ) ) {
            $conditions[] = 'fs.email = %s';
            $params[]     = $email;
        }

        if ( ! empty( $phone ) ) {
            $conditions[] = 'fs.phone = %s';
            $params[]     = $phone;
        }

        $where = implode( ' AND ', $conditions );

        $sql = "SELECT fs.*, c.course_name 
                FROM $table_name fs 
                LEFT JOIN $courses_table c ON fs.course_id = c.course_id 
                WHERE $where
                LIMIT 1";

        return $wpdb->get_row( $wpdb->prepare( $sql, $params ), ARRAY_A );
    }

    // ===== Live Sessions & Attendance =====

    public static function get_live_sessions( $args = array() ) {
        global $wpdb;

        $defaults = array(
            'page'       => 1,
            'per_page'   => 20,
            'course_id'  => 0,
            'status'     => '',
            'upcoming'   => false,
            'search'     => '',
        );
        $args = wp_parse_args( $args, $defaults );

        $table         = $wpdb->prefix . 'boa_live_sessions';
        $courses_table = $wpdb->prefix . 'boa_courses';

        $sql_select = "SELECT s.*, c.course_name";
        $sql_from   = "FROM $table s LEFT JOIN $courses_table c ON s.course_id = c.course_id";
        $sql_where  = "WHERE 1=1";
        $params     = array();

        if ( ! empty( $args['course_id'] ) ) {
            $sql_where .= " AND s.course_id = %d";
            $params[]   = absint( $args['course_id'] );
        }

        if ( ! empty( $args['status'] ) ) {
            $sql_where .= " AND s.status = %s";
            $params[]   = sanitize_text_field( $args['status'] );
        }

        if ( ! empty( $args['search'] ) ) {
            $search     = '%' . $wpdb->esc_like( $args['search'] ) . '%';
            $sql_where .= " AND s.session_title LIKE %s";
            $params[]   = $search;
        }

        if ( ! empty( $args['upcoming'] ) ) {
            $sql_where .= " AND s.start_time >= %s";
            $params[]   = current_time( 'mysql' );
        }

        $total_sql  = "SELECT COUNT(s.session_id) $sql_from $sql_where";
        $total      = (int) ( $params ? $wpdb->get_var( $wpdb->prepare( $total_sql, $params ) ) : $wpdb->get_var( $total_sql ) );

        $sql_order  = "ORDER BY s.start_time DESC";
        $sql_limit  = "LIMIT %d, %d";
        $params[]   = ( $args['page'] - 1 ) * $args['per_page'];
        $params[]   = $args['per_page'];

        $full_sql = "$sql_select $sql_from $sql_where $sql_order $sql_limit";
        $items    = $wpdb->get_results( $wpdb->prepare( $full_sql, $params ), ARRAY_A );

        return array(
            'items' => $items ? $items : array(),
            'total' => $total,
        );
    }

    public static function save_live_session( $data ) {
        global $wpdb;

        $table      = $wpdb->prefix . 'boa_live_sessions';
        $session_id = isset( $data['session_id'] ) ? absint( $data['session_id'] ) : 0;

        $fields = array(
            'course_id'        => isset( $data['course_id'] ) ? absint( $data['course_id'] ) : null,
            'session_title'    => sanitize_text_field( $data['session_title'] ?? '' ),
            'platform'         => sanitize_text_field( $data['platform'] ?? 'custom' ),
            'join_url'         => isset( $data['join_url'] ) ? esc_url_raw( $data['join_url'] ) : '',
            'host_url'         => isset( $data['host_url'] ) ? esc_url_raw( $data['host_url'] ) : '',
            'start_time'       => sanitize_text_field( $data['start_time'] ?? current_time( 'mysql' ) ),
            'end_time'         => ! empty( $data['end_time'] ) ? sanitize_text_field( $data['end_time'] ) : null,
            'duration_minutes' => isset( $data['duration_minutes'] ) ? absint( $data['duration_minutes'] ) : null,
            'instructor_name'  => sanitize_text_field( $data['instructor_name'] ?? '' ),
            'status'           => sanitize_text_field( $data['status'] ?? 'scheduled' ),
        );

        $formats = array( '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s' );

        if ( $session_id > 0 ) {
            $result = $wpdb->update( $table, $fields, array( 'session_id' => $session_id ), $formats, array( '%d' ) );
            return $result !== false ? $session_id : new WP_Error( 'db_error', __( 'Could not update session.', 'baba-online-academy' ) );
        }

        $fields['created_at'] = current_time( 'mysql' );
        $formats[]            = '%s';
        $result               = $wpdb->insert( $table, $fields, $formats );

        return $result ? $wpdb->insert_id : new WP_Error( 'db_error', __( 'Could not create session.', 'baba-online-academy' ) );
    }

    public static function delete_live_session( $session_id ) {
        global $wpdb;

        $session_id = absint( $session_id );
        if ( $session_id === 0 ) {
            return false;
        }

        $wpdb->delete( $wpdb->prefix . 'boa_live_attendance', array( 'session_id' => $session_id ), array( '%d' ) );
        return $wpdb->delete( $wpdb->prefix . 'boa_live_sessions', array( 'session_id' => $session_id ), array( '%d' ) );
    }

    public static function record_live_attendance( $data ) {
        global $wpdb;
        $table = $wpdb->prefix . 'boa_live_attendance';

        $fields = array(
            'session_id'    => absint( $data['session_id'] ),
            'student_id'    => isset( $data['student_id'] ) ? absint( $data['student_id'] ) : null,
            'student_name'  => sanitize_text_field( $data['student_name'] ?? '' ),
            'student_email' => sanitize_email( $data['student_email'] ?? '' ),
            'join_time'     => ! empty( $data['join_time'] ) ? sanitize_text_field( $data['join_time'] ) : current_time( 'mysql' ),
            'device_info'   => sanitize_text_field( $data['device_info'] ?? '' ),
            'ip_address'    => sanitize_text_field( $data['ip_address'] ?? '' ),
            'status'        => sanitize_text_field( $data['status'] ?? 'joined' ),
        );

        $result = $wpdb->insert(
            $table,
            $fields,
            array( '%d', '%d', '%s', '%s', '%s', '%s', '%s', '%s' )
        );

        return $result ? $wpdb->insert_id : new WP_Error( 'db_error', __( 'Unable to record attendance.', 'baba-online-academy' ) );
    }

    public static function complete_live_attendance( $attendance_id, $leave_time = null, $watch_minutes = null ) {
        global $wpdb;

        $attendance_id = absint( $attendance_id );
        if ( $attendance_id === 0 ) {
            return false;
        }

        $fields = array(
            'leave_time'    => $leave_time ? sanitize_text_field( $leave_time ) : current_time( 'mysql' ),
            'status'        => 'left',
        );

        if ( null !== $watch_minutes ) {
            $fields['watch_minutes'] = absint( $watch_minutes );
        }

        return $wpdb->update(
            $wpdb->prefix . 'boa_live_attendance',
            $fields,
            array( 'attendance_id' => $attendance_id ),
            array( '%s', '%s', '%d' ),
            array( '%d' )
        );
    }

    public static function get_session_attendance( $session_id ) {
        global $wpdb;

        $session_id = absint( $session_id );
        if ( $session_id === 0 ) {
            return array();
        }

        $table = $wpdb->prefix . 'boa_live_attendance';
        return $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM $table WHERE session_id = %d ORDER BY join_time ASC",
                $session_id
            ),
            ARRAY_A
        );
    }

    /**
     * نیا فنکشن: اسٹوڈنٹ آئی ڈی کی بنیاد پر لائیو سیشنز حاصل کرتا ہے
     */
    public static function get_live_sessions_by_student_id( $student_id ) {
        global $wpdb;
        $student_id = absint( $student_id );
        if ( ! $student_id ) {
            return array();
        }

        $sessions_table = $wpdb->prefix . 'boa_live_sessions';
        $students_table = $wpdb->prefix . 'boa_students';
        $courses_table = $wpdb->prefix . 'boa_courses';

        $sql = $wpdb->prepare(
            "SELECT ls.*, c.course_name
             FROM $sessions_table ls
             JOIN $courses_table c ON ls.course_id = c.course_id
             WHERE ls.status = 'scheduled'
             AND ls.course_id IN (SELECT DISTINCT course_id FROM $students_table WHERE student_id = %d)
             ORDER BY ls.start_time ASC",
            $student_id
        );

        $results = $wpdb->get_results( $sql, ARRAY_A );
        return $results ? $results : array();
    }

    public static function get_student_live_attendance( $student_id, $limit = 20 ) {
        global $wpdb;

        $student_id = absint( $student_id );
        if ( $student_id === 0 ) {
            return array();
        }

        $attendance_table = $wpdb->prefix . 'boa_live_attendance';
        $sessions_table   = $wpdb->prefix . 'boa_live_sessions';

        $sql = $wpdb->prepare(
            "SELECT a.*, s.session_title, s.start_time 
             FROM $attendance_table a 
             LEFT JOIN $sessions_table s ON a.session_id = s.session_id 
             WHERE a.student_id = %d 
             ORDER BY a.join_time DESC
             LIMIT %d",
            $student_id,
            absint( $limit )
        );

        return $wpdb->get_results( $sql, ARRAY_A );
    }

    public static function get_daily_attendance_map( $course_id, $attendance_date ) {
        global $wpdb;

        $course_id       = absint( $course_id );
        $attendance_date = sanitize_text_field( $attendance_date );

        if ( ! $course_id || empty( $attendance_date ) ) {
            return array();
        }

        $table = $wpdb->prefix . 'boa_daily_attendance';
        $rows  = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM $table WHERE course_id = %d AND attendance_date = %s",
                $course_id,
                $attendance_date
            ),
            ARRAY_A
        );

        if ( empty( $rows ) ) {
            return array();
        }

        $map = array();
        foreach ( $rows as $row ) {
            $map[ $row['student_id'] ] = $row;
        }
        return $map;
    }

    public static function save_daily_attendance_records( $course_id, $attendance_date, $records, $recorded_by ) {
        global $wpdb;

        $course_id       = absint( $course_id );
        $recorded_by     = absint( $recorded_by );
        $attendance_date = sanitize_text_field( $attendance_date );

        if ( ! $course_id || ! $recorded_by || empty( $attendance_date ) || empty( $records ) ) {
            return;
        }

        $table          = $wpdb->prefix . 'boa_daily_attendance';
        $allowed_status = array( 'present', 'absent', 'late' );

        foreach ( $records as $record ) {
            $student_id = isset( $record['student_id'] ) ? absint( $record['student_id'] ) : 0;
            if ( ! $student_id ) {
                continue;
            }

            $status  = isset( $record['status'] ) && in_array( $record['status'], $allowed_status, true ) ? $record['status'] : '';
            $remarks = isset( $record['remarks'] ) ? sanitize_text_field( $record['remarks'] ) : '';

            if ( '' === $status ) {
                $wpdb->delete(
                    $table,
                    array(
                        'student_id'      => $student_id,
                        'attendance_date' => $attendance_date,
                    ),
                    array( '%d', '%s' )
                );
                continue;
            }

            $wpdb->replace(
                $table,
                array(
                    'student_id'      => $student_id,
                    'course_id'       => $course_id,
                    'attendance_date' => $attendance_date,
                    'status'          => $status,
                    'remarks'         => $remarks,
                    'recorded_by'     => $recorded_by,
                    'recorded_at'     => current_time( 'mysql' ),
                ),
                array( '%d', '%d', '%s', '%s', '%s', '%d', '%s' )
            );
        }
    }

    public static function auto_complete_live_sessions() {
        global $wpdb;

        $table = $wpdb->prefix . 'boa_live_sessions';
        $now   = current_time( 'mysql' );

        $wpdb->query(
            $wpdb->prepare(
                "UPDATE $table 
                 SET status = 'completed', updated_at = %s 
                 WHERE status = 'scheduled' 
                 AND start_time <= DATE_SUB( %s, INTERVAL 1 HOUR )",
                $now,
                $now
            )
        );
    }

    
    /**
     * Update form submission with receipt
     */
    public static function update_form_submission_receipt( $submission_id, $file_hash, $original_name ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'boa_form_submissions';
        
        // Check if same receipt already uploaded
        $existing = $wpdb->get_var( $wpdb->prepare( 
            "SELECT submission_id FROM $table_name WHERE receipt_file_hash = %s AND submission_id != %d", 
            $file_hash, $submission_id 
        ) );
        
        if ( $existing ) {
            return new WP_Error( 'duplicate_receipt', 'یہ رسید پہلے ہی اپ لوڈ کی جا چکی ہے۔' );
        }
        
        return $wpdb->update( 
            $table_name, 
            array( 
                'receipt_file_hash' => $file_hash,
                'receipt_original_name' => $original_name 
            ), 
            array( 'submission_id' => $submission_id ), 
            array( '%s', '%s' ), 
            array( '%d' ) 
        );
    }
    
    /**
     * Generate file hash for duplicate detection
     */
    public static function generate_file_hash( $file_path ) {
        if ( ! file_exists( $file_path ) ) {
            return false;
        }
        return hash_file( 'sha256', $file_path );
    }
    
    /**
     * Get student pending fees for auto-fill discount
     */
    public static function get_student_pending_fees( $student_id ) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'boa_fees';
        return $wpdb->get_row( $wpdb->prepare( 
            "SELECT 
                SUM(amount_due) as total_due,
                SUM(amount_paid) as total_paid,
                (SUM(amount_due) - SUM(amount_paid)) as pending_amount
             FROM $table_name WHERE student_id = %d", 
            $student_id 
        ), ARRAY_A );
    }
    
    /**
     * Generate WhatsApp message URL
     */
    public static function generate_whatsapp_url( $phone, $message = '' ) {
        // Clean phone number
        $clean_phone = preg_replace( '/[^0-9]/', '', $phone );
        
        // Add country code if not present (assuming Pakistan +92)
        if ( strlen( $clean_phone ) == 10 ) {
            $clean_phone = '92' . $clean_phone;
        }
        
        $default_message = urlencode( "آپ کو Academic Hub سے رابطہ کیا جا رہا ہے۔" );
        $message_param = !empty( $message ) ? urlencode( $message ) : $default_message;
        
        return "https://wa.me/{$clean_phone}?text={$message_param}";
    }
    
    /**
     * Get students with enhanced data including submissions
     */
    public static function get_students_with_enhanced_data() {
        global $wpdb;
        $students_table = $wpdb->prefix . 'boa_students';
        $courses_table = $wpdb->prefix . 'boa_courses';
        $fees_table = $wpdb->prefix . 'boa_fees';
        $submissions_table = $wpdb->prefix . 'boa_form_submissions';
        
        $sql = "SELECT 
            s.*, 
            c.course_name,
            COALESCE(SUM(f.amount_due), 0) as total_due,
            COALESCE(SUM(f.amount_paid), 0) as total_paid,
            COALESCE(SUM(f.amount_due) - SUM(f.amount_paid), 0) as pending_amount,
            (SELECT COUNT(*) FROM $submissions_table sub WHERE sub.email = s.email) as form_submissions_count
            FROM $students_table s
            LEFT JOIN $courses_table c ON s.course_id = c.course_id
            LEFT JOIN $fees_table f ON s.student_id = f.student_id
            GROUP BY s.student_id
            ORDER BY s.created_at DESC";
        
        return $wpdb->get_results( $sql, ARRAY_A );
    }
    
    /**
     * Apply discount to student's pending fees
     */
    public static function apply_student_discount( $student_id, $discount_amount, $reason ) {
        global $wpdb;
        $fees_table = $wpdb->prefix . 'boa_fees';
        
        // Get pending fees
        $pending_fees = $wpdb->get_results( $wpdb->prepare( 
            "SELECT fee_id, (amount_due - amount_paid) as pending_amount 
             FROM $fees_table 
             WHERE student_id = %d AND (amount_due - amount_paid) > 0 
             ORDER BY due_date ASC", 
            $student_id 
        ), ARRAY_A );
        
        if ( empty( $pending_fees ) ) {
            return new WP_Error( 'no_pending_fees', 'اس student کے پاس کوئی pending fee نہیں ہے۔' );
        }
        
        $remaining_discount = floatval( $discount_amount );
        $updated_records = 0;
        
        foreach ( $pending_fees as $fee ) {
            if ( $remaining_discount <= 0 ) break;
            
            $discount_to_apply = min( $remaining_discount, $fee['pending_amount'] );
            
            // Update the fee record
            $result = $wpdb->update(
                $fees_table,
                array( 
                    'amount_paid' => $fee['pending_amount'] - $discount_to_apply + $fee['pending_amount']
                ),
                array( 'fee_id' => $fee['fee_id'] ),
                array( '%.2f' ),
                array( '%d' )
            );
            
            if ( $result !== false ) {
                $updated_records++;
                $remaining_discount -= $discount_to_apply;
            }
        }
        
        // Log discount application
        error_log( "BOA - Discount applied to student {$student_id}: {$discount_amount} PKR, Reason: {$reason}, Records updated: {$updated_records}" );
        
        return array(
            'discount_applied' => floatval( $discount_amount ) - $remaining_discount,
            'records_updated' => $updated_records,
            'remaining_discount' => $remaining_discount
        );
    }
}
// ✅ Syntax verified block end
