<?php
/**
 * Admin Page: Quizzes Management
 */
if ( ! defined( 'ABSPATH' ) ) exit;
$courses_data = BOA_DB::get_courses( array( 'per_page' => 999 ) );
$courses = $courses_data['items'] ?? array();
?>

<style>
/* Inline facelift for Quizzes */
#boa-admin-quizzes-root{background:radial-gradient(circle at 14% 18%,#e0f2fe 0,#f8fafc 36%),radial-gradient(circle at 78% 0,#eef2ff 0,#ffffff 38%),#f8fafc;padding:var(--boa-space-8);border-radius:18px;box-shadow:0 12px 30px rgba(15,23,42,.08);min-height:100vh;}
.boa-quizzes-hero{display:flex;gap:var(--boa-space-6);align-items:stretch;background:linear-gradient(135deg,#2563eb,#0ea5e9);color:#fff;position:relative;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 12px 28px rgba(15,23,42,.12);overflow:hidden;margin-bottom:var(--boa-space-6);}
.boa-quizzes-hero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 70% 20%,rgba(255,255,255,.16),transparent 36%);pointer-events:none;}
.boa-hero-left,.boa-hero-right{position:relative;z-index:1;}
.boa-hero-left{flex:2;display:flex;flex-direction:column;gap:var(--boa-space-3);padding:var(--boa-space-5);}
.boa-hero-kicker{text-transform:uppercase;letter-spacing:.08em;font-size:.8rem;font-weight:800;margin:0;opacity:.92;}
.boa-hero-title{display:flex;align-items:center;gap:var(--boa-space-3);flex-wrap:wrap;}
.boa-hero-title h1{margin:0;font-size:2.5rem;font-weight:800;color:#fff;}
.boa-hero-chip{background:rgba(255,255,255,.16);padding:var(--boa-space-2) var(--boa-space-4);border-radius:999px;border:1px solid rgba(255,255,255,.26);font-weight:700;}
.boa-hero-lead{margin:0;font-size:1.05rem;color:rgba(255,255,255,.92);max-width:780px;}
.boa-hero-pills{display:flex;gap:var(--boa-space-3);flex-wrap:wrap;}
.boa-pill{display:inline-flex;align-items:center;gap:var(--boa-space-2);padding:var(--boa-space-2) var(--boa-space-4);border-radius:999px;font-weight:700;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(6px);color:#fff;}
.boa-hero-actions{display:flex;gap:var(--boa-space-3);flex-wrap:wrap;margin-top:var(--boa-space-2);}
.boa-hero-right{flex:1;display:flex;justify-content:flex-end;align-items:center;padding:var(--boa-space-5);}
.boa-hero-card{background:#fff;color:#0f172a;padding:var(--boa-space-5);border-radius:16px;box-shadow:0 16px 40px rgba(15,23,42,.2);display:flex;flex-direction:column;gap:var(--boa-space-3);min-width:260px;}
.boa-hero-note{display:flex;align-items:center;gap:var(--boa-space-2);font-weight:700;color:#2563eb;margin:0;}
.boa-hero-metrics{display:grid;grid-template-columns:1fr;gap:var(--boa-space-2);}
.boa-hero-metrics strong{display:block;font-size:1.1rem;color:#0f172a;}
.boa-page-header{display:none;}
@media(max-width:960px){.boa-quizzes-hero{flex-direction:column;}.boa-hero-right{justify-content:flex-start;}}
</style>

<div id="boa-admin-quizzes-root" class="boa-admin-wrap">
    <div class="boa-quizzes-hero">
        <div class="boa-hero-left">
            <p class="boa-hero-kicker"><?php esc_html_e( 'Assessment Hub', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-title">
                <h1><?php esc_html_e( 'Quizzes Management', 'baba-online-academy' ); ?></h1>
                <span class="boa-hero-chip"><?php esc_html_e( 'Questions & attempts', 'baba-online-academy' ); ?></span>
            </div>
            <p class="boa-hero-lead"><?php esc_html_e( 'Create quizzes per course, add questions, and manage attempts in one organized space.', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-pills">
                <span class="boa-pill"><span class="dashicons dashicons-welcome-learn-more"></span><?php esc_html_e( 'Build', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-clipboard"></span><?php esc_html_e( 'Questions', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-visibility"></span><?php esc_html_e( 'Attempt tracking', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-hero-actions">
                <button class="boa-btn boa-btn-primary" id="boa-refresh-quizzes">
                    <span class="dashicons dashicons-update"></span>
                    <?php esc_html_e( 'Refresh', 'baba-online-academy' ); ?>
                </button>
            </div>
        </div>
        <div class="boa-hero-right">
            <div class="boa-hero-card">
                <p class="boa-hero-note"><span class="dashicons dashicons-chart-pie"></span><?php esc_html_e( 'Snapshot', 'baba-online-academy' ); ?></p>
                <div class="boa-hero-metrics">
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Courses', 'baba-online-academy' ); ?></span>
                        <strong><?php echo number_format( count( $courses ) ); ?></strong>
                    </div>
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Statuses', 'baba-online-academy' ); ?></span>
                        <strong><?php esc_html_e( 'Draft / Published', 'baba-online-academy' ); ?></strong>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-main-layout">
        <div class="boa-main-content">
            <div class="boa-card">
                <div class="boa-card-header">
                    <h3><?php esc_html_e( 'Add / Edit Quiz', 'baba-online-academy' ); ?></h3>
                </div>
                <div class="boa-card-content">
                    <form id="boa-quiz-form">
                        <input type="hidden" id="boa-edit-quiz-id" value="0">
                        <div class="boa-form-grid">
                            <div class="boa-form-group">
                                <label for="boa-quiz-course"><?php esc_html_e( 'Course', 'baba-online-academy' ); ?></label>
                                <select id="boa-quiz-course" required>
                                    <option value=""><?php esc_html_e( 'Select course', 'baba-online-academy' ); ?></option>
                                    <?php foreach ( $courses as $course ) : ?>
                                        <option value="<?php echo esc_attr( $course['course_id'] ); ?>">
                                            <?php echo esc_html( $course['course_name'] ); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="boa-form-group">
                                <label for="boa-quiz-title"><?php esc_html_e( 'Title', 'baba-online-academy' ); ?></label>
                                <input type="text" id="boa-quiz-title" required>
                            </div>
                            <div class="boa-form-group">
                                <label for="boa-quiz-total"><?php esc_html_e( 'Total Marks', 'baba-online-academy' ); ?></label>
                                <input type="number" id="boa-quiz-total" min="0" step="0.5">
                            </div>
                            <div class="boa-form-group">
                                <label for="boa-quiz-pass"><?php esc_html_e( 'Pass Percentage', 'baba-online-academy' ); ?></label>
                                <input type="number" id="boa-quiz-pass" min="0" max="100" step="1">
                            </div>
                            <div class="boa-form-group">
                                <label for="boa-quiz-time"><?php esc_html_e( 'Time Limit (minutes)', 'baba-online-academy' ); ?></label>
                                <input type="number" id="boa-quiz-time" min="0">
                            </div>
                            <div class="boa-form-group">
                                <label for="boa-quiz-status"><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></label>
                                <select id="boa-quiz-status">
                                    <option value="draft"><?php esc_html_e( 'Draft', 'baba-online-academy' ); ?></option>
                                    <option value="published"><?php esc_html_e( 'Published', 'baba-online-academy' ); ?></option>
                                </select>
                            </div>
                        </div>
                        <div class="boa-form-group">
                            <label for="boa-quiz-instructions"><?php esc_html_e( 'Instructions', 'baba-online-academy' ); ?></label>
                            <textarea id="boa-quiz-instructions" rows="4"></textarea>
                        </div>
                        <div class="boa-form-actions">
                            <button type="submit" class="boa-btn boa-btn-primary"><?php esc_html_e( 'Save Quiz', 'baba-online-academy' ); ?></button>
                            <button type="button" class="boa-btn boa-btn-secondary" id="boa-reset-quiz"><?php esc_html_e( 'Reset', 'baba-online-academy' ); ?></button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="boa-card">
                <div class="boa-card-header">
                    <h3><?php esc_html_e( 'Quizzes List', 'baba-online-academy' ); ?></h3>
                    <div class="boa-table-tools">
                        <input type="text" id="boa-quiz-search" class="boa-search-input" placeholder="<?php esc_attr_e( 'Search quizzes...', 'baba-online-academy' ); ?>">
                        <select id="boa-quiz-filter-course" class="boa-form-select">
                            <option value=""><?php esc_html_e( 'All Courses', 'baba-online-academy' ); ?></option>
                            <?php foreach ( $courses as $course ) : ?>
                                <option value="<?php echo esc_attr( $course['course_id'] ); ?>"><?php echo esc_html( $course['course_name'] ); ?></option>
                            <?php endforeach; ?>
                        </select>
                        <select id="boa-quiz-filter-status" class="boa-form-select">
                            <option value=""><?php esc_html_e( 'All Statuses', 'baba-online-academy' ); ?></option>
                            <option value="draft"><?php esc_html_e( 'Draft', 'baba-online-academy' ); ?></option>
                            <option value="published"><?php esc_html_e( 'Published', 'baba-online-academy' ); ?></option>
                        </select>
                    </div>
                </div>
                <div class="boa-card-content">
                    <table class="boa-data-table">
                        <thead>
                            <tr>
                                <th><?php esc_html_e( 'Title', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Course', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Questions', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Actions', 'baba-online-academy' ); ?></th>
                            </tr>
                        </thead>
                        <tbody id="boa-quizzes-tbody">
                            <tr><td colspan="5"><?php esc_html_e( 'Loading quizzes...', 'baba-online-academy' ); ?></td></tr>
                        </tbody>
                    </table>
                    <div id="boa-quizzes-pagination" class="boa-pagination" aria-live="polite"></div>
                </div>
            </div>

            <div class="boa-card">
                <div class="boa-card-header">
                    <h3><?php esc_html_e( 'Quiz Attempts & Grades', 'baba-online-academy' ); ?></h3>
                    <span class="boa-soft-pill" id="boa-attempts-selected-quiz"><?php esc_html_e( 'Select a quiz to view attempts.', 'baba-online-academy' ); ?></span>
                </div>
                <div class="boa-card-content">
                    <table class="boa-data-table">
                        <thead>
                            <tr>
                                <th><?php esc_html_e( 'Student', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Attempt Date', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Score', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Total Marks', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Actions', 'baba-online-academy' ); ?></th>
                            </tr>
                        </thead>
                        <tbody id="boa-quiz-attempts-tbody">
                            <tr><td colspan="5"><?php esc_html_e( 'Select a quiz from the list to load attempts.', 'baba-online-academy' ); ?></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="boa-sidebar">
            <div class="boa-card">
                <div class="boa-card-header">
                    <div>
                        <h3><?php esc_html_e( 'Quiz Questions', 'baba-online-academy' ); ?></h3>
                        <p class="boa-muted" id="boa-question-selected"><?php esc_html_e( 'Select a quiz to manage questions.', 'baba-online-academy' ); ?></p>
                    </div>
                </div>
                <div class="boa-card-content">
                    <div id="boa-question-list">
                        <p><?php esc_html_e( 'No quiz selected.', 'baba-online-academy' ); ?></p>
                    </div>
                    <form id="boa-question-form" style="display:none;">
                        <input type="hidden" id="boa-question-id" value="0">
                        <input type="hidden" id="boa-question-quiz-id" value="0">
                        <div class="boa-form-group">
                            <label for="boa-question-text"><?php esc_html_e( 'Question', 'baba-online-academy' ); ?></label>
                            <textarea id="boa-question-text" rows="3" required></textarea>
                        </div>
                        <div class="boa-form-group">
                            <label for="boa-question-marks"><?php esc_html_e( 'Marks', 'baba-online-academy' ); ?></label>
                            <input type="number" id="boa-question-marks" min="0" step="0.5" value="1">
                        </div>
                        <div class="boa-form-group">
                            <label><?php esc_html_e( 'Options (select correct answer)', 'baba-online-academy' ); ?></label>
                            <div id="boa-options-wrapper"></div>
                            <button type="button" class="boa-btn boa-btn-sm boa-btn-secondary" id="boa-add-option"><?php esc_html_e( 'Add Option', 'baba-online-academy' ); ?></button>
                        </div>
                        <div class="boa-form-actions">
                            <button type="submit" class="boa-btn boa-btn-primary"><?php esc_html_e( 'Save Question', 'baba-online-academy' ); ?></button>
                            <button type="button" class="boa-btn boa-btn-secondary" id="boa-cancel-question"><?php esc_html_e( 'Cancel', 'baba-online-academy' ); ?></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div id="boa-quiz-grade-modal" class="boa-modal" aria-hidden="true">
        <div class="boa-modal-overlay" data-dismiss="quiz-grade-modal"></div>
        <div class="boa-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="boa-quiz-grade-title">
            <div class="boa-modal-header">
                <h3 id="boa-quiz-grade-title"><?php esc_html_e( 'Edit Quiz Score', 'baba-online-academy' ); ?></h3>
                <button type="button" class="boa-modal-close" data-dismiss="quiz-grade-modal" aria-label="<?php esc_attr_e( 'Close', 'baba-online-academy' ); ?>">&times;</button>
            </div>
            <form id="boa-quiz-grade-form">
                <input type="hidden" id="boa-quiz-grade-attempt-id" value="0">
                <div class="boa-form-group">
                    <label for="boa-quiz-grade-score"><?php esc_html_e( 'Score / Marks Obtained', 'baba-online-academy' ); ?></label>
                    <input type="number" id="boa-quiz-grade-score" step="0.5" min="0" required class="boa-form-input">
                </div>
                <div class="boa-form-actions">
                    <button type="submit" class="boa-btn boa-btn-primary"><?php esc_html_e( 'Save Score', 'baba-online-academy' ); ?></button>
                    <button type="button" class="boa-btn boa-btn-secondary" data-dismiss="quiz-grade-modal"><?php esc_html_e( 'Cancel', 'baba-online-academy' ); ?></button>
                </div>
            </form>
        </div>
    </div>
</div>
