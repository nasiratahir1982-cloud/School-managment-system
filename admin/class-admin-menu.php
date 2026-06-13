<?php
/**
 * Admin Menu Loader for Baba Online Academy (Headless Mode)
 */

if ( ! defined( 'ABSPATH' ) ) exit;

class BOA_Admin_Menu {

    private $cap_portal = 'boa_access_portal';
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
        
        // Removed all submenus as the UI is now managed by the React frontend.
    }

    /**
     * Loads the Gateway Template
     */
    public function load_page() {
        echo '<div class="wrap" style="text-align: center; margin-top: 50px;">';
        echo '<h1>Academic Hub Headless Gateway</h1>';
        echo '<p style="font-size: 16px; color: #555;">The frontend UI components have been migrated to the dedicated React Application.</p>';
        echo '<p style="font-size: 16px; color: #555;">This WordPress plugin now serves purely as a headless API backend for your school management system.</p>';
        echo '<div style="margin-top: 30px;">';
        echo '<a href="' . site_url('/frontend') . '" target="_blank" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Go to Modern React Frontend</a>';
        echo '</div>';
        echo '</div>';
    }
}
