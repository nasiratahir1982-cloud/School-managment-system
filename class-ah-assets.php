<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * BABA Online Academy - Asset Management (Headless Mode)
 */
class BOA_Assets {

    public static function init() {
        add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_admin_assets' ) );
    }

    public static function enqueue_admin_assets( $hook ) {
        $page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';

        if ( $page !== 'baba-online-academy' ) {
            return;
        }

        // Common CSS & JS only for the Headless Gateway page
        wp_enqueue_style(
            'boa-common',
            BOA_PLUGIN_URL . 'ah-common.css',
            array(),
            BOA_VERSION
        );

        wp_enqueue_script(
            'boa-common',
            BOA_PLUGIN_URL . 'ah-common.js',
            array( 'jquery' ),
            BOA_VERSION,
            true
        );
    }

    public static function enqueue_public_assets() {
        // Obsolete in Headless Mode - React app handles public assets
    }

    public static function enqueue_public_live_sessions_assets() {
        // Obsolete in Headless Mode
    }
    
    public static function enqueue_status_assets() {
        // Obsolete in Headless Mode
    }
}
