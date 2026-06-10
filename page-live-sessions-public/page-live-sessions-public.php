<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

BOA_Assets::enqueue_public_live_sessions_assets();
?>

<div id="boa-public-sessions" class="boa-public-sessions-wrapper">
    <div class="boa-public-sessions-card">
        <div class="boa-public-header">
            <div>
                <h3><?php esc_html_e( 'Upcoming Live Sessions', 'baba-online-academy' ); ?></h3>
                <p><?php esc_html_e( 'اپنے کورسز کے لائیو کلاسز میں شامل ہونے کیلئے نیچے سے سیشن منتخب کریں۔', 'baba-online-academy' ); ?></p>
            </div>
            <div class="boa-public-session-filters">
                <input type="text" id="boa-public-name" placeholder="<?php esc_attr_e( 'Your Name *', 'baba-online-academy' ); ?>">
                <input type="email" id="boa-public-email" placeholder="<?php esc_attr_e( 'Email', 'baba-online-academy' ); ?>">
                <input type="text" id="boa-public-phone" placeholder="<?php esc_attr_e( 'Phone', 'baba-online-academy' ); ?>">
            </div>
        </div>

        <div id="boa-public-session-list" class="boa-public-session-list">
            <p><?php esc_html_e( 'Fetching sessions…', 'baba-online-academy' ); ?></p>
        </div>
    </div>
</div>
