// Public live sessions listing
(function($) {
    'use strict';

    const api = window.boa_live_sessions_public || {};

    const state = {
        attendanceId: null,
    };

    function fetchSessions() {
        const container = $('#boa-public-session-list');
        container.html(`<p>${api.messages?.loading || 'Loading...'}</p>`);

        $.ajax({
            url: api.ajax_url,
            type: 'POST',
            data: {
                action: 'boa_get_public_live_sessions',
                nonce: api.nonce
            }
        }).done((response) => {
            if (response.success) {
                renderSessions(response.data.items || []);
            } else {
                container.html(`<p>${response.data?.message || 'Unable to fetch sessions.'}</p>`);
            }
        }).fail(() => {
            container.html('<p>Network error</p>');
        });
    }

    function renderSessions(sessions) {
        const container = $('#boa-public-session-list');
        if (!sessions.length) {
            container.html(`<p>${api.messages?.noSessions || 'No sessions available.'}</p>`);
            return;
        }

        container.html(sessions.map((session) => {
            return `<div class="boa-session-card" data-session='${JSON.stringify(session)}'>
                <div>
                    <h4>${session.session_title}</h4>
                    <small>${session.course_name || ''}</small>
                    <small>${formatDate(session.start_time)}</small>
                </div>
                <div class="boa-session-actions">
                    <span>${session.platform || ''}</span>
                    <button type="button">${api.messages?.join || 'Join Session'}</button>
                </div>
            </div>`;
        }).join(''));

        container.find('button').on('click', function() {
            const session = $(this).closest('.boa-session-card').data('session');
            handleJoin(session, this);
        });
    }

    function handleJoin(session, button) {
        const name = $('#boa-public-name').val().trim();
        const email = $('#boa-public-email').val().trim();
        const phone = $('#boa-public-phone').val().trim();

        if (!name || (!email && !phone)) {
            alert(api.messages?.needDetails || 'Please fill your details first.');
            return;
        }

        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = api.messages?.joined || 'Joining...';

        $.post(api.ajax_url, {
            action: 'boa_log_live_attendance',
            nonce: api.nonce,
            is_public: 1,
            action_type: 'join',
            session_id: session.session_id,
            student_name: name,
            student_email: email,
            join_time: new Date().toISOString(),
            device_info: navigator.userAgent,
            ip_address: '',
        }).done((response) => {
            if (response.success) {
                state.attendanceId = response.data.attendance_id;
                window.open(session.join_url, '_blank');
            } else {
                alert(response.data?.message || 'Unable to log attendance.');
            }
        }).fail(() => {
            alert('Network error');
        }).always(() => {
            button.disabled = false;
            button.textContent = originalText;
        });
    }

    function handleLeave() {
        if (!state.attendanceId) return;
        navigator.sendBeacon(api.ajax_url, new URLSearchParams({
            action: 'boa_log_live_attendance',
            nonce: api.nonce,
            action_type: 'leave',
            attendance_id: state.attendanceId,
            leave_time: new Date().toISOString(),
        }));
    }

    function formatDate(value) {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleString();
    }

    $(document).ready(() => {
        fetchSessions();
        window.addEventListener('beforeunload', handleLeave);
    });

})(jQuery);
