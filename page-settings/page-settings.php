<?php
// 🟢 یہاں سے Settings PHP شروع ہو رہا ہے
if (!defined('ABSPATH')) exit;

/**
 * Settings پیج - BSSMS Computer Courses Management System
 * سسٹم سیٹنگز، لوگو مینجمنٹ، تھیم موڈ، اور کیٹیگریز
 *
 * نوٹ:
 * پہلے یہ سب کلاس BOA_Settings_Page کے اندر تھا اور render_settings_page()
 * method کے ذریعے چلتا تھا۔ اب اسے pure template بنا دیا گیا ہے تاکہ
 * baba-online-academy.php جب include کرے تو سیدھا HTML آؤٹ پُٹ ہو جائے۔
 */
?>

<style>
/* Inline facelift for Settings page */
#boa-settings-root {background:radial-gradient(circle at 16% 18%,#e0f2fe 0,#f8fafc 36%),radial-gradient(circle at 78% 0,#eef2ff 0,#ffffff 38%),#f8fafc;padding:var(--boa-space-8);border-radius:18px;box-shadow:0 12px 30px rgba(15,23,42,.08);min-height:100vh;}
.boa-settings-hero{display:flex;gap:var(--boa-space-6);align-items:stretch;background:linear-gradient(135deg,#3b82f6,#7c3aed);color:#fff;position:relative;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 12px 28px rgba(15,23,42,.12);overflow:hidden;margin-bottom:var(--boa-space-6);}
.boa-settings-hero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 70% 20%,rgba(255,255,255,.16),transparent 36%);pointer-events:none;}
.boa-hero-left,.boa-hero-right{position:relative;z-index:1;}
.boa-hero-left{flex:2;display:flex;flex-direction:column;gap:var(--boa-space-3);padding:var(--boa-space-5);}
.boa-hero-kicker{text-transform:uppercase;letter-spacing:.08em;font-size:.8rem;font-weight:800;margin:0;opacity:.92;}
.boa-hero-title{display:flex;align-items:center;gap:var(--boa-space-3);flex-wrap:wrap;}
.boa-hero-title h1{margin:0;font-size:2.5rem;font-weight:800;color:#fff;}
.boa-hero-chip{background:rgba(255,255,255,.16);padding:var(--boa-space-2) var(--boa-space-4);border-radius:999px;border:1px solid rgba(255,255,255,.26);font-weight:700;}
.boa-hero-lead{margin:0;font-size:1.05rem;color:rgba(255,255,255,.92);max-width:780px;}
.boa-hero-pills{display:flex;gap:var(--boa-space-3);flex-wrap:wrap;}
.boa-pill{display:inline-flex;align-items:center;gap:var(--boa-space-2);padding:var(--boa-space-2) var(--boa-space-4);border-radius:999px;font-weight:700;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(6px);}
.boa-hero-actions{display:flex;gap:var(--boa-space-3);flex-wrap:wrap;margin-top:var(--boa-space-2);}
.boa-hero-right{flex:1;display:flex;justify-content:flex-end;align-items:center;padding:var(--boa-space-5);}
.boa-hero-card{background:#fff;color:#0f172a;padding:var(--boa-space-5);border-radius:16px;box-shadow:0 16px 40px rgba(15,23,42,.2);display:flex;flex-direction:column;gap:var(--boa-space-3);min-width:280px;}
.boa-hero-note{display:flex;align-items:center;gap:var(--boa-space-2);font-weight:700;color:#3b82f6;margin:0;}
.boa-hero-tips{margin:0;padding-left:var(--boa-space-4);color:#475569;display:grid;gap:var(--boa-space-2);font-weight:600;}
.boa-settings-layout{margin-top:var(--boa-space-2);border-radius:16px;box-shadow:0 8px 22px rgba(15,23,42,.08);background:#fff;padding:var(--boa-space-5);}
.boa-settings-sidebar{border-right:1px solid #e2e8f0;padding-right:var(--boa-space-4);}
.boa-settings-menu .boa-menu-item{border-radius:12px;border:1px solid #e2e8f0;margin-bottom:var(--boa-space-2);padding:12px 14px;font-weight:700;color:#0f172a;display:flex;gap:10px;align-items:center;box-shadow:0 4px 10px rgba(15,23,42,.06);}
.boa-settings-menu .boa-menu-active{background:linear-gradient(135deg,#3b82f6,#7c3aed);color:#fff;border-color:transparent;box-shadow:0 10px 24px rgba(59,130,246,.24);}
.boa-settings-content{padding-left:var(--boa-space-4);}
.boa-section-header h2{margin:0;font-size:1.35rem;color:#0f172a;}
.boa-section-header p{margin:4px 0 0;color:#475569;}
.boa-settings-card{border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 6px 16px rgba(15,23,42,.08);padding:var(--boa-space-4);background:#fff;}
.boa-page-header{display:none;}
@media(max-width:960px){.boa-settings-hero{flex-direction:column;}.boa-hero-right{justify-content:flex-start;}.boa-settings-layout{padding:var(--boa-space-4);}}
</style>

<div id="boa-settings-root">
    <div class="boa-settings-hero">
        <div class="boa-hero-left">
            <p class="boa-hero-kicker"><?php esc_html_e( 'Control Center', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-title">
                <h1><?php esc_html_e( 'Settings', 'baba-online-academy' ); ?></h1>
                <span class="boa-hero-chip"><?php esc_html_e( 'Live configuration', 'baba-online-academy' ); ?></span>
            </div>
            <p class="boa-hero-lead"><?php esc_html_e( 'Fine-tune branding, preferences, and payment gateways with a modern, organized workspace.', 'baba-online-academy' ); ?></p>
            <div class="boa-hero-pills">
                <span class="boa-pill"><span class="dashicons dashicons-admin-generic"></span><?php esc_html_e( 'Core prefs', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-money-alt"></span><?php esc_html_e( 'Payments', 'baba-online-academy' ); ?></span>
                <span class="boa-pill"><span class="dashicons dashicons-format-image"></span><?php esc_html_e( 'Branding', 'baba-online-academy' ); ?></span>
            </div>
            <div class="boa-hero-actions">
                <button class="boa-btn boa-btn-primary" onclick="BOA_SaveAllSettings()">
                    <span class="dashicons dashicons-yes"></span>
                    <?php esc_html_e( 'Save All', 'baba-online-academy' ); ?>
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_ResetToDefaults()">
                    <span class="dashicons dashicons-update"></span>
                    <?php esc_html_e( 'Reset to Defaults', 'baba-online-academy' ); ?>
                </button>
            </div>
        </div>
        <div class="boa-hero-right">
            <div class="boa-hero-card">
                <p class="boa-hero-note"><span class="dashicons dashicons-shield-alt"></span><?php esc_html_e( 'Safe changes', 'baba-online-academy' ); ?></p>
                <ul class="boa-hero-tips">
                    <li><?php esc_html_e( 'Use Save All to commit every tab at once.', 'baba-online-academy' ); ?></li>
                    <li><?php esc_html_e( 'Reset reverts to defaults without touching data.', 'baba-online-academy' ); ?></li>
                    <li><?php esc_html_e( 'Sidebar tabs keep sections organized.', 'baba-online-academy' ); ?></li>
                </ul>
            </div>
        </div>
    </div>
    <!-- === پیج ہیڈر === -->
    <div class="boa-page-header">
        <div class="boa-header-left">
            <h1>Settings</h1>
            <p>Configure system preferences, branding, theme, and course categories</p>
        </div>
        <div class="boa-header-right">
            <div class="boa-toolbar-actions">
                <button class="boa-btn boa-btn-primary" onclick="BOA_SaveAllSettings()">
                    <span class="dashicons dashicons-yes"></span>
                    Save All
                </button>
                <button class="boa-btn boa-btn-secondary" onclick="BOA_ResetToDefaults()">
                    <span class="dashicons dashicons-update"></span>
                    Reset to Defaults
                </button>
            </div>
        </div>
    </div>

    <!-- === مین سیٹنگز لیآؤٹ === -->
    <div class="boa-settings-layout">
        <!-- بائیں کالم - سیٹنگز مینیو -->
        <div class="boa-settings-sidebar">
            <div class="boa-settings-menu">
                <button class="boa-menu-item boa-menu-active" data-section="general">
                    <span class="dashicons dashicons-admin-generic"></span>
                    General
                </button>
                <button class="boa-menu-item" data-section="branding">
                    <span class="dashicons dashicons-format-image"></span>
                    Logo & Branding
                </button>
                <button class="boa-menu-item" data-section="theme">
                    <span class="dashicons dashicons-admin-appearance"></span>
                    Theme Mode
                </button>
                <button class="boa-menu-item" data-section="categories">
                    <span class="dashicons dashicons-category"></span>
                    Course Categories
                </button>
                <button class="boa-menu-item" data-section="payment">
                    <span class="dashicons dashicons-money-alt"></span>
                    Payment Gateways
                </button>
                <button class="boa-menu-item" data-section="system">
                    <span class="dashicons dashicons-admin-tools"></span>
                    System Settings
                </button>
            </div>
        </div>

        <!-- دائیں کالم - سیٹنگز کونٹینٹ -->
        <div class="boa-settings-content">
            <!-- === جنرل سیٹنگز === -->
            <div id="boa-section-general" class="boa-settings-section boa-section-active">
                <div class="boa-section-header">
                    <h2>General Settings</h2>
                    <p>Basic system configuration and preferences</p>
                </div>
                
                <form class="boa-settings-form" id="boa-general-form">
                    <div class="boa-form-grid">
                        <div class="boa-form-group">
                            <label for="boa-system-name">System Name</label>
                            <input type="text" id="boa-system-name" name="system_name" class="boa-form-input" 
                                   placeholder="BSSMS - Computer Courses Management System">
                            <small>This name will appear in page titles and headers</small>
                        </div>
                        
                        <div class="boa-form-group">
                            <label for="boa-admin-email">Admin Email</label>
                            <input type="email" id="boa-admin-email" name="admin_email" class="boa-form-input" 
                                   placeholder="admin@example.com">
                            <small>System notifications will be sent to this email</small>
                        </div>
                        
                        <div class="boa-form-group">
                            <label for="boa-default-language">Default Language</label>
                            <select id="boa-default-language" name="default_language" class="boa-form-select">
                                <option value="en_US">English (US)</option>
                                <option value="en_GB">English (UK)</option>
                                <option value="ur">Urdu</option>
                                <option value="es_ES">Spanish</option>
                                <option value="fr_FR">French</option>
                            </select>
                        </div>
                        
                        <div class="boa-form-group">
                            <label for="boa-timezone">Timezone</label>
                            <select id="boa-timezone" name="timezone" class="boa-form-select">
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">New York</option>
                                <option value="Europe/London">London</option>
                                <option value="Asia/Karachi" selected>Karachi</option>
                                <option value="Asia/Dubai">Dubai</option>
                            </select>
                        </div>
                        
                        <div class="boa-form-group">
                            <label for="boa-date-format">Date Format</label>
                            <select id="boa-date-format" name="date_format" class="boa-form-select">
                                <option value="Y-m-d">YYYY-MM-DD (2024-01-15)</option>
                                <option value="m/d/Y">MM/DD/YYYY (01/15/2024)</option>
                                <option value="d/m/Y">DD/MM/YYYY (15/01/2024)</option>
                                <option value="F j, Y">F j, Y (January 15, 2024)</option>
                            </select>
                        </div>
                        
                        <div class="boa-form-group">
                            <label for="boa-currency">Currency</label>
                            <select id="boa-currency" name="currency" class="boa-form-select">
                                <option value="USD">US Dollar ($)</option>
                                <option value="EUR">Euro (€)</option>
                                <option value="GBP">British Pound (£)</option>
                                <option value="PKR" selected>Pakistani Rupee (Rs)</option>
                                <option value="AED">UAE Dirham (AED)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="boa-form-actions">
                        <button type="button" class="boa-btn boa-btn-secondary" onclick="BOA_CancelChanges('general')">Cancel</button>
                        <button type="submit" class="boa-btn boa-btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>

            <!-- === لوگو اینڈ برانڈنگ === -->
            <div id="boa-section-branding" class="boa-settings-section">
                <div class="boa-section-header">
                    <h2>Logo & Branding</h2>
                    <p>Customize your system's visual identity</p>
                </div>
                
                <form class="boa-settings-form" id="boa-branding-form">
                    <!-- لوگو اپلوڈ -->
                    <div class="boa-setting-group">
                        <h3>Logo</h3>
                        <div class="boa-logo-upload-area">
                            <div class="boa-logo-preview" id="boa-logo-preview">
                                <div class="boa-logo-placeholder">
                                    <span class="dashicons dashicons-format-image"></span>
                                    <p>No logo uploaded</p>
                                </div>
                            </div>
                            <div class="boa-logo-actions">
                                <button type="button" class="boa-btn boa-btn-primary" onclick="BOA_UploadLogo()">
                                    <span class="dashicons dashicons-upload"></span>
                                    Upload Logo
                                </button>
                                <button type="button" class="boa-btn boa-btn-outline" onclick="BOA_RemoveLogo()">
                                    <span class="dashicons dashicons-trash"></span>
                                    Remove Logo
                                </button>
                            </div>
                            <small>Recommended: 200x60px PNG or JPG, max 2MB</small>
                            <input type="file" id="boa-logo-file" accept=".jpg,.jpeg,.png" style="display: none;">
                            <input type="hidden" id="boa-logo-url" name="logo_url">
                        </div>
                    </div>

                    <!-- برانڈ کلرز -->
                    <div class="boa-setting-group">
                        <h3>Brand Colors</h3>
                        <div class="boa-color-pickers">
                            <div class="boa-color-picker">
                                <label for="boa-primary-color">Primary Color</label>
                                <div class="boa-color-input-group">
                                    <input type="color" id="boa-primary-color" name="primary_color" value="#3b82f6" class="boa-color-input">
                                    <input type="text" id="boa-primary-color-hex" value="#3b82f6" class="boa-color-hex-input">
                                </div>
                            </div>
                            <div class="boa-color-picker">
                                <label for="boa-accent-color">Accent Color</label>
                                <div class="boa-color-input-group">
                                    <input type="color" id="boa-accent-color" name="accent_color" value="#f59e0b" class="boa-color-input">
                                    <input type="text" id="boa-accent-color-hex" value="#f59e0b" class="boa-color-hex-input">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- اضافی برانڈنگ -->
                    <div class="boa-setting-group">
                        <h3>Additional Branding</h3>
                        <div class="boa-form-grid">
                            <div class="boa-form-group">
                                <label for="boa-login-title">Login Page Title</label>
                                <input type="text" id="boa-login-title" name="login_title" class="boa-form-input" 
                                       placeholder="BSSMS - Login">
                            </div>
                            <div class="boa-form-group">
                                <label for="boa-footer-text">Footer Text</label>
                                <input type="text" id="boa-footer-text" name="footer_text" class="boa-form-input" 
                                       placeholder="BSSMS - Computer Courses Management System">
                            </div>
                        </div>
                    </div>
                    
                    <div class="boa-form-actions">
                        <button type="button" class="boa-btn boa-btn-secondary" onclick="BOA_CancelChanges('branding')">Cancel</button>
                        <button type="submit" class="boa-btn boa-btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>

            <!-- === تھیم موڈ === -->
            <div id="boa-section-theme" class="boa-settings-section">
                <div class="boa-section-header">
                    <h2>Theme Mode</h2>
                    <p>Customize the visual appearance of your system</p>
                </div>
                
                <form class="boa-settings-form" id="boa-theme-form">
                    <!-- تھیم سیلیکشن -->
                    <div class="boa-setting-group">
                        <h3>Theme Mode</h3>
                        <div class="boa-theme-options">
                            <label class="boa-theme-option">
                                <input type="radio" name="theme_mode" value="light" checked class="boa-theme-radio">
                                <div class="boa-theme-card">
                                    <div class="boa-theme-preview boa-theme-light">
                                        <div class="boa-preview-header"></div>
                                        <div class="boa-preview-content"></div>
                                    </div>
                                    <span class="boa-theme-label">Light Mode</span>
                                </div>
                            </label>
                            
                            <label class="boa-theme-option">
                                <input type="radio" name="theme_mode" value="dark" class="boa-theme-radio">
                                <div class="boa-theme-card">
                                    <div class="boa-theme-preview boa-theme-dark">
                                        <div class="boa-preview-header"></div>
                                        <div class="boa-preview-content"></div>
                                    </div>
                                    <span class="boa-theme-label">Dark Mode</span>
                                </div>
                            </label>
                            
                            <label class="boa-theme-option">
                                <input type="radio" name="theme_mode" value="auto" class="boa-theme-radio">
                                <div class="boa-theme-card">
                                    <div class="boa-theme-preview boa-theme-auto">
                                        <div class="boa-preview-header"></div>
                                        <div class="boa-preview-content"></div>
                                    </div>
                                    <span class="boa-theme-label">Auto (System)</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- اضافی آپشنز -->
                    <div class="boa-setting-group">
                        <h3>Additional Options</h3>
                        <div class="boa-toggle-options">
                            <label class="boa-toggle-option">
                                <input type="checkbox" name="enable_gradient" class="boa-toggle-input">
                                <span class="boa-toggle-slider"></span>
                                <span class="boa-toggle-label">Enable Gradient Header</span>
                            </label>
                            
                            <label class="boa-toggle-option">
                                <input type="checkbox" name="compact_tables" class="boa-toggle-input">
                                <span class="boa-toggle-slider"></span>
                                <span class="boa-toggle-label">Use Compact Tables</span>
                            </label>
                            
                            <label class="boa-toggle-option">
                                <input type="checkbox" name="sidebar_collapse" class="boa-toggle-input">
                                <span class="boa-toggle-slider"></span>
                                <span class="boa-toggle-label">Collapsible Sidebar</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="boa-form-actions">
                        <button type="button" class="boa-btn boa-btn-secondary" onclick="BOA_CancelChanges('theme')">Cancel</button>
                        <button type="submit" class="boa-btn boa-btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>

            <!-- === کورس کیٹیگریز === -->
            <div id="boa-section-categories" class="boa-settings-section">
                <div class="boa-section-header">
                    <h2>Course Categories</h2>
                    <p>Manage course categories and organization</p>
                </div>
                
                <div class="boa-categories-management">
                    <!-- نیو کیٹیگری فارم -->
                    <div class="boa-add-category-form">
                        <h3>Add New Category</h3>
                        <div class="boa-input-group">
                            <input type="text" id="boa-new-category-name" placeholder="Enter category name" class="boa-form-input">
                            <button type="button" class="boa-btn boa-btn-primary" onclick="BOA_AddCategory()">
                                <span class="dashicons dashicons-plus"></span>
                                Add Category
                            </button>
                        </div>
                    </div>

                    <!-- کیٹیگریز ٹیبل -->
                    <div class="boa-categories-table">
                        <h3>Existing Categories</h3>
                        <div class="boa-card">
                            <table class="boa-data-table">
                                <thead>
                                    <tr>
                                        <th>Category Name</th>
                                        <th>Courses Count</th>
                                        <th>Status</th>
                                        <th width="120">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="boa-categories-tbody">
                                    <!-- JS سے بھرا جائے گا -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- ٹپس کارڈ -->
                    <div class="boa-tips-card">
                        <h4>Tips for Organizing Categories</h4>
                        <ul>
                            <li>Group similar courses together (e.g., Programming, Design, Business)</li>
                            <li>Use clear, descriptive names</li>
                            <li>Keep the number of categories manageable</li>
                            <li>Example categories: Web Development, Graphic Design, Digital Marketing, MS Office</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- === نیا: پیمنٹ گیٹ وے === -->
            <div id="boa-section-payment" class="boa-settings-section">
                <div class="boa-section-header">
                    <h2>Payment Gateways</h2>
                    <p>Configure online payment methods like Stripe.</p>
                </div>
                
                <form class="boa-settings-form" id="boa-payment-form">
                    <div class="boa-setting-group">
                        <h3>Stripe Configuration</h3>
                        <div class="boa-form-grid">
                            <div class="boa-form-group">
                                <label for="boa-stripe-pk">Stripe Publishable Key</label>
                                <input type="text" id="boa-stripe-pk" name="stripe_publishable_key" class="boa-form-input" placeholder="pk_test_...">
                            </div>
                            <div class="boa-form-group">
                                <label for="boa-stripe-sk">Stripe Secret Key</label>
                                <input type="password" id="boa-stripe-sk" name="stripe_secret_key" class="boa-form-input" placeholder="sk_test_...">
                            </div>
                        </div>
                        <div class="boa-toggle-options">
                            <label class="boa-toggle-option">
                                <input type="checkbox" name="stripe_enabled" class="boa-toggle-input">
                                <span class="boa-toggle-slider"></span>
                                <span class="boa-toggle-label">Enable Stripe Payments</span>
                            </label>
                        </div>
                    </div>

                    <div class="boa-setting-group">
                        <h3>JazzCash Configuration</h3>
                        <div class="boa-form-grid">
                            <div class="boa-form-group">
                                <label for="boa-jazzcash-merchant-id">Merchant ID</label>
                                <input type="text" id="boa-jazzcash-merchant-id" name="jazzcash_merchant_id" class="boa-form-input" placeholder="e.g., MC12345">
                            </div>
                            <div class="boa-form-group">
                                <label for="boa-jazzcash-password">API Password</label>
                                <input type="password" id="boa-jazzcash-password" name="jazzcash_password" class="boa-form-input" placeholder="Secure password">
                            </div>
                            <div class="boa-form-group">
                                <label for="boa-jazzcash-salt">Integrity Salt</label>
                                <input type="text" id="boa-jazzcash-salt" name="jazzcash_integrity_salt" class="boa-form-input" placeholder="Provided by JazzCash">
                            </div>
                            <div class="boa-form-group">
                                <label for="boa-jazzcash-return">Return URL</label>
                                <input type="text" id="boa-jazzcash-return" name="jazzcash_return_url" class="boa-form-input" placeholder="<?php echo esc_attr( add_query_arg( 'boa-payment-webhook', 'jazzcash', home_url( '/' ) ) ); ?>">
                                <small><?php esc_html_e( 'Configure this URL in your JazzCash merchant portal.', 'baba-online-academy' ); ?></small>
                            </div>
                        </div>
                        <div class="boa-toggle-options">
                            <label class="boa-toggle-option">
                                <input type="checkbox" name="jazzcash_enabled" class="boa-toggle-input">
                                <span class="boa-toggle-slider"></span>
                                <span class="boa-toggle-label"><?php esc_html_e( 'Enable JazzCash', 'baba-online-academy' ); ?></span>
                            </label>
                        </div>
                    </div>

                    <div class="boa-setting-group">
                        <h3>EasyPaisa Configuration</h3>
                        <div class="boa-form-grid">
                            <div class="boa-form-group">
                                <label for="boa-easypaisa-store-id">Store ID</label>
                                <input type="text" id="boa-easypaisa-store-id" name="easypaisa_store_id" class="boa-form-input" placeholder="EP12345">
                            </div>
                            <div class="boa-form-group">
                                <label for="boa-easypaisa-hash">Hash Key</label>
                                <input type="text" id="boa-easypaisa-hash" name="easypaisa_hash_key" class="boa-form-input" placeholder="Provided by EasyPaisa">
                            </div>
                            <div class="boa-form-group">
                                <label for="boa-easypaisa-username">API Username</label>
                                <input type="text" id="boa-easypaisa-username" name="easypaisa_username" class="boa-form-input" placeholder="Merchant username">
                            </div>
                            <div class="boa-form-group">
                                <label for="boa-easypaisa-password">API Password</label>
                                <input type="password" id="boa-easypaisa-password" name="easypaisa_password" class="boa-form-input" placeholder="Merchant password">
                            </div>
                            <div class="boa-form-group">
                                <label for="boa-easypaisa-return">Return URL</label>
                                <input type="text" id="boa-easypaisa-return" name="easypaisa_return_url" class="boa-form-input" placeholder="<?php echo esc_attr( add_query_arg( 'boa-payment-webhook', 'easypaisa', home_url( '/' ) ) ); ?>">
                                <small><?php esc_html_e( 'Provide this URL when configuring EasyPaisa callbacks.', 'baba-online-academy' ); ?></small>
                            </div>
                        </div>
                        <div class="boa-toggle-options">
                            <label class="boa-toggle-option">
                                <input type="checkbox" name="easypaisa_enabled" class="boa-toggle-input">
                                <span class="boa-toggle-slider"></span>
                                <span class="boa-toggle-label"><?php esc_html_e( 'Enable EasyPaisa', 'baba-online-academy' ); ?></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="boa-form-actions">
                        <button type="button" class="boa-btn boa-btn-secondary" onclick="BOA_CancelChanges('payment')">Cancel</button>
                        <button type="submit" class="boa-btn boa-btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>

            <!-- === سسٹم سیٹنگز === -->
            <div id="boa-section-system" class="boa-settings-section">
                <div class="boa-section-header">
                    <h2>System Settings</h2>
                    <p>Advanced system configuration and preferences</p>
                </div>
                
                <form class="boa-settings-form" id="boa-system-form">
                    <!-- ایڈمیشنز اینڈ فیسز -->
                    <div class="boa-setting-group">
                        <h3>Admissions & Fees</h3>
                        <div class="boa-form-grid">
                            <div class="boa-form-group">
                                <label for="boa-default-admission-status">Default Admission Status</label>
                                <select id="boa-default-admission-status" name="default_admission_status" class="boa-form-select">
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                            
                            <div class="boa-form-group">
                                <label for="boa-fee-due-days">Default Fee Due Days</label>
                                <input type="number" id="boa-fee-due-days" name="fee_due_days" class="boa-form-input" 
                                       value="30" min="1" max="365">
                                <small>Days after admission when fees are due</small>
                            </div>
                            
                            <div class="boa-form-group">
                                <label for="boa-reminder-days">Reminder Days Before Due Date</label>
                                <input type="number" id="boa-reminder-days" name="reminder_days" class="boa-form-input" 
                                       value="7" min="1" max="30">
                                <small>Send reminders this many days before due date</small>
                            </div>
                        </div>
                        
                        <div class="boa-toggle-options">
                            <label class="boa-toggle-option">
                                <input type="checkbox" name="send_reminder_emails" class="boa-toggle-input" checked>
                                <span class="boa-toggle-slider"></span>
                                <span class="boa-toggle-label">Send Fee Reminder Emails</span>
                            </label>
                        </div>
                    </div>

                    <div class="boa-setting-group">
                        <h3><?php esc_html_e( 'Attendance Alerts', 'baba-online-academy' ); ?></h3>
                        <p class="boa-muted"><?php esc_html_e( 'Automatically notify students when they are marked absent or late.', 'baba-online-academy' ); ?></p>
                        <div class="boa-toggle-options">
                            <label class="boa-toggle-option">
                                <input type="checkbox" name="attendance_alert_email" class="boa-toggle-input" checked>
                                <span class="boa-toggle-slider"></span>
                                <span class="boa-toggle-label"><?php esc_html_e( 'Send attendance emails', 'baba-online-academy' ); ?></span>
                            </label>
                            <label class="boa-toggle-option">
                                <input type="checkbox" name="attendance_alert_sms" class="boa-toggle-input">
                                <span class="boa-toggle-slider"></span>
                                <span class="boa-toggle-label"><?php esc_html_e( 'Send attendance SMS alerts', 'baba-online-academy' ); ?></span>
                            </label>
                        </div>
                    </div>

                    <!-- ڈیٹا اینڈ ایکسپورٹ -->
                    <div class="boa-setting-group">
                        <h3>Data & Export</h3>
                        <div class="boa-form-group">
                            <label for="boa-export-format">Default Export Format</label>
                            <select id="boa-export-format" name="export_format" class="boa-form-select">
                                <option value="excel">Excel (.xlsx)</option>
                                <option value="csv">CSV (.csv)</option>
                                <option value="pdf">PDF (.pdf)</option>
                            </select>
                        </div>
                        
                        <div class="boa-toggle-options">
                            <label class="boa-toggle-option">
                                <input type="checkbox" name="enable_demo_data" class="boa-toggle-input" checked>
                                <span class="boa-toggle-slider"></span>
                                <span class="boa-toggle-label">Enable Demo Data Button</span>
                            </label>
                            
                            <label class="boa-toggle-option">
                                <input type="checkbox" name="include_headers" class="boa-toggle-input" checked>
                                <span class="boa-toggle-slider"></span>
                                <span class="boa-toggle-label">Include Headers in Export</span>
                            </label>
                        </div>
                        <small>Export files are named: report_type_YYYY-MM-DD.format</small>
                    </div>

                    <!-- سیکورٹی -->
                    <div class="boa-setting-group">
                        <h3>Security</h3>
                        <div class="boa-form-group">
                            <label for="boa-session-timeout">Session Timeout (minutes)</label>
                            <input type="number" id="boa-session-timeout" name="session_timeout" class="boa-form-input" 
                                   value="120" min="15" max="1440">
                            <small>Automatically log out after inactivity</small>
                        </div>
                        
                        <div class="boa-toggle-options">
                            <label class="boa-toggle-option">
                                <input type="checkbox" name="student_self_service" class="boa-toggle-input">
                                <span class="boa-toggle-slider"></span>
                                <span class="boa-toggle-label">Allow Student Self-Service Login</span>
                            </label>
                            
                            <label class="boa-toggle-option">
                                <input type="checkbox" name="force_strong_passwords" class="boa-toggle-input" checked>
                                <span class="boa-toggle-slider"></span>
                                <span class="boa-toggle-label">Force Strong Passwords</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="boa-form-actions">
                        <button type="button" class="boa-btn boa-btn-secondary" onclick="BOA_CancelChanges('system')">Cancel</button>
                        <button type="submit" class="boa-btn boa-btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- === امپورٹ/ایکسپورٹ سیٹنگز === -->
    <div class="boa-import-export-card">
        <div class="boa-card">
            <div class="boa-card-header">
                <h3>Import & Export Settings</h3>
            </div>
            <div class="boa-card-content">
                <div class="boa-import-export-actions">
                    <button class="boa-btn boa-btn-primary" onclick="BOA_ExportSettings()">
                        <span class="dashicons dashicons-download"></span>
                        Export Settings
                    </button>
                    <button class="boa-btn boa-btn-secondary" onclick="BOA_ImportSettings()">
                        <span class="dashicons dashicons-upload"></span>
                        Import Settings
                    </button>
                    <button class="boa-btn boa-btn-outline" onclick="BOA_ResetAllSettings()">
                        <span class="dashicons dashicons-update"></span>
                        Reset All Settings
                    </button>
                </div>
                <div class="boa-warning-note">
                    <span class="dashicons dashicons-warning"></span>
                    <strong>Warning:</strong> Resetting will restore all settings to their default values. This action cannot be undone.
                </div>
            </div>
        </div>
    </div>

    <!-- === گلوبل ایکشن بار === -->
    <div class="boa-global-actions-bar" id="boa-global-actions-bar" style="display: none;">
        <div class="boa-actions-content">
            <span class="boa-actions-message">
                <span class="dashicons dashicons-info"></span>
                You have unsaved changes.
            </span>
            <div class="boa-actions-buttons">
                <button class="boa-btn boa-btn-secondary" onclick="BOA_DiscardChanges()">Discard</button>
                <button class="boa-btn boa-btn-primary" onclick="BOA_SaveAllSettings()">Save All</button>
            </div>
        </div>
    </div>

    <!-- === فوٹر === -->
    <div class="boa-footer">
        <p>BSSMS – Computer Courses Management System</p>
    </div>
</div>

<!-- === ٹیمپلیٹس === -->
<template id="boa-category-row-template">
    <tr class="boa-category-row">
        <td class="boa-category-name"></td>
        <td class="boa-courses-count">0</td>
        <td>
            <span class="boa-status-badge boa-status-active">Active</span>
        </td>
        <td>
            <div class="boa-action-buttons">
                <button class="boa-btn-icon boa-btn-edit" onclick="BOA_EditCategory(this)" title="Edit">
                    <span class="dashicons dashicons-edit"></span>
                </button>
                <button class="boa-btn-icon boa-btn-delete" onclick="BOA_DeleteCategory(this)" title="Delete">
                    <span class="dashicons dashicons-trash"></span>
                </button>
            </div>
        </td>
    </tr>
</template>
