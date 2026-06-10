<?php
/**
 * Plugin Name: Academic Hub
 * Description: Complete Students, Courses, Fees, Live Sessions & Dashboard Management System.
 * Version: 2.0.0
 * Author: Academic Hub
 * Text Domain: baba-online-academy
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// -------------------------------------------------------------
// CONSTANTS
// -------------------------------------------------------------
define( 'BOA_VERSION', '2.0.0' );
define( 'BOA_FILE', __FILE__ );
define( 'BOA_DIR', plugin_dir_path( __FILE__ ) );
define( 'BOA_URL', plugin_dir_url( __FILE__ ) );
define( 'BOA_PLUGIN_DIR', BOA_DIR );
define( 'BOA_PLUGIN_URL', BOA_URL );

// -------------------------------------------------------------
// AUTOLOAD CLEAN STRUCTURE
// -------------------------------------------------------------
$boa_classes = array(
    'class-ah-activator.php',
    'class-ah-db.php',
    'class-ah-assets.php',
    'class-ah-ajax.php',
    'class-ah-payments.php',
    'class-ah-notifications.php',
);

foreach ( $boa_classes as $file ) {
    // Check root directory first, then fallback to includes subfolder
    $path = BOA_DIR . $file;
    if ( ! file_exists( $path ) ) {
        $path = BOA_DIR . 'includes/' . $file;
    }
    if ( file_exists( $path ) ) {
        require_once $path;
    }
}

// -------------------------------------------------------------
// ACTIVATION / DEACTIVATION
// -------------------------------------------------------------
register_activation_hook( BOA_FILE, array( 'BOA_Activator', 'activate' ) );
register_deactivation_hook( BOA_FILE, array( 'BOA_Activator', 'deactivate' ) );

// -------------------------------------------------------------
// MAIN PLUGIN CLASS (CLEAN VERSION)
// -------------------------------------------------------------
class Baba_Online_Academy {

    public function __construct() {

        // Load Admin Menu
        add_action( 'admin_menu', array( $this, 'load_admin_menu' ) );

        // Load Shortcodes
        add_action( 'init', array( $this, 'load_shortcodes' ) );

        // Custom footer cleanup
        add_filter( 'admin_footer_text', array( $this, 'clean_footer' ) );
        add_filter( 'update_footer', array( $this, 'clean_version_footer' ), 11 );

        // Register CRON jobs
        add_action( 'init', array( $this, 'register_crons' ) );

        // Initialize Assets, Ajax, Payments
        if ( class_exists( 'BOA_Activator' ) ) {
            BOA_Activator::ensure_role_capabilities();
        }
        BOA_Assets::init();
        BOA_Ajax::init();
        BOA_Payments::init();
    }

    public function load_admin_menu() {
        $path = BOA_DIR . 'admin/class-admin-menu.php';
        if ( ! file_exists( $path ) ) {
            $path = BOA_DIR . 'academic-hub/admin/admin/class-admin-menu.php';
        }
        require_once $path;
        $menu = new BOA_Admin_Menu();
        $menu->register();
    }

    // ---------------------------------------------------------
    // SHORTCODES (Moved to clean file)
    // ---------------------------------------------------------
    public function load_shortcodes() {
        $path = BOA_DIR . 'public/class-shortcodes.php';
        if ( ! file_exists( $path ) ) {
            $path = BOA_DIR . 'academic-hub/public/class-shortcodes.php';
        }
        require_once $path;
        BOA_Shortcodes::init();
    }

    // ---------------------------------------------------------
    // CRON JOBS
    // ---------------------------------------------------------
    public function register_crons() {

        if ( ! wp_next_scheduled( 'boa_auto_complete_sessions' ) ) {
            wp_schedule_event( time(), 'hourly', 'boa_auto_complete_sessions' );
        }
        if ( ! wp_next_scheduled( 'boa_send_fee_reminders' ) ) {
            wp_schedule_event( time(), 'daily', 'boa_send_fee_reminders' );
        }

        add_action( 'boa_auto_complete_sessions', array( $this, 'auto_complete_sessions' ) );
        add_action( 'boa_send_fee_reminders', array( $this, 'send_fee_reminders' ) );
    }

    public function auto_complete_sessions() {
        BOA_DB::auto_complete_live_sessions();
    }

    public function send_fee_reminders() {

        if ( ! class_exists( 'BOA_Notifications' ) ) return;

        $overdue = BOA_DB::get_overdue_fees();
        if ( empty( $overdue ) ) return;

        foreach ( $overdue as $record ) {
            BOA_Notifications::send_fee_overdue_reminder( $record );
        }
    }

    // ---------------------------------------------------------
    // ADMIN FOOTER CLEANUP
    // ---------------------------------------------------------
    public function clean_footer( $footer ) {
        $screen = get_current_screen();
        if ( $screen && strpos( $screen->id, 'boa-' ) !== false ) {
            return '';
        }
        return $footer;
    }

    public function clean_version_footer( $footer ) {
        $screen = get_current_screen();
        if ( $screen && strpos( $screen->id, 'boa-' ) !== false ) {
            return '';
        }
        return $footer;
    }
}

// -------------------------------------------------------------
// INITIALIZE PLUGIN
// -------------------------------------------------------------
new Baba_Online_Academy();


// -------------------------------------------------------------
// CURRENCY HELPERS (KEPT SIMPLE)
// -------------------------------------------------------------
function boa_get_currency_symbol() {
    $settings = get_option( 'boa_settings', [] );
    $currency = $settings['currency'] ?? 'PKR';

    $symbols = [
        'USD' => '$',
        'EUR' => '€',
        'GBP' => '£',
        'PKR' => 'PKR',
        'AED' => 'AED',
    ];

    return $symbols[$currency] ?? $currency;
}

function boa_format_currency( $amount ) {
    $symbol = boa_get_currency_symbol();
    $formatted = number_format( (float) $amount, 2 );

    $after = ['PKR', 'AED'];
    $settings = get_option( 'boa_settings', [] );
    $currency = $settings['currency'] ?? 'PKR';

    return in_array( $currency, $after ) 
        ? "{$formatted} {$symbol}" 
        : "{$symbol}{$formatted}";
}

