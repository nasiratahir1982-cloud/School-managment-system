<?php
/**
 * Daily Attendance Module
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$courses_data = BOA_DB::get_courses(
    array(
        'per_page' => 999,
        'status'   => 'active',
    )
);
$courses = $courses_data['items'] ?? array();
$today   = current_time( 'Y-m-d' );
?>

<style>
/* Inline facelift for Attendance */
#boa-attendance-root {background:radial-gradient(circle at 14% 18%,#e0f2fe 0,#f8fafc 36%),radial-gradient(circle at 78% 0,#eef2ff 0,#ffffff 38%),#f8fafc;padding:var(--boa-space-8);border-radius:18px;box-shadow:0 12px 30px rgba(15,23,42,.08);min-height:100vh;}
.boa-attendance-hero{display:flex;gap:var(--boa-space-6);align-items:stretch;background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#fff;position:relative;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 12px 28px rgba(15,23,42,.12);overflow:hidden;margin-bottom:var(--boa-space-6);}
.boa-attendance-hero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 70% 20%,rgba(255,255,255,.16),transparent 36%);pointer-events:none;}
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
.boa-hero-note{display:flex;align-items:center;gap:var(--boa-space-2);font-weight:700;color:#0ea5e9;margin:0;}
.boa-hero-metrics{display:grid;grid-template-columns:1fr;gap:var(--boa-space-2);}
.boa-hero-metrics strong{display:block;font-size:1.1rem;color:#0f172a;}
.boa-page-header{display:none;}
@media(max-width:960px){.boa-attendance-hero{flex-direction:column;}.boa-hero-right{justify-content:flex-start;}}
</style>

<div id="boa-attendance-root" class="boa-admin-wrap">
    <div class="boa-attendance-hero">
        <div class="boa-hero-left">
            <p class="boa-hero-kicker"><?php esc_html_e( 'Presence Hub', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-title">
                <h1><?php esc_html_e( 'Daily Attendance', 'baba-online-academy' ); ?></h1>
                <span class="boa-hero-chip"><?php esc_html_e( 'Classes in sync', 'baba-online-academy' ); ?></span>
            </div>
            <p class="boa-hero-lead"><?php esc_html_e( 'Mark classes present, absent, or late from one focused view.', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-pills">
                <span class="boa-pill"><span class="dashicons dashicons-groups"></span><?php esc_html_e( 'Whole class', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-clock"></span><?php esc_html_e( 'By date', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-visibility"></span><?php esc_html_e( 'Audit ready', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-hero-actions">
                <button class="boa-btn boa-btn-primary" id="boa-attendance-refresh">
                    <span class="dashicons dashicons-update"></span>
                    <?php esc_html_e( 'Refresh', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" id="boa-attendance-load">
                    <span class="dashicons dashicons-search"></span>
                    <?php esc_html_e( 'Load Students', 'baba-online-academy' ); ?>
                </button>
            </div>
        </div>
        <div class="boa-hero-right">
            <div class="boa-hero-card">
                <p class="boa-hero-note"><span class="dashicons dashicons-chart-pie"></span><?php esc_html_e( 'Snapshot', 'baba-online-academy' ); ?></p>
                <div class="boa-hero-metrics">
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Today', 'baba-online-academy' ); ?></span>
                        <strong><?php echo esc_html( $today ); ?></strong>
                    </div>
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Courses loaded', 'baba-online-academy' ); ?></span>
                        <strong><?php echo number_format( count( $courses ) ); ?></strong>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-card boa-attendance-filters">
        <div class="boa-card-header">
            <h3><?php esc_html_e( 'Filters', 'baba-online-academy' ); ?></h3>
        </div>
        <div class="boa-card-content">
            <div class="boa-filter-grid">
                <div class="boa-form-group">
                    <label for="boa-attendance-course"><?php esc_html_e( 'Course', 'baba-online-academy' ); ?></label>
                    <select id="boa-attendance-course">
                        <option value=""><?php esc_html_e( 'Select course', 'baba-online-academy' ); ?></option>
                        <?php foreach ( $courses as $course ) : ?>
                            <option value="<?php echo esc_attr( $course['course_id'] ); ?>">
                                <?php echo esc_html( $course['course_name'] ); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="boa-form-group">
                    <label for="boa-attendance-date"><?php esc_html_e( 'Date', 'baba-online-academy' ); ?></label>
                    <input type="date" id="boa-attendance-date" value="<?php echo esc_attr( $today ); ?>">
                </div>
                <div class="boa-form-group boa-align-end">
                    <button class="boa-btn boa-btn-primary" id="boa-attendance-load">
                        <span class="dashicons dashicons-search"></span>
                        <?php esc_html_e( 'Load Students', 'baba-online-academy' ); ?>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-card">
        <div class="boa-card-header boa-attendance-actions">
            <div>
                <h3><?php esc_html_e( 'Attendance Sheet', 'baba-online-academy' ); ?></h3>
                <p class="boa-muted" id="boa-attendance-helper">
                    <?php esc_html_e( 'Choose a course and date to start marking attendance.', 'baba-online-academy' ); ?>
                </p>
            </div>
            <div class="boa-button-group">
                <button class="boa-btn boa-btn-secondary" id="boa-attendance-mark-present">
                    <?php esc_html_e( 'Mark all present', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" id="boa-attendance-mark-absent">
                    <?php esc_html_e( 'Mark all absent', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-primary" id="boa-attendance-save">
                    <span class="dashicons dashicons-yes"></span>
                    <?php esc_html_e( 'Save Attendance', 'baba-online-academy' ); ?>
                </button>
            </div>
        </div>
        <div class="boa-card-content">
            <div class="boa-attendance-summary" id="boa-attendance-summary">
                <span data-type="present"><?php esc_html_e( 'Present', 'baba-online-academy' ); ?>: <strong>0</strong></span>
                <span data-type="absent"><?php esc_html_e( 'Absent', 'baba-online-academy' ); ?>: <strong>0</strong></span>
                <span data-type="late"><?php esc_html_e( 'Late', 'baba-online-academy' ); ?>: <strong>0</strong></span>
                <span data-type="unmarked"><?php esc_html_e( 'Unmarked', 'baba-online-academy' ); ?>: <strong>0</strong></span>
            </div>
            <div class="boa-table-responsive">
                <table class="boa-data-table boa-attendance-table">
                    <thead>
                        <tr>
                            <th><?php esc_html_e( 'Student', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Remarks', 'baba-online-academy' ); ?></th>
                        </tr>
                    </thead>
                    <tbody id="boa-attendance-tbody">
                        <tr>
                            <td colspan="3">
                                <?php esc_html_e( 'Select a course and date to load students.', 'baba-online-academy' ); ?>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
