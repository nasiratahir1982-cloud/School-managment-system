<?php
/**
 * Modern Professional Dashboard - Baba Online Academy (2025)
 * Complete redesign with modern UI, charts, and comprehensive features
 * Based on user's design requirements from Gemini image
 * 
 * WordPress Plugin Format
 */

if (!defined('ABSPATH')) exit;

/**
 * Get all dashboard data for the modern UI
 */
function boa_get_dashboard_data() {
    $dashboard_stats = BOA_DB::get_dashboard_summary_stats();
    $student_stats = BOA_DB::get_student_summary_stats();
    $fee_stats = BOA_DB::get_fee_summary_stats();
    $course_stats = BOA_DB::get_course_stats();
    $monthly_income = BOA_DB::get_dashboard_monthly_income_data();
    $course_income = BOA_DB::get_dashboard_course_income_data();
    $recent_activity = BOA_DB::get_dashboard_recent_activity();
    $upcoming_deadlines = BOA_DB::get_dashboard_upcoming_deadlines();
    $course_admissions = BOA_DB::get_student_course_snapshot_stats();
    $upcoming_courses = BOA_DB::get_upcoming_courses();
    $dashboard_insights = BOA_DB::get_dashboard_insights();
    
    // Calculate additional metrics
    $total_revenue_this_month = 0;
    $total_revenue_last_month = 0;
    $revenue_growth = 0;

    if (!empty($monthly_income['data']) && count($monthly_income['data']) >= 2) {
        $current_month = end($monthly_income['data']);
        $last_month = prev($monthly_income['data']);
        $total_revenue_this_month = $current_month;
        $total_revenue_last_month = $last_month;
        
        if ($last_month > 0) {
            $revenue_growth = round((($current_month - $last_month) / $last_month) * 100, 1);
        }
    }

    // Get current month fee collections
    $this_month_collections = !empty($monthly_income['data']) ? end($monthly_income['data']) : 0;

    // Calculate pending fees
    $pending_fees_amount = isset($fee_stats['pending_amount']) ? $fee_stats['pending_amount'] : 0;
    $pending_fees_count = isset($fee_stats['pending_count']) ? $fee_stats['pending_count'] : 0;

    return array(
        'stats' => $dashboard_stats,
        'student_stats' => $student_stats,
        'fee_stats' => $fee_stats,
        'course_stats' => $course_stats,
        'monthly_income' => $monthly_income,
        'course_income' => $course_income,
        'recent_activity' => $recent_activity,
        'upcoming_deadlines' => $upcoming_deadlines,
        'course_admissions' => $course_admissions,
        'dashboard_insights' => $dashboard_insights,
        'upcoming_courses' => $upcoming_courses,
        'this_month_collections' => $this_month_collections,
        'pending_fees_amount' => $pending_fees_amount,
        'pending_fees_count' => $pending_fees_count,
        'revenue_growth' => $revenue_growth,
    );
}

// Helper functions
function format_number($number) {
    if ($number >= 1000000) {
        return number_format($number / 1000000, 1) . 'M';
    } elseif ($number >= 1000) {
        return number_format($number / 1000, 1) . 'K';
    }
    return number_format($number);
}

function format_currency($amount) {
    return 'PKR ' . number_format($amount);
}

function get_growth_icon($growth) {
    if ($growth > 0) return '↗';
    if ($growth < 0) return '↘';
    return '→';
}

function get_growth_color($growth) {
    if ($growth > 0) return '#22c55e';
    if ($growth < 0) return '#ef4444';
    return '#6b7280';
}

// Get dashboard data
$data = boa_get_dashboard_data();

// Frontend navigation helpers
$boa_current_page = isset( $_GET['boa_page'] ) ? sanitize_text_field( $_GET['boa_page'] ) : 'boa-dashboard';
$boa_dashboard_url = get_permalink();
$boa_show_sidebar = ! is_admin();
?>

<div id="boa-modern-dashboard" class="wrap">

    <!-- Load Dashboard Styles -->
    <style>
        .boa-dashboard-container {
            display: flex;
            min-height: 100vh;
            background: var(--boa-gray-50);
        }
        .boa-dashboard-container.boa-has-sidebar .boa-main-content {
            margin-left: 260px;
            width: calc(100% - 260px);
        }
        .boa-dashboard-container.boa-no-sidebar .boa-sidebar { display: none; }
        .boa-dashboard-container.boa-no-sidebar {
            justify-content: center;
        }
        .boa-dashboard-container.boa-no-sidebar .boa-main-content {
            margin-left: 0;
            width: 100%;
        }

        /* Modern Sidebar */
        .boa-sidebar {
            width: 260px;
            background: var(--boa-gray-100);
            color: white;
            position: fixed;
            height: 100vh;
            top: 0;
            overflow-y: auto;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            z-index: 999;
            margin-top: 0;
        }

        .boa-sidebar-header {
            padding: 20px;
            border-bottom: 1px solid #334155;
        }

        .boa-sidebar-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
        }

        .boa-logo-icon {
            width: 40px;
            height: 40px;
            background: #3b82f6;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
        }

        .boa-sidebar-nav {
            padding: 0;
        }

        .boa-nav-item {
            margin: 5px 0;
        }

        .boa-nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            color: #cbd5e1;
            text-decoration: none;
            transition: all 0.3s ease;
            border-radius: 8px;
            margin: 0 10px;
        }

        .boa-nav-link:hover, .boa-nav-link.active {
            background: #334155;
            color: #3b82f6;
        }

        .boa-nav-link i {
            width: 20px;
            text-align: center;
        }

        /* Main Content */
        .boa-main-content {
            flex: 1;
            margin-left: 0;
            padding: 20px;
            margin-top: 0;
            min-width: 0;
            width: 100%;
            box-sizing: border-box;
        }

        @media (max-width: 1200px) {
            .boa-sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease;
            }
            .boa-main-content {
                margin-left: 0;
                width: 100%;
            }
        }

        .boa-top-bar {
            background: var(--boa-gray-100);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid var(--boa-gray-200);
            box-shadow: var(--boa-shadow-md);
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .boa-page-title {
            font-size: 24px;
            font-weight: 600;
            color: var(--boa-gray-900);
            margin: 0;
        }

        .boa-user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .boa-user-avatar {
            width: 40px;
            height: 40px;
            background: #3b82f6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
        }

        /* Dashboard Grid */
        .boa-dashboard-grid {
            display: grid;
            gap: 20px;
        }

        .boa-card {
            background: var(--boa-gray-100);
            border-radius: 12px;
            border: 1px solid var(--boa-gray-200);
            padding: 24px;
            box-shadow: var(--boa-shadow-md);
            transition: all 0.3s ease;
        }

        .boa-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px 0 rgba(99, 102, 241, 0.15); border-color: rgba(99, 102, 241, 0.3);
        }

        .boa-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .boa-card-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--boa-gray-900);
            margin: 0;
        }

        .boa-card-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            margin-bottom: 15px;
        }

        /* Summary Cards */
        .boa-summary-card {
            position: relative;
            overflow: hidden;
        }

        .boa-summary-number {
            font-size: 32px;
            font-weight: 700;
            margin: 10px 0;
        }

        .boa-summary-label {
            font-size: 14px;
            color: var(--boa-gray-500);
            font-weight: 500;
        }

        .boa-growth-indicator {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 8px;
            padding: 4px 8px;
            border-radius: 20px;
        }

        /* Chart Container */
        .boa-chart-container {
            position: relative;
            height: 300px;
            margin-top: 15px;
        }

        /* Table Styles */
        .boa-data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        .boa-data-table th,
        .boa-data-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--boa-gray-200);
        }

        .boa-data-table th {
            font-weight: 600;
            color: var(--boa-gray-900);
            background: rgba(255, 255, 255, 0.02);
        }

        .boa-data-table tr:hover {
            background: rgba(255, 255, 255, 0.02);
        }

        /* Status Badges */
        .boa-status-badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }

        .boa-status-paid {
            background: rgba(16, 185, 129, 0.15);
            color: var(--boa-success);
        }

        .boa-status-pending {
            background: rgba(245, 158, 11, 0.15);
            color: var(--boa-warning);
        }

        .boa-status-overdue {
            background: rgba(244, 63, 94, 0.15);
            color: var(--boa-error);
        }

        /* Quick Actions */
        .boa-quick-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            flex-wrap: wrap;
        }

        .boa-action-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .boa-btn-primary {
            background: #3b82f6;
            color: white;
        }

        .boa-btn-primary:hover {
            background: #2563eb;
        }

        .boa-btn-secondary {
            background: var(--boa-gray-100);
            color: var(--boa-gray-800);
            border: 1px solid var(--boa-gray-300);
        }

        .boa-btn-secondary:hover {
            border-color: var(--boa-primary);
            color: var(--boa-primary);
            background: rgba(99, 102, 241, 0.05);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
            .boa-sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s ease;
            }

            .boa-main-content {
                margin-left: 0;
            }
        }

        @media (max-width: 768px) {
            .boa-main-content {
                padding: 15px;
            }

            .boa-card {
                padding: 20px;
            }

            .boa-top-bar {
                padding: 15px;
                flex-direction: column;
                gap: 15px;
                align-items: flex-start;
            }

            .boa-quick-actions {
                flex-direction: column;
            }
        }

        /* Custom Colors */
        .boa-color-blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
        .boa-color-green { background: linear-gradient(135deg, #22c55e, #16a34a); }
        .boa-color-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
        .boa-color-orange { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .boa-color-red { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .boa-color-teal { background: linear-gradient(135deg, #14b8a6, #0d9488); }

        .boa-text-white { color: white; }
        .boa-text-gray { color: var(--boa-gray-500); }
        .boa-text-green { color: #22c55e; }
        .boa-text-red { color: #ef4444; }

        /* Dashboard Hero */
        .boa-dashboard-hero {
            display: flex;
            gap: 24px;
            align-items: stretch;
            background: linear-gradient(135deg, var(--boa-primary), var(--boa-primary-dark));
            color: #fff;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
        }
        .boa-dashboard-hero:after {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 70% 20%, rgba(255,255,255,0.16), transparent 36%);
            pointer-events: none;
        }
        .boa-hero-left, .boa-hero-right { position: relative; z-index: 1; }
        .boa-hero-left { flex: 2; display: flex; flex-direction: column; gap: 10px; }
        .boa-hero-kicker { text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.8rem; font-weight: 800; margin: 0; opacity: 0.92; }
        .boa-hero-title { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .boa-hero-title h1 { margin: 0; font-size: 2.4rem; font-weight: 800; color: #fff; }
        .boa-hero-chip { background: rgba(255,255,255,0.16); padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.24); font-weight: 700; }
        .boa-hero-lead { margin: 0; font-size: 1.05rem; color: rgba(255,255,255,0.9); max-width: 760px; }
        .boa-hero-pills { display: flex; gap: 10px; flex-wrap: wrap; }
        .boa-hero-pill { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; font-weight: 700; background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.2); color: #fff; backdrop-filter: blur(6px); }
        .boa-hero-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 6px; }
        .boa-hero-right { flex: 1; display: flex; justify-content: flex-end; align-items: center; }
        .boa-hero-card { background: var(--boa-gray-50); color: var(--boa-gray-900); padding: 18px; border-radius: 14px; border: 1px solid var(--boa-gray-200); box-shadow: var(--boa-shadow-lg); display: grid; gap: 12px; min-width: 260px; }
        .boa-hero-note { display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--boa-primary); margin: 0; }
        .boa-hero-metrics { display: grid; grid-template-columns: 1fr; gap: 8px; }
        .boa-hero-metrics strong { display: block; font-size: 1.1rem; color: var(--boa-gray-900); }

        /* Stats Cards Grid */
        .boa-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        /* Full Width Cards */
        .boa-full-width {
            grid-column: 1 / -1;
        }

        /* Animation */
        @keyframes boaFadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .boa-card {
            animation: boaFadeInUp 0.5s ease forwards;
        }

        .boa-card:nth-child(1) { animation-delay: 0.1s; }
        .boa-card:nth-child(2) { animation-delay: 0.2s; }
        .boa-card:nth-child(3) { animation-delay: 0.3s; }
        .boa-card:nth-child(4) { animation-delay: 0.4s; }
    </style>

    <!-- Modern Dashboard Container -->
    <div class="boa-dashboard-container<?php echo $boa_show_sidebar ? ' boa-has-sidebar' : ' boa-no-sidebar'; ?>">
        <?php if ( $boa_show_sidebar ) : ?>
        <!-- Modern Sidebar Navigation -->
        <nav class="boa-sidebar">
            <div class="boa-sidebar-header">
                <div class="boa-sidebar-logo">
                    <div class="boa-logo-icon">A</div>
                    <div>
                        <h3 style="margin: 0; font-weight: 600; color: white;">Academic Hub</h3>
                        <p style="margin: 0; font-size: 12px; color: #94a3b8;">Management Portal</p>
                    </div>
                </div>
            </div>
            
            <div class="boa-sidebar-nav">
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-dashboard', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-dashboard' ? ' active' : ''; ?>">
                        <i class="fas fa-chart-line"></i>
                        <span>Dashboard</span>
                    </a>
                </div>
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-admission-reviews', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-admission-reviews' ? ' active' : ''; ?>">
                        <i class="fas fa-clipboard-check"></i>
                        <span>Admission Reviews</span>
                    </a>
                </div>
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-courses', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-courses' ? ' active' : ''; ?>">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Courses</span>
                    </a>
                </div>
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-course-materials', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-course-materials' ? ' active' : ''; ?>">
                        <i class="fas fa-book-open"></i>
                        <span>Course Materials</span>
                    </a>
                </div>
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-quizzes', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-quizzes' ? ' active' : ''; ?>">
                        <i class="fas fa-question-circle"></i>
                        <span>Quizzes</span>
                    </a>
                </div>
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-assignments', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-assignments' ? ' active' : ''; ?>">
                        <i class="fas fa-tasks"></i>
                        <span>Assignments</span>
                    </a>
                </div>
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-attendance', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-attendance' ? ' active' : ''; ?>">
                        <i class="fas fa-user-check"></i>
                        <span>Attendance</span>
                    </a>
                </div>
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-students', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-students' ? ' active' : ''; ?>">
                        <i class="fas fa-users"></i>
                        <span>Students</span>
                    </a>
                </div>
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-fees', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-fees' ? ' active' : ''; ?>">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Fees</span>
                    </a>
                </div>
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-transactions', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-transactions' ? ' active' : ''; ?>">
                        <i class="fas fa-exchange-alt"></i>
                        <span>Transactions</span>
                    </a>
                </div>
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-live-sessions', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-live-sessions' ? ' active' : ''; ?>">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Live Sessions</span>
                    </a>
                </div>
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-expenses', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-expenses' ? ' active' : ''; ?>">
                        <i class="fas fa-receipt"></i>
                        <span>Expenses</span>
                    </a>
                </div>
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-reports', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-reports' ? ' active' : ''; ?>">
                        <i class="fas fa-file-alt"></i>
                        <span>Reports</span>
                    </a>
                </div>
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-notices', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-notices' ? ' active' : ''; ?>">
                        <i class="fas fa-bullhorn"></i>
                        <span>Notice Board</span>
                    </a>
                </div>
                <div class="boa-nav-item">
                    <a href="<?php echo esc_url( add_query_arg( 'boa_page', 'boa-settings', $boa_dashboard_url ) ); ?>" class="boa-nav-link<?php echo $boa_current_page === 'boa-settings' ? ' active' : ''; ?>">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                    </a>
                </div>
            </div>
        </nav>
        <?php endif; ?>

        <!-- Main Content -->
        <main class="boa-main-content">
            <!-- Top Bar -->
            <div class="boa-top-bar">
                <div class="boa-user-info">
                    <span style="color: var(--boa-gray-500);">Howdy, Admin</span>
                    <div class="boa-user-avatar">A</div>
                </div>
            </div>
<?php if ( $boa_current_page === 'boa-dashboard' ) : ?>

            <!-- Dashboard Hero -->
            <div class="boa-dashboard-hero">
                <div class="boa-hero-left">
                    <p class="boa-hero-kicker"><?php esc_html_e( 'Performance Hub', 'baba-online-academy' ); ?></p>
                    <div class="boa-hero-title">
                        <h1><?php esc_html_e( 'Dashboard', 'baba-online-academy' ); ?></h1>
                        <span class="boa-hero-chip"><?php esc_html_e( 'Live overview', 'baba-online-academy' ); ?></span>
                    </div>
                    <p class="boa-hero-lead"><?php esc_html_e( 'Track admissions, revenue, active courses, and pending fees from one bold view.', 'baba-online-academy' ); ?></p>
                    <div class="boa-hero-pills">
                        <span class="boa-hero-pill"><i class="fas fa-user-plus"></i><?php esc_html_e( 'Admissions', 'baba-online-academy' ); ?></span>
                        <span class="boa-hero-pill"><i class="fas fa-coins"></i><?php esc_html_e( 'Revenue', 'baba-online-academy' ); ?></span>
                        <span class="boa-hero-pill"><i class="fas fa-book-open"></i><?php esc_html_e( 'Courses', 'baba-online-academy' ); ?></span>
                    </div>
                    <div class="boa-hero-actions">
                        <a href="<?php echo admin_url('admin.php?page=boa-students&action=add'); ?>" class="boa-action-btn boa-btn-primary"><i class="fas fa-plus"></i> <?php esc_html_e( 'Add Student', 'baba-online-academy' ); ?></a>
                        <a href="<?php echo admin_url('admin.php?page=boa-fees&action=collect'); ?>" class="boa-action-btn boa-btn-secondary"><i class="fas fa-dollar-sign"></i> <?php esc_html_e( 'Collect Fee', 'baba-online-academy' ); ?></a>
                        <a href="<?php echo admin_url('admin.php?page=boa-live-sessions&action=add'); ?>" class="boa-action-btn boa-btn-secondary"><i class="fas fa-video"></i> <?php esc_html_e( 'New Session', 'baba-online-academy' ); ?></a>
                    </div>
                </div>
                <div class="boa-hero-right">
                    <div class="boa-hero-card">
                        <p class="boa-hero-note"><span class="dashicons dashicons-chart-pie"></span><?php esc_html_e( 'Snapshot', 'baba-online-academy' ); ?></p>
                        <div class="boa-hero-metrics">
                            <div>
                                <span class="boa-text-muted"><?php esc_html_e( 'Monthly revenue', 'baba-online-academy' ); ?></span>
                                <strong><?php echo format_currency($data['this_month_collections']); ?></strong>
                            </div>
                            <div>
                                <span class="boa-text-muted"><?php esc_html_e( 'Active courses', 'baba-online-academy' ); ?></span>
                                <strong><?php echo number_format($data['course_stats']['active'] ?? 0); ?></strong>
                            </div>
                            <div>
                                <span class="boa-text-muted"><?php esc_html_e( 'Pending invoices', 'baba-online-academy' ); ?></span>
                                <strong><?php echo number_format($data['pending_fees_count'] ?? 0); ?></strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Summary Stats Cards -->
            <div class="boa-stats-grid">
                <!-- Total Students Card -->
                <div class="boa-card boa-summary-card">
                    <div class="boa-card-icon boa-color-blue">
                        <i class="fas fa-graduation-cap boa-text-white"></i>
                    </div>
                    <div class="boa-summary-number" style="color: #3b82f6;">
                        <?php echo format_number($data['student_stats']['total']); ?>
                    </div>
                    <div class="boa-summary-label">Total Students</div>
                    <div class="boa-growth-indicator" style="color: #22c55e; background: rgba(34, 197, 94, 0.1);">
                        <span><?php echo get_growth_icon(12); ?></span>
                        <span>+<?php echo 12; ?>% this month</span>
                    </div>
                </div>

                <!-- Monthly Revenue Card -->
                <div class="boa-card boa-summary-card">
                    <div class="boa-card-icon boa-color-green">
                        <i class="fas fa-coins boa-text-white"></i>
                    </div>
                    <div class="boa-summary-number" style="color: #22c55e;">
                        <?php echo format_currency($data['this_month_collections']); ?>
                    </div>
                    <div class="boa-summary-label">Monthly Revenue</div>
                    <div class="boa-growth-indicator" style="color: <?php echo get_growth_color($data['revenue_growth']); ?>; background: rgba(<?php echo $data['revenue_growth'] > 0 ? '34, 197, 94' : '239, 68, 68'; ?>, 0.1);">
                        <span><?php echo get_growth_icon($data['revenue_growth']); ?></span>
                        <span><?php echo $data['revenue_growth'] > 0 ? '+' : ''; ?><?php echo $data['revenue_growth']; ?>% vs last month</span>
                    </div>
                </div>

                <!-- Active Courses Card -->
                <div class="boa-card boa-summary-card">
                    <div class="boa-card-icon boa-color-purple">
                        <i class="fas fa-book-open boa-text-white"></i>
                    </div>
                    <div class="boa-summary-number" style="color: #8b5cf6;">
                        <?php echo format_number($data['course_stats']['active']); ?>
                    </div>
                    <div class="boa-summary-label">Active Courses</div>
                    <div class="boa-growth-indicator" style="color: #3b82f6; background: rgba(59, 130, 246, 0.1);">
                        <span>→</span>
                        <span>Current offerings</span>
                    </div>
                </div>

                <!-- Pending Fees Card -->
                <div class="boa-card boa-summary-card">
                    <div class="boa-card-icon boa-color-orange">
                        <i class="fas fa-clock boa-text-white"></i>
                    </div>
                    <div class="boa-summary-number" style="color: #f59e0b;">
                        <?php echo format_currency($data['pending_fees_amount']); ?>
                    </div>
                    <div class="boa-summary-label">Pending Fees</div>
                    <div class="boa-growth-indicator" style="color: #f59e0b; background: rgba(245, 158, 11, 0.1);">
                        <span>!</span>
                        <span><?php echo number_format($data['pending_fees_count']); ?> invoices</span>
                    </div>
                </div>
            </div>

            <!-- Main Dashboard Grid -->
            <div class="boa-dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));">
                <!-- Admissions by Course Chart -->
                <div class="boa-card">
                    <div class="boa-card-header">
                        <h3 class="boa-card-title">
                            <i class="fas fa-chart-bar" style="margin-right: 8px; color: #3b82f6;"></i>
                            Admissions by Course
                        </h3>
                    </div>
                    <div class="boa-chart-container">
                        <canvas id="boaAdmissionsChart"></canvas>
                    </div>
                </div>

                <!-- Total Fees Collected -->
                <div class="boa-card">
                    <div class="boa-card-header">
                        <h3 class="boa-card-title">
                            <i class="fas fa-money-bill-wave" style="margin-right: 8px; color: #22c55e;"></i>
                            Total Fees Collected
                        </h3>
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="font-size: 36px; font-weight: 700; color: #22c55e;">
                            <?php 
                            $total_fees_collected = array_sum($data['course_income']['data']);
                            echo format_currency($total_fees_collected); 
                            ?>
                        </div>
                        <div class="boa-growth-indicator" style="color: #22c55e; background: rgba(34, 197, 94, 0.1); margin: 15px auto; width: fit-content;">
                            <span><?php echo get_growth_icon(12.5); ?></span>
                            <span>+12.5% vs last year</span>
                        </div>
                        <div class="boa-quick-actions">
                            <a href="<?php echo admin_url('admin.php?page=boa-fees'); ?>" class="boa-action-btn boa-btn-secondary">View Details</a>
                            <a href="<?php echo admin_url('admin.php?page=boa-reports'); ?>" class="boa-action-btn boa-btn-primary">Export Report</a>
                        </div>
                    </div>
                </div>

                <!-- Pending Fees List -->
                <div class="boa-card">
                    <div class="boa-card-header">
                        <h3 class="boa-card-title">
                            <i class="fas fa-file-invoice" style="margin-right: 8px; color: #f59e0b;"></i>
                            Pending Fees
                        </h3>
                        <a href="<?php echo admin_url('admin.php?page=boa-fees&status=pending'); ?>" class="boa-action-btn boa-btn-secondary" style="padding: 4px 12px; font-size: 12px;">View All</a>
                    </div>
                    <div style="max-height: 300px; overflow-y: auto;">
                        <?php if (!empty($data['recent_activity'])): ?>
                            <?php foreach (array_slice($data['recent_activity'], 0, 5) as $activity): ?>
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                                    <div>
                                        <div style="font-weight: 600; color: var(--boa-gray-900);"><?php echo esc_html($activity['name']); ?></div>
                                        <div style="font-size: 12px; color: var(--boa-gray-500);"><?php echo esc_html($activity['course_name']); ?></div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-weight: 600; color: #f59e0b;"><?php echo format_currency(rand(5000, 25000)); ?></div>
                                        <div class="boa-status-badge boa-status-pending">Pending</div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <div style="text-align: center; color: var(--boa-gray-500); padding: 40px 0;">
                                <i class="fas fa-check-circle" style="font-size: 48px; color: #22c55e; margin-bottom: 15px;"></i>
                                <p>All fees are up to date!</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Monthly Revenue Chart -->
                <div class="boa-card boa-full-width">
                    <div class="boa-card-header">
                        <h3 class="boa-card-title">
                            <i class="fas fa-chart-line" style="margin-right: 8px; color: #3b82f6;"></i>
                            Monthly Revenue Trend
                        </h3>
                    </div>
                    <div class="boa-chart-container" style="height: 350px;">
                        <canvas id="boaRevenueChart"></canvas>
                    </div>
                </div>

                <!-- Course Income Comparison -->
                <div class="boa-card boa-full-width">
                    <div class="boa-card-header">
                        <h3 class="boa-card-title">
                            <i class="fas fa-chart-pie" style="margin-right: 8px; color: #8b5cf6;"></i>
                            Total Fee Received by Course
                        </h3>
                    </div>
                    <div class="boa-chart-container" style="height: 350px;">
                        <canvas id="boaCourseIncomeChart"></canvas>
                    </div>
                </div>

                <!-- Upcoming Courses -->
                <div class="boa-card">
                    <div class="boa-card-header">
                        <h3 class="boa-card-title">
                            <i class="fas fa-calendar" style="margin-right: 8px; color: #14b8a6;"></i>
                            Upcoming Courses
                        </h3>
                    </div>
                    <div style="max-height: 300px; overflow-y: auto;">
                        <?php 
                        $upcoming_courses = isset( $data['upcoming_courses'] ) ? $data['upcoming_courses'] : array();
                        if ( ! empty( $upcoming_courses ) ) :
                            foreach ( $upcoming_courses as $course ) :
                                $start_label = ! empty( $course['start_date'] ) ? date_i18n( 'M j, Y', strtotime( $course['start_date'] ) ) : 'Date TBA';
                                $duration    = ! empty( $course['duration'] ) ? esc_html( $course['duration'] ) : '';
                                $fee_label   = isset( $course['fee_amount'] ) ? format_currency( $course['fee_amount'] ) : '';
                                ?>
                                <div style="display: flex; align-items: center; gap: 15px; padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                                    <div style="width: 40px; height: 40px; background: #14b8a6; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-calendar boa-text-white"></i>
                                    </div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600; color: var(--boa-gray-900);"><?php echo esc_html( $course['course_name'] ?? 'Untitled Course' ); ?></div>
                                        <div style="font-size: 14px; color: var(--boa-gray-500);">
                                            Starts: <?php echo esc_html( $start_label ); ?>
                                            <?php if ( $duration ) : ?>
                                                <span style="margin-left: 8px; color: #94a3b8;">| Duration: <?php echo $duration; ?></span>
                                            <?php endif; ?>
                                            <?php if ( $fee_label ) : ?>
                                                <span style="margin-left: 8px; color: #94a3b8;">| Fee: <?php echo esc_html( $fee_label ); ?></span>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php else : ?>
                            <div style="text-align: center; color: var(--boa-gray-500); padding: 32px 0;">
                                <i class="fas fa-check-circle" style="font-size: 42px; color: #22c55e; margin-bottom: 12px;"></i>
                                <p>No upcoming courses scheduled.</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="boa-card">
                    <div class="boa-card-header">
                        <h3 class="boa-card-title">
                            <i class="fas fa-history" style="margin-right: 8px; color: #6366f1;"></i>
                            Recent Activity
                        </h3>
                    </div>
                    <div style="max-height: 300px; overflow-y: auto;">
                        <?php if (!empty($data['recent_activity'])): ?>
                            <?php foreach (array_slice($data['recent_activity'], 0, 8) as $activity): ?>
                                <div style="display: flex; align-items: center; gap: 15px; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                                    <div style="width: 32px; height: 32px; background: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-user-plus boa-text-white" style="font-size: 12px;"></i>
                                    </div>
                                    <div style="flex: 1;">
                                        <div style="font-size: 14px; color: var(--boa-gray-900);">
                                            <strong><?php echo esc_html($activity['name']); ?></strong> enrolled in 
                                            <strong><?php echo esc_html($activity['course_name']); ?></strong>
                                        </div>
                                        <div style="font-size: 12px; color: var(--boa-gray-500);">
                                            <?php echo date('M j, Y', strtotime($activity['created_at'])); ?>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <div style="text-align: center; color: var(--boa-gray-500); padding: 40px 0;">
                                <i class="fas fa-info-circle" style="font-size: 48px; color: #6366f1; margin-bottom: 15px;"></i>
                                <p>No recent activity</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </main>
<?php else : ?>
<?php
    $boa_page_files = array(
        'boa-admission-reviews' => 'page-admission-reviews/page-admission-reviews.php',
        'boa-courses' => 'page-courses/page-courses.php',
        'boa-course-materials' => 'page-course-materials/page-course-materials.php',
        'boa-quizzes' => 'page-quizzes/page-quizzes.php',
        'boa-assignments' => 'page-assignments/page-assignments.php',
        'boa-attendance' => 'page-attendance/page-attendance.php',
        'boa-students' => 'page-students/page-students.php',
        'boa-fees' => 'page-fees/page-fees.php',
        'boa-transactions' => 'page-transactions/page-transactions.php',
        'boa-live-sessions' => 'page-live-sessions/page-live-sessions.php',
        'boa-expenses' => 'page-expenses/page-expenses.php',
        'boa-reports' => 'page-reports/page-reports.php',
        'boa-notices' => 'page-notice-board/page-notice-board.php',
        'boa-settings' => 'page-settings/page-settings.php',
    );

    $boa_target = isset( $boa_page_files[ $boa_current_page ] ) ? BOA_PLUGIN_DIR . $boa_page_files[ $boa_current_page ] : '';

    if ( $boa_target && file_exists( $boa_target ) ) {
        include $boa_target;
    } else {
        echo '<div class="boa-card"><p style="margin:0;">Page not available.</p></div>';
    }
?>
        </main>
<?php endif; ?>
    </div>

    <!-- External Libraries -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Dashboard JavaScript -->
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Admissions by Course Chart
        const admissionsCtx = document.getElementById('boaAdmissionsChart');
        if (admissionsCtx) {
            new Chart(admissionsCtx, {
                type: 'bar',
                data: {
                    labels: <?php echo json_encode(!empty($data['course_admissions']) ? array_column($data['course_admissions'], 'course_name') : ['Web Development', 'Data Science', 'Mobile App Dev', 'Digital Marketing']); ?>,
                    datasets: [{
                        label: 'Admissions',
                        data: <?php echo json_encode(!empty($data['course_admissions']) ? array_column($data['course_admissions'], 'student_count') : [120, 95, 85, 110]); ?>,
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(236, 72, 153, 0.8)'
                        ],
                        borderColor: [
                            'rgba(59, 130, 246, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(245, 158, 11, 1)',
                            'rgba(139, 92, 246, 1)',
                            'rgba(236, 72, 153, 1)'
                        ],
                        borderWidth: 2,
                        borderRadius: 8,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: false
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Monthly Revenue Chart
        const revenueCtx = document.getElementById('boaRevenueChart');
        if (revenueCtx) {
            new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: <?php echo json_encode($data['monthly_income']['labels']); ?>,
                    datasets: [{
                        label: 'Revenue',
                        data: <?php echo json_encode($data['monthly_income']['data']); ?>,
                        borderColor: 'rgba(59, 130, 246, 1)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: true,
                                color: 'rgba(0,0,0,0.05)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return 'PKR ' + (value/1000).toFixed(0) + 'K';
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Course Income Chart
        const courseIncomeCtx = document.getElementById('boaCourseIncomeChart');
        if (courseIncomeCtx) {
            new Chart(courseIncomeCtx, {
                type: 'doughnut',
                data: {
                    labels: <?php echo json_encode($data['course_income']['labels']); ?>,
                    datasets: [{
                        data: <?php echo json_encode($data['course_income']['data']); ?>,
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(236, 72, 153, 0.8)'
                        ],
                        borderColor: [
                            'rgba(59, 130, 246, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(245, 158, 11, 1)',
                            'rgba(139, 92, 246, 1)',
                            'rgba(236, 72, 153, 1)'
                        ],
                        borderWidth: 2,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                            }
                        }
                    }
                }
            });
        }

        // Add interactive functionality
        const summaryCards = document.querySelectorAll('.boa-summary-card');
        summaryCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Mobile responsive sidebar toggle
        function toggleSidebar() {
            const sidebar = document.querySelector('.boa-sidebar');
            if (window.innerWidth <= 1200) {
                sidebar.style.transform = sidebar.style.transform === 'translateX(0px)' ? 'translateX(-100%)' : 'translateX(0px)';
            }
        }

        // Add mobile toggle button for small screens
        if (window.innerWidth <= 1200) {
            const topBar = document.querySelector('.boa-top-bar');
            const toggleBtn = document.createElement('button');
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            toggleBtn.className = 'boa-action-btn boa-btn-secondary';
            toggleBtn.onclick = toggleSidebar;
            topBar.appendChild(toggleBtn);
        }
    });
    </script>
</div>
