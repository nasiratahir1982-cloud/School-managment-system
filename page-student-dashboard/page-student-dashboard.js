(function ($) {
    'use strict';

    const settings = window.boa_student_portal || {};
    const ajaxUrl = settings.ajax_url || window.ajaxurl || (window.BOA_PAYMENT ? window.BOA_PAYMENT.ajaxurl : '');
    const nonce = settings.nonce || '';
    const stripeNonce = settings.stripe_nonce || '';
    const i18n = settings.i18n || {};

    const selectors = {
        quizList: '#boa-student-quizzes',
        quizWrapper: '#boa-quiz-attempt-wrapper',
        quizQuestions: '#boa-quiz-questions',
        quizMeta: '#boa-quiz-meta',
        quizResult: '#boa-quiz-result',
        quizForm: '#boa-quiz-attempt-form',
        assignmentsList: '#boa-student-assignments',
        assignmentFile: '#boa-assignment-file'
    };

    const state = {
        quizzesLoaded: false,
        assignmentsLoaded: false,
        activeQuizId: null,
        pendingAssignmentId: null,
        pendingButton: null
    };

    const text = {
        loading: i18n.loading || 'Loading...',
        noQuizzes: i18n.noQuizzes || 'No quizzes assigned yet.',
        noAssignments: i18n.noAssignments || 'No assignments to display.',
        submitQuiz: i18n.submitQuiz || 'Submit Quiz',
        submitAssignment: i18n.submitAssignment || 'Upload Submission'
    };

    function escHtml(value) {
        return $('<div/>').text(value == null ? '' : value).html();
    }

    function escAttr(value) {
        return escHtml(value).replace(/"/g, '&quot;');
    }

    function formatDate(dateString) {
        if (!dateString) {
            return '';
        }
        const parsed = new Date(dateString.replace(' ', 'T'));
        if (Number.isNaN(parsed.getTime())) {
            return dateString;
        }
        return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function ensureAjaxConfig() {
        if (!ajaxUrl || !nonce) {
            window.alert('Unable to process your request right now.');
            return false;
        }
        return true;
    }

    function toggleQuizView(showAttempt) {
        const $wrapper = $(selectors.quizWrapper);
        const $list = $(selectors.quizList);
        if (showAttempt) {
            $wrapper.show();
            $list.hide();
        } else {
            $wrapper.hide();
            $list.show();
            state.activeQuizId = null;
            $(selectors.quizQuestions).empty();
            $(selectors.quizResult).hide().text('');
        }
    }

    function renderQuizList(quizzes) {
        const $list = $(selectors.quizList);
        if (!quizzes || !quizzes.length) {
            $list.html(`<div class="boa-empty-state">${escHtml(text.noQuizzes)}</div>`);
            return;
        }

        const cards = quizzes.map((quiz) => {
            const metaParts = [];
            if (quiz.course_name) {
                metaParts.push(escHtml(quiz.course_name));
            }
            if (quiz.total_marks) {
                metaParts.push(`${escHtml(i18n.marksLabel || 'Max Marks')}: ${escHtml(quiz.total_marks)}`);
            }
            if (quiz.pass_percentage) {
                metaParts.push(`${escHtml(i18n.passLabel || 'Pass')}: ${escHtml(quiz.pass_percentage)}%`);
            }
            if (quiz.time_limit) {
                metaParts.push(`${escHtml(i18n.timeLabel || 'Time limit')}: ${escHtml(quiz.time_limit)} ${escHtml(i18n.minutesLabel || 'minutes')}`);
            }

            const scoreText = typeof quiz.last_score !== 'undefined' && quiz.last_score !== null
                ? `<span class="boa-status-badge">${escHtml((i18n.scoreLabel || 'Score') + ': ' + quiz.last_score + (quiz.total_marks ? '/' + quiz.total_marks : ''))}</span>`
                : '';
            const buttonLabel = quiz.attempt_id ? (i18n.retakeQuiz || 'Retake Quiz') : (i18n.startQuiz || 'Start Quiz');

            return `
                <div class="boa-quiz-card">
                    <div class="boa-quiz-card-head">
                        <div>
                            <h3>${escHtml(quiz.title || '')}</h3>
                            <div class="boa-quiz-meta">${metaParts.join(' · ')}</div>
                        </div>
                        <button type="button" class="boa-btn boa-btn-primary boa-quiz-start" data-quiz-id="${escAttr(quiz.quiz_id)}">
                            ${escHtml(buttonLabel)}
                        </button>
                    </div>
                    ${quiz.instructions ? `<p class="boa-muted">${escHtml(quiz.instructions)}</p>` : ''}
                    ${scoreText ? `<div class="boa-quiz-score">${scoreText}</div>` : ''}
                </div>
            `;
        });

        $list.html(cards.join(''));
    }

    function renderQuizDetail(quiz) {
        state.activeQuizId = quiz.quiz_id;
        const $questions = $(selectors.quizQuestions);
        const $meta = $(selectors.quizMeta);
        const $result = $(selectors.quizResult);

        $result.hide().text('');

        const metaParts = [];
        if (quiz.total_marks) {
            metaParts.push(`${escHtml(i18n.marksLabel || 'Max Marks')}: ${escHtml(quiz.total_marks)}`);
        }
        if (quiz.pass_percentage) {
            metaParts.push(`${escHtml(i18n.passLabel || 'Pass')}: ${escHtml(quiz.pass_percentage)}%`);
        }
        if (quiz.time_limit) {
            metaParts.push(`${escHtml(i18n.timeLabel || 'Time limit')}: ${escHtml(quiz.time_limit)} ${escHtml(i18n.minutesLabel || 'minutes')}`);
        }
        $meta.html(metaParts.join(' · '));

        const allQuestions = Array.isArray(quiz.questions) ? quiz.questions : [];
        if (!allQuestions.length) {
            $questions.html(`<div class="boa-empty-state">${escHtml(i18n.noQuestions || 'No questions added to this quiz yet.')}</div>`);
            return;
        }

        const html = allQuestions.map((question, index) => {
            const options = Array.isArray(question.options) ? question.options : [];
            const optionsHtml = options.length
                ? options.map((option) => `
                    <label class="boa-quiz-option">
                        <input type="radio" name="question_${escAttr(question.question_id)}" value="${escAttr(option.option_id)}">
                        <span>${escHtml(option.option_text || '')}</span>
                    </label>
                `).join('')
                : `<p class="boa-muted">${escHtml(i18n.noQuestions || 'No answers found for this question.')}</p>`;

            return `
                <div class="boa-quiz-question" data-question-id="${escAttr(question.question_id)}">
                    <div class="boa-quiz-question-title">
                        <span>${index + 1}.</span>
                        <strong>${escHtml(question.question_text || '')}</strong>
                        ${question.marks ? `<span class="boa-quiz-points">${escHtml(question.marks)} ${escHtml(i18n.marksLabel || 'marks')}</span>` : ''}
                    </div>
                    <div class="boa-quiz-options">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        });

        $questions.html(html.join(''));
    }

    function loadQuizzes(force = false) {
        if (!ensureAjaxConfig()) {
            return;
        }
        if (state.quizzesLoaded && !force) {
            return;
        }
        state.quizzesLoaded = true;
        $(selectors.quizList).html(`<div class="boa-empty-state">${escHtml(text.loading)}</div>`);

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_fetch_student_quizzes',
                nonce
            }
        }).done((response) => {
            if (response && response.success && response.data && Array.isArray(response.data.quizzes)) {
                renderQuizList(response.data.quizzes);
            } else {
                const message = response && response.data && response.data.message ? response.data.message : 'Unable to load quizzes.';
                $(selectors.quizList).html(`<div class="boa-inline-alert error">${escHtml(message)}</div>`);
            }
        }).fail(() => {
            $(selectors.quizList).html(`<div class="boa-inline-alert error">${escHtml('Network error. Please try again.')}</div>`);
        });
    }

    function loadQuizDetail(quizId) {
        if (!ensureAjaxConfig()) {
            return;
        }
        toggleQuizView(true);
        $(selectors.quizQuestions).html(`<div class="boa-empty-state">${escHtml(text.loading)}</div>`);

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_load_quiz_detail',
                nonce,
                quiz_id: quizId
            }
        }).done((response) => {
            if (response && response.success && response.data && response.data.quiz) {
                renderQuizDetail(response.data.quiz);
            } else {
                const errorMessage = response && response.data && response.data.message ? response.data.message : 'Unable to load quiz.';
                window.alert(errorMessage);
                toggleQuizView(false);
            }
        }).fail(() => {
            window.alert('Unable to load quiz. Please try again.');
            toggleQuizView(false);
        });
    }

    function submitQuizAttempt(e) {
        e.preventDefault();
        if (!ensureAjaxConfig() || !state.activeQuizId) {
            return;
        }

        const answers = {};
        const $questions = $(selectors.quizQuestions).find('.boa-quiz-question');
        $questions.each(function () {
            const questionId = $(this).data('questionId');
            const selected = $(this).find('input[type="radio"]:checked').val();
            if (questionId && selected) {
                answers[questionId] = selected;
            }
        });

        if (!Object.keys(answers).length) {
            window.alert(i18n.quizInstructions || 'Please select at least one answer before submitting.');
            return;
        }

        const $submitBtn = $(selectors.quizForm).find('button[type="submit"]');
        $submitBtn.prop('disabled', true).text(i18n.submitQuiz || 'Submitting...');

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_submit_quiz_attempt',
                nonce,
                quiz_id: state.activeQuizId,
                answers: JSON.stringify(answers)
            }
        }).done((response) => {
            const $result = $(selectors.quizResult);
            if (response && response.success) {
                const score = response.data && typeof response.data.score !== 'undefined' ? response.data.score : 0;
                const total = response.data && typeof response.data.total !== 'undefined' ? response.data.total : 0;
                const scoreText = `${i18n.scoreLabel || 'Score'}: ${score}/${total}`;
                $result.removeClass('error').addClass('success').text(scoreText).show();
                loadQuizzes(true);
            } else {
                const message = response && response.data && response.data.message ? response.data.message : 'Unable to submit quiz.';
                $result.removeClass('success').addClass('error').text(message).show();
            }
        }).fail(() => {
            $(selectors.quizResult).removeClass('success').addClass('error').text('Network error while submitting quiz.').show();
        }).always(() => {
            $submitBtn.prop('disabled', false).text(text.submitQuiz);
        });
    }

    function renderAssignments(assignments) {
        const $list = $(selectors.assignmentsList);
        if (!assignments || !assignments.length) {
            $list.html(`<div class="boa-empty-state">${escHtml(text.noAssignments)}</div>`);
            return;
        }

        const cards = assignments.map((assignment) => {
            const due = assignment.due_date ? `${escHtml(i18n.dueLabel || 'Due')}: ${escHtml(formatDate(assignment.due_date))}` : '';
            const marks = assignment.max_marks ? `${escHtml(i18n.marksLabel || 'Max Marks')}: ${escHtml(assignment.max_marks)}` : '';
            const status = assignment.submission_status || assignment.status || '';
            const grade = assignment.submission_marks ? `${escHtml(i18n.gradedLabel || 'Grade')}: ${escHtml(assignment.submission_marks)}${assignment.max_marks ? '/' + escHtml(assignment.max_marks) : ''}` : '';
            const brief = assignment.attachment_url ? `<a class="boa-btn boa-btn-outline" href="${escAttr(assignment.attachment_url)}" target="_blank" rel="noopener noreferrer">${escHtml(i18n.downloadBrief || 'Download Brief')}</a>` : '';
            const submissionLink = assignment.submission_file ? `<a class="boa-btn boa-btn-secondary" href="${escAttr(assignment.submission_file)}" target="_blank" rel="noopener noreferrer">${escHtml(i18n.viewSubmission || 'View Submission')}</a>` : '';
            const uploadLabel = assignment.submission_id ? (i18n.resubmitAssignment || 'Resubmit') : text.submitAssignment;

            return `
                <div class="boa-assignment-card">
                    <div class="boa-card-head">
                        <div>
                            <h3>${escHtml(assignment.title || '')}</h3>
                            <div class="boa-assignment-meta">
                                ${due ? `<span>${due}</span>` : ''}
                                ${marks ? `<span>${marks}</span>` : ''}
                            </div>
                        </div>
                        <button type="button" class="boa-btn boa-btn-primary boa-assignment-upload-btn" data-assignment-id="${escAttr(assignment.assignment_id)}">
                            ${escHtml(uploadLabel)}
                        </button>
                    </div>
                    ${assignment.description ? `<p class="boa-assignment-description">${escHtml(assignment.description)}</p>` : ''}
                    <div class="boa-assignment-actions">
                        ${brief}
                        ${submissionLink}
                    </div>
                    <div class="boa-assignment-status">
                        <strong>${escHtml(i18n.statusLabel || 'Status')}:</strong>
                        <span>${escHtml(status || i18n.submissionPending || 'Pending')}</span>
                        ${grade ? `<span>${grade}</span>` : ''}
                    </div>
                </div>
            `;
        });

        $list.html(cards.join(''));
    }

    function loadAssignments(force = false) {
        if (!ensureAjaxConfig()) {
            return;
        }
        if (state.assignmentsLoaded && !force) {
            return;
        }
        state.assignmentsLoaded = true;
        $(selectors.assignmentsList).html(`<div class="boa-empty-state">${escHtml(text.loading)}</div>`);

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_fetch_student_assignments',
                nonce
            }
        }).done((response) => {
            if (response && response.success && response.data && Array.isArray(response.data.assignments)) {
                renderAssignments(response.data.assignments);
            } else {
                const message = response && response.data && response.data.message ? response.data.message : 'Unable to load assignments.';
                $(selectors.assignmentsList).html(`<div class="boa-inline-alert error">${escHtml(message)}</div>`);
            }
        }).fail(() => {
            $(selectors.assignmentsList).html(`<div class="boa-inline-alert error">${escHtml('Network error. Please try again.')}</div>`);
        });
    }

    function uploadAssignment(file) {
        if (!ensureAjaxConfig() || !state.pendingAssignmentId) {
            return;
        }

        const formData = new FormData();
        formData.append('action', 'boa_submit_assignment');
        formData.append('nonce', nonce);
        formData.append('assignment_id', state.pendingAssignmentId);
        formData.append('submission_file', file);

        const $button = state.pendingButton;
        const originalText = $button ? $button.text() : '';
        if ($button) {
            $button.prop('disabled', true).text(i18n.uploading || 'Uploading...');
        }

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false
        }).done((response) => {
            if (response && response.success) {
                window.alert(i18n.uploadSuccess || 'Assignment submitted successfully.');
                loadAssignments(true);
            } else {
                const message = response && response.data && response.data.message ? response.data.message : (i18n.uploadFailed || 'Unable to upload your assignment.');
                window.alert(message);
            }
        }).fail(() => {
            window.alert(i18n.uploadFailed || 'Unable to upload your assignment.');
        }).always(() => {
            if ($button) {
                $button.prop('disabled', false).text(originalText || text.submitAssignment);
            }
            $(selectors.assignmentFile).val('');
            state.pendingAssignmentId = null;
            state.pendingButton = null;
        });
    }

    const StudentDashboard = {
        handleTab(tabName) {
            if (tabName === 'quizzes') {
                loadQuizzes();
            } else if (tabName === 'assignments') {
                loadAssignments();
            }
        },
        refreshQuizzes() {
            loadQuizzes(true);
        },
        refreshAssignments() {
            loadAssignments(true);
        }
    };

    window.BOAStudentDashboard = StudentDashboard;

    window.openTab = function (evt, tabName) {
        let i;
        const tabcontent = document.getElementsByClassName('boa-tab-content');
        for (i = 0; i < tabcontent.length; i += 1) {
            tabcontent[i].style.display = 'none';
        }
        const tablinks = document.getElementsByClassName('boa-tab-link');
        for (i = 0; i < tablinks.length; i += 1) {
            tablinks[i].className = tablinks[i].className.replace(' active', '');
        }
        const target = document.getElementById(tabName);
        if (target) {
            target.style.display = 'block';
        }
        if (evt && evt.currentTarget) {
            evt.currentTarget.className += ' active';
        }
        if (window.BOAStudentDashboard && typeof window.BOAStudentDashboard.handleTab === 'function') {
            window.BOAStudentDashboard.handleTab(tabName);
        }
    };

    window.BOA_PayWithStripe = function (button) {
        if (typeof StripeCheckout === 'undefined') {
            window.alert('Stripe payment library is not available.');
            return;
        }

        const feeId = button.dataset.feeId;
        const amount = button.dataset.amount;
        const email = button.dataset.email;
        const key = button.dataset.key;

        if (!key) {
            window.alert('Stripe is not configured correctly.');
            return;
        }

        const handler = StripeCheckout.configure({
            key,
            locale: 'auto',
            token(token) {
                $.ajax({
                    url: ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'boa_process_stripe_payment',
                        nonce: stripeNonce,
                        token: token.id,
                        fee_id: feeId
                    },
                    beforeSend() {
                        button.innerText = 'Processing...';
                        button.disabled = true;
                    }
                }).done((response) => {
                    if (response && response.success) {
                        const message = response.data && response.data.message ? response.data.message : 'Payment successful.';
                        window.alert(message);
                        window.location.reload();
                    } else {
                        const errorMessage = response && response.data && response.data.message ? response.data.message : 'Unable to process payment.';
                        window.alert(errorMessage);
                    }
                }).fail(() => {
                    window.alert('Unable to process payment right now.');
                }).always(() => {
                    button.innerText = 'Pay with Card';
                    button.disabled = false;
                });
            }
        });

        handler.open({
            name: 'Academic Hub',
            description: 'Fee Payment',
            amount,
            email,
            currency: 'pkr'
        });

        window.addEventListener('popstate', () => {
            handler.close();
        });
    };

    window.BOA_InitiateGatewayPayment = function (button) {
        const gateway = button.dataset.gateway;
        const feeId = button.dataset.feeId;
        const paymentNonce = (window.BOA_PAYMENT && window.BOA_PAYMENT.nonce) || '';
        const endpoint = (window.BOA_PAYMENT && window.BOA_PAYMENT.ajaxurl) || ajaxUrl;

        if (!gateway || !feeId || !endpoint) {
            window.alert('Unable to locate payment configuration.');
            return;
        }

        button.disabled = true;
        const originalText = button.innerText;
        button.innerText = 'Processing...';

        $.ajax({
            url: endpoint,
            type: 'POST',
            data: {
                action: 'boa_initiate_gateway_payment',
                gateway,
                fee_id: feeId,
                nonce: paymentNonce
            }
        }).done((response) => {
            if (response && response.success && response.data) {
                const data = response.data;
                if (data.mode === 'redirect' && data.url) {
                    window.location.href = data.url;
                    return;
                }
                if (data.mode === 'form_post' && data.endpoint && data.fields) {
                    const tempForm = document.createElement('form');
                    tempForm.method = 'POST';
                    tempForm.action = data.endpoint;
                    tempForm.style.display = 'none';
                    Object.keys(data.fields).forEach((key) => {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = key;
                        input.value = data.fields[key];
                        tempForm.appendChild(input);
                    });
                    document.body.appendChild(tempForm);
                    tempForm.submit();
                    return;
                }
                window.alert('Unexpected gateway response. Please contact support.');
            } else {
                const message = response && response.data && response.data.message ? response.data.message : 'Unable to initiate payment.';
                window.alert(message);
            }
        }).fail(() => {
            window.alert('Network error while initiating payment.');
        }).always(() => {
            button.disabled = false;
            button.innerText = originalText;
        });
    };

    $(function () {
        $(selectors.quizForm).on('submit', submitQuizAttempt);
        $('#boa-quiz-back').on('click', () => toggleQuizView(false));

        $(document).on('click', '.boa-quiz-start', function () {
            const quizId = $(this).data('quizId');
            if (quizId) {
                loadQuizDetail(quizId);
            }
        });

        $('#boa-refresh-student-quizzes').on('click', StudentDashboard.refreshQuizzes);
        $('#boa-refresh-student-assignments').on('click', StudentDashboard.refreshAssignments);

        $(document).on('click', '.boa-assignment-upload-btn', function () {
            if (!ensureAjaxConfig()) {
                return;
            }
            state.pendingAssignmentId = $(this).data('assignmentId');
            state.pendingButton = $(this);
            $(selectors.assignmentFile).val('').trigger('click');
        });

        $(selectors.assignmentFile).on('change', function () {
            if (!this.files || !this.files.length) {
                state.pendingAssignmentId = null;
                state.pendingButton = null;
                return;
            }
            uploadAssignment(this.files[0]);
        });
    });

})(jQuery);
