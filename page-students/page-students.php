<?php
// 🟢 یہاں سے Students Management PHP شروع ہو رہا ہے
if (!defined('ABSPATH')) exit;

/**
 * Students Management پیج - BSSMS Computer Courses Management System
 * سٹوڈنٹس کی فہرست، فلٹرز، اور پروفائل مینجمنٹ
 */

/**
 * صرف اسی فائل کے لیے helper function
 */
if ( ! function_exists( 'boa_students_get_courses' ) ) {
    function boa_students_get_courses() {
        // یہ فنکشن اب براہِ راست BOA_DB سے کال ہو گا
        return BOA_DB::get_courses(array('per_page' => 999)); // تمام کورسز لائیں
    }
}

// --- نیا بلاک ---
// پیج لوڈ ہوتے ہی سمری کارڈز کے لیے اصلی ڈیٹا حاصل کریں
$student_stats = BOA_DB::get_student_summary_stats();
// --- /نیا بلاک ---

?>

<!-- students hero styles and layout -->
<style>
/* Inline facelift for Students Management */
#boa-students-root {background:radial-gradient(circle at 14% 18%,#e0f2fe 0,#f8fafc 36%),radial-gradient(circle at 78% 0,#eef2ff 0,#ffffff 38%),#f8fafc;padding:var(--boa-space-8);border-radius:18px;box-shadow:0 12px 30px rgba(15,23,42,.08);min-height:100vh;}
.boa-students-hero{display:flex;gap:var(--boa-space-6);align-items:stretch;background:linear-gradient(135deg,#2563eb,#0ea5e9);color:#fff;position:relative;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 12px 28px rgba(15,23,42,.12);overflow:hidden;margin-bottom:var(--boa-space-6);}
.boa-students-hero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 70% 20%,rgba(255,255,255,.16),transparent 36%);pointer-events:none;}
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
.boa-hero-card{background:#fff;color:#0f172a;padding:var(--boa-space-5);border-radius:16px;box-shadow:0 16px 40px rgba(15,23,42,.2);display:flex;flex-direction:column;gap:var(--boa-space-3);min-width:280px;}
.boa-hero-note{display:flex;align-items:center;gap:var(--boa-space-2);font-weight:700;color:#2563eb;margin:0;}
.boa-hero-metrics{display:grid;grid-template-columns:1fr;gap:var(--boa-space-2);}
.boa-hero-metrics strong{display:block;font-size:1.2rem;color:#0f172a;}
.boa-page-header{display:none;}
@media(max-width:960px){.boa-students-hero{flex-direction:column;}.boa-hero-right{justify-content:flex-start;}}
</style>

<div id="boa-students-root">
    <div class="boa-students-hero">
        <div class="boa-hero-left">
            <p class="boa-hero-kicker"><?php esc_html_e( 'People Hub', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-title">
                <h1><?php esc_html_e( 'Students Management', 'baba-online-academy' ); ?></h1>
                <span class="boa-hero-chip"><?php esc_html_e( 'Profiles & fees', 'baba-online-academy' ); ?></span>
            </div>
            <p class="boa-hero-lead"><?php esc_html_e( 'Manage student records, profiles, and fee history with a clean, organized workspace.', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-pills">
                <span class="boa-pill"><span class="dashicons dashicons-groups"></span><?php esc_html_e( 'Admissions', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-money"></span><?php esc_html_e( 'Fee tracking', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-visibility"></span><?php esc_html_e( 'Audit ready', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-hero-actions">
                <button class="boa-btn boa-btn-primary" onclick="BOA_OpenAddStudentModal()">
                    <span class="dashicons dashicons-plus"></span>
                    <?php esc_html_e( 'Add Student', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_OpenImportModal()">
                    <span class="dashicons dashicons-upload"></span>
                    <?php esc_html_e( 'Import', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_ExportStudents()">
                    <span class="dashicons dashicons-download"></span>
                    <?php esc_html_e( 'Export', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_GenerateDemoData()">
                    <span class="dashicons dashicons-database"></span>
                    <?php esc_html_e( 'Demo Data', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_ExportExcel()">
                    <span class="dashicons dashicons-media-spreadsheet"></span>
                    <?php esc_html_e( 'Excel Download', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_PrintStudents()">
                    <span class="dashicons dashicons-printer"></span>
                    <?php esc_html_e( 'Print', 'baba-online-academy' ); ?>
                </button>
            </div>
        </div>
        <div class="boa-hero-right">
            <div class="boa-hero-card">
                <p class="boa-hero-note"><span class="dashicons dashicons-chart-pie"></span><?php esc_html_e( 'Student pulse', 'baba-online-academy' ); ?></p>
                <div class="boa-hero-metrics">
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Total students', 'baba-online-academy' ); ?></span>
                        <strong><?php echo number_format( $student_stats['total'] ?? 0 ); ?></strong>
                    </div>
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Active', 'baba-online-academy' ); ?></span>
                        <strong><?php echo number_format( $student_stats['active'] ?? 0 ); ?></strong>
                    </div>
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Inactive', 'baba-online-academy' ); ?></span>
                        <strong><?php echo number_format( $student_stats['inactive'] ?? 0 ); ?></strong>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="boa-page-header">
        <div class="boa-header-left">
            <h1>Students Management</h1>
            <p>Manage student records, profiles, and fee history</p>
        </div>
        <div class="boa-header-right">
            <div class="boa-toolbar-actions">
                <button class="boa-btn boa-btn-primary" onclick="BOA_OpenAddStudentModal()">
                    <span class="dashicons dashicons-plus"></span>
                    Add Student
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_OpenImportModal()">
                    <span class="dashicons dashicons-upload"></span>
                    Import
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_ExportStudents()">
                    <span class="dashicons dashicons-download"></span>
                    Export
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_GenerateDemoData()">
                    <span class="dashicons dashicons-database"></span>
                    Demo Data
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_ExportExcel()">
                    <span class="dashicons dashicons-media-spreadsheet"></span>
                    Excel Download
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_PrintStudents()">
                    <span class="dashicons dashicons-printer"></span>
                    Print
                </button>
            </div>
        </div>
    </div>

    <div class="boa-cards-grid">
        <div class="boa-card boa-stats-card">
            <div class="boa-card-header">
                <h3>Total Students</h3>
                <span class="boa-card-icon dashicons dashicons-groups"></span>
            </div>
            <div class="boa-card-content">
                <div class="boa-stat-number" id="boa-total-students"><?php echo esc_html( $student_stats['total'] ); ?></div>
                <div class="boa-stat-label">All registered</div>
            </div>
        </div>

        <div class="boa-card boa-stats-card">
            <div class="boa-card-header">
                <h3>Active Students</h3>
                <span class="boa-card-icon dashicons dashicons-yes"></span>
            </div>
            <div class="boa-card-content">
                <div class="boa-stat-number" id="boa-active-students"><?php echo esc_html( $student_stats['active'] ); ?></div>
                <div class="boa-stat-label">Currently enrolled</div>
            </div>
        </div>

        <div class="boa-card boa-stats-card">
            <div class="boa-card-header">
                <h3>Inactive / Completed</h3>
                <span class="boa-card-icon dashicons dashicons-no"></span>
            </div>
            <div class="boa-card-content">
                <div class="boa-stat-number" id="boa-inactive-students"><?php echo esc_html( $student_stats['inactive'] ); ?></div>
                <div class="boa-stat-label">Completed or dropped</div>
            </div>
        </div>

        <div class="boa-card boa-stats-card">
            <div class="boa-card-header">
                <h3>New This Month</h3>
                <span class="boa-card-icon dashicons dashicons-plus-alt"></span>
            </div>
            <div class="boa-card-content">
                <div class="boa-stat-number" id="boa-new-students"><?php echo esc_html( $student_stats['new_this_month'] ); ?></div>
                <div class="boa-stat-label">This month admissions</div>
            </div>
        </div>
    </div>

    <div class="boa-main-layout">
        <div class="boa-main-content">
            <div class="boa-bulk-actions-bar" id="boa-bulk-actions-bar" style="display: none;">
                <div class="boa-bulk-actions-content">
                    <span id="boa-selected-count">0 students selected</span>
                    <select id="boa-bulk-action" class="boa-bulk-select">
                        <option value="">Bulk Actions</option>
                        <option value="activate">Activate</option>
                        <option value="deactivate">Deactivate</option>
                        <option value="delete">Delete</option>
                    </select>
                    <button class="boa-btn boa-btn-primary boa-btn-sm" onclick="BOA_ApplyBulkAction()">
                        Apply
                    </button>
                </div>
            </div>

            <div class="boa-table-controls">
                <div class="boa-search-box">
                    <input type="text" id="boa-students-search" placeholder="Search by name, email, or ID" class="boa-search-input">
                    <span class="dashicons dashicons-search"></span>
                </div>
                <select id="boa-course-filter" class="boa-filter-select">
                    <option value="">All Courses</option>
                    <?php 
                    // اب یہ اصلی کورسز لائے گا
                    $courses_data = boa_students_get_courses();
                    if(isset($courses_data['items'])) {
                        foreach ( $courses_data['items'] as $course ): ?>
                            <option value="<?php echo esc_attr( $course['course_id'] ); ?>">
                                <?php echo esc_html( $course['course_name'] ); ?>
                            </option>
                        <?php endforeach; 
                    }
                    ?>
                </select>
                <select id="boa-status-filter" class="boa-filter-select">
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                </select>
                <input type="date" id="boa-date-from" class="boa-date-input" placeholder="From Date">
                <input type="date" id="boa-date-to" class="boa-date-input" placeholder="To Date">
                <a href="#" class="boa-reset-link" onclick="BOA_ResetFilters()">Reset Filters</a>
            </div>

            <div class="boa-card boa-table-card">
                <div class="boa-card-header">
                    <h3>Students List</h3>
                </div>
                <div class="boa-card-content">
                    <table class="boa-data-table" id="boa-students-table">
                        <thead>
                            <tr>
                                <th width="30">
                                    <input type="checkbox" id="boa-select-all" onchange="BOA_ToggleSelectAll(this)">
                                </th>
                                <th>Student ID</th>
                                <th>Student Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Course</th>
                                <th>Admission Date</th>
                                <th>Status</th>
                                <th width="120">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="boa-students-tbody">
                            </tbody>
                    </table>

                    <div class="boa-pagination">
                        <div class="boa-pagination-info">
                            Showing <span id="boa-showing-from">1</span>-<span id="boa-showing-to">10</span> 
                            of <span id="boa-total-records">0</span> students
                        </div>
                        <div class="boa-pagination-controls">
                            <select id="boa-rows-per-page" class="boa-rows-select" onchange="BOA_ChangeRowsPerPage(this.value)">
                                <option value="10">10 rows</option>
                                <option value="25">25 rows</option>
                                <option value="50">50 rows</option>
                                <option value="100">100 rows</option>
                            </select>
                            <div class="boa-page-numbers" id="boa-page-numbers">
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="boa-sidebar">
            <div class="boa-card boa-filters-card">
                <div class="boa-card-header">
                    <h3>Quick Filters</h3>
                </div>
                <div class="boa-card-content">
                    <div class="boa-filter-chips">
                        <button class="boa-chip boa-chip-active" data-filter="all" onclick="BOA_SetQuickFilter('all')">All</button>
                        <button class="boa-chip" data-filter="active" onclick="BOA_SetQuickFilter('active')">Active</button>
                        <button class="boa-chip" data-filter="pending" onclick="BOA_SetQuickFilter('pending')">Pending</button>
                        <button class="boa-chip" data-filter="inactive" onclick="BOA_SetQuickFilter('inactive')">Inactive</button>
                    </div>
                    <div class="boa-course-filters">
                        <h4>By Course</h4>
                        <?php 
                        if(isset($courses_data['items'])) {
                            foreach ( $courses_data['items'] as $course ): ?>
                                <button class="boa-pill" data-course="<?php echo esc_attr( $course['course_id'] ); ?>" 
                                        onclick="BOA_FilterByCourse(<?php echo esc_attr( $course['course_id'] ); ?>)">
                                    <?php echo esc_html( $course['course_name'] ); ?>
                                </button>
                            <?php endforeach; 
                        }
                        ?>
                    </div>
                    <button class="boa-btn boa-btn-outline boa-btn-block" onclick="BOA_ClearAllFilters()">
                        Clear All Filters
                    </button>
                </div>
            </div>

            <div class="boa-card boa-snapshot-card">
                <div class="boa-card-header">
                    <h3>Students Snapshot</h3>
                </div>
                <div class="boa-card-content">
                    <div class="boa-chart-container">
                        <canvas id="boa-courses-chart" width="200" height="200"></canvas>
                    </div>
                    <div class="boa-popular-courses" id="boa-popular-courses">
                        </div>
                </div>
            </div>

            <div class="boa-card boa-recent-card">
                <div class="boa-card-header">
                    <h3>Recent Admissions</h3>
                </div>
                <div class="boa-card-content">
                    <div class="boa-recent-list" id="boa-recent-admissions">
                        </div>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-footer">
        <p>BSSMS – Computer Courses Management System</p>
    </div>
</div>

<div id="boa-student-profile" class="boa-slide-over">
    </div>

<div id="boa-student-modal" class="boa-modal">
    <div class="boa-modal-content">
        <div class="boa-modal-header">
            <h3 id="boa-modal-title">Add Student</h3>
            <button class="boa-close-btn" onclick="BOA_CloseStudentModal()">
                <span class="dashicons dashicons-no"></span>
            </button>
        </div>
        <div class="boa-modal-body">
            <form id="boa-student-form" onsubmit="return BOA_SaveStudent(event)">
                <div class="boa-form-row">
                    <div class="boa-form-group">
                        <label for="boa-student-name">Name *</label>
                        <input type="text" id="boa-student-name" name="name" required class="boa-form-input">
                    </div>
                </div>
                <div class="boa-form-row">
                    <div class="boa-form-group">
                        <label for="boa-student-email">Email *</label>
                        <input type="email" id="boa-student-email" name="email" required class="boa-form-input">
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-student-phone">Phone</label>
                        <input type="tel" id="boa-student-phone" name="phone" class="boa-form-input">
                    </div>
                </div>
                <div class="boa-form-row">
                    <div class="boa-form-group">
                        <label for="boa-student-course">Course *</label>
                        <select id="boa-student-course" name="course_id" required class="boa-form-select">
                            <option value="">Select Course</option>
                            <?php 
                            if(isset($courses_data['items'])) {
                                foreach ( $courses_data['items'] as $course ): ?>
                                    <option value="<?php echo esc_attr( $course['course_id'] ); ?>">
                                        <?php echo esc_html( $course['course_name'] ); ?>
                                    </option>
                                <?php endforeach; 
                            }
                            ?>
                        </select>
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-student-admission-date">Admission Date *</label>
                        <input type="date" id="boa-student-admission-date" name="admission_date" required class="boa-form-input" value="<?php echo date('Y-m-d'); ?>">
                    </div>
                </div>
                <div class="boa-form-row">
                    <div class="boa-form-group">
                        <label for="boa-student-status">Status *</label>
                        <select id="boa-student-status" name="status" required class="boa-form-select">
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-student-id">Student ID</label>
                        <input type="text" id="boa-student-id" name="student_id" class="boa-form-input" readonly>
                        <small>Auto-generated</small>
                    </div>
                </div>
            </form>
        </div>
        <div class="boa-modal-footer">
            <button type="button" class="boa-btn boa-btn-secondary" onclick="BOA_CloseStudentModal()">Cancel</button>
            <button type="submit" form="boa-student-form" class="boa-btn boa-btn-primary">Save Student</button>
        </div>
    </div>
</div>

<div id="boa-import-modal" class="boa-modal">
    </div>

<?php 
// (سلائیڈ اوور کا باقی HTML، امپورٹ موڈل، اور ٹیمپلیٹس یہاں موجود ہیں)
// ... (انہیں مکمل فائل میں شامل کر دیا گیا ہے)
?>

<div id="boa-student-profile" class="boa-slide-over">
    <div class="boa-slide-over-content">
        <div class="boa-slide-over-header">
            <h3 id="boa-profile-title">Student Profile</h3>
            <button class="boa-close-btn" onclick="BOA_CloseStudentProfile()">
                <span class="dashicons dashicons-no"></span>
            </button>
        </div>
        <div class="boa-slide-over-body">
            <div class="boa-profile-tabs">
                <button class="boa-tab-btn boa-tab-active" data-tab="profile">Profile</button>
                <button class="boa-tab-btn" data-tab="fees">Fee History</button>
                <button class="boa-tab-btn" data-tab="documents">Documents</button>
            </div>

            <div id="boa-tab-profile" class="boa-tab-content boa-tab-active">
                <div class="boa-profile-actions">
                    <button class="boa-btn boa-btn-primary" onclick="BOA_EditStudent()">Edit Profile</button>
                    <button class="boa-btn boa-btn-danger" onclick="BOA_DeleteStudent()">Delete Student</button>
                </div>
                <div class="boa-profile-details">
                    <div class="boa-detail-row">
                        <label>Student Name:</label>
                        <span id="boa-profile-name">-</span>
                    </div>
                    <div class="boa-detail-row">
                        <label>Student ID:</label>
                        <span id="boa-profile-id">-</span>
                    </div>
                    <div class="boa-detail-row">
                        <label>Email:</label>
                        <span id="boa-profile-email">-</span>
                    </div>
                    <div class="boa-detail-row">
                        <label>Phone:</label>
                        <span id="boa-profile-phone">-</span>
                    </div>
                    <div class="boa-detail-row">
                        <label>Course:</label>
                        <span id="boa-profile-course">-</span>
                    </div>
                    <div class="boa-detail-row">
                        <label>Admission Date:</label>
                        <span id="boa-profile-admission-date">-</span>
                    </div>
                    <div class="boa-detail-row">
                        <label>Status:</label>
                        <span id="boa-profile-status-badge" class="boa-status-badge">-</span>
                    </div>
                </div>
            </div>

            <div id="boa-tab-fees" class="boa-tab-content">
                <div class="boa-fee-actions">
                    <button class="boa-btn boa-btn-secondary" onclick="BOA_ExportFeeExcel()">Excel Download</button>
                    <button class="boa-btn boa-btn-secondary" onclick="BOA_PrintFeeHistory()">Print</button>
                </div>
                <table class="boa-data-table boa-fee-table">
                    <thead>
                        <tr>
                            <th>Payment Date</th>
                            <th>Amount Paid</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Receipt</th>
                        </tr>
                    </thead>
                    <tbody id="boa-fee-history-tbody">
                        </tbody>
                </table>
            </div>

            <div id="boa-tab-documents" class="boa-tab-content">
                <div class="boa-documents-grid" id="boa-documents-list">
                    </div>
            </div>
        </div>
    </div>
</div>

<div id="boa-import-modal" class="boa-modal">
    <div class="boa-modal-content">
        <div class="boa-modal-header">
            <h3>Import Students</h3>
            <button class="boa-close-btn" onclick="BOA_CloseImportModal()">
                <span class="dashicons dashicons-no"></span>
            </button>
        </div>
        <div class="boa-modal-body">
            <div class="boa-import-instructions">
                <p>Upload a CSV file with the following columns:</p>
                <ul>
                    <li>Student Name</li>
                    <li>Email</li>
                    <li>Phone</li>
                    <li>Course</li>
                    <li>Admission Date</li>
                    <li>Status</li>
                </ul>
            </div>
            <div class="boa-upload-area" id="boa-upload-area">
                <span class="dashicons dashicons-upload"></span>
                <p>Drop CSV file here or click to browse</p>
                <input type="file" id="boa-csv-file" accept=".csv" style="display: none;">
            </div>
            <div id="boa-mapping-preview" style="display: none;">
                <h4>Column Mapping Preview</h4>
                <table class="boa-data-table">
                    <thead id="boa-mapping-headers"></thead>
                    <tbody id="boa-mapping-preview-body"></tbody>
                </table>
            </div>
        </div>
        <div class="boa-modal-footer">
            <button class="boa-btn boa-btn-secondary" onclick="BOA_CloseImportModal()">Cancel</button>
            <button class="boa-btn boa-btn-primary" id="boa-import-btn" disabled onclick="BOA_ProcessImport()">Import</button>
        </div>
    </div>
</div>

<div id="boa-discount-modal" class="boa-modal">
    <div class="boa-modal-content">
        <div class="boa-modal-header">
            <h3>Apply Discount</h3>
            <button class="boa-close-btn" onclick="BOA_CloseDiscountModal()">
                <span class="dashicons dashicons-no"></span>
            </button>
        </div>
        <div class="boa-modal-body">
            <div class="boa-student-info">
                <h4 id="boa-discount-student-name">Student Name</h4>
                <p id="boa-discount-student-course">Course Name</p>
                <p id="boa-discount-student-phone">Phone: +1234567890</p>
            </div>
            
            <div class="boa-fee-summary">
                <div class="boa-fee-row">
                    <span>Total Due:</span>
                    <strong id="boa-discount-total-due">PKR 0.00</strong>
                </div>
                <div class="boa-fee-row">
                    <span>Total Paid:</span>
                    <strong id="boa-discount-total-paid">PKR 0.00</strong>
                </div>
                <div class="boa-fee-row boa-fee-row-pending">
                    <span>Pending Amount:</span>
                    <strong id="boa-discount-pending">PKR 0.00</strong>
                </div>
            </div>
            
            <form id="boa-discount-form" onsubmit="return BOA_ApplyDiscount(event)">
                <div class="boa-form-group">
                    <label for="boa-discount-amount">Discount Amount *</label>
                    <input type="number" id="boa-discount-amount" name="discount_amount" required step="0.01" min="0" placeholder="0.00">
                    <small>Auto-filled with pending amount. You can modify this value.</small>
                </div>
                <div class="boa-form-group">
                    <label for="boa-discount-reason">Discount Reason *</label>
                    <textarea id="boa-discount-reason" name="discount_reason" required rows="3" placeholder="Enter reason for discount..."></textarea>
                </div>
                <input type="hidden" id="boa-discount-student-id" name="student_id">
            </form>
        </div>
        <div class="boa-modal-footer">
            <button type="button" class="boa-btn boa-btn-secondary" onclick="BOA_CloseDiscountModal()">Cancel</button>
            <button type="submit" form="boa-discount-form" class="boa-btn boa-btn-primary">Apply Discount</button>
        </div>
    </div>
</div>

<template id="boa-student-row-template">
    <tr class="boa-student-row">
        <td><input type="checkbox" class="boa-student-checkbox" onchange="BOA_UpdateBulkActions()"></td>
        <td class="boa-student-id"></td>
        <td class="boa-student-name"></td>
        <td class="boa-student-email"></td>
                <td class="boa-student-phone">
                    <span class="boa-phone-display"></span>
                    <button class="boa-whatsapp-btn" onclick="BOA_SendWhatsApp(this)" title="Send WhatsApp Message">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487"/>
                        </svg>
                    </button>
                </td>
        <td class="boa-student-course"></td>
        <td class="boa-admission-date"></td>
        <td><span class="boa-status-badge"></span></td>
        <td>
            <div class="boa-action-buttons">
                <button class="boa-btn-icon boa-btn-view" onclick="BOA_ViewStudent(this)" title="View">
                    <span class="dashicons dashicons-visibility"></span>
                </button>
                <button class="boa-btn-icon boa-btn-edit" onclick="BOA_EditStudentRow(this)" title="Edit">
                    <span class="dashicons dashicons-edit"></span>
                </button>
                <button class="boa-btn-icon boa-btn-delete" onclick="BOA_DeleteStudentRow(this)" title="Delete">
                    <span class="dashicons dashicons-trash"></span>
                </button>
                <button class="boa-btn-icon boa-btn-discount" onclick="BOA_OpenDiscountModal(this)" title="Apply Discount">
                    <span class="dashicons dashicons-money-alt"></span>
                </button>
            </div>
        </td>
    </tr>
</template>

<template id="boa-fee-history-row-template">
    <tr class="boa-fee-row">
        <td class="boa-payment-date"></td>
        <td class="boa-amount-paid"></td>
        <td class="boa-due-date"></td>
        <td><span class="boa-status-badge"></span></td>
        <td>
            <button class="boa-btn-icon boa-btn-view" onclick="BOA_ViewReceipt(this)" title="View Receipt">
                <span class="dashicons dashicons-media-document"></span>
            </button>
        </td>
    </tr>
</template>

<template id="boa-document-item-template">
    <div class="boa-document-item">
        <div class="boa-document-icon">
            <span class="dashicons dashicons-media-document"></span>
        </div>
        <div class="boa-document-info">
            <div class="boa-document-name"></div>
            <div class="boa-document-date"></div>
        </div>
        <div class="boa-document-actions">
            <button class="boa-btn-icon" onclick="BOA_ViewDocument(this)" title="View">
                <span class="dashicons dashicons-visibility"></span>
            </button>
            <button class="boa-btn-icon" onclick="BOA_DownloadDocument(this)" title="Download">
                <span class="dashicons dashicons-download"></span>
            </button>
            <button class="boa-btn-icon" onclick="BOA_DeleteDocument(this)" title="Delete">
                <span class="dashicons dashicons-trash"></span>
            </button>
        </div>
    </div>
</template>

<template id="boa-recent-admission-template">
    <div class="boa-recent-item">
        <div class="boa-recent-name"></div>
        <div class="boa-recent-course"></div>
        <div class="boa-recent-date"></div>
    </div>
</template>

<template id="boa-popular-course-template">
    <div class="boa-popular-course">
        <span class="boa-course-name"></span>
        <span class="boa-student-count"></span>
    </div>
</template>

// ✅ Syntax verified block end
