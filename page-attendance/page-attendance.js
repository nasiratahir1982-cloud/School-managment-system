(function($) {
    'use strict';

    const settings = window.boa_attendance_data || {};
    const ajaxUrl = settings.ajax_url || (typeof ajaxurl !== 'undefined' ? ajaxurl : '');
    const nonce = settings.nonce || '';
    const statuses = settings.statuses || {};
    const i18n = settings.i18n || {};

    const selectors = {
        course: '#boa-attendance-course',
        date: '#boa-attendance-date',
        tbody: '#boa-attendance-tbody',
        summary: '#boa-attendance-summary',
        helper: '#boa-attendance-helper'
    };

    function showMessage(message) {
        window.alert(message);
    }

    function responseMessage(response, fallback) {
        return response && response.data && response.data.message ? response.data.message : fallback;
    }

    function requireFilters() {
        const course = $(selectors.course).val();
        const date = $(selectors.date).val();
        if (!course || !date) {
            showMessage(i18n.selectFilters || 'Select a course and date to begin.');
            return false;
        }
        return { course, date };
    }

    function renderSummary(counts) {
        const summary = $(selectors.summary);
        summary.find('[data-type="present"] strong').text(counts.present || 0);
        summary.find('[data-type="absent"] strong').text(counts.absent || 0);
        summary.find('[data-type="late"] strong').text(counts.late || 0);
        summary.find('[data-type="unmarked"] strong').text(counts.unmarked || 0);
    }

    function buildStatusOptions(selected) {
        return Object.keys(statuses).map((key) => {
            const label = statuses[key];
            const isSelected = key === selected ? 'selected' : '';
            return `<option value="${key}" ${isSelected}>${label}</option>`;
        }).join('');
    }

    function renderTable(data) {
        const tbody = $(selectors.tbody);
        if (!data.students || !data.students.length) {
            tbody.html(`<tr><td colspan="3">${i18n.noStudents || 'No students found for this course.'}</td></tr>`);
            renderSummary({ present: 0, absent: 0, late: 0, unmarked: 0 });
            return;
        }

        const rows = data.students.map((student) => {
            const select = `
                <select class="boa-attendance-status">
                    <option value="">--</option>
                    ${buildStatusOptions(student.status || '')}
                </select>
            `;
            return `
                <tr data-student="${student.student_id}">
                    <td data-label="${escapeHtml(i18n.student || 'Student')}">
                        <strong>${student.name}</strong>
                        <br><small>${student.student_uid} &bull; ${student.email}</small>
                    </td>
                    <td data-label="${escapeHtml(i18n.status || 'Status')}">${select}</td>
                    <td data-label="${escapeHtml(i18n.remarks || 'Remarks')}">
                        <input type="text" class="boa-attendance-remarks" placeholder="${i18n.remarks || 'Remarks'}" value="${student.remarks || ''}">
                    </td>
                </tr>
            `;
        });

        tbody.html(rows.join(''));
        updateSummaryFromTable();
    }

    function updateSummaryFromTable() {
        const counts = { present: 0, absent: 0, late: 0, unmarked: 0 };
        $('#boa-attendance-tbody tr').each(function() {
            const value = $(this).find('.boa-attendance-status').val();
            if (!value) {
                counts.unmarked += 1;
            } else if (counts[value] !== undefined) {
                counts[value] += 1;
            }
        });
        renderSummary(counts);
    }

    function fetchAttendance() {
        const filters = requireFilters();
        if (!filters) {
            return;
        }

        $(selectors.helper).text(i18n.loading || 'Loading attendance...');
        $(selectors.tbody).html(`<tr><td colspan="3">${i18n.loading || 'Loading attendance...'}</td></tr>`);

        $.post(ajaxUrl, {
            action: 'boa_get_daily_attendance',
            nonce,
            course_id: filters.course,
            attendance_date: filters.date
        }).done((response) => {
            if (response && response.success) {
                renderTable(response.data);
                $(selectors.helper).text('');
            } else {
                showMessage(responseMessage(response, 'Unable to load attendance.'));
            }
        }).fail(() => {
            showMessage('Network error while loading attendance.');
        });
    }

    function gatherAttendancePayload() {
        const records = [];
        $('#boa-attendance-tbody tr').each(function() {
            const studentId = $(this).data('student');
            if (!studentId) {
                return;
            }
            const status = $(this).find('.boa-attendance-status').val();
            const remarks = $(this).find('.boa-attendance-remarks').val();
            records.push({
                student_id: studentId,
                status,
                remarks
            });
        });
        return records;
    }

    function saveAttendance() {
        const filters = requireFilters();
        if (!filters) {
            return;
        }

        const payload = gatherAttendancePayload();
        if (!payload.length) {
            showMessage(i18n.noStudents || 'No students to save.');
            return;
        }

        if (i18n.confirmSave && !window.confirm(i18n.confirmSave)) {
            return;
        }

        $('#boa-attendance-save').prop('disabled', true);
        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_save_daily_attendance',
                nonce,
                course_id: filters.course,
                attendance_date: filters.date,
                attendance: JSON.stringify(payload)
            }
        }).done((response) => {
            if (response && response.success) {
                showMessage(i18n.saved || 'Attendance saved.');
                fetchAttendance();
            } else {
                showMessage(responseMessage(response, 'Unable to save attendance.'));
            }
        }).fail(() => {
            showMessage('Network error while saving attendance.');
        }).always(() => {
            $('#boa-attendance-save').prop('disabled', false);
        });
    }

    function markAll(value) {
        $('#boa-attendance-tbody .boa-attendance-status').val(value);
        updateSummaryFromTable();
    }

    function bindEvents() {
        $('#boa-attendance-load').on('click', fetchAttendance);
        $('#boa-attendance-refresh').on('click', fetchAttendance);
        $('#boa-attendance-save').on('click', saveAttendance);
        $('#boa-attendance-mark-present').on('click', () => markAll('present'));
        $('#boa-attendance-mark-absent').on('click', () => markAll('absent'));
        $(document).on('change', '.boa-attendance-status', updateSummaryFromTable);
    }

    $(function() {
        if (settings.today && !$(selectors.date).val()) {
            $(selectors.date).val(settings.today);
        }
        bindEvents();
    });
})(jQuery);
