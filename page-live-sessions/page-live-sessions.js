// Live sessions admin dashboard
(function($) {
    'use strict';

    class BOA_Live_Sessions {
        constructor() {
            this.state = {
                page: 1,
                per_page: 10,
                course_id: '',
                status: '',
                search: ''
            };

            this.tableBody = $('#boa-live-sessions-tbody');
            this.courseFilter = $('#boa-session-course-filter');
            this.statusFilter = $('#boa-session-status-filter');
            this.searchInput = $('#boa-session-search');
            this.refreshBtn = $('#boa-session-refresh');
            this.addBtn = $('#boa-session-add-btn');

            this.modal = $('#boa-session-modal');
            this.modalTitle = $('#boa-session-modal-title');
            this.modalClose = $('#boa-session-modal-close');
            this.sessionForm = $('#boa-session-form');
            this.saveBtn = $('#boa-session-save');
            this.cancelBtn = $('#boa-session-cancel');

            this.attendanceModal = $('#boa-attendance-modal');
            this.attendanceTable = $('#boa-attendance-tbody');
            this.attendanceClose = $('#boa-attendance-close, #boa-attendance-done');

            this.populateCourses();
            this.bindEvents();
            this.fetchSessions();
        }

        populateCourses() {
            const courses = window.boa_live_sessions_data?.courses || [];
            const selectElements = [this.courseFilter, $('#boa-session-course')];
            selectElements.forEach((select) => {
                if (!select.length) return;
                const firstOption = select.is('#boa-session-course')
                    ? '<option value="">' + (boa_live_sessions_data.i18n?.noCourse || 'Optional') + '</option>'
                    : '<option value="">' + (boa_live_sessions_data.i18n?.allCourses || 'All Courses') + '</option>';
                select.html(firstOption + courses.map(course => `<option value="${course.course_id}">${course.course_name}</option>`).join(''));
            });
        }

        bindEvents() {
            this.courseFilter.on('change', () => {
                this.state.course_id = this.courseFilter.val();
                this.fetchSessions();
            });
            this.statusFilter.on('change', () => {
                this.state.status = this.statusFilter.val();
                this.fetchSessions();
            });
            this.searchInput.on('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.state.search = this.searchInput.val();
                    this.fetchSessions();
                }
            });
            this.refreshBtn.on('click', () => this.fetchSessions());
            this.addBtn.on('click', () => this.openModal());
            this.modalClose.on('click', () => this.closeModal());
            this.cancelBtn.on('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
            this.saveBtn.on('click', (e) => {
                e.preventDefault();
                this.saveSession();
            });
            this.attendanceClose.on('click', () => this.closeAttendanceModal());
        }

        fetchSessions() {
            this.tableBody.html(`<tr><td colspan="6">${boa_live_sessions_data.i18n?.loading || 'Loading...'}</td></tr>`);
            $.ajax({
                url: boa_live_sessions_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_get_live_sessions',
                    nonce: boa_live_sessions_data.nonce,
                    page: this.state.page,
                    per_page: this.state.per_page,
                    course_id: this.state.course_id,
                    status: this.state.status,
                    search: this.state.search
                }
            }).done((response) => {
                if (response.success) {
                    this.renderSessions(response.data.items || []);
                } else {
                    this.tableBody.html(`<tr><td colspan="6">${response.data?.message || 'Unable to load sessions.'}</td></tr>`);
                }
            }).fail(() => {
                this.tableBody.html(`<tr><td colspan="6">Network error</td></tr>`);
            });
        }

        renderSessions(sessions) {
            if (!sessions.length) {
                this.tableBody.html(`<tr><td colspan="6">${boa_live_sessions_data.i18n?.noSessions || 'No sessions found.'}</td></tr>`);
                return;
            }

            const rows = sessions.map(session => {
                const date = this.formatDate(session.start_time);
                const statusClass = this.getStatusClass(session.status);
                return `<tr data-session='${JSON.stringify(session)}'>
                    <td data-label="Session">
                        <strong>${session.session_title}</strong><br>
                        <small>${session.platform || ''}</small>
                    </td>
                    <td data-label="Course">${session.course_name || '-'}</td>
                    <td data-label="Start Time">${date}</td>
                    <td data-label="Instructor">${session.instructor_name || '-'}</td>
                    <td data-label="Status"><span class="boa-session-status ${statusClass}">${session.status || 'scheduled'}</span></td>
                    <td data-label="Actions">
                        <div class="boa-table-actions">
                            <button class="boa-btn boa-btn-sm boa-btn-outline" data-action="edit">${boa_live_sessions_data.i18n?.edit || 'Edit'}</button>
                            <button class="boa-btn boa-btn-sm boa-btn-outline" data-action="attendance">${boa_live_sessions_data.i18n?.attendance || 'Attendance'}</button>
                            <button class="boa-btn boa-btn-sm boa-btn-danger" data-action="delete">${boa_live_sessions_data.i18n?.delete || 'Delete'}</button>
                        </div>
                    </td>
                </tr>`;
            }).join('');

            this.tableBody.html(rows);
            this.tableBody.find('button').on('click', (e) => {
                const action = $(e.currentTarget).data('action');
                const session = $(e.currentTarget).closest('tr').data('session');
                if (action === 'edit') {
                    this.openModal(session);
                } else if (action === 'attendance') {
                    this.loadAttendance(session.session_id);
                } else if (action === 'delete') {
                    this.deleteSession(session.session_id);
                }
            });
        }

        openModal(session = null) {
            this.sessionForm[0].reset();
            $('#boa-session-id').val(session?.session_id || '');
            $('#boa-session-title').val(session?.session_title || '');
            $('#boa-session-course').val(session?.course_id || '');
            $('#boa-session-start').val(session ? this.toLocalInput(session.start_time) : '');
            $('#boa-session-end').val(session && session.end_time ? this.toLocalInput(session.end_time) : '');
            $('#boa-session-instructor').val(session?.instructor_name || '');
            $('#boa-session-platform').val(session?.platform || '');
            $('#boa-session-join').val(session?.join_url || '');
            $('#boa-session-host').val(session?.host_url || '');
            $('#boa-session-status').val(session?.status || 'scheduled');
            $('#boa-session-duration').val(session?.duration_minutes || '');

            this.modalTitle.text(session ? boa_live_sessions_data.i18n?.editSession || 'Edit Session' : boa_live_sessions_data.i18n?.newSession || 'Create Live Session');
            this.modal.addClass('boa-modal-open');
        }

        closeModal() {
            this.modal.removeClass('boa-modal-open');
        }

        saveSession() {
            const formData = {
                action: 'boa_save_live_session',
                nonce: boa_live_sessions_data.nonce,
                session_id: $('#boa-session-id').val(),
                session_title: $('#boa-session-title').val(),
                course_id: $('#boa-session-course').val(),
                start_time: $('#boa-session-start').val(),
                end_time: $('#boa-session-end').val(),
                instructor_name: $('#boa-session-instructor').val(),
                platform: $('#boa-session-platform').val(),
                join_url: $('#boa-session-join').val(),
                host_url: $('#boa-session-host').val(),
                status: $('#boa-session-status').val(),
                duration_minutes: $('#boa-session-duration').val()
            };

            if (!formData.session_title || !formData.start_time) {
                alert(boa_live_sessions_data.i18n?.required || 'Please fill all required fields.');
                return;
            }

            this.saveBtn.prop('disabled', true).text(boa_live_sessions_data.i18n?.saving || 'Saving...');

            $.post(boa_live_sessions_data.ajax_url, formData)
                .done((response) => {
                    if (response.success) {
                        this.closeModal();
                        this.fetchSessions();
                    } else {
                        alert(response.data?.message || 'Unable to save session.');
                    }
                })
                .fail(() => alert('Network error'))
                .always(() => this.saveBtn.prop('disabled', false).text(boa_live_sessions_data.i18n?.save || 'Save Session'));
        }

        deleteSession(sessionId) {
            if (!confirm(boa_live_sessions_data.i18n?.confirmDelete || 'Delete this session?')) {
                return;
            }

            $.post(boa_live_sessions_data.ajax_url, {
                action: 'boa_delete_live_session',
                nonce: boa_live_sessions_data.nonce,
                session_id: sessionId
            }).done((response) => {
                if (response.success) {
                    this.fetchSessions();
                } else {
                    alert(response.data?.message || 'Unable to delete session.');
                }
            }).fail(() => alert('Network error'));
        }

        loadAttendance(sessionId) {
            this.attendanceTable.html(`<tr><td colspan="5">${boa_live_sessions_data.i18n?.loading || 'Loading...'}</td></tr>`);
            this.attendanceModal.addClass('boa-modal-open');

            $.post(boa_live_sessions_data.ajax_url, {
                action: 'boa_get_session_attendance',
                nonce: boa_live_sessions_data.nonce,
                session_id: sessionId
            }).done((response) => {
                if (response.success) {
                    this.renderAttendance(response.data.records || []);
                } else {
                    this.attendanceTable.html(`<tr><td colspan="5">${response.data?.message || 'No records found.'}</td></tr>`);
                }
            }).fail(() => {
                this.attendanceTable.html('<tr><td colspan="5">Network error</td></tr>');
            });
        }

        renderAttendance(records) {
            if (!records.length) {
                this.attendanceTable.html(`<tr><td colspan="5">${boa_live_sessions_data.i18n?.noAttendance || 'No attendance recorded.'}</td></tr>`);
                return;
            }
            this.attendanceTable.html(records.map((row) => {
                return `<tr>
                    <td><strong>${row.student_name || row.student_email || '—'}</strong><br><small>${row.student_email || ''}</small></td>
                    <td>${this.formatDate(row.join_time)}</td>
                    <td>${row.leave_time ? this.formatDate(row.leave_time) : '—'}</td>
                    <td>${row.watch_minutes || 0}</td>
                    <td><small>${row.device_info || ''}<br>${row.ip_address || ''}</small></td>
                </tr>`;
            }).join(''));
        }

        closeAttendanceModal() {
            this.attendanceModal.removeClass('boa-modal-open');
        }

        formatDate(value) {
            if (!value) return '—';
            const date = new Date(value.replace(' ', 'T'));
            if (Number.isNaN(date.getTime())) {
                return value;
            }
            return date.toLocaleString();
        }

        toLocalInput(value) {
            if (!value) return '';
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) {
                return '';
            }
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            return date.toISOString().slice(0, 16);
        }

        getStatusClass(status) {
            switch ((status || '').toLowerCase()) {
                case 'completed':
                    return 'completed';
                case 'cancelled':
                    return 'cancelled';
                default:
                    return 'scheduled';
            }
        }
    }

    $(document).ready(() => {
        window.boaLiveSessions = new BOA_Live_Sessions();
    });
})(jQuery);
