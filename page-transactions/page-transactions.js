(function($) {
    'use strict';

    const settings = window.boa_transactions_data || {};
    const ajaxUrl = settings.ajax_url || (typeof ajaxurl !== 'undefined' ? ajaxurl : '');
    const nonce = settings.nonce || '';
    const currency = settings.currency || 'PKR';

    const state = {
        page: 1,
        perPage: 10,
        total: 0,
        filters: {
            gateway: '',
            status: '',
            search: ''
        }
    };

    const message = (key, fallback) => (settings.i18n && settings.i18n[key]) || fallback;
    const renderMessageRow = (text) => `<tr><td colspan="7">${text}</td></tr>`;

    function formatCurrency(value) {
        const amount = parseFloat(value || 0);
        return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function loadTransactions() {
        const tbody = $('#boa-transactions-tbody');
        tbody.html(renderMessageRow(message('loading', 'Loading transactions...')));

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_get_transactions',
                nonce: nonce,
                page: state.page,
                per_page: state.perPage,
                gateway: state.filters.gateway,
                status: state.filters.status,
                search: state.filters.search
            }
        }).done(function(response) {
            if (!response.success) {
                tbody.html(renderMessageRow(response.data?.message || message('error', 'Unable to load transactions.')));
                return;
            }

            const items = response.data.items || [];
            state.total = response.data.total || 0;
            if (!items.length) {
                tbody.html(renderMessageRow(message('empty', 'No transactions found.')));
                renderPagination();
                return;
            }

            const rows = items.map(item => {
                const badge = `<span class="boa-status-badge boa-status-${item.status}">${item.status_label}</span>`;
                const student = item.student_name ? `${item.student_name} <br><small>${item.student_email || ''}</small>` : 'N/A';
                const invoice = item.invoice_id || 'N/A';
                return `
                    <tr>
                        <td>${item.transaction_reference}</td>
                        <td>${item.gateway_label}</td>
                        <td>${invoice}</td>
                        <td>${student}</td>
                        <td>${formatCurrency(item.amount)}</td>
                        <td>${badge}</td>
                        <td>${item.created_at}</td>
                    </tr>
                `;
            }).join('');

            tbody.html(rows);
            renderPagination();
        }).fail(function() {
            tbody.html(renderMessageRow(message('network', 'Network error.')));
        });
    }

    function renderPagination() {
        const container = $('#boa-transactions-pagination');
        const totalPages = Math.ceil(state.total / state.perPage);

        if (totalPages <= 1) {
            container.empty();
            return;
        }

        let html = '';
        for (let page = 1; page <= totalPages; page++) {
            const active = page === state.page ? 'boa-page-active' : '';
            html += `<button class="boa-page-btn ${active}" data-page="${page}">${page}</button>`;
        }
        container.html(html);
    }

    const debounce = (fn, wait = 300) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    };

    function bindEvents() {
        $('#boa-transaction-gateway').on('change', function() {
            state.filters.gateway = $(this).val();
            state.page = 1;
            loadTransactions();
        });

        $('#boa-transaction-status').on('change', function() {
            state.filters.status = $(this).val();
            state.page = 1;
            loadTransactions();
        });

        $('#boa-transaction-search').on('input', debounce(function(e) {
            state.filters.search = e.target.value;
            state.page = 1;
            loadTransactions();
        }, 400));

        $('#boa-refresh-transactions').on('click', function() {
            loadTransactions();
        });

        $('#boa-transactions-pagination').on('click', '.boa-page-btn', function() {
            const page = parseInt($(this).data('page'), 10);
            if (page && page !== state.page) {
                state.page = page;
                loadTransactions();
            }
        });
    }

    $(document).ready(function() {
        bindEvents();
        loadTransactions();
    });
})(jQuery);
