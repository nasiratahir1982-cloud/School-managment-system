<?php
/**
 * Assets Loader for Baba Online Academy
 */

if (!defined('ABSPATH')) exit;

class BOA_Assets {

    /**
     * Initialize asset system
     */
    public static function init() {

        // Admin side
        add_action('admin_enqueue_scripts', array(__CLASS__, 'admin_assets'));

        // Public side
        add_action('wp_enqueue_scripts', array(__CLASS__, 'public_assets'));

        // Shared styles for shortcodes
        add_action('wp_enqueue_scripts', array(__CLASS__, 'global_frontend_styles'));
    }

    // -------------------------------------------------------------
    // GLOBAL FRONTEND STYLES (for all shortcodes)
    // -------------------------------------------------------------
    public static function global_frontend_styles() {

        wp_enqueue_style(
            'boa-fonts',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            array(),
            BOA_VERSION
        );

        wp_enqueue_style(
            'boa-icons',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
            array(),
            '6.4.0'
        );

        // Global styling for error boxes, buttons, layout
        wp_enqueue_style(
            'boa-global-style',
            BOA_URL . 'assets/css/boa-global.css',
            array(),
            BOA_VERSION
        );
    }

    // -------------------------------------------------------------
    // ADMIN ASSETS (Dashboard + pages)
    // -------------------------------------------------------------
    public static function admin_assets($hook) {

        // Load only if the menu belongs to plugin
        if (strpos($hook, 'boa-') === false && strpos($hook, 'baba-online-academy') === false) {
            return;
        }

        // Main admin stylesheet
        wp_enqueue_style(
            'boa-admin',
            BOA_URL . 'assets/css/boa-admin.css',
            array(),
            BOA_VERSION
        );

        // Dashboard charts
        wp_enqueue_script(
            'chartjs',
            'https://cdn.jsdelivr.net/npm/chart.js',
            array(),
            '4.4.0',
            true
        );

        // Global admin script
        wp_enqueue_script(
            'boa-admin',
            BOA_URL . 'assets/js/boa-admin.js',
            array('jquery'),
            BOA_VERSION,
            true
        );

        wp_localize_script('boa-admin', 'boa_admin', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('boa_admin_nonce')
        ));
    }

    // -------------------------------------------------------------
    // PUBLIC ASSETS (Login form, student dashboard shortcodes)
    // -------------------------------------------------------------
    public static function public_assets() {

        // Common frontend stylesheet
        wp_enqueue_style(
            'boa-common',
            BOA_URL . 'assets/css/boa-common.css',
            array(),
            BOA_VERSION
        );

        wp_enqueue_script(
            'boa-common-js',
            BOA_URL . 'assets/js/boa-common.js',
            array('jquery'),
            BOA_VERSION,
            true
        );

        wp_localize_script('boa-common-js', 'boa_public', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('boa_public_nonce')
        ));
    }

    // -------------------------------------------------------------
    // PUBLIC: Admission Form Assets
    // -------------------------------------------------------------
    public static function enqueue_public_assets() {

        wp_enqueue_style(
            'boa-admission-form',
            BOA_URL . 'page-admission-form/page-admission-form.css',
            array('boa-common'),
            BOA_VERSION
        );

        wp_enqueue_script(
            'boa-admission-form-js',
            BOA_URL . 'page-admission-form/page-admission-form.js',
            array('jquery'),
            BOA_VERSION,
            true
        );
    }

    // -------------------------------------------------------------
    // PUBLIC: Application Status Assets
    // -------------------------------------------------------------
    public static function enqueue_status_assets() {

        wp_enqueue_style(
            'boa-status',
            BOA_URL . 'page-application-status/page-application-status.css',
            array('boa-common'),
            BOA_VERSION
        );

        wp_enqueue_script(
            'boa-status-js',
            BOA_URL . 'page-application-status/page-application-status.js',
            array('jquery'),
            BOA_VERSION,
            true
        );
    }

    // -------------------------------------------------------------
    // PUBLIC: Live Sessions Assets
    // -------------------------------------------------------------
    public static function enqueue_public_live_sessions_assets() {

        wp_enqueue_style(
            'boa-live-sessions-public',
            BOA_URL . 'page-live-sessions-public/page-live-sessions-public.css',
            array('boa-common'),
            BOA_VERSION
        );

        wp_enqueue_script(
            'boa-live-sessions-public-js',
            BOA_URL . 'page-live-sessions-public/page-live-sessions-public.js',
            array('jquery'),
            BOA_VERSION,
            true
        );
    }

    // -------------------------------------------------------------
    // FRONTEND DASHBOARD (Teacher/Staff)
    // -------------------------------------------------------------
    public static function enqueue_frontend_dashboard_assets() {

        wp_enqueue_style(
            'boa-dashboard',
            BOA_URL . 'page-dashboard/dashboard-modern.css',
            array('boa-common'),
            BOA_VERSION
        );

        wp_enqueue_script(
            'boa-dashboard-js',
            BOA_URL . 'page-dashboard/dashboard-modern.js',
            array('jquery'),
            BOA_VERSION,
            true
        );
    }
}
