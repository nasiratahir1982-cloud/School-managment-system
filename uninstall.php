<?php
/**
 * Uninstall Baba Online Academy
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

global $wpdb;

// Remove plugin options
delete_option( 'boa_settings' );
delete_option( 'boa_categories' );

// Drop custom tables created by the plugin
$tables = array(
    'boa_categories',
    'boa_courses',
    'boa_students',
    'boa_fees',
    'boa_form_submissions',
    'boa_fee_receipts',
    'boa_live_sessions',
    'boa_live_attendance',
    'boa_daily_attendance',
);

foreach ( $tables as $table ) {
    $wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}{$table}" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
}
