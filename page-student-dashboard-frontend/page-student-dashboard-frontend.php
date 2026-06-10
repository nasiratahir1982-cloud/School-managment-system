<?php
/**
 * Frontend Student Dashboard - Modern Design
 * Accessible via shortcode [boa_student_dashboard]
 * 
 * Features:
 * - Modern responsive design
 * - Student-specific data
 * - Interactive charts
 * - Mobile-friendly
 */

if (!defined('ABSPATH')) exit;

// Get current logged in student
$current_user = wp_get_current_user();
if (!$current_user->exists()) {
    echo '<div class="boa-error">Please log in to access your dashboard.</div>';
    return;
}

// Get student data from database
global $wpdb;
$student_table = $wpdb->prefix . 'boa_students';
$enrollments_table = $wpdb->prefix . 'boa_student_course_enrollments';
$fee_table = $wpdb->prefix . 'boa_fees';

// Check if tables exist
$tables_exist = $wpdb->get_var("SHOW TABLES LIKE '$student_table'") == $student_table;

if (!$tables_exist) {
    // If tables don't exist, show a friendly message
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Setup Required - Academic Hub</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Inter', sans-serif;
                background: radial-gradient(circle at top right, #1e1b4b, #0f172a);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
                overflow: hidden;
            }
            .setup-container {
                background: rgba(30, 41, 59, 0.7);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 24px;
                padding: 48px 40px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 50px rgba(237, 137, 54, 0.1);
                max-width: 500px;
                width: 90%;
                text-align: center;
                animation: cardEntry 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            @keyframes cardEntry {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .icon {
                font-size: 3.5rem;
                background: linear-gradient(135deg, #f59e0b, #fbbf24);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 24px;
                animation: spinIcon 4s infinite linear;
            }
            @keyframes spinIcon {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .title {
                font-family: 'Outfit', sans-serif;
                font-size: 1.75rem;
                font-weight: 700;
                color: #f8fafc;
                margin: 0 0 16px 0;
            }
            .message {
                color: #94a3b8;
                font-size: 0.95rem;
                line-height: 1.6;
                margin-bottom: 36px;
            }
            .admin-link {
                background: linear-gradient(135deg, #6366f1, #4f46e5);
                color: white;
                padding: 14px 32px;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                font-size: 1rem;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            }
            .admin-link:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(99, 102, 241, 0.45);
                background: linear-gradient(135deg, #818cf8, #6366f1);
            }
        </style>
    </head>
    <body>
        <div class="setup-container">
            <div class="icon">
                <i class="fas fa-cog"></i>
            </div>
            <h1 class="title">Setup Required</h1>
            <p class="message">
                The Academic Hub system is not fully set up yet. Please activate the Academic Hub plugin from your WordPress admin panel to initialize the database tables and complete the setup.
            </p>
            <a href="<?php echo admin_url('plugins.php'); ?>" class="admin-link">
                <i class="fas fa-plug"></i> Activate Plugin
            </a>
        </div>
    </body>
    </html>
    <?php
    return;
}

// Get student record
$student = $wpdb->get_row($wpdb->prepare(
    "SELECT * FROM $student_table WHERE user_id = %d",
    $current_user->ID
));

if (!$student) {
    echo '<div class="boa-error">Student record not found. Please contact administration.</div>';
    return;
}

// Get student enrollments
$enrollments = $wpdb->get_results($wpdb->prepare(
    "SELECT e.*, c.course_name, c.course_duration, c.fee_structure 
     FROM $enrollments_table e 
     JOIN {$wpdb->prefix}boa_courses c ON e.course_id = c.id 
     WHERE e.student_id = %d 
     ORDER BY e.enrollment_date DESC",
    $student->id
));

// Get student fees
$fees = $wpdb->get_results($wpdb->prepare(
    "SELECT * FROM $fee_table 
     WHERE student_id = %d 
     ORDER BY due_date DESC 
     LIMIT 10",
    $student->id
));

// Calculate dashboard stats
$total_courses = count($enrollments);
$completed_courses = 0;
$in_progress_courses = 0;
$total_fees_paid = 0;
$pending_fees = 0;

foreach ($enrollments as $enrollment) {
    if ($enrollment->status == 'completed') {
        $completed_courses++;
    } elseif ($enrollment->status == 'active') {
        $in_progress_courses++;
    }
}

foreach ($fees as $fee) {
    if ($fee->payment_status == 'paid') {
        $total_fees_paid += $fee->amount_paid;
    } else {
        $pending_fees += $fee->amount;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - Academic Hub</title>
    
    <!-- External Dependencies -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <style>
        /* Premium Dark Mode Student Dashboard Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: radial-gradient(circle at top right, #1e1b4b, #0f172a);
            min-height: 100vh;
            color: #f1f5f9;
        }

        .dashboard-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .dashboard-header {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            padding: 36px 40px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .student-info {
            display: flex;
            align-items: center;
            gap: 24px;
        }

        .student-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2.25rem;
            font-weight: 700;
            font-family: 'Outfit', sans-serif;
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
        }

        .student-details h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 2.25rem;
            font-weight: 700;
            background: linear-gradient(135deg, #f8fafc, #cbd5e1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 6px;
        }

        .student-details p {
            color: #94a3b8;
            font-size: 1.05rem;
            font-weight: 500;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(99, 102, 241, 0.15);
            border-color: rgba(99, 102, 241, 0.4);
        }

        .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
            margin-bottom: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .stat-icon.blue { background: linear-gradient(135deg, #6366f1, #4f46e5); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }
        .stat-icon.green { background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
        .stat-icon.purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); }
        .stat-icon.orange { background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); }

        .stat-value {
            font-family: 'Outfit', sans-serif;
            font-size: 2.25rem;
            font-weight: 700;
            color: #f8fafc;
            margin-bottom: 6px;
        }

        .stat-label {
            color: #94a3b8;
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }

        .content-card {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 28px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .content-card h2 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.5rem;
            font-weight: 600;
            color: #f8fafc;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .content-card h2 i {
            color: #818cf8;
        }

        .course-list, .fee-list {
            list-style: none;
        }

        .course-item, .fee-item {
            padding: 18px 20px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            margin-bottom: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .course-item:hover, .fee-item:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(99, 102, 241, 0.3);
            transform: translateX(6px);
        }

        .course-name {
            font-family: 'Outfit', sans-serif;
            font-weight: 600;
            font-size: 1.1rem;
            color: #f8fafc;
            margin-bottom: 6px;
        }

        .course-meta, .fee-details {
            font-size: 0.9rem;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .status-badge, .payment-status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        .status-badge.active, .payment-status.paid {
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-badge.completed {
            background: rgba(99, 102, 241, 0.15);
            color: #818cf8;
            border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .payment-status.pending {
            background: rgba(244, 63, 94, 0.15);
            color: #fb7185;
            border: 1px solid rgba(244, 63, 94, 0.2);
        }

        .fee-amount {
            font-family: 'Outfit', sans-serif;
            font-weight: 600;
            font-size: 1.1rem;
            color: #f8fafc;
            margin-bottom: 4px;
        }

        .fee-date {
            font-size: 0.85rem;
            color: #94a3b8;
        }

        .charts-container {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 28px;
            margin-bottom: 30px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .chart-title {
            font-family: 'Outfit', sans-serif;
            font-size: 1.5rem;
            font-weight: 600;
            color: #f8fafc;
            margin-bottom: 24px;
            text-align: center;
        }

        .chart-wrapper {
            position: relative;
            height: 300px;
            margin: 20px 0;
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: #94a3b8;
        }

        .empty-state i {
            font-size: 3rem;
            margin-bottom: 16px;
            opacity: 0.5;
            color: #818cf8;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .dashboard-container {
                padding: 15px;
            }

            .student-info {
                flex-direction: column;
                text-align: center;
                gap: 16px;
            }

            .stats-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }

            .content-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .student-details h1 {
                font-size: 1.75rem;
            }

            .stat-card {
                padding: 20px;
            }
        }

        /* Loading Animation */
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .loading {
            animation: pulse 2s infinite;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Header Section -->
        <div class="dashboard-header">
            <div class="student-info">
                <div class="student-avatar">
                    <?php echo strtoupper(substr($current_user->display_name, 0, 1)); ?>
                </div>
                <div class="student-details">
                    <h1>Welcome, <?php echo esc_html($current_user->display_name); ?></h1>
                    <p>Student ID: <?php echo esc_html($student->student_id); ?></p>
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-book"></i>
                </div>
                <div class="stat-value"><?php echo $total_courses; ?></div>
                <div class="stat-label">Total Courses</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon green">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-value"><?php echo $completed_courses; ?></div>
                <div class="stat-label">Completed</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon purple">
                    <i class="fas fa-play-circle"></i>
                </div>
                <div class="stat-value"><?php echo $in_progress_courses; ?></div>
                <div class="stat-label">In Progress</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon orange">
                    <i class="fas fa-rupee-sign"></i>
                </div>
                <div class="stat-value">PKR <?php echo number_format($pending_fees); ?></div>
                <div class="stat-label">Pending Fees</div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-container">
            <h2 class="chart-title">Your Learning Progress</h2>
            <div class="chart-wrapper">
                <canvas id="progressChart"></canvas>
            </div>
        </div>

        <!-- Content Grid -->
        <div class="content-grid">
            <!-- My Courses -->
            <div class="content-card">
                <h2><i class="fas fa-graduation-cap"></i> My Courses</h2>
                <?php if ($enrollments): ?>
                    <ul class="course-list">
                        <?php foreach (array_slice($enrollments, 0, 5) as $enrollment): ?>
                            <li class="course-item">
                                <div class="course-name"><?php echo esc_html($enrollment->course_name); ?></div>
                                <div class="course-meta">
                                    <span><?php echo esc_html($enrollment->course_duration); ?> months</span>
                                    <span class="status-badge <?php echo $enrollment->status; ?>">
                                        <?php echo ucfirst($enrollment->status); ?>
                                    </span>
                                </div>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php else: ?>
                    <div class="empty-state">
                        <i class="fas fa-book-open"></i>
                        <p>No courses enrolled yet</p>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Recent Fees -->
            <div class="content-card">
                <h2><i class="fas fa-receipt"></i> Recent Fees</h2>
                <?php if ($fees): ?>
                    <ul class="fee-list">
                        <?php foreach (array_slice($fees, 0, 5) as $fee): ?>
                            <li class="fee-item">
                                <div class="fee-details">
                                    <div>
                                        <div class="fee-amount">PKR <?php echo number_format($fee->amount); ?></div>
                                        <div class="fee-date">Due: <?php echo date('M d, Y', strtotime($fee->due_date)); ?></div>
                                    </div>
                                    <span class="payment-status <?php echo $fee->payment_status; ?>">
                                        <?php echo ucfirst($fee->payment_status); ?>
                                    </span>
                                </div>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php else: ?>
                    <div class="empty-state">
                        <i class="fas fa-receipt"></i>
                        <p>No fee records found</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <script>
        // Modern Student Dashboard JavaScript
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize Progress Chart
            const ctx = document.getElementById('progressChart').getContext('2d');
            
            const progressData = {
                labels: ['Completed', 'In Progress', 'Not Started'],
                datasets: [{
                    data: [<?php echo $completed_courses; ?>, <?php echo $in_progress_courses; ?>, <?php echo max(0, $total_courses - $completed_courses - $in_progress_courses); ?>],
                    backgroundColor: [
                        'rgba(72, 187, 120, 0.8)',
                        'rgba(159, 122, 234, 0.8)',
                        'rgba(237, 137, 54, 0.8)'
                    ],
                    borderColor: [
                        'rgba(72, 187, 120, 1)',
                        'rgba(159, 122, 234, 1)',
                        'rgba(237, 137, 54, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            };

            const progressChart = new Chart(ctx, {
                type: 'doughnut',
                data: progressData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                font: {
                                    family: 'Inter',
                                    size: 14
                                }
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 2000
                    }
                }
            });

            // Add smooth scrolling animation
            const cards = document.querySelectorAll('.stat-card, .content-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });

            // Update time
            function updateTime() {
                const now = new Date();
                const timeString = now.toLocaleTimeString();
                // You can add a time display element if needed
            }
            
            updateTime();
            setInterval(updateTime, 1000);
        });
    </script>
</body>
</html>