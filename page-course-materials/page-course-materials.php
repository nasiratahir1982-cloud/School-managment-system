<?php
/**
 * Admin Page: Course Materials
 */
if ( ! defined( 'ABSPATH' ) ) exit;

$courses = BOA_DB::get_courses( array( 'per_page' => -1 ) ); // Get all courses
?>

<style>
/* Inline facelift for Course Materials */
#boa-admin-materials-root{background:radial-gradient(circle at 14% 18%,#e0f2fe 0,#f8fafc 36%),radial-gradient(circle at 78% 0,#eef2ff 0,#ffffff 38%),#f8fafc;padding:var(--boa-space-8);border-radius:18px;box-shadow:0 12px 30px rgba(15,23,42,.08);min-height:100vh;}
.boa-materials-hero{display:flex;gap:var(--boa-space-6);align-items:stretch;background:linear-gradient(135deg,#2563eb,#0ea5e9);color:#fff;position:relative;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 12px 28px rgba(15,23,42,.12);overflow:hidden;margin-bottom:var(--boa-space-6);}
.boa-materials-hero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 70% 20%,rgba(255,255,255,.16),transparent 36%);pointer-events:none;}
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
@media(max-width:960px){.boa-materials-hero{flex-direction:column;}.boa-hero-right{justify-content:flex-start;}}
</style>

<div id="boa-admin-materials-root" class="boa-admin-wrap">
    <div class="boa-materials-hero">
        <div class="boa-hero-left">
            <p class="boa-hero-kicker"><?php esc_html_e( 'Resource Hub', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-title">
                <h1><?php esc_html_e( 'Course Materials', 'baba-online-academy' ); ?></h1>
                <span class="boa-hero-chip"><?php esc_html_e( 'Uploads & links', 'baba-online-academy' ); ?></span>
            </div>
            <p class="boa-hero-lead"><?php esc_html_e( 'Add, organize, and publish materials for every course from one clean workspace.', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-pills">
                <span class="boa-pill"><span class="dashicons dashicons-portfolio"></span><?php esc_html_e( 'Resources', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-upload"></span><?php esc_html_e( 'Uploads', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-visibility"></span><?php esc_html_e( 'Audit ready', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-hero-actions">
                <button class="boa-btn boa-btn-primary" id="boa-refresh-materials">
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
                        <strong><?php echo number_format( count( $courses['items'] ?? array() ) ); ?></strong>
                    </div>
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Types', 'baba-online-academy' ); ?></span>
                        <strong><?php esc_html_e( 'PDF / Video / Links', 'baba-online-academy' ); ?></strong>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-card">
        <div class="boa-card-header">
            <h3>Manage Materials</h3>
        </div>
        <div class="boa-card-content">
            <div class="boa-form-row">
                <label for="boa-course-filter">Select a Course:</label>
                <select id="boa-course-filter" onchange="loadMaterials()">
                    <option value="">-- Select Course --</option>
                    <?php foreach ( $courses['items'] as $course ) : ?>
                        <option value="<?php echo esc_attr( $course['course_id'] ); ?>"><?php echo esc_html( $course['course_name'] ); ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>
    </div>

    <div id="boa-materials-list-container" class="boa-card" style="display: none;">
        <div class="boa-card-header">
            <h3 id="boa-materials-course-title"></h3>
        </div>
        <div class="boa-card-content">
            <table class="boa-data-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Link</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="boa-materials-tbody">
                    <!-- Materials will be loaded here via AJAX -->
                </tbody>
            </table>
        </div>
    </div>

    <div id="boa-add-material-container" class="boa-card" style="display: none;">
        <div class="boa-card-header">
            <h3>Add New Material</h3>
        </div>
        <div class="boa-card-content">
            <form id="boa-add-material-form" onsubmit="return addMaterial()">
                <input type="hidden" id="boa-material-course-id" value="">
                <div class="boa-form-row">
                    <label for="boa-material-title">Title:</label>
                    <input type="text" id="boa-material-title" required>
                </div>
                <div class="boa-form-row">
                    <label for="boa-material-type">Type:</label>
                    <select id="boa-material-type" required>
                        <option value="pdf">PDF</option>
                        <option value="video">Video Link</option>
                        <option value="link">External Link</option>
                        <option value="text">Text/Notes</option>
                    </select>
                </div>
                <div class="boa-form-row">
                    <label for="boa-material-url">Content URL:</label>
                    <input type="url" id="boa-material-url" placeholder="https:// or file path">
                </div>
                <div class="boa-form-row">
                    <label for="boa-material-description">Description:</label>
                    <textarea id="boa-material-description"></textarea>
                </div>
                <div class="boa-form-row">
                    <button type="submit" class="boa-btn boa-btn-primary">Add Material</button>
                </div>
            </form>
        </div>
    </div>
</div>
