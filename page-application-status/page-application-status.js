// Application status checker
(function($) {
    'use strict';

    class BOA_Status_Checker {
        constructor() {
            this.form = $('#boa-status-form');
            if (!this.form.length) return;

            this.messageBox = $('#boa-status-message');
            this.resultBox = $('#boa-status-result');
            this.loader = $('#boa-status-loader');
            this.statusLabel = $('#boa-status-label');
            this.statusCourse = $('#boa-status-course');
            this.statusSubmitted = $('#boa-status-submitted');
            this.statusUpdated = $('#boa-status-updated');
            this.statusTracking = $('#boa-status-tracking');
            this.statusNotes = $('#boa-status-notes');
            this.statusTimeline = $('#boa-status-timeline');

            this.bindEvents();
        }

        bindEvents() {
            this.form.on('submit', (e) => this.handleSubmit(e));
        }

        handleSubmit(event) {
            event.preventDefault();

            const trackingCode = $('#boa-status-token').val().trim();
            const email = $('#boa-status-email').val().trim();
            const phone = $('#boa-status-phone').val().trim();

            if (!trackingCode || (!email && !phone)) {
                this.showMessage(boa_status_data?.messages?.required || 'Please enter all required fields.', 'error');
                return;
            }

            this.showMessage('', 'info', false);
            this.toggleLoader(true);
            this.resultBox.hide();

            $.ajax({
                url: boa_status_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_check_application_status',
                    nonce: boa_status_data.nonce,
                    tracking_token: trackingCode,
                    email: email,
                    phone: phone
                }
            }).done((response) => {
                if (response.success) {
                    this.renderResult(response.data);
                } else {
                    this.showMessage(response.data?.message || boa_status_data?.messages?.not_found, 'error');
                }
            }).fail(() => {
                this.showMessage('Unable to fetch application status at the moment.', 'error');
            }).always(() => {
                this.toggleLoader(false);
            });
        }

        renderResult(data) {
            if (!data) {
                this.showMessage(boa_status_data?.messages?.not_found, 'error');
                return;
            }

            this.statusLabel.text(data.status_label || data.status || '').removeClass('status-approved status-rejected status-pending');
            this.statusLabel.addClass(this.getStatusClass(data.status));
            this.statusCourse.text(data.course_name || '—');
            this.statusSubmitted.text(this.formatDate(data.submission_date));
            this.statusUpdated.text(this.formatDate(data.status_updated_at));
            this.statusTracking.text(data.tracking_token || '—');

            if (data.status_notes) {
                this.statusNotes.show().find('p').text(data.status_notes);
            } else {
                this.statusNotes.hide();
            }

            this.renderTimeline(data.timeline || []);

            this.resultBox.fadeIn();
        }

        renderTimeline(entries) {
            if (!entries.length) {
                this.statusTimeline.hide();
                return;
            }

            const items = entries.map((item) => {
                return `<li>
                    <span class="boa-timeline-label">${item.label || ''}</span>
                    <span class="boa-timeline-date">${this.formatDate(item.date)}</span>
                </li>`;
            }).join('');

            this.statusTimeline.html(`<ul>${items}</ul>`).show();
        }

        formatDate(value) {
            if (!value) return '—';
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) {
                return value;
            }
            return date.toLocaleString();
        }

        getStatusClass(status) {
            switch (status) {
                case 'approved':
                    return 'status-approved';
                case 'rejected':
                    return 'status-rejected';
                default:
                    return 'status-pending';
            }
        }

        showMessage(message, type = 'info', show = true) {
            if (!show || !message) {
                this.messageBox.hide().text('');
                return;
            }
            this.messageBox.removeClass('boa-message-error boa-message-success boa-message-info');
            this.messageBox.addClass(
                type === 'error' ? 'boa-message-error' :
                (type === 'success' ? 'boa-message-success' : 'boa-message-info')
            );
            this.messageBox.text(message).fadeIn();
        }

        toggleLoader(show) {
            if (show) {
                this.loader.show();
            } else {
                this.loader.hide();
            }
        }
    }

    $(document).ready(function() {
        new BOA_Status_Checker();
    });

})(jQuery);
