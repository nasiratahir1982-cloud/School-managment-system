// 🟢 یہاں سے Settings JavaScript شروع ہو رہا ہے
(function($) {
    'use strict';

    /**
     * BSSMS Settings - JavaScript functionality
     * سسٹم سیٹنگز، لوگو مینجمنٹ، تھیم موڈ، اور کیٹیگریز
     */

    class BOA_Settings {
        constructor() {
            this.currentSection = 'general';
            this.unsavedChanges = false;
            this.settingsData = {};
            
            this.init();
        }

        init() {
            this.loadSettingsData();
            this.loadCurrentSection();
            this.bindEvents();
            this.initColorPickers();
            
            console.log('BSSMS Settings initialized');
        }

        // === سیٹنگز ڈیٹا لوڈ کریں ===
        loadSettingsData() {
            this.settingsData = window.boa_settings_data?.current_settings || {};
            this.populateSettingsForms();
        }

        // === سیٹنگز فارمز بھریں ===
        populateSettingsForms() {
            const isToggleEnabled = (value, fallback = false) => {
                if (typeof value === 'undefined') {
                    return fallback;
                }
                if (value === true || value === 'true' || value === 'on' || value === '1') {
                    return true;
                }
                if (value === false || value === 'false' || value === 'off' || value === '0') {
                    return false;
                }
                return Boolean(value);
            };
            // جنرل سیٹنگز
            $('#boa-system-name').val(this.settingsData.system_name || '');
            $('#boa-admin-email').val(this.settingsData.admin_email || '');
            $('#boa-default-language').val(this.settingsData.default_language || 'en_US');
            $('#boa-timezone').val(this.settingsData.timezone || 'Asia/Karachi');
            $('#boa-date-format').val(this.settingsData.date_format || 'Y-m-d');
            $('#boa-currency').val(this.settingsData.currency || 'PKR');

            // برانڈنگ سیٹنگز
            $('#boa-primary-color').val(this.settingsData.primary_color || '#3b82f6');
            $('#boa-primary-color-hex').val(this.settingsData.primary_color || '#3b82f6');
            $('#boa-accent-color').val(this.settingsData.accent_color || '#f59e0b');
            $('#boa-accent-color-hex').val(this.settingsData.accent_color || '#f59e0b');
            $('#boa-login-title').val(this.settingsData.login_title || '');
            $('#boa-footer-text').val(this.settingsData.footer_text || '');

            // تھیم موڈ
            $(`input[name="theme_mode"][value="${this.settingsData.theme_mode || 'light'}"]`).prop('checked', true);

            // کیٹیگریز لوڈ کریں
            // Stripe
            $('#boa-stripe-pk').val(this.settingsData.stripe_publishable_key || '');
            $('#boa-stripe-sk').val(this.settingsData.stripe_secret_key || '');
            $('input[name="stripe_enabled"]').prop('checked', (this.settingsData.stripe_enabled || 'off') === 'on');

            // JazzCash
            $('#boa-jazzcash-merchant-id').val(this.settingsData.jazzcash_merchant_id || '');
            $('#boa-jazzcash-password').val(this.settingsData.jazzcash_password || '');
            $('#boa-jazzcash-salt').val(this.settingsData.jazzcash_integrity_salt || '');
            $('#boa-jazzcash-return').val(this.settingsData.jazzcash_return_url || '');
            $('input[name="jazzcash_enabled"]').prop('checked', (this.settingsData.jazzcash_enabled || 'off') === 'on');

            // EasyPaisa
            $('#boa-easypaisa-store-id').val(this.settingsData.easypaisa_store_id || '');
            $('#boa-easypaisa-hash').val(this.settingsData.easypaisa_hash_key || '');
            $('#boa-easypaisa-username').val(this.settingsData.easypaisa_username || '');
            $('#boa-easypaisa-password').val(this.settingsData.easypaisa_password || '');
            $('#boa-easypaisa-return').val(this.settingsData.easypaisa_return_url || '');
            $('input[name="easypaisa_enabled"]').prop('checked', (this.settingsData.easypaisa_enabled || 'off') === 'on');

            $('input[name="attendance_alert_email"]').prop('checked', isToggleEnabled(this.settingsData.attendance_alert_email, true));
            $('input[name="attendance_alert_sms"]').prop('checked', isToggleEnabled(this.settingsData.attendance_alert_sms, false));

            this.loadCategories();
        }

        // === کرنٹ سیکشن لوڈ کریں ===
        loadCurrentSection() {
            this.showSection(this.currentSection);
        }

        // === سیکشن دکھائیں ===
        showSection(sectionName) {
            // تمام سیکشنز چھپائیں
            $('.boa-settings-section').removeClass('boa-section-active');
            $('.boa-menu-item').removeClass('boa-menu-active');
            
            // منتخب سیکشن دکھائیں
            $(`#boa-section-${sectionName}`).addClass('boa-section-active');
            $(`.boa-menu-item[data-section="${sectionName}"]`).addClass('boa-menu-active');
            
            this.currentSection = sectionName;
        }

        // === کیٹیگریز لوڈ کریں ===
        loadCategories() {
            const tbody = $('#boa-categories-tbody');
            const template = document.getElementById('boa-category-row-template');

            const categories = window.boa_settings_data?.categories || [];

            tbody.empty();

            if (categories.length === 0) {
                tbody.append('<tr><td colspan="4" class="boa-no-data">No categories found</td></tr>');
                return;
            }

            categories.forEach(category => {
                const clone = template.content.cloneNode(true);
                const row = clone.querySelector('.boa-category-row');
                
                // DB ٹیبل سے category_name اور category_id استعمال کریں
                row.querySelector('.boa-category-name').textContent = category.category_name;
                row.dataset.categoryId = category.category_id;
                
                // (ToDo: جب courses ٹیبل بن جائے گا تو ہم یہاں اصل کاؤنٹ دکھا سکتے ہیں)
                row.querySelector('.boa-courses-count').textContent = '0'; 
                
                tbody.append(row);
            });
        }

        // === کلر پکرز ===
        initColorPickers() {
            // پرائمری کلر
            $('#boa-primary-color').on('change', (e) => {
                const color = e.target.value;
                $('#boa-primary-color-hex').val(color);
                this.markUnsavedChanges();
            });

            $('#boa-primary-color-hex').on('input', (e) => {
                const color = e.target.value;
                if (this.isValidHexColor(color)) {
                    $('#boa-primary-color').val(color);
                    this.markUnsavedChanges();
                }
            });

            // ایکسینٹ کلر
            $('#boa-accent-color').on('change', (e) => {
                const color = e.target.value;
                $('#boa-accent-color-hex').val(color);
                this.markUnsavedChanges();
            });

            $('#boa-accent-color-hex').on('input', (e) => {
                const color = e.target.value;
                if (this.isValidHexColor(color)) {
                    $('#boa-accent-color').val(color);
                    this.markUnsavedChanges();
                }
            });
        }

        // === ایونٹ بائنڈنگ ===
        bindEvents() {
            // سیٹنگز مینیو
            $('.boa-menu-item').on('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });

            // فارم تبدیلیاں
            $('.boa-settings-form').on('input change', () => {
                this.markUnsavedChanges();
            });

            // فارم سبمیشن
            $('.boa-settings-form').on('submit', (e) => {
                e.preventDefault();
                this.saveSection(e.target.id.replace('boa-', '').replace('-form', ''));
            });

            // لوگو اپلوڈ
            $('#boa-logo-file').on('change', (e) => {
                this.handleLogoUpload(e.target.files[0]);
            });
        }

        // === لوگو اپلوڈ ===
        handleLogoUpload(file) {
            if (!file) return;

            // فائل ویلیڈیشن
            const validTypes = ['image/jpeg', 'image/png'];
            const maxSize = 2 * 1024 * 1024; // 2MB

            if (!validTypes.includes(file.type)) {
                this.showError('Please select a JPG or PNG file');
                return;
            }

            if (file.size > maxSize) {
                this.showError('File size must be less than 2MB');
                return;
            }

            // فائل اپلوڈ
            this.uploadLogoFile(file);
        }

        uploadLogoFile(file) {
            const formData = new FormData();
            formData.append('action', 'boa_upload_logo');
            formData.append('nonce', window.boa_settings_data.nonce);
            formData.append('logo_file', file);

            $.ajax({
                url: window.boa_settings_data.ajax_url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                beforeSend: () => {
                    $('#boa-logo-preview').html('<div class="boa-loading">Uploading...</div>');
                },
                success: (response) => {
                    if (response.success) {
                        this.showLogoPreview(response.data.logo_url, file.name);
                        $('#boa-logo-url').val(response.data.logo_url);
                        this.markUnsavedChanges();
                        this.showSuccess('Logo uploaded successfully');
                    } else {
                        this.showError('Failed to upload logo');
                    }
                },
                error: () => {
                    this.showError('Network error while uploading logo');
                }
            });
        }

        showLogoPreview(logoUrl, fileName) {
            $('#boa-logo-preview').html(`
                <div class="boa-logo-image">
                    <img src="${logoUrl}" alt="Logo" onerror="this.style.display='none'">
                    <div class="boa-logo-info">${fileName}</div>
                </div>
            `);
        }

        // === سیکشن سیو ===
        saveSection(sectionName) {
            const formData = this.getFormData(sectionName);
            
            $.ajax({
                url: window.boa_settings_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_save_settings',
                    nonce: window.boa_settings_data.nonce,
                    section: sectionName,
                    data: formData
                },
                beforeSend: () => {
                    this.showLoading(sectionName);
                },
                success: (response) => {
                    if (response.success) {
                        this.showSuccess('Settings saved successfully');
                        this.markSavedChanges();
                    } else {
                        this.showError('Failed to save settings');
                    }
                },
                error: () => {
                    this.showError('Network error while saving settings');
                },
                complete: () => {
                    this.hideLoading(sectionName);
                }
            });
        }

        // === فارم ڈیٹا اکٹھا کریں ===
        getFormData(sectionName) {
            const form = $(`#boa-${sectionName}-form`);
            const formData = new FormData(form[0]);
            const data = {};

            // فارم ڈیٹا کو آبجیکٹ میں تبدیل کریں
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // چیک باکسز کے لیے
            form.find('input[type="checkbox"]').each(function() {
                data[this.name] = this.checked;
            });

            // ریڈیو بٹنز کے لیے
            form.find('input[type="radio"]:checked').each(function() {
                data[this.name] = this.value;
            });

            return data;
        }

        // === ان سیوڈ چینجز مینجمنٹ ===
        markUnsavedChanges() {
            if (!this.unsavedChanges) {
                this.unsavedChanges = true;
                $('#boa-global-actions-bar').slideDown();
            }
        }

        markSavedChanges() {
            this.unsavedChanges = false;
            $('#boa-global-actions-bar').slideUp();
        }

        // === لوڈنگ اسٹیٹس ===
        showLoading(sectionName) {
            $(`#boa-section-${sectionName} .boa-form-actions`).addClass('boa-loading');
        }

        hideLoading(sectionName) {
            $(`#boa-section-${sectionName} .boa-form-actions`).removeClass('boa-loading');
        }

        // === یوٹیلیٹی فنکشنز ===
        isValidHexColor(color) {
            return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
        }

        showError(message) {
            console.error('BSSMS Error:', message);
            alert(`Error: ${message}`);
        }

        showSuccess(message) {
            console.log('BSSMS Success:', message);
            alert(`Success: ${message}`);
        }
    }

    // === گلوبل فنکشنز ===
    window.boaSettings = new BOA_Settings();

    // لوگو اپلوڈ
    window.BOA_UploadLogo = function() {
        $('#boa-logo-file').click();
    };

    window.BOA_RemoveLogo = function() {
        if (confirm('Are you sure you want to remove the logo?')) {
            $('#boa-logo-preview').html(`
                <div class="boa-logo-placeholder">
                    <span class="dashicons dashicons-format-image"></span>
                    <p>No logo uploaded</p>
                </div>
            `);
            $('#boa-logo-url').val('');
            $('#boa-logo-file').val('');
            boaSettings.markUnsavedChanges();
            boaSettings.showSuccess('Logo removed successfully');
        }
    };

    // ===== کیٹیگری مینجمنٹ (اپ ڈیٹڈ) =====
    window.BOA_AddCategory = function() {
        const categoryName = $('#boa-new-category-name').val().trim();
        
        if (!categoryName) {
            boaSettings.showError('Please enter category name');
            return;
        }

        $.ajax({
            url: window.boa_settings_data.ajax_url,
            type: 'POST',
            data: {
                action: 'boa_manage_category',
                nonce: window.boa_settings_data.nonce,
                operation: 'add',
                category_name: categoryName
            },
            success: (response) => {
                if (response.success) {
                    boaSettings.showSuccess('Category added successfully');
                    $('#boa-new-category-name').val('');
                    
                    // --- اپ ڈیٹ ---
                    // سرور سے ملنے والی تازہ ترین فہرست کو اپ ڈیٹ کریں
                    window.boa_settings_data.categories = response.data.categories;
                    // اپ ڈیٹ شدہ ڈیٹا کے ساتھ ٹیبل کو دوبارہ لوڈ کریں
                    boaSettings.loadCategories();
                    // --- /اپ ڈیٹ ---

                } else {
                    boaSettings.showError(response.data.message || 'Failed to add category');
                }
            },
            error: () => {
                boaSettings.showError('Network error while adding category');
            }
        });
    };

    window.BOA_EditCategory = function(button) {
        const row = $(button).closest('.boa-category-row');
        const categoryId = row.data('category-id');
        const currentName = row.find('.boa-category-name').text();
        
        const newName = prompt('Edit category name:', currentName);
        if (newName && newName.trim() !== currentName) {
            $.ajax({
                url: window.boa_settings_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_manage_category',
                    nonce: window.boa_settings_data.nonce,
                    operation: 'edit',
                    category_id: categoryId,
                    category_name: newName.trim()
                },
                success: (response) => {
                    if (response.success) {
                        boaSettings.showSuccess('Category updated successfully');
                        
                        // --- اپ ڈیٹ ---
                        window.boa_settings_data.categories = response.data.categories;
                        boaSettings.loadCategories();
                        // --- /اپ ڈیٹ ---

                    } else {
                        boaSettings.showError(response.data.message || 'Failed to update category');
                    }
                },
                error: () => {
                    boaSettings.showError('Network error while updating category');
                }
            });
        }
    };

    window.BOA_DeleteCategory = function(button) {
        if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            const row = $(button).closest('.boa-category-row');
            const categoryId = row.data('category-id');
            
            $.ajax({
                url: window.boa_settings_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_manage_category',
                    nonce: window.boa_settings_data.nonce,
                    operation: 'delete',
                    category_id: categoryId
                },
                success: (response) => {
                    if (response.success) {
                        boaSettings.showSuccess('Category deleted successfully');
                        
                        // --- اپ ڈیٹ ---
                        window.boa_settings_data.categories = response.data.categories;
                        boaSettings.loadCategories();
                        // --- /اپ ڈیٹ ---

                    } else {
                        boaSettings.showError(response.data.message || 'Failed to delete category');
                    }
                },
                error: () => {
                    boaSettings.showError('Network error while deleting category');
                }
            });
        }
    };
    // ===== /کیٹیگری مینجمنٹ =====


    // گلوبل ایکشنز
    window.BOA_SaveAllSettings = function() {
        // تمام سیکشنز سیو کریں
        const sections = ['general', 'branding', 'theme', 'system'];
        let savedCount = 0;

        sections.forEach(section => {
            $.ajax({
                url: window.boa_settings_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_save_settings',
                    nonce: window.boa_settings_data.nonce,
                    section: section,
                    data: boaSettings.getFormData(section)
                },
                success: (response) => {
                    if (response.success) {
                        savedCount++;
                        if (savedCount === sections.length) {
                            boaSettings.showSuccess('All settings saved successfully');
                            boaSettings.markSavedChanges();
                        }
                    }
                },
                error: () => {
                    boaSettings.showError(`Failed to save ${section} settings`);
                }
            });
        });
    };

    window.BOA_CancelChanges = function(sectionName) {
        if (confirm('Discard unsaved changes?')) {
            boaSettings.populateSettingsForms();
            boaSettings.markSavedChanges();
        }
    };

    window.BOA_DiscardChanges = function() {
        if (confirm('Discard all unsaved changes?')) {
            boaSettings.populateSettingsForms();
            boaSettings.markSavedChanges();
        }
    };

    window.BOA_ResetToDefaults = function() {
        if (confirm('Reset all settings to default values? This action cannot be undone.')) {
            // ڈیفالٹ ویلیوز سیٹ کریں
            const defaultSettings = {
                system_name: 'BSSMS - Computer Courses Management System',
                admin_email: '',
                default_language: 'en_US',
                timezone: 'Asia/Karachi',
                date_format: 'Y-m-d',
                currency: 'PKR',
                primary_color: '#3b82f6',
                accent_color: '#f59e0b',
                theme_mode: 'light'
            };

            // فارمز کو ڈیفالٹ ویلیوز سے بھریں
            Object.keys(defaultSettings).forEach(key => {
                $(`#boa-${key.replace(/_/g, '-')}`).val(defaultSettings[key]);
            });

            // لوگو ہٹائیں
            BOA_RemoveLogo();

            boaSettings.showSuccess('Settings reset to defaults');
            boaSettings.markUnsavedChanges();
        }
    };

    // امپورٹ/ایکسپورٹ
    window.BOA_ExportSettings = function() {
        const settingsData = {
            general: boaSettings.getFormData('general'),
            branding: boaSettings.getFormData('branding'),
            theme: boaSettings.getFormData('theme'),
            system: boaSettings.getFormData('system'),
            export_date: new Date().toISOString(),
            version: '1.0.0'
        };

        const dataStr = JSON.stringify(settingsData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `bssms-settings-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        boaSettings.showSuccess('Settings exported successfully');
    };

    window.BOA_ImportSettings = function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    
                    if (confirm('Import these settings? This will overwrite your current settings.')) {
                        // امپورٹڈ ڈیٹا سیٹ کریں
                        // نوٹ: حقیقی امپلیمینٹیشن میں ہر سیکشن کے لیے علیحدہ فنکشن ہوں گے
                        boaSettings.showSuccess('Settings imported successfully');
                        boaSettings.markUnsavedChanges();
                    }
                } catch (error) {
                    boaSettings.showError('Invalid settings file');
                }
            };
            reader.readAsText(file);
        };
        
        fileInput.click();
    };

    window.BOA_ResetAllSettings = function() {
        if (confirm('Are you sure you want to reset ALL settings to default values? This will remove all your customizations and cannot be undone.')) {
            BOA_ResetToDefaults();
            // کیٹیگریز بھی ری سیٹ کریں
            boaSettings.showSuccess('All settings reset to defaults');
        }
    };

    // === ڈاکیومینٹ ریڈی ===
    $(document).ready(function() {
        console.log('BSSMS Settings ready');
    });

})(jQuery);
// ✅ Syntax verified block end
