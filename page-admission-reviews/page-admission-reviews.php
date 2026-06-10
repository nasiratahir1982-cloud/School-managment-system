<?php
if (!defined('ABSPATH')) exit;
?>

<style>
/* Inline facelift for Admission Reviews */
#boa-admin-reviews-root {
  background: radial-gradient(circle at 14% 18%, rgba(99, 102, 241, 0.15) 0%, var(--boa-gray-50) 50%), radial-gradient(circle at 78% 0%, rgba(139, 92, 246, 0.15) 0%, var(--boa-gray-50) 50%), var(--boa-gray-50);
  padding: var(--boa-space-8);
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  min-height: 100vh;
}
.boa-reviews-hero {
  display: flex;
  gap: var(--boa-space-6);
  align-items: stretch;
  background: linear-gradient(135deg, var(--boa-primary), var(--boa-primary-dark));
  color: #fff;
  position: relative;
  border-radius: 16px;
  border: 1px solid var(--boa-gray-200);
  box-shadow: 0 12px 28px rgba(0,0,0,0.3);
  overflow: hidden;
  margin-bottom: var(--boa-space-6);
}
.boa-reviews-hero:after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 70% 20%, rgba(255, 255, 255, 0.16), transparent 36%);
  pointer-events: none;
}
.boa-hero-left, .boa-hero-right {
  position: relative;
  z-index: 1;
}
.boa-hero-left {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: var(--boa-space-3);
  padding: var(--boa-space-5);
}
.boa-hero-kicker {
  text-transform: uppercase;
  letter-spacing: .08em;
  font-size: .8rem;
  font-weight: 800;
  margin: 0;
  opacity: .92;
}
.boa-hero-title {
  display: flex;
  align-items: center;
  gap: var(--boa-space-3);
  flex-wrap: wrap;
}
.boa-hero-title h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
}
.boa-hero-chip {
  background: rgba(255, 255, 255, 0.16);
  padding: var(--boa-space-2) var(--boa-space-4);
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.26);
  font-weight: 700;
}
.boa-hero-lead {
  margin: 0;
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.92);
  max-width: 780px;
}
.boa-hero-pills {
  display: flex;
  gap: var(--boa-space-3);
  flex-wrap: wrap;
}
.boa-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--boa-space-2);
  padding: var(--boa-space-2) var(--boa-space-4);
  border-radius: 999px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(6px);
  color: #fff;
}
.boa-hero-actions {
  display: flex;
  gap: var(--boa-space-3);
  flex-wrap: wrap;
  margin-top: var(--boa-space-2);
}
.boa-hero-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: var(--boa-space-5);
}
.boa-hero-card {
  background: var(--boa-gray-100);
  color: var(--boa-gray-800);
  padding: var(--boa-space-5);
  border-radius: 16px;
  box-shadow: var(--boa-shadow-lg);
  border: 1px solid var(--boa-gray-200);
  display: flex;
  flex-direction: column;
  gap: var(--boa-space-3);
  min-width: 260px;
}
.boa-hero-note {
  display: flex;
  align-items: center;
  gap: var(--boa-space-2);
  font-weight: 700;
  color: var(--boa-primary);
  margin: 0;
}
.boa-hero-metrics {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--boa-space-2);
}
.boa-hero-metrics strong {
  display: block;
  font-size: 1.1rem;
  color: var(--boa-gray-900);
}
.boa-page-header {
  display: none;
}
.boa-card {
  border: 1px solid var(--boa-gray-200);
  border-radius: 16px;
  box-shadow: var(--boa-shadow-md);
  background: var(--boa-gray-100);
}
.boa-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--boa-space-4) var(--boa-space-5) var(--boa-space-3);
  border-bottom: 1px solid var(--boa-gray-200);
}
.boa-card-kicker {
  text-transform: uppercase;
  letter-spacing: .08em;
  font-size: .75rem;
  color: var(--boa-primary);
  margin: 0 0 4px 0;
  font-weight: 800;
}
.boa-card-content {
  padding: var(--boa-space-4) var(--boa-space-5) var(--boa-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--boa-space-4);
}
.boa-table-wrapper {
  overflow-x: auto;
}
.boa-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: .9rem;
}
.boa-data-table th, .boa-data-table td {
  padding: 12px 14px;
  text-align: left;
  border-bottom: 1px solid var(--boa-gray-200);
  white-space: nowrap;
}
.boa-data-table th {
  background: rgba(15, 23, 42, 0.3);
  color: var(--boa-gray-500);
  text-transform: uppercase;
  letter-spacing: .02em;
  font-size: .8rem;
}
.boa-data-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}
.boa-table-actions {
  display: inline-flex;
  gap: var(--boa-space-2);
}
.boa-btn-icon {
  border: none;
  background: var(--boa-gray-100);
  border: 1px solid var(--boa-gray-300);
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  color: var(--boa-gray-800);
  transition: all .15s ease-in-out;
}
.boa-btn-icon:hover {
  border-color: var(--boa-primary);
  color: var(--boa-primary);
  box-shadow: 0 8px 18px rgba(99, 102, 245, .2);
}
.boa-btn-approve, .boa-btn-reject {
  border: none;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 700;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  color: #fff;
}
.boa-btn-approve {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 18px rgba(16, 185, 129, .2);
}
.boa-btn-reject {
  background: linear-gradient(135deg, #f43f5e, #e11d48);
  box-shadow: 0 8px 18px rgba(244, 63, 94, .2);
}
.boa-btn-secondary {
  background: var(--boa-gray-100);
  color: var(--boa-gray-800);
  border: 1px solid var(--boa-gray-300);
  border-radius: 10px;
  padding: 10px 12px;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
}
.boa-btn-secondary:hover {
  border-color: var(--boa-primary);
  color: var(--boa-primary);
  background: rgba(99, 102, 241, 0.05);
}
.boa-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--boa-space-3);
  flex-wrap: wrap;
  margin-top: var(--boa-space-3);
}
.boa-footer {
  text-align: center;
  margin-top: var(--boa-space-4);
  color: var(--boa-gray-500);
  font-weight: 600;
}
@media(max-width:960px) {
  .boa-reviews-hero {
    flex-direction: column;
  }
  .boa-hero-right {
    justify-content: flex-start;
  }
}
@media(max-width:720px) {
  .boa-data-table thead {
    display: none;
  }
  .boa-data-table tr {
    display: block;
    margin-bottom: 12px;
    border: 1px solid var(--boa-gray-200);
    border-radius: 10px;
    overflow: hidden;
  }
  .boa-data-table td {
    display: flex;
    justify-content: space-between;
    padding: 10px 12px;
  }
  .boa-data-table td:before {
    content: attr(data-label);
    font-weight: 700;
    color: var(--boa-gray-500);
    margin-right: 10px;
  }
}
</style>

<div id="boa-admin-reviews-root" class="boa-admin-wrap">
    <div class="boa-reviews-hero">
        <div class="boa-hero-left">
            <p class="boa-hero-kicker"><?php esc_html_e( 'Admissions Desk', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-title">
                <h1><?php esc_html_e( 'Admission Reviews', 'baba-online-academy' ); ?></h1>
                <span class="boa-hero-chip"><?php esc_html_e( 'Approve & verify', 'baba-online-academy' ); ?></span>
            </div>
            <p class="boa-hero-lead"><?php esc_html_e( 'Approve or reject new applications with quick access to payment receipts and statuses.', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-pills">
                <span class="boa-pill"><span class="dashicons dashicons-yes"></span><?php esc_html_e( 'Approve', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-no-alt"></span><?php esc_html_e( 'Reject', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-visibility"></span><?php esc_html_e( 'Receipt check', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-hero-actions">
                <button type="button" class="boa-btn boa-btn-approve" id="boa-bulk-approve" onclick="BOA_BulkApproveAdmissions()" disabled>
                    <span class="dashicons dashicons-yes"></span>
                    <?php esc_html_e( 'Approve Selected', 'baba-online-academy' ); ?>
                </button>
                <button type="button" class="boa-btn boa-btn-reject" id="boa-bulk-reject" onclick="BOA_BulkRejectAdmissions()" disabled>
                    <span class="dashicons dashicons-no-alt"></span>
                    <?php esc_html_e( 'Reject Selected', 'baba-online-academy' ); ?>
                </button>
                <button type="button" class="boa-btn boa-btn-secondary" onclick="BOA_RefreshList()">
                    <span class="dashicons dashicons-update"></span>
                    <?php esc_html_e( 'Refresh List', 'baba-online-academy' ); ?>
                </button>
            </div>
        </div>
        <div class="boa-hero-right">
            <div class="boa-hero-card">
                <p class="boa-hero-note"><span class="dashicons dashicons-chart-pie"></span><?php esc_html_e( 'Snapshot', 'baba-online-academy' ); ?></p>
                <div class="boa-hero-metrics">
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Bulk ready', 'baba-online-academy' ); ?></span>
                        <strong><?php esc_html_e( 'Approve / Reject', 'baba-online-academy' ); ?></strong>
                    </div>
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Receipts', 'baba-online-academy' ); ?></span>
                        <strong><?php esc_html_e( 'View & verify', 'baba-online-academy' ); ?></strong>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-card boa-table-card">
        <div class="boa-card-header">
            <div>
                <p class="boa-card-kicker"><?php esc_html_e( 'Queue', 'baba-online-academy' ); ?></p>
                <h3><?php esc_html_e( 'Pending Applications', 'baba-online-academy' ); ?></h3>
                <p class="boa-text-muted"><?php esc_html_e( 'These applications require manual verification of the payment screenshot.', 'baba-online-academy' ); ?></p>
            </div>
            <span class="boa-soft-pill"><span class="dashicons dashicons-filter"></span><?php esc_html_e( 'Select & act', 'baba-online-academy' ); ?></span>
        </div>
        <div class="boa-card-content">
            <div class="boa-table-wrapper">
                <table class="boa-data-table" id="boa-reviews-table">
                    <thead>
                        <tr>
                            <th width="40">
                                <input type="checkbox" id="boa-review-select-all">
                            </th>
                            <th><?php esc_html_e( 'Student Name', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Email / Phone', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Course', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Amount Paid', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Receipt', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Submitted On', 'baba-online-academy' ); ?></th>
                            <th width="180"><?php esc_html_e( 'Actions', 'baba-online-academy' ); ?></th>
                        </tr>
                    </thead>
                    <tbody id="boa-reviews-tbody"></tbody>
                </table>
            </div>

            <div class="boa-pagination">
                <div class="boa-pagination-info">
                    <?php esc_html_e( 'Showing', 'baba-online-academy' ); ?> <span id="boa-showing-from">1</span>-<span id="boa-showing-to">10</span>
                    <?php esc_html_e( 'of', 'baba-online-academy' ); ?> <span id="boa-total-records">0</span> <?php esc_html_e( 'pending applications', 'baba-online-academy' ); ?>
                </div>
                <div class="boa-pagination-controls">
                    <div class="boa-page-numbers" id="boa-page-numbers"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-footer">
        <p><?php esc_html_e( 'Academic Hub — Admission Review System', 'baba-online-academy' ); ?></p>
    </div>
</div>

<div id="boa-receipt-viewer-modal" class="boa-modal">
    <div class="boa-modal-content boa-modal-large">
        <div class="boa-modal-header">
            <h3><?php esc_html_e( 'Payment Receipt Viewer', 'baba-online-academy' ); ?></h3>
            <button class="boa-close-btn" onclick="BOA_CloseReceiptModal()">
                <span class="dashicons dashicons-no"></span>
            </button>
        </div>
        <div class="boa-modal-body">
            <div class="boa-receipt-viewer" id="boa-receipt-viewer">
                <p><?php esc_html_e( 'Loading receipt...', 'baba-online-academy' ); ?></p>
            </div>
            <div class="boa-receipt-thumbs" id="boa-receipt-thumb-list"></div>
        </div>
        <div class="boa-modal-footer">
            <button type="button" class="boa-btn boa-btn-secondary" onclick="BOA_CloseReceiptModal()"><?php esc_html_e( 'Close', 'baba-online-academy' ); ?></button>
        </div>
    </div>
</div>

<template id="boa-review-row-template">
    <tr class="boa-review-row">
        <td class="boa-checkbox-cell">
            <input type="checkbox" class="boa-review-checkbox">
        </td>
        <td class="boa-student-name"></td>
        <td class="boa-student-contact"></td>
        <td class="boa-course-name"></td>
        <td class="boa-amount-paid"></td>
        <td>
            <button class="boa-btn boa-btn-sm boa-btn-outline boa-view-receipt-btn" onclick="BOA_ViewReceipt(this)">
                <span class="dashicons dashicons-media-document"></span>
                <span class="boa-receipt-btn-text"><?php esc_html_e( 'View Receipt', 'baba-online-academy' ); ?></span>
            </button>
        </td>
        <td class="boa-submitted-date"></td>
        <td>
            <div class="boa-action-buttons">
                <button class="boa-btn boa-btn-sm boa-btn-approve" onclick="BOA_ApproveAdmission(this)" title="<?php esc_attr_e( 'Approve', 'baba-online-academy' ); ?>">
                    <span class="dashicons dashicons-yes"></span>
                    <?php esc_html_e( 'Approve', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-sm boa-btn-reject" onclick="BOA_RejectAdmission(this)" title="<?php esc_attr_e( 'Reject', 'baba-online-academy' ); ?>">
                    <span class="dashicons dashicons-no-alt"></span>
                    <?php esc_html_e( 'Reject', 'baba-online-academy' ); ?>
                </button>
            </div>
        </td>
    </tr>
</template>
