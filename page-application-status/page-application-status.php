<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

BOA_Assets::enqueue_status_assets();
?>

<div id="boa-status-check-root" class="boa-status-wrapper">
    <div class="boa-status-card">
        <div class="boa-status-header">
            <h3><?php esc_html_e( 'Check Application Status', 'baba-online-academy' ); ?></h3>
            <p><?php esc_html_e( 'Enter your tracking code with the email or phone you used during submission.', 'baba-online-academy' ); ?></p>
        </div>

        <form id="boa-status-form" class="boa-status-form">
            <div class="boa-form-row">
                <div class="boa-form-group">
                    <label for="boa-status-token"><?php esc_html_e( 'Tracking Code *', 'baba-online-academy' ); ?></label>
                    <input type="text" id="boa-status-token" name="tracking_token" required placeholder="<?php esc_attr_e( 'e.g., ABC12345', 'baba-online-academy' ); ?>">
                </div>
                <div class="boa-form-group">
                    <label for="boa-status-email"><?php esc_html_e( 'Email Address', 'baba-online-academy' ); ?></label>
                    <input type="email" id="boa-status-email" name="email" placeholder="<?php esc_attr_e( 'john@example.com', 'baba-online-academy' ); ?>">
                    <small><?php esc_html_e( 'Provide email or phone used during submission.', 'baba-online-academy' ); ?></small>
                </div>
                <div class="boa-form-group">
                    <label for="boa-status-phone"><?php esc_html_e( 'Phone Number', 'baba-online-academy' ); ?></label>
                    <input type="text" id="boa-status-phone" name="phone" placeholder="<?php esc_attr_e( '+92 300 1234567', 'baba-online-academy' ); ?>">
                </div>
            </div>

            <div class="boa-status-actions">
                <button type="submit" class="boa-btn-primary"><?php esc_html_e( 'Check Status', 'baba-online-academy' ); ?></button>
                <div id="boa-status-loader" class="boa-status-loader" style="display:none;"></div>
            </div>
        </form>

        <div id="boa-status-message" class="boa-status-message" style="display:none;"></div>

        <div id="boa-status-result" class="boa-status-result" style="display:none;">
            <div class="boa-status-result-header">
                <h4><?php esc_html_e( 'Application Details', 'baba-online-academy' ); ?></h4>
                <span class="boa-status-pill" id="boa-status-label"></span>
            </div>
            <div class="boa-status-grid">
                <div>
                    <span><?php esc_html_e( 'Tracking Code', 'baba-online-academy' ); ?></span>
                    <strong id="boa-status-tracking"></strong>
                </div>
                <div>
                    <span><?php esc_html_e( 'Course', 'baba-online-academy' ); ?></span>
                    <strong id="boa-status-course"></strong>
                </div>
                <div>
                    <span><?php esc_html_e( 'Submitted On', 'baba-online-academy' ); ?></span>
                    <strong id="boa-status-submitted"></strong>
                </div>
                <div>
                    <span><?php esc_html_e( 'Last Updated', 'baba-online-academy' ); ?></span>
                    <strong id="boa-status-updated"></strong>
                </div>
            </div>

            <div id="boa-status-notes" class="boa-status-notes" style="display:none;">
                <h5><?php esc_html_e( 'Notes', 'baba-online-academy' ); ?></h5>
                <p></p>
            </div>

            <div id="boa-status-timeline" class="boa-status-timeline"></div>
        </div>
    </div>
</div>
