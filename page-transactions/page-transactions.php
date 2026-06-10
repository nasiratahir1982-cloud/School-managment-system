<?php
/**
 * Admin Page: Payment Transactions
 */
if ( ! defined( 'ABSPATH' ) ) exit;
?>

<div id="boa-transactions-root" class="boa-admin-wrap boa-transactions-page">
    <div class="boa-transactions-hero boa-card">
        <div class="boa-hero-left">
            <div class="boa-hero-kicker"><?php esc_html_e( 'Finance Command Center', 'baba-online-academy' ); ?></div>
            <div class="boa-hero-title">
                <h1><?php esc_html_e( 'Payment Transactions', 'baba-online-academy' ); ?></h1>
                <span class="boa-hero-chip"><?php esc_html_e( 'Live overview', 'baba-online-academy' ); ?></span>
            </div>
            <p class="boa-hero-lead"><?php esc_html_e( 'Keep JazzCash, EasyPaisa, and Stripe attempts organized with a clean, auditable ledger.', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-pills">
                <span class="boa-pill boa-pill-gateway"><span class="dashicons dashicons-microphone"></span> JazzCash</span>
                <span class="boa-pill boa-pill-gateway"><span class="dashicons dashicons-chart-pie"></span> EasyPaisa</span>
                <span class="boa-pill boa-pill-gateway"><span class="dashicons dashicons-cloud"></span> Stripe</span>
                <span class="boa-pill boa-pill-soft"><span class="dashicons dashicons-visibility"></span> <?php esc_html_e( 'Audit ready', 'baba-online-academy' ); ?></span>
            </div>
        </div>
        <div class="boa-hero-right">
            <div class="boa-hero-card">
                <div class="boa-hero-note">
                    <span class="dashicons dashicons-shield-alt"></span>
                    <?php esc_html_e( 'Securely logs every payment attempt with status highlights.', 'baba-online-academy' ); ?>
                </div>
                <button class="boa-btn boa-btn-primary" id="boa-refresh-transactions">
                    <span class="dashicons dashicons-update"></span>
                    <?php esc_html_e( 'Refresh ledger', 'baba-online-academy' ); ?>
                </button>
                <p class="boa-hero-sub"><?php esc_html_e( 'Tip: Refresh before reconciling to pull the latest events.', 'baba-online-academy' ); ?></p>
            </div>
        </div>
    </div>

    <div class="boa-card boa-filters-card">
        <div class="boa-card-header">
            <div>
                <p class="boa-card-kicker"><?php esc_html_e( 'Smart filters', 'baba-online-academy' ); ?></p>
                <h3><?php esc_html_e( 'Zero in on the payments you need', 'baba-online-academy' ); ?></h3>
            </div>
            <div class="boa-soft-pill">
                <span class="dashicons dashicons-filter"></span>
                <?php esc_html_e( 'Combine filters for crisp results', 'baba-online-academy' ); ?>
            </div>
        </div>
        <div class="boa-card-content">
            <div class="boa-filter-grid">
                <div class="boa-form-group">
                    <label for="boa-transaction-gateway"><?php esc_html_e( 'Gateway', 'baba-online-academy' ); ?></label>
                    <div class="boa-input-shell">
                        <span class="dashicons dashicons-admin-site"></span>
                        <select id="boa-transaction-gateway" class="boa-form-select">
                            <option value=""><?php esc_html_e( 'All', 'baba-online-academy' ); ?></option>
                            <option value="jazzcash">JazzCash</option>
                            <option value="easypaisa">EasyPaisa</option>
                            <option value="stripe">Stripe</option>
                        </select>
                    </div>
                </div>
                <div class="boa-form-group">
                    <label for="boa-transaction-status"><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></label>
                    <div class="boa-input-shell">
                        <span class="dashicons dashicons-yes"></span>
                        <select id="boa-transaction-status" class="boa-form-select">
                            <option value=""><?php esc_html_e( 'All', 'baba-online-academy' ); ?></option>
                            <option value="initiated"><?php esc_html_e( 'Initiated', 'baba-online-academy' ); ?></option>
                            <option value="completed"><?php esc_html_e( 'Completed', 'baba-online-academy' ); ?></option>
                            <option value="failed"><?php esc_html_e( 'Failed', 'baba-online-academy' ); ?></option>
                        </select>
                    </div>
                </div>
                <div class="boa-form-group">
                    <label for="boa-transaction-search"><?php esc_html_e( 'Search', 'baba-online-academy' ); ?></label>
                    <div class="boa-input-shell">
                        <span class="dashicons dashicons-search"></span>
                        <input type="text" id="boa-transaction-search" class="boa-form-input" placeholder="<?php esc_attr_e( 'Invoice, student, reference...', 'baba-online-academy' ); ?>">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-card boa-table-card">
        <div class="boa-card-header">
            <div>
                <p class="boa-card-kicker"><?php esc_html_e( 'Timeline', 'baba-online-academy' ); ?></p>
                <h3><?php esc_html_e( 'Recent Transactions', 'baba-online-academy' ); ?></h3>
            </div>
            <div class="boa-status-legend">
                <span class="boa-status-chip boa-status-chip-completed"><?php esc_html_e( 'Completed', 'baba-online-academy' ); ?></span>
                <span class="boa-status-chip boa-status-chip-initiated"><?php esc_html_e( 'Initiated', 'baba-online-academy' ); ?></span>
                <span class="boa-status-chip boa-status-chip-failed"><?php esc_html_e( 'Failed', 'baba-online-academy' ); ?></span>
            </div>
        </div>
        <div class="boa-card-content">
            <div class="boa-table-wrapper">
                <table class="boa-data-table boa-transactions-table">
                    <thead>
                        <tr>
                            <th><?php esc_html_e( 'Reference', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Gateway', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Invoice', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Student', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Amount', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Date', 'baba-online-academy' ); ?></th>
                        </tr>
                    </thead>
                    <tbody id="boa-transactions-tbody">
                        <tr>
                            <td colspan="7"><?php esc_html_e( 'Loading transactions...', 'baba-online-academy' ); ?></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="boa-pagination" id="boa-transactions-pagination"></div>
        </div>
    </div>
</div>
