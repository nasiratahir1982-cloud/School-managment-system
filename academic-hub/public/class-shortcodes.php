<?php
/**
 * Public Shortcodes for Baba Online Academy
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class BOA_Shortcodes {

    /**
     * Initialize all shortcodes
     */
    public static function init() {

        add_shortcode( 'boa_admission_form',        array( __CLASS__, 'admission_form' ) );
        add_shortcode( 'boa_application_status',    array( __CLASS__, 'application_status' ) );
        add_shortcode( 'boa_live_sessions',         array( __CLASS__, 'public_live_sessions' ) );
        add_shortcode( 'boa_student_portal',        array( __CLASS__, 'student_portal' ) );
        add_shortcode( 'boa_verify_certificate',    array( __CLASS__, 'certificate_verification' ) );
        add_shortcode( 'boa_student_dashboard',     array( __CLASS__, 'student_dashboard' ) );
        add_shortcode( 'boa_dashboard',             array( __CLASS__, 'frontend_admin_dashboard' ) );
    }

    // ---------------------------------------------------------------------
    // 1. Admission Form Shortcode
    // ---------------------------------------------------------------------
    public static function admission_form() {

        BOA_Assets::enqueue_public_assets();

        $file = BOA_DIR . 'page-admission-form/page-admission-form.php';

        if ( file_exists( $file ) ) {
            ob_start();
            include $file;
            return ob_get_clean();
        }

        return self::error('Admission Form file missing');
    }

    // ---------------------------------------------------------------------
    // 2. Application Status Shortcode
    // ---------------------------------------------------------------------
    public static function application_status() {

        BOA_Assets::enqueue_status_assets();

        $file = BOA_DIR . 'page-application-status/page-application-status.php';

        if ( file_exists( $file ) ) {
            ob_start();
            include $file;
            return ob_get_clean();
        }

        return self::error('Application Status file missing');
    }

    // ---------------------------------------------------------------------
    // 3. Public Live Sessions Shortcode
    // ---------------------------------------------------------------------
    public static function public_live_sessions() {

        BOA_Assets::enqueue_public_live_sessions_assets();

        $file = BOA_DIR . 'page-live-sessions-public/page-live-sessions-public.php';

        if ( file_exists( $file ) ) {
            ob_start();
            include $file;
            return ob_get_clean();
        }

        return self::error('Live Sessions file missing');
    }

    // ---------------------------------------------------------------------
    // 4. Student Portal (Login + Dashboard)
    // ---------------------------------------------------------------------
    public static function student_portal() {

        BOA_Assets::enqueue_public_assets();
        ob_start();

        if ( ! is_user_logged_in() ) {

            $login = BOA_DIR . 'page-student-login/page-student-login.php';
            return file_exists( $login ) ? (include $login) : self::error('Login file missing');
        }

        $user = wp_get_current_user();

        if ( ! in_array( 'student', (array)$user->roles ) ) {
            echo self::error('Access Denied — Not a Student');
            echo '<a href="'.wp_logout_url( get_permalink() ).'">Logout</a>';
            return ob_get_clean();
        }

        $dashboard = BOA_DIR . 'page-student-dashboard/page-student-dashboard.php';
        return file_exists( $dashboard ) ? (include $dashboard) : self::error('Student Dashboard file missing');

        return ob_get_clean();
    }

    // ---------------------------------------------------------------------
    // 5. Certificate Verification
    // ---------------------------------------------------------------------
    public static function certificate_verification() {

        ob_start();

        $token = isset($_GET['token']) ? sanitize_text_field($_GET['token']) : '';

        if ( empty($token) ) {
            return self::error('Verification token missing.');
        }

        $student = BOA_DB::get_student_by_certificate_token($token);

        if ( ! $student ) {
            return self::verification_box(false, null, null);
        }

        $course_data  = BOA_DB::get_courses([ 'course_id' => $student['course_id'] ]);
        $course_name  = ! empty($course_data['items']) ? $course_data['items'][0]['course_name'] : 'N/A';

        return self::verification_box(true, $student, $course_name);
    }

    private static function verification_box($success, $student, $course_name) {

        if ( ! $success ) {
            return '
            <div class="boa-verification-box boa-verification-failed">
                <h2>Verification Failed</h2>
                <p>The certificate token is invalid or expired.</p>
            </div>';
        }

        return '
        <div class="boa-verification-box boa-verification-success">
            <h2>Certificate Verified</h2>
            <p>This is to certify that the following student has completed the course.</p>
            <p><strong>Student Name:</strong> '. esc_html($student['name']) .'</p>
            <p><strong>Course Name:</strong> '. esc_html($course_name) .'</p>
            <p><strong>Status:</strong> '. esc_html( ucfirst($student['status']) ) .'</p>
        </div>';
    }

    // ---------------------------------------------------------------------
    // 6. Student Dashboard (Frontend)
    // ---------------------------------------------------------------------
    public static function student_dashboard() {

        ob_start();

        if ( ! is_user_logged_in() ) {
            return self::error_with_login('Login first to access your dashboard.');
        }

        $dashboard = BOA_DIR . 'page-student-dashboard-frontend/page-student-dashboard-frontend.php';

        if ( ! file_exists( $dashboard ) ) {
            return self::error('Frontend Student Dashboard file missing');
        }

        include $dashboard;
        return ob_get_clean();
    }

    // ---------------------------------------------------------------------
    // 7. Frontend Admin Dashboard (for teachers / staff)
    // ---------------------------------------------------------------------
    public static function frontend_admin_dashboard() {

        if ( ! is_user_logged_in() ) {
            return self::error_with_login('Please login to view the dashboard.');
        }

        if ( ! current_user_can('boa_access_portal') && ! current_user_can('manage_options') ) {
            return self::error('Access Denied');
        }

        $file = BOA_DIR . 'page-dashboard/page-dashboard.php';

        if ( ! file_exists( $file ) ) {
            return self::error('Dashboard file missing');
        }

        BOA_Assets::enqueue_frontend_dashboard_assets();

        ob_start();
        include $file;
        return ob_get_clean();
    }

    // ---------------------------------------------------------------------
    // Helper: Unified Error Box (Beautiful + Colorful)
    // ---------------------------------------------------------------------
    private static function error($msg) {
        return '
        <div class="boa-error-box" style="
            padding:15px;
            background:#ffe4e4;
            border-left:4px solid #e02424;
            margin:10px 0;
            border-radius:4px;">
            <strong>Error:</strong> '. esc_html($msg) .'
        </div>';
    }

    private static function error_with_login($msg) {
        return '
        <div class="boa-error-box" style="
            padding:15px;
            background:#fff4d6;
            border-left:4px solid #d69e2e;
            margin:10px 0;
            border-radius:4px;">
            <p>'.esc_html($msg).'</p>
            <a href="'.wp_login_url(get_permalink()).'" class="button button-primary">Login</a>
        </div>';
    }
}
