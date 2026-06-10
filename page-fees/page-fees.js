// 🟢 یہاں سے Fees Management JavaScript شروع ہو رہا ہے
(function($) {
    'use strict';

    /**
     * BSSMS Fees Management - JavaScript functionality
     *
     * (2025 BABA ARCHITECT - REFACTOR 11)
     * - BOA_ApplyDiscount کو موڈل کھولنے کے لیے ری فیکٹر کیا گیا۔
     * - BOA_ConfirmPartialDiscount نیا فنکشن شامل کیا گیا جو partial discount AJAX کال بھیجتا ہے۔
     * - BOA_CloseDiscountModal ہیلپر فنکشن شامل کیا گیا۔
     * - ڈسکاؤنٹ کی رقم کی لائیو کیلکولیشن شامل کی گئی۔
     */

    if (typeof window.boa_fees_data === 'undefined') {
        console.warn('boa_fees_data is not defined, using safe defaults.');
        window.boa_fees_data = {
            ajax_url: (typeof ajaxurl !== 'undefined') ? ajaxurl : '',
            nonce: '',
            fee_status_snapshot: [],
            today_collections: [],
            upcoming_deadlines: [],
            courses_list: [],
            students_list: []
        };
    }

    class BOA_Fees {
        constructor() {
            this.currentPage = 1;
            this.perPage = 10;
            this.totalRecords = 0;
            this.selectedFees = new Set();
            this.currentFeeId = null;
            this.currentPendingAmount = 0; // جزوی ڈسکاؤنٹ کے لیے
            this.currency = window.boa_fees_data?.currency || 'PKR'; // Currency symbol
            this.filters = {
                search: '',
                course: '',
                status: '',
                dateFrom: '',
                dateTo: ''
            };
            this.feesChartInstance = null;
            
            this.init();
        }

        init() {
            this.loadFees();
            this.initCharts();
            this.loadUpcomingDeadlines();
            this.loadTodayCollections();
            this.bindEvents();
            
            console.log('BSSMS Fees Management initialized');
        }

        // === فیسز لوڈ کریں ===
        loadFees() {
            const self = this;
            
            const requestData = {
                action: 'boa_get_fees',
                nonce: window.boa_fees_data.nonce,
                page: this.currentPage,
                per_page: this.perPage,
                search: this.filters.search,
                course_filter: this.filters.course,
                status_filter: this.filters.status,
                dateFrom: this.filters.dateFrom,
                dateTo: this.filters.dateTo
            };
            
            // Debug: Log the filter being applied
            console.log('BOA Fees Filter Request:', requestData);
            
            $.ajax({
                url: window.boa_fees_data.ajax_url,
                type: 'POST',
                data: requestData,
                beforeSend: function() {
                    $('#boa-fees-tbody').html('<tr><td colspan="9" class="boa-loading-cell">Loading fees...</td></tr>');
                },
                success: function(response) {
                    // Debug: Log the response
                    console.log('BOA Fees Response:', response);
                    
                    if (response.success) {
                        self.renderFeesTable(response.data);
                        self.updatePagination(response.data);
                    } else {
                        $('#boa-fees-tbody').html('<tr><td colspan="9" class="boa-no-data">No fees found</td></tr>');
                        self.updatePagination({ page: 1, per_page: self.perPage, total: 0 });
                    }
                },
                error: function(xhr, status, error) {
                    console.error('BOA Fees Error:', xhr.responseText);
                    self.showError('Network error while loading fees: ' + error);
                }
            });
        }

        // === فیسز ٹیبل رینڈر کریں ===
        renderFeesTable(data) {
            const tbody = $('#boa-fees-tbody');
            const template = document.getElementById('boa-fee-row-template');
            tbody.empty();
            if (!data.fees || data.fees.length === 0) {
                tbody.append('<tr><td colspan="9" class="boa-no-data">No fees found</td></tr>');
                return;
            }
            data.fees.forEach((fee) => {
                const clone = template.content.cloneNode(true);
                const row = clone.querySelector('.boa-fee-row');
                row.dataset.feeId = fee.fee_id;
                $(row).data('fee-data', fee); 
                const checkbox = row.querySelector('.boa-fee-checkbox');
                checkbox.value = fee.fee_id;
                row.querySelector('.boa-student-name').textContent = fee.student_name || 'N/A';
                row.querySelector('.boa-course-name').textContent = fee.course_name || 'N/A';
                row.querySelector('.boa-due-date').textContent = this.formatDate(fee.due_date);
                row.querySelector('.boa-payment-date').textContent = this.formatDate(fee.payment_date);
                let amount_display = this.currency + ' 0.00';
                if (fee.status === 'pending' || fee.status === 'overdue' || fee.status === 'discounted') {
                    amount_display = `${this.currency} ${parseFloat(fee.amount_due).toFixed(2)}`;
                } else {
                    amount_display = `${this.currency} ${parseFloat(fee.amount_paid).toFixed(2)}`;
                }
                row.querySelector('.boa-amount').textContent = amount_display;
                const statusBadge = row.querySelector('.boa-status-badge');
                statusBadge.textContent = this.getStatusText(fee.status);
                statusBadge.className = `boa-status-badge ${this.getStatusClass(fee.status)}`;
                const receiptCell = row.querySelector('.boa-receipt-cell');
                if (fee.receipt_url && fee.receipt_url !== '#') {
                    receiptCell.innerHTML = `<button class="boa-btn-icon boa-btn-view" onclick="BOA_ViewReceipt('${fee.receipt_url}')" title="View Receipt"><span class="dashicons dashicons-media-document"></span></button>`;
                } else if (fee.status === 'paid') {
                     receiptCell.innerHTML = `<button class="boa-btn-link" onclick="BOA_UploadReceiptForFee(${fee.fee_id})" title="Upload Receipt">Upload</button>`;
                } else {
                    receiptCell.innerHTML = '<span>-</span>';
                }
                const discountBtn = row.querySelector('.boa-btn-discount');
                if (fee.status === 'pending' || fee.status === 'overdue') {
                    $(discountBtn).show();
                } else {
                    $(discountBtn).hide();
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
                container.append(`<button class="boa-page-btn" onclick="boaFees.goToPage(${currentPage - 1})">&laquo; Prev</button>`);
            }
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                    const activeClass = i === currentPage ? ' boa-page-active' : '';
                    container.append(`<button class="boa-page-btn${activeClass}" onclick="boaFees.goToPage(${i})">${i}</button>`);
                } else if (i === currentPage - 3 || i === currentPage + 3) {
                    container.append('<span class="boa-page-dots">...</span>');
                }
            }
            if (currentPage < totalPages) {
                container.append(`<button class="boa-page-btn" onclick="boaFees.goToPage(${currentPage + 1})">Next &raquo;</button>`);
            }
        }

        // === چارٹس (اپ ڈیٹڈ) ===
        initCharts() {
            this.initFeesChart();
        }

        initFeesChart() {
            const ctx = document.getElementById('boa-fees-chart');
            if (!ctx) return;
            if (typeof Chart === 'undefined') {
                console.warn('Chart.js not loaded, skipping fees chart.');
                return;
            }
            if (this.feesChartInstance) {
                this.feesChartInstance.destroy();
            }
            const chartData = window.boa_fees_data?.fee_status_snapshot || [];
            let labels = chartData.map(item => this.getStatusText(item.status));
            let data = chartData.map(item => item.count);
            let colors = labels.map(label => {
                if (label === 'Paid') return '#10b981';
                if (label === 'Pending') return '#f59e0b';
                if (label === 'Overdue') return '#ef4444';
                if (label === 'Discounted') return '#8b5cf6';
                if (label === 'Pending Review') return '#60a5fa';
                return '#e5e7eb';
            });
            if (data.length === 0) {
                labels = ['No Data'];
                data = [1];
                colors = ['#e5e7eb'];
            }
            this.feesChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    cutout: '70%',
                    plugins: {
                        legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
                    }
                }
            });
            const statsContainer = $('#boa-snapshot-stats');
            statsContainer.empty();
            if (chartData.length > 0) {
                chartData.forEach((item, index) => {
                    statsContainer.append(`
                        <div class="boa-stat-item">
                            <span class="boa-stat-color" style="background-color: ${colors[index]}"></span>
                            <span>${item.count} ${this.getStatusText(item.status)}</span>
                        </div>
                    `);
                });
            } else {
                statsContainer.append('<div class="boa-no-data" style="padding:0;">No fee data</div>');
            }
        }

        // === اپکمنگ ڈیڈلائنز ===
        loadUpcomingDeadlines() {
            const container = $('#boa-upcoming-deadlines-list');
            const template = document.getElementById('boa-deadline-item-template');
            const deadlines = window.boa_fees_data?.upcoming_deadlines || [];
            container.empty();
            if (deadlines.length === 0) {
                container.append('<div class="boa-no-data">No upcoming deadlines</div>');
                return;
            }
            deadlines.forEach(deadline => {
                const clone = template.content.cloneNode(true);
                const item = clone.querySelector('.boa-deadline-item');
                const urgency = item.querySelector('.boa-deadline-urgency');
                urgency.className = `boa-deadline-urgency boa-urgency-medium`;
                item.querySelector('.boa-deadline-student').textContent = deadline.student_name;
                item.querySelector('.boa-deadline-course').textContent = deadline.course_name;
                item.querySelector('.boa-due-date').textContent = `Due: ${this.formatDate(deadline.due_date)}`;
                item.querySelector('.boa-amount').textContent = `${this.currency} ${parseFloat(deadline.amount_due).toFixed(2)}`;
                const statusBadge = item.querySelector('.boa-status-badge');
                statusBadge.textContent = this.getDeadlineStatusText(deadline.status);
                statusBadge.className = `boa-status-badge ${this.getDeadlineStatusClass(deadline.status)}`;
                container.append(item);
            });
        }

        // === آج کی کولکشنز ===
        loadTodayCollections() {
            const container = $('#boa-today-collections');
            const template = document.getElementById('boa-today-item-template');
            const todayCollections = window.boa_fees_data?.today_collections || [];
            container.empty();
            if (todayCollections.length === 0) {
                container.append('<div class="boa-no-data">No collections today</div>');
                return;
            }
            todayCollections.forEach(collection => {
                const clone = template.content.cloneNode(true);
                const item = clone.querySelector('.boa-today-item');
                item.querySelector('.boa-today-student').textContent = collection.student_name;
                item.querySelector('.boa-today-course').textContent = collection.course_name;
                item.querySelector('.boa-today-amount').textContent = `${this.currency} ${parseFloat(collection.amount_paid).toFixed(2)}`;
                item.querySelector('.boa-today-time').textContent = new Date(collection.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                container.append(item);
            });
        }

        // === ایونٹ بائنڈنگ ===
        bindEvents() {
            $('#boa-fees-search').on('input', (e) => { this.filters.search = e.target.value; this.debouncedSearch(); });
            $('#boa-course-filter').on('change', (e) => { this.filters.course = e.target.value; this.loadFees(); });
            $('#boa-status-filter').on('change', (e) => { this.filters.status = e.target.value; this.loadFees(); });
            $('#boa-date-from').on('change', (e) => { this.filters.dateFrom = e.target.value; this.loadFees(); });
            $('#boa-date-to').on('change', (e) => { this.filters.dateTo = e.target.value; this.loadFees(); });
            this.initReceiptUpload();

            // --- نیا: ڈسکاؤنٹ موڈل کیلکولیشن ---
            $('#boa-discount-amount').on('input', () => {
                const discountAmount = parseFloat($('#boa-discount-amount').val()) || 0;
                if (discountAmount > this.currentPendingAmount) {
                    $('#boa-discount-amount').val(this.currentPendingAmount);
                }
                const remaining = this.currentPendingAmount - (parseFloat($('#boa-discount-amount').val()) || 0);
                $('#boa-discount-remaining').val(`${this.currency} ${remaining.toFixed(2)}`);
            });
            // --- /نیا ---
        }

        debouncedSearch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => { this.loadFees(); }, 500);
        }

        // === رسید اپلوڈ ===
        initReceiptUpload() {
            const uploadArea = $('#boa-receipt-upload-area');
            const fileInput = $('#boa-receipt-file');
            uploadArea.on('click', () => fileInput.click());
            fileInput.on('change', (e) => this.handleReceiptUpload(e.target.files[0]));
            uploadArea.on('dragover', (e) => { e.preventDefault(); uploadArea.addClass('boa-upload-dragover'); });
            uploadArea.on('dragleave', () => uploadArea.removeClass('boa-upload-dragover'));
            uploadArea.on('drop', (e) => { e.preventDefault(); uploadArea.removeClass('boa-upload-dragover'); this.handleReceiptUpload(e.originalEvent.dataTransfer.files[0]); });
        }

        handleReceiptUpload(file) {
            if (!file) { this.showError('Please select a file'); return; }
            const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (!validTypes.includes(file.type)) { this.showError('Please select a JPG, PNG, or PDF file'); return; }
            if (file.size > maxSize) { this.showError('File size must be less than 5MB'); return; }
            this.showReceiptPreview(file);
            this.uploadReceiptFile(file);
        }

        showReceiptPreview(file) {
            const preview = $('#boa-receipt-preview');
            $('#boa-receipt-name').text(file.name);
            $('#boa-receipt-size').text(this.formatFileSize(file.size));
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.find('.boa-receipt-thumbnail').html(`<img src="${e.target.result}" alt="Receipt Preview" style="max-width: 50px; max-height: 50px;">`);
                };
                reader.readAsDataURL(file);
            }
            preview.show();
            $('#boa-receipt-upload-area').hide();
        }

        uploadReceiptFile(file) {
            const formData = new FormData();
            formData.append('action', 'boa_upload_receipt');
            formData.append('nonce', window.boa_fees_data.nonce);
            formData.append('receipt_file', file);
            $.ajax({
                url: window.boa_fees_data.ajax_url,
                type: 'POST', data: formData, processData: false, contentType: false,
                success: function(response) {
                    if (response.success) {
                        $('#boa-receipt-url').val(response.data.file_url);
                        boaFees.showSuccess('Receipt uploaded successfully');
                    } else {
                        boaFees.showError('Failed to upload receipt');
                    }
                },
                error: function() { boaFees.showError('Network error while uploading receipt'); }
            });
        }

        // === یوٹیلیٹی فنکشنز ===
        goToPage(page) { this.currentPage = page; this.loadFees(); }
        formatDate(dateString) { if (!dateString || dateString === '0000-00-00') return 'N/A'; const date = new Date(dateString.replace(/-/g, '/')); return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
        formatFileSize(bytes) { if (bytes === 0) return '0 Bytes'; const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]; }
        getStatusText(status) { const map = { 'paid': 'Paid', 'pending': 'Pending', 'overdue': 'Overdue', 'discounted': 'Discounted', 'pending_review': 'Pending Review' }; return map[status] || 'Unknown'; }
        getStatusClass(status) { const map = { 'paid': 'boa-status-paid', 'pending': 'boa-status-pending', 'overdue': 'boa-status-overdue', 'discounted': 'boa-status-discounted', 'pending_review': 'boa-status-review' }; return map[status] || 'boa-status-unknown'; }
        getDeadlineStatusText(status) { const map = { 'pending': 'Due Soon', 'overdue': 'Overdue' }; return map[status] || 'Unknown'; }
        getDeadlineStatusClass(status) { const map = { 'pending': 'boa-status-pending', 'overdue': 'boa-status-overdue' }; return map[status] || 'boa-status-unknown'; }
        showError(message) { console.error('BSSMS Error:', message); alert(`Error: ${message}`); }
        showSuccess(message) { console.log('BSSMS Success:', message); alert(`Success: ${message}`); }
    }

    // === گلوبل فنکشنز ===
    window.boaFees = new BOA_Fees();

    window.BOA_OpenCollectFeeModal = function() {
        $('#boa-modal-title').text('Collect Fee');
        $('#boa-fee-form')[0].reset();
        $('#boa-fee-id').val('0');
        $('#boa-invoice-id').val('INV-' + Date.now()).prop('readonly', true);
        $('#boa-payment-date').val(new Date().toISOString().split('T')[0]);
        $('#boa-amount-due').val('');
        $('#boa-receipt-preview').hide();
        $('#boa-receipt-upload-area').show();
        $('#boa-fee-modal').addClass('boa-modal-open');
    };

    window.BOA_CloseFeeModal = function() {
        $('#boa-fee-modal').removeClass('boa-modal-open');
    };

    window.BOA_OnStudentChange = function() {
        const studentSelect = $('#boa-fee-student');
        const selectedOption = studentSelect.find('option:selected');
        const courseId = selectedOption.data('course');
        if (courseId) {
            $('#boa-fee-course').val(courseId);
            const courseFee = $(`#boa-fee-course option[value="${courseId}"]`).data('fee');
            $('#boa-amount-due').val(parseFloat(courseFee || 0).toFixed(2));
            $('#boa-amount-paid').val(parseFloat(courseFee || 0).toFixed(2));
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 30);
            $('#boa-due-date').val(dueDate.toISOString().split('T')[0]);
        }
    };

    window.BOA_SaveFee = function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        if (!data.student_id || !data.course_id || !data.amount_paid) {
            boaFees.showError('Please fill Student, Course, and Amount Paid');
            return false;
        }
        data.action = 'boa_save_fee';
        data.nonce = window.boa_fees_data.nonce;
        $.ajax({
            url: window.boa_fees_data.ajax_url,
            type: 'POST',
            data: data,
            success: function(response) {
                if (response.success) {
                    boaFees.showSuccess('Fee collected successfully');
                    location.reload();
                } else {
                    boaFees.showError(response.data.message || 'Failed to save fee');
                }
            },
            error: function() {
                boaFees.showError('Network error while saving fee');
            }
        });
        return false;
    };

    window.BOA_CollectFee = function(button) { window.BOA_EditFee(button); };

    window.BOA_EditFee = function(button) {
        const row = $(button).closest('.boa-fee-row');
        const feeData = row.data('fee-data');
        if (!feeData) {
            boaFees.showError('Could not load fee data to edit.');
            return;
        }
        $('#boa-modal-title').text('Edit Fee');
        $('#boa-fee-id').val(feeData.fee_id);
        $('#boa-fee-student').val(feeData.student_id);
        $('#boa-fee-course').val(feeData.course_id);
        $('#boa-amount-due').val(parseFloat(feeData.amount_due).toFixed(2));
        $('#boa-amount-paid').val(parseFloat(feeData.amount_paid).toFixed(2));
        $('#boa-due-date').val(window.formatDateForInput(feeData.due_date));
        $('#boa-payment-date').val(window.formatDateForInput(feeData.payment_date));
        $('#boa-fee-status').val(feeData.status);
        $('#boa-invoice-id').val(feeData.invoice_id).prop('readonly', true);
        if (feeData.receipt_url) {
            $('#boa-receipt-url').val(feeData.receipt_url);
            $('#boa-receipt-name').text(feeData.receipt_url.split('/').pop());
            $('#boa-receipt-size').text('Uploaded');
            $('#boa-receipt-preview').show();
            $('#boa-receipt-upload-area').hide();
        } else {
             $('#boa-receipt-preview').hide();
             $('#boa-receipt-upload-area').show();
        }
        $('#boa-fee-modal').addClass('boa-modal-open');
    };

    window.BOA_DeleteFee = function(button) {
        if (confirm('Are you sure you want to delete this fee record? This action cannot be undone.')) {
            const row = $(button).closest('.boa-fee-row');
            const feeId = row.data('fee-id');
            $.ajax({
                url: window.boa_fees_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_delete_fee',
                    nonce: window.boa_fees_data.nonce,
                    fee_id: feeId
                },
                success: function(response) {
                    if (response.success) {
                        boaFees.showSuccess('Fee record deleted successfully');
                        location.reload();
                    } else {
                        boaFees.showError(response.data.message || 'Failed to delete fee record');
                    }
                },
                error: function() {
                    boaFees.showError('Network error while deleting fee record');
                }
            });
        }
    };

    // --- اپ ڈیٹ شدہ فنکشن: جزوی ڈسکاؤنٹ موڈل کھولتا ہے ---
    window.BOA_ApplyDiscount = function(button) {
        const row = $(button).closest('.boa-fee-row');
        const feeData = row.data('fee-data');
        if (!feeData) {
            boaFees.showError('Could not load fee data.');
            return;
        }
        
        // عالمی متغیرات (global variables) سیٹ کریں
        boaFees.currentFeeId = feeData.fee_id;
        boaFees.currentPendingAmount = parseFloat(feeData.amount_due);

        // موڈل فیلڈز بھریں
        $('#boa-discount-fee-id').val(feeData.fee_id);
        $('#boa-discount-total-pending').val(`${boaFees.currency} ${feeData.amount_due}`);
        $('#boa-discount-amount').val(''); // پچھلی ویلیو صاف کریں
        $('#boa-discount-amount').attr('max', feeData.amount_due); // زیادہ سے زیادہ حد سیٹ کریں
        $('#boa-discount-remaining').val(`${boaFees.currency} ${feeData.amount_due}`);
        
        // موڈل دکھائیں
        $('#boa-discount-modal').addClass('boa-modal-open');
    };

    // --- نیا فنکشن: ڈسکاؤنٹ موڈل بند کرتا ہے ---
    window.BOA_CloseDiscountModal = function() {
        $('#boa-discount-modal').removeClass('boa-modal-open');
    };
    
    // --- نیا فنکشن: جزوی ڈسکاؤنٹ کو کنفرم کرتا ہے ---
    window.BOA_ConfirmPartialDiscount = function(event) {
        event.preventDefault();
        
        const feeId = $('#boa-discount-fee-id').val();
        const discountAmount = parseFloat($('#boa-discount-amount').val()) || 0;

        if (discountAmount <= 0) {
            boaFees.showError('Please enter a valid discount amount greater than zero.');
            return false;
        }
        if (discountAmount > boaFees.currentPendingAmount) {
            boaFees.showError('Discount amount cannot be greater than the pending amount.');
            return false;
        }

        $.ajax({
            url: window.boa_fees_data.ajax_url,
            type: 'POST',
            data: {
                action: 'boa_apply_partial_discount',
                nonce: window.boa_fees_data.nonce,
                fee_id: feeId,
                discount_amount: discountAmount
            },
            success: function(response) {
                if (response.success) {
                    boaFees.showSuccess('Partial discount applied successfully. The fee entry has been split.');
                    location.reload(); // پیج ری لوڈ کریں
                } else {
                    boaFees.showError(response.data.message || 'Failed to apply discount');
                }
            },
            error: function() {
                boaFees.showError('Network error while applying discount');
            }
        });
        
        return false;
    };
    // --- /اپ ڈیٹس ---


    window.BOA_ViewReceipt = function(receiptUrl) {
        $('#boa-receipt-viewer').html(`<img src="${receiptUrl}" style="max-width: 100%; height: auto;" alt="Receipt">`);
        $('#boa-receipt-modal').addClass('boa-modal-open');
    };

    window.BOA_CloseReceiptModal = function() { $('#boa-receipt-modal').removeClass('boa-modal-open'); };
    window.BOA_DownloadReceipt = function() { boaFees.showSuccess('Receipt download functionality will be implemented'); };
    window.BOA_UploadReceiptForFee = function(feeId) { boaFees.showSuccess('Upload receipt functionality for specific fee will be implemented'); };
    window.BOA_RemoveReceipt = function() {
        $('#boa-receipt-preview').hide();
        $('#boa-receipt-upload-area').show();
        $('#boa-receipt-url').val('');
        $('#boa-receipt-file').val('');
    };

    window.BOA_ToggleSelectAll = function(checkbox) {
        $('.boa-fee-checkbox').prop('checked', checkbox.checked);
        window.BOA_UpdateBulkActions();
    };
    window.BOA_UpdateBulkActions = function() {
        const selectedCount = $('.boa-fee-checkbox:checked').length;
        if (selectedCount > 0) {
            $('#boa-bulk-actions-bar').show();
            $('#boa-selected-count').text(`${selectedCount} fee records selected`);
        } else {
            $('#boa-bulk-actions-bar').hide();
        }
    };
    window.BOA_ApplyBulkAction = function() {
        boaFees.showError('Bulk actions are not implemented yet.');
    };

    window.BOA_ResetFilters = function() {
        $('#boa-fees-search').val('');
        $('#boa-course-filter').val('');
        $('#boa-status-filter').val('');
        $('#boa-date-from').val('');
        $('#boa-date-to').val('');
        boaFees.filters = { search: '', course: '', status: '', dateFrom: '', dateTo: '' };
        boaFees.loadFees();
    };

    window.BOA_ExportFees = function() {
        boaFees.showSuccess('Complete data export started. Please wait...');
        
        // Create form for file download
        const form = $('<form>', {
            method: 'POST',
            action: window.boa_fees_data.ajax_url,
            style: 'display: none;'
        });
        
        // Add form fields
        form.append($('<input>', {
            type: 'hidden',
            name: 'action',
            value: 'boa_export_plugin_data'
        }));
        
        form.append($('<input>', {
            type: 'hidden',
            name: 'nonce',
            value: window.boa_fees_data.nonce
        }));
        
        // Submit form
        $('body').append(form);
        form.submit();
        form.remove();
        
        // Hide success message after a moment
        setTimeout(() => {
            if ($('.alert-success').length) {
                $('.alert-success').fadeOut();
            }
        }, 3000);
    };

    window.BOA_ExportExcel = function() {
        // Export fees data to Excel
        const form = $('<form>', {
            method: 'POST',
            action: window.boa_fees_data.ajax_url,
            style: 'display: none;'
        });
        
        // Add form fields
        form.append($('<input>', {
            type: 'hidden',
            name: 'action',
            value: 'boa_export_to_excel'
        }));
        
        form.append($('<input>', {
            type: 'hidden',
            name: 'nonce',
            value: window.boa_fees_data.nonce
        }));
        
        form.append($('<input>', {
            type: 'hidden',
            name: 'export_type',
            value: 'fees'
        }));
        
        // Add current filters
        form.append($('<input>', {
            type: 'hidden',
            name: 'filters[status_filter]',
            value: $('#boa-status-filter').val()
        }));
        
        form.append($('<input>', {
            type: 'hidden',
            name: 'filters[course_filter]',
            value: $('#boa-course-filter').val()
        }));
        
        if ($('#boa-date-from').val()) {
            form.append($('<input>', {
                type: 'hidden',
                name: 'filters[dateFrom]',
                value: $('#boa-date-from').val()
            }));
        }
        
        if ($('#boa-date-to').val()) {
            form.append($('<input>', {
                type: 'hidden',
                name: 'filters[dateTo]',
                value: $('#boa-date-to').val()
            }));
        }
        
        // Submit form
        $('body').append(form);
        form.submit();
        form.remove();
        
        boaFees.showSuccess('Export started. Your download will begin shortly.');
        
        setTimeout(() => {
            if ($('.alert-success').length) {
                $('.alert-success').fadeOut();
            }
        }, 3000);
    };

    window.BOA_PrintFees = function() { window.print(); };
    window.BOA_GenerateDemoData = function() { boaFees.showSuccess('Demo data functionality will be implemented'); };
    window.BOA_SaveDeadlineRules = function() { boaFees.showSuccess('Deadline rules saved successfully (DEMO)'); };

    window.BOA_OpenImportModal = function() {
        // Create import modal
        const modalHtml = `
            <div id="boa-import-modal" class="boa-modal boa-modal-open">
                <div class="boa-modal-content">
                    <div class="boa-modal-header">
                        <h3>Import Plugin Data</h3>
                        <button class="boa-close-btn" onclick="BOA_CloseImportModal()">
                            <span class="dashicons dashicons-no"></span>
                        </button>
                    </div>
                    <div class="boa-modal-body">
                        <form id="boa-import-form" onsubmit="return BOA_SubmitImport(event)">
                            <div class="boa-form-group">
                                <label for="boa-import-file">Select Backup File (.json)</label>
                                <input type="file" id="boa-import-file" name="import_file" accept=".json" required class="boa-form-input">
                                <small>Only JSON backup files exported by this plugin are supported.</small>
                            </div>
                            <div class="boa-form-group">
                                <label>
                                    <input type="checkbox" id="boa-import-confirm" required>
                                    I confirm that I want to import this data. This action cannot be undone.
                                </label>
                            </div>
                            <div class="boa-import-progress" id="boa-import-progress" style="display: none;">
                                <div class="boa-progress-bar">
                                    <div class="boa-progress-fill" id="boa-progress-fill"></div>
                                </div>
                                <div class="boa-progress-text" id="boa-progress-text">Importing...</div>
                            </div>
                        </form>
                    </div>
                    <div class="boa-modal-footer">
                        <button type="button" class="boa-btn boa-btn-secondary" onclick="BOA_CloseImportModal()">Cancel</button>
                        <button type="submit" form="boa-import-form" class="boa-btn boa-btn-primary">Import Data</button>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(modalHtml);
    };

    window.BOA_CloseImportModal = function() {
        $('#boa-import-modal').remove();
    };

    window.BOA_SubmitImport = function(event) {
        event.preventDefault();
        
        const fileInput = $('#boa-import-file')[0];
        const confirmCheck = $('#boa-import-confirm');
        
        if (!fileInput.files.length) {
            boaFees.showError('Please select a backup file.');
            return false;
        }
        
        if (!confirmCheck.prop('checked')) {
            boaFees.showError('Please confirm that you want to import this data.');
            return false;
        }
        
        // Show progress
        $('#boa-import-progress').show();
        $('#boa-progress-text').text('Importing data...');
        $('#boa-progress-fill').css('width', '10%');
        
        // Prepare form data
        const formData = new FormData();
        formData.append('action', 'boa_import_plugin_data');
        formData.append('nonce', window.boa_fees_data.nonce);
        formData.append('import_file', fileInput.files[0]);
        
        // Submit import
        $.ajax({
            url: window.boa_fees_data.ajax_url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            xhr: function() {
                const xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', function(e) {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        $('#boa-progress-fill').css('width', percentComplete + '%');
                    }
                });
                return xhr;
            },
            success: function(response) {
                $('#boa-progress-fill').css('width', '100%');
                $('#boa-progress-text').text('Import completed!');
                
                setTimeout(() => {
                    if (response.success) {
                        BOA_CloseImportModal();
                        boaFees.showSuccess('Data imported successfully! ' + 
                            'Students: ' + response.data.results.imported_students + ', ' +
                            'Courses: ' + response.data.results.imported_courses + ', ' +
                            'Fees: ' + response.data.results.imported_fees);
                        
                        // Reload fees to show imported data
                        boaFees.loadFees();
                    } else {
                        BOA_CloseImportModal();
                        boaFees.showError('Import failed: ' + response.data.message);
                    }
                }, 1000);
            },
            error: function() {
                BOA_CloseImportModal();
                boaFees.showError('Network error during import.');
            }
        });
        
        return false;
    };

    window.formatDateForInput = function(dateString) {
        if (!dateString || dateString === 'N/A' || dateString === '0000-00-00') return '';
        const date = new Date(dateString.replace(/-/g, '/'));
        return date.toISOString().split('T')[0];
    };

    $(document).ready(function() {
        console.log('BSSMS Fees Management ready');
    });

})(jQuery);
// ✅ Syntax verified block end