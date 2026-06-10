(function($){
    'use strict';

    const state = {
        page: 1,
        perPage: 10,
        editingId: 0,
        filter: '',
        search: '',
        cache: {}
    };

    const i18n = (window.boa_notices_data && window.boa_notices_data.i18n) || {};
    const labels = (window.boa_notices_data && window.boa_notices_data.labels) || { audience: {}, priority: {} };
    const ajaxUrl = window.boa_notices_data ? window.boa_notices_data.ajax_url : '';
    const nonce = window.boa_notices_data ? window.boa_notices_data.nonce : '';

    const renderMessageRow = (text) => `<tr><td colspan="6">${text}</td></tr>`;

    const debounce = (fn, wait = 300) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    };

    function showMessage(message) {
        window.alert(message);
    }

    function resetForm() {
        state.editingId = 0;
        $('#boa-notice-id').val(0);
        $('#boa-notice-title').val('');
        $('#boa-notice-message').val('');
        $('#boa-notice-audience').val('all');
        $('#boa-notice-priority').val('normal');
        $('#boa-notice-start').val('');
        $('#boa-notice-end').val('');
        $('#boa-notice-active').val('1');
    }

    function populateForm(notice) {
        state.editingId = notice.notice_id;
        $('#boa-notice-id').val(notice.notice_id);
        $('#boa-notice-title').val(notice.title);
        $('#boa-notice-message').val(notice.message);
        $('#boa-notice-audience').val(notice.audience);
        $('#boa-notice-priority').val(notice.priority);
        $('#boa-notice-start').val(notice.start_date || '');
        $('#boa-notice-end').val(notice.end_date || '');
        $('#boa-notice-active').val(notice.is_active);
    }

    function formatStatus(notice) {
        if (parseInt(notice.is_active, 10) !== 1) {
            return '<span class="boa-status-badge boa-status-inactive">' + (i18n.inactive || 'Inactive') + '</span>';
        }
        return '<span class="boa-status-badge boa-status-active">' + (i18n.active || 'Active') + '</span>';
    }

    function formatSchedule(notice) {
        const start = notice.start_date || 'N/A';
        const end = notice.end_date || 'N/A';
        return `${start} - ${end}`;
    }

    function formatAudience(audience) {
        return labels.audience[audience] || audience || 'N/A';
    }

    function formatPriority(priority) {
        return labels.priority[priority] || priority || 'N/A';
    }

    function loadNotices() {
        const tbody = $('#boa-notice-table');
        tbody.html(renderMessageRow(i18n.loading || 'Loading notices...'));

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'boa_get_notices',
                nonce: nonce,
                page: state.page,
                per_page: state.perPage,
                status: state.filter,
                search: state.search
            }
        }).done(function(response){
            if (!response.success) {
                tbody.html(renderMessageRow(response.data?.message || i18n.error || 'Unable to load notices.'));
                return;
            }
            const items = response.data.items || [];
            state.cache = {};
            if (!items.length) {
                tbody.html(renderMessageRow(i18n.empty || 'No notices found.'));
                return;
            }
            const rows = items.map(function(notice){
                state.cache[String(notice.notice_id)] = notice;
                const schedule = formatSchedule(notice);
                return '<tr>' +
                    '<td data-label="Title">' + (notice.title || 'N/A') + '</td>' +
                    '<td data-label="Audience">' + formatAudience(notice.audience) + '</td>' +
                    '<td data-label="Priority">' + formatPriority(notice.priority) + '</td>' +
                    '<td data-label="Schedule">' + schedule + '</td>' +
                    '<td data-label="Status">' + formatStatus(notice) + '</td>' +
                    '<td data-label="Actions">' +
                        '<div class="boa-table-actions">' +
                            '<button type="button" class="boa-btn-icon boa-btn-edit edit-notice" data-id="' + notice.notice_id + '">' +
                                '<span class="dashicons dashicons-edit"></span>' +
                            '</button>' +
                            '<button type="button" class="boa-btn-icon boa-btn-delete delete-notice" data-id="' + notice.notice_id + '">' +
                                '<span class="dashicons dashicons-trash"></span>' +
                            '</button>' +
                        '</div>' +
                    '</td>' +
                '</tr>';
            }).join('');
            tbody.html(rows);
        }).fail(function(){
            tbody.html(renderMessageRow(i18n.error || 'Unable to load notices.'));
        });
    }

    $('#boa-notice-form').on('submit', function(e){
        e.preventDefault();
        const payload = {
            action: 'boa_save_notice',
            nonce: nonce,
            notice_id: $('#boa-notice-id').val(),
            title: $('#boa-notice-title').val(),
            message: $('#boa-notice-message').val(),
            audience: $('#boa-notice-audience').val(),
            priority: $('#boa-notice-priority').val(),
            start_date: $('#boa-notice-start').val(),
            end_date: $('#boa-notice-end').val(),
            is_active: $('#boa-notice-active').val()
        };

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            dataType: 'json',
            data: payload
        }).done(function(response){
            if (response.success) {
                showMessage(response.data?.message || (i18n.saved || 'Notice saved.'));
                resetForm();
                loadNotices();
            } else {
                showMessage(response.data?.message || (i18n.error || 'Unable to save notice.'));
            }
        }).fail(function(){
            showMessage(i18n.error || 'Unable to save notice.');
        });
    });

    $('#boa-notice-table').on('click', '.edit-notice', function(){
        const id = String($(this).data('id'));
        const notice = state.cache[id];
        if (notice) {
            populateForm(notice);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    $('#boa-notice-table').on('click', '.delete-notice', function(){
        const id = $(this).data('id');
        if ( ! window.confirm(i18n.confirmDelete || 'Delete this notice?') ) {
            return;
        }
        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'boa_delete_notice',
                nonce: nonce,
                notice_id: id
            }
        }).done(function(response){
            if (response.success) {
                showMessage(response.data?.message || (i18n.deleted || 'Notice deleted.'));
                loadNotices();
            } else {
                showMessage(response.data?.message || (i18n.error || 'Unable to delete notice.'));
            }
        }).fail(function(){
            showMessage(i18n.error || 'Unable to delete notice.');
        });
    });

    $('#boa-notice-filter').on('change', function(){
        state.filter = $(this).val();
        state.page = 1;
        loadNotices();
    });

    $('#boa-notice-search').on('input', debounce(function(){
        state.search = $(this).val();
        state.page = 1;
        loadNotices();
    }, 350));

    $('#boa-notice-reset, #boa-notice-reset-inline').on('click', function(e){
        e.preventDefault();
        resetForm();
    });

    $('#boa-notice-refresh').on('click', function(){
        loadNotices();
    });

    $(document).ready(function(){
        resetForm();
        loadNotices();
    });
})(jQuery);
