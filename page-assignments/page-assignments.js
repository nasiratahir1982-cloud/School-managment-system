(function($) {
    'use strict';

    const settings = window.boa_assignments_data || {};
    const ajaxUrl = settings.ajax_url || (typeof ajaxurl !== 'undefined' ? ajaxurl : '');
    const nonce = settings.nonce || '';
    const i18n = settings.i18n || {};

    const state = {
        page: 1,
        perPage: 10,
        total: 0,
        cache: {}
    };

    function escapeHtml(value) {
        return $('<div/>').text(value == null ? '' : value).html();
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/"/g, '&quot;');
    }

    function notify(message) {
        window.alert(message);
    }

    function responseMessage(response, fallback) {
        return response && response.data && response.data.message ? response.data.message : fallback;
    }

    function formatDate(dateString) {
        if (!dateString) {
            return 'N/A';
        }
        const parsed = new Date(dateString.replace(' ', 'T'));
        if (Number.isNaN(parsed.getTime())) {
            return dateString;
        }
        return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function resetForm() {
        $('#boa-assignment-id').val('0');
        $('#boa-assignment-form')[0].reset();
    }

    function populateForm(assignment) {
        if (!assignment) {
            return;
        }
        $('#boa-assignment-id').val(assignment.assignment_id);
        $('#boa-assignment-course').val(assignment.course_id);
        $('#boa-assignment-title').val(assignment.title);
        $('#boa-assignment-description').val(assignment.description);
        $('#boa-assignment-instructions').val(assignment.instructions);
        $('#boa-assignment-attachment').val(assignment.attachment_url);
        $('#boa-assignment-max').val(assignment.max_marks);
        $('#boa-assignment-due').val(assignment.due_date ? assignment.due_date.substring(0, 10) : '');
        $('#boa-assignment-status').val(assignment.status);
    }

    function renderPagination() {
        const container = $('#boa-assignments-pagination');
        if (!state.total) {
            container.empty();
            return;
        }
        const totalPages = Math.ceil(state.total / state.perPage);
        const start = (state.page - 1) * state.perPage + 1;
        const end = Math.min(state.total, state.page * state.perPage);
        const rangeText = (i18n.range || 'Showing %1$s-%2$s of %3$s assignments')
            .replace('%1$s', start)
            .replace('%2$s', end)
            .replace('%3$s', state.total);

        container.html(`
            <div class="boa-pagination-info">${escapeHtml(rangeText)}</div>
            <div class="boa-pagination-controls">
                <button type="button" data-nav="prev" ${state.page === 1 ? 'disabled' : ''}>${escapeHtml(i18n.prev || 'Previous')}</button>
                <button type="button" data-nav="next" ${state.page >= totalPages ? 'disabled' : ''}>${escapeHtml(i18n.next || 'Next')}</button>
            </div>
        `);
    }

    function renderAssignments(items) {
        const tbody = $('#boa-assignments-tbody');
        if (!items.length) {
            tbody.html(`<tr><td colspan="5">${escapeHtml(i18n.empty || 'No assignments available.')}</td></tr>`);
            return;
        }

        const rows = items.map((item) => {
            const badge = `<span class="boa-status-badge boa-status-${escapeHtml(item.status)}">${escapeHtml(item.status)}</span>`;
            return `
                <tr data-assignment="${item.assignment_id}">
                    <td data-label="${escapeHtml(i18n.title || 'Title')}">
                        <strong>${escapeHtml(item.title)}</strong>
                        ${item.description ? `<p class="boa-muted">${escapeHtml(item.description)}</p>` : ''}
                    </td>
                    <td data-label="${escapeHtml(i18n.course || 'Course')}">${escapeHtml(item.course_name || '-')}</td>
                    <td data-label="${escapeHtml(i18n.dueDate || 'Due Date')}">${escapeHtml(formatDate(item.due_date))}</td>
                    <td data-label="${escapeHtml(i18n.status || 'Status')}">${badge}</td>
                    <td data-label="${escapeHtml(i18n.actions || 'Actions')}">
                        <div class="boa-table-actions">
                            <button class="boa-btn boa-btn-sm boa-btn-outline" data-action="edit">${escapeHtml(i18n.edit || 'Edit')}</button>
                            <button class="boa-btn boa-btn-sm boa-btn-delete" data-action="delete">${escapeHtml(i18n.delete || 'Delete')}</button>
                        </div>
                    </td>
                </tr>
            `;
        });
        tbody.html(rows.join(''));
    }

    function loadAssignments() {
        const tbody = $('#boa-assignments-tbody');
        tbody.html(`<tr><td colspan="5">${escapeHtml(i18n.loading || 'Loading assignments...')}</td></tr>`);
        const previousSelection = $('#boa-submission-assignment').val();

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_get_assignments',
                nonce,
                page: state.page,
                per_page: state.perPage,
                search: $('#boa-assignment-search').val(),
                course_id: $('#boa-assignment-filter-course').val(),
                status: $('#boa-assignment-filter-status').val()
            }
        }).done((response) => {
            if (!response || !response.success) {
                tbody.html(`<tr><td colspan="5">${escapeHtml(responseMessage(response, 'Unable to load assignments.'))}</td></tr>`);
                return;
            }
            const items = response.data.items || [];
            state.total = response.data.total || 0;
            state.cache = {};
            const select = $('#boa-submission-assignment');
            select.html(`<option value="">${escapeHtml(i18n.chooseAssignment || 'Select assignment')}</option>`);

            items.forEach((assignment) => {
                state.cache[assignment.assignment_id] = assignment;
                select.append(`<option value="${assignment.assignment_id}">${escapeHtml(assignment.title)}</option>`);
            });

            if (previousSelection) {
                select.val(previousSelection);
            }

            renderAssignments(items);
            renderPagination();
        });
    }

    function loadSubmissions(assignmentId) {
        const tbody = $('#boa-submissions-tbody');
        if (!assignmentId) {
            tbody.html(`<tr><td colspan="5">${escapeHtml(i18n.selectSubmissionPrompt || 'Select an assignment to view submissions.')}</td></tr>`);
            return;
        }
        tbody.html(`<tr><td colspan="5">${escapeHtml(i18n.loading || 'Loading...')}</td></tr>`);

        $.post(ajaxUrl, { action: 'boa_get_assignment_submissions', nonce, assignment_id: assignmentId }, (response) => {
            if (!response || !response.success) {
                tbody.html(`<tr><td colspan="5">${escapeHtml(responseMessage(response, 'Unable to load submissions.'))}</td></tr>`);
                return;
            }
            const submissions = response.data.submissions || [];
            if (!submissions.length) {
                tbody.html(`<tr><td colspan="5">${escapeHtml(i18n.noSubmissions || 'No submissions yet.')}</td></tr>`);
                return;
            }
            const rows = submissions.map((submission) => {
                const marks = (submission.marks === null || typeof submission.marks === 'undefined') ? '-' : submission.marks;
                return `
                    <tr>
                        <td data-label="${escapeHtml(i18n.student || 'Student')}">${escapeHtml(submission.student_name || '-')}<br><small>${escapeHtml(submission.student_email || '')}</small></td>
                        <td data-label="${escapeHtml(i18n.submittedAt || 'Submitted At')}">${escapeHtml(formatDate(submission.submission_date))}</td>
                        <td data-label="${escapeHtml(i18n.marks || 'Marks')}">${escapeHtml(marks)}</td>
                        <td data-label="${escapeHtml(i18n.status || 'Status')}">${escapeHtml(submission.status || '')}</td>
                        <td data-label="${escapeHtml(i18n.actions || 'Actions')}">
                            <div class="boa-table-actions">
                                <a href="${escapeAttr(submission.file_url)}" target="_blank" class="boa-btn boa-btn-sm">${escapeHtml(i18n.view || 'View')}</a>
                                <button class="boa-btn boa-btn-sm boa-btn-primary boa-grade-btn"
                                    data-submission="${submission.submission_id}"
                                    data-marks="${escapeAttr(marks)}"
                                    data-remarks="${escapeAttr(submission.remarks || '')}"
                                    data-feedback="${escapeAttr(submission.feedback || '')}">
                                    ${escapeHtml(i18n.grade || 'Grade')}
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
            tbody.html(rows.join(''));
        });
    }

    function toggleGradeModal(show) {
        const modal = $('#boa-grade-modal');
        if (show) {
            modal.addClass('is-visible').attr('aria-hidden', 'false');
        } else {
            modal.removeClass('is-visible').attr('aria-hidden', 'true');
            $('#boa-grade-form')[0].reset();
            $('#boa-grade-submission-id').val('0');
        }
    }

    function openGradeModal(data) {
        $('#boa-grade-submission-id').val(data.submission);
        $('#boa-grade-marks').val(data.marks && data.marks !== '—' ? data.marks : '');
        $('#boa-grade-remarks').val(data.remarks || '');
        $('#boa-grade-feedback').val(data.feedback || '');
        toggleGradeModal(true);
    }

    function bindEvents() {
        $('#boa-assignment-form').on('submit', function(e) {
            e.preventDefault();
            $.post(ajaxUrl, {
                action: 'boa_save_assignment',
                nonce,
                assignment_id: $('#boa-assignment-id').val(),
                course_id: $('#boa-assignment-course').val(),
                title: $('#boa-assignment-title').val(),
                description: $('#boa-assignment-description').val(),
                instructions: $('#boa-assignment-instructions').val(),
                attachment_url: $('#boa-assignment-attachment').val(),
                max_marks: $('#boa-assignment-max').val(),
                due_date: $('#boa-assignment-due').val(),
                status: $('#boa-assignment-status').val()
            }, (response) => {
                if (response && response.success) {
                    notify(i18n.saved || 'Assignment saved.');
                    resetForm();
                    loadAssignments();
                } else {
                    notify(responseMessage(response, 'Unable to save assignment.'));
                }
            });
        });

        $('#boa-reset-assignment').on('click', function() {
            resetForm();
        });

        $('#boa-assignment-search, #boa-assignment-filter-course, #boa-assignment-filter-status').on('input change', function() {
            state.page = 1;
            loadAssignments();
        });

        $('#boa-refresh-assignments').on('click', function() {
            loadAssignments();
        });

        $('#boa-assignments-pagination').on('click', 'button[data-nav]', function() {
            const nav = $(this).data('nav');
            const totalPages = Math.ceil(state.total / state.perPage);
            if (nav === 'prev' && state.page > 1) {
                state.page -= 1;
                loadAssignments();
            } else if (nav === 'next' && state.page < totalPages) {
                state.page += 1;
                loadAssignments();
            }
        });

        $('#boa-assignments-tbody').on('click', 'button', function() {
            const action = $(this).data('action');
            const assignmentId = $(this).closest('tr').data('assignment');
            const assignment = state.cache[assignmentId];
            if (action === 'delete') {
                if (!window.confirm(i18n.confirmDelete || 'Delete this assignment?')) {
                    return;
                }
                $.post(ajaxUrl, { action: 'boa_delete_assignment', nonce, assignment_id: assignmentId }, (response) => {
                    if (response && response.success) {
                        loadAssignments();
                    } else {
                        notify(responseMessage(response, 'Unable to delete assignment.'));
                    }
                });
            } else if (action === 'edit') {
                populateForm(assignment);
                $('html, body').animate({ scrollTop: $('#boa-assignment-form').offset().top - 40 }, 300);
            }
        });

        $('#boa-submission-assignment').on('change', function() {
            loadSubmissions($(this).val());
        });

        $('#boa-submissions-tbody').on('click', '.boa-grade-btn', function() {
            openGradeModal({
                submission: $(this).data('submission'),
                marks: $(this).data('marks'),
                remarks: $(this).data('remarks'),
                feedback: $(this).data('feedback')
            });
        });

        $('#boa-grade-form').on('submit', function(e) {
            e.preventDefault();
            const submissionId = $('#boa-grade-submission-id').val();
            if (!submissionId) {
                return;
            }
            $.post(ajaxUrl, {
                action: 'boa_grade_assignment',
                nonce,
                submission_id: submissionId,
                marks: $('#boa-grade-marks').val(),
                remarks: $('#boa-grade-remarks').val(),
                feedback: $('#boa-grade-feedback').val()
            }, (response) => {
                if (response && response.success) {
                    notify(i18n.gradeSaved || 'Submission graded.');
                    toggleGradeModal(false);
                    $('#boa-submission-assignment').trigger('change');
                } else {
                    notify(responseMessage(response, 'Unable to grade submission.'));
                }
            });
        });

        $(document).on('click', '[data-dismiss="grade-modal"]', function() {
            toggleGradeModal(false);
        });

        $(document).on('keydown', function(e) {
            if (e.key === 'Escape') {
                toggleGradeModal(false);
            }
        });
    }

    $(function() {
        bindEvents();
        loadAssignments();
    });
})(jQuery);
