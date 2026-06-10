// Admin Page: Expenses JS
(function($) {
    'use strict';

    const settings = window.boa_expenses_data || {};
    const ajaxUrl = settings.ajax_url || (typeof ajaxurl !== 'undefined' ? ajaxurl : '');
    const nonce = settings.nonce || '';
    const currency = settings.currency || 'PKR';

    function formatCurrency(value) {
        const amount = parseFloat(value || 0);
        return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function loadExpenses() {
        const tbody = $('#boa-expenses-tbody');
        tbody.html('<tr><td colspan="5">Loading expenses...</td></tr>');

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_get_expenses',
                nonce: nonce
            }
        }).done(function(response) {
            tbody.empty();
            if (response.success && response.data.items.length) {
                response.data.items.forEach(expense => {
                    const row = `
                        <tr>
                            <td data-label="Title">${expense.title}</td>
                            <td data-label="Category">${expense.category || '-'}</td>
                            <td data-label="Amount">${formatCurrency(expense.amount)}</td>
                            <td data-label="Date">${expense.expense_date || '-'}</td>
                            <td data-label="Actions">
                                <div class="boa-table-actions">
                                    <button class="boa-btn-icon boa-btn-delete" onclick="deleteExpense(${expense.expense_id})">
                                        <span class="dashicons dashicons-trash"></span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                    tbody.append(row);
                });
            } else {
                tbody.html('<tr><td colspan="5">No expenses found.</td></tr>');
            }
        }).fail(function() {
            tbody.html('<tr><td colspan="5">Error loading expenses.</td></tr>');
        });
    }

    function loadExpenseSummary() {
        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_get_expense_summary',
                nonce: nonce
            }
        }).done(function(response) {
            if (!response.success) {
                return;
            }

            const summary = response.data.summary || {};
            const breakdown = response.data.breakdown || [];

            const totalText = formatCurrency(summary.filtered_total || 0);
            const monthText = formatCurrency(summary.current_month || 0);
            const prevText = formatCurrency(summary.previous_month || 0);

            $('#boa-exp-summary-total').text(totalText);
            $('#boa-exp-summary-month').text(monthText);
            $('#boa-exp-summary-prev').text(prevText);

            $('#boa-exp-summary-total-hero').text(totalText);
            $('#boa-exp-summary-month-hero').text(monthText);

            const deltaPercent = parseFloat(summary.difference_percent || 0);
            const deltaElement = $('#boa-exp-summary-delta');
            deltaElement.text(`${deltaPercent}%`);
            deltaElement.removeClass('boa-chip-positive boa-chip-negative');
            deltaElement.addClass(deltaPercent >= 0 ? 'boa-chip-positive' : 'boa-chip-negative');

            const deltaHero = $('#boa-exp-summary-delta-hero');
            deltaHero.text(`${deltaPercent}%`);
            deltaHero.removeClass('boa-chip-positive boa-chip-negative');
            deltaHero.addClass(deltaPercent >= 0 ? 'boa-chip-positive' : 'boa-chip-negative');

            const list = $('#boa-expense-top-categories');
            list.empty();

            if (!breakdown.length) {
                list.append('<li>No category data available.</li>');
                return;
            }

            const total = breakdown.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);

            breakdown.slice(0, 5).forEach(item => {
                const share = total > 0 ? ((item.total / total) * 100).toFixed(1) : 0;
                list.append(`<li><strong>${item.category || 'General'}</strong> <span>${formatCurrency(item.total)} • ${share}%</span></li>`);
            });
        });
    }

    window.addExpense = function() {
        const title = $('#boa-expense-title').val();
        const amount = $('#boa-expense-amount').val();
        const category = $('#boa-expense-category').val();
        const date = $('#boa-expense-date').val();
        const notes = $('#boa-expense-notes').val();

        if (!title || !amount || !date) {
            window.alert('Please fill all required fields.');
            return false;
        }

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_save_expense',
                title,
                amount,
                category,
                expense_date: date,
                notes,
                nonce: nonce
            }
        }).done(function(response) {
            if (response.success) {
                window.alert(response.data.message);
                $('#boa-add-expense-form')[0].reset();
                loadExpenses();
                loadExpenseSummary();
            } else {
                window.alert('Error: ' + response.data.message);
            }
        }).fail(function() {
            window.alert('An error occurred while saving the expense.');
        });

        return false;
    };

    window.deleteExpense = function(expenseId) {
        if (!window.confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_delete_expense',
                expense_id: expenseId,
                nonce: nonce
            }
        }).done(function(response) {
            if (response.success) {
                loadExpenses();
                loadExpenseSummary();
            } else {
                window.alert('Error: ' + response.data.message);
            }
        }).fail(function() {
            window.alert('An error occurred while deleting the expense.');
        });
    };

    $(document).ready(function() {
        loadExpenses();
        loadExpenseSummary();

        $('#boa-expenses-refresh').on('click', function() {
            loadExpenses();
            loadExpenseSummary();
        });
    });
})(jQuery);
