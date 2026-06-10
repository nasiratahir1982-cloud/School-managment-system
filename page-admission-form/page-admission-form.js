// 🟢 یہاں سے Enhanced Public Admission Form JavaScript شروع ہو رہا ہے
(function($) {
    'use strict';

    /**
     * Enhanced BSSMS Public Admission Form - JavaScript functionality
     * Features:
     * - Double submission prevention
     * - Receipt upload with hash verification
     * - Enhanced validation
     * - WhatsApp integration
     */

    // سیف ڈیفالٹ
    if (typeof window.boa_public_data === 'undefined') {
        console.warn('boa_public_data is not defined, using safe defaults.');
        window.boa_public_data = {
            ajax_url: (typeof ajaxurl !== 'undefined') ? ajaxurl : '',
            nonce: '',
            courses: []
        };
    }

    class BOA_Admission_Form {
        constructor() {
            this.form = $('#boa-admission-form');
            if (this.form.length === 0) return;

            this.courseSelect = $('#boa-form-course');
            this.courseFeeInput = $('#boa-form-course-fee');
            this.amountPaidInput = $('#boa-form-amount-paid');
            this.remainingFeeInput = $('#boa-form-remaining-fee');
            this.nextDueDateInput = $('#boa-form-next-due-date');
            this.discountInput = $('#boa-form-discount');
            this.discountReasonInput = $('#boa-form-discount-reason');
            this.screenshotInput = $('#boa-form-screenshot');
            this.messagesContainer = $('#boa-form-messages');
            this.submitButton = $('#boa-form-submit-btn');
            this.loader = $('#boa-form-loader');
            this.formRoot = $('#boa-public-form-root');
            this.successTemplate = $('#boa-success-message-template');
            this.receiptListContainer = $('#boa-uploaded-receipts');
            this.selectedReceipts = [];
            this.historyPanel = $('#boa-form-history');
            this.statusPageUrl = window.boa_public_data?.status_page_url || '';
            this.progressBar = $('#boa-progress-bar');
            this.progressSteps = $('.boa-progress-steps li');
            
            this.currentCourseFee = 0;
            this.currency = window.boa_public_data?.currency || 'PKR';
            this.isExistingSubmission = this.form.find('input[name="submission_id"]').length > 0;
            this.submissionId = this.form.find('input[name="submission_id"]').val() || null;

            this.bindEvents();
            this.setMinDueDate();
            this.initializeExistingSubmission();
            this.updateProgress();
        }

        bindEvents() {
            this.courseSelect.on('change', () => {
                this.onCourseChange();
                this.checkDuplicateSubmission();
            });
            this.amountPaidInput.on('input', () => this.calculateRemainingFee());
            this.discountInput.on('input', () => this.validateDiscountAmount());
            this.screenshotInput.on('change', (e) => this.handleScreenshotUpload(e));
            this.form.on('input change', 'input, select, textarea', () => this.updateProgress());
            if (this.receiptListContainer.length) {
                this.receiptListContainer.on('click', '.boa-remove-receipt', (event) => {
                    event.preventDefault();
                    const index = parseInt($(event.currentTarget).data('index'), 10);
                    this.removeReceiptAt(Number.isNaN(index) ? -1 : index);
                });
            }
            
            if (!this.isExistingSubmission) {
                const emailInput = $('#boa-form-email');
                const phoneInput = $('#boa-form-phone');
                let checkTimeout;

                const scheduleCheck = () => {
                    clearTimeout(checkTimeout);
                    checkTimeout = setTimeout(() => this.checkDuplicateSubmission(), 400);
                };

                if (emailInput.length) {
                    emailInput.on('blur', scheduleCheck);
                }
                if (phoneInput.length) {
                    phoneInput.on('blur', scheduleCheck);
                }
            }
        }

        initializeExistingSubmission() {
            if (this.isExistingSubmission) {
                // Auto-populate discount with pending amount if available
                setTimeout(() => {
                    this.calculateRemainingFee();
                    if (this.discountInput.val() === '') {
                        this.autoFillDiscount();
                    }
                }, 100);
            }
        }

        async checkDuplicateSubmission() {
            if (this.isExistingSubmission) return;

            const email = $('#boa-form-email').val().trim();
            const phone = $('#boa-form-phone').val().trim();
            const courseId = this.courseSelect.val();
            
            if ((!email && !phone) || !courseId) {
                this.historyPanel.hide().empty();
                return;
            }

            this.loadApplicantHistory(email, phone);

            try {
                const response = await $.ajax({
                    url: window.boa_public_data.ajax_url,
                    type: 'POST',
                    data: {
                        action: 'boa_check_duplicate_submission',
                        email: email,
                        phone: phone,
                        course_id: courseId,
                        nonce: window.boa_public_data.nonce
                    }
                });

                if (response.success && response.data.exists) {
                    this.showMessage(response.data.message || 'Duplicate application detected for this course.', 'warning');
                }
            } catch (error) {
                console.error('Error checking duplicate submission:', error);
            }
            this.updateProgress();
        }


        async handleScreenshotUpload(event) {
            const files = Array.from(event.target.files || []);

            if (files.length === 0) {
                this.selectedReceipts = [];
                this.syncReceiptInputFromSelection();
                this.renderReceiptList();
                this.updateProgress();
                return;
            }

            let dataTransfer = null;
            if (typeof DataTransfer !== 'undefined') {
                dataTransfer = new DataTransfer();
            }

            this.selectedReceipts = [];

            for (const file of files) {
                if (!this.validateReceiptFile(file)) {
                    continue;
                }

                const fileHash = await this.calculateFileHash(file);
                const duplicate = await this.checkReceiptDuplicate(fileHash);
                if (duplicate) {
                    this.showMessage('This receipt has already been uploaded before. Please choose another file.', 'warning');
                    continue;
                }

                if (dataTransfer) {
                    dataTransfer.items.add(file);
                }

                this.selectedReceipts.push({
                    rawFile: file,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    hash: fileHash
                });
            }

            if (dataTransfer) {
                this.screenshotInput[0].files = dataTransfer.files;
            } else if (this.selectedReceipts.length === 0) {
                this.screenshotInput.val('');
            }

            this.renderReceiptList();
            this.updateProgress();

            if (this.selectedReceipts.length === 0) {
                this.showMessage('All uploaded files were rejected. Please upload valid receipts.', 'warning');
            }
        }

        async calculateFileHash(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const arrayBuffer = e.target.result;
                    const hashBuffer = crypto.subtle.digest('SHA-256', arrayBuffer);
                    hashBuffer.then((hashArray) => {
                        const hashHex = Array.from(new Uint8Array(hashArray))
                            .map(b => b.toString(16).padStart(2, '0'))
                            .join('');
                        resolve(hashHex);
                    }).catch(reject);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        }
        
        validateReceiptFile(file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (file.size > maxSize) {
                this.showMessage(`"${file.name}" exceeds the 5MB limit.`, 'error');
                return false;
            }

            if (!allowedTypes.includes(file.type)) {
                this.showMessage(`"${file.name}" is not a supported file type.`, 'error');
                return false;
            }

            return true;
        }

        renderReceiptList() {
            if (!this.receiptListContainer.length) return;

            if (this.selectedReceipts.length === 0) {
                this.receiptListContainer.html('<p class="boa-upload-placeholder">No files selected yet.</p>');
                return;
            }

            const items = this.selectedReceipts.map((file, index) => {
                const sizeKB = (file.size / 1024).toFixed(1);
                const safeName = this.escapeHtml(file.name);
                return `
                    <li>
                        <div class="boa-receipt-info">
                            <span class="boa-receipt-index">${index + 1}.</span>
                            <span class="boa-receipt-name">${safeName}</span>
                            <small>${sizeKB} KB</small>
                        </div>
                        <button type="button" class="boa-remove-receipt" data-index="${index}" aria-label="Remove ${safeName}">
                            Remove
                        </button>
                    </li>
                `;
            }).join('');

            this.receiptListContainer.html(`<ul class="boa-upload-list">${items}</ul>`);
        }

        removeReceiptAt(index) {
            if (!Number.isInteger(index) || index < 0 || index >= this.selectedReceipts.length) {
                return;
            }

            if (typeof DataTransfer === 'undefined') {
                this.selectedReceipts = [];
                this.screenshotInput.val('');
                this.renderReceiptList();
                this.updateProgress();
                this.showMessage('Receipts cleared. Please upload them again if you removed the wrong file.', 'info');
                return;
            }

            this.selectedReceipts.splice(index, 1);
            this.syncReceiptInputFromSelection();
            this.renderReceiptList();
            this.updateProgress();

            if (this.selectedReceipts.length === 0) {
                this.showMessage('All receipts removed. Please upload at least one payment proof.', 'warning');
            }
        }

        syncReceiptInputFromSelection() {
            if (!this.screenshotInput.length) return;

            if (typeof DataTransfer === 'undefined') {
                if (this.selectedReceipts.length === 0) {
                    this.screenshotInput.val('');
                }
                return;
            }

            const transfer = new DataTransfer();
            this.selectedReceipts.forEach((fileInfo) => {
                if (fileInfo.rawFile) {
                    transfer.items.add(fileInfo.rawFile);
                }
            });
            this.screenshotInput[0].files = transfer.files;

            if (this.selectedReceipts.length === 0) {
                this.screenshotInput.val('');
            }
        }

        async checkReceiptDuplicate(fileHash) {
            if (!fileHash) return false;

            try {
                const response = await $.ajax({
                    url: window.boa_public_data.ajax_url,
                    type: 'POST',
                    data: {
                        action: 'boa_check_duplicate_receipt',
                        file_hash: fileHash,
                        submission_id: this.submissionId || 0,
                        nonce: window.boa_public_data.nonce
                    }
                });

                return response.success && response.data.exists;
            } catch (error) {
                console.error('Error checking receipt duplicate:', error);
                return false;
            }
        }

        autoFillDiscount() {
            const remainingText = this.remainingFeeInput.val();
            if (remainingText && remainingText !== `${this.currency} 0.00`) {
                const remaining = parseFloat(remainingText.replace(/[^\d.]/g, ''));
                if (remaining > 0) {
                    this.discountInput.val(remaining.toFixed(2));
                    this.showMessage(`Discount field auto-filled with pending amount: ${this.currency} ${remaining.toFixed(2)}`, 'info');
                }
            }
        }

        validateDiscountAmount() {
            const discount = parseFloat(this.discountInput.val()) || 0;
            const remainingText = this.remainingFeeInput.val();
            const remaining = remainingText ? parseFloat(remainingText.replace(/[^\d.]/g, '')) : 0;

            if (discount > remaining) {
                this.showMessage('Discount amount cannot be greater than remaining balance.', 'error');
                this.discountInput.val(remaining.toFixed(2));
            }
        }

        setMinDueDate() {
            const today = new Date().toISOString().split('T')[0];
            this.nextDueDateInput.attr('min', today);
        }

        onCourseChange() {
            const courseId = this.courseSelect.val();
            
            if (!courseId) {
                this.currentCourseFee = 0;
                this.updateFeeFields();
                return;
            }

            const fee = $('option:selected', this.courseSelect).data('fee');
            this.currentCourseFee = parseFloat(fee) || 0;
            this.updateFeeFields();

            // Reset discount when course changes
            if (!this.isExistingSubmission) {
                this.discountInput.val('');
                this.discountReasonInput.val('');
            }
        }

        updateFeeFields() {
            this.courseFeeInput.val(`${this.currency} ${this.currentCourseFee.toFixed(2)}`);
            this.calculateRemainingFee();
        }

        calculateRemainingFee() {
            const amountPaid = parseFloat(this.amountPaidInput.val()) || 0;
            const discount = parseFloat(this.discountInput.val()) || 0;
            
            if (this.currentCourseFee === 0) {
                this.remainingFeeInput.val(`${this.currency} 0.00`);
                this.nextDueDateInput.prop('required', false).closest('.boa-form-group').hide();
                return;
            }

            let remaining = this.currentCourseFee - amountPaid - discount;
            
            if (remaining < 0) remaining = 0;

            if (amountPaid > this.currentCourseFee) {
                this.amountPaidInput.val(this.currentCourseFee);
                remaining = Math.max(0, this.currentCourseFee - discount);
            }

            this.remainingFeeInput.val(`${this.currency} ${remaining.toFixed(2)}`);
            
            if (remaining > 0) {
                this.nextDueDateInput.prop('required', true).closest('.boa-form-group').show();
            } else {
                this.nextDueDateInput.prop('required', false).closest('.boa-form-group').hide();
            }
        }

        submitForm(event) {
            event.preventDefault();
            this.clearMessages();

            // Enhanced validation
            const validation = this.validateForm();
            if (!validation.valid) {
                this.showMessage(validation.message, 'error');
                return false;
            }

            const formData = new FormData(this.form[0]);
            formData.append('action', 'boa_submit_admission_form');
            formData.append('nonce', window.boa_public_data.nonce);
            formData.append('course_fee', this.currentCourseFee);
            formData.append('is_existing_submission', this.isExistingSubmission ? '1' : '0');

            $.ajax({
                url: window.boa_public_data.ajax_url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                beforeSend: () => this.showLoading(true),
                success: (response) => {
                    if (response.success) {
                        this.showSuccessScreen(
                            formData.get('name'), 
                            this.courseSelect.find('option:selected').text(),
                            response.data
                        );
                    } else {
                        this.showMessage(response.data.message || 'An unknown error occurred.', 'error');
                        this.showLoading(false);
                    }
                },
                error: (xhr) => {
                    this.showMessage('A network error occurred: ' + xhr.statusText, 'error');
                    this.showLoading(false);
                }
            });

            return false;
        }

        validateForm() {
            const name = $('#boa-form-name').val().trim();
            const email = $('#boa-form-email').val().trim();
            const phone = $('#boa-form-phone').val().trim();
            const city = $('#boa-form-city').val().trim();
            const courseId = this.courseSelect.val();
            const amountPaid = parseFloat(this.amountPaidInput.val()) || 0;

            if (!name || !email || !phone || !city || !courseId) {
                return { valid: false, message: 'All required fields must be filled.' };
            }

            if (!this.isValidEmail(email)) {
                return { valid: false, message: 'Please enter a valid email address.' };
            }

            if (!this.isValidPhone(phone)) {
                return { valid: false, message: 'Please enter a valid phone number.' };
            }

            if (this.currentCourseFee > 0 && amountPaid === 0) {
                return { 
                    valid: false, 
                    message: 'Please enter the amount you have paid or select a course with zero fee.' 
                };
            }

            if (amountPaid > this.currentCourseFee) {
                return { 
                    valid: false, 
                    message: 'Amount paid cannot be greater than course fee.' 
                };
            }

            // Check if receipt is uploaded for new submissions
            if (!this.isExistingSubmission && this.screenshotInput[0].files.length === 0) {
                return { valid: false, message: 'Please upload at least one payment screenshot.' };
            }

            return { valid: true };
        }

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        isValidPhone(phone) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            return phoneRegex.test(phone);
        }

        showLoading(isLoading) {
            if (isLoading) {
                this.submitButton.hide();
                this.loader.show();
            } else {
                this.submitButton.show();
                this.loader.hide();
            }
        }

        showMessage(message, type = 'error') {
            const iconClass = type === 'success' ? 'dashicons dashicons-yes' : 
                             type === 'warning' ? 'dashicons dashicons-warning' :
                             type === 'info' ? 'dashicons dashicons-info' :
                             'dashicons dashicons-dismiss';
            
            this.messagesContainer.html(`
                <div class="boa-message boa-${type}">
                    <span class="${iconClass}"></span>
                    <span>${message}</span>
                </div>
            `);
            this.messagesContainer.slideDown();
            $('html, body').animate({ scrollTop: this.formRoot.offset().top - 50 }, 500);
        }

        clearMessages() {
            this.messagesContainer.slideUp(() => {
                this.messagesContainer.empty();
            });
        }

        showSuccessScreen(studentName, courseName, responseData) {
            const successHtml = this.successTemplate.html();
            this.formRoot.html(successHtml);
            this.formRoot.find('.boa-student-name').text(studentName);
            this.formRoot.find('.boa-course-name').text(courseName);
            this.showTrackingDetails(responseData);
            $('html, body').animate({ scrollTop: this.formRoot.offset().top - 50 }, 500);
        }

        showTrackingDetails(responseData = {}) {
            const trackingBox = this.formRoot.find('.boa-tracking-info');
            if (!trackingBox.length) return;

            const token = responseData?.tracking_token || '';
            if (!token) {
                trackingBox.hide();
                return;
            }

            trackingBox.find('.boa-tracking-token').text(token);
            const linkHolder = trackingBox.find('.boa-tracking-link');
            if (this.statusPageUrl) {
                const linkLabel = window.boa_public_data?.status_link_label || 'Track your application here.';
                linkHolder.html(`<a href="${this.statusPageUrl}" target="_blank" rel="noopener">${linkLabel}</a>`);
            } else {
                linkHolder.text(window.boa_public_data?.status_note || 'Keep this tracking code safe to check your application progress.');
            }
            trackingBox.show();
        }
        
        resetForm() {
            location.reload();
        }

        closeForm() {
            window.history.back();
        }

        loadApplicantHistory(email, phone) {
            if (!this.historyPanel.length) return;
            this.showHistoryPanelMessage('Checking previous activity...');

            $.ajax({
                url: window.boa_public_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_get_applicant_history',
                    nonce: window.boa_public_data.nonce,
                    is_public: 1,
                    email: email,
                    phone: phone
                }
            }).done((response) => {
                if (response.success) {
                    this.renderHistoryPanel(response.data);
                } else {
                    this.showHistoryPanelMessage(response?.data?.message || 'History data unavailable.');
                }
            }).fail((error) => {
                console.error('History fetch error', error);
                this.showHistoryPanelMessage('Unable to load previous activity right now.');
            });
        }

        renderHistoryPanel(data) {
            if (!this.historyPanel.length) return;
            const submissions = Array.isArray(data?.submissions) ? data.submissions : [];
            const enrollments = Array.isArray(data?.enrollments) ? data.enrollments : [];

            if (!submissions.length && !enrollments.length) {
                this.showHistoryPanelMessage('No previous applications found for this contact.');
                return;
            }

            let html = '<h5>Previous Activity</h5>';
            if (submissions.length) {
                html += '<strong>Recent Applications</strong><ul class="boa-history-list">';
                submissions.forEach((item) => {
                    const courseName = this.escapeHtml(item.course_name || 'Course');
                    const status = this.escapeHtml(item.status || 'Pending');
                    html += `<li>${courseName} - ${status} (${this.formatDate(item.submission_date)})</li>`;
                });
                html += '</ul>';
            }
            if (enrollments.length) {
                html += '<strong>Existing Enrollments</strong><ul class="boa-history-list">';
                enrollments.forEach((item) => {
                    const courseName = this.escapeHtml(item.course_name || 'Course');
                    const status = this.escapeHtml(item.status || 'Enrolled');
                    html += `<li>${courseName} - ${status} (${this.formatDate(item.admission_date)})</li>`;
                });
                html += '</ul>';
            }

            this.historyPanel.html(html).show();
        }



        formatDate(value) {
            if (!value) return '--';
            const date = new Date(value.replace(' ', 'T'));
            if (Number.isNaN(date.getTime())) {
                return value;
            }
            return date.toLocaleString();
        }

        updateProgress() {
            if (!this.progressBar.length || !this.progressSteps.length) return;

            const receiptCount = (this.screenshotInput.length && this.screenshotInput[0].files)
                ? this.screenshotInput[0].files.length
                : 0;
            const sections = [
                this.isSectionFilled(['#boa-form-name', '#boa-form-email', '#boa-form-phone', '#boa-form-city']),
                this.isSectionFilled(['#boa-form-course', '#boa-form-amount-paid']),
                receiptCount > 0 || this.selectedReceipts.length > 0
            ];

            const completedCount = sections.filter(Boolean).length;
            const total = sections.length;
            this.progressBar.css('width', `${(completedCount / total) * 100}%`);

            this.progressSteps.removeClass('completed active');
            this.progressSteps.each((index, element) => {
                if (index < completedCount) {
                    $(element).addClass('completed');
                } else if (index === completedCount) {
                    $(element).addClass('active');
                }
            });
        }

        isSectionFilled(selectors) {
            return selectors.every((selector) => {
                const field = this.form.find(selector);
                if (!field.length) return false;
                if (field.attr('type') === 'file') {
                    return field[0].files.length > 0;
                }
                const value = field.val();
                return value !== undefined && value !== null && value.toString().trim() !== '';
            });
        }

        showHistoryPanelMessage(message) {
            if (!this.historyPanel.length) return;
            const safeMessage = this.escapeHtml(message || '');
            this.historyPanel.html(`<p class="boa-history-note">${safeMessage}</p>`).show();
        }

        escapeHtml(value) {
            return String(value || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
    }

    // === Global Instance ===
    window.BOA_PublicForm = new BOA_Admission_Form();
    
    $(document).ready(function() {
        if (!window.BOA_PublicForm) {
            window.BOA_PublicForm = new BOA_Admission_Form();
        }
    });

})(jQuery);

// ✅ Syntax verified block end
