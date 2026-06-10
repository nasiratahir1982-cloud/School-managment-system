<?php
/**
 * Student Login Form
 */
if ( ! defined( 'ABSPATH' ) ) exit;

// اگر کوئی لاگ ان کی خرابی ہو تو اسے دکھائیں
if ( isset( $_GET['login'] ) && $_GET['login'] == 'failed' ) {
    echo '<div class="boa-error">Login failed. Please check your username and password.</div>';
}
?>

<div class="boa-student-login-container">
    <h2>Student Portal Login</h2>
    <p>Please enter your credentials to access your dashboard.</p>
    <?php
    wp_login_form( array(
        'redirect' => get_permalink(), // لاگ ان کے بعد اسی صفحے پر واپس بھیجیں
        'label_username' => __( 'Email or Username' ),
        'label_password' => __( 'Password' ),
        'label_remember' => __( 'Remember Me' ),
        'label_log_in' => __( 'Log In' ),
        'remember' => true
    ) );
    ?>
    <a href="<?php echo wp_lostpassword_url(); ?>">Lost your password?</a>
</div>
