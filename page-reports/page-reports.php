<?php
// Reports Page - enhanced UI
if (!defined('ABSPATH')) exit;

if ( ! function_exists( 'boa_reports_get_courses' ) ) {
    function boa_reports_get_courses() {
        $data = BOA_DB::get_courses(array('per_page' => 999));
        return $data['items'];
    }
}

if ( ! function_exists( 'boa_reports_get_categories' ) ) {
    function boa_reports_get_categories() {
        return BOA_DB::get_categories();
    }
}
?>

<style>
/* Inline facelift for Reports page */
#boa-reports-root {background:radial-gradient(circle at 14% 18%,#e0f2fe 0,#f8fafc 36%),radial-gradient(circle at 78% 0,#eef2ff 0,#ffffff 38%),#f8fafc;padding:var(--boa-space-8);border-radius:18px;box-shadow:0 12px 30px rgba(15,23,42,.08);min-height:100vh;}
.boa-reports-hero{display:flex;gap:var(--boa-space-6);align-items:stretch;background:linear-gradient(135deg,#2563eb,#6366f1);color:#fff;position:relative;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 12px 28px rgba(15,23,42,.12);overflow:hidden;margin-bottom:var(--boa-space-6);}
.boa-reports-hero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 70% 20%,rgba(255,255,255,.16),transparent 36%);pointer-events:none;}
.boa-hero-left,.boa-hero-right{position:relative;z-index:1;}
.boa-hero-left{flex:2;display:flex;flex-direction:column;gap:var(--boa-space-3);padding:var(--boa-space-5);}
.boa-hero-kicker{text-transform:uppercase;letter-spacing:.08em;font-size:.8rem;font-weight:800;margin:0;opacity:.92;}
.boa-hero-title{display:flex;align-items:center;gap:var(--boa-space-3);flex-wrap:wrap;}
.boa-hero-title h1{margin:0;font-size:2.5rem;font-weight:800;color:#fff;}
.boa-hero-chip{background:rgba(255,255,255,.16);padding:var(--boa-space-2) var(--boa-space-4);border-radius:999px;border:1px solid rgba(255,255,255,.26);font-weight:700;}
.boa-hero-lead{margin:0;font-size:1.05rem;color:rgba(255,255,255,.92);max-width:780px;}
.boa-hero-pills{display:flex;gap:var(--boa-space-3);flex-wrap:wrap;}
.boa-pill{display:inline-flex;aligns:center;gap:var(--boa-space-2);padding:var(--boa-space-2) var(--boa-space-4);border-radius:999px;font-weight:700;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(6px);color:#fff;}
.boa-hero-actions{display:flex;gap:var(--boa-space-3);flex-wrap:wrap;margin-top:var(--boa-space-2);}
.boa-hero-right{flex:1;display:flex;justify-content:flex-end;align-items:center;padding:var(--boa-space-5);}
.boa-hero-card{background:#fff;color:#0f172a;padding:var(--boa-space-5);border-radius:16px;box-shadow:0 16px 40px rgba(15,23,42,.2);display:flex;flex-direction:column;gap:var(--boa-space-3);min-width:260px;}
.boa-hero-note{display:flex;align-items:center;gap:var(--boa-space-2);font-weight:700;color:#2563eb;margin:0;}
.boa-hero-metrics{display:grid;grid-template-columns:1fr;gap:var(--boa-space-2);}
.boa-hero-metrics strong{display:block;font-size:1.1rem;color:#0f172a;}
.boa-page-header{display:none;}
.boa-reports-tabs{display:flex;gap:var(--boa-space-3);flex-wrap:wrap;margin-bottom:var(--boa-space-4);}
.boa-tab-btn{padding:12px 16px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;font-weight:700;box-shadow:0 4px 10px rgba(15,23,42,.06);cursor:pointer;}
.boa-tab-btn.boa-tab-active{background:linear-gradient(135deg,#2563eb,#6366f1);color:#fff;border-color:transparent;box-shadow:0 10px 22px rgba(59,130,246,.22);}
.boa-card-header{display:flex;justify-content:space-between;align-items:center;padding:var(--boa-space-4) var(--boa-space-5) var(--boa-space-3);border-bottom:1px solid #e2e8f0;}
.boa-card-kicker{text-transform:uppercase;letter-spacing:.08em;font-size:.75rem;color:var(--boa-primary);margin:0 0 4px 0;font-weight:800;}
.boa-soft-pill{display:inline-flex;align-items:center;gap:var(--boa-space-2);background:#f1f5f9;padding:var(--boa-space-2) var(--boa-space-4);border-radius:999px;font-weight:600;color:#0f172a;}
.boa-card-content{padding:var(--boa-space-4) var(--boa-space-5) var(--boa-space-5);display:flex;flex-direction:column;gap:var(--boa-space-4);}
.boa-card{border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 10px 28px rgba(15,23,42,.08);background:#fff;}
.boa-table-wrapper{overflow-x:auto;}
.boa-data-table{width:100%;border-collapse:collapse;font-size:.9rem;}
.boa-data-table th,.boa-data-table td{padding:12px 14px;text-align:left;border-bottom:1px solid #e2e8f0;white-space:nowrap;}
.boa-data-table th{background:#f8fafc;color:#475569;text-transform:uppercase;letter-spacing:.02em;font-size:.8rem;}
.boa-data-table tr:hover td{background:#f1f5f9;}
.boa-table-actions{display:inline-flex;gap:var(--boa-space-2);}
.boa-btn-icon{border:none;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:8px 10px;cursor:pointer;transition:all .15s ease-in-out;}
.boa-btn-icon:hover{border-color:#2563eb;color:#2563eb;box-shadow:0 8px 18px rgba(37,99,235,.2);}
@media(max-width:960px){.boa-reports-hero{flex-direction:column;}.boa-hero-right{justify-content:flex-start;}}
@media(max-width:720px){.boa-data-table thead{display:none;}.boa-data-table tr{display:block;margin-bottom:12px;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;}.boa-data-table td{display:flex;justify-content:space-between;padding:10px 12px;}.boa-data-table td:before{content:attr(data-label);font-weight:700;color:#475569;margin-right:10px;}}
</style>

<div id="boa-reports-root">
    <div class="boa-reports-hero">
        <div class="boa-hero-left">
            <p class="boa-hero-kicker"><?php esc_html_e( 'Insights Hub', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-title">
                <h1><?php esc_html_e( 'Reports', 'baba-online-academy' ); ?></h1>
                <span class="boa-hero-chip"><?php esc_html_e( 'Performance & revenue', 'baba-online-academy' ); ?></span>
            </div>
            <p class="boa-hero-lead"><?php esc_html_e( 'View income, student, fee, and course profitability with clear filters and export tools.', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-pills">
                <span class="boa-pill"><span class="dashicons dashicons-money-alt"></span><?php esc_html_e( 'Revenue', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-groups"></span><?php esc_html_e( 'Students', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-chart-pie"></span><?php esc_html_e( 'Courses', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-hero-actions">
                <button class="boa-btn boa-btn-primary" onclick="BOA_ExportAllReports()">
                    <span class="dashicons dashicons-download"></span>
                    <?php esc_html_e( 'Export All', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" id="boa-import-button" type="button">
                    <span class="dashicons dashicons-upload"></span>
                    <?php esc_html_e( 'Import', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_PrintReports()">
                    <span class="dashicons dashicons-printer"></span>
                    <?php esc_html_e( 'Print', 'baba-online-academy' ); ?>
                </button>
            </div>
        </div>
        <div class="boa-hero-right">
            <div class="boa-hero-card">
                <p class="boa-hero-note"><span class="dashicons dashicons-chart-area"></span><?php esc_html_e( 'At a glance', 'baba-online-academy' ); ?></p>
                <div class="boa-hero-metrics">
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Exports ready', 'baba-online-academy' ); ?></span>
                        <strong><?php esc_html_e( 'CSV / Excel', 'baba-online-academy' ); ?></strong>
                    </div>
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Filters', 'baba-online-academy' ); ?></span>
                        <strong><?php esc_html_e( 'Income, Students, Fees, Courses', 'baba-online-academy' ); ?></strong>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-reports-tabs">
        <button class="boa-tab-btn boa-tab-active" data-tab="income">
            <span class="dashicons dashicons-money-alt"></span>
            <?php esc_html_e( 'Income Reports', 'baba-online-academy' ); ?>
        </button>
        <button class="boa-tab-btn" data-tab="students">
            <span class="dashicons dashicons-groups"></span>
            <?php esc_html_e( 'Student Reports', 'baba-online-academy' ); ?>
        </button>
        <button class="boa-tab-btn" data-tab="fees">
            <span class="dashicons dashicons-money"></span>
            <?php esc_html_e( 'Fee Reports', 'baba-online-academy' ); ?>
        </button>
        <button class="boa-tab-btn" data-tab="courses">
            <span class="dashicons dashicons-welcome-learn-more"></span>
            <?php esc_html_e( 'Course Reports', 'baba-online-academy' ); ?>
        </button>
    </div>

    <div class="boa-reports-section boa-tab-section boa-tab-active" id="boa-tab-income">
        <div class="boa-card">
            <div class="boa-card-header">
                <div>
                    <p class="boa-card-kicker"><?php esc_html_e( 'Finance', 'baba-online-academy' ); ?></p>
                    <h3><?php esc_html_e( 'Income Reports', 'baba-online-academy' ); ?></h3>
                </div>
                <span class="boa-soft-pill"><span class="dashicons dashicons-filter"></span><?php esc_html_e( 'Filter & Export', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-card-content">
                <div class="boa-filter-grid">
                    <div class="boa-form-group">
                        <label for="boa-income-date-range"><?php esc_html_e( 'Date Range', 'baba-online-academy' ); ?></label>
                        <input type="text" id="boa-income-date-range" class="boa-form-input" placeholder="<?php esc_attr_e( 'Select range', 'baba-online-academy' ); ?>">
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-income-course"><?php esc_html_e( 'Course', 'baba-online-academy' ); ?></label>
                        <select id="boa-income-course" class="boa-form-select">
                            <option value=""><?php esc_html_e( 'All courses', 'baba-online-academy' ); ?></option>
                            <?php foreach ( boa_reports_get_courses() as $course ) : ?>
                                <option value="<?php echo esc_attr( $course['course_id'] ); ?>"><?php echo esc_html( $course['title'] ); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>
                <div class="boa-table-wrapper">
                    <table class="boa-data-table">
                        <thead>
                            <tr>
                                <th><?php esc_html_e( 'Student', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Course', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Amount', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Date', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></th>
                            </tr>
                        </thead>
                        <tbody id="boa-income-table">
                            <tr><td colspan="5"><?php esc_html_e( 'Loading income reports...', 'baba-online-academy' ); ?></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-reports-section boa-tab-section" id="boa-tab-students">
        <div class="boa-card">
            <div class="boa-card-header">
                <div>
                    <p class="boa-card-kicker"><?php esc_html_e( 'Students', 'baba-online-academy' ); ?></p>
                    <h3><?php esc_html_e( 'Student Reports', 'baba-online-academy' ); ?></h3>
                </div>
                <span class="boa-soft-pill"><span class="dashicons dashicons-groups"></span><?php esc_html_e( 'Profiles', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-card-content">
                <div class="boa-table-wrapper">
                    <table class="boa-data-table">
                        <thead>
                            <tr>
                                <th><?php esc_html_e( 'Student', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Course', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Enrolled', 'baba-online-academy' ); ?></th>
                            </tr>
                        </thead>
                        <tbody id="boa-student-report-table">
                            <tr><td colspan="4"><?php esc_html_e( 'Loading student reports...', 'baba-online-academy' ); ?></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-reports-section boa-tab-section" id="boa-tab-fees">
        <div class="boa-card">
            <div class="boa-card-header">
                <div>
                    <p class="boa-card-kicker"><?php esc_html_e( 'Fees', 'baba-online-academy' ); ?></p>
                    <h3><?php esc_html_e( 'Fee Reports', 'baba-online-academy' ); ?></h3>
                </div>
                <span class="boa-soft-pill"><span class="dashicons dashicons-money"></span><?php esc_html_e( 'Dues', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-card-content">
                <div class="boa-table-wrapper">
                    <table class="boa-data-table">
                        <thead>
                            <tr>
                                <th><?php esc_html_e( 'Student', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Amount', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Due Date', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></th>
                            </tr>
                        </thead>
                        <tbody id="boa-fee-report-table">
                            <tr><td colspan="4"><?php esc_html_e( 'Loading fee reports...', 'baba-online-academy' ); ?></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-reports-section boa-tab-section" id="boa-tab-courses">
        <div class="boa-card">
            <div class="boa-card-header">
                <div>
                    <p class="boa-card-kicker"><?php esc_html_e( 'Courses', 'baba-online-academy' ); ?></p>
                    <h3><?php esc_html_e( 'Course Reports', 'baba-online-academy' ); ?></h3>
                </div>
                <span class="boa-soft-pill"><span class="dashicons dashicons-welcome-learn-more"></span><?php esc_html_e( 'Performance', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-card-content">
                <div class="boa-table-wrapper">
                    <table class="boa-data-table">
                        <thead>
                            <tr>
                                <th><?php esc_html_e( 'Course', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Category', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Enrollments', 'baba-online-academy' ); ?></th>
                                <th><?php esc_html_e( 'Revenue', 'baba-online-academy' ); ?></th>
                            </tr>
                        </thead>
                        <tbody id="boa-course-report-table">
                            <tr><td colspan="4"><?php esc_html_e( 'Loading course reports...', 'baba-online-academy' ); ?></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
