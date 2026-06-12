<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * BABA Online Academy - AJAX Management
 *
 * (2025 BABA ARCHITECT - REFACTOR 9)
 * - apply_fee_discount کو boa_apply_partial_discount سے تبدیل کر دیا گیا ہے۔
 * - یہ اب fee_id اور discount_amount لیتا ہے۔
 * - یہ DB میں فیس کو تقسیم کرنے کے لیے apply_partial_discount کو کال کرتا ہے۔
 */
class BOA_Ajax {

    public static function init() {
        // Students
        add_action( 'wp_ajax_boa_get_students', array( __CLASS__, 'get_students' ) );
        add_action( 'wp_ajax_boa_save_student', array( __CLASS__, 'save_student' ) );
        add_action( 'wp_ajax_boa_delete_student', array( __CLASS__, 'delete_student' ) );
        add_action( 'wp_ajax_boa_get_next_student_id', array( __CLASS__, 'get_next_student_id' ) );

        // Courses
        add_action( 'wp_ajax_boa_get_courses', array( __CLASS__, 'get_courses' ) );
        add_action( 'wp_ajax_boa_save_course', array( __CLASS__, 'save_course' ) );
        add_action( 'wp_ajax_boa_delete_course', array( __CLASS__, 'delete_course' ) );

        // Fees
        add_action( 'wp_ajax_boa_get_fees', array( __CLASS__, 'get_fees' ) );
        add_action( 'wp_ajax_boa_save_fee', array( __CLASS__, 'save_fee' ) );
        add_action( 'wp_ajax_boa_delete_fee', array( __CLASS__, 'delete_fee' ) );
        add_action( 'wp_ajax_boa_upload_receipt', array( __CLASS__, 'upload_receipt' ) );
        
        // --- اپ ڈیٹ: جزوی ڈسکاؤنٹ فنکشن ---
        add_action( 'wp_ajax_boa_apply_partial_discount', array( __CLASS__, 'apply_partial_discount' ) );

        // Reports
        add_action( 'wp_ajax_boa_get_report_data', array( __CLASS__, 'get_report_data' ) );

        // Settings
        add_action( 'wp_ajax_boa_upload_logo', array( __CLASS__, 'upload_logo' ) );
        add_action( 'wp_ajax_boa_save_settings', array( __CLASS__, 'save_settings' ) );
        add_action( 'wp_ajax_boa_manage_category', array( __CLASS__, 'manage_category' ) );

        // --- ایڈمیشن ریویو فنکشنز ---
        add_action( 'wp_ajax_boa_get_pending_admissions', array( __CLASS__, 'get_pending_admissions' ) );
        add_action( 'wp_ajax_boa_approve_admission', array( __CLASS__, 'approve_admission' ) );
        add_action( 'wp_ajax_boa_reject_admission', array( __CLASS__, 'reject_admission' ) );
        add_action( 'wp_ajax_boa_bulk_approve_admissions', array( __CLASS__, 'bulk_approve_admissions' ) );
        add_action( 'wp_ajax_boa_bulk_reject_admissions', array( __CLASS__, 'bulk_reject_admissions' ) );

        // --- پبلک ایڈمیشن فارم فنکشنز ---
        add_action( 'wp_ajax_nopriv_boa_get_course_fee_public', array( __CLASS__, 'get_course_fee_public' ) );
        add_action( 'wp_ajax_boa_get_course_fee_public', array( __CLASS__, 'get_course_fee_public' ) );

        add_action( 'wp_ajax_nopriv_boa_submit_admission_form', array( __CLASS__, 'submit_admission_form' ) );
        add_action( 'wp_ajax_boa_submit_admission_form', array( __CLASS__, 'submit_admission_form' ) );

        // Enhanced features AJAX handlers
        add_action( 'wp_ajax_boa_check_duplicate_submission', array( __CLASS__, 'check_duplicate_submission' ) );
        add_action( 'wp_ajax_nopriv_boa_check_duplicate_submission', array( __CLASS__, 'check_duplicate_submission' ) );
        add_action( 'wp_ajax_boa_check_duplicate_receipt', array( __CLASS__, 'check_duplicate_receipt' ) );
        add_action( 'wp_ajax_nopriv_boa_check_duplicate_receipt', array( __CLASS__, 'check_duplicate_receipt' ) );
        add_action( 'wp_ajax_boa_check_application_status', array( __CLASS__, 'check_application_status' ) );
        add_action( 'wp_ajax_nopriv_boa_check_application_status', array( __CLASS__, 'check_application_status' ) );
        add_action( 'wp_ajax_boa_get_applicant_history', array( __CLASS__, 'get_applicant_history' ) );
        add_action( 'wp_ajax_nopriv_boa_get_applicant_history', array( __CLASS__, 'get_applicant_history' ) );
        add_action( 'wp_ajax_boa_get_student_fees', array( __CLASS__, 'get_student_fees' ) );
        add_action( 'wp_ajax_boa_apply_student_discount', array( __CLASS__, 'apply_student_discount' ) );
        add_action( 'wp_ajax_boa_get_live_sessions', array( __CLASS__, 'get_live_sessions_admin' ) );
        add_action( 'wp_ajax_boa_save_live_session', array( __CLASS__, 'save_live_session' ) );
        add_action( 'wp_ajax_boa_delete_live_session', array( __CLASS__, 'delete_live_session' ) );
        add_action( 'wp_ajax_boa_get_session_attendance', array( __CLASS__, 'get_session_attendance_admin' ) );
        add_action( 'wp_ajax_boa_log_live_attendance', array( __CLASS__, 'log_live_attendance' ) );
        add_action( 'wp_ajax_nopriv_boa_log_live_attendance', array( __CLASS__, 'log_live_attendance' ) );
        add_action( 'wp_ajax_boa_get_daily_attendance', array( __CLASS__, 'get_daily_attendance_admin' ) );
        add_action( 'wp_ajax_boa_save_daily_attendance', array( __CLASS__, 'save_daily_attendance_admin' ) );
        add_action( 'wp_ajax_boa_get_public_live_sessions', array( __CLASS__, 'get_public_live_sessions' ) );
        add_action( 'wp_ajax_nopriv_boa_get_public_live_sessions', array( __CLASS__, 'get_public_live_sessions' ) );

        // Export/Import AJAX handlers
        add_action( 'wp_ajax_boa_export_plugin_data', array( __CLASS__, 'export_plugin_data' ) );
        add_action( 'wp_ajax_boa_import_plugin_data', array( __CLASS__, 'import_plugin_data' ) );
        add_action( 'wp_ajax_boa_export_to_excel', array( __CLASS__, 'export_to_excel' ) );
        add_action( 'wp_ajax_boa_export_sql_backup', array( __CLASS__, 'export_sql_backup' ) );

        // نیا: کورس میٹریل AJAX ہینڈلرز
        add_action( 'wp_ajax_boa_get_course_materials', array( __CLASS__, 'get_course_materials' ) );
        add_action( 'wp_ajax_boa_save_course_material', array( __CLASS__, 'save_course_material' ) );
        add_action( 'wp_ajax_boa_delete_course_material', array( __CLASS__, 'delete_course_material' ) );

        // نیا: اخراجات AJAX ہینڈلرز
        add_action( 'wp_ajax_boa_get_expenses', array( __CLASS__, 'get_expenses' ) );
        add_action( 'wp_ajax_boa_save_expense', array( __CLASS__, 'save_expense' ) );
        add_action( 'wp_ajax_boa_delete_expense', array( __CLASS__, 'delete_expense' ) );
        add_action( 'wp_ajax_boa_get_expense_summary', array( __CLASS__, 'get_expense_summary' ) );
        add_action( 'wp_ajax_boa_get_notices', array( __CLASS__, 'get_notices' ) );
        add_action( 'wp_ajax_boa_save_notice', array( __CLASS__, 'save_notice' ) );
        add_action( 'wp_ajax_boa_delete_notice', array( __CLASS__, 'delete_notice' ) );
        add_action( 'wp_ajax_boa_download_fee_statement', array( __CLASS__, 'download_fee_statement' ) );
        add_action( 'wp_ajax_boa_initiate_gateway_payment', array( __CLASS__, 'initiate_gateway_payment' ) );
        add_action( 'wp_ajax_nopriv_boa_initiate_gateway_payment', array( __CLASS__, 'initiate_gateway_payment' ) );
        add_action( 'wp_ajax_boa_get_quizzes', array( __CLASS__, 'get_quizzes' ) );
        add_action( 'wp_ajax_boa_save_quiz', array( __CLASS__, 'save_quiz' ) );
        add_action( 'wp_ajax_boa_delete_quiz', array( __CLASS__, 'delete_quiz' ) );
        add_action( 'wp_ajax_boa_get_quiz_questions', array( __CLASS__, 'get_quiz_questions' ) );
        add_action( 'wp_ajax_boa_save_quiz_question', array( __CLASS__, 'save_quiz_question' ) );
        add_action( 'wp_ajax_boa_delete_quiz_question', array( __CLASS__, 'delete_quiz_question' ) );
        add_action( 'wp_ajax_boa_get_quiz_attempts', array( __CLASS__, 'get_quiz_attempts' ) );
        add_action( 'wp_ajax_boa_update_quiz_attempt', array( __CLASS__, 'update_quiz_attempt' ) );
        add_action( 'wp_ajax_boa_get_assignments', array( __CLASS__, 'get_assignments' ) );
        add_action( 'wp_ajax_boa_save_assignment', array( __CLASS__, 'save_assignment' ) );
        add_action( 'wp_ajax_boa_delete_assignment', array( __CLASS__, 'delete_assignment' ) );
        add_action( 'wp_ajax_boa_get_assignment_submissions', array( __CLASS__, 'get_assignment_submissions' ) );
        add_action( 'wp_ajax_boa_grade_assignment', array( __CLASS__, 'grade_assignment' ) );
        add_action( 'wp_ajax_boa_fetch_student_quizzes', array( __CLASS__, 'fetch_student_quizzes' ) );
        add_action( 'wp_ajax_boa_load_quiz_detail', array( __CLASS__, 'load_quiz_detail' ) );
        add_action( 'wp_ajax_boa_submit_quiz_attempt', array( __CLASS__, 'submit_quiz_attempt' ) );
        add_action( 'wp_ajax_boa_fetch_student_assignments', array( __CLASS__, 'fetch_student_assignments' ) );
        add_action( 'wp_ajax_boa_submit_assignment', array( __CLASS__, 'submit_assignment' ) );
        add_action( 'wp_ajax_boa_get_transactions', array( __CLASS__, 'get_transactions' ) );

        // نیا: اسٹرائپ پیمنٹ AJAX ہینڈلر
        add_action( 'wp_ajax_boa_process_stripe_payment', array( __CLASS__, 'process_stripe_payment' ) );
    }

    // ===== نیا: اسٹرائپ پیمنٹ فنکشن =====
    public static function process_stripe_payment() {
        check_ajax_referer( 'boa_stripe_nonce', 'nonce' );

        $token = isset( $_POST['token'] ) ? sanitize_text_field( $_POST['token'] ) : '';
        $fee_id = isset( $_POST['fee_id'] ) ? absint( $_POST['fee_id'] ) : 0;

        if ( empty( $token ) || $fee_id === 0 ) {
            wp_send_json_error( array( 'message' => 'Invalid payment data.' ) );
        }

        $settings = BOA_DB::get_settings();
        $secret_key = isset( $settings['stripe_secret_key'] ) ? $settings['stripe_secret_key'] : '';

        if ( empty( $secret_key ) ) {
            wp_send_json_error( array( 'message' => 'Stripe is not configured.' ) );
        }

        $fee = BOA_DB::get_fees( array( 'fee_id' => $fee_id ) );
        if ( empty( $fee['items'] ) ) {
            wp_send_json_error( array( 'message' => 'Fee record not found.' ) );
        }
        $fee_to_pay = $fee['items'][0];
        $amount_in_cents = ( $fee_to_pay['amount_due'] - $fee_to_pay['amount_paid'] ) * 100;

        try {
            \Stripe\Stripe::setApiKey( $secret_key );

            $charge = \Stripe\Charge::create( array(
                'amount' => $amount_in_cents,
                'currency' => strtolower( boa_get_currency_symbol() ),
                'description' => 'Fee Payment for Invoice ' . $fee_to_pay['invoice_id'],
                'source' => $token,
                'metadata' => array(
                    'fee_id' => $fee_id,
                    'student_id' => $fee_to_pay['student_id'],
                )
            ) );

            if ( $charge->paid ) {
                // ادائیگی کامیاب
                BOA_DB::save_fee( array(
                    'fee_id' => $fee_id,
                    'status' => 'paid',
                    'amount_paid' => $fee_to_pay['amount_due'], // پوری رقم ادا ہو گئی
                    'payment_date' => current_time( 'Y-m-d' ),
                ) );
                if ( class_exists( 'BOA_Notifications' ) ) {
                    $student = BOA_DB::get_student_by_id( $fee_to_pay['student_id'] );
                    if ( $student ) {
                        BOA_Notifications::send_fee_payment_email( $student, $fee_to_pay );
                    }
                }
                wp_send_json_success( array( 'message' => 'Payment successful!' ) );
            } else {
                wp_send_json_error( array( 'message' => 'Payment failed.' ) );
            }

        } catch ( \Stripe\Exception\ApiErrorException $e ) {
            wp_send_json_error( array( 'message' => $e->getMessage() ) );
        }
    }

    // ===== نیا: اخراجات AJAX فنکشنز =====

    public static function get_expenses() {
        check_ajax_referer( 'boa_expenses_nonce', 'nonce' );
        $args = array(
            'page'     => isset( $_POST['page'] ) ? max( 1, (int) $_POST['page'] ) : 1,
            'per_page' => isset( $_POST['per_page'] ) ? max( 1, (int) $_POST['per_page'] ) : 10,
        );
        $data = BOA_DB::get_expenses( $args );
        wp_send_json_success( $data );
    }

    public static function save_expense() {
        check_ajax_referer( 'boa_expenses_nonce', 'nonce' );
        $data = wp_unslash( $_POST );
        if ( empty( $data['title'] ) || empty( $data['amount'] ) || empty( $data['expense_date'] ) ) {
            wp_send_json_error( array( 'message' => 'Please fill all required fields.' ) );
        }
        $result = BOA_DB::save_expense( $data );
        if ( is_wp_error( $result ) ) {
            wp_send_json_error( array( 'message' => $result->get_error_message() ) );
        }
        wp_send_json_success( array( 'message' => 'Expense saved successfully.', 'expense_id' => $result ) );
    }

    public static function delete_expense() {
        check_ajax_referer( 'boa_expenses_nonce', 'nonce' );
        $expense_id = isset( $_POST['expense_id'] ) ? absint( $_POST['expense_id'] ) : 0;
        if ( ! $expense_id ) {
            wp_send_json_error( array( 'message' => 'Invalid Expense ID.' ) );
        }
        $result = BOA_DB::delete_expense( $expense_id );
        if ( $result === false ) {
            wp_send_json_error( array( 'message' => 'Could not delete expense.' ) );
        }
        wp_send_json_success( array( 'message' => 'Expense deleted successfully.' ) );
    }

    public static function get_expense_summary() {
        check_ajax_referer( 'boa_expenses_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( array( 'message' => __( 'You do not have permission to view this data.', 'baba-online-academy' ) ) );
        }

        $filters = array(
            'dateFrom' => isset( $_POST['date_from'] ) ? sanitize_text_field( wp_unslash( $_POST['date_from'] ) ) : '',
            'dateTo'   => isset( $_POST['date_to'] ) ? sanitize_text_field( wp_unslash( $_POST['date_to'] ) ) : '',
            'category' => isset( $_POST['category'] ) ? sanitize_text_field( wp_unslash( $_POST['category'] ) ) : '',
        );

        $summary   = BOA_DB::get_expense_summary( $filters );
        $breakdown = BOA_DB::get_expense_breakdown( $filters );

        wp_send_json_success(
            array(
                'summary'   => $summary,
                'breakdown' => $breakdown,
            )
        );
    }

    public static function get_notices() {
        check_ajax_referer( 'boa_notices_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( array( 'message' => __( 'You do not have permission to manage notices.', 'baba-online-academy' ) ) );
        }

        $args = array(
            'page'     => isset( $_POST['page'] ) ? max( 1, (int) $_POST['page'] ) : 1,
            'per_page' => isset( $_POST['per_page'] ) ? max( 1, (int) $_POST['per_page'] ) : 10,
            'status'   => isset( $_POST['status'] ) ? sanitize_text_field( wp_unslash( $_POST['status'] ) ) : '',
            'audience' => isset( $_POST['audience'] ) ? sanitize_text_field( wp_unslash( $_POST['audience'] ) ) : '',
            'search'   => isset( $_POST['search'] ) ? sanitize_text_field( wp_unslash( $_POST['search'] ) ) : '',
        );

        $data = BOA_DB::get_notices( $args );
        wp_send_json_success( $data );
    }

    public static function save_notice() {
        check_ajax_referer( 'boa_notices_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( array( 'message' => __( 'You do not have permission to manage notices.', 'baba-online-academy' ) ) );
        }

        $title   = isset( $_POST['title'] ) ? sanitize_text_field( wp_unslash( $_POST['title'] ) ) : '';
        $message = isset( $_POST['message'] ) ? wp_kses_post( wp_unslash( $_POST['message'] ) ) : '';

        if ( empty( $title ) || empty( $message ) ) {
            wp_send_json_error( array( 'message' => __( 'Please provide both title and message.', 'baba-online-academy' ) ) );
        }

        $data = array(
            'notice_id'  => isset( $_POST['notice_id'] ) ? absint( $_POST['notice_id'] ) : 0,
            'title'      => $title,
            'message'    => $message,
            'audience'   => isset( $_POST['audience'] ) ? sanitize_text_field( wp_unslash( $_POST['audience'] ) ) : 'all',
            'priority'   => isset( $_POST['priority'] ) ? sanitize_text_field( wp_unslash( $_POST['priority'] ) ) : 'normal',
            'start_date' => isset( $_POST['start_date'] ) ? sanitize_text_field( wp_unslash( $_POST['start_date'] ) ) : '',
            'end_date'   => isset( $_POST['end_date'] ) ? sanitize_text_field( wp_unslash( $_POST['end_date'] ) ) : '',
            'is_active'  => isset( $_POST['is_active'] ) ? (int) (bool) $_POST['is_active'] : 1,
            'created_by' => get_current_user_id(),
        );

        $result = BOA_DB::save_notice( $data );
        if ( is_wp_error( $result ) ) {
            wp_send_json_error( array( 'message' => $result->get_error_message() ) );
        }

        wp_send_json_success( array( 'message' => __( 'Notice saved successfully.', 'baba-online-academy' ), 'notice_id' => $result ) );
    }

    public static function delete_notice() {
        check_ajax_referer( 'boa_notices_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( array( 'message' => __( 'You do not have permission to manage notices.', 'baba-online-academy' ) ) );
        }

        $notice_id = isset( $_POST['notice_id'] ) ? absint( $_POST['notice_id'] ) : 0;
        if ( ! $notice_id ) {
            wp_send_json_error( array( 'message' => __( 'Invalid notice selected.', 'baba-online-academy' ) ) );
        }

        $deleted = BOA_DB::delete_notice( $notice_id );
        if ( false === $deleted ) {
            wp_send_json_error( array( 'message' => __( 'Unable to delete notice.', 'baba-online-academy' ) ) );
        }

        wp_send_json_success( array( 'message' => __( 'Notice deleted successfully.', 'baba-online-academy' ) ) );
    }

    public static function download_fee_statement() {
        check_ajax_referer( 'boa_download_fee_statement', 'nonce' );

        if ( ! is_user_logged_in() ) {
            wp_die( __( 'You must be logged in to download your statement.', 'baba-online-academy' ), __( 'Unauthorized', 'baba-online-academy' ), array( 'response' => 403 ) );
        }

        $user    = wp_get_current_user();
        $student = BOA_DB::get_student_by_wp_user_id( $user->ID );
        if ( ! $student ) {
            wp_die( __( 'Student profile not found.', 'baba-online-academy' ), __( 'Not Found', 'baba-online-academy' ), array( 'response' => 404 ) );
        }

        $fees = BOA_DB::get_fees_by_student_id( $student['student_id'] );
        $filename = 'fee-statement-' . sanitize_title( $student['student_uid'] ) . '.csv';

        nocache_headers();
        header( 'Content-Type: text/csv; charset=utf-8' );
        header( 'Content-Disposition: attachment; filename="' . $filename . '"' );

        $output = fopen( 'php://output', 'w' );
        fputcsv( $output, array( 'Invoice ID', 'Course', 'Amount Due', 'Amount Paid', 'Status', 'Payment Date' ) );

        if ( ! empty( $fees ) ) {
            foreach ( $fees as $fee ) {
                fputcsv(
                    $output,
                    array(
                        $fee['invoice_id'],
                        $fee['course_name'],
                        $fee['amount_due'],
                        $fee['amount_paid'],
                        ucfirst( $fee['status'] ),
                        $fee['payment_date'],
                    )
                );
            }
        }

        fclose( $output );
        exit;
    }

    public static function initiate_gateway_payment() {
        check_ajax_referer( 'boa_payment_nonce', 'nonce' );

        if ( ! is_user_logged_in() ) {
            wp_send_json_error( array( 'message' => __( 'You must be logged in to continue.', 'baba-online-academy' ) ) );
        }

        $gateway = isset( $_POST['gateway'] ) ? sanitize_key( wp_unslash( $_POST['gateway'] ) ) : '';
        $fee_id  = isset( $_POST['fee_id'] ) ? absint( $_POST['fee_id'] ) : 0;

        if ( empty( $gateway ) || 0 === $fee_id ) {
            wp_send_json_error( array( 'message' => __( 'Invalid payment request.', 'baba-online-academy' ) ) );
        }

        $student = BOA_DB::get_student_by_wp_user_id( get_current_user_id() );
        if ( ! $student ) {
            wp_send_json_error( array( 'message' => __( 'Student profile not found.', 'baba-online-academy' ) ) );
        }

        $fee = BOA_DB::get_fee( $fee_id );
        if ( ! $fee || (int) $fee['student_id'] !== (int) $student['student_id'] ) {
            wp_send_json_error( array( 'message' => __( 'You do not have permission to pay this invoice.', 'baba-online-academy' ) ) );
        }

        if ( 'paid' === $fee['status'] ) {
            wp_send_json_error( array( 'message' => __( 'This invoice is already paid.', 'baba-online-academy' ) ) );
        }

        $payment_response = BOA_Payments::initiate_payment( $gateway, $fee, $student );

        if ( is_wp_error( $payment_response ) ) {
            wp_send_json_error( array( 'message' => $payment_response->get_error_message() ) );
        }

        wp_send_json_success( $payment_response );
    }

    public static function get_transactions() {
        check_ajax_referer( 'boa_transactions_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( array( 'message' => __( 'You do not have permission to view transactions.', 'baba-online-academy' ) ) );
        }

        $args = array(
            'page'     => isset( $_POST['page'] ) ? max( 1, absint( $_POST['page'] ) ) : 1,
            'per_page' => isset( $_POST['per_page'] ) ? max( 1, absint( $_POST['per_page'] ) ) : 10,
            'gateway'  => isset( $_POST['gateway'] ) ? sanitize_key( wp_unslash( $_POST['gateway'] ) ) : '',
            'status'   => isset( $_POST['status'] ) ? sanitize_text_field( wp_unslash( $_POST['status'] ) ) : '',
            'search'   => isset( $_POST['search'] ) ? sanitize_text_field( wp_unslash( $_POST['search'] ) ) : '',
        );

        $data = BOA_DB::get_transactions( $args );
        $items = array();
        $gateway_labels = array(
            'jazzcash'  => 'JazzCash',
            'easypaisa' => 'EasyPaisa',
            'stripe'    => 'Stripe',
        );

        foreach ( $data['items'] as $item ) {
            $items[] = array(
                'transaction_id'      => $item['transaction_id'],
                'transaction_reference'=> $item['transaction_reference'],
                'gateway'             => $item['gateway'],
                'gateway_label'       => $gateway_labels[ $item['gateway'] ] ?? ucfirst( $item['gateway'] ),
                'invoice_id'          => $item['invoice_id'],
                'student_name'        => $item['student_name'],
                'student_email'       => $item['student_email'],
                'amount'              => $item['amount'],
                'status'              => $item['status'],
                'status_label'        => ucfirst( $item['status'] ),
                'created_at'          => date_i18n( 'd M, Y g:i A', strtotime( $item['created_at'] ) ),
            );
        }

        wp_send_json_success(
            array(
                'items' => $items,
                'total' => $data['total'],
            )
        );
    }

    // ===== Quizzes (Admin) =====
    private static function can_manage_instruction() {
        return current_user_can( 'manage_options' ) || current_user_can( 'boa_manage_instruction' );
    }

    public static function get_quizzes() {
        check_ajax_referer( 'boa_quizzes_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }

        $args = array(
            'page'    => isset( $_POST['page'] ) ? max( 1, absint( $_POST['page'] ) ) : 1,
            'per_page'=> isset( $_POST['per_page'] ) ? max( 1, absint( $_POST['per_page'] ) ) : 10,
            'status'  => isset( $_POST['status'] ) ? sanitize_text_field( wp_unslash( $_POST['status'] ) ) : '',
            'search'  => isset( $_POST['search'] ) ? sanitize_text_field( wp_unslash( $_POST['search'] ) ) : '',
            'course'  => isset( $_POST['course_id'] ) ? absint( $_POST['course_id'] ) : 0,
        );

        $quizzes = BOA_DB::get_quizzes( $args );
        wp_send_json_success( $quizzes );
    }

    public static function save_quiz() {
        check_ajax_referer( 'boa_quizzes_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }

        $data = array(
            'quiz_id'         => isset( $_POST['quiz_id'] ) ? absint( $_POST['quiz_id'] ) : 0,
            'course_id'       => isset( $_POST['course_id'] ) ? absint( $_POST['course_id'] ) : 0,
            'title'           => sanitize_text_field( wp_unslash( $_POST['title'] ?? '' ) ),
            'instructions'    => wp_kses_post( wp_unslash( $_POST['instructions'] ?? '' ) ),
            'total_marks'     => isset( $_POST['total_marks'] ) ? floatval( $_POST['total_marks'] ) : null,
            'pass_percentage' => isset( $_POST['pass_percentage'] ) ? floatval( $_POST['pass_percentage'] ) : null,
            'time_limit'      => isset( $_POST['time_limit'] ) ? absint( $_POST['time_limit'] ) : null,
            'status'          => sanitize_text_field( wp_unslash( $_POST['status'] ?? 'draft' ) ),
        );

        if ( empty( $data['course_id'] ) || empty( $data['title'] ) ) {
            wp_send_json_error( array( 'message' => __( 'Course and title are required.', 'baba-online-academy' ) ) );
        }

        $result = BOA_DB::save_quiz( $data );
        if ( false === $result ) {
            wp_send_json_error( array( 'message' => __( 'Unable to save quiz.', 'baba-online-academy' ) ) );
        }

        wp_send_json_success( array( 'quiz_id' => $result ) );
    }

    public static function delete_quiz() {
        check_ajax_referer( 'boa_quizzes_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }

        $quiz_id = isset( $_POST['quiz_id'] ) ? absint( $_POST['quiz_id'] ) : 0;
        if ( ! $quiz_id ) {
            wp_send_json_error( array( 'message' => __( 'Invalid quiz.', 'baba-online-academy' ) ) );
        }

        BOA_DB::delete_quiz( $quiz_id );
        wp_send_json_success( array( 'message' => __( 'Quiz deleted.', 'baba-online-academy' ) ) );
    }

    public static function get_quiz_questions() {
        check_ajax_referer( 'boa_quizzes_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }

        $quiz_id = isset( $_POST['quiz_id'] ) ? absint( $_POST['quiz_id'] ) : 0;
        if ( ! $quiz_id ) {
            wp_send_json_error( array( 'message' => __( 'Invalid quiz.', 'baba-online-academy' ) ) );
        }

        $questions = BOA_DB::get_quiz_questions( $quiz_id );
        wp_send_json_success( array( 'questions' => $questions ) );
    }

    public static function save_quiz_question() {
        check_ajax_referer( 'boa_quizzes_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }

        $data = array(
            'question_id'   => isset( $_POST['question_id'] ) ? absint( $_POST['question_id'] ) : 0,
            'quiz_id'       => isset( $_POST['quiz_id'] ) ? absint( $_POST['quiz_id'] ) : 0,
            'question_text' => wp_unslash( $_POST['question_text'] ?? '' ),
            'question_type' => sanitize_text_field( wp_unslash( $_POST['question_type'] ?? 'mcq' ) ),
            'marks'         => isset( $_POST['marks'] ) ? floatval( $_POST['marks'] ) : 1,
            'question_order'=> isset( $_POST['question_order'] ) ? absint( $_POST['question_order'] ) : 0,
        );

        if ( empty( $data['quiz_id'] ) || empty( $data['question_text'] ) ) {
            wp_send_json_error( array( 'message' => __( 'Question text and quiz are required.', 'baba-online-academy' ) ) );
        }

        $options = isset( $_POST['options'] ) ? wp_unslash( $_POST['options'] ) : array();
        if ( is_string( $options ) ) {
            $decoded = json_decode( $options, true );
            if ( json_last_error() === JSON_ERROR_NONE ) {
                $options = $decoded;
            }
        }
        $data['options'] = is_array( $options ) ? $options : array();

        $question_id = BOA_DB::save_quiz_question( $data );
        if ( ! $question_id ) {
            wp_send_json_error( array( 'message' => __( 'Unable to save question.', 'baba-online-academy' ) ) );
        }

        wp_send_json_success( array( 'question_id' => $question_id ) );
    }

    public static function delete_quiz_question() {
        check_ajax_referer( 'boa_quizzes_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }

        $question_id = isset( $_POST['question_id'] ) ? absint( $_POST['question_id'] ) : 0;
        if ( ! $question_id ) {
            wp_send_json_error( array( 'message' => __( 'Invalid question.', 'baba-online-academy' ) ) );
        }
        BOA_DB::delete_quiz_question( $question_id );
        wp_send_json_success( array( 'message' => __( 'Question removed.', 'baba-online-academy' ) ) );
    }

    public static function get_quiz_attempts() {
        check_ajax_referer( 'boa_quizzes_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }
        $quiz_id = isset( $_POST['quiz_id'] ) ? absint( $_POST['quiz_id'] ) : 0;
        if ( ! $quiz_id ) {
            wp_send_json_error( array( 'message' => __( 'Invalid quiz.', 'baba-online-academy' ) ) );
        }
        $attempts = BOA_DB::get_quiz_attempts( $quiz_id );
        wp_send_json_success( array( 'attempts' => $attempts ) );
    }

    public static function update_quiz_attempt() {
        check_ajax_referer( 'boa_quizzes_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }
        $attempt_id = isset( $_POST['attempt_id'] ) ? absint( $_POST['attempt_id'] ) : 0;
        $score      = isset( $_POST['score'] ) ? floatval( $_POST['score'] ) : 0.0;
        if ( ! $attempt_id ) {
            wp_send_json_error( array( 'message' => __( 'Invalid attempt.', 'baba-online-academy' ) ) );
        }
        $result = BOA_DB::update_quiz_attempt_score( $attempt_id, $score );
        if ( $result === false ) {
            wp_send_json_error( array( 'message' => __( 'Unable to update score.', 'baba-online-academy' ) ) );
        }
        wp_send_json_success( array( 'message' => __( 'Score updated.', 'baba-online-academy' ) ) );
    }

    // ===== Assignments (Admin) =====
    public static function get_assignments() {
        check_ajax_referer( 'boa_assignments_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }

        $args = array(
            'page'   => isset( $_POST['page'] ) ? max( 1, absint( $_POST['page'] ) ) : 1,
            'per_page'=> isset( $_POST['per_page'] ) ? max( 1, absint( $_POST['per_page'] ) ) : 10,
            'search' => isset( $_POST['search'] ) ? sanitize_text_field( wp_unslash( $_POST['search'] ) ) : '',
            'course' => isset( $_POST['course_id'] ) ? absint( $_POST['course_id'] ) : 0,
            'status' => isset( $_POST['status'] ) ? sanitize_text_field( wp_unslash( $_POST['status'] ) ) : '',
        );

        wp_send_json_success( BOA_DB::get_assignments( $args ) );
    }

    public static function save_assignment() {
        check_ajax_referer( 'boa_assignments_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }

        $data = array(
            'assignment_id' => isset( $_POST['assignment_id'] ) ? absint( $_POST['assignment_id'] ) : 0,
            'course_id'     => isset( $_POST['course_id'] ) ? absint( $_POST['course_id'] ) : 0,
            'title'         => sanitize_text_field( wp_unslash( $_POST['title'] ?? '' ) ),
            'description'   => wp_kses_post( wp_unslash( $_POST['description'] ?? '' ) ),
            'instructions'  => wp_kses_post( wp_unslash( $_POST['instructions'] ?? '' ) ),
            'attachment_url'=> esc_url_raw( $_POST['attachment_url'] ?? '' ),
            'max_marks'     => isset( $_POST['max_marks'] ) ? floatval( $_POST['max_marks'] ) : null,
            'due_date'      => isset( $_POST['due_date'] ) ? sanitize_text_field( wp_unslash( $_POST['due_date'] ) ) : '',
            'status'        => sanitize_text_field( wp_unslash( $_POST['status'] ?? 'published' ) ),
        );

        if ( empty( $data['course_id'] ) || empty( $data['title'] ) ) {
            wp_send_json_error( array( 'message' => __( 'Course and title are required.', 'baba-online-academy' ) ) );
        }

        $assignment_id = BOA_DB::save_assignment( $data );
        if ( ! $assignment_id ) {
            wp_send_json_error( array( 'message' => __( 'Unable to save assignment.', 'baba-online-academy' ) ) );
        }

        wp_send_json_success( array( 'assignment_id' => $assignment_id ) );
    }

    public static function delete_assignment() {
        check_ajax_referer( 'boa_assignments_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }
        $assignment_id = isset( $_POST['assignment_id'] ) ? absint( $_POST['assignment_id'] ) : 0;
        if ( ! $assignment_id ) {
            wp_send_json_error( array( 'message' => __( 'Invalid assignment.', 'baba-online-academy' ) ) );
        }
        BOA_DB::delete_assignment( $assignment_id );
        wp_send_json_success( array( 'message' => __( 'Assignment deleted.', 'baba-online-academy' ) ) );
    }

    public static function get_assignment_submissions() {
        check_ajax_referer( 'boa_assignments_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }
        $assignment_id = isset( $_POST['assignment_id'] ) ? absint( $_POST['assignment_id'] ) : 0;
        if ( ! $assignment_id ) {
            wp_send_json_error( array( 'message' => __( 'Invalid assignment.', 'baba-online-academy' ) ) );
        }
        $rows = BOA_DB::get_assignment_submissions( $assignment_id );
        wp_send_json_success( array( 'submissions' => $rows ) );
    }

    public static function grade_assignment() {
        check_ajax_referer( 'boa_assignments_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }
        $submission_id = isset( $_POST['submission_id'] ) ? absint( $_POST['submission_id'] ) : 0;
        if ( ! $submission_id ) {
            wp_send_json_error( array( 'message' => __( 'Invalid submission.', 'baba-online-academy' ) ) );
        }
        $marks   = isset( $_POST['marks'] ) ? floatval( $_POST['marks'] ) : null;
        $remarks = wp_unslash( $_POST['remarks'] ?? '' );
        $feedback = wp_unslash( $_POST['feedback'] ?? '' );
        BOA_DB::grade_assignment_submission( $submission_id, $marks, $remarks, 'graded', $feedback );
        wp_send_json_success( array( 'message' => __( 'Submission graded.', 'baba-online-academy' ) ) );
    }

    // ===== Student Quizzes & Assignments =====
    private static function ensure_student() {
        if ( ! is_user_logged_in() ) {
            wp_send_json_error( array( 'message' => __( 'Login required.', 'baba-online-academy' ) ) );
        }
        $student = BOA_DB::get_student_by_wp_user_id( get_current_user_id() );
        if ( ! $student ) {
            wp_send_json_error( array( 'message' => __( 'Student profile not found.', 'baba-online-academy' ) ) );
        }
        return $student;
    }

    public static function fetch_student_quizzes() {
        check_ajax_referer( 'boa_student_nonce', 'nonce' );
        $student = self::ensure_student();
        $quizzes = BOA_DB::get_student_quizzes( $student['student_id'] );
        wp_send_json_success( array( 'quizzes' => $quizzes ) );
    }

    public static function load_quiz_detail() {
        check_ajax_referer( 'boa_student_nonce', 'nonce' );
        $student = self::ensure_student();
        $quiz_id = isset( $_POST['quiz_id'] ) ? absint( $_POST['quiz_id'] ) : 0;
        if ( ! $quiz_id ) {
            wp_send_json_error( array( 'message' => __( 'Invalid quiz.', 'baba-online-academy' ) ) );
        }
        $quiz = BOA_DB::get_quiz_with_questions( $quiz_id, $student['student_id'] );
        if ( ! $quiz ) {
            wp_send_json_error( array( 'message' => __( 'You are not allowed to access this quiz.', 'baba-online-academy' ) ) );
        }
        wp_send_json_success( array( 'quiz' => $quiz ) );
    }

    public static function submit_quiz_attempt() {
        check_ajax_referer( 'boa_student_nonce', 'nonce' );
        $student = self::ensure_student();
        $quiz_id = isset( $_POST['quiz_id'] ) ? absint( $_POST['quiz_id'] ) : 0;
        $answers = isset( $_POST['answers'] ) ? wp_unslash( $_POST['answers'] ) : array();
        if ( is_string( $answers ) ) {
            $decoded = json_decode( $answers, true );
            if ( json_last_error() === JSON_ERROR_NONE ) {
                $answers = $decoded;
            }
        }

        if ( ! $quiz_id || empty( $answers ) || ! is_array( $answers ) ) {
            wp_send_json_error( array( 'message' => __( 'Quiz and answers are required.', 'baba-online-academy' ) ) );
        }

        $quiz = BOA_DB::get_quiz_with_questions( $quiz_id, $student['student_id'] );
        if ( ! $quiz ) {
            wp_send_json_error( array( 'message' => __( 'Quiz not found.', 'baba-online-academy' ) ) );
        }

        $score = 0;
        $total = 0;
        foreach ( $quiz['questions'] as $question ) {
            $question_id = $question['question_id'];
            $marks = isset( $question['marks'] ) ? (float) $question['marks'] : 1;
            $total += $marks;
            if ( empty( $question['options'] ) ) {
                continue;
            }
            $correct = array_filter( $question['options'], function( $opt ) {
                return ! empty( $opt['is_correct'] );
            } );
            $selected = isset( $answers[ $question_id ] ) ? (int) $answers[ $question_id ] : 0;
            foreach ( $correct as $opt ) {
                if ( (int) $opt['option_id'] === $selected ) {
                    $score += $marks;
                    break;
                }
            }
        }

        BOA_DB::record_quiz_attempt( $quiz_id, $student['student_id'], $score, $total, $answers );
        wp_send_json_success( array( 'score' => $score, 'total' => $total ) );
    }

    public static function fetch_student_assignments() {
        check_ajax_referer( 'boa_student_nonce', 'nonce' );
        $student = self::ensure_student();
        $assignments = BOA_DB::get_student_assignments( $student['student_id'] );
        wp_send_json_success( array( 'assignments' => $assignments ) );
    }

    public static function submit_assignment() {
        check_ajax_referer( 'boa_student_nonce', 'nonce' );
        $student = self::ensure_student();
        $assignment_id = isset( $_POST['assignment_id'] ) ? absint( $_POST['assignment_id'] ) : 0;
        if ( ! $assignment_id || empty( $_FILES['submission_file'] ) ) {
            wp_send_json_error( array( 'message' => __( 'Assignment and file are required.', 'baba-online-academy' ) ) );
        }

        require_once ABSPATH . 'wp-admin/includes/file.php';
        $uploaded = wp_handle_upload( $_FILES['submission_file'], array( 'test_form' => false ) );
        if ( isset( $uploaded['error'] ) ) {
            wp_send_json_error( array( 'message' => $uploaded['error'] ) );
        }

        $submission_id = BOA_DB::save_assignment_submission( array(
            'assignment_id' => $assignment_id,
            'student_id'    => $student['student_id'],
            'file_url'      => $uploaded['url'],
        ) );

        if ( ! $submission_id ) {
            wp_send_json_error( array( 'message' => __( 'Unable to save submission.', 'baba-online-academy' ) ) );
        }

        wp_send_json_success( array( 'submission_id' => $submission_id ) );
    }

    // ===== نیا: کورس میٹریل AJAX فنکشنز =====

    public static function get_course_materials() {
        check_ajax_referer( 'boa_materials_nonce', 'nonce' );
        $course_id = isset( $_POST['course_id'] ) ? absint( $_POST['course_id'] ) : 0;
        if ( ! $course_id ) {
            wp_send_json_error( array( 'message' => 'Invalid course.' ) );
        }
        $materials = BOA_DB::get_materials_by_course_id( $course_id );
        wp_send_json_success( $materials );
    }

    public static function save_course_material() {
        check_ajax_referer( 'boa_materials_nonce', 'nonce' );
        $data = wp_unslash( $_POST );
        if ( empty( $data['course_id'] ) || empty( $data['title'] ) || empty( $data['material_type'] ) ) {
            wp_send_json_error( array( 'message' => 'Please fill all required fields.' ) );
        }
        $result = BOA_DB::save_material( $data );
        if ( is_wp_error( $result ) ) {
            wp_send_json_error( array( 'message' => $result->get_error_message() ) );
        }
        wp_send_json_success( array( 'message' => 'Material saved successfully.', 'material_id' => $result ) );
    }

    public static function delete_course_material() {
        check_ajax_referer( 'boa_materials_nonce', 'nonce' );
        $material_id = isset( $_POST['material_id'] ) ? absint( $_POST['material_id'] ) : 0;
        if ( ! $material_id ) {
            wp_send_json_error( array( 'message' => 'Invalid Material ID.' ) );
        }
        $result = BOA_DB::delete_material( $material_id );
        if ( $result === false ) {
            wp_send_json_error( array( 'message' => 'Could not delete material.' ) );
        }
        wp_send_json_success( array( 'message' => 'Material deleted successfully.' ) );
    }

    /**
     * نیا ہیلپر فنکشن: سرٹیفکیٹ بناتا اور محفوظ کرتا ہے
     */
    private static function generate_and_save_certificate( $student_id ) {
        // لائبریریاں شامل کریں
        require_once BOA_PLUGIN_DIR . 'lib/fpdf.php';

        // ڈیٹا حاصل کریں
        $student = BOA_DB::get_student_by_id( $student_id );
        if ( ! $student ) {
            return new WP_Error( 'student_not_found', 'Student not found.' );
        }
        $course = BOA_DB::get_courses( array( 'course_id' => $student['course_id'] ) );
        $course_name = ! empty( $course['items'] ) ? $course['items'][0]['course_name'] : 'N/A';

        // ٹوکن بنائیں
        $token = wp_generate_password( 32, false );

        // QR کوڈ بنائیں
        $verification_url = home_url( '/verify-certificate/?token=' . $token );
        $qr_code_url = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' . urlencode( $verification_url );
        
        // PDF بنائیں
        $pdf = new FPDF( 'L', 'mm', 'A4' );
        $pdf->AddPage();
        
        // بارڈر
        $pdf->Rect( 5, 5, 287, 200, 'D' );

        // عنوان
        $pdf->SetFont( 'Arial', 'B', 30 );
        $pdf->Cell( 0, 30, 'Certificate of Completion', 0, 1, 'C' );
        
        // مواد
        $pdf->SetFont( 'Arial', '', 20 );
        $pdf->Cell( 0, 20, 'This is to certify that', 0, 1, 'C' );
        
        $pdf->SetFont( 'Arial', 'B', 25 );
        $pdf->Cell( 0, 25, $student['name'], 0, 1, 'C' );
        
        $pdf->SetFont( 'Arial', '', 20 );
        $pdf->Cell( 0, 20, 'has successfully completed the course', 0, 1, 'C' );
        
        $pdf->SetFont( 'Arial', 'B', 25 );
        $pdf->Cell( 0, 25, $course_name, 0, 1, 'C' );
        
        $pdf->SetFont( 'Arial', '', 15 );
        $pdf->Cell( 0, 15, 'on ' . date( 'F j, Y' ), 0, 1, 'C' );

        // QR کوڈ
        $pdf->Image( $qr_code_url, 240, 160, 40, 40, 'PNG' );

        // PDF محفوظ کریں
        $upload_dir = wp_upload_dir();
        $file_name = 'certificate-' . $student_id . '-' . time() . '.pdf';
        $file_path = $upload_dir['path'] . '/' . $file_name;
        $file_url = $upload_dir['url'] . '/' . $file_name;

        $pdf->Output( 'F', $file_path );

        // ڈیٹا بیس اپ ڈیٹ کریں
        global $wpdb;
        if ( function_exists( 'set_time_limit' ) ) {
            @set_time_limit( 0 );
        }
        $wpdb->update(
            $wpdb->prefix . 'boa_students',
            array(
                'certificate_url' => $file_url,
                'certificate_token' => $token,
            ),
            array( 'student_id' => $student_id ),
            array( '%s', '%s' ),
            array( '%d' )
        );

        if ( class_exists( 'BOA_Notifications' ) ) {
            BOA_Notifications::send_certificate_email( $student, $course_name, $file_url, $verification_url );
        }

        if ( class_exists( 'BOA_Notifications' ) ) {
            $student = BOA_DB::get_student_by_id( $student_id );
            if ( $student ) {
                BOA_Notifications::send_admission_status_email( $student, 'approved' );
            }
        }

        return true;
    }

    public static function get_next_student_id() {
        check_ajax_referer( 'boa_students_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) && ! current_user_can( 'boa_manage_students' ) ) {
            wp_send_json_error( array( 'message' => 'Unauthorized access.' ) );
        }
        $next_uid = BOA_DB::get_next_student_uid();
        wp_send_json_success( array( 'next_student_id' => $next_uid ) );
    }

    // ===== Students =====
    public static function get_students() {
        check_ajax_referer( 'boa_students_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) && ! current_user_can( 'boa_manage_students' ) ) {
            wp_send_json_error( array( 'message' => 'Unauthorized access.' ) );
        }
        $args = array(
            'page'     => isset( $_POST['page'] ) ? max( 1, (int) $_POST['page'] ) : 1,
            'per_page' => isset( $_POST['per_page'] ) ? max( 1, (int) $_POST['per_page'] ) : 10,
            'search'   => isset( $_POST['search'] ) ? sanitize_text_field( wp_unslash( $_POST['search'] ) ) : '',
            'status'   => isset( $_POST['status_filter'] ) ? sanitize_text_field( wp_unslash( $_POST['status_filter'] ) ) : '',
            'course'   => isset( $_POST['course_filter'] ) ? absint( $_POST['course_filter'] ) : '',
            'dateFrom' => isset( $_POST['dateFrom'] ) ? sanitize_text_field( wp_unslash( $_POST['dateFrom'] ) ) : '',
            'dateTo'   => isset( $_POST['dateTo'] ) ? sanitize_text_field( wp_unslash( $_POST['dateTo'] ) ) : '',
        );
        $args['status'] = in_array($args['status'], ['active', 'inactive', 'pending', 'completed']) ? $args['status'] : '';
        if (empty($args['status'])) {
             $args['status__not_in'] = ['pending_review'];
        }
        $data = BOA_DB::get_students( $args );
        wp_send_json_success( array( 'students' => $data['items'], 'page' => $args['page'], 'per_page' => $args['per_page'], 'total' => $data['total'] ) );
    }
    public static function save_student() {
        check_ajax_referer( 'boa_students_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) && ! current_user_can( 'boa_manage_students' ) ) {
            wp_send_json_error( array( 'message' => 'Unauthorized access.' ) );
        }
        $data = wp_unslash( $_POST );
        if ( empty( $data['name'] ) || empty( $data['email'] ) || empty( $data['course_id'] ) || empty( $data['admission_date'] ) ) {
            wp_send_json_error( array( 'message' => 'Please fill all required fields.' ) );
        }

        $student_id = isset( $data['student_id'] ) ? absint( $data['student_id'] ) : 0;
        $new_status = sanitize_text_field( $data['status'] );
        $old_status = '';

        if ( $student_id > 0 ) {
            $old_student_data = BOA_DB::get_student_by_id( $student_id ); // فرض ہے کہ یہ فنکشن موجود ہے
            if ( $old_student_data ) {
                $old_status = $old_student_data['status'];
            }
        }

        $result = BOA_DB::save_student( $data );
        if ( is_wp_error( $result ) ) { wp_send_json_error( array( 'message' => $result->get_error_message() ) ); }

        // سرٹیفکیٹ جنریشن کو ٹرگر کریں
        if ( $new_status === 'completed' && $old_status !== 'completed' ) {
            $cert_result = self::generate_and_save_certificate( $result );
            if ( is_wp_error( $cert_result ) ) {
                error_log( 'Certificate generation failed for student ' . $result . ': ' . $cert_result->get_error_message() );
            }
        }

        wp_send_json_success( array( 'message' => 'Student saved successfully.', 'student_id' => $result ) );
    }
    public static function delete_student() {
        check_ajax_referer( 'boa_students_nonce', 'nonce' );
        if ( ! current_user_can( 'manage_options' ) && ! current_user_can( 'boa_manage_students' ) ) {
            wp_send_json_error( array( 'message' => 'Unauthorized access.' ) );
        }
        $student_id = isset( $_POST['student_id'] ) ? absint( $_POST['student_id'] ) : 0;
        if ( $student_id === 0 ) { wp_send_json_error( array( 'message' => 'Invalid Student ID.' ) ); }
        $result = BOA_DB::delete_student( $student_id );
        if ( $result === false ) { wp_send_json_error( array( 'message' => 'Could not delete student.' ) ); }
        wp_send_json_success( array( 'message' => 'Student deleted successfully.' ) );
    }

    // ===== Courses =====
    public static function get_courses() {
        check_ajax_referer( 'boa_courses_nonce', 'nonce' );
        $args = array(
            'page'            => isset( $_POST['page'] ) ? max( 1, (int) $_POST['page'] ) : 1,
            'per_page'        => isset( $_POST['per_page'] ) ? max( 1, (int) $_POST['per_page'] ) : 10,
            'search'          => isset( $_POST['search'] ) ? sanitize_text_field( wp_unslash( $_POST['search'] ) ) : '',
            'status_filter'   => isset( $_POST['status_filter'] ) ? sanitize_text_field( wp_unslash( $_POST['status_filter'] ) ) : '',
            'category_filter' => isset( $_POST['category_filter'] ) ? absint( $_POST['category_filter'] ) : '',
        );
        $data = BOA_DB::get_courses( $args );
        wp_send_json_success( array( 'courses' => $data['items'], 'page' => $args['page'], 'per_page' => $args['per_page'], 'total' => $data['total'] ) );
    }
    public static function save_course() {
        check_ajax_referer( 'boa_courses_nonce', 'nonce' );
        $data = wp_unslash( $_POST );
        
        // Debug logging
        error_log('BOA Course Save - Incoming data: ' . print_r($data, true));
        
        if ( empty( $data['course_name'] ) || empty( $data['category_id'] ) || ! isset( $data['fee_amount'] ) || empty( $data['duration'] ) ) {
            wp_send_json_error( array( 'message' => 'Please fill all required fields.' ) );
        }
        $data['course_id'] = isset( $data['course_id'] ) ? absint( $data['course_id'] ) : 0;
        
        // Debug logging before save
        error_log('BOA Course Save - About to call BOA_DB::save_course');
        
        $result = BOA_DB::save_course( $data );
        
        // Debug logging
        error_log('BOA Course Save - Result: ' . print_r($result, true));
        
        if ( is_wp_error( $result ) ) { 
            $error_message = $result->get_error_message();
            error_log('BOA Course Save - WP Error: ' . $error_message);
            wp_send_json_error( array( 'message' => $error_message ) ); 
        }
        
        if ( $result === false ) {
            error_log('BOA Course Save - Database operation returned false');
            wp_send_json_error( array( 'message' => 'Database operation failed.' ) );
        }
        
        error_log('BOA Course Save - Success');
        wp_send_json_success( array( 'message' => 'Course saved successfully.', 'course_id' => $result ) );
    }
    public static function delete_course() {
        check_ajax_referer( 'boa_courses_nonce', 'nonce' );
        $course_id = isset( $_POST['course_id'] ) ? absint( $_POST['course_id'] ) : 0;
        if ( $course_id === 0 ) { wp_send_json_error( array( 'message' => 'Invalid Course ID.' ) ); }
        $result = BOA_DB::delete_course( $course_id );
        if ( $result === false ) { wp_send_json_error( array( 'message' => 'Could not delete course.' ) ); }
        wp_send_json_success( array( 'message' => 'Course deleted successfully.' ) );
    }

    // ===== Fees =====
    public static function get_fees() {
        check_ajax_referer( 'boa_fees_nonce', 'nonce' );
        $args = array(
            'page'     => isset( $_POST['page'] ) ? max( 1, (int) $_POST['page'] ) : 1,
            'per_page' => isset( $_POST['per_page'] ) ? max( 1, (int) $_POST['per_page'] ) : 10,
            'search'   => isset( $_POST['search'] ) ? sanitize_text_field( wp_unslash( $_POST['search'] ) ) : '',
            'status'   => isset( $_POST['status_filter'] ) ? sanitize_text_field( wp_unslash( $_POST['status_filter'] ) ) : '',
            'course'   => isset( $_POST['course_filter'] ) ? absint( $_POST['course_filter'] ) : '',
            'dateFrom' => isset( $_POST['dateFrom'] ) ? sanitize_text_field( wp_unslash( $_POST['dateFrom'] ) ) : '',
            'dateTo'   => isset( $_POST['dateTo'] ) ? sanitize_text_field( wp_unslash( $_POST['dateTo'] ) ) : '',
        );
        
        // Debug: Log the filter being applied
        error_log( 'BOA Fees Filter Debug: ' . print_r( $args, true ) );
        
        $data = BOA_DB::get_fees( $args );
        
        // Debug: Log the results
        error_log( 'BOA Fees Results Debug: Total=' . $data['total'] . ', Items=' . count( $data['items'] ) );
        if ( $data['items'] ) {
            $statuses = array_unique( array_column( $data['items'], 'status' ) );
            error_log( 'BOA Fees Statuses found: ' . implode( ', ', $statuses ) );
        }
        
        wp_send_json_success( array( 'fees' => $data['items'], 'page' => $args['page'], 'per_page' => $args['per_page'], 'total' => $data['total'] ) );
    }
    public static function save_fee() {
        check_ajax_referer( 'boa_fees_nonce', 'nonce' );
        $data = wp_unslash( $_POST );
        if ( empty( $data['student_id'] ) || empty( $data['course_id'] ) || !isset($data['amount_paid']) || empty( $data['payment_date'] ) ) {
            wp_send_json_error( array( 'message' => 'Student, Course, Amount Paid, and Payment Date are required.' ) );
        }
        $data['fee_id'] = isset( $data['fee_id'] ) ? absint( $data['fee_id'] ) : 0;
        if ( empty( $data['invoice_id'] ) ) { $data['invoice_id'] = 'INV-' . time(); }
        $result = BOA_DB::save_fee( $data );
        if ( is_wp_error( $result ) ) { wp_send_json_error( array( 'message' => $result->get_error_message() ) ); }
        wp_send_json_success( array( 'message' => 'Fee record saved successfully.', 'fee_id'  => $result ) );
    }
    public static function delete_fee() {
        check_ajax_referer( 'boa_fees_nonce', 'nonce' );
        $fee_id = isset( $_POST['fee_id'] ) ? absint( $_POST['fee_id'] ) : 0;
        if ( $fee_id === 0 ) { wp_send_json_error( array( 'message' => 'Invalid Fee ID.' ) ); }
        $result = BOA_DB::delete_fee( $fee_id );
        if ( $result === false ) { wp_send_json_error( array( 'message' => 'Could not delete fee record.' ) ); }
        wp_send_json_success( array( 'message' => 'Fee record deleted successfully.' ) );
    }
    public static function upload_receipt() {
        check_ajax_referer( 'boa_fees_nonce', 'nonce' );
        if ( empty( $_FILES['receipt_file'] ) ) { wp_send_json_error( array( 'message' => 'No file received' ) ); }
        require_once ABSPATH . 'wp-admin/includes/file.php';
        $file = $_FILES['receipt_file'];
        $uploaded = wp_handle_upload( $file, array( 'test_form' => false ) );
        if ( isset( $uploaded['error'] ) ) { wp_send_json_error( array( 'message' => $uploaded['error'] ) ); }
        wp_send_json_success( array( 'file_url' => $uploaded['url'] ) );
    }

    // ===== Reports =====
    public static function get_report_data() {
        // (یہ فنکشن پہلے جیسا ہی رہے گا)
        check_ajax_referer( 'boa_reports_nonce', 'nonce' );
        $tab = isset( $_POST['tab'] ) ? sanitize_text_field( $_POST['tab'] ) : 'income';
        $filters = isset( $_POST['filters'] ) ? (array) wp_unslash( $_POST['filters'] ) : array();
        $data = array();
        $clean_filters = array(
            'dateFrom' => isset( $filters['dateFrom'] ) ? sanitize_text_field( $filters['dateFrom'] ) : '',
            'dateTo'   => isset( $filters['dateTo'] ) ? sanitize_text_field( $filters['dateTo'] ) : '',
            'course'   => isset( $filters['course'] ) ? absint( $filters['course'] ) : 0,
            'category' => isset( $filters['category'] ) ? absint( $filters['category'] ) : 0,
            'status'   => isset( $filters['status'] ) ? sanitize_text_field( $filters['status'] ) : '',
        );
        switch ( $tab ) {
            case 'income':
                $data['income_trend'] = BOA_DB::get_report_income_trend( $clean_filters );
                $data['course_income_summary'] = BOA_DB::get_report_course_income_summary( $clean_filters );
                $data['income_details'] = BOA_DB::get_report_income_details( $clean_filters );
                $data['expense_summary'] = BOA_DB::get_expense_summary( $clean_filters );
                $data['expense_breakdown'] = BOA_DB::get_expense_breakdown( $clean_filters );
                $data['profit_snapshot'] = BOA_DB::get_profit_snapshot( $clean_filters );
                break;
            case 'students':
                $data['student_stats'] = BOA_DB::get_student_summary_stats();
                $data['students_by_course'] = BOA_DB::get_student_course_snapshot_stats();
                $data['student_list'] = BOA_DB::get_students( $clean_filters );
                break;
            case 'fees':
                $data['fee_stats'] = BOA_DB::get_fee_summary_stats();
                $data['fee_status_snapshot'] = BOA_DB::get_fee_status_snapshot();
                $data['fee_list'] = BOA_DB::get_fees( $clean_filters );
                break;
            case 'courses':
                $data['course_profitability'] = BOA_DB::get_report_course_income_summary( $clean_filters );
                $data['top_courses'] = BOA_DB::get_report_course_income_summary( $clean_filters );
                $data['course_list'] = array();
                break;
        }
        wp_send_json_success( $data );
    }

    // ===== Settings & Categories =====
    public static function upload_logo() {
        check_ajax_referer( 'boa_settings_nonce', 'nonce' );
        if ( empty( $_FILES['logo_file'] ) ) { wp_send_json_error( array( 'message' => 'No file received' ) ); }
        require_once ABSPATH . 'wp-admin/includes/file.php';
        $file = $_FILES['logo_file'];
        $uploaded = wp_handle_upload( $file, array( 'test_form' => false ) );
        if ( isset( $uploaded['error'] ) ) { wp_send_json_error( array( 'message' => $uploaded['error'] ) ); }
        $settings = BOA_DB::get_settings(); $settings['logo_url'] = $uploaded['url'];
        BOA_DB::save_settings( $settings );
        wp_send_json_success( array( 'logo_url' => $uploaded['url'] ) );
    }
    public static function save_settings() {
        check_ajax_referer( 'boa_settings_nonce', 'nonce' );
        $section = isset( $_POST['section'] ) ? sanitize_text_field( wp_unslash( $_POST['section'] ) ) : 'general';
        $data    = isset( $_POST['data'] ) ? (array) wp_unslash( $_POST['data'] ) : array();
        $settings = BOA_DB::get_settings();
        foreach ( $data as $key => $value ) { $settings[ $key ] = $value; }
        BOA_DB::save_settings( $settings );
        wp_send_json_success( array( 'settings' => $settings, 'section'  => $section ) );
    }
    public static function manage_category() {
        check_ajax_referer( 'boa_settings_nonce', 'nonce' );
        $operation = isset( $_POST['operation'] ) ? sanitize_text_field( wp_unslash( $_POST['operation'] ) ) : '';
        $name      = isset( $_POST['category_name'] ) ? sanitize_text_field( wp_unslash( $_POST['category_name'] ) ) : '';
        $id        = isset( $_POST['category_id'] ) ? absint( $_POST['category_id'] ) : 0;
        $result = false;
        if ( 'add' === $operation ) { $result = BOA_DB::add_category( $name ); }
        elseif ( 'edit' === $operation && $id > 0 ) { $result = BOA_DB::update_category( $id, $name ); }
        elseif ( 'delete' === $operation && $id > 0 ) { $result = BOA_DB::delete_category( $id ); }
        if ( is_wp_error( $result ) ) { wp_send_json_error( array( 'message' => $result->get_error_message() ) ); }
        if ( $result === false ) { wp_send_json_error( array( 'message' => 'Invalid operation or data.' ) ); }
        $categories = BOA_DB::get_categories();
        wp_send_json_success( array( 'categories' => $categories ) );
    }

    // ===========================================
    // ===== اپ ڈیٹ شدہ فنکشنز (Admission & Discount) =====
    // ===========================================

    /**
     * پبلک فنکشن
     * کورس کی فیس فرنٹ-اینڈ فارم کو بھیجتا ہے۔
     */
    public static function get_course_fee_public() {
        check_ajax_referer( 'boa_public_nonce', 'nonce' );
        $course_id = isset( $_POST['course_id'] ) ? absint( $_POST['course_id'] ) : 0;
        if ( $course_id === 0 ) {
            wp_send_json_error( array( 'message' => 'Invalid course.' ) );
        }
        $fee = BOA_DB::get_course_fee_public( $course_id );
        wp_send_json_success( array( 'fee_amount' => $fee ) );
    }

    /**
     * پبلک فنکشن
     * فرنٹ-اینڈ ایڈمیشن فارم کو سبمٹ کرتا ہے۔
     */
    public static function submit_admission_form() {
        check_ajax_referer( 'boa_public_nonce', 'nonce' );

        $data            = wp_unslash( $_POST );
        $required_fields = array( 'name', 'email', 'phone', 'city', 'course_id', 'amount_paid' );

        foreach ( $required_fields as $field ) {
            if ( empty( $data[ $field ] ) ) {
                wp_send_json_error( array( 'message' => "Error: Field '$field' is required." ) );
            }
        }

        $email     = sanitize_email( $data['email'] );
        $phone     = sanitize_text_field( $data['phone'] );
        $course_id = absint( $data['course_id'] );

        if ( $course_id === 0 ) {
            wp_send_json_error( array( 'message' => 'Invalid course selection.' ) );
        }

        if ( BOA_DB::student_exists_for_course( $email, $phone, $course_id ) ) {
            wp_send_json_error( array( 'message' => __( 'This student already exists for the selected course.', 'baba-online-academy' ) ) );
        }

        $submission_conflict = BOA_DB::get_form_submission_conflict( $email, $phone, $course_id );
        if ( $submission_conflict === 'email' ) {
            wp_send_json_error( array( 'message' => __( 'This email has already been used for this course.', 'baba-online-academy' ) ) );
        } elseif ( $submission_conflict === 'phone' ) {
            wp_send_json_error( array( 'message' => __( 'This phone number has already been used for this course.', 'baba-online-academy' ) ) );
        }

        if ( empty( $_FILES['screenshot_files'] ) ) {
            wp_send_json_error( array( 'message' => __( 'Please upload at least one payment receipt.', 'baba-online-academy' ) ) );
        }

        $receipt_files = self::normalize_files_array( $_FILES['screenshot_files'] );
        if ( empty( $receipt_files ) ) {
            wp_send_json_error( array( 'message' => __( 'Please upload at least one payment receipt.', 'baba-online-academy' ) ) );
        }

        require_once ABSPATH . 'wp-admin/includes/file.php';

        $uploaded_files = array();
        foreach ( $receipt_files as $file ) {
            if ( empty( $file['name'] ) || ( isset( $file['error'] ) && UPLOAD_ERR_OK !== (int) $file['error'] ) ) {
                continue;
            }
            if ( empty( $file['tmp_name'] ) ) {
                continue;
            }

            $upload = wp_handle_upload( $file, array( 'test_form' => false ) );
            if ( isset( $upload['error'] ) ) {
                self::cleanup_uploaded_files( $uploaded_files );
                wp_send_json_error( array( 'message' => $upload['error'] ) );
            }

            $file_path = isset( $upload['file'] ) ? $upload['file'] : '';
            $file_hash = ( $file_path && file_exists( $file_path ) ) ? hash_file( 'sha256', $file_path ) : '';

            $uploaded_files[] = array(
                'url'  => $upload['url'],
                'path' => $file_path,
                'name' => $file['name'],
                'type' => $file['type'],
                'hash' => $file_hash,
            );
        }

        if ( empty( $uploaded_files ) ) {
            wp_send_json_error( array( 'message' => __( 'All uploaded files were invalid. Please try again.', 'baba-online-academy' ) ) );
        }

        $course_fee    = isset( $data['course_fee'] ) ? (float) $data['course_fee'] : 0;
        $amount_paid   = (float) $data['amount_paid'];
        $remaining_fee = max( 0, $course_fee - $amount_paid );

        if ( $amount_paid <= 0 ) {
            self::cleanup_uploaded_files( $uploaded_files );
            wp_send_json_error( array( 'message' => __( 'Amount paid must be greater than zero.', 'baba-online-academy' ) ) );
        }

        if ( $course_fee > 0 && $amount_paid > $course_fee ) {
            self::cleanup_uploaded_files( $uploaded_files );
            wp_send_json_error( array( 'message' => __( 'Amount paid cannot exceed the course fee.', 'baba-online-academy' ) ) );
        }

        if ( $remaining_fee > 0 && empty( $data['next_due_date'] ) ) {
            self::cleanup_uploaded_files( $uploaded_files );
            wp_send_json_error( array( 'message' => __( 'Next due date is required for remaining fees.', 'baba-online-academy' ) ) );
        }

        $student_data = array(
            'name'           => sanitize_text_field( $data['name'] ),
            'email'          => $email,
            'phone'          => $phone,
            'city'           => sanitize_text_field( $data['city'] ),
            'course_id'      => $course_id,
            'admission_date' => current_time( 'Y-m-d' ),
            'status'         => 'pending_review',
        );

        $student_id = BOA_DB::save_student( $student_data );
        if ( is_wp_error( $student_id ) ) {
            self::cleanup_uploaded_files( $uploaded_files );
            wp_send_json_error( array( 'message' => $student_id->get_error_message() ) );
        }

        $invoice_id  = 'INV-' . time();
        $primary_fee = array(
            'student_id'   => $student_id,
            'course_id'    => $course_id,
            'amount_due'   => $amount_paid,
            'amount_paid'  => $amount_paid,
            'due_date'     => current_time( 'Y-m-d' ),
            'payment_date' => current_time( 'Y-m-d' ),
            'status'       => 'pending_review',
            'invoice_id'   => $invoice_id . '-P1',
            'receipt_url'  => $uploaded_files[0]['url'],
        );

        $primary_fee_id = BOA_DB::save_fee( $primary_fee );
        if ( is_wp_error( $primary_fee_id ) ) {
            self::cleanup_uploaded_files( $uploaded_files );
            BOA_DB::delete_student( $student_id );
            wp_send_json_error( array( 'message' => $primary_fee_id->get_error_message() ) );
        }

        foreach ( $uploaded_files as $receipt ) {
            BOA_DB::add_fee_receipt(
                $primary_fee_id,
                $student_id,
                $receipt['url'],
                $receipt['name'],
                $receipt['type'],
                $receipt['hash']
            );
        }

        if ( $remaining_fee > 0 ) {
            $pending_fee_data = array(
                'student_id'   => $student_id,
                'course_id'    => $course_id,
                'amount_due'   => $remaining_fee,
                'amount_paid'  => 0.00,
                'due_date'     => sanitize_text_field( $data['next_due_date'] ),
                'payment_date' => null,
                'status'       => 'pending',
                'invoice_id'   => $invoice_id . '-P2',
                'receipt_url'  => '',
            );

            $pending_fee_result = BOA_DB::save_fee( $pending_fee_data );
            if ( is_wp_error( $pending_fee_result ) ) {
                BOA_DB::delete_fee( $primary_fee_id );
                BOA_DB::delete_student( $student_id );
                self::cleanup_uploaded_files( $uploaded_files );
                wp_send_json_error( array( 'message' => $pending_fee_result->get_error_message() ) );
            }
        }

        $submission_id = BOA_DB::add_form_submission( array(
            'student_id'            => $student_id,
            'email'                 => $email,
            'phone'                 => $phone,
            'course_id'             => $course_id,
            'name'                  => $data['name'],
            'status'                => 'pending_review',
            'discount_amount'       => $data['discount_amount'] ?? 0,
            'discount_reason'       => $data['discount_reason'] ?? '',
            'receipt_file_hash'     => $uploaded_files[0]['hash'],
            'receipt_original_name' => $uploaded_files[0]['name'],
        ) );

        if ( is_wp_error( $submission_id ) ) {
            BOA_DB::delete_fee( $primary_fee_id );
            BOA_DB::delete_student( $student_id );
            self::cleanup_uploaded_files( $uploaded_files );
            wp_send_json_error( array( 'message' => $submission_id->get_error_message() ) );
        }

        $tracking_token = BOA_DB::get_submission_tracking_token( $submission_id );

        wp_send_json_success( array(
            'message'  => __( 'Admission form submitted successfully. We will contact you soon.', 'baba-online-academy' ),
            'receipts' => wp_list_pluck( $uploaded_files, 'url' ),
            'tracking_token' => $tracking_token,
        ) );
    }

    /**
     * اپ ڈیٹ: ایڈمن فنکشن
     * فیس کو جزوی ڈسکاؤنٹ کے طور پر نشان زد کرتا ہے۔
     */
    public static function apply_partial_discount() {
        check_ajax_referer( 'boa_fees_nonce', 'nonce' );
        
        $fee_id = isset( $_POST['fee_id'] ) ? absint( $_POST['fee_id'] ) : 0;
        $discount_amount = isset( $_POST['discount_amount'] ) ? (float) $_POST['discount_amount'] : 0;

        if ( $fee_id === 0 || $discount_amount <= 0 ) {
            wp_send_json_error( array( 'message' => 'Invalid Fee ID or Discount Amount.' ) );
        }

        $result = BOA_DB::apply_partial_discount( $fee_id, $discount_amount );

        if ( is_wp_error( $result ) ) {
            wp_send_json_error( array( 'message' => $result->get_error_message() ) );
        }

        if ( $result === false ) {
            wp_send_json_error( array( 'message' => 'Could not apply partial discount.' ) );
        }

        wp_send_json_success( array( 'message' => 'Fee successfully discounted.' ) );
    }

    /**
     * ایڈمن فنکشن
     * زیرِ جائزہ داخلے حاصل کرتا ہے۔
     */
    public static function get_pending_admissions() {
        check_ajax_referer( 'boa_admin_review_nonce', 'nonce' );
        $args = array(
            'page'     => isset( $_POST['page'] ) ? max( 1, (int) $_POST['page'] ) : 1,
            'per_page' => isset( $_POST['per_page'] ) ? max( 1, (int) $_POST['per_page'] ) : 10,
        );
        $data = BOA_DB::get_pending_admissions( $args );
        wp_send_json_success( array( 'admissions' => $data['items'], 'page' => $args['page'], 'per_page' => $args['per_page'], 'total' => $data['total'] ) );
    }

    /**
     * ایڈمن فنکشن
     * داخلے کو منظور کرتا ہے۔
     */
    public static function approve_admission() {
        check_ajax_referer( 'boa_admin_review_nonce', 'nonce' );
        $fee_id = isset( $_POST['fee_id'] ) ? absint( $_POST['fee_id'] ) : 0;
        $student_id = isset( $_POST['student_id'] ) ? absint( $_POST['student_id'] ) : 0;
        $result = self::approve_admission_record( $fee_id, $student_id );
        if ( is_wp_error( $result ) ) {
            wp_send_json_error( array( 'message' => $result->get_error_message() ) );
        }
        wp_send_json_success( array( 'message' => 'Admission approved successfully.' ) );
    }

    /**
     * ایڈمن فنکشن
     * داخلے کو مسترد کرتا ہے۔
     */
    public static function reject_admission() {
        check_ajax_referer( 'boa_admin_review_nonce', 'nonce' );
        $fee_id = isset( $_POST['fee_id'] ) ? absint( $_POST['fee_id'] ) : 0;
        $student_id = isset( $_POST['student_id'] ) ? absint( $_POST['student_id'] ) : 0;
        $result = self::reject_admission_record( $fee_id, $student_id );
        if ( is_wp_error( $result ) ) {
            wp_send_json_error( array( 'message' => $result->get_error_message() ) );
        }
        wp_send_json_success( array( 'message' => 'Admission rejected and data removed.' ) );
    }

    /**
     * Bulk approve pending admissions
     */
    public static function bulk_approve_admissions() {
        check_ajax_referer( 'boa_admin_review_nonce', 'nonce' );
        $items = self::parse_bulk_admission_items();

        if ( empty( $items ) ) {
            wp_send_json_error( array( 'message' => 'Please select at least one application.' ) );
        }

        $processed = 0;
        $failed    = array();

        foreach ( $items as $item ) {
            $fee_id     = isset( $item['fee_id'] ) ? absint( $item['fee_id'] ) : 0;
            $student_id = isset( $item['student_id'] ) ? absint( $item['student_id'] ) : 0;

            $result = self::approve_admission_record( $fee_id, $student_id );
            if ( is_wp_error( $result ) ) {
                $failed[] = array(
                    'fee_id'     => $fee_id,
                    'student_id' => $student_id,
                    'message'    => $result->get_error_message(),
                );
            } else {
                $processed++;
            }
        }

        if ( $processed === 0 ) {
            wp_send_json_error( array(
                'message' => 'No applications were approved. Please try again.',
                'failed'  => $failed,
            ) );
        }

        $message = sprintf(
            _n( '%d application approved.', '%d applications approved.', $processed, 'baba-online-academy' ),
            $processed
        );

        if ( ! empty( $failed ) ) {
            $message .= ' Some applications could not be processed.';
        }

        wp_send_json_success( array(
            'message'   => $message,
            'processed' => $processed,
            'failed'    => $failed,
        ) );
    }

    /**
     * Bulk reject pending admissions
     */
    public static function bulk_reject_admissions() {
        check_ajax_referer( 'boa_admin_review_nonce', 'nonce' );
        $items = self::parse_bulk_admission_items();

        if ( empty( $items ) ) {
            wp_send_json_error( array( 'message' => 'Please select at least one application.' ) );
        }

        $processed = 0;
        $failed    = array();

        foreach ( $items as $item ) {
            $fee_id     = isset( $item['fee_id'] ) ? absint( $item['fee_id'] ) : 0;
            $student_id = isset( $item['student_id'] ) ? absint( $item['student_id'] ) : 0;

            $result = self::reject_admission_record( $fee_id, $student_id );
            if ( is_wp_error( $result ) ) {
                $failed[] = array(
                    'fee_id'     => $fee_id,
                    'student_id' => $student_id,
                    'message'    => $result->get_error_message(),
                );
            } else {
                $processed++;
            }
        }

        if ( $processed === 0 ) {
            wp_send_json_error( array(
                'message' => 'No applications were rejected. Please try again.',
                'failed'  => $failed,
            ) );
        }

        $message = sprintf(
            _n( '%d application rejected.', '%d applications rejected.', $processed, 'baba-online-academy' ),
            $processed
        );

        if ( ! empty( $failed ) ) {
            $message .= ' Some applications could not be processed.';
        }

        wp_send_json_success( array(
            'message'   => $message,
            'processed' => $processed,
            'failed'    => $failed,
        ) );
    }

    /**
     * Decode bulk action payload from request
     *
     * @return array
     */
    private static function parse_bulk_admission_items() {
        $items = isset( $_POST['items'] ) ? wp_unslash( $_POST['items'] ) : array();

        if ( is_string( $items ) ) {
            $decoded = json_decode( $items, true );
            if ( json_last_error() === JSON_ERROR_NONE ) {
                $items = $decoded;
            }
        }

        return is_array( $items ) ? $items : array();
    }

    /**
     * Approve a single admission record
     *
     * @param int $fee_id
     * @param int $student_id
     * @return true|WP_Error
     */
    private static function approve_admission_record( $fee_id, $student_id ) {
        global $wpdb;

        if ( $fee_id === 0 || $student_id === 0 ) {
            return new WP_Error( 'invalid_data', 'Invalid data provided.' );
        }

        $student_update = $wpdb->update(
            $wpdb->prefix . 'boa_students',
            array( 'status' => 'active' ),
            array( 'student_id' => $student_id ),
            array( '%s' ),
            array( '%d' )
        );

        $fee_update = $wpdb->update(
            $wpdb->prefix . 'boa_fees',
            array( 'status' => 'paid' ),
            array( 'fee_id' => $fee_id ),
            array( '%s' ),
            array( '%d' )
        );

        if ( $student_update === false || $fee_update === false ) {
            return new WP_Error( 'db_error', 'Could not update admission record.' );
        }

        BOA_DB::update_form_submission_status_by_student( $student_id, 'approved' );

        // --- نیا: اسٹوڈنٹ کے لیے ورڈپریس یوزر بنائیں ---
        $user_creation_result = self::create_student_wp_user( $student_id );
        if ( is_wp_error( $user_creation_result ) ) {
            // اگر یوزر بنانے میں ناکامی ہو تو لاگ ان کریں، لیکن منظوری کو ناکام نہ کریں
            error_log( 'BOA WP User Creation Failed for student_id ' . $student_id . ': ' . $user_creation_result->get_error_message() );
        }
        // --- نیا حصہ ختم ---

        return true;
    }

    /**
     * Reject a single admission record
     *
     * @param int $fee_id
     * @param int $student_id
     * @return true|WP_Error
     */
    private static function reject_admission_record( $fee_id, $student_id ) {
        global $wpdb;

        if ( $fee_id === 0 || $student_id === 0 ) {
            return new WP_Error( 'invalid_data', 'Invalid data provided.' );
        }

        BOA_DB::update_form_submission_status_by_student( $student_id, 'rejected' );
        $student_snapshot = BOA_DB::get_student_by_id( $student_id );
        $student_deleted = BOA_DB::delete_student( $student_id );
        $fee_deleted     = BOA_DB::delete_fee( $fee_id );

        $wpdb->delete(
            $wpdb->prefix . 'boa_fees',
            array( 'student_id' => $student_id, 'status' => 'pending' ),
            array( '%d', '%s' )
        );
        $wpdb->delete(
            $wpdb->prefix . 'boa_fees',
            array( 'student_id' => $student_id, 'status' => 'discounted' ),
            array( '%d', '%s' )
        );

        if ( $student_deleted === false || $fee_deleted === false ) {
            return new WP_Error( 'db_error', 'Could not remove admission record.' );
        }

        if ( class_exists( 'BOA_Notifications' ) && $student_snapshot ) {
            BOA_Notifications::send_admission_status_email( $student_snapshot, 'rejected' );
        }

        return true;
    }

    /**
     * نیا ہیلپر فنکشن: منظور شدہ اسٹوڈنٹ کے لیے ورڈپریس یوزر بناتا ہے
     *
     * @param int $student_id
     * @return true|WP_Error
     */
    private static function create_student_wp_user( $student_id ) {
        global $wpdb;
        $students_table = $wpdb->prefix . 'boa_students';

        // اسٹوڈنٹ کا ڈیٹا حاصل کریں
        $student = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $students_table WHERE student_id = %d", $student_id ) );

        if ( ! $student ) {
            return new WP_Error( 'student_not_found', 'Student record not found.' );
        }

        // اگر یوزر آئی ڈی پہلے سے موجود ہے تو کچھ نہ کریں
        if ( ! empty( $student->user_id ) && get_user_by( 'ID', $student->user_id ) ) {
            return true;
        }

        $email = $student->email;
        $user_id = email_exists( $email );

        if ( $user_id ) {
            // یوزر پہلے سے موجود ہے
            $user = new WP_User( $user_id );
            // اگر اس کے پاس اسٹوڈنٹ رول نہیں ہے تو شامل کریں
            if ( ! in_array( 'student', (array) $user->roles ) ) {
                $user->add_role( 'student' );
            }
        } else {
            // نیا یوزر بنائیں
            $password = wp_generate_password( 12, true );
            // یوزر نیم ای میل سے بنائیں
            $username = sanitize_user( substr( $email, 0, strpos( $email, '@' ) ), true );
            
            // یقینی بنائیں کہ یوزر نیم منفرد ہے
            $original_username = $username;
            $i = 1;
            while ( username_exists( $username ) ) {
                $username = $original_username . $i;
                $i++;
            }

            $user_data = array(
                'user_login' => $username,
                'user_email' => $email,
                'user_pass'  => $password,
                'display_name' => $student->name,
                'role'       => 'student'
            );
            $user_id = wp_insert_user( $user_data );

            if ( is_wp_error( $user_id ) ) {
                return $user_id;
            }

            // یوزر کو لاگ ان کی تفصیلات ای میل کریں
            wp_send_new_user_notifications( $user_id, 'user' );
        }

        // boa_students ٹیبل میں user_id اپ ڈیٹ کریں
        $updated = $wpdb->update(
            $students_table,
            array( 'user_id' => $user_id ),
            array( 'student_id' => $student_id ),
            array( '%d' ),
            array( '%d' )
        );

        if ( $updated === false ) {
            return new WP_Error( 'db_update_failed', 'Failed to link WordPress user to student record.' );
        }

        return true;
    }


    private static function format_submission_status( $status ) {
        switch ( $status ) {
            case 'approved':
                return __( 'Approved', 'baba-online-academy' );
            case 'rejected':
                return __( 'Rejected', 'baba-online-academy' );
            case 'pending_review':
            default:
                return __( 'Pending Review', 'baba-online-academy' );
        }
    }

    // ===== ENHANCED FEATURES =====
    
    /**
     * Check if student already submitted form for this course
     */
    public static function check_duplicate_submission() {
        check_ajax_referer( 'boa_ajax_nonce', 'nonce' );
        $email = isset( $_POST['email'] ) ? sanitize_email( $_POST['email'] ) : '';
        $phone = isset( $_POST['phone'] ) ? sanitize_text_field( $_POST['phone'] ) : '';
        $course_id = isset( $_POST['course_id'] ) ? absint( $_POST['course_id'] ) : 0;
        
        if ( $course_id === 0 || ( empty( $email ) && empty( $phone ) ) ) {
            wp_send_json_error( array( 'message' => 'Invalid parameters.' ) );
        }
        
        if ( BOA_DB::student_exists_for_course( $email, $phone, $course_id ) ) {
            wp_send_json_success( array(
                'exists'  => true,
                'message' => __( 'A student with these details already exists for this course.', 'baba-online-academy' ),
                'type'    => 'student',
            ) );
        }

        $conflict = BOA_DB::get_form_submission_conflict( $email, $phone, $course_id );
        if ( $conflict ) {
            $message = $conflict === 'email'
                ? __( 'This email has already been used for this course.', 'baba-online-academy' )
                : __( 'This phone number has already been used for this course.', 'baba-online-academy' );

            wp_send_json_success( array(
                'exists'  => true,
                'message' => $message,
                'type'    => $conflict,
            ) );
        }

        wp_send_json_success( array( 'exists' => false ) );
    }
    
    /**
     * Check if receipt file is already uploaded
     */
    public static function check_duplicate_receipt() {
        check_ajax_referer( 'boa_ajax_nonce', 'nonce' );
        $file_hash = isset( $_POST['file_hash'] ) ? sanitize_text_field( $_POST['file_hash'] ) : '';
        $submission_id = isset( $_POST['submission_id'] ) ? absint( $_POST['submission_id'] ) : 0;
        
        if ( empty( $file_hash ) ) {
            wp_send_json_error( array( 'message' => 'File hash required.' ) );
        }
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'boa_form_submissions';
        $receipts_table = $wpdb->prefix . 'boa_fee_receipts';
        
        $query = "SELECT submission_id FROM $table_name WHERE receipt_file_hash = %s";
        $params = array( $file_hash );
        
        if ( $submission_id > 0 ) {
            $query .= " AND submission_id != %d";
            $params[] = $submission_id;
        }
        
        $form_exists = $wpdb->get_var( $wpdb->prepare( $query, $params ) );
        $receipt_exists = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT receipt_id FROM $receipts_table WHERE file_hash = %s LIMIT 1",
                $file_hash
            )
        );

        $exists = ! empty( $form_exists ) || ! empty( $receipt_exists );
        wp_send_json_success( array( 'exists' => !empty( $exists ) ) );
    }
    
    /**
     * Public application status checker
     */
    public static function check_application_status() {
        check_ajax_referer( 'boa_public_nonce', 'nonce' );

        $tracking_token = isset( $_POST['tracking_token'] ) ? sanitize_text_field( wp_unslash( $_POST['tracking_token'] ) ) : '';
        $email          = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
        $phone          = isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '';

        if ( empty( $tracking_token ) || ( empty( $email ) && empty( $phone ) ) ) {
            wp_send_json_error( array( 'message' => __( 'Tracking code along with email or phone is required.', 'baba-online-academy' ) ) );
        }

        $submission = BOA_DB::get_submission_status_public( $tracking_token, $email, $phone );
        if ( empty( $submission ) ) {
            wp_send_json_error( array( 'message' => __( 'No application found for the provided details.', 'baba-online-academy' ) ) );
        }

        $status_label = self::format_submission_status( $submission['status'] );
        $timeline     = array();

        if ( ! empty( $submission['submission_date'] ) ) {
            $timeline[] = array(
                'label' => __( 'Submitted', 'baba-online-academy' ),
                'date'  => $submission['submission_date'],
            );
        }

        if ( ! empty( $submission['status_updated_at'] ) ) {
            $timeline[] = array(
                'label' => $status_label,
                'date'  => $submission['status_updated_at'],
            );
        }

        wp_send_json_success( array(
            'status'            => $submission['status'],
            'status_label'      => $status_label,
            'status_notes'      => $submission['status_notes'],
            'status_updated_at' => $submission['status_updated_at'],
            'submission_date'   => $submission['submission_date'],
            'course_name'       => $submission['course_name'],
            'tracking_token'    => $submission['tracking_token'],
            'timeline'          => $timeline,
        ) );
    }

    public static function get_applicant_history() {
        $nonce_field = isset( $_POST['nonce'] ) ? 'nonce' : '_wpnonce';
        check_ajax_referer( isset( $_POST['is_public'] ) ? 'boa_public_nonce' : 'boa_ajax_nonce', $nonce_field );

        $email = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
        $phone = isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '';

        if ( empty( $email ) && empty( $phone ) ) {
            wp_send_json_error( array( 'message' => __( 'Email or phone is required.', 'baba-online-academy' ) ) );
        }

        $history = BOA_DB::get_applicant_history( $email, $phone );

        wp_send_json_success( array(
            'submissions' => $history['submissions'],
            'enrollments' => $history['enrollments'],
        ) );
    }
    
    /**
     * Get student fees information for discount modal
     */
    public static function get_student_fees() {
        check_ajax_referer( 'boa_ajax_nonce', 'nonce' );
        $student_id = isset( $_POST['student_id'] ) ? absint( $_POST['student_id'] ) : 0;
        
        if ( $student_id === 0 ) {
            wp_send_json_error( array( 'message' => 'Invalid student ID.' ) );
        }
        
        $fee_data = BOA_DB::get_student_pending_fees( $student_id );
        
        if ( ! $fee_data ) {
            wp_send_json_error( array( 'message' => 'No fee data found.' ) );
        }
        
        // Format currency
        $formatted_data = array(
            'total_due' => boa_format_currency( $fee_data['total_due'] ),
            'total_paid' => boa_format_currency( $fee_data['total_paid'] ),
            'pending_amount' => boa_format_currency( $fee_data['pending_amount'] ),
            'pending_amount_numeric' => floatval( $fee_data['pending_amount'] )
        );
        
        wp_send_json_success( $formatted_data );
    }
    
    /**
     * Apply discount to student
     */
    public static function apply_student_discount() {
        check_ajax_referer( 'boa_ajax_nonce', 'nonce' );
        $student_id = isset( $_POST['student_id'] ) ? absint( $_POST['student_id'] ) : 0;
        $discount_amount = isset( $_POST['discount_amount'] ) ? floatval( $_POST['discount_amount'] ) : 0;
        $discount_reason = isset( $_POST['discount_reason'] ) ? sanitize_textarea_field( $_POST['discount_reason'] ) : '';
        
        if ( $student_id === 0 || $discount_amount <= 0 || empty( $discount_reason ) ) {
            wp_send_json_error( array( 'message' => 'Please provide valid discount details.' ) );
        }
        
        $result = BOA_DB::apply_student_discount( $student_id, $discount_amount, $discount_reason );
        
        if ( is_wp_error( $result ) ) {
            wp_send_json_error( array( 'message' => $result->get_error_message() ) );
        }
        
        wp_send_json_success( array( 
            'message' => 'Discount applied successfully!',
            'discount_applied' => $result['discount_applied'],
            'records_updated' => $result['records_updated']
        ) );
    }

    // ===== Live Sessions Management =====

    public static function get_live_sessions_admin() {
        check_ajax_referer( 'boa_ajax_nonce', 'nonce' );

        $args = array(
            'page'      => isset( $_POST['page'] ) ? max( 1, absint( $_POST['page'] ) ) : 1,
            'per_page'  => isset( $_POST['per_page'] ) ? max( 1, absint( $_POST['per_page'] ) ) : 10,
            'course_id' => isset( $_POST['course_id'] ) ? absint( $_POST['course_id'] ) : 0,
            'status'    => sanitize_text_field( $_POST['status'] ?? '' ),
            'search'    => sanitize_text_field( $_POST['search'] ?? '' ),
            'upcoming'  => ! empty( $_POST['upcoming'] ),
        );

        $sessions = BOA_DB::get_live_sessions( $args );
        wp_send_json_success( $sessions );
    }

    public static function save_live_session() {
        check_ajax_referer( 'boa_ajax_nonce', 'nonce' );

        $data = array(
            'session_id'       => isset( $_POST['session_id'] ) ? absint( $_POST['session_id'] ) : 0,
            'course_id'        => isset( $_POST['course_id'] ) ? absint( $_POST['course_id'] ) : null,
            'session_title'    => sanitize_text_field( $_POST['session_title'] ?? '' ),
            'platform'         => sanitize_text_field( $_POST['platform'] ?? 'custom' ),
            'join_url'         => $_POST['join_url'] ?? '',
            'host_url'         => $_POST['host_url'] ?? '',
            'start_time'       => sanitize_text_field( $_POST['start_time'] ?? '' ),
            'end_time'         => $_POST['end_time'] ?? '',
            'duration_minutes' => isset( $_POST['duration_minutes'] ) ? absint( $_POST['duration_minutes'] ) : null,
            'instructor_name'  => sanitize_text_field( $_POST['instructor_name'] ?? '' ),
            'status'           => sanitize_text_field( $_POST['status'] ?? 'scheduled' ),
        );

        if ( empty( $data['session_title'] ) || empty( $data['start_time'] ) ) {
            wp_send_json_error( array( 'message' => __( 'Session title and start time are required.', 'baba-online-academy' ) ) );
        }

        $result = BOA_DB::save_live_session( $data );
        if ( is_wp_error( $result ) ) {
            wp_send_json_error( array( 'message' => $result->get_error_message() ) );
        }

        // Notify enrolled students for this course (email/SMS) with join link
        if ( class_exists( 'BOA_Notifications' ) ) {
            self::notify_live_session_students( $result, $data );
        }

        wp_send_json_success( array( 'message' => __( 'Session saved successfully.', 'baba-online-academy' ), 'session_id' => $result ) );
    }

    public static function delete_live_session() {
        check_ajax_referer( 'boa_ajax_nonce', 'nonce' );
        $session_id = isset( $_POST['session_id'] ) ? absint( $_POST['session_id'] ) : 0;

        if ( $session_id === 0 ) {
            wp_send_json_error( array( 'message' => __( 'Invalid session ID.', 'baba-online-academy' ) ) );
        }

        $deleted = BOA_DB::delete_live_session( $session_id );
        if ( $deleted === false ) {
            wp_send_json_error( array( 'message' => __( 'Unable to delete session.', 'baba-online-academy' ) ) );
        }

        wp_send_json_success( array( 'message' => __( 'Session deleted.', 'baba-online-academy' ) ) );
    }

    /**
     * Notify all active students of a course about a live session link/time.
     */
    protected static function notify_live_session_students( $session_id, array $session_data ) {
        if ( empty( $session_data['course_id'] ) || empty( $session_data['join_url'] ) ) {
            return;
        }

        $course_id   = absint( $session_data['course_id'] );
        $course      = BOA_DB::get_course_by_id( $course_id );
        $course_name = $course['course_name'] ?? '';

        // Pull all active students of the course
        $students_data = BOA_DB::get_students(
            array(
                'course'   => $course_id,
                'status'   => 'active',
                'per_page' => 5000, // large enough to cover most batches
            )
        );
        $students = $students_data['items'] ?? array();
        if ( empty( $students ) ) {
            return;
        }

        $session_payload              = $session_data;
        $session_payload['session_id'] = $session_id;

        foreach ( $students as $student ) {
            $has_contact = ! empty( $student['email'] ) || ! empty( $student['phone'] );
            if ( ! $has_contact ) {
                continue;
            }
            BOA_Notifications::send_live_session_notification( $session_payload, $course_name, $student );
        }
    }

    public static function get_session_attendance_admin() {
        check_ajax_referer( 'boa_ajax_nonce', 'nonce' );
        $session_id = isset( $_POST['session_id'] ) ? absint( $_POST['session_id'] ) : 0;

        if ( $session_id === 0 ) {
            wp_send_json_error( array( 'message' => __( 'Invalid session ID.', 'baba-online-academy' ) ) );
        }

        $records = BOA_DB::get_session_attendance( $session_id );
        wp_send_json_success( array( 'records' => $records ) );
    }

    public static function get_daily_attendance_admin() {
        check_ajax_referer( 'boa_attendance_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }

        $course_id = isset( $_POST['course_id'] ) ? absint( $_POST['course_id'] ) : 0;
        $date      = isset( $_POST['attendance_date'] ) ? sanitize_text_field( $_POST['attendance_date'] ) : '';

        if ( ! $course_id || empty( $date ) ) {
            wp_send_json_error( array( 'message' => __( 'Course and date are required.', 'baba-online-academy' ) ) );
        }

        $students_data = BOA_DB::get_students(
            array(
                'course'   => $course_id,
                'status'   => 'active',
                'per_page' => 999,
            )
        );
        $students       = $students_data['items'] ?? array();
        $attendance_map = BOA_DB::get_daily_attendance_map( $course_id, $date );

        $counts = array(
            'present'  => 0,
            'absent'   => 0,
            'late'     => 0,
            'unmarked' => 0,
        );

        $items = array_map(
            function( $student ) use ( $attendance_map, &$counts ) {
                $record  = $attendance_map[ $student['student_id'] ] ?? array();
                $status  = $record['status'] ?? '';
                if ( isset( $counts[ $status ] ) ) {
                    $counts[ $status ]++;
                } else {
                    $counts['unmarked']++;
                }
                return array(
                    'student_id' => $student['student_id'],
                    'name'       => $student['name'],
                    'email'      => $student['email'],
                    'student_uid'=> $student['student_uid'],
                    'status'     => $status,
                    'remarks'    => $record['remarks'] ?? '',
                );
            },
            $students
        );

        if ( empty( $students ) ) {
            $counts['unmarked'] = 0;
        }

        wp_send_json_success(
            array(
                'students' => $items,
                'counts'   => $counts,
            )
        );
    }

    public static function save_daily_attendance_admin() {
        check_ajax_referer( 'boa_attendance_nonce', 'nonce' );
        if ( ! self::can_manage_instruction() ) {
            wp_send_json_error( array( 'message' => __( 'Unauthorized', 'baba-online-academy' ) ) );
        }

        $course_id  = isset( $_POST['course_id'] ) ? absint( $_POST['course_id'] ) : 0;
        $date       = isset( $_POST['attendance_date'] ) ? sanitize_text_field( $_POST['attendance_date'] ) : '';
        $attendance = isset( $_POST['attendance'] ) ? wp_unslash( $_POST['attendance'] ) : array();

        if ( is_string( $attendance ) ) {
            $decoded = json_decode( $attendance, true );
            if ( json_last_error() === JSON_ERROR_NONE ) {
                $attendance = $decoded;
            }
        }

        if ( ! $course_id || empty( $date ) || empty( $attendance ) || ! is_array( $attendance ) ) {
            wp_send_json_error( array( 'message' => __( 'Attendance payload is invalid.', 'baba-online-academy' ) ) );
        }

        $allowed_status = array( 'present', 'absent', 'late' );
        $clean_records  = array();
        $notify_records = array();

        foreach ( $attendance as $record ) {
            $student_id = isset( $record['student_id'] ) ? absint( $record['student_id'] ) : 0;
            if ( ! $student_id ) {
                continue;
            }

            $status  = isset( $record['status'] ) && in_array( $record['status'], $allowed_status, true ) ? $record['status'] : '';
            $remarks = isset( $record['remarks'] ) ? sanitize_text_field( $record['remarks'] ) : '';

            $clean_records[] = array(
                'student_id' => $student_id,
                'status'     => $status,
                'remarks'    => $remarks,
            );

            if ( in_array( $status, array( 'absent', 'late' ), true ) ) {
                $notify_records[] = array(
                    'student_id' => $student_id,
                    'status'     => $status,
                    'remarks'    => $remarks,
                );
            }
        }

        if ( empty( $clean_records ) ) {
            wp_send_json_error( array( 'message' => __( 'No valid attendance records.', 'baba-online-academy' ) ) );
        }

        BOA_DB::save_daily_attendance_records( $course_id, $date, $clean_records, get_current_user_id() );

        if ( ! empty( $notify_records ) ) {
            $course      = BOA_DB::get_course_by_id( $course_id );
            $course_name = $course['course_name'] ?? '';
            foreach ( $notify_records as $note ) {
                $student = BOA_DB::get_student_by_id( $note['student_id'] );
                if ( ! $student ) {
                    continue;
                }
                BOA_Notifications::send_attendance_alert(
                    $student,
                    $note['status'],
                    $date,
                    $course_name,
                    $note['remarks']
                );
            }
        }

        wp_send_json_success( array( 'message' => __( 'Attendance saved.', 'baba-online-academy' ) ) );
    }
    public static function log_live_attendance() {
        $nonce_field = isset( $_POST['nonce'] ) ? 'nonce' : '_wpnonce';
        $nonce_value = isset( $_POST[ $nonce_field ] ) ? $_POST[ $nonce_field ] : '';
        if ( isset( $_POST['is_public'] ) ) {
            check_ajax_referer( 'boa_public_nonce', $nonce_field );
        } else {
            check_ajax_referer( 'boa_ajax_nonce', $nonce_field );
        }

        $session_id = isset( $_POST['session_id'] ) ? absint( $_POST['session_id'] ) : 0;
        if ( $session_id === 0 ) {
            wp_send_json_error( array( 'message' => __( 'Invalid session ID.', 'baba-online-academy' ) ) );
        }

        $action       = sanitize_text_field( $_POST['action_type'] ?? 'join' );
        $attendance_id= isset( $_POST['attendance_id'] ) ? absint( $_POST['attendance_id'] ) : 0;

        if ( 'leave' === $action && $attendance_id > 0 ) {
            $leave_time = sanitize_text_field( $_POST['leave_time'] ?? current_time( 'mysql' ) );
            $watch_time = isset( $_POST['watch_minutes'] ) ? absint( $_POST['watch_minutes'] ) : null;
            BOA_DB::complete_live_attendance( $attendance_id, $leave_time, $watch_time );
            wp_send_json_success( array( 'message' => __( 'Attendance updated.', 'baba-online-academy' ) ) );
        }

        $record = BOA_DB::record_live_attendance( array(
            'session_id'    => $session_id,
            'student_id'    => isset( $_POST['student_id'] ) ? absint( $_POST['student_id'] ) : null,
            'student_name'  => sanitize_text_field( $_POST['student_name'] ?? '' ),
            'student_email' => sanitize_email( $_POST['student_email'] ?? '' ),
            'join_time'     => sanitize_text_field( $_POST['join_time'] ?? current_time( 'mysql' ) ),
            'device_info'   => sanitize_text_field( $_POST['device_info'] ?? '' ),
            'ip_address'    => sanitize_text_field( $_POST['ip_address'] ?? '' ),
            'status'        => 'joined',
        ) );

        if ( is_wp_error( $record ) ) {
            wp_send_json_error( array( 'message' => $record->get_error_message() ) );
        }

        wp_send_json_success( array(
            'message'       => __( 'Attendance recorded.', 'baba-online-academy' ),
            'attendance_id' => $record,
        ) );
    }

    public static function get_public_live_sessions() {
        check_ajax_referer( 'boa_public_nonce', 'nonce' );

        $args = array(
            'page'     => 1,
            'per_page' => 50,
            'upcoming' => true,
            'status'   => 'scheduled',
        );

        $sessions = BOA_DB::get_live_sessions( $args );
        $items    = array();

        if ( ! empty( $sessions['items'] ) ) {
            foreach ( $sessions['items'] as $session ) {
                $items[] = array(
                    'session_id'    => (int) $session['session_id'],
                    'course_name'   => $session['course_name'],
                    'session_title' => $session['session_title'],
                    'start_time'    => $session['start_time'],
                    'end_time'      => $session['end_time'],
                    'platform'      => $session['platform'],
                    'join_url'      => $session['join_url'],
                    'status'        => $session['status'],
                    'instructor'    => $session['instructor_name'],
                );
            }
        }

        wp_send_json_success( array( 'items' => $items ) );
    }

    // ===== EXPORT/IMPORT SYSTEM =====
    
    /**
     * Export complete plugin data
     */
    public static function export_plugin_data() {
        // Accept multiple nonces because export is triggered from various admin pages
        $nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';
        $nonce_ok = false;
        $allowed_nonces = array( 'boa_reports_nonce', 'boa_fees_nonce', 'boa_settings_nonce', 'boa_courses_nonce' );
        foreach ( $allowed_nonces as $nonce_key ) {
            if ( wp_verify_nonce( $nonce, $nonce_key ) ) {
                $nonce_ok = true;
                break;
            }
        }
        if ( ! $nonce_ok ) {
            wp_send_json_error( array( 'message' => __( 'Invalid export request (nonce).', 'baba-online-academy' ) ) );
        }
        
        try {
            $export_data = array();
            $export_data['export_info'] = array(
                'plugin_name' => 'Academic Hub',
                'version' => '1.2.3-enhanced',
                'export_date' => current_time( 'mysql' ),
                'export_by' => wp_get_current_user()->user_login ?? 'System'
            );
            
            // Export students
            $students_data = BOA_DB::get_students( array( 'per_page' => 9999 ) );
            $export_data['students'] = $students_data['items'] ?? array();
            
            // Export courses
            $courses_data = BOA_DB::get_courses( array( 'per_page' => 9999 ) );
            $export_data['courses'] = $courses_data['items'] ?? array();
            
            // Export fees
            $fees_data = BOA_DB::get_fees( array( 'per_page' => 9999, 'status' => '' ) );
            $export_data['fees'] = $fees_data['items'] ?? array();
            
            // Export form submissions
            global $wpdb;
            $submissions_table = $wpdb->prefix . 'boa_form_submissions';
            $form_submissions = $wpdb->get_results( "SELECT * FROM $submissions_table", ARRAY_A );
            $export_data['form_submissions'] = $form_submissions ?? array();
            
            // Export categories
            $categories_data = BOA_DB::get_categories( array( 'per_page' => 9999 ) );
            $export_data['categories'] = $categories_data['items'] ?? array();
            
            // Export settings
            $export_data['settings'] = array(
                'currency' => get_option( 'boa_currency', 'PKR' ),
                'institute_name' => get_option( 'boa_institute_name', '' ),
                'institute_address' => get_option( 'boa_institute_address', '' ),
                'institute_phone' => get_option( 'boa_institute_phone', '' ),
                'institute_email' => get_option( 'boa_institute_email', '' )
            );
            
            $json_data = json_encode( $export_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE );
            
            // Generate filename
            $filename = 'boa-backup-' . date( 'Y-m-d-H-i-s' ) . '.json';
            
            // Send file for download
            header( 'Content-Type: application/json' );
            header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
            header( 'Content-Length: ' . strlen( $json_data ) );
            
            echo $json_data;
            exit;
            
        } catch ( Exception $e ) {
            wp_send_json_error( array( 'message' => 'Export failed: ' . $e->getMessage() ) );
        }
    }
    
    /**
     * Import plugin data (FIXED: Duplicate handling + Better error logging)
     */
    public static function import_plugin_data() {
        check_ajax_referer( 'boa_reports_nonce', 'nonce' );

        // Normalize date values from backup (convert empty/0000 to null)
        $normalize_date = function( $value ) {
            if ( empty( $value ) || $value === '0000-00-00' || $value === '0000-00-00 00:00:00' ) {
                return null;
            }
            return $value;
        };
        
        if ( empty( $_FILES['import_file'] ) ) {
            wp_send_json_error( array( 'message' => 'Please select a backup file.' ) );
        }
        
        $file = $_FILES['import_file'];
        
        // Validate file type
        if ( pathinfo( $file['name'], PATHINFO_EXTENSION ) !== 'json' ) {
            wp_send_json_error( array( 'message' => 'Only JSON backup files are supported.' ) );
        }
        
        // Read file content
        $json_content = file_get_contents( $file['tmp_name'] );
        $import_data = json_decode( $json_content, true );
        
        if ( json_last_error() !== JSON_ERROR_NONE ) {
            wp_send_json_error( array( 'message' => 'Invalid backup file format. JSON Error: ' . json_last_error_msg() ) );
        }
        
        // Validate backup file structure
        if ( ! isset( $import_data['export_info'] ) || ! isset( $import_data['students'] ) ) {
            wp_send_json_error( array( 'message' => 'Invalid backup file structure.' ) );
        }
        
        global $wpdb;
        $results = array(
            'imported_students' => 0,
            'imported_courses' => 0,
            'imported_fees' => 0,
            'imported_categories' => 0,
            'imported_settings' => 0,
            'skipped_students' => 0,
            'skipped_courses' => 0,
            'skipped_fees' => 0,
            'errors' => array()
        );
        
        try {
            // Import categories first (dependencies)
            if ( isset( $import_data['categories'] ) && is_array( $import_data['categories'] ) ) {
                foreach ( $import_data['categories'] as $category ) {
                    $original_id = isset( $category['category_id'] ) ? $category['category_id'] : null;
                    unset( $category['category_id'] );
                    
                    // Check if category already exists by name
                    $existing = $wpdb->get_var( $wpdb->prepare(
                        "SELECT category_id FROM {$wpdb->prefix}boa_categories WHERE category_name = %s LIMIT 1",
                        $category['category_name']
                    ) );
                    
                    if ( ! $existing ) {
                        $result = $wpdb->insert( 
                            $wpdb->prefix . 'boa_categories', 
                            $category, 
                            array( '%s', '%s', '%s' )
                        );
                        if ( $result ) $results['imported_categories']++;
                    }
                }
            }
            
            // Create mapping for old course_id to new course_id
            $course_id_map = array();
            
            // Import courses
            if ( isset( $import_data['courses'] ) && is_array( $import_data['courses'] ) ) {
                foreach ( $import_data['courses'] as $course ) {
                    $original_course_id = isset( $course['course_id'] ) ? $course['course_id'] : null;
                    unset( $course['course_id'] );

                    // Keep only valid DB columns
                    $course = array_intersect_key( $course, array(
                        'course_name'  => true,
                        'category_id'  => true,
                        'duration'     => true,
                        'fee_amount'   => true,
                        'start_date'   => true,
                        'end_date'     => true,
                        'description'  => true,
                        'status'       => true,
                        'created_at'   => true,
                    ) );

                    // Normalize dates
                    $course['start_date'] = isset( $course['start_date'] ) ? $normalize_date( $course['start_date'] ) : null;
                    $course['end_date']   = isset( $course['end_date'] ) ? $normalize_date( $course['end_date'] ) : null;
                    
                    // Check if course already exists by name
                    $existing = $wpdb->get_var( $wpdb->prepare(
                        "SELECT course_id FROM {$wpdb->prefix}boa_courses WHERE course_name = %s LIMIT 1",
                        $course['course_name']
                    ) );
                    
                    if ( ! $existing ) {
                        $result = $wpdb->insert( 
                            $wpdb->prefix . 'boa_courses', 
                            $course, 
                            array( '%s', '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s' )
                        );
                        if ( $result && $original_course_id ) {
                            $new_course_id = $wpdb->insert_id;
                            $course_id_map[ $original_course_id ] = $new_course_id;
                            $results['imported_courses']++;
                        }
                    } else {
                        $course_id_map[ $original_course_id ] = $existing;
                        $results['skipped_courses']++;
                    }
                }
            }
            
            // Create mapping for old student_id to new student_id
            $student_id_map = array();
            
            // Import students
            if ( isset( $import_data['students'] ) && is_array( $import_data['students'] ) ) {
                foreach ( $import_data['students'] as $student ) {
                    $original_student_id = isset( $student['student_id'] ) ? $student['student_id'] : null;
                    $student_uid = isset( $student['student_uid'] ) ? $student['student_uid'] : '';
                    
                    unset( $student['student_id'] );

                    // Keep only valid DB columns
                    $student = array_intersect_key( $student, array(
                        'student_uid'    => true,
                        'name'           => true,
                        'email'          => true,
                        'phone'          => true,
                        'course_id'      => true,
                        'admission_date' => true,
                        'status'         => true,
                        'created_at'     => true,
                    ) );

                    // Normalize dates
                    $student['admission_date'] = isset( $student['admission_date'] ) ? $normalize_date( $student['admission_date'] ) : null;
                    
                    // Update course_id mapping if exists
                    if ( isset( $student['course_id'] ) && isset( $course_id_map[ $student['course_id'] ] ) ) {
                        $student['course_id'] = $course_id_map[ $student['course_id'] ];
                    }
                    
                    // Check if student already exists by UID or email
                    $existing = null;
                    if ( $student_uid ) {
                        $existing = $wpdb->get_var( $wpdb->prepare(
                            "SELECT student_id FROM {$wpdb->prefix}boa_students WHERE student_uid = %s LIMIT 1",
                            $student_uid
                        ) );
                    }
                    
                    if ( ! $existing && isset( $student['email'] ) ) {
                        $existing = $wpdb->get_var( $wpdb->prepare(
                            "SELECT student_id FROM {$wpdb->prefix}boa_students WHERE email = %s LIMIT 1",
                            $student['email']
                        ) );
                    }
                    
                    if ( ! $existing ) {
                        $result = $wpdb->insert( 
                            $wpdb->prefix . 'boa_students', 
                            $student, 
                            array( '%s', '%s', '%s', '%s', '%d', '%s', '%s', '%s' )
                        );
                        
                        if ( $result && $original_student_id ) {
                            $new_student_id = $wpdb->insert_id;
                            $student_id_map[ $original_student_id ] = $new_student_id;
                            $results['imported_students']++;
                        } elseif ( ! $result ) {
                            $results['errors'][] = 'Student insert failed: ' . $wpdb->last_error;
                        }
                    } else {
                        $student_id_map[ $original_student_id ] = $existing;
                        $results['skipped_students']++;
                    }
                }
            }
            
            // Import fees
            if ( isset( $import_data['fees'] ) && is_array( $import_data['fees'] ) ) {
                foreach ( $import_data['fees'] as $fee ) {
                    $original_fee_id = isset( $fee['fee_id'] ) ? $fee['fee_id'] : null;
                    $invoice_id = isset( $fee['invoice_id'] ) ? $fee['invoice_id'] : '';
                    
                    unset( $fee['fee_id'] );

                    // Keep only valid DB columns
                    $fee = array_intersect_key( $fee, array(
                        'student_id'   => true,
                        'course_id'    => true,
                        'invoice_id'   => true,
                        'amount_due'   => true,
                        'amount_paid'  => true,
                        'due_date'     => true,
                        'payment_date' => true,
                        'status'       => true,
                        'receipt_url'  => true,
                        'created_at'   => true,
                    ) );

                    // Normalize dates
                    $fee['due_date']     = isset( $fee['due_date'] ) ? $normalize_date( $fee['due_date'] ) : null;
                    $fee['payment_date'] = isset( $fee['payment_date'] ) ? $normalize_date( $fee['payment_date'] ) : null;
                    
                    // Update student_id and course_id mappings
                    if ( isset( $fee['student_id'] ) && isset( $student_id_map[ $fee['student_id'] ] ) ) {
                        $fee['student_id'] = $student_id_map[ $fee['student_id'] ];
                    } else {
                        $results['skipped_fees']++;
                        continue; // Skip if student not found
                    }
                    
                    if ( isset( $fee['course_id'] ) && isset( $course_id_map[ $fee['course_id'] ] ) ) {
                        $fee['course_id'] = $course_id_map[ $fee['course_id'] ];
                    }
                    
                    // Check if fee already exists by invoice_id
                    $existing = null;
                    if ( $invoice_id ) {
                        $existing = $wpdb->get_var( $wpdb->prepare(
                            "SELECT fee_id FROM {$wpdb->prefix}boa_fees WHERE invoice_id = %s LIMIT 1",
                            $invoice_id
                        ) );
                    }
                    
                    if ( ! $existing ) {
                        // Generate new unique invoice_id if duplicate
                        if ( $invoice_id ) {
                            $check_dup = $wpdb->get_var( $wpdb->prepare(
                                "SELECT fee_id FROM {$wpdb->prefix}boa_fees WHERE invoice_id = %s LIMIT 1",
                                $fee['invoice_id']
                            ) );
                            if ( $check_dup ) {
                                $fee['invoice_id'] = $fee['invoice_id'] . '-IMPORT-' . time();
                            }
                        }
                        
                        $result = $wpdb->insert( 
                            $wpdb->prefix . 'boa_fees', 
                            $fee, 
                            array( '%d', '%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' )
                        );
                        
                        if ( $result ) {
                            $results['imported_fees']++;
                        } else {
                            $results['errors'][] = 'Fee insert failed: ' . $wpdb->last_error;
                        }
                    } else {
                        $results['skipped_fees']++;
                    }
                }
            }
            
            // Import form submissions (if present)
            if ( isset( $import_data['form_submissions'] ) && is_array( $import_data['form_submissions'] ) ) {
                $submissions_table = $wpdb->prefix . 'boa_form_submissions';
                foreach ( $import_data['form_submissions'] as $submission ) {
                    unset( $submission['submission_id'] );
                    
                    // Update student_id mapping
                    if ( isset( $submission['student_id'] ) && isset( $student_id_map[ $submission['student_id'] ] ) ) {
                        $submission['student_id'] = $student_id_map[ $submission['student_id'] ];
                        $wpdb->insert( $submissions_table, $submission );
                    }
                }
            }
            
            // Import settings
            if ( isset( $import_data['settings'] ) && is_array( $import_data['settings'] ) ) {
                foreach ( $import_data['settings'] as $key => $value ) {
                    update_option( 'boa_' . $key, $value );
                }
                $results['imported_settings'] = count( $import_data['settings'] );
            }
            
            // Build success message
            $message = 'Data imported successfully! ';
            $message .= "Students: {$results['imported_students']} imported";
            if ( $results['skipped_students'] > 0 ) {
                $message .= ", {$results['skipped_students']} skipped (duplicates)";
            }
            $message .= " | Courses: {$results['imported_courses']} imported";
            if ( $results['skipped_courses'] > 0 ) {
                $message .= ", {$results['skipped_courses']} skipped";
            }
            $message .= " | Fees: {$results['imported_fees']} imported";
            if ( $results['skipped_fees'] > 0 ) {
                $message .= ", {$results['skipped_fees']} skipped";
            }
            
            wp_send_json_success( array(
                'message' => $message,
                'results' => $results
            ) );
            
        } catch ( Exception $e ) {
            wp_send_json_error( array( 
                'message' => 'Import failed: ' . $e->getMessage(),
                'results' => $results
            ) );
        }
    }

    public static function export_sql_backup() {
        check_ajax_referer( 'boa_reports_nonce', 'nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( __( 'You do not have permission to export backups.', 'baba-online-academy' ), 403 );
        }

        global $wpdb;
        $like   = $wpdb->esc_like( $wpdb->prefix . 'boa_' ) . '%';
        $tables = $wpdb->get_col( $wpdb->prepare( 'SHOW TABLES LIKE %s', $like ) );

        if ( empty( $tables ) ) {
            wp_die( __( 'No plugin tables were found for backup.', 'baba-online-academy' ) );
        }

        $output  = "-- Academic Hub SQL Backup\n";
        $output .= "-- Generated on: " . current_time( 'mysql' ) . "\n\n";

        foreach ( $tables as $table ) {
            $create = $wpdb->get_row( "SHOW CREATE TABLE `$table`", ARRAY_N );
            if ( isset( $create[1] ) ) {
                $output .= "DROP TABLE IF EXISTS `$table`;\n" . $create[1] . ";\n\n";
            }

            $rows = $wpdb->get_results( "SELECT * FROM `$table`", ARRAY_A );
            if ( empty( $rows ) ) {
                continue;
            }

            $columns = array_map(
                function( $column ) {
                    return '`' . $column . '`';
                },
                array_keys( $rows[0] )
            );
            $column_list = implode( ', ', $columns );

            foreach ( $rows as $row ) {
                $values = array();
                foreach ( $row as $value ) {
                    if ( is_null( $value ) ) {
                        $values[] = 'NULL';
                    } else {
                        $values[] = "'" . self::escape_sql_value( $value ) . "'";
                    }
                }

                $output .= "INSERT INTO `$table` ($column_list) VALUES (" . implode( ', ', $values ) . ");\n";
            }

            $output .= "\n";
        }

        $filename = 'boa-sql-backup-' . date( 'Y-m-d-H-i-s' ) . '.sql';
        nocache_headers();
        header( 'Content-Type: application/sql' );
        header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
        header( 'Content-Length: ' . strlen( $output ) );

        echo $output;
        exit;
    }
    
    /**
     * Export specific data types to Excel
     */
    public static function export_to_excel() {
        check_ajax_referer( 'boa_reports_nonce', 'nonce' );
        
        $export_type = isset( $_POST['export_type'] ) ? sanitize_text_field( $_POST['export_type'] ) : '';
        $filters = isset( $_POST['filters'] ) ? (array) wp_unslash( $_POST['filters'] ) : array();
        
        try {
            switch ( $export_type ) {
                case 'students':
                    $data = BOA_DB::get_students( array_merge( $filters, array( 'per_page' => 9999 ) ) );
                    self::generate_csv_export( 'students', $data['items'] );
                    break;
                    
                case 'courses':
                    $data = BOA_DB::get_courses( array_merge( $filters, array( 'per_page' => 9999 ) ) );
                    self::generate_csv_export( 'courses', $data['items'] );
                    break;
                    
                case 'fees':
                    $data = BOA_DB::get_fees( array_merge( $filters, array( 'per_page' => 9999 ) ) );
                    self::generate_csv_export( 'fees', $data['items'] );
                    break;
                    
                case 'income':
                    $data = BOA_DB::get_report_income_details( $filters );
                    self::generate_csv_export( 'income-report', $data );
                    break;
                    
                default:
                    wp_send_json_error( array( 'message' => 'Invalid export type.' ) );
            }
            
        } catch ( Exception $e ) {
            wp_send_json_error( array( 'message' => 'Export failed: ' . $e->getMessage() ) );
        }
    }
    
    /**
     * Generate CSV export file
     */
    private static function generate_csv_export( $filename, $data ) {
        if ( empty( $data ) ) {
            wp_send_json_error( array( 'message' => 'No data to export.' ) );
        }
        
        // Set headers for CSV download
        header( 'Content-Type: text/csv; charset=utf-8' );
        header( 'Content-Disposition: attachment; filename="' . $filename . '-' . date( 'Y-m-d' ) . '.csv"' );
        
        // Create CSV content
        $output = fopen( 'php://output', 'w' );
        
        // Add BOM for UTF-8
        fprintf( $output, chr(0xEF).chr(0xBB).chr(0xBF) );
        
        // Add headers
        if ( ! empty( $data ) ) {
            fputcsv( $output, array_keys( $data[0] ) );
        }
        
        // Add data rows
        foreach ( $data as $row ) {
            fputcsv( $output, $row );
        }
        
        fclose( $output );
        exit;
    }

    /**
     * Normalize $_FILES array for multiple uploads
     *
     * @param array $files
     * @return array
     */
    private static function normalize_files_array( $files ) {
        $normalized = array();

        if ( ! is_array( $files ) || ! isset( $files['name'] ) ) {
            return $normalized;
        }

        if ( is_array( $files['name'] ) ) {
            foreach ( $files['name'] as $index => $name ) {
                if ( empty( $name ) ) {
                    continue;
                }

                $normalized[] = array(
                    'name'     => $name,
                    'type'     => $files['type'][ $index ] ?? '',
                    'tmp_name' => $files['tmp_name'][ $index ] ?? '',
                    'error'    => $files['error'][ $index ] ?? 0,
                    'size'     => $files['size'][ $index ] ?? 0,
                );
            }
        } else {
            $normalized[] = $files;
        }

        return $normalized;
    }

    private static function escape_sql_value( $value ) {
        $value = (string) $value;
        $value = str_replace( array( "\r", "\n" ), array( '\\r', '\\n' ), $value );
        return addslashes( $value );
    }

    /**
     * Delete uploaded files when request fails
     *
     * @param array $files
     * @return void
     */
    private static function cleanup_uploaded_files( $files ) {
        if ( empty( $files ) ) {
            return;
        }

        foreach ( $files as $file ) {
            if ( ! empty( $file['path'] ) && file_exists( $file['path'] ) ) {
                wp_delete_file( $file['path'] );
            }
        }
    }
}

// ✅ Syntax verified block end
