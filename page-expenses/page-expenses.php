<?php
/**
 * Admin Page: Expenses Management
 */
if ( ! defined( 'ABSPATH' ) ) exit;
?>

<div id="boa-admin-expenses-root" class="boa-admin-wrap boa-expenses-page">
    <div class="boa-expenses-hero boa-card">
        <div class="boa-hero-left">
            <p class="boa-hero-kicker"><?php esc_html_e( 'Operations Control', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-title">
                <h1><?php esc_html_e( 'Expenses Management', 'baba-online-academy' ); ?></h1>
                <span class="boa-hero-chip"><?php esc_html_e( 'Live ledger', 'baba-online-academy' ); ?></span>
            </div>
            <p class="boa-hero-lead"><?php esc_html_e( 'Track salaries, marketing, and utilities in one clean view, ready for approvals and audits.', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-pills">
                <span class="boa-pill"><span class="dashicons dashicons-chart-pie"></span><?php esc_html_e( 'Smart breakdowns', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-yes-alt"></span><?php esc_html_e( 'Audit ready', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-cloud"></span><?php esc_html_e( 'Cloud synced', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-hero-actions">
                <button class="boa-btn boa-btn-primary" id="boa-expenses-refresh">
                    <span class="dashicons dashicons-update"></span>
                    <?php esc_html_e( 'Refresh ledger', 'baba-online-academy' ); ?>
                </button>
                <a class="boa-btn boa-btn-secondary" href="#boa-add-expense-form"><?php esc_html_e( 'Add new expense', 'baba-online-academy' ); ?></a>
            </div>
        </div>
        <div class="boa-hero-right">
            <div class="boa-hero-card">
                <div class="boa-hero-note">
                    <span class="dashicons dashicons-shield-alt"></span>
                    <?php esc_html_e( 'Your expense trail stays consistent and reviewable.', 'baba-online-academy' ); ?>
                </div>
                <div class="boa-hero-metrics">
                    <div class="boa-metric">
                        <p><?php esc_html_e( 'Filtered total', 'baba-online-academy' ); ?></p>
                        <strong id="boa-exp-summary-total-hero">PKR 0.00</strong>
                    </div>
                    <div class="boa-metric">
                        <p><?php esc_html_e( 'This month', 'baba-online-academy' ); ?></p>
                        <strong id="boa-exp-summary-month-hero">PKR 0.00</strong>
                    </div>
                    <div class="boa-metric">
                        <p><?php esc_html_e( 'Change vs last month', 'baba-online-academy' ); ?></p>
                        <span class="boa-stat-chip" id="boa-exp-summary-delta-hero">0%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-main-layout">
        <div class="boa-main-content">
            <div class="boa-expense-grid-container">
                <div class="boa-card">
                    <div class="boa-card-header">
                        <div>
                            <p class="boa-card-kicker"><?php esc_html_e( 'Snapshot', 'baba-online-academy' ); ?></p>
                            <h3><?php esc_html_e( 'Expense Overview', 'baba-online-academy' ); ?></h3>
                        </div>
                        <span class="boa-soft-pill"><span class="dashicons dashicons-visibility"></span><?php esc_html_e( 'Live', 'baba-online-academy' ); ?></span>
                    </div>
                    <div class="boa-card-content">
                        <div class="boa-stats-grid">
                            <div class="boa-stat-card">
                                <p><?php esc_html_e( 'Total Expenses', 'baba-online-academy' ); ?></p>
                                <h2 id="boa-exp-summary-total"><?php esc_html_e( 'PKR 0.00', 'baba-online-academy' ); ?></h2>
                                <span class="boa-muted"><?php esc_html_e( 'Filtered records', 'baba-online-academy' ); ?></span>
                            </div>
                            <div class="boa-stat-card">
                                <p><?php esc_html_e( 'Current Month', 'baba-online-academy' ); ?></p>
                                <h3 id="boa-exp-summary-month"><?php esc_html_e( 'PKR 0.00', 'baba-online-academy' ); ?></h3>
                                <span class="boa-muted"><?php esc_html_e( 'This month', 'baba-online-academy' ); ?></span>
                            </div>
                            <div class="boa-stat-card">
                                <p><?php esc_html_e( 'Previous Month', 'baba-online-academy' ); ?></p>
                                <h3 id="boa-exp-summary-prev"><?php esc_html_e( 'PKR 0.00', 'baba-online-academy' ); ?></h3>
                                <span class="boa-muted"><?php esc_html_e( 'Change', 'baba-online-academy' ); ?> <span class="boa-stat-chip" id="boa-exp-summary-delta"><?php esc_html_e( '0%', 'baba-online-academy' ); ?></span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="boa-card">
                    <div class="boa-card-header">
                        <div>
                            <p class="boa-card-kicker"><?php esc_html_e( 'Focus', 'baba-online-academy' ); ?></p>
                            <h3><?php esc_html_e( 'Top Categories', 'baba-online-academy' ); ?></h3>
                        </div>
                        <span class="boa-soft-pill"><span class="dashicons dashicons-chart-area"></span><?php esc_html_e( 'Share', 'baba-online-academy' ); ?></span>
                    </div>
                    <div class="boa-card-content">
                        <ul id="boa-expense-top-categories" class="boa-simple-list">
                            <li><?php esc_html_e( 'Loading categories...', 'baba-online-academy' ); ?></li>
                        </ul>
                    </div>
                </div>

                <div class="boa-card">
                    <div class="boa-card-header">
                        <div>
                            <p class="boa-card-kicker"><?php esc_html_e( 'Quick entry', 'baba-online-academy' ); ?></p>
                            <h3><?php esc_html_e( 'Add New Expense', 'baba-online-academy' ); ?></h3>
                        </div>
                        <span class="boa-soft-pill"><span class="dashicons dashicons-plus-alt2"></span><?php esc_html_e( 'New', 'baba-online-academy' ); ?></span>
                    </div>
                    <div class="boa-card-content">
                        <form id="boa-add-expense-form" onsubmit="return addExpense()">
                            <div class="boa-form-row-inline">
                                <div class="boa-form-group">
                                    <label for="boa-expense-title"><?php esc_html_e( 'Title *', 'baba-online-academy' ); ?></label>
                                    <input type="text" id="boa-expense-title" required>
                                </div>
                                <div class="boa-form-group">
                                    <label for="boa-expense-amount"><?php esc_html_e( 'Amount *', 'baba-online-academy' ); ?></label>
                                    <input type="number" id="boa-expense-amount" required step="0.01" min="0">
                                </div>
                            </div>
                            <div class="boa-form-row">
                                <div class="boa-form-group">
                                    <label for="boa-expense-category"><?php esc_html_e( 'Category', 'baba-online-academy' ); ?></label>
                                    <input type="text" id="boa-expense-category" placeholder="<?php esc_attr_e( 'e.g., Salary, Marketing, Rent', 'baba-online-academy' ); ?>">
                                </div>
                                <div class="boa-form-group">
                                    <label for="boa-expense-date"><?php esc_html_e( 'Date *', 'baba-online-academy' ); ?></label>
                                    <input type="date" id="boa-expense-date" required value="<?php echo date( 'Y-m-d' ); ?>">
                                </div>
                            </div>
                            <div class="boa-form-row">
                                <div class="boa-form-group">
                                    <label for="boa-expense-notes"><?php esc_html_e( 'Notes', 'baba-online-academy' ); ?></label>
                                    <textarea id="boa-expense-notes" placeholder="<?php esc_attr_e( 'Optional details for reconciliation', 'baba-online-academy' ); ?>"></textarea>
                                </div>
                            </div>
                            <div class="boa-form-row">
                                <button type="submit" class="boa-btn boa-btn-primary">
                                    <span class="dashicons dashicons-yes"></span>
                                    <?php esc_html_e( 'Add Expense', 'baba-online-academy' ); ?>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="boa-card">
                    <div class="boa-card-header">
                        <div>
                            <p class="boa-card-kicker"><?php esc_html_e( 'Ledger', 'baba-online-academy' ); ?></p>
                            <h3><?php esc_html_e( 'Expenses List', 'baba-online-academy' ); ?></h3>
                        </div>
                        <span class="boa-soft-pill"><span class="dashicons dashicons-list-view"></span><?php esc_html_e( 'History', 'baba-online-academy' ); ?></span>
                    </div>
                    <div class="boa-card-content">
                        <div class="boa-table-wrapper">
                            <table class="boa-data-table boa-expenses-table">
                                <thead>
                                    <tr>
                                        <th><?php esc_html_e( 'Title', 'baba-online-academy' ); ?></th>
                                        <th><?php esc_html_e( 'Category', 'baba-online-academy' ); ?></th>
                                        <th><?php esc_html_e( 'Amount', 'baba-online-academy' ); ?></th>
                                        <th><?php esc_html_e( 'Date', 'baba-online-academy' ); ?></th>
                                        <th><?php esc_html_e( 'Actions', 'baba-online-academy' ); ?></th>
                                    </tr>
                                </thead>
                                <tbody id="boa-expenses-tbody">
                                    <tr><td colspan="5"><?php esc_html_e( 'Loading expenses...', 'baba-online-academy' ); ?></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
