<?php
/**
 * Admin Menu Loader for Baba Online Academy
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class BOA_Admin_Menu {

    private $cap_admin     = 'manage_options';
    private $cap_instructor = 'boa_manage_instruction';
    private $cap_sessions   = 'boa_manage_live_sessions';
    private $cap_portal     = 'boa_access_portal';

    private $slug = 'baba-online-academy';

    /**
     * Register Admin Menu
     */
    public function register() {

        // Main Menu Entry
        add_menu_page(
            __('Academic Hub', 'baba-online-academy'),
            __('Academic Hub', 'baba-online-academy'),
            $this->cap_portal,
            $this->slug,
            array($this, 'load_page'),
            'dashicons-welcome-learn-more',
            26
        );

        // Register all submenu pages in a loop
        $menus = $this->get_menu_items();

        foreach ( $menus as $menu ) {
            add_submenu_page(
                $this->slug,
                $menu['title'],
                $menu['label'],
                $menu['capability'],
                $menu['slug'],
                array( $this, 'load_page' )
            );
        }
    }

    /**
     * Clean Menu Definitions
     */
    private function get_menu_items() {

        return [

            // Dashboard
            [
                'slug'       => 'boa-dashboard',
                'title'      => __('Dashboard', 'baba-online-academy'),
                'label'      => __('Dashboard', 'baba-online-academy'),
                'capability' => $this->cap_portal,
                'file'       => 'page-dashboard/page-dashboard.php'
            ],

            // Admission Reviews
            [
                'slug'       => 'boa-admission-reviews',
                'title'      => __('Admission Reviews', 'baba-online-academy'),
                'label'      => __('Admission Reviews', 'baba-online-academy'),
                'capability' => $this->cap_admin,
                'file'       => 'page-admission-reviews/page-admission-reviews.php'
            ],

            // Live Sessions
            [
                'slug'       => 'boa-live-sessions',
                'title'      => __('Live Sessions', 'baba-online-academy'),
                'label'      => __('Live Sessions', 'baba-online-academy'),
                'capability' => $this->cap_sessions,
                'file'       => 'page-live-sessions/page-live-sessions.php'
            ],

            // Courses
            [
                'slug'       => 'boa-courses',
                'title'      => __('Courses', 'baba-online-academy'),
                'label'      => __('Courses', 'baba-online-academy'),
                'capability' => $this->cap_admin,
                'file'       => 'page-courses/page-courses.php'
            ],

            // Course Materials
            [
                'slug'       => 'boa-course-materials',
                'title'      => __('Course Materials', 'baba-online-academy'),
                'label'      => __('Course Materials', 'baba-online-academy'),
                'capability' => $this->cap_admin,
                'file'       => 'page-course-materials/page-course-materials.php'
            ],

            // Quizzes
            [
                'slug'       => 'boa-quizzes',
                'title'      => __('Quizzes', 'baba-online-academy'),
                'label'      => __('Quizzes', 'baba-online-academy'),
                'capability' => $this->cap_instructor,
                'file'       => 'page-quizzes/page-quizzes.php'
            ],

            // Assignments
            [
                'slug'       => 'boa-assignments',
                'title'      => __('Assignments', 'baba-online-academy'),
                'label'      => __('Assignments', 'baba-online-academy'),
                'capability' => $this->cap_instructor,
                'file'       => 'page-assignments/page-assignments.php'
            ],

            // Attendance
            [
                'slug'       => 'boa-attendance',
                'title'      => __('Attendance', 'baba-online-academy'),
                'label'      => __('Attendance', 'baba-online-academy'),
                'capability' => $this->cap_instructor,
                'file'       => 'page-attendance/page-attendance.php'
            ],

            // Students
            [
                'slug'       => 'boa-students',
                'title'      => __('Students', 'baba-online-academy'),
                'label'      => __('Students', 'baba-online-academy'),
                'capability' => $this->cap_admin,
                'file'       => 'page-students/page-students.php'
            ],

            // Fees
            [
                'slug'       => 'boa-fees',
                'title'      => __('Fees', 'baba-online-academy'),
                'label'      => __('Fees', 'baba-online-academy'),
                'capability' => $this->cap_admin,
                'file'       => 'page-fees/page-fees.php'
            ],

            // Transactions
            [
                'slug'       => 'boa-transactions',
                'title'      => __('Transactions', 'baba-online-academy'),
                'label'      => __('Transactions', 'baba-online-academy'),
                'capability' => $this->cap_admin,
                'file'       => 'page-transactions/page-transactions.php'
            ],

            // Expenses
            [
                'slug'       => 'boa-expenses',
                'title'      => __('Expenses', 'baba-online-academy'),
                'label'      => __('Expenses', 'baba-online-academy'),
                'capability' => $this->cap_admin,
                'file'       => 'page-expenses/page-expenses.php'
            ],

            // Reports
            [
                'slug'       => 'boa-reports',
                'title'      => __('Reports', 'baba-online-academy'),
                'label'      => __('Reports', 'baba-online-academy'),
                'capability' => $this->cap_admin,
                'file'       => 'page-reports/page-reports.php'
            ],

            // Notice Board
            [
                'slug'       => 'boa-notices',
                'title'      => __('Notice Board', 'baba-online-academy'),
                'label'      => __('Notice Board', 'baba-online-academy'),
                'capability' => $this->cap_admin,
                'file'       => 'page-notice-board/page-notice-board.php'
            ],

            // Settings
            [
                'slug'       => 'boa-settings',
                'title'      => __('Settings', 'baba-online-academy'),
                'label'      => __('Settings', 'baba-online-academy'),
                'capability' => $this->cap_admin,
                'file'       => 'page-settings/page-settings.php'
            ],

        ];
    }

    /**
     * Loads the template file for each submenu page
     */
    public function load_page() {

        $current = $_GET['page'] ?? '';
        $menus   = $this->get_menu_items();

        foreach ( $menus as $menu ) {
            if ( $menu['slug'] === $current ) {
                $path = BOA_DIR . $menu['file'];

                if ( file_exists( $path ) ) {
                    include $path;
                } else {
                    echo "<div class='wrap'><h2>{$menu['title']}</h2><p>Page file missing: {$menu['file']}</p></div>";
                }
                return;
            }
        }

        // Default dashboard
        include BOA_DIR . 'page-dashboard/page-dashboard.php';
    }
}
