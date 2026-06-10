<?php
// 🟢 یہاں سے Fees Management PHP شروع ہو رہا ہے
if (!defined('ABSPATH')) exit;

/**
 * Fees Management پیج - BSSMS Computer Courses Management System
 *
 * (2025 BABA ARCHITECT - REFACTOR 10)
 * - نیا "Partial Discount Modal" کا HTML اسٹرکچر شامل کیا گیا۔
 */

if ( ! function_exists( 'boa_fees_get_courses' ) ) {
    function boa_fees_get_courses() {
        $data = BOA_DB::get_courses(array('per_page' => 999));
        return $data['items'];
    }
}

if ( ! function_exists( 'boa_fees_get_students' ) ) {
    function boa_fees_get_students() {
        $data = BOA_DB::get_students(array('per_page' => 999, 'status' => 'active'));
        return $data['items'];
    }
}

$fee_stats = BOA_DB::get_fee_summary_stats();
?>

<style>
/* Inline facelift for Fees Management */
#boa-fees-root {background:radial-gradient(circle at 14% 18%,#e0f2fe 0,#f8fafc 36%),radial-gradient(circle at 78% 0,#eef2ff 0,#ffffff 38%),#f8fafc;padding:var(--boa-space-8);border-radius:18px;box-shadow:0 12px 30px rgba(15,23,42,.08);min-height:100vh;}
.boa-fees-hero{display:flex;gap:var(--boa-space-6);align-items:stretch;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;position:relative;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 12px 28px rgba(15,23,42,.12);overflow:hidden;margin-bottom:var(--boa-space-6);}
.boa-fees-hero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 70% 20%,rgba(255,255,255,.16),transparent 36%);pointer-events:none;}
.boa-hero-left,.boa-hero-right{position:relative;z-index:1;}
.boa-hero-left{flex:2;display:flex;flex-direction:column;gap:var(--boa-space-3);padding:var(--boa-space-5);}
.boa-hero-kicker{text-transform:uppercase;letter-spacing:.08em;font-size:.8rem;font-weight:800;margin:0;opacity:.92;}
.boa-hero-title{display:flex;align-items:center;gap:var(--boa-space-3);flex-wrap:wrap;}
.boa-hero-title h1{margin:0;font-size:2.5rem;font-weight:800;color:#fff;}
.boa-hero-chip{background:rgba(255,255,255,.16);padding:var(--boa-space-2) var(--boa-space-4);border-radius:999px;border:1px solid rgba(255,255,255,.26);font-weight:700;}
.boa-hero-lead{margin:0;font-size:1.05rem;color:rgba(255,255,255,.92);max-width:780px;}
.boa-hero-pills{display:flex;gap:var(--boa-space-3);flex-wrap:wrap;}
.boa-pill{display:inline-flex;align-items:center;gap:var(--boa-space-2);padding:var(--boa-space-2) var(--boa-space-4);border-radius:999px;font-weight:700;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(6px);}
.boa-hero-actions{display:flex;gap:var(--boa-space-3);flex-wrap:wrap;margin-top:var(--boa-space-2);}
.boa-hero-right{flex:1;display:flex;justify-content:flex-end;align-items:center;padding:var(--boa-space-5);}
.boa-hero-card{background:#fff;color:#0f172a;padding:var(--boa-space-5);border-radius:16px;box-shadow:0 16px 40px rgba(15,23,42,.2);display:flex;flex-direction:column;gap:var(--boa-space-3);min-width:280px;}
.boa-hero-note{display:flex;align-items:center;gap:var(--boa-space-2);font-weight:700;color:#2563eb;margin:0;}
.boa-hero-metrics{display:grid;grid-template-columns:1fr;gap:var(--boa-space-2);}
.boa-hero-metrics strong{display:block;font-size:1.2rem;color:#0f172a;}
.boa-page-header{display:none;}
@media(max-width:960px){.boa-fees-hero{flex-direction:column;}.boa-hero-right{justify-content:flex-start;}}
</style>

<div id="boa-fees-root">
    <div class="boa-fees-hero">
        <div class="boa-hero-left">
            <p class="boa-hero-kicker"><?php esc_html_e( 'Finance Desk', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-title">
                <h1><?php esc_html_e( 'Fees Management', 'baba-online-academy' ); ?></h1>
                <span class="boa-hero-chip"><?php esc_html_e( 'Collections & dues', 'baba-online-academy' ); ?></span>
            </div>
            <p class="boa-hero-lead"><?php esc_html_e( 'Handle collections, pending balances, and deadlines with a bold, organized workspace.', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-pills">
                <span class="boa-pill"><span class="dashicons dashicons-money"></span><?php esc_html_e( 'Collect', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-database"></span><?php esc_html_e( 'Import/Export', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-visibility"></span><?php esc_html_e( 'Audit ready', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-hero-actions">
                <button class="boa-btn boa-btn-primary" onclick="BOA_OpenCollectFeeModal()">
                    <span class="dashicons dashicons-money"></span>
                    <?php esc_html_e( 'Collect Fee', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_OpenImportModal()">
                    <span class="dashicons dashicons-upload"></span>
                    <?php esc_html_e( 'Import', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_ExportFees()">
                    <span class="dashicons dashicons-download"></span>
                    <?php esc_html_e( 'Export', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_GenerateDemoData()">
                    <span class="dashicons dashicons-database"></span>
                    <?php esc_html_e( 'Demo Data', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_ExportExcel()">
                    <span class="dashicons dashicons-media-spreadsheet"></span>
                    <?php esc_html_e( 'Excel Download', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_PrintFees()">
                    <span class="dashicons dashicons-printer"></span>
                    <?php esc_html_e( 'Print', 'baba-online-academy' ); ?>
                </button>
            </div>
        </div>
        <div class="boa-hero-right">
            <div class="boa-hero-card">
                <p class="boa-hero-note"><span class="dashicons dashicons-chart-pie"></span><?php esc_html_e( 'Fee pulse', 'baba-online-academy' ); ?></p>
                <div class="boa-hero-metrics">
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Pending amount', 'baba-online-academy' ); ?></span>
                        <strong><?php echo 'PKR ' . number_format( $fee_stats['pending_amount'] ?? 0 ); ?></strong>
                    </div>
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Pending count', 'baba-online-academy' ); ?></span>
                        <strong><?php echo number_format( $fee_stats['pending_count'] ?? 0 ); ?></strong>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-cards-grid boa-cards-grid-5">
        <div class="boa-card boa-stats-card">
            <div class="boa-card-header">
                <h3>Total Collected</h3>
                <span class="boa-card-icon dashicons dashicons-money-alt"></span>
            </div>
            <div class="boa-card-content">
                <div class="boa-stat-number" id="boa-total-collected"><?php echo boa_format_currency($fee_stats['total_collected']); ?></div>
                <div class="boa-stat-label">This month</div>
            </div>
        </div>

        <div class="boa-card boa-stats-card">
            <div class="boa-card-header">
                <h3>Pending Amount</h3>
                <span class="boa-card-icon dashicons dashicons-clock"></span>
            </div>
            <div class="boa-card-content">
                <div class="boa-stat-number" id="boa-pending-amount"><?php echo boa_format_currency($fee_stats['pending_amount']); ?></div>
                <div class="boa-stat-label">Still due</div>
                <span class="boa-badge boa-badge-warning">Attention</span>
            </div>
        </div>

        <div class="boa-card boa-stats-card boa-stats-card-discount">
            <div class="boa-card-header">
                <h3>Total Discounted</h3>
                <span class="boa-card-icon dashicons dashicons-cut"></span>
            </div>
            <div class="boa-card-content">
                <div class="boa-stat-number" id="boa-total-discounted"><?php echo boa_format_currency($fee_stats['total_discounted']); ?></div>
                <div class="boa-stat-label">All time discounts</div>
            </div>
        </div>

        <div class="boa-card boa-stats-card">
            <div class="boa-card-header">
                <h3>Overdue Fees</h3>
                <span class="boa-card-icon dashicons dashicons-warning"></span>
            </div>
            <div class="boa-card-content">
                <div class="boa-stat-number" id="boa-overdue-fees"><?php echo esc_html($fee_stats['overdue_fees']); ?></div>
                <div class="boa-stat-label">Require action</div>
                <span class="boa-badge boa-badge-error">Urgent</span>
            </div>
        </div>

        <div class="boa-card boa-stats-card">
            <div class="boa-card-header">
                <h3>Upcoming Deadlines</h3>
                <span class="boa-card-icon dashicons dashicons-calendar"></span>
            </div>
            <div class="boa-card-content">
                <div class="boa-stat-number" id="boa-upcoming-deadlines"><?php echo esc_html($fee_stats['upcoming_deadlines']); ?></div>
                <div class="boa-stat-label">Next 7 days</div>
            </div>
        </div>
    </div>


    <div class="boa-main-layout">
        <div class="boa-main-content">
            <div class="boa-bulk-actions-bar" id="boa-bulk-actions-bar" style="display: none;">
                <div class="boa-bulk-actions-content">
                    <span id="boa-selected-count">0 fee records selected</span>
                    <select id="boa-bulk-action" class="boa-bulk-select">
                        <option value="">Bulk Actions</option>
                        <option value="mark_paid">Mark as Paid</option>
                        <option value="mark_pending">Mark as Pending</option>
                        <option value="discount">Mark as Discounted</option>
                        <option value="delete">Delete</option>
                    </select>
                    <button class="boa-btn boa-btn-primary boa-btn-sm" onclick="BOA_ApplyBulkAction()">
                        Apply
                    </button>
                </div>
            </div>

            <div class="boa-table-controls">
                <div class="boa-search-box">
                    <input type="text" id="boa-fees-search" placeholder="Search by student, course, or invoice ID" class="boa-search-input">
                    <span class="dashicons dashicons-search"></span>
                </div>
                <select id="boa-course-filter" class="boa-filter-select">
                    <option value="">All Courses</option>
                    <?php 
                    foreach ( boa_fees_get_courses() as $course ): ?>
                        <option value="<?php echo esc_attr( $course['course_id'] ); ?>">
                            <?php echo esc_html( $course['course_name'] ); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <select id="boa-status-filter" class="boa-filter-select">
                    <option value="">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="discounted">Discounted</option>
                    <option value="pending_review">Pending Review</option>
                </select>
                <input type="date" id="boa-date-from" class="boa-date-input" placeholder="From Date">
                <input type="date" id="boa-date-to" class="boa-date-input" placeholder="To Date">
                <a href="#" class="boa-reset-link" onclick="BOA_ResetFilters()">Reset Filters</a>
                <div class="boa-mini-actions">
                    <button class="boa-btn boa-btn-outline boa-btn-sm" onclick="BOA_ExportExcel()">
                        Export Excel
                    </button>
                    <button class="boa-btn boa-btn-outline boa-btn-sm" onclick="BOA_PrintFees()">
                        Print
                    </button>
                </div>
            </div>

            <div class="boa-card boa-table-card">
                <div class="boa-card-header">
                    <h3>Fees Overview</h3>
                </div>
                <div class="boa-card-content">
                    <table class="boa-data-table" id="boa-fees-table">
                        <thead>
                            <tr>
                                <th width="30">
                                    <input type="checkbox" id="boa-select-all" onchange="BOA_ToggleSelectAll(this)">
                                </th>
                                <th>Student Name</th>
                                <th>Course</th>
                                <th>Due Date</th>
                                <th>Payment Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Receipt</th>
                                <th width="160">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="boa-fees-tbody">
                            </tbody>
                    </table>

                    <div class="boa-pagination">
                        <div class="boa-pagination-info">
                            Showing <span id="boa-showing-from">1</span>-<span id="boa-showing-to">10</span> 
                            of <span id="boa-total-records">0</span> fee records
                        </div>
                        <div class="boa-pagination-controls">
                            <select id="boa-rows-per-page" class="boa-rows-select" onchange="BOA_ChangeRowsPerPage(this.value)">
                                <option value="10">10 rows</option>
                                <option value="25">25 rows</option>
                                <option value="50">50 rows</option>
                                <option value="100">100 rows</option>
                            </select>
                            <div class="boa-page-numbers" id="boa-page-numbers">
                                </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="boa-card boa-tips-card">
                </div>
        </div>

        <div class="boa-sidebar">
            <div class="boa-card boa-deadlines-card">
                <div class="boa-card-header">
                    <h3>Upcoming Fee Deadlines</h3>
                </div>
                <div class="boa-card-content">
                    <div class="boa-deadlines-list" id="boa-upcoming-deadlines-list">
                        </div>
                </div>
            </div>

            <div class="boa-card boa-snapshot-card">
                <div class="boa-card-header">
                    <h3>Fee Status Snapshot</h3>
                </div>
                <div class="boa-card-content">
                    <div class="boa-chart-container">
                        <canvas id="boa-fees-chart" width="200" height="200"></canvas>
                    </div>
                    <div class="boa-snapshot-stats" id="boa-snapshot-stats">
                        </div>
                </div>
            </div>

            <div class="boa-card boa-today-card">
                <div class="boa-card-header">
                    <h3>Today's Collections</h3>
                </div>
                <div class="boa-card-content">
                    <div class="boa-today-list" id="boa-today-collections">
                        </div>
                </div>
            </div>

            <div class="boa-card boa-rules-card">
                </div>
        </div>
    </div>

    <div class="boa-footer">
        <p>BSSMS – Computer Courses Management System</p>
    </div>
</div>

<div id="boa-fee-modal" class="boa-modal">
    <div class="boa-modal-content">
        <div class="boa-modal-header">
            <h3 id="boa-modal-title">Collect Fee</h3>
            <button class="boa-close-btn" onclick="BOA_CloseFeeModal()">
                <span class="dashicons dashicons-no"></span>
            </button>
        </div>
        <div class="boa-modal-body">
            <form id="boa-fee-form" onsubmit="return BOA_SaveFee(event)">
                <div class="boa-form-row">
                    <div class="boa-form-group">
                        <label for="boa-fee-student">Student *</label>
                        <select id="boa-fee-student" name="student_id" required class="boa-form-select" onchange="BOA_OnStudentChange()">
                            <option value="">Select Student</option>
                            <?php 
                            foreach ( boa_fees_get_students() as $student ): ?>
                                <option value="<?php echo esc_attr( $student['student_id'] ); ?>" data-course="<?php echo esc_attr( $student['course_id'] ); ?>">
                                    <?php echo esc_html( $student['name'] . ' (' . $student['student_uid'] . ')' ); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-fee-course">Course</label>
                        <select id="boa-fee-course" name="course_id" class="boa-form-select">
                            <option value="">Select Course</option>
                            <?php 
                            foreach ( boa_fees_get_courses() as $course ): ?>
                                <option value="<?php echo esc_attr( $course['course_id'] ); ?>" data-fee="<?php echo esc_attr( $course['fee_amount'] ); ?>">
                                    <?php echo esc_html( $course['course_name'] ); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <div class="boa-form-row">
                    <div class="boa-form-group">
                        <label for="boa-amount-due">Amount Due</label>
                        <input type="number" id="boa-amount-due" name="amount_due" class="boa-form-input" placeholder="0.00" step="0.01" min="0">
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-amount-paid">Amount Paid *</label>
                        <input type="number" id="boa-amount-paid" name="amount_paid" required class="boa-form-input" placeholder="0.00" step="0.01" min="0">
                    </div>
                </div>

                <div class="boa-form-row">
                    <div class="boa-form-group">
                        <label for="boa-due-date">Due Date</label>
                        <input type="date" id="boa-due-date" name="due_date" class="boa-form-input">
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-payment-date">Payment Date *</label>
                        <input type="date" id="boa-payment-date" name="payment_date" required class="boa-form-input" value="<?php echo esc_attr( date('Y-m-d') ); ?>">
                    </div>
                </div>

                <div class="boa-form-row">
                    <div class="boa-form-group">
                        <label for="boa-fee-status">Status *</label>
                        <select id="boa-fee-status" name="status" required class="boa-form-select">
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                            <option value="discounted">Discounted</option>
                        </select>
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-invoice-id">Invoice ID</label>
                        <input type="text" id="boa-invoice-id" name="invoice_id" class="boa-form-input" readonly>
                        <small>Auto-generated on save</small>
                    </div>
                </div>

                <div class="boa-form-row">
                    <div class="boa-form-group boa-full-width">
                        <label>Receipt Upload</label>
                        <div class="boa-upload-area" id="boa-receipt-upload-area">
                            <span class="dashicons dashicons-upload"></span>
                            <p>Drop receipt file here or click to browse</p>
                            <p class="boa-upload-hint">Supports: JPG, PNG, PDF (Max: 5MB)</p>
                            <input type="file" id="boa-receipt-file" accept=".jpg,.jpeg,.png,.pdf" style="display: none;">
                        </div>
                        <div id="boa-receipt-preview" class="boa-receipt-preview" style="display: none;">
                            <div class="boa-receipt-thumbnail">
                                <span class="dashicons dashicons-media-document"></span>
                            </div>
                            <div class="boa-receipt-info">
                                <div class="boa-receipt-name" id="boa-receipt-name"></div>
                                <div class="boa-receipt-size" id="boa-receipt-size"></div>
                            </div>
                            <button type="button" class="boa-btn boa-btn-outline boa-btn-sm" onclick="BOA_RemoveReceipt()">Remove</button>
                        </div>
                        <input type="hidden" id="boa-receipt-url" name="receipt_url">
                    </div>
                </div>
                
                <input type="hidden" id="boa-fee-id" name="fee_id" value="0">
            </form>
        </div>
        <div class="boa-modal-footer">
            <button type="button" class="boa-btn boa-btn-secondary" onclick="BOA_CloseFeeModal()">Cancel</button>
            <button type="submit" form="boa-fee-form" class="boa-btn boa-btn-primary">Save Payment</button>
        </div>
    </div>
</div>

<div id="boa-receipt-modal" class="boa-modal">
    <div class="boa-modal-content boa-modal-large">
        <div class="boa-modal-header">
            <h3>Receipt Preview</h3>
            <button class="boa-close-btn" onclick="BOA_CloseReceiptModal()">
                <span class="dashicons dashicons-no"></span>
            </button>
        </div>
        <div class="boa-modal-body">
            <div class="boa-receipt-viewer" id="boa-receipt-viewer">
                </div>
        </div>
        <div class="boa-modal-footer">
            <button class="boa-btn boa-btn-secondary" onclick="BOA_DownloadReceipt()">
                <span class="dashicons dashicons-download"></span>
                Download
            </button>
            <button class="boa-btn boa-btn-primary" onclick="BOA_CloseReceiptModal()">Close</button>
        </div>
    </div>
</div>

<div id="boa-discount-modal" class="boa-modal">
    <div class="boa-modal-content">
        <div class="boa-modal-header">
            <h3 id="boa-discount-modal-title">Apply Partial Discount</h3>
            <button class="boa-close-btn" onclick="BOA_CloseDiscountModal()">
                <span class="dashicons dashicons-no"></span>
            </button>
        </div>
        <div class="boa-modal-body">
            <form id="boa-discount-form" onsubmit="return BOA_ConfirmPartialDiscount(event)">
                <div class="boa-form-group">
                    <label>Total Pending Amount</label>
                    <input type="text" id="boa-discount-total-pending" class="boa-form-input" readonly>
                </div>
                <div class="boa-form-group">
                    <label for="boa-discount-amount">Discount Amount *</label>
                    <input type="number" id="boa-discount-amount" name="discount_amount" required class="boa-form-input" 
                           placeholder="0.00" step="0.01" min="0">
                    <small>This amount will be marked as 'Discounted' and removed from pending fees.</small>
                </div>
                <div class="boa-form-group">
                    <label>Remaining Pending Amount</label>
                    <input type="text" id="boa-discount-remaining" class="boa-form-input" readonly>
                </div>
                
                <input type="hidden" id="boa-discount-fee-id" name="fee_id" value="0">
            </form>
        </div>
        <div class="boa-modal-footer">
            <button type="button" class="boa-btn boa-btn-secondary" onclick="BOA_CloseDiscountModal()">Cancel</button>
            <button type="submit" form="boa-discount-form" class="boa-btn boa-btn-primary">Apply Discount</button>
        </div>
    </div>
</div>
<template id="boa-fee-row-template">
    <tr class="boa-fee-row">
        <td><input type="checkbox" class="boa-fee-checkbox" onchange="BOA_UpdateBulkActions()"></td>
        <td class="boa-student-name"></td>
        <td class="boa-course-name"></td>
        <td class="boa-due-date"></td>
        <td class="boa-payment-date"></td>
        <td class="boa-amount"></td>
        <td><span class="boa-status-badge"></span></td>
        <td class="boa-receipt-cell">
            <span class="boa-receipt-status"></span>
        </td>
        <td>
            <div class="boa-action-buttons">
                <button class="boa-btn-icon boa-btn-discount" onclick="BOA_ApplyDiscount(this)" title="Apply Discount">
                    <span class="dashicons dashicons-cut"></span>
                </button>
                <button class="boa-btn-icon boa-btn-edit" onclick="BOA_EditFee(this)" title="Edit">
                    <span class="dashicons dashicons-edit"></span>
                </button>
                <button class="boa-btn-icon boa-btn-delete" onclick="BOA_DeleteFee(this)" title="Delete">
                    <span class="dashicons dashicons-trash"></span>
                </button>
            </div>
        </td>
    </tr>
</template>


<template id="boa-deadline-item-template">
    <div class="boa-deadline-item">
        <div class="boa-deadline-urgency"></div>
        <div class="boa-deadline-content">
            <div class="boa-deadline-student"></div>
            <div class="boa-deadline-course"></div>
            <div class="boa-deadline-details">
                <span class="boa-due-date"></span>
                <span class="boa-amount"></span>
            </div>
        </div>
        <div class="boa-deadline-status">
            <span class="boa-status-badge"></span>
        </div>
    </div>
</template>

<template id="boa-today-item-template">
    <div class="boa-today-item">
        <div class="boa-today-student"></div>
        <div class="boa-today-course"></div>
        <div class="boa-today-amount"></div>
        <div class="boa-today-time"></div>
    </div>
</template>

// ✅ Syntax verified block end
