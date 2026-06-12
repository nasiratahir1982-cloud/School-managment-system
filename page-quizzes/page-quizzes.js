(function($) {
    'use strict';

    const settings = window.boa_quizzes_data || {};
    const ajaxUrl = settings.ajax_url || (typeof ajaxurl !== 'undefined' ? ajaxurl : '');
    const nonce = settings.nonce || '';
    const i18n = settings.i18n || {};

    const state = {
        page: 1,
        perPage: 10,
        total: 0,
        cache: {},
        activeQuiz: null
    };

    function escapeHtml(value) {
        return $('<div/>').text(value == null ? '' : value).html();
    }

    function decodeHtml(value) {
        return $('<textarea/>').html(value || '').text();
    }

    function notify(message) {
        window.alert(message);
    }

    function responseMessage(response, fallback) {
        return response && response.data && response.data.message ? response.data.message : fallback;
    }

    function resetQuizForm() {
        $('#boa-edit-quiz-id').val('0');
        $('#boa-quiz-form')[0].reset();
        state.activeQuiz = null;
    }

    function updateQuestionContext(text) {
        $('#boa-question-selected').text(text || i18n.selectQuiz || 'Select a quiz to edit questions.');
    }

    function renderPagination() {
        const container = $('#boa-quizzes-pagination');
        if (!state.total) {
            container.empty();
            return;
        }
        const totalPages = Math.ceil(state.total / state.perPage);
        const start = (state.page - 1) * state.perPage + 1;
        const end = Math.min(state.total, state.page * state.perPage);
        const rangeText = (i18n.range || 'Showing %1$s-%2$s of %3$s quizzes')
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

    function renderOptions(options) {
        const wrapper = $('#boa-options-wrapper');
        wrapper.empty();
        const rows = options && options.length ? options : [
            { option_text: '', is_correct: 0 },
            { option_text: '', is_correct: 0 },
            { option_text: '', is_correct: 0 },
            { option_text: '', is_correct: 0 }
        ];
        rows.forEach((opt, index) => {
            wrapper.append(`
                <div class="boa-option-row">
                    <input type="radio" name="boa-correct-option" value="${index}" ${opt.is_correct ? 'checked' : ''}>
                    <input type="text" class="boa-option-text" placeholder="Option ${index + 1}" value="${escapeHtml(opt.option_text || '')}">
                </div>
            `);
        });
    }

    function populateQuizForm(quiz) {
        if (!quiz) {
            return;
        }
        $('#boa-edit-quiz-id').val(quiz.quiz_id);
        $('#boa-quiz-course').val(quiz.course_id);
        $('#boa-quiz-title').val(quiz.title);
        $('#boa-quiz-instructions').val(decodeHtml(quiz.instructions));
        $('#boa-quiz-total').val(quiz.total_marks);
        $('#boa-quiz-pass').val(quiz.pass_percentage);
        $('#boa-quiz-time').val(quiz.time_limit);
        $('#boa-quiz-status').val(quiz.status);
    }

    function renderQuestions(questions) {
        const container = $('#boa-question-list');
        if (!questions.length) {
            container.html(`<p>${escapeHtml(i18n.noQuestions || 'No questions added yet.')}</p>`);
            return;
        }
        const items = questions.map((question) => `
            <div class="boa-question-card" data-question="${question.question_id}">
                <strong>${escapeHtml(question.question_text || '')}</strong>
                <div class="boa-question-meta">
                    <span>${escapeHtml(i18n.marks || 'Marks')}: ${escapeHtml(question.marks)}</span>
                    <button class="boa-btn boa-btn-sm" data-action="edit-question">${escapeHtml(i18n.edit || 'Edit')}</button>
                    <button class="boa-btn boa-btn-sm boa-btn-delete" data-action="delete-question">${escapeHtml(i18n.delete || 'Delete')}</button>
                </div>
            </div>
        `);
        container.html(items.join(''));
        container.data('questions', questions);
    }

    function loadQuizzes() {
        const tbody = $('#boa-quizzes-tbody');
        tbody.html(`<tr><td colspan="5">${escapeHtml(i18n.loading || 'Loading quizzes...')}</td></tr>`);

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_get_quizzes',
                nonce,
                page: state.page,
                per_page: state.perPage,
                search: $('#boa-quiz-search').val(),
                course_id: $('#boa-quiz-filter-course').val(),
                status: $('#boa-quiz-filter-status').val()
            }
        }).done((response) => {
            if (!response || !response.success) {
                tbody.html(`<tr><td colspan="5">${escapeHtml(responseMessage(response, 'Unable to load quizzes.'))}</td></tr>`);
                return;
            }
            const items = response.data.items || [];
            state.total = response.data.total || 0;
            state.cache = {};
            items.forEach((quiz) => {
                state.cache[quiz.quiz_id] = quiz;
            });

            if (!items.length) {
                tbody.html(`<tr><td colspan="5">${escapeHtml(i18n.empty || 'No quizzes found.')}</td></tr>`);
                renderPagination();
                return;
            }

            const rows = items.map((item) => {
                const badge = `<span class="boa-status-badge boa-status-${escapeHtml(item.status)}">${escapeHtml(item.status)}</span>`;
                return `
                    <tr data-quiz="${item.quiz_id}">
                        <td data-label="${escapeHtml(i18n.title || 'Title')}">${escapeHtml(item.title)}</td>
                        <td data-label="${escapeHtml(i18n.course || 'Course')}">${escapeHtml(item.course_name || '-')}</td>
                        <td data-label="${escapeHtml(i18n.questions || 'Questions')}">${escapeHtml(item.question_count || 0)}</td>
                        <td data-label="${escapeHtml(i18n.status || 'Status')}">${badge}</td>
                        <td data-label="${escapeHtml(i18n.actions || 'Actions')}">
                            <div class="boa-table-actions">
                                <button class="boa-btn boa-btn-sm boa-btn-outline" data-action="edit">${escapeHtml(i18n.edit || 'Edit')}</button>
                                <button class="boa-btn boa-btn-sm" data-action="questions">${escapeHtml(i18n.questions || 'Questions')}</button>
                                <button class="boa-btn boa-btn-sm boa-btn-outline" data-action="attempts">${escapeHtml(i18n.attempts || 'Attempts')}</button>
                                <button class="boa-btn boa-btn-sm boa-btn-delete" data-action="delete">${escapeHtml(i18n.delete || 'Delete')}</button>
                            </div>
                        </td>
                    </tr>
                `;
            });
            tbody.html(rows.join(''));
            renderPagination();
        });
    }

    function loadAttempts(quizId) {
        const tbody = $('#boa-quiz-attempts-tbody');
        if (!quizId) {
            tbody.html(`<tr><td colspan="5">${escapeHtml(i18n.selectQuizPrompt || 'Select a quiz to view attempts.')}</td></tr>`);
            return;
        }
        tbody.html(`<tr><td colspan="5">${escapeHtml(i18n.loading || 'Loading...')}</td></tr>`);
        $('#boa-attempts-selected-quiz').text((state.cache[quizId] && state.cache[quizId].title) || '');

        $.post(ajaxUrl, { action: 'boa_get_quiz_attempts', nonce, quiz_id: quizId }, (response) => {
            if (!response || !response.success) {
                tbody.html(`<tr><td colspan="5">${escapeHtml(responseMessage(response, 'Unable to load attempts.'))}</td></tr>`);
                return;
            }
            const attempts = response.data.attempts || [];
            if (!attempts.length) {
                tbody.html(`<tr><td colspan="5">${escapeHtml(i18n.noAttempts || 'No attempts yet.')}</td></tr>`);
                return;
            }
            const rows = attempts.map((attempt) => {
                return `
                    <tr>
                        <td data-label="${escapeHtml(i18n.student || 'Student')}">${escapeHtml(attempt.student_name || '-')}<br><small>${escapeHtml(attempt.student_email || '')}</small></td>
                        <td data-label="${escapeHtml(i18n.attemptDate || 'Attempt Date')}">${escapeHtml(formatDate(attempt.attempt_date))}</td>
                        <td data-label="${escapeHtml(i18n.score || 'Score')}">${escapeHtml(attempt.score)}</td>
                        <td data-label="${escapeHtml(i18n.totalMarks || 'Total Marks')}">${escapeHtml(attempt.total_marks || '-')}</td>
                        <td data-label="${escapeHtml(i18n.actions || 'Actions')}">
                            <button class="boa-btn boa-btn-sm boa-btn-primary boa-quiz-grade-btn"
                                data-attempt="${attempt.attempt_id}"
                                data-score="${attempt.score}">
                                ${escapeHtml(i18n.editScore || 'Edit Score')}
                            </button>
                        </td>
                    </tr>
                `;
            });
            tbody.html(rows.join(''));
        });
    }

    function toggleQuizGradeModal(show) {
        const modal = $('#boa-quiz-grade-modal');
        if (show) {
            modal.addClass('is-visible').attr('aria-hidden', 'false');
        } else {
            modal.removeClass('is-visible').attr('aria-hidden', 'true');
            $('#boa-quiz-grade-form')[0].reset();
            $('#boa-quiz-grade-attempt-id').val('0');
        }
    }

    function loadQuestions(quizId) {
        if (!quizId) {
            return;
        }
        $('#boa-question-form').show();
        $('#boa-question-id').val('0');
        $('#boa-question-quiz-id').val(quizId);
        $('#boa-question-form')[0].reset();
        renderOptions([]);
        updateQuestionContext((state.cache[quizId] && state.cache[quizId].title) || '');

        $('#boa-question-list').html(`<p>${escapeHtml(i18n.loading || 'Loading...')}</p>`);

        $.post(ajaxUrl, { action: 'boa_get_quiz_questions', nonce, quiz_id: quizId }, (response) => {
            if (response && response.success) {
                renderQuestions(response.data.questions || []);
            } else {
                $('#boa-question-list').html(`<p>${escapeHtml(responseMessage(response, 'Unable to load questions.'))}</p>`);
            }
        });
    }

    function collectOptions() {
        const options = [];
        $('#boa-options-wrapper .boa-option-row').each(function() {
            const text = $(this).find('.boa-option-text').val().trim();
            const isCorrect = $(this).find('input[type="radio"]').is(':checked') ? 1 : 0;
            options.push({ option_text: text, is_correct: isCorrect });
        });
        const filled = options.filter((opt) => opt.option_text);
        if (filled.length < 2) {
            notify(i18n.needTwoOptions || 'Provide at least two options.');
            return null;
        }
        if (!filled.some((opt) => opt.is_correct)) {
            notify(i18n.needCorrectOption || 'Select the correct option.');
            return null;
        }
        return filled;
    }

    function bindEvents() {
        $('#boa-quiz-form').on('submit', function(e) {
            e.preventDefault();
            $.post(ajaxUrl, {
                action: 'boa_save_quiz',
                nonce,
                quiz_id: $('#boa-edit-quiz-id').val(),
                course_id: $('#boa-quiz-course').val(),
                title: $('#boa-quiz-title').val(),
                instructions: $('#boa-quiz-instructions').val(),
                total_marks: $('#boa-quiz-total').val(),
                pass_percentage: $('#boa-quiz-pass').val(),
                time_limit: $('#boa-quiz-time').val(),
                status: $('#boa-quiz-status').val()
            }, (response) => {
                if (response && response.success) {
                    notify(i18n.saved || 'Quiz saved.');
                    resetQuizForm();
                    loadQuizzes();
                } else {
                    notify(responseMessage(response, 'Unable to save quiz.'));
                }
            });
        });

        $('#boa-reset-quiz').on('click', function() {
            resetQuizForm();
        });

        $('#boa-quiz-search, #boa-quiz-filter-course, #boa-quiz-filter-status').on('input change', function() {
            state.page = 1;
            loadQuizzes();
        });

        $('#boa-refresh-quizzes').on('click', function() {
            loadQuizzes();
        });

        $('#boa-quizzes-pagination').on('click', 'button[data-nav]', function() {
            const nav = $(this).data('nav');
            const totalPages = Math.ceil(state.total / state.perPage);
            if (nav === 'prev' && state.page > 1) {
                state.page -= 1;
                loadQuizzes();
            } else if (nav === 'next' && state.page < totalPages) {
                state.page += 1;
                loadQuizzes();
            }
        });

        $('#boa-quizzes-tbody').on('click', 'button', function() {
            const quizId = $(this).closest('tr').data('quiz');
            const action = $(this).data('action');
            const quiz = state.cache[quizId];
            if (!quizId) {
                return;
            }

            if (action === 'delete') {
                if (!window.confirm(i18n.confirmDelete || 'Delete this quiz?')) {
                    return;
                }
                $.post(ajaxUrl, { action: 'boa_delete_quiz', nonce, quiz_id: quizId }, (response) => {
                    if (response && response.success) {
                        loadQuizzes();
                    } else {
                        notify(responseMessage(response, 'Unable to delete quiz.'));
                    }
                });
            } else if (action === 'edit') {
                populateQuizForm(quiz);
                $('html, body').animate({ scrollTop: $('#boa-quiz-form').offset().top - 40 }, 300);
            } else if (action === 'questions') {
                state.activeQuiz = quizId;
                loadQuestions(quizId);
            } else if (action === 'attempts') {
                state.activeQuiz = quizId;
                loadAttempts(quizId);
                $('html, body').animate({ scrollTop: $('#boa-quiz-attempts-tbody').closest('.boa-card').offset().top - 40 }, 300);
            }
        });

        $('#boa-add-option').on('click', function() {
            const wrapper = $('#boa-options-wrapper');
            const index = wrapper.find('.boa-option-row').length;
            wrapper.append(`
                <div class="boa-option-row">
                    <input type="radio" name="boa-correct-option" value="${index}">
                    <input type="text" class="boa-option-text" placeholder="Option ${index + 1}">
                </div>
            `);
        });

        $('#boa-question-list').on('click', 'button', function() {
            const questionId = $(this).closest('.boa-question-card').data('question');
            const questions = $('#boa-question-list').data('questions') || [];
            const question = questions.find((item) => item.question_id === questionId);
            const action = $(this).data('action');

            if (action === 'delete-question') {
                if (!window.confirm(i18n.confirmDelete || 'Delete this question?')) {
                    return;
                }
                $.post(ajaxUrl, { action: 'boa_delete_quiz_question', nonce, question_id: questionId }, (response) => {
                    if (response && response.success) {
                        notify(i18n.questionDeleted || 'Question deleted.');
                        loadQuestions(state.activeQuiz);
                    } else {
                        notify(responseMessage(response, 'Unable to delete question.'));
                    }
                });
            } else if (action === 'edit-question' && question) {
                $('#boa-question-id').val(question.question_id);
                $('#boa-question-text').val(question.question_text);
                $('#boa-question-marks').val(question.marks);
                renderOptions(question.options || []);
            }
        });

        $('#boa-question-form').on('submit', function(e) {
            e.preventDefault();
            const quizId = $('#boa-question-quiz-id').val();
            if (!quizId) {
                notify(i18n.selectQuiz || 'Select a quiz first.');
                return;
            }
            const options = collectOptions();
            if (!options) {
                return;
            }
            $.ajax({
                url: ajaxUrl,
                type: 'POST',
                data: {
                    action: 'boa_save_quiz_question',
                    nonce,
                    question_id: $('#boa-question-id').val(),
                    quiz_id: quizId,
                    question_text: $('#boa-question-text').val(),
                    marks: $('#boa-question-marks').val(),
                    options: JSON.stringify(options)
                }
            }).done((response) => {
                if (response && response.success) {
                    notify(i18n.questionSaved || 'Question saved.');
                    $('#boa-question-id').val('0');
                    $('#boa-question-form')[0].reset();
                    renderOptions([]);
                    loadQuestions(quizId);
                } else {
                    notify(responseMessage(response, 'Unable to save question.'));
                }
            });
        });

        $('#boa-cancel-question').on('click', function() {
            $('#boa-question-id').val('0');
            $('#boa-question-form')[0].reset();
            renderOptions([]);
        });

        // Quiz attempts grade button click
        $('#boa-quiz-attempts-tbody').on('click', '.boa-quiz-grade-btn', function() {
            const attemptId = $(this).data('attempt');
            const score = $(this).data('score');
            $('#boa-quiz-grade-attempt-id').val(attemptId);
            $('#boa-quiz-grade-score').val(score);
            toggleQuizGradeModal(true);
        });

        // Quiz grade form submit
        $('#boa-quiz-grade-form').on('submit', function(e) {
            e.preventDefault();
            const attemptId = $('#boa-quiz-grade-attempt-id').val();
            const score = $('#boa-quiz-grade-score').val();
            if (!attemptId) {
                return;
            }
            $.post(ajaxUrl, {
                action: 'boa_update_quiz_attempt',
                nonce,
                attempt_id: attemptId,
                score: score
            }, (response) => {
                if (response && response.success) {
                    notify(i18n.scoreSaved || 'Score updated successfully.');
                    toggleQuizGradeModal(false);
                    if (state.activeQuiz) {
                        loadAttempts(state.activeQuiz);
                    }
                } else {
                    notify(responseMessage(response, 'Unable to update score.'));
                }
            });
        });

        $(document).on('click', '[data-dismiss="quiz-grade-modal"]', function() {
            toggleQuizGradeModal(false);
        });

        $(document).on('keydown', function(e) {
            if (e.key === 'Escape') {
                toggleQuizGradeModal(false);
            }
        });
    }

    $(function() {
        bindEvents();
        renderOptions([]);
        loadQuizzes();
    });
})(jQuery);
