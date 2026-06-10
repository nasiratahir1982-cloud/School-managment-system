<?php
/**
 * Admin Page: Notice Board Management
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$audiences = array(
    'all'        => __( 'All Users', 'baba-online-academy' ),
    'student'    => __( 'Students', 'baba-online-academy' ),
    'instructor' => __( 'Instructors', 'baba-online-academy' ),
);

$priorities = array(
    'normal'   => __( 'Normal', 'baba-online-academy' ),
    'high'     => __( 'High', 'baba-online-academy' ),
    'critical' => __( 'Critical', 'baba-online-academy' ),
);
?>

<style>
/* Inline styles for Notice Board to ensure the redesign always loads */
#boa-notices-root {background:radial-gradient(circle at 16% 18%,#e0f2fe 0,#f8fafc 36%),radial-gradient(circle at 78% 0,#eef2ff 0,#ffffff 38%),#f8fafc;padding:var(--boa-space-8);border-radius:18px;box-shadow:0 12px 30px rgba(15,23,42,.08);min-height:100vh;}
.boa-notice-page .boa-card{border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 10px 28px rgba(15,23,42,.08);overflow:hidden;}
.boa-notice-hero{display:flex;gap:var(--boa-space-6);align-items:stretch;background:linear-gradient(135deg,#6366f1,#0ea5e9);color:#fff;position:relative;overflow:hidden;}
.boa-notice-hero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 70% 20%,rgba(255,255,255,.18),transparent 36%);pointer-events:none;}
.boa-hero-left,.boa-hero-right{position:relative;z-index:1;}
.boa-hero-left{flex:2;display:flex;flex-direction:column;gap:var(--boa-space-3);}
.boa-hero-kicker{text-transform:uppercase;letter-spacing:.08em;font-size:.8rem;font-weight:800;margin:0;opacity:.9;}
.boa-hero-title{display:flex;align-items:center;gap:var(--boa-space-3);flex-wrap:wrap;}
.boa-hero-title h1{margin:0;font-size:2.6rem;font-weight:800;color:#fff;}
.boa-hero-chip{background:rgba(255,255,255,.16);padding:var(--boa-space-2) var(--boa-space-4);border-radius:999px;border:1px solid rgba(255,255,255,.24);font-weight:700;}
.boa-hero-lead{margin:0;font-size:1.05rem;color:rgba(255,255,255,.92);max-width:760px;}
.boa-hero-pills{display:flex;gap:var(--boa-space-3);flex-wrap:wrap;}
.boa-pill{display:inline-flex;align-items:center;gap:var(--boa-space-2);padding:var(--boa-space-2) var(--boa-space-4);border-radius:999px;font-weight:700;backdrop-filter:blur(6px);background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);}
.boa-hero-actions{display:flex;gap:var(--boa-space-3);flex-wrap:wrap;margin-top:var(--boa-space-2);}
.boa-hero-right{flex:1;display:flex;justify-content:flex-end;align-items:center;}
.boa-hero-card{background:#ffffff;color:#0f172a;padding:var(--boa-space-5);border-radius:18px;box-shadow:0 16px 40px rgba(15,23,42,.22);display:flex;flex-direction:column;gap:var(--boa-space-3);min-width:260px;}
.boa-hero-note{display:flex;align-items:center;gap:var(--boa-space-2);font-weight:700;color:#0ea5e9;margin:0;}
.boa-hero-tips{margin:0;padding-left:var(--boa-space-4);color:#475569;display:grid;gap:var(--boa-space-2);font-weight:600;}
.boa-main-layout{display:grid;grid-template-columns:1fr;gap:var(--boa-space-6);margin-top:var(--boa-space-6);}
.boa-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:var(--boa-space-5);}
.boa-card-header{display:flex;justify-content:space-between;align-items:center;padding:var(--boa-space-4) var(--boa-space-5) var(--boa-space-3);border-bottom:1px solid #e2e8f0;gap:var(--boa-space-3);flex-wrap:wrap;}
.boa-card-kicker{text-transform:uppercase;letter-spacing:.08em;font-size:.75rem;color:var(--boa-primary);margin:0 0 4px 0;font-weight:800;}
.boa-card-header h3{margin:0;font-size:1.2rem;color:#0f172a;}
.boa-card-content{padding:var(--boa-space-4) var(--boa-space-5) var(--boa-space-5);display:flex;flex-direction:column;gap:var(--boa-space-4);}
.boa-soft-pill{display:inline-flex;align-items:center;gap:var(--boa-space-2);background:#f1f5f9;padding:var(--boa-space-2) var(--boa-space-4);border-radius:999px;font-weight:600;color:#0f172a;}
.boa-form-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--boa-space-4);align-items:end;}
.boa-form-group{display:flex;flex-direction:column;gap:var(--boa-space-2);}
.boa-form-group-full{grid-column:1/-1;}
.boa-form-group label{font-weight:700;color:#0f172a;display:block;margin:0;}
.boa-form-group input,.boa-form-group select,.boa-form-group textarea{width:100%;padding:12px 14px;border-radius:12px;border:1px solid #cbd5e1;background:#fff;transition:border-color .2s ease,box-shadow .2s ease;font-size:.95rem;}
.boa-form-group textarea{min-height:120px;resize:vertical;}
.boa-form-group input:focus,.boa-form-group select:focus,.boa-form-group textarea:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.15);outline:none;}
.boa-form-actions{display:flex;gap:var(--boa-space-3);flex-wrap:wrap;}
.boa-toolbar-actions-stack{display:flex;gap:var(--boa-space-3);flex-wrap:wrap;}
.boa-input-shell{display:inline-flex;align-items:center;gap:var(--boa-space-2);background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;}
.boa-input-shell input,.boa-input-shell select{border:none;background:transparent;outline:none;font-size:.95rem;min-width:160px;}
.boa-input-shell .dashicons{color:var(--boa-primary);}
.boa-table-wrapper{overflow-x:auto;}
.boa-data-table{width:100%;border-collapse:collapse;font-size:.9rem;}
.boa-data-table th,.boa-data-table td{padding:12px 14px;text-align:left;border-bottom:1px solid #e2e8f0;white-space:nowrap;}
.boa-data-table th{background:#f8fafc;color:#475569;text-transform:uppercase;letter-spacing:.02em;font-size:.8rem;}
.boa-data-table tr:hover td{background:#f1f5f9;}
.boa-table-actions{display:inline-flex;gap:var(--boa-space-2);}
.boa-btn-icon{border:none;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:8px 10px;cursor:pointer;transition:all .15s ease-in-out;}
.boa-btn-icon:hover{border-color:#2563eb;color:#2563eb;box-shadow:0 8px 18px rgba(37,99,235,.2);}
.boa-btn-delete:hover{border-color:#ef4444;color:#ef4444;box-shadow:0 8px 18px rgba(239,68,68,.2);}
@media (max-width:960px){.boa-notice-hero{flex-direction:column;}.boa-hero-right{justify-content:flex-start;}}
@media (max-width:720px){.boa-data-table thead{display:none;}.boa-data-table tr{display:block;margin-bottom:12px;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;}.boa-data-table td{display:flex;justify-content:space-between;padding:10px 12px;}.boa-data-table td:before{content:attr(data-label);font-weight:700;color:#475569;margin-right:10px;}}
</style>

<div id="boa-notices-root" class="boa-admin-wrap boa-notice-page">
    <div class="boa-notice-hero boa-card">
        <div class="boa-hero-left">
            <p class="boa-hero-kicker"><?php esc_html_e( 'Communications Hub', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-title">
                <h1><?php esc_html_e( 'Notice Board', 'baba-online-academy' ); ?></h1>
                <span class="boa-hero-chip"><?php esc_html_e( 'Instant updates', 'baba-online-academy' ); ?></span>
            </div>
            <p class="boa-hero-lead"><?php esc_html_e( 'Publish announcements that appear on student dashboards and instructor panels with clear status badges and scheduling.', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-pills">
                <span class="boa-pill"><span class="dashicons dashicons-megaphone"></span><?php esc_html_e( 'Academy wide', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-groups"></span><?php esc_html_e( 'Students & instructors', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-visibility"></span><?php esc_html_e( 'Status-aware', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-hero-actions">
                <a class="boa-btn boa-btn-primary" href="#boa-notice-form">
                    <span class="dashicons dashicons-plus-alt2"></span>
                    <?php esc_html_e( 'Create notice', 'baba-online-academy' ); ?>
                </a>
                <button id="boa-notice-reset" class="boa-btn boa-btn-secondary">
                    <span class="dashicons dashicons-image-rotate"></span>
                    <?php esc_html_e( 'Reset form', 'baba-online-academy' ); ?>
                </button>
                <button id="boa-notice-refresh" class="boa-btn boa-btn-secondary">
                    <span class="dashicons dashicons-update"></span>
                    <?php esc_html_e( 'Refresh list', 'baba-online-academy' ); ?>
                </button>
            </div>
        </div>
        <div class="boa-hero-right">
            <div class="boa-hero-card">
                <div class="boa-hero-note">
                    <span class="dashicons dashicons-shield-alt"></span>
                    <?php esc_html_e( 'Scheduled and active notices stay audit-ready.', 'baba-online-academy' ); ?>
                </div>
                <ul class="boa-hero-tips">
                    <li><?php esc_html_e( 'Use priorities to highlight critical alerts.', 'baba-online-academy' ); ?></li>
                    <li><?php esc_html_e( 'Set start/end dates for timed visibility.', 'baba-online-academy' ); ?></li>
                    <li><?php esc_html_e( 'Refresh to pull the latest board state.', 'baba-online-academy' ); ?></li>
                </ul>
            </div>
        </div>
    </div>

    <div class="boa-main-layout">
        <div class="boa-main-content">
            <div class="boa-grid">
                <div class="boa-card">
                    <div class="boa-card-header">
                        <div>
                            <p class="boa-card-kicker"><?php esc_html_e( 'Compose', 'baba-online-academy' ); ?></p>
                            <h3><?php esc_html_e( 'Create / Update Notice', 'baba-online-academy' ); ?></h3>
                        </div>
                        <span class="boa-soft-pill"><span class="dashicons dashicons-edit-large"></span><?php esc_html_e( 'Draft', 'baba-online-academy' ); ?></span>
                    </div>
                    <div class="boa-card-content">
                        <form id="boa-notice-form">
                            <input type="hidden" id="boa-notice-id" value="0">
                            <div class="boa-form-row">
                                <div class="boa-form-group">
                                    <label for="boa-notice-title"><?php esc_html_e( 'Title', 'baba-online-academy' ); ?> *</label>
                                    <input type="text" id="boa-notice-title" required>
                                </div>
                                <div class="boa-form-group">
                                    <label for="boa-notice-audience"><?php esc_html_e( 'Audience', 'baba-online-academy' ); ?></label>
                                    <select id="boa-notice-audience">
                                        <?php foreach ( $audiences as $key => $label ) : ?>
                                            <option value="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $label ); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                <div class="boa-form-group">
                                    <label for="boa-notice-priority"><?php esc_html_e( 'Priority', 'baba-online-academy' ); ?></label>
                                    <select id="boa-notice-priority">
                                        <?php foreach ( $priorities as $key => $label ) : ?>
                                            <option value="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $label ); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </div>

                            <div class="boa-form-row">
                                <div class="boa-form-group">
                                    <label for="boa-notice-start"><?php esc_html_e( 'Start Date', 'baba-online-academy' ); ?></label>
                                    <input type="date" id="boa-notice-start">
                                </div>
                                <div class="boa-form-group">
                                    <label for="boa-notice-end"><?php esc_html_e( 'End Date', 'baba-online-academy' ); ?></label>
                                    <input type="date" id="boa-notice-end">
                                </div>
                                <div class="boa-form-group">
                                    <label for="boa-notice-active"><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></label>
                                    <select id="boa-notice-active">
                                        <option value="1"><?php esc_html_e( 'Active', 'baba-online-academy' ); ?></option>
                                        <option value="0"><?php esc_html_e( 'Inactive', 'baba-online-academy' ); ?></option>
                                    </select>
                                </div>
                            </div>

                            <div class="boa-form-row">
                                <div class="boa-form-group boa-form-group-full">
                                    <label for="boa-notice-message"><?php esc_html_e( 'Message', 'baba-online-academy' ); ?> *</label>
                                    <textarea id="boa-notice-message" rows="5" required placeholder="<?php esc_attr_e( 'Write the announcement that students will see on their dashboards.', 'baba-online-academy' ); ?>"></textarea>
                                </div>
                            </div>

                            <div class="boa-form-row boa-form-actions">
                                <button type="submit" class="boa-btn boa-btn-primary">
                                    <span class="dashicons dashicons-yes"></span>
                                    <?php esc_html_e( 'Save Notice', 'baba-online-academy' ); ?>
                                </button>
                                <button type="button" id="boa-notice-reset-inline" class="boa-btn boa-btn-secondary">
                                    <span class="dashicons dashicons-image-rotate"></span>
                                    <?php esc_html_e( 'Reset', 'baba-online-academy' ); ?>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="boa-card">
                    <div class="boa-card-header">
                        <div>
                            <p class="boa-card-kicker"><?php esc_html_e( 'Board', 'baba-online-academy' ); ?></p>
                            <h3><?php esc_html_e( 'Published Notices', 'baba-online-academy' ); ?></h3>
                        </div>
                        <div class="boa-toolbar-actions boa-toolbar-actions-stack">
                            <div class="boa-input-shell">
                                <span class="dashicons dashicons-filter"></span>
                                <select id="boa-notice-filter">
                                    <option value=""><?php esc_html_e( 'All', 'baba-online-academy' ); ?></option>
                                    <option value="active"><?php esc_html_e( 'Active', 'baba-online-academy' ); ?></option>
                                    <option value="scheduled"><?php esc_html_e( 'Scheduled', 'baba-online-academy' ); ?></option>
                                    <option value="expired"><?php esc_html_e( 'Expired', 'baba-online-academy' ); ?></option>
                                    <option value="inactive"><?php esc_html_e( 'Inactive', 'baba-online-academy' ); ?></option>
                                </select>
                            </div>
                            <div class="boa-input-shell">
                                <span class="dashicons dashicons-search"></span>
                                <input type="text" id="boa-notice-search" class="boa-form-input" placeholder="<?php esc_attr_e( 'Search notices...', 'baba-online-academy' ); ?>">
                            </div>
                        </div>
                    </div>
                    <div class="boa-card-content">
                        <div class="boa-table-wrapper">
                            <table class="boa-data-table boa-notice-table">
                                <thead>
                                    <tr>
                                        <th><?php esc_html_e( 'Title', 'baba-online-academy' ); ?></th>
                                        <th><?php esc_html_e( 'Audience', 'baba-online-academy' ); ?></th>
                                        <th><?php esc_html_e( 'Priority', 'baba-online-academy' ); ?></th>
                                        <th><?php esc_html_e( 'Schedule', 'baba-online-academy' ); ?></th>
                                        <th><?php esc_html_e( 'Status', 'baba-online-academy' ); ?></th>
                                        <th><?php esc_html_e( 'Actions', 'baba-online-academy' ); ?></th>
                                    </tr>
                                </thead>
                                <tbody id="boa-notice-table">
                                    <tr>
                                        <td colspan="6"><?php esc_html_e( 'Loading notices...', 'baba-online-academy' ); ?></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
