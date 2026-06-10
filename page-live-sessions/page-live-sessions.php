<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
?>

<style>
/* Inline facelift for Live Sessions */
#boa-live-sessions-root{background:radial-gradient(circle at 14% 18%,#e0f2fe 0,#f8fafc 36%),radial-gradient(circle at 78% 0,#eef2ff 0,#ffffff 38%),#f8fafc;padding:var(--boa-space-8);border-radius:18px;box-shadow:0 12px 30px rgba(15,23,42,.08);min-height:100vh;}
.boa-live-hero{display:flex;gap:var(--boa-space-6);align-items:stretch;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;position:relative;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 12px 28px rgba(15,23,42,.12);overflow:hidden;margin-bottom:var(--boa-space-6);}
.boa-live-hero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 70% 20%,rgba(255,255,255,.16),transparent 36%);pointer-events:none;}
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
@media(max-width:960px){.boa-live-hero{flex-direction:column;}.boa-hero-right{justify-content:flex-start;}}
</style>

<div id="boa-live-sessions-root" class="boa-admin-wrap">
    <div class="boa-live-hero">
        <div class="boa-hero-left">
            <p class="boa-hero-kicker"><?php esc_html_e( 'Streaming Hub', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-title">
                <h1><?php esc_html_e( 'Live Sessions', 'baba-online-academy' ); ?></h1>
                <span class="boa-hero-chip"><?php esc_html_e( 'Classes & links', 'baba-online-academy' ); ?></span>
            </div>
            <p class="boa-hero-lead"><?php esc_html_e( 'Plan online classes, share join links, and track attendance in one focused space.', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-pills">
                <span class="boa-pill"><span class="dashicons dashicons-video-alt3"></span><?php esc_html_e( 'Live', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-forms"></span><?php esc_html_e( 'Attendance', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-visibility"></span><?php esc_html_e( 'Audit ready', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-hero-actions">
                <button class="boa-btn boa-btn-primary" id="boa-session-add-btn">
                    <span class="dashicons dashicons-plus-alt2"></span>
                    <?php esc_html_e( 'New Session', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" id="boa-session-refresh">
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
                        <span class="boa-text-muted"><?php esc_html_e( 'Statuses', 'baba-online-academy' ); ?></span>
                        <strong><?php esc_html_e( 'Scheduled / Completed / Cancelled', 'baba-online-academy' ); ?></strong>
                    </div>
                    <div>
                        <span class="boa-text-muted"><?php esc_html_e( 'Modes', 'baba-online-academy' ); ?></span>
                        <strong><?php esc_html_e( 'Zoom / Meet / Custom', 'baba-online-academy' ); ?></strong>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="boa-card">
        <div class="boa-card-header">
            <h3><?php esc_html_e( 'Scheduled Sessions', 'baba-online-academy' ); ?></h3>
            <div class="boa-session-filters">
                <select id="boa-session-course-filter">
                    <option value=""><?php esc_html_e( 'All Courses', 'baba-online-academy' ); ?></option>
                </select>
                <select id="boa-session-status-filter">
                    <option value=""><?php esc_html_e( 'All Statuses', 'baba-online-academy' ); ?></option>
                    <option value="scheduled"><?php esc_html_e( 'Scheduled', 'baba-online-academy' ); ?></option>
                    <option value="completed"><?php esc_html_e( 'Completed', 'baba-online-academy' ); ?></option>
                    <option value="cancelled"><?php esc_html_e( 'Cancelled', 'baba-online-academy' ); ?></option>
                </select>
                <input type="search" id="boa-session-search" placeholder="<?php esc_attr_e( 'Search sessions…', 'baba-online-academy' ); ?>">
                <button class="boa-btn boa-btn-secondary" id="boa-session-refresh">
                    <span class="dashicons dashicons-update"></span>
                    <?php esc_html_e( 'Refresh', 'baba-online-academy' ); ?>
                </button>
            </div>
        </div>
        <div class="boa-card-content">
            <table class="boa-data-table" id="boa-live-sessions-table">
                <thead>
                    <tr>
                        <th><?php esc_html_e( 'Session', 'baba-online-academy' ); ?></th>
                        <th><?php esc_html_e( 'Course', 'baba-online-academy' ); ?></th>
                        <th><?php esc_html_e( 'Start Time', 'baba-online-academy' ); ?></th>
                        <th><?php esc_html_e( 'Instructor', 'baba-online-academy' ); ?></th>
                        <th><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></th>
                        <th style="width:160px;"><?php esc_html_e( 'Actions', 'baba-online-academy' ); ?></th>
                    </tr>
                </thead>
                <tbody id="boa-live-sessions-tbody">
                    <tr><td colspan="6"><?php esc_html_e( 'Loading sessions…', 'baba-online-academy' ); ?></td></tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<div id="boa-session-modal" class="boa-modal">
    <div class="boa-modal-content boa-modal-large">
        <div class="boa-modal-header">
            <h3 id="boa-session-modal-title"><?php esc_html_e( 'Create Live Session', 'baba-online-academy' ); ?></h3>
            <button class="boa-close-btn" id="boa-session-modal-close">
                <span class="dashicons dashicons-no"></span>
            </button>
        </div>
        <div class="boa-modal-body">
            <form id="boa-session-form">
                <input type="hidden" id="boa-session-id">
                <div class="boa-form-row">
                    <div class="boa-form-group">
                        <label for="boa-session-title"><?php esc_html_e( 'Session Title *', 'baba-online-academy' ); ?></label>
                        <input type="text" id="boa-session-title" required>
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-session-course"><?php esc_html_e( 'Course', 'baba-online-academy' ); ?></label>
                        <select id="boa-session-course"></select>
                    </div>
                </div>
                <div class="boa-form-row">
                    <div class="boa-form-group">
                        <label for="boa-session-start"><?php esc_html_e( 'Start Time *', 'baba-online-academy' ); ?></label>
                        <input type="datetime-local" id="boa-session-start" required>
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-session-end"><?php esc_html_e( 'End Time', 'baba-online-academy' ); ?></label>
                        <input type="datetime-local" id="boa-session-end">
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-session-instructor"><?php esc_html_e( 'Instructor', 'baba-online-academy' ); ?></label>
                        <input type="text" id="boa-session-instructor" placeholder="<?php esc_attr_e( 'Optional', 'baba-online-academy' ); ?>">
                    </div>
                </div>
                <div class="boa-form-row">
                    <div class="boa-form-group">
                        <label for="boa-session-platform"><?php esc_html_e( 'Platform', 'baba-online-academy' ); ?></label>
                        <input type="text" id="boa-session-platform" placeholder="Zoom / Google Meet / Custom">
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-session-join"><?php esc_html_e( 'Join URL', 'baba-online-academy' ); ?></label>
                        <input type="url" id="boa-session-join" placeholder="https://">
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-session-host"><?php esc_html_e( 'Host URL', 'baba-online-academy' ); ?></label>
                        <input type="url" id="boa-session-host" placeholder="https://">
                    </div>
                </div>
                <div class="boa-form-row">
                    <div class="boa-form-group">
                        <label for="boa-session-status"><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></label>
                        <select id="boa-session-status">
                            <option value="scheduled"><?php esc_html_e( 'Scheduled', 'baba-online-academy' ); ?></option>
                            <option value="completed"><?php esc_html_e( 'Completed', 'baba-online-academy' ); ?></option>
                            <option value="cancelled"><?php esc_html_e( 'Cancelled', 'baba-online-academy' ); ?></option>
                        </select>
                    </div>
                    <div class="boa-form-group">
                        <label for="boa-session-duration"><?php esc_html_e( 'Duration (minutes)', 'baba-online-academy' ); ?></label>
                        <input type="number" id="boa-session-duration" min="15" step="5" placeholder="60">
                    </div>
                </div>
            </form>
        </div>
        <div class="boa-modal-footer">
            <button class="boa-btn boa-btn-secondary" id="boa-session-cancel"><?php esc_html_e( 'Cancel', 'baba-online-academy' ); ?></button>
            <button class="boa-btn boa-btn-primary" id="boa-session-save"><?php esc_html_e( 'Save Session', 'baba-online-academy' ); ?></button>
        </div>
    </div>
</div>

<div id="boa-attendance-modal" class="boa-modal">
    <div class="boa-modal-content">
        <div class="boa-modal-header">
            <h3><?php esc_html_e( 'Attendance Log', 'baba-online-academy' ); ?></h3>
            <button class="boa-close-btn" id="boa-attendance-close">
                <span class="dashicons dashicons-no"></span>
            </button>
        </div>
        <div class="boa-modal-body">
            <table class="boa-data-table" id="boa-attendance-table">
                <thead>
                    <tr>
                        <th><?php esc_html_e( 'Student', 'baba-online-academy' ); ?></th>
                        <th><?php esc_html_e( 'Join', 'baba-online-academy' ); ?></th>
                        <th><?php esc_html_e( 'Leave', 'baba-online-academy' ); ?></th>
                        <th><?php esc_html_e( 'Watch (min)', 'baba-online-academy' ); ?></th>
                        <th><?php esc_html_e( 'Device / IP', 'baba-online-academy' ); ?></th>
                    </tr>
                </thead>
                <tbody id="boa-attendance-tbody">
                    <tr><td colspan="5"><?php esc_html_e( 'Loading...', 'baba-online-academy' ); ?></td></tr>
                </tbody>
            </table>
        </div>
        <div class="boa-modal-footer">
            <button class="boa-btn boa-btn-secondary" id="boa-attendance-done"><?php esc_html_e( 'Close', 'baba-online-academy' ); ?></button>
        </div>
    </div>
</div>

