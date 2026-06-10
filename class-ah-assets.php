<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * BABA Online Academy - Asset Management
 *
 * (2025 BABA ARCHITECT - REFACTOR 3)
 * - Added new case 'boa-admission-reviews' for the admin review page.
 * - Added new function enqueue_public_assets() for the front-end shortcode.
 * - Added localization for public nonce (boa_public_data).
 */
class BOA_Assets {

    public static function init() {
        add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_admin_assets' ) );
        // (پبلک اثاثے صرف شارٹ کوڈ کے ذریعے لوڈ کیے جائیں گے)
    }

    public static function enqueue_admin_assets( $hook ) {
        // ہمارا مین مینو slug = baba-online-academy
        $page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';

        // صرف اپنے pages پر لوڈ کریں
        $allowed_pages = array(
            'baba-online-academy',
            'boa-dashboard',
            'boa-admission-reviews', // --- نیا پیج ---
            'boa-courses',
            'boa-course-materials',
            'boa-students',
            'boa-fees',
            'boa-expenses',
            'boa-quizzes',
            'boa-assignments',
            'boa-attendance',
            'boa-transactions',
            'boa-reports',
            'boa-settings',
            'boa-live-sessions',
            'boa-notices',
        );

        if ( ! in_array( $page, $allowed_pages, true ) ) {
            return;
        }

        // Common CSS & JS
        wp_enqueue_style(
            'boa-common',
            BOA_PLUGIN_URL . 'ah-common.css',
            array(),
            BOA_VERSION
        );

        // Chart.js (CDN) – charts کیلئے
        wp_enqueue_script(
            'chartjs',
            'https://cdn.jsdelivr.net/npm/chart.js',
            array(),
            '4.4.0',
            true
        );

        wp_enqueue_script(
            'boa-common',
            BOA_PLUGIN_URL . 'ah-common.js',
            array( 'jquery' ),
            BOA_VERSION,
            true
        );

        // Page specific assets
        switch ( $page ) {
            // --- نیا: ایڈمیشن ریویو پیج ---
            case 'boa-admission-reviews':
                wp_enqueue_style(
                    'boa-admission-reviews',
                    BOA_PLUGIN_URL . 'page-admission-reviews/page-admission-reviews.css',
                    array( 'boa-common' ),
                    BOA_VERSION
                );
                wp_enqueue_script(
                    'boa-admission-reviews',
                    BOA_PLUGIN_URL . 'page-admission-reviews/page-admission-reviews.js',
                    array( 'jquery', 'boa-common' ),
                    BOA_VERSION,
                    true
                );
                wp_localize_script(
                    'boa-admission-reviews',
                    'boa_admin_review_data',
                    array(
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'nonce'    => wp_create_nonce( 'boa_admin_review_nonce' ),
                        'currency' => boa_get_currency_symbol(),
                    )
                );
                break;

            case 'boa-expenses':
                $exp_version = file_exists( BOA_PLUGIN_DIR . 'page-expenses/page-expenses.css' ) ? filemtime( BOA_PLUGIN_DIR . 'page-expenses/page-expenses.css' ) : BOA_VERSION;
                wp_enqueue_script(
                    'boa-expenses',
                    BOA_PLUGIN_URL . 'page-expenses/page-expenses.js',
                    array( 'jquery', 'boa-common' ),
                    $exp_version,
                    true
                );
                wp_localize_script(
                    'boa-expenses',
                    'boa_expenses_data',
                    array(
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'nonce'    => wp_create_nonce( 'boa_expenses_nonce' ),
                        'currency' => boa_get_currency_symbol(),
                    )
                );
                wp_enqueue_style(
                    'boa-expenses',
                    BOA_PLUGIN_URL . 'page-expenses/page-expenses.css',
                    array( 'boa-common' ),
                    $exp_version
                );
                break;
            case 'boa-quizzes':
                wp_enqueue_style(
                    'boa-quizzes',
                    BOA_PLUGIN_URL . 'page-quizzes/page-quizzes.css',
                    array( 'boa-common' ),
                    BOA_VERSION
                );
                wp_enqueue_script(
                    'boa-quizzes',
                    BOA_PLUGIN_URL . 'page-quizzes/page-quizzes.js',
                    array( 'jquery', 'boa-common' ),
                    BOA_VERSION,
                    true
                );
                wp_localize_script(
                    'boa-quizzes',
                    'boa_quizzes_data',
                    array(
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'nonce'    => wp_create_nonce( 'boa_quizzes_nonce' ),
                        'student_nonce' => wp_create_nonce( 'boa_student_nonce' ),
                        'i18n'     => array(
                            'loading' => __( 'Loading quizzes...', 'baba-online-academy' ),
                            'empty'   => __( 'No quizzes found.', 'baba-online-academy' ),
                            'saved'   => __( 'Quiz saved.', 'baba-online-academy' ),
                            'confirmDelete' => __( 'Delete this quiz?', 'baba-online-academy' ),
                            'edit'    => __( 'Edit', 'baba-online-academy' ),
                            'questions' => __( 'Questions', 'baba-online-academy' ),
                            'delete'  => __( 'Delete', 'baba-online-academy' ),
                            'marks'   => __( 'Marks', 'baba-online-academy' ),
                            'noQuestions' => __( 'No questions added yet.', 'baba-online-academy' ),
                            'questionSaved' => __( 'Question saved.', 'baba-online-academy' ),
                            'questionDeleted' => __( 'Question deleted.', 'baba-online-academy' ),
                            'selectQuiz' => __( 'Select a quiz to edit questions.', 'baba-online-academy' ),
                            'needTwoOptions' => __( 'Provide at least two options.', 'baba-online-academy' ),
                            'needCorrectOption' => __( 'Select the correct option.', 'baba-online-academy' ),
                            'range'   => __( 'Showing %1$s-%2$s of %3$s quizzes', 'baba-online-academy' ),
                            'prev'    => __( 'Previous', 'baba-online-academy' ),
                            'next'    => __( 'Next', 'baba-online-academy' ),
                        ),
                    )
                );
                break;
            case 'boa-assignments':
                wp_enqueue_style(
                    'boa-assignments',
                    BOA_PLUGIN_URL . 'page-assignments/page-assignments.css',
                    array( 'boa-common' ),
                    BOA_VERSION
                );
                wp_enqueue_script(
                    'boa-assignments',
                    BOA_PLUGIN_URL . 'page-assignments/page-assignments.js',
                    array( 'jquery', 'boa-common' ),
                    BOA_VERSION,
                    true
                );
                wp_localize_script(
                    'boa-assignments',
                    'boa_assignments_data',
                    array(
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'nonce'    => wp_create_nonce( 'boa_assignments_nonce' ),
                        'i18n'     => array(
                            'loading'        => __( 'Loading assignments...', 'baba-online-academy' ),
                            'empty'          => __( 'No assignments available.', 'baba-online-academy' ),
                            'chooseAssignment'=> __( 'Select assignment', 'baba-online-academy' ),
                            'noSubmissions'  => __( 'No submissions yet.', 'baba-online-academy' ),
                            'view'           => __( 'View', 'baba-online-academy' ),
                            'grade'          => __( 'Grade', 'baba-online-academy' ),
                            'saved'          => __( 'Assignment saved.', 'baba-online-academy' ),
                            'confirmDelete'  => __( 'Delete this assignment?', 'baba-online-academy' ),
                            'range'          => __( 'Showing %1$s-%2$s of %3$s assignments', 'baba-online-academy' ),
                            'prev'           => __( 'Previous', 'baba-online-academy' ),
                            'next'           => __( 'Next', 'baba-online-academy' ),
                            'selectSubmissionPrompt' => __( 'Select an assignment to view submissions.', 'baba-online-academy' ),
                            'gradeSaved'     => __( 'Submission graded.', 'baba-online-academy' ),
                            'edit'           => __( 'Edit', 'baba-online-academy' ),
                            'delete'         => __( 'Delete', 'baba-online-academy' ),
                            'marksLabel'     => __( 'Marks', 'baba-online-academy' ),
                            'remarksLabel'   => __( 'Remarks', 'baba-online-academy' ),
                            'feedbackLabel'  => __( 'Feedback', 'baba-online-academy' ),
                            'saveGrade'      => __( 'Save Grade', 'baba-online-academy' ),
                        ),
                    )
                );
                break;
            case 'boa-attendance':
                wp_enqueue_style(
                    'boa-attendance',
                    BOA_PLUGIN_URL . 'page-attendance/page-attendance.css',
                    array( 'boa-common' ),
                    BOA_VERSION
                );
                wp_enqueue_script(
                    'boa-attendance',
                    BOA_PLUGIN_URL . 'page-attendance/page-attendance.js',
                    array( 'jquery', 'boa-common' ),
                    BOA_VERSION,
                    true
                );
                wp_localize_script(
                    'boa-attendance',
                    'boa_attendance_data',
                    array(
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'nonce'    => wp_create_nonce( 'boa_attendance_nonce' ),
                        'today'    => current_time( 'Y-m-d' ),
                        'statuses' => array(
                            'present' => __( 'Present', 'baba-online-academy' ),
                            'absent'  => __( 'Absent', 'baba-online-academy' ),
                            'late'    => __( 'Late', 'baba-online-academy' ),
                        ),
                        'i18n'     => array(
                            'selectFilters'   => __( 'Select a course and date to begin.', 'baba-online-academy' ),
                            'loading'         => __( 'Loading attendance...', 'baba-online-academy' ),
                            'noStudents'      => __( 'No students found for this course.', 'baba-online-academy' ),
                            'saved'           => __( 'Attendance saved.', 'baba-online-academy' ),
                            'save'            => __( 'Save Attendance', 'baba-online-academy' ),
                            'markAllPresent'  => __( 'Mark all present', 'baba-online-academy' ),
                            'markAllAbsent'   => __( 'Mark all absent', 'baba-online-academy' ),
                            'remarks'         => __( 'Remarks', 'baba-online-academy' ),
                            'status'          => __( 'Status', 'baba-online-academy' ),
                            'student'         => __( 'Student', 'baba-online-academy' ),
                            'presentCount'    => __( 'Present', 'baba-online-academy' ),
                            'absentCount'     => __( 'Absent', 'baba-online-academy' ),
                            'lateCount'       => __( 'Late', 'baba-online-academy' ),
                            'unmarkedCount'   => __( 'Unmarked', 'baba-online-academy' ),
                            'confirmSave'     => __( 'Save attendance records?', 'baba-online-academy' ),
                        ),
                    )
                );
                break;
            case 'boa-transactions':
                wp_enqueue_style(
                    'boa-transactions',
                    BOA_PLUGIN_URL . 'page-transactions/page-transactions.css',
                    array( 'boa-common' ),
                    BOA_VERSION
                );
                wp_enqueue_script(
                    'boa-transactions',
                    BOA_PLUGIN_URL . 'page-transactions/page-transactions.js',
                    array( 'jquery', 'boa-common' ),
                    BOA_VERSION,
                    true
                );
                wp_localize_script(
                    'boa-transactions',
                    'boa_transactions_data',
                    array(
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'nonce'    => wp_create_nonce( 'boa_transactions_nonce' ),
                        'currency' => boa_get_currency_symbol(),
                        'i18n'     => array(
                            'loading' => __( 'Loading transactions...', 'baba-online-academy' ),
                            'empty'   => __( 'No transactions found.', 'baba-online-academy' ),
                            'network' => __( 'Network error while loading transactions.', 'baba-online-academy' ),
                        ),
                    )
                );
                break;

            case 'boa-live-sessions':
                wp_enqueue_style(
                    'boa-live-sessions',
                    BOA_PLUGIN_URL . 'page-live-sessions/page-live-sessions.css',
                    array( 'boa-common' ),
                    BOA_VERSION
                );
                wp_enqueue_script(
                    'boa-live-sessions',
                    BOA_PLUGIN_URL . 'page-live-sessions/page-live-sessions.js',
                    array( 'jquery', 'boa-common' ),
                    BOA_VERSION,
                    true
                );
                wp_localize_script(
                    'boa-live-sessions',
                    'boa_live_sessions_data',
                    array(
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'nonce'    => wp_create_nonce( 'boa_ajax_nonce' ),
                        'courses'  => BOA_DB::get_courses( array( 'per_page' => 999 ) )['items'],
                        'i18n'     => array(
                            'loading'      => __( 'Loading…', 'baba-online-academy' ),
                            'noSessions'   => __( 'No sessions found.', 'baba-online-academy' ),
                            'required'     => __( 'Please fill all required fields.', 'baba-online-academy' ),
                            'newSession'   => __( 'Create Live Session', 'baba-online-academy' ),
                            'editSession'  => __( 'Edit Live Session', 'baba-online-academy' ),
                            'edit'         => __( 'Edit', 'baba-online-academy' ),
                            'attendance'   => __( 'Attendance', 'baba-online-academy' ),
                            'delete'       => __( 'Delete', 'baba-online-academy' ),
                            'noAttendance' => __( 'No attendance recorded yet.', 'baba-online-academy' ),
                            'confirmDelete'=> __( 'Do you really want to delete this session?', 'baba-online-academy' ),
                            'saving'       => __( 'Saving…', 'baba-online-academy' ),
                            'save'         => __( 'Save Session', 'baba-online-academy' ),
                            'allCourses'   => __( 'All Courses', 'baba-online-academy' ),
                            'noCourse'     => __( 'No Course', 'baba-online-academy' ),
                        ),
                    )
                );
                break;
            case 'boa-notices':
                wp_enqueue_script(
                    'boa-notice-board',
                    BOA_PLUGIN_URL . 'page-notice-board/page-notice-board.js',
                    array( 'jquery', 'boa-common' ),
                    BOA_VERSION,
                    true
                );
                wp_localize_script(
                    'boa-notice-board',
                    'boa_notices_data',
                    array(
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'nonce'    => wp_create_nonce( 'boa_notices_nonce' ),
                        'labels'   => array(
                            'audience' => array(
                                'all'        => __( 'All Users', 'baba-online-academy' ),
                                'student'    => __( 'Students', 'baba-online-academy' ),
                                'instructor' => __( 'Instructors', 'baba-online-academy' ),
                            ),
                            'priority' => array(
                                'low'      => __( 'Low', 'baba-online-academy' ),
                                'normal'   => __( 'Normal', 'baba-online-academy' ),
                                'high'     => __( 'High', 'baba-online-academy' ),
                                'critical' => __( 'Critical', 'baba-online-academy' ),
                            ),
                        ),
                        'i18n' => array(
                            'loading'       => __( 'Loading notices...', 'baba-online-academy' ),
                            'empty'         => __( 'No notices found.', 'baba-online-academy' ),
                            'error'         => __( 'Unable to process the request.', 'baba-online-academy' ),
                            'saved'         => __( 'Notice saved successfully.', 'baba-online-academy' ),
                            'deleted'       => __( 'Notice deleted.', 'baba-online-academy' ),
                            'active'        => __( 'Active', 'baba-online-academy' ),
                            'inactive'      => __( 'Inactive', 'baba-online-academy' ),
                            'confirmDelete' => __( 'Delete this notice?', 'baba-online-academy' ),
                        ),
                    )
                );
                break;
            // --- /نیا ---

            case 'boa-students':
                wp_enqueue_style(
                    'boa-students',
                    BOA_PLUGIN_URL . 'page-students/page-students.css',
                    array( 'boa-common' ),
                    BOA_VERSION
                );
                wp_enqueue_script(
                    'boa-students',
                    BOA_PLUGIN_URL . 'page-students/page-students.js',
                    array( 'jquery', 'chartjs', 'boa-common' ),
                    BOA_VERSION,
                    true
                );

                wp_localize_script(
                    'boa-students',
                    'boa_students_data',
                    array(
                        'ajax_url'               => admin_url( 'admin-ajax.php' ),
                        'nonce'                  => wp_create_nonce( 'boa_students_nonce' ),
                        'student_course_stats'   => BOA_DB::get_student_course_snapshot_stats(),
                        'recent_admissions'      => BOA_DB::get_student_recent_admissions(),
                        'courses_list'           => BOA_DB::get_courses(array('per_page' => 999))['items'],
                        'currency'               => boa_get_currency_symbol(),
                    )
                );
                break;

            case 'boa-fees':
                wp_enqueue_style(
                    'boa-fees',
                    BOA_PLUGIN_URL . 'page-fees/page-fees.css',
                    array( 'boa-common' ),
                    BOA_VERSION
                );
                wp_enqueue_script(
                    'boa-fees',
                    BOA_PLUGIN_URL . 'page-fees/page-fees.js',
                    array( 'jquery', 'chartjs', 'boa-common' ),
                    BOA_VERSION,
                    true
                );

                wp_localize_script(
                    'boa-fees',
                    'boa_fees_data',
                    array(
                        'ajax_url'           => admin_url( 'admin-ajax.php' ),
                        'nonce'              => wp_create_nonce( 'boa_fees_nonce' ),
                        'fee_status_snapshot'=> BOA_DB::get_fee_status_snapshot(),
                        'today_collections'  => BOA_DB::get_today_collections(),
                        'upcoming_deadlines' => BOA_DB::get_fees_upcoming_deadlines_list(),
                        'courses_list'       => BOA_DB::get_courses(array('per_page' => 999))['items'],
                        'students_list'      => BOA_DB::get_students(array('per_page' => 999, 'status' => 'active'))['items'],
                        'currency'           => boa_get_currency_symbol(),
                    )
                );
                break;

            case 'boa-reports':
                wp_enqueue_style(
                    'boa-reports',
                    BOA_PLUGIN_URL . 'page-reports/page-reports.css',
                    array( 'boa-common' ),
                    BOA_VERSION
                );
                wp_enqueue_script(
                    'boa-reports',
                    BOA_PLUGIN_URL . 'page-reports/page-reports.js',
                    array( 'jquery', 'chartjs', 'boa-common' ),
                    BOA_VERSION,
                    true
                );
                wp_localize_script(
                    'boa-reports',
                    'boa_reports_data',
                    array(
                        'ajax_url'     => admin_url( 'admin-ajax.php' ),
                        'nonce'        => wp_create_nonce( 'boa_reports_nonce' ),
                        'currency'     => boa_get_currency_symbol(),
                        'i18n'         => array(
                            'expenseDifference' => __( 'vs previous month', 'baba-online-academy' ),
                        ),
                    )
                );
                break;

            case 'boa-settings':
                wp_enqueue_style(
                    'boa-settings',
                    BOA_PLUGIN_URL . 'page-settings/page-settings.css',
                    array( 'boa-common' ),
                    BOA_VERSION
                );
                wp_enqueue_script(
                    'boa-settings',
                    BOA_PLUGIN_URL . 'page-settings/page-settings.js',
                    array( 'jquery', 'boa-common' ),
                    BOA_VERSION,
                    true
                );

                wp_localize_script(
                    'boa-settings',
                    'boa_settings_data',
                    array(
                        'ajax_url'        => admin_url( 'admin-ajax.php' ),
                        'nonce'           => wp_create_nonce( 'boa_settings_nonce' ),
                        'current_settings'=> BOA_DB::get_settings(),
                        'categories'      => BOA_DB::get_categories(),
                        'currency'        => boa_get_currency_symbol(),
                    )
                );
                break;

            case 'boa-courses':
                wp_enqueue_style(
                    'boa-courses',
                    BOA_PLUGIN_URL . 'page-courses/page-courses.css',
                    array( 'boa-common' ),
                    BOA_VERSION
                );
                wp_enqueue_script(
                    'boa-courses',
                    BOA_PLUGIN_URL . 'page-courses/page-courses.js',
                    array( 'jquery', 'chartjs', 'boa-common' ),
                    BOA_VERSION,
                    true
                );

                wp_localize_script(
                    'boa-courses',
                    'boa_courses_data',
                    array(
                        'ajax_url'       => admin_url( 'admin-ajax.php' ),
                        'nonce'          => wp_create_nonce( 'boa_courses_nonce' ),
                        'categories'     => BOA_DB::get_categories(),
                        'courses_stats'  => BOA_DB::get_course_stats(),
                        'category_stats' => BOA_DB::get_course_category_stats(),
                        'currency'       => boa_get_currency_symbol(),
                    )
                );
                break;

            case 'boa-dashboard':
            case 'baba-online-academy':
                wp_enqueue_style(
                    'boa-dashboard',
                    BOA_PLUGIN_URL . 'page-dashboard/dashboard-modern.css',
                    array( 'boa-common' ),
                    BOA_VERSION
                );
                wp_enqueue_script(
                    'boa-dashboard',
                    BOA_PLUGIN_URL . 'page-dashboard/dashboard-modern.js',
                    array( 'jquery', 'chartjs', 'boa-common' ),
                    BOA_VERSION,
                    true
                );

                wp_localize_script(
                    'boa-dashboard',
                    'boa_dashboard_data',
                    array(
                        'ajax_url'           => admin_url( 'admin-ajax.php' ),
                        'nonce'              => wp_create_nonce( 'boa_dashboard_nonce' ),
                        'upcoming_deadlines' => BOA_DB::get_dashboard_upcoming_deadlines(),
                        'income_data'        => BOA_DB::get_dashboard_monthly_income_data(),
                        'course_income'      => BOA_DB::get_dashboard_course_income_data(),
                        'recent_activity'    => BOA_DB::get_dashboard_recent_activity(),
                        'fee_status_overview'=> BOA_DB::get_dashboard_fee_status_overview(),
                        'currency'           => boa_get_currency_symbol(),
                    )
                );
                break;

            case 'boa-course-materials':
                wp_enqueue_style(
                    'boa-course-materials',
                    BOA_PLUGIN_URL . 'page-course-materials/page-course-materials.css',
                    array( 'boa-common' ),
                    BOA_VERSION
                );
                wp_enqueue_script(
                    'boa-course-materials',
                    BOA_PLUGIN_URL . 'page-course-materials/page-course-materials.js',
                    array( 'jquery', 'boa-common' ),
                    BOA_VERSION,
                    true
                );
                wp_localize_script(
                    'boa-course-materials',
                    'boa_course_materials_data',
                    array(
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'nonce'    => wp_create_nonce( 'boa_course_materials_nonce' ),
                    )
                );
                break;
        }
    }

    /**
     * نیا: پبلک اثاثے (Assets) لوڈ کرتا ہے۔
     * اسے baba-online-academy.php میں شارٹ کوڈ فنکشن سے کال کیا جاتا ہے۔
     */
    public static function enqueue_public_assets() {
        if ( ! wp_style_is( 'boa-public-form', 'enqueued' ) ) {
            wp_enqueue_style(
                'boa-public-form',
                BOA_PLUGIN_URL . 'page-admission-form/page-admission-form.css',
                array(),
                BOA_VERSION
            );
        }

        if ( ! wp_script_is( 'boa-public-form', 'enqueued' ) ) {
            wp_enqueue_script(
                'boa-public-form',
                BOA_PLUGIN_URL . 'page-admission-form/page-admission-form.js',
                array( 'jquery' ),
                BOA_VERSION,
                true
            );
        }

        wp_localize_script(
            'boa-public-form',
            'boa_public_data',
            array(
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'nonce'    => wp_create_nonce( 'boa_public_nonce' ),
                'courses'  => BOA_DB::get_courses( array( 'per_page' => 999 ) )['items'],
                'currency' => boa_get_currency_symbol(),
                'status_page_url'   => apply_filters( 'boa_application_status_url', '' ),
                'status_link_label' => __( 'Open status page', 'baba-online-academy' ),
                'status_note'       => __( 'Keep this tracking code safe.', 'baba-online-academy' ),
            )
        );

        if ( ! is_user_logged_in() ) {
            return;
        }

        $user = wp_get_current_user();
        if ( ! $user || ! in_array( 'student', (array) $user->roles, true ) ) {
            return;
        }

        if ( ! wp_style_is( 'boa-student-dashboard', 'enqueued' ) ) {
            wp_enqueue_style(
                'boa-student-dashboard',
                BOA_PLUGIN_URL . 'page-student-dashboard/page-student-dashboard.css',
                array(),
                BOA_VERSION
            );
        }

        if ( ! wp_script_is( 'boa-student-dashboard', 'enqueued' ) ) {
            wp_enqueue_script(
                'boa-student-dashboard',
                BOA_PLUGIN_URL . 'page-student-dashboard/page-student-dashboard.js',
                array( 'jquery' ),
                BOA_VERSION,
                true
            );
        }

        $max_upload = size_format( wp_max_upload_size() );

        wp_localize_script(
            'boa-student-dashboard',
            'boa_student_portal',
            array(
                'ajax_url'     => admin_url( 'admin-ajax.php' ),
                'nonce'        => wp_create_nonce( 'boa_student_nonce' ),
                'stripe_nonce' => wp_create_nonce( 'boa_stripe_nonce' ),
                'max_upload'   => $max_upload,
                'i18n'         => array(
                    'loading'            => __( 'Loading...', 'baba-online-academy' ),
                    'noQuizzes'          => __( 'No quizzes assigned yet.', 'baba-online-academy' ),
                    'startQuiz'          => __( 'Start Quiz', 'baba-online-academy' ),
                    'retakeQuiz'         => __( 'Retake Quiz', 'baba-online-academy' ),
                    'submitQuiz'         => __( 'Submit Quiz', 'baba-online-academy' ),
                    'quizInstructions'   => __( 'Please attempt each question before submitting.', 'baba-online-academy' ),
                    'noQuestions'        => __( 'No questions added to this quiz yet.', 'baba-online-academy' ),
                    'quizSaved'          => __( 'Quiz attempt submitted.', 'baba-online-academy' ),
                    'passLabel'          => __( 'Pass', 'baba-online-academy' ),
                    'timeLabel'          => __( 'Time limit', 'baba-online-academy' ),
                    'minutesLabel'       => __( 'minutes', 'baba-online-academy' ),
                    'noAssignments'      => __( 'No assignments to display.', 'baba-online-academy' ),
                    'submitAssignment'   => __( 'Upload Submission', 'baba-online-academy' ),
                    'resubmitAssignment' => __( 'Resubmit', 'baba-online-academy' ),
                    'viewSubmission'     => __( 'View Submission', 'baba-online-academy' ),
                    'downloadBrief'      => __( 'Download Brief', 'baba-online-academy' ),
                    'uploading'          => __( 'Uploading...', 'baba-online-academy' ),
                    'uploadSuccess'      => __( 'Assignment submitted successfully.', 'baba-online-academy' ),
                    'uploadFailed'       => __( 'Unable to upload your assignment. Please try again.', 'baba-online-academy' ),
                    'dueLabel'           => __( 'Due', 'baba-online-academy' ),
                    'marksLabel'         => __( 'Max Marks', 'baba-online-academy' ),
                    'statusLabel'        => __( 'Status', 'baba-online-academy' ),
                    'gradedLabel'        => __( 'Grade', 'baba-online-academy' ),
                    'submissionPending'  => __( 'Pending review', 'baba-online-academy' ),
                    'scoreLabel'         => __( 'Score', 'baba-online-academy' ),
                ),
            )
        );
    }

    public static function enqueue_public_live_sessions_assets() {
        if ( wp_style_is( 'boa-public-live-sessions', 'enqueued' ) ) {
            return;
        }

        wp_enqueue_style(
            'boa-public-live-sessions',
            BOA_PLUGIN_URL . 'page-live-sessions-public/page-live-sessions-public.css',
            array(),
            BOA_VERSION
        );

        wp_enqueue_script(
            'boa-public-live-sessions',
            BOA_PLUGIN_URL . 'page-live-sessions-public/page-live-sessions-public.js',
            array( 'jquery' ),
            BOA_VERSION,
            true
        );

        wp_localize_script(
            'boa-public-live-sessions',
            'boa_live_sessions_public',
            array(
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'nonce'    => wp_create_nonce( 'boa_public_nonce' ),
                'messages' => array(
                    'loading'     => __( 'Loading sessions…', 'baba-online-academy' ),
                    'noSessions'  => __( 'No upcoming sessions found.', 'baba-online-academy' ),
                    'join'        => __( 'Join Session', 'baba-online-academy' ),
                    'joined'      => __( 'Joining…', 'baba-online-academy' ),
                    'needDetails' => __( 'Please enter your name and email/phone before joining.', 'baba-online-academy' ),
                ),
            )
        );
    }
    public static function enqueue_status_assets() {
        if ( wp_style_is( 'boa-status-check', 'enqueued' ) ) {
            return;
        }

        wp_enqueue_style(
            'boa-status-check',
            BOA_PLUGIN_URL . 'page-application-status/page-application-status.css',
            array(),
            BOA_VERSION
        );

        wp_enqueue_script(
            'boa-status-check',
            BOA_PLUGIN_URL . 'page-application-status/page-application-status.js',
            array( 'jquery' ),
            BOA_VERSION,
            true
        );

        wp_localize_script(
            'boa-status-check',
            'boa_status_data',
            array(
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'nonce'    => wp_create_nonce( 'boa_public_nonce' ),
                'messages' => array(
                    'required'  => __( 'Please enter tracking code along with email or phone number.', 'baba-online-academy' ),
                    'not_found' => __( 'No application found for the provided details.', 'baba-online-academy' ),
                ),
            )
        );
    }



}

// ✅ Syntax verified block end



