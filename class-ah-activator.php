<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class BOA_Activator {

    public static function activate() {
        // مرحلہ 1: ڈیٹا بیس یا آپشنز initialise کریں
        // یہ ہمارے نئے فنکشن کو کال کرے گا جو class-boa-db.php میں ہے۔
        BOA_DB::maybe_create_tables();

        // مرحلہ 2: ڈیفالٹ سیٹنگز (یہ wp_options میں ہی رہیں گی)
        $defaults = array(
            'system_name'    => 'Academic Hub',
            'admin_email'    => get_option( 'admin_email' ),
            'default_language' => 'en_US',
            'timezone'       => 'Asia/Karachi',
            'date_format'    => 'Y-m-d',
            'currency'       => 'PKR',
            'primary_color'  => '#3b82f6',
            'accent_color'   => '#f59e0b',
            'theme_mode'     => 'light',
            'login_title'    => 'Welcome to Academic Hub',
            'footer_text'    => 'Powered by Academic Hub',
            'notify_sender_name'  => 'Academic Hub',
            'notify_sender_email' => get_option( 'admin_email' ),
            'sms_api_url'         => '',
            'sms_api_key'         => '',
            'sms_sender_id'       => '',
            'attendance_alert_email' => 'on',
            'attendance_alert_sms'   => 'off',
            'jazzcash_enabled'        => 'off',
            'jazzcash_merchant_id'    => '',
            'jazzcash_password'       => '',
            'jazzcash_integrity_salt' => '',
            'jazzcash_return_url'     => add_query_arg( 'boa-payment-webhook', 'jazzcash', home_url( '/' ) ),
            'easypaisa_enabled'       => 'off',
            'easypaisa_store_id'      => '',
            'easypaisa_hash_key'      => '',
            'easypaisa_username'      => '',
            'easypaisa_password'      => '',
            'easypaisa_return_url'    => add_query_arg( 'boa-payment-webhook', 'easypaisa', home_url( '/' ) ),
        );

        $current = get_option( 'boa_settings', array() );
        update_option( 'boa_settings', wp_parse_args( $current, $defaults ) );

        // مرحلہ 3: ڈیفالٹ کیٹیگریز شامل کریں (اگر موجود نہ ہوں)
        self::create_default_categories();

                // مرحلہ 4: Manual table creation کی verification

                self::force_recreate_tables();

        

                // مرحلہ 5: ورڈپریس رولز بنائیں

                self::create_roles();
        self::ensure_role_capabilities();

        

                // (نوٹ: پرانی 'boa_categories' آپشن والی لائن ہٹا دی گئی ہے

                // کیونکہ اب وہ کسٹم ٹیبل میں ہیں)

            }

        

            public static function deactivate() {

                $timestamp = wp_next_scheduled( 'boa_auto_complete_sessions' );

                if ( $timestamp ) {

                    wp_unschedule_event( $timestamp, 'boa_auto_complete_sessions' );

                }

                $reminder_timestamp = wp_next_scheduled( 'boa_send_fee_reminders' );

                if ( $reminder_timestamp ) {

                    wp_unschedule_event( $reminder_timestamp, 'boa_send_fee_reminders' );

                }

                // (اختیاری: رولز کو غیر فعال کرنے پر ہٹایا جا سکتا ہے)

                // self::remove_roles();

            }

        

            /**

             * نیا فنکشن: اسٹوڈنٹ اور انسٹرکٹر کے لیے کسٹم رولز بناتا ہے

             */

                private static function create_roles() {
        add_role(
            'student',
            __( 'Student', 'baba-online-academy' ),
            array(
                'read'              => true,
                'boa_access_portal' => true,
            )
        );

        add_role(
            'instructor',
            __( 'Instructor', 'baba-online-academy' ),
            array(
                'read'                       => true,
                'edit_posts'                 => true,
                'upload_files'               => true,
                'boa_manage_instruction'     => true,
                'boa_manage_live_sessions'   => true,
                'boa_access_portal'          => true,
            )
        );
    }

        

            /**

             * نیا فنکشن: کسٹم رولز کو ہٹاتا ہے

             */

            private static function remove_roles() {

                remove_role( 'student' );

                remove_role( 'instructor' );

            }

    public static function ensure_role_capabilities() {
        $admin = get_role( 'administrator' );
        if ( $admin ) {
            $admin->add_cap( 'boa_manage_instruction' );
            $admin->add_cap( 'boa_manage_live_sessions' );
            $admin->add_cap( 'boa_access_portal' );
        }

        $instructor = get_role( 'instructor' );
        if ( $instructor ) {
            $instructor->add_cap( 'boa_manage_instruction' );
            $instructor->add_cap( 'boa_manage_live_sessions' );
            $instructor->add_cap( 'boa_access_portal' );
        }

        $student = get_role( 'student' );
        if ( $student ) {
            $student->add_cap( 'boa_access_portal' );
        }
    }

    private static function create_default_categories() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'boa_categories';
        
        // چیک کریں کہ کیا کوئی categories موجود ہیں
        $existing_count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
        
        if ($existing_count == 0) {
            // ڈیفالٹ categories شامل کریں
            $default_categories = array(
                'Web Development',
                'Mobile App Development', 
                'Data Science',
                'Digital Marketing',
                'Graphic Design',
                'Computer Hardware',
                'Networking',
                'Database Management'
            );
            
            foreach ($default_categories as $category) {
                $wpdb->insert(
                    $table_name,
                    array(
                        'category_name' => $category,
                        'status' => 'active'
                    ),
                    array('%s', '%s')
                );
            }
        }
    }

    private static function force_recreate_tables() {
        global $wpdb;
        
        error_log('BOA Activator - Starting forced table recreation');
        
        $categories_table = $wpdb->prefix . 'boa_categories';
        $courses_table = $wpdb->prefix . 'boa_courses';
        $students_table = $wpdb->prefix . 'boa_students';
        $fees_table = $wpdb->prefix . 'boa_fees';
        $transactions_table = $wpdb->prefix . 'boa_fee_transactions';
        
        // Drop existing tables if they exist (to fix structure issues)
        error_log('BOA Activator - Dropping existing tables if they exist');

        // Drop fees table first (due to foreign keys)
        $wpdb->query("DROP TABLE IF EXISTS $fees_table");
        error_log('BOA Activator - Dropped fees table');
        
        // Drop students table
        $wpdb->query("DROP TABLE IF EXISTS $students_table");
        error_log('BOA Activator - Dropped students table');
        
        // Drop courses table
        $wpdb->query("DROP TABLE IF EXISTS $courses_table");
        error_log('BOA Activator - Dropped courses table');
        
        // Drop categories table
        $wpdb->query("DROP TABLE IF EXISTS $categories_table");
        error_log('BOA Activator - Dropped categories table');
        
        $wpdb->query("DROP TABLE IF EXISTS $transactions_table");
        error_log('BOA Activator - Dropped fee transactions table');

        // Create categories table
        error_log('BOA Activator - Creating categories table manually');
        $sql = "CREATE TABLE $categories_table (
            category_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            category_name VARCHAR(255) NOT NULL, 
            status VARCHAR(20) NOT NULL DEFAULT 'active',
            PRIMARY KEY (category_id)
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Categories table creation result: ' . ($result !== false ? 'Success' : 'Failed'));
        
        // Create courses table
        error_log('BOA Activator - Creating courses table manually');
        $sql = "CREATE TABLE $courses_table (
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
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Courses table creation result: ' . ($result !== false ? 'Success' : 'Failed'));
        
        // Create students table
        error_log('BOA Activator - Creating students table manually');
        $sql = "CREATE TABLE $students_table (
            student_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id BIGINT(20) UNSIGNED DEFAULT NULL, -- نیا کالم
            student_uid VARCHAR(100) NOT NULL, 
            name VARCHAR(255) NOT NULL,
            email VARCHAR(100) NOT NULL, 
            phone VARCHAR(50) DEFAULT NULL,
            course_id BIGINT(20) UNSIGNED NOT NULL, 
            admission_date DATE DEFAULT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'active', 
            certificate_url VARCHAR(1000) DEFAULT NULL, -- نیا کالم
            certificate_token VARCHAR(64) DEFAULT NULL,   -- نیا کالم
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (student_id), 
            UNIQUE KEY student_uid (student_uid),
            KEY course_id (course_id), 
            KEY email (email),
            KEY user_id (user_id),
            UNIQUE KEY certificate_token (certificate_token) -- نیا انڈیکس
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Students table creation result: ' . ($result !== false ? 'Success' : 'Failed'));
        
        // Create fees table
        error_log('BOA Activator - Creating fees table manually');
        $sql = "CREATE TABLE $fees_table (
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
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Fees table creation result: ' . ($result !== false ? 'Success' : 'Failed'));
        
        // Create form submissions table (NEW)
        $submissions_table = $wpdb->prefix . 'boa_form_submissions';
        error_log('BOA Activator - Creating form submissions table manually');
        $sql = "CREATE TABLE $submissions_table (
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
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Form submissions table creation result: ' . ($result !== false ? 'Success' : 'Failed'));

        // Create fee receipts table
        $receipts_table = $wpdb->prefix . 'boa_fee_receipts';
        error_log('BOA Activator - Creating fee receipts table manually');
        $sql = "CREATE TABLE $receipts_table (
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
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Fee receipts table creation result: ' . ($result !== false ? 'Success' : 'Failed'));

        // Create transactions table
        error_log('BOA Activator - Creating fee transactions table manually');
        $sql = "CREATE TABLE $transactions_table (
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
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query( $sql );
        error_log('BOA Activator - Fee transactions table creation result: ' . ( $result !== false ? 'Success' : 'Failed' ) );

        // Create live sessions table
        $sessions_table = $wpdb->prefix . 'boa_live_sessions';
        error_log('BOA Activator - Creating live sessions table manually');
        $sql = "CREATE TABLE $sessions_table (
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
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Live sessions table creation result: ' . ($result !== false ? 'Success' : 'Failed'));

        // Create live attendance table
        $attendance_table = $wpdb->prefix . 'boa_live_attendance';
        error_log('BOA Activator - Creating live attendance table manually');
        $sql = "CREATE TABLE $attendance_table (
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
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Live attendance table creation result: ' . ($result !== false ? 'Success' : 'Failed'));

        // Create notices table
        $notices_table = $wpdb->prefix . 'boa_notices';
        error_log('BOA Activator - Creating notices table manually');
        $sql = "CREATE TABLE $notices_table (
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
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query( $sql );
        error_log('BOA Activator - Notices table creation result: ' . ( $result !== false ? 'Success' : 'Failed' ) );
        
        // نیا: کورس میٹریل ٹیبل
        $materials_table = $wpdb->prefix . 'boa_course_materials';
        error_log('BOA Activator - Creating course materials table manually');
        $sql = "CREATE TABLE $materials_table (
            material_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            course_id BIGINT(20) UNSIGNED NOT NULL,
            title VARCHAR(255) NOT NULL,
            material_type VARCHAR(50) NOT NULL, -- 'pdf', 'video', 'link', 'text'
            content_url VARCHAR(1000) DEFAULT NULL,
            description TEXT DEFAULT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (material_id),
            KEY course_id (course_id)
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Course materials table creation result: ' . ($result !== false ? 'Success' : 'Failed'));

        // نیا: اخراجات کا ٹیبل
        $expenses_table = $wpdb->prefix . 'boa_expenses';
        error_log('BOA Activator - Creating expenses table manually');
        $sql = "CREATE TABLE $expenses_table (
            expense_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(100) DEFAULT 'general',
            amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
            expense_date DATE DEFAULT NULL,
            notes TEXT DEFAULT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (expense_id),
            KEY category (category),
            KEY expense_date (expense_date)
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Expenses table creation result: ' . ($result !== false ? 'Success' : 'Failed'));

        // نیا: کوئز کے ٹیبلز
        $quizzes_table = $wpdb->prefix . 'boa_quizzes';
        error_log('BOA Activator - Creating quizzes table manually');
        $sql = "CREATE TABLE $quizzes_table (
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
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Quizzes table creation result: ' . ($result !== false ? 'Success' : 'Failed'));

        $quiz_questions_table = $wpdb->prefix . 'boa_quiz_questions';
        error_log('BOA Activator - Creating quiz questions table manually');
        $sql = "CREATE TABLE $quiz_questions_table (
            question_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            quiz_id BIGINT(20) UNSIGNED NOT NULL,
            question_text TEXT NOT NULL,
            question_type VARCHAR(50) NOT NULL DEFAULT 'mcq',
            marks DECIMAL(5,2) DEFAULT 1.00,
            question_order INT UNSIGNED DEFAULT 0,
            PRIMARY KEY (question_id),
            KEY quiz_id (quiz_id)
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Quiz questions table creation result: ' . ($result !== false ? 'Success' : 'Failed'));

        $question_options_table = $wpdb->prefix . 'boa_question_options';
        error_log('BOA Activator - Creating question options table manually');
        $sql = "CREATE TABLE $question_options_table (
            option_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            question_id BIGINT(20) UNSIGNED NOT NULL,
            option_text TEXT NOT NULL,
            is_correct BOOLEAN NOT NULL DEFAULT 0,
            option_order INT UNSIGNED DEFAULT 0,
            PRIMARY KEY (option_id),
            KEY question_id (question_id)
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Question options table creation result: ' . ($result !== false ? 'Success' : 'Failed'));

        $quiz_attempts_table = $wpdb->prefix . 'boa_quiz_attempts';
        error_log('BOA Activator - Creating quiz attempts table manually');
        $sql = "CREATE TABLE $quiz_attempts_table (
            attempt_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            quiz_id BIGINT(20) UNSIGNED NOT NULL,
            student_id BIGINT(20) UNSIGNED NOT NULL,
            score DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
            total_marks DECIMAL(6,2) DEFAULT NULL,
            answers LONGTEXT DEFAULT NULL,
            attempt_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (attempt_id),
            KEY quiz_id (quiz_id),
            KEY student_id (student_id)
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Quiz attempts table creation result: ' . ($result !== false ? 'Success' : 'Failed'));

        $assignments_table = $wpdb->prefix . 'boa_assignments';
        error_log('BOA Activator - Creating assignments table manually');
        $sql = "CREATE TABLE $assignments_table (
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
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Assignments table creation result: ' . ($result !== false ? 'Success' : 'Failed'));

        $assignment_submissions_table = $wpdb->prefix . 'boa_assignment_submissions';
        error_log('BOA Activator - Creating assignment submissions table manually');
        $sql = "CREATE TABLE $assignment_submissions_table (
            submission_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            assignment_id BIGINT(20) UNSIGNED NOT NULL,
            student_id BIGINT(20) UNSIGNED NOT NULL,
            file_url VARCHAR(1000) NOT NULL,
            submission_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            marks DECIMAL(6, 2) DEFAULT NULL,
            remarks TEXT DEFAULT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'submitted',
            feedback TEXT DEFAULT NULL,
            PRIMARY KEY (submission_id),
            KEY assignment_id (assignment_id),
            KEY student_id (student_id)
        ) " . $wpdb->get_charset_collate() . ";";
        $result = $wpdb->query($sql);
        error_log('BOA Activator - Assignment submissions table creation result: ' . ($result !== false ? 'Success' : 'Failed'));

        error_log('BOA Activator - All tables recreated successfully');
    }
}

// ✅ Syntax verified block end
