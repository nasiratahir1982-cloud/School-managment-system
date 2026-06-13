<?php
/**
 * Public Shortcodes for Baba Online Academy (Headless Mode)
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class BOA_Shortcodes {

    /**
     * Initialize all shortcodes
     */
    public static function init() {
        add_shortcode( 'boa_admission_form',        array( __CLASS__, 'react_mount_point' ) );
        add_shortcode( 'boa_application_status',    array( __CLASS__, 'react_mount_point' ) );
        add_shortcode( 'boa_live_sessions',         array( __CLASS__, 'react_mount_point' ) );
        add_shortcode( 'boa_student_portal',        array( __CLASS__, 'react_mount_point' ) );
        add_shortcode( 'boa_verify_certificate',    array( __CLASS__, 'react_mount_point' ) );
        add_shortcode( 'boa_student_dashboard',     array( __CLASS__, 'react_mount_point' ) );
        add_shortcode( 'boa_dashboard',             array( __CLASS__, 'react_mount_point' ) );
    }

    /**
     * React Mount Point for Headless Frontend
     */
    public static function react_mount_point() {
        // Return a mount point so the external React app can attach to it if embedded
        return '<div class="boa-react-app-mount-point" data-headless="true">
            <p>Loading Modern Academic Hub UI...</p>
        </div>';
    }
}
