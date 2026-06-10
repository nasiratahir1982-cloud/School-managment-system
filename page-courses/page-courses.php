<?php
// Courses Management - enhanced UI
if (!defined('ABSPATH')) exit;

if ( ! function_exists( 'boa_courses_get_categories' ) ) {
    function boa_courses_get_categories() {
        global $wpdb;
        if ( ! isset( $wpdb ) ) {
            return array();
        }

        return $wpdb->get_results("
            SELECT category_id, category_name 
            FROM {$wpdb->prefix}boa_categories 
            ORDER BY category_name
        ", ARRAY_A);
    }
}

if ( ! function_exists( 'boa_courses_get_instructors' ) ) {
    function boa_courses_get_instructors() {
        $users = get_users(
            array(
                'role'    => 'instructor',
                'orderby' => 'display_name',
                'order'   => 'ASC',
                'number'  => 999,
            )
        );

        return is_array( $users ) ? $users : array();
    }
}

$boa_categories = boa_courses_get_categories();
$boa_instructors = boa_courses_get_instructors();
?>

<script>
// Provide AJAX/config data to the courses JS
window.boa_courses_data = {
    ajax_url: "<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>",
    nonce: "<?php echo esc_attr( wp_create_nonce( 'boa_courses_nonce' ) ); ?>",
    categories: <?php echo wp_json_encode( $boa_categories ); ?>,
    courses_stats: { total: 0, active: 0, inactive: 0 },
    category_stats: []
};
</script>

<style>
/* Inline facelift for Courses */
#boa-courses-root{background:radial-gradient(circle at 14% 18%,#e0f2fe 0,#f8fafc 36%),radial-gradient(circle at 78% 0,#eef2ff 0,#ffffff 38%),#f8fafc;padding:var(--boa-space-8);border-radius:18px;box-shadow:0 12px 30px rgba(15,23,42,.08);min-height:100vh;}
.boa-courses-hero{display:flex;gap:var(--boa-space-6);align-items:stretch;background:linear-gradient(135deg,#2563eb,#0ea5e9);color:#fff;position:relative;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 12px 28px rgba(15,23,42,.12);overflow:hidden;margin-bottom:var(--boa-space-6);}
.boa-courses-hero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 70% 20%,rgba(255,255,255,.16),transparent 36%);pointer-events:none;}
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
@media(max-width:960px){.boa-courses-hero{flex-direction:column;}.boa-hero-right{justify-content:flex-start;}}
</style>

<div id="boa-courses-root">
    <div class="boa-courses-hero">
        <div class="boa-hero-left">
            <p class="boa-hero-kicker"><?php esc_html_e( 'Catalog Hub', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-title">
                <h1><?php esc_html_e( 'Courses Management', 'baba-online-academy' ); ?></h1>
                <span class="boa-hero-chip"><?php esc_html_e( 'Catalog & profit', 'baba-online-academy' ); ?></span>
            </div>
            <p class="boa-hero-lead"><?php esc_html_e( 'Manage course details, categories, instructors, and profitability with a modern workspace.', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-pills">
                <span class="boa-pill"><span class="dashicons dashicons-welcome-learn-more"></span><?php esc_html_e( 'Catalog', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-groups"></span><?php esc_html_e( 'Instructors', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-money-alt"></span><?php esc_html_e( 'Profitability', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-hero-actions">
                <button class="boa-btn boa-btn-primary" onclick="BOA_OpenAddCourseModal()">
                    <span class="dashicons dashicons-plus"></span>
                    <?php esc_html_e( 'Add Course', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_OpenImportModal()">
                    <span class="dashicons dashicons-upload"></span>
                    <?php esc_html_e( 'Import', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_ExportCourses()">
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
                <button class="boa-btn boa-btn-secondary" onclick="BOA_PrintCourses()">
                    <span class="dashicons dashicons-printer"></span>
                    <?php esc_html_e( 'Print', 'baba-online-academy' ); ?>
                </button>
            </div>
        </div>
        <div class="boa-hero-right">
            <div class="boa-hero-card">
                <p class="boa-hero-note"><span class="dashicons dashicons-chart-pie"></span><?php esc_html_e( 'Snapshot', 'baba-online-academy' ); ?></p>
                <div class="boa-hero-metrics">
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Categories', 'baba-online-academy' ); ?></span>
                        <strong><?php echo number_format( count( boa_courses_get_categories() ) ); ?></strong>
                    </div>
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Instructors', 'baba-online-academy' ); ?></span>
                        <strong><?php echo number_format( count( boa_courses_get_instructors() ) ); ?></strong>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-card" style="margin-bottom: var(--boa-space-5);">
        <div class="boa-card-header">
            <div>
                <p class="boa-card-kicker"><?php esc_html_e( 'Overview', 'baba-online-academy' ); ?></p>
                <h3 style="margin:0;"><?php esc_html_e( 'Course Snapshot', 'baba-online-academy' ); ?></h3>
            </div>
            <span class="boa-soft-pill"><span class="dashicons dashicons-chart-bar"></span><?php esc_html_e( 'Live data', 'baba-online-academy' ); ?></span>
        </div>
        <div class="boa-card-content">
            <div class="boa-stats-grid">
                <div class="boa-card boa-summary-card">
                    <div class="boa-card-icon boa-color-blue"><span class="dashicons dashicons-welcome-learn-more boa-text-white"></span></div>
                    <div class="boa-summary-number" id="boa-total-courses">0</div>
                    <div class="boa-summary-label"><?php esc_html_e( 'Total Courses', 'baba-online-academy' ); ?></div>
                </div>
                <div class="boa-card boa-summary-card">
                    <div class="boa-card-icon boa-color-green"><span class="dashicons dashicons-yes boa-text-white"></span></div>
                    <div class="boa-summary-number" id="boa-active-courses">0</div>
                    <div class="boa-summary-label"><?php esc_html_e( 'Active', 'baba-online-academy' ); ?></div>
                </div>
                <div class="boa-card boa-summary-card">
                    <div class="boa-card-icon boa-color-orange"><span class="dashicons dashicons-dismiss boa-text-white"></span></div>
                    <div class="boa-summary-number" id="boa-inactive-courses">0</div>
                    <div class="boa-summary-label"><?php esc_html_e( 'Inactive', 'baba-online-academy' ); ?></div>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-card">
        <div class="boa-card-header">
            <div>
                <p class="boa-card-kicker"><?php esc_html_e( 'Filters', 'baba-online-academy' ); ?></p>
                <h3 style="margin:0;"><?php esc_html_e( 'Find Courses', 'baba-online-academy' ); ?></h3>
            </div>
            <span class="boa-soft-pill"><span class="dashicons dashicons-filter"></span><?php esc_html_e( 'Search & refine', 'baba-online-academy' ); ?></span>
        </div>
        <div class="boa-card-content">
            <div class="boa-filter-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--boa-space-4);">
                <div class="boa-form-group">
                    <label for="boa-courses-search"><?php esc_html_e( 'Search', 'baba-online-academy' ); ?></label>
                    <input type="text" id="boa-courses-search" class="boa-form-input" placeholder="<?php esc_attr_e( 'Search by name...', 'baba-online-academy' ); ?>">
                </div>
                <div class="boa-form-group">
                    <label for="boa-category-filter"><?php esc_html_e( 'Category', 'baba-online-academy' ); ?></label>
                    <select id="boa-category-filter" class="boa-form-select">
                        <option value=""><?php esc_html_e( 'All', 'baba-online-academy' ); ?></option>
                        <?php foreach ( $boa_categories as $cat ) : ?>
                            <option value="<?php echo esc_attr( $cat['category_id'] ); ?>"><?php echo esc_html( $cat['category_name'] ); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="boa-form-group">
                    <label for="boa-status-filter"><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></label>
                    <select id="boa-status-filter" class="boa-form-select">
                        <option value=""><?php esc_html_e( 'All', 'baba-online-academy' ); ?></option>
                        <option value="active"><?php esc_html_e( 'Active', 'baba-online-academy' ); ?></option>
                        <option value="inactive"><?php esc_html_e( 'Inactive', 'baba-online-academy' ); ?></option>
                    </select>
                </div>
                <div class="boa-form-group">
                    <label for="boa-duration-filter"><?php esc_html_e( 'Duration', 'baba-online-academy' ); ?></label>
                    <select id="boa-duration-filter" class="boa-form-select">
                        <option value=""><?php esc_html_e( 'Any', 'baba-online-academy' ); ?></option>
                        <option value="short"><?php esc_html_e( 'Short', 'baba-online-academy' ); ?></option>
                        <option value="medium"><?php esc_html_e( 'Medium', 'baba-online-academy' ); ?></option>
                        <option value="long"><?php esc_html_e( 'Long', 'baba-online-academy' ); ?></option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-card boa-table-card">
        <div class="boa-card-header">
            <div>
                <p class="boa-card-kicker"><?php esc_html_e( 'Catalog', 'baba-online-academy' ); ?></p>
                <h3 style="margin:0;"><?php esc_html_e( 'Courses List', 'baba-online-academy' ); ?></h3>
            </div>
            <span class="boa-soft-pill"><span class="dashicons dashicons-list-view"></span><?php esc_html_e( 'All courses', 'baba-online-academy' ); ?></span>
        </div>
        <div class="boa-card-content">
            <div class="boa-table-wrapper">
                <table class="boa-data-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th><?php esc_html_e( 'ID', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Name', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Category', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Instructors', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Duration', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Start', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'End', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Fee', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Actions', 'baba-online-academy' ); ?></th>
                        </tr>
                    </thead>
                    <tbody id="boa-courses-tbody"></tbody>
                </table>
            </div>
            <div class="boa-pagination" style="margin-top:var(--boa-space-4);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--boa-space-3);">
                <div class="boa-pagination-info">
                    <?php esc_html_e( 'Showing', 'baba-online-academy' ); ?> <span id="boa-showing-from">0</span>-<span id="boa-showing-to">0</span> <?php esc_html_e( 'of', 'baba-online-academy' ); ?> <span id="boa-total-records">0</span>
                </div>
                <div class="boa-page-numbers" id="boa-page-numbers"></div>
            </div>
        </div>
    </div>

    <div class="boa-card boa-full-width">
        <div class="boa-card-header">
            <div>
                <p class="boa-card-kicker"><?php esc_html_e( 'Categories', 'baba-online-academy' ); ?></p>
                <h3 style="margin:0;"><?php esc_html_e( 'Manage Categories', 'baba-online-academy' ); ?></h3>
            </div>
            <span class="boa-soft-pill"><span class="dashicons dashicons-admin-network"></span><?php esc_html_e( 'Classes view', 'baba-online-academy' ); ?></span>
        </div>
        <div class="boa-card-content">
            <div style="display:grid;grid-template-columns:2fr 1fr;gap:var(--boa-space-4);align-items:start;">
                <div>
                    <h4 style="margin:0 0 8px 0;"><?php esc_html_e( 'All Categories', 'baba-online-academy' ); ?></h4>
                    <div id="boa-categories-list" class="boa-categories-list"></div>
                </div>
                <div>
                    <h4 style="margin:0 0 8px 0;"><?php esc_html_e( 'Popular', 'baba-online-academy' ); ?></h4>
                    <div id="boa-popular-categories"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-card">
        <div class="boa-card-header">
            <div>
                <p class="boa-card-kicker"><?php esc_html_e( 'Admin', 'baba-online-academy' ); ?></p>
                <h3 style="margin:0;"><?php esc_html_e( 'Manage Categories Table', 'baba-online-academy' ); ?></h3>
            </div>
        </div>
        <div class="boa-card-content">
            <div class="boa-table-wrapper">
                <table class="boa-data-table">
                    <thead>
                        <tr>
                            <th><?php esc_html_e( 'Category', 'baba-online-academy' ); ?></th>
                            <th><?php esc_html_e( 'Courses', 'baba-online-academy' ); ?></th>
                        </tr>
                    </thead>
                    <tbody id="boa-manage-categories-tbody"></tbody>
                </table>
            </div>
        </div>
    </div>

    <div id="boa-course-details" class="boa-card" style="display:none;">
        <div class="boa-card-header">
            <h3 id="boa-course-detail-title"><?php esc_html_e( 'Course Details', 'baba-online-academy' ); ?></h3>
            <button class="boa-btn boa-btn-secondary" onclick="BOA_CloseCourseDetails()"><?php esc_html_e( 'Close', 'baba-online-academy' ); ?></button>
        </div>
        <div class="boa-card-content">
            <p><strong><?php esc_html_e( 'Name:', 'baba-online-academy' ); ?></strong> <span id="boa-detail-name"></span></p>
            <p><strong><?php esc_html_e( 'Category:', 'baba-online-academy' ); ?></strong> <span id="boa-detail-category"></span></p>
            <p><strong><?php esc_html_e( 'Duration:', 'baba-online-academy' ); ?></strong> <span id="boa-detail-duration"></span></p>
            <p><strong><?php esc_html_e( 'Start:', 'baba-online-academy' ); ?></strong> <span id="boa-detail-start-date"></span></p>
            <p><strong><?php esc_html_e( 'End:', 'baba-online-academy' ); ?></strong> <span id="boa-detail-end-date"></span></p>
            <p><strong><?php esc_html_e( 'Fee:', 'baba-online-academy' ); ?></strong> <span id="boa-detail-fee"></span></p>
            <p><strong><?php esc_html_e( 'Status:', 'baba-online-academy' ); ?></strong> <span id="boa-detail-status-badge" class="boa-status-badge"></span></p>
            <p id="boa-detail-description"></p>
        </div>
    </div>

    <div id="boa-course-modal" class="boa-modal">
        <div class="boa-modal-content">
            <div class="boa-modal-header">
                <h3 id="boa-modal-title"><?php esc_html_e( 'Add Course', 'baba-online-academy' ); ?></h3>
                <button class="boa-close-btn" onclick="BOA_CloseCourseModal()"><span class="dashicons dashicons-no"></span></button>
            </div>
            <div class="boa-modal-body">
                <form id="boa-course-form" onsubmit="return BOA_SaveCourse(event)">
                    <div class="boa-form-group">
                        <label for="boa-course-id"><?php esc_html_e( 'Course ID', 'baba-online-academy' ); ?></label>
                        <input type="text" id="boa-course-id" name="course_id" readonly>
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-course-name"><?php esc_html_e( 'Course Name', 'baba-online-academy' ); ?></label>
                        <input type="text" id="boa-course-name" name="course_name" required>
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-course-category"><?php esc_html_e( 'Category', 'baba-online-academy' ); ?></label>
                        <select id="boa-course-category" name="category_id" required>
                            <option value=""><?php esc_html_e( 'Select category', 'baba-online-academy' ); ?></option>
                            <?php foreach ( $boa_categories as $cat ) : ?>
                                <option value="<?php echo esc_attr( $cat['category_id'] ); ?>"><?php echo esc_html( $cat['category_name'] ); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-course-duration"><?php esc_html_e( 'Duration', 'baba-online-academy' ); ?></label>
                        <input type="text" id="boa-course-duration" name="duration">
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-course-start-date"><?php esc_html_e( 'Start Date', 'baba-online-academy' ); ?></label>
                        <input type="date" id="boa-course-start-date" name="start_date">
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-course-end-date"><?php esc_html_e( 'End Date', 'baba-online-academy' ); ?></label>
                        <input type="date" id="boa-course-end-date" name="end_date">
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-course-fee"><?php esc_html_e( 'Fee Amount', 'baba-online-academy' ); ?></label>
                        <input type="number" id="boa-course-fee" name="fee_amount" step="0.01">
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-course-status"><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></label>
                        <select id="boa-course-status" name="status">
                            <option value="active"><?php esc_html_e( 'Active', 'baba-online-academy' ); ?></option>
                            <option value="inactive"><?php esc_html_e( 'Inactive', 'baba-online-academy' ); ?></option>
                        </select>
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-course-instructors"><?php esc_html_e( 'Instructors', 'baba-online-academy' ); ?></label>
                        <select id="boa-course-instructors" name="instructors[]" multiple>
                            <?php foreach ( $boa_instructors as $instr ) : ?>
                                <option value="<?php echo esc_attr( $instr->ID ); ?>"><?php echo esc_html( $instr->display_name ); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-course-description"><?php esc_html_e( 'Description', 'baba-online-academy' ); ?></label>
                        <textarea id="boa-course-description" name="description" rows="3"></textarea>
                    </div>
                    <div class="boa-form-actions">
                        <button type="submit" class="boa-btn boa-btn-primary"><?php esc_html_e( 'Save', 'baba-online-academy' ); ?></button>
                        <button type="button" class="boa-btn boa-btn-secondary" onclick="BOA_CloseCourseModal()"><?php esc_html_e( 'Cancel', 'baba-online-academy' ); ?></button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <template id="boa-course-row-template">
        <tr class="boa-course-row">
            <td><input type="checkbox" class="boa-course-checkbox" /></td>
            <td class="boa-course-id"></td>
            <td class="boa-course-name"></td>
            <td class="boa-course-category"></td>
            <td class="boa-course-instructors"></td>
            <td class="boa-course-duration"></td>
            <td class="boa-course-start-date"></td>
            <td class="boa-course-end-date"></td>
            <td class="boa-course-fee"></td>
            <td><span class="boa-status-badge"></span></td>
            <td>
                <div class="boa-table-actions">
                    <button class="boa-btn-icon" onclick="BOA_ViewCourse(this)"><span class="dashicons dashicons-visibility"></span></button>
                    <button class="boa-btn-icon" onclick="BOA_EditCourse(this)"><span class="dashicons dashicons-edit"></span></button>
                    <button class="boa-btn-icon" onclick="BOA_DeleteCourse(this)"><span class="dashicons dashicons-trash"></span></button>
                </div>
            </td>
        </tr>
    </template>

    <template id="boa-category-item-template">
        <div class="boa-category-item" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:8px;">
            <span class="boa-category-name"></span>
            <span class="dashicons dashicons-move"></span>
        </div>
    </template>

    <template id="boa-popular-category-template">
        <div class="boa-popular-category" style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:8px;">
            <span class="boa-category-name"></span>
            <span class="boa-courses-count"></span>
        </div>
    </template>

    <template id="boa-student-row-template">
        <tr class="boa-student-row">
            <td class="boa-student-name"></td>
            <td class="boa-admission-date"></td>
            <td><span class="boa-status-badge"></span></td>
        </tr>
    </template>

    <template id="boa-manage-category-template">
        <tr class="boa-manage-category-row">
            <td class="boa-category-name"></td>
            <td class="boa-courses-count"></td>
        </tr>
    </template>
</div>
