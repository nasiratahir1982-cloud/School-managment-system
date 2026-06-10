<?php
/**
 * Student Dashboard Page Template
 * 
 * This template creates a dedicated page for the student dashboard
 * Usage: Create a new page and select this template
 * 
 * Template Name: Student Dashboard
 */

// Security check
if (!defined('ABSPATH')) exit;

// Get current user
$current_user = wp_get_current_user();

// If not logged in, show login message
if (!$current_user->exists()) {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Login - Academic Hub</title>
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
            .login-container {
                background: rgba(30, 41, 59, 0.7);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 24px;
                padding: 48px 40px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 50px rgba(99, 102, 241, 0.1);
                max-width: 400px;
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
            .logo {
                font-family: 'Outfit', sans-serif;
                font-size: 2.25rem;
                font-weight: 700;
                background: linear-gradient(135deg, #a78bfa, #818cf8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
            }
            .logo i {
                background: linear-gradient(135deg, #a78bfa, #818cf8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .subtitle {
                color: #94a3b8;
                font-size: 0.95rem;
                margin-bottom: 36px;
                line-height: 1.5;
            }
            .login-form {
                margin-bottom: 10px;
            }
            .login-button {
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
            .login-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(99, 102, 241, 0.45);
                background: linear-gradient(135deg, #818cf8, #6366f1);
            }
            .login-button:active {
                transform: translateY(0);
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="logo">
                <i class="fas fa-graduation-cap"></i>
                Academic Hub
            </div>
            <p class="subtitle">Please log in to access your student dashboard portal</p>
            <div class="login-form">
                <a href="<?php echo wp_login_url(get_permalink()); ?>" class="login-button">
                    <i class="fas fa-sign-in-alt"></i> Login to Portal
                </a>
            </div>
        </div>
    </body>
    </html>
    <?php
    return;
}

// If logged in but not student, show access denied
$user_roles = $current_user->roles;
$is_student = in_array('student', $user_roles) || in_array('administrator', $user_roles);

if (!$is_student) {
    ?>
    <!DOCTYPE html>
    <title>Access Denied - Academic Hub</title>
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
            .access-container {
                background: rgba(30, 41, 59, 0.7);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 24px;
                padding: 48px 40px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 50px rgba(244, 63, 94, 0.1);
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
                background: linear-gradient(135deg, #f43f5e, #fb7185);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 24px;
                animation: pulseIcon 2s infinite ease-in-out;
            }
            @keyframes pulseIcon {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
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
            .back-button {
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
            .back-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(99, 102, 241, 0.45);
                background: linear-gradient(135deg, #818cf8, #6366f1);
            }
        </style>
    </head>
    <body>
        <div class="access-container">
            <div class="icon">
                <i class="fas fa-user-shield"></i>
            </div>
            <h1 class="title">Access Denied</h1>
            <p class="message">You don't have permission to access the student dashboard. This area is reserved for enrolled students only.</p>
            <a href="<?php echo home_url(); ?>" class="back-button">
                <i class="fas fa-home"></i> Back to Home
            </a>
        </div>
    </body>
    </html>
    <?php
    return;
}

// If student, show the dashboard
$dashboard_file = BOA_PLUGIN_DIR . 'page-student-dashboard-frontend/page-student-dashboard-frontend.php';

if (file_exists($dashboard_file)) {
    include $dashboard_file;
} else {
    echo '<div class="error">Dashboard file not found.</div>';
}
?>