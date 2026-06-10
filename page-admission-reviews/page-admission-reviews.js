// 🟢 یہاں سے Admission Reviews JavaScript شروع ہو رہا ہے
(function($) {
    'use strict';

    /**
     * BSSMS Admission Reviews - JavaScript functionality
     * نئی داخلہ درخواستوں کو منظور (Approve) یا مسترد (Reject) کرتا ہے۔
     */

    // سیف ڈیفالٹ
    if (typeof window.boa_admin_review_data === 'undefined') {
        console.warn('boa_admin_review_data is not defined, using safe defaults.');
        window.boa_admin_review_data = {
            ajax_url: (typeof ajaxurl !== 'undefined') ? ajaxurl : '',
            nonce: ''
        };
    }

    class BOA_Admin_Reviews {
        constructor() {
            this.currentPage = 1;
            this.perPage = 10;
            this.totalRecords = 0;
            this.currency = window.boa_admin_review_data?.currency || 'PKR'; // Currency symbol
            this.bulkProcessing = false;

            this.init();
        }

        init() {
            this.cacheBulkElements();
            this.bindBulkEvents();
            this.resetSelection();
            this.loadAdmissions();
            console.log('BSSMS Admission Reviews initialized');
        }

        cacheBulkElements() {
            this.selectAllCheckbox = $('#boa-review-select-all');
            this.bulkApproveBtn = $('#boa-bulk-approve');
            this.bulkRejectBtn = $('#boa-bulk-reject');
        }

        bindBulkEvents() {
            const self = this;

            $('#boa-reviews-tbody').on('change', '.boa-review-checkbox', function() {
                self.handleRowSelection();
            });

            if (this.selectAllCheckbox && this.selectAllCheckbox.length) {
                this.selectAllCheckbox.on('change', function() {
                    const isChecked = $(this).is(':checked');
                    self.toggleSelectAll(isChecked);
                });
            }
        }

        handleRowSelection() {
            const total = $('#boa-reviews-tbody .boa-review-checkbox').length;
            const checked = $('#boa-reviews-tbody .boa-review-checkbox:checked').length;

            if (this.selectAllCheckbox && this.selectAllCheckbox.length) {
                this.selectAllCheckbox.prop('checked', total > 0 && checked > 0 && checked === total);
            }

            this.updateBulkButtons();
        }

        toggleSelectAll(isChecked) {
            $('#boa-reviews-tbody .boa-review-checkbox').prop('checked', isChecked);
            this.updateBulkButtons();
        }

        resetSelection() {
            if (this.selectAllCheckbox && this.selectAllCheckbox.length) {
                this.selectAllCheckbox.prop('checked', false);
            }
            $('#boa-reviews-tbody .boa-review-checkbox').prop('checked', false);
            this.updateBulkButtons();
        }

        updateBulkButtons() {
            if (this.bulkProcessing) return;

            const hasSelection = this.getSelectedRows().length > 0;
            if (this.bulkApproveBtn && this.bulkApproveBtn.length) {
                this.bulkApproveBtn.prop('disabled', !hasSelection);
            }
            if (this.bulkRejectBtn && this.bulkRejectBtn.length) {
                this.bulkRejectBtn.prop('disabled', !hasSelection);
            }
        }

        getSelectedRows() {
            const selected = [];
            $('#boa-reviews-tbody .boa-review-checkbox:checked').each(function() {
                const row = $(this).closest('.boa-review-row');
                const feeId = $(row).data('fee-id');
                const studentId = $(row).data('student-id');
                if (feeId && studentId) {
                    selected.push({
                        fee_id: feeId,
                        student_id: studentId
                    });
                }
            });
            return selected;
        }

        bulkApproveSelected() {
            this.submitBulkAction('approve');
        }

        bulkRejectSelected() {
            this.submitBulkAction('reject');
        }

        submitBulkAction(action) {
            const items = this.getSelectedRows();
            if (items.length === 0) {
                this.showError('Please select at least one application.');
                return;
            }

            const confirmMessage = action === 'approve'
                ? 'Are you sure you want to approve all selected applications?'
                : 'Are you sure you want to reject all selected applications? This will delete the selected students and fee records.';

            if (!confirm(confirmMessage)) {
                return;
            }

            const ajaxAction = action === 'approve' ? 'boa_bulk_approve_admissions' : 'boa_bulk_reject_admissions';
            this.setBulkActionProcessing(true);

            $.ajax({
                url: window.boa_admin_review_data.ajax_url,
                type: 'POST',
                data: {
                    action: ajaxAction,
                    nonce: window.boa_admin_review_data.nonce,
                    items: JSON.stringify(items)
                },
                success: (response) => {
                    if (response.success) {
                        this.showSuccess(response.data.message || 'Bulk action completed.');
                        this.loadAdmissions();
                    } else {
                        this.showError(response.data.message || 'Bulk action failed.');
                    }
                },
                error: () => {
                    this.showError('Network error while processing bulk action');
                },
                complete: () => {
                    this.setBulkActionProcessing(false);
                }
            });
        }

        setBulkActionProcessing(isProcessing) {
            this.bulkProcessing = isProcessing;
            if (this.bulkApproveBtn && this.bulkApproveBtn.length) {
                this.bulkApproveBtn.toggleClass('boa-btn-loading', isProcessing);
                this.bulkApproveBtn.prop('disabled', true);
            }
            if (this.bulkRejectBtn && this.bulkRejectBtn.length) {
                this.bulkRejectBtn.toggleClass('boa-btn-loading', isProcessing);
                this.bulkRejectBtn.prop('disabled', true);
            }
            if (!isProcessing) {
                this.updateBulkButtons();
            }
        }

        // === داخلے لوڈ کریں ===
        loadAdmissions() {
            const self = this;
            
            $.ajax({
                url: window.boa_admin_review_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_get_pending_admissions',
                    nonce: window.boa_admin_review_data.nonce,
                    page: this.currentPage,
                    per_page: this.perPage
                },
                beforeSend: function() {
                    $('#boa-reviews-tbody').html('<tr><td colspan="8" class="boa-loading-cell">Loading pending applications...</td></tr>');
                },
                success: function(response) {
                    if (response.success) {
                        self.renderTable(response.data);
                        self.updatePagination(response.data);
                    } else {
                        $('#boa-reviews-tbody').html('<tr><td colspan="8" class="boa-no-data">No pending applications found.</td></tr>');
                        self.updatePagination({ page: 1, per_page: self.perPage, total: 0 });
                    }
                    self.resetSelection();
                },
                error: function() {
                    self.showError('Network error while loading applications');
                    $('#boa-reviews-tbody').html('<tr><td colspan="8" class="boa-no-data">Error loading data.</td></tr>');
                    self.resetSelection();
                }
            });
        }

        // === ٹیبل رینڈر کریں ===
        renderTable(data) {
            const tbody = $('#boa-reviews-tbody');
            const template = document.getElementById('boa-review-row-template');
            
            tbody.empty();

            if (!data.admissions || data.admissions.length === 0) {
                tbody.html('<tr><td colspan="8" class="boa-no-data">No pending applications found.</td></tr>');
                return;
            }

            data.admissions.forEach((app) => {
                const clone = template.content.cloneNode(true);
                const row = clone.querySelector('.boa-review-row');
                
                // ڈیٹا صفات (data attributes) کو محفوظ کریں
                $(row).data('fee-id', app.fee_id);
                $(row).data('student-id', app.student_id);
                $(row).data('receipt-url', app.receipt_url);
                $(row).data('receipts', app.receipts || []);

                row.querySelector('.boa-student-name').textContent = app.student_name || 'N/A';
                row.querySelector('.boa-student-contact').innerHTML = `${app.student_email || 'N/A'}<br>${app.phone || 'N/A'}`;
                row.querySelector('.boa-course-name').textContent = app.course_name || 'N/A';
                row.querySelector('.boa-amount-paid').textContent = `${this.currency} ${parseFloat(app.amount_paid).toFixed(2)}`;
                row.querySelector('.boa-submitted-date').textContent = this.formatDate(app.created_at);

                const receiptBtnText = row.querySelector('.boa-receipt-btn-text');
                if (receiptBtnText && app.receipts && app.receipts.length > 0) {
                    receiptBtnText.textContent = `View (${app.receipts.length})`;
                }
                const checkbox = row.querySelector('.boa-review-checkbox');
                if (checkbox) {
                    checkbox.checked = false;
                }
                
                tbody.append(row);
            });

            this.totalRecords = data.total;
        }

        // === پیجینیشن اپڈیٹ کریں ===
        updatePagination(data) {
            const from = data.total > 0 ? ((data.page - 1) * data.per_page) + 1 : 0;
            const to = Math.min(data.page * data.per_page, data.total);
            
            $('#boa-showing-from').text(from);
            $('#boa-showing-to').text(to);
            $('#boa-total-records').text(data.total || 0);
            
            this.renderPaginationNumbers(data.page, Math.ceil((data.total || 0) / data.per_page));
        }

        renderPaginationNumbers(currentPage, totalPages) {
            const container = $('#boa-page-numbers');
            container.empty();
            if (!totalPages || totalPages < 2) return;

            if (currentPage > 1) {
                container.append(`<button class="boa-page-btn" onclick="boaAdminReviews.goToPage(${currentPage - 1})">&laquo; Prev</button>`);
            }
            // (سادہ پیجینیشن)
            container.append(`<span class="boa-page-dots">Page ${currentPage} of ${totalPages}</span>`);

            if (currentPage < totalPages) {
                container.append(`<button class="boa-page-btn" onclick="boaAdminReviews.goToPage(${currentPage + 1})">Next &raquo;</button>`);
            }
        }

        // === یوٹیلیٹی فنکشنز ===
        goToPage(page) {
            this.currentPage = page;
            this.loadAdmissions();
        }

        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        showError(message) {
            console.error('BSSMS Error:', message);
            alert(`Error: ${message}`);
        }

        showSuccess(message) {
            console.log('BSSMS Success:', message);
            alert(`Success: ${message}`);
        }
    }

    // === گلوبل انسٹینس ===
    let boaAdminReviews = null;
    $(document).ready(function() {
        boaAdminReviews = new BOA_Admin_Reviews();
        window.boaAdminReviews = boaAdminReviews;
    });

    // === گلوبل فنکشنز ===
    
    // فہرست ریفریش کریں
    window.BOA_RefreshList = function() {
        if (boaAdminReviews) {
            boaAdminReviews.loadAdmissions();
        }
    };

    window.BOA_BulkApproveAdmissions = function() {
        if (boaAdminReviews) {
            boaAdminReviews.bulkApproveSelected();
        }
    };

    window.BOA_BulkRejectAdmissions = function() {
        if (boaAdminReviews) {
            boaAdminReviews.bulkRejectSelected();
        }
    };

    // رسید دیکھیں
    window.BOA_ViewReceipt = function(button) {
        const row = $(button).closest('.boa-review-row');
        const receiptUrl = $(row).data('receipt-url');
        const receipts = $(row).data('receipts') || [];
        const viewer = $('#boa-receipt-viewer');
        const thumbList = $('#boa-receipt-thumb-list');

        const renderReceipt = (url, name) => {
            viewer.html(`<img src="${url}" style="max-width: 100%; height: auto;" alt="${name || 'Receipt'}">`);
        };

        thumbList.empty();

        if (receipts.length > 0) {
            renderReceipt(receipts[0].file_url, receipts[0].file_name);
            receipts.forEach((file, index) => {
                const btn = $(`<button type="button" class="boa-thumb-btn">${index + 1}. ${file.file_name || 'Receipt'}</button>`);
                btn.on('click', () => renderReceipt(file.file_url, file.file_name));
                thumbList.append(btn);
            });
        } else if (receiptUrl) {
            renderReceipt(receiptUrl, 'Receipt');
        } else {
            boaAdminReviews.showError('No receipt found for this application.');
            return;
        }

        $('#boa-receipt-viewer-modal').addClass('boa-modal-open');
    };

    window.BOA_CloseReceiptModal = function() {
        $('#boa-receipt-viewer-modal').removeClass('boa-modal-open');
        $('#boa-receipt-viewer').html('<p>Loading receipt...</p>');
        $('#boa-receipt-thumb-list').empty();
    };


    // داخلہ منظور کریں
    window.BOA_ApproveAdmission = function(button) {
        const row = $(button).closest('.boa-review-row');
        const fee_id = $(row).data('fee-id');
        const student_id = $(row).data('student-id');
        
        if (confirm('Are you sure you want to approve this admission? This will activate the student and mark this fee as paid.')) {
            $.ajax({
                url: window.boa_admin_review_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_approve_admission',
                    nonce: window.boa_admin_review_data.nonce,
                    fee_id: fee_id,
                    student_id: student_id
                },
                beforeSend: function() {
                    $(row).css('opacity', 0.5);
                },
                success: function(response) {
                    if (response.success) {
                        boaAdminReviews.showSuccess(response.data.message);
                        boaAdminReviews.loadAdmissions(); // فہرست ریفریش کریں
                    } else {
                        boaAdminReviews.showError(response.data.message || 'Failed to approve admission');
                        $(row).css('opacity', 1);
                    }
                },
                error: function() {
                    boaAdminReviews.showError('Network error while approving');
                    $(row).css('opacity', 1);
                }
            });
        }
    };

    // داخلہ مسترد کریں
    window.BOA_RejectAdmission = function(button) {
        const row = $(button).closest('.boa-review-row');
        const fee_id = $(row).data('fee-id');
        const student_id = $(row).data('student-id');
        
        if (confirm('Are you sure you want to REJECT this admission? This will permanently delete the student and all associated fee records.')) {
            $.ajax({
                url: window.boa_admin_review_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_reject_admission',
                    nonce: window.boa_admin_review_data.nonce,
                    fee_id: fee_id,
                    student_id: student_id
                },
                beforeSend: function() {
                    $(row).css('opacity', 0.5);
                },
                success: function(response) {
                    if (response.success) {
                        boaAdminReviews.showSuccess(response.data.message);
                        boaAdminReviews.loadAdmissions(); // فہرست ریفریش کریں
                    } else {
                        boaAdminReviews.showError(response.data.message || 'Failed to reject admission');
                        $(row).css('opacity', 1);
                    }
                },
                error: function() {
                    boaAdminReviews.showError('Network error while rejecting');
                    $(row).css('opacity', 1);
                }
            });
        }
    };


    $(document).ready(function() {
        // کلاس خود ہی شروع ہو جاتی ہے
    });

})(jQuery);
// ✅ Syntax verified block end
