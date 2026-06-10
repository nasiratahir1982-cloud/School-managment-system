// 🟢 Clean Import-Focused Reports JavaScript
(function($) {
    'use strict';

    /**
     * Clean Reports JavaScript - Import Functionality Only
     * Minimal syntax to avoid all potential errors
     */
    
    // Ensure required data exists
    if (typeof window.boa_reports_data === 'undefined') {
        console.warn('boa_reports_data is not defined');
        window.boa_reports_data = {
            ajax_url: (typeof ajaxurl !== 'undefined') ? ajaxurl : '',
            nonce: ''
        };
    }

    // Global Reports Class - Import Focus
    window.BOA_Reports = class BOA_Reports {
        constructor() {
            this.currency = window.boa_reports_data?.currency || 'PKR';
            this.init();
        }

        init() {
            console.log('Clean BOA Reports initialized');
            this.bindImportEvents();
        }

        // Import-specific functionality
        bindImportEvents() {
            // Import button event binding with multiple fallbacks
            $(document).on('click', '#boa-import-button', function(e) {
                console.log('Import button clicked - Clean version');
                e.preventDefault();
                e.stopPropagation();
                window.BOA_OpenImportModal();
            });
        }

        // Error handling
        showError(message) {
            console.error('BOA Error:', message);
            alert('Error: ' + message);
        }

        showSuccess(message) {
            console.log('BOA Success:', message);
            alert('Success: ' + message);
        }
    };

    // Import Modal Functions (Global Scope)
    window.BOA_OpenImportModal = function() {
        console.log('Opening import modal...');
        
        // Remove existing modal
        $('#boa-import-modal').remove();
        
        var modalHtml = '<div id="boa-import-modal" class="boa-modal boa-modal-open" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999;">';
        modalHtml += '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; max-width: 500px; width: 90%;">';
        modalHtml += '<h3>Import Plugin Data</h3>';
        modalHtml += '<button class="boa-close-btn" onclick="BOA_CloseImportModal()" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px;">&times;</button>';
        modalHtml += '<form id="boa-import-form" onsubmit="return BOA_SubmitImport(event)" style="margin-top: 20px;">';
        modalHtml += '<label for="boa-import-file">Select Backup File (.json)</label>';
        modalHtml += '<input type="file" id="boa-import-file" name="import_file" accept=".json" required style="width: 100%; margin: 10px 0; padding: 8px;">';
        modalHtml += '<div style="margin: 15px 0;">';
        modalHtml += '<input type="checkbox" id="boa-import-confirm" required>';
        modalHtml += '<label for="boa-import-confirm">I confirm that I want to import this data. This action cannot be undone.</label>';
        modalHtml += '</div>';
        modalHtml += '<div id="boa-import-progress" style="display: none; margin-top: 15px; padding: 15px; background: #f9f9f9; border-radius: 4px;">';
        modalHtml += '<div class="boa-progress-bar" style="width: 100%; height: 20px; background: #f1f1f1; border-radius: 10px; overflow: hidden;">';
        modalHtml += '<div class="boa-progress-fill" style="height: 100%; background: #0073aa; width: 0%; transition: width 0.3s ease;"></div>';
        modalHtml += '</div>';
        modalHtml += '<div id="boa-progress-text" style="text-align: center; margin-top: 10px;">Importing...</div>';
        modalHtml += '</div>';
        modalHtml += '<div style="margin-top: 20px; text-align: right;">';
        modalHtml += '<button type="button" class="boa-btn boa-btn-secondary" onclick="BOA_CloseImportModal()" style="padding: 10px 20px; margin-right: 10px;">Cancel</button>';
        modalHtml += '<button type="submit" form="boa-import-form" class="boa-btn boa-btn-primary" style="padding: 10px 20px; background: #0073aa; color: white; border: none;">Import Data</button>';
        modalHtml += '</div>';
        modalHtml += '</form>';
        modalHtml += '</div>';
        modalHtml += '</div>';
        
        $('body').append(modalHtml);
        console.log('Import modal created successfully');
    };

    window.BOA_CloseImportModal = function() {
        $('#boa-import-modal').remove();
        console.log('Import modal closed');
    };

    // Export all plugin data from Reports page (uses same export as Fees page)
    window.BOA_ExportAllReports = function() {
        var ajaxUrl = window.boa_reports_data?.ajax_url || (typeof ajaxurl !== 'undefined' ? ajaxurl : '');
        var nonce   = window.boa_reports_data?.nonce || '';

        if (!ajaxUrl || !nonce) {
            alert('Export could not start: missing configuration.');
            return;
        }

        // Build and submit a hidden form to trigger file download
        var form = $('<form>', {
            method: 'POST',
            action: ajaxUrl,
            style: 'display:none;'
        });

        form.append($('<input>', { type: 'hidden', name: 'action', value: 'boa_export_plugin_data' }));
        form.append($('<input>', { type: 'hidden', name: 'nonce', value: nonce }));

        $('body').append(form);
        form.trigger('submit');
        form.remove();

        setTimeout(function() {
            alert('Export started. If the download did not begin, please check pop-up/download blockers.');
        }, 300);
    };

    window.BOA_SubmitImport = function(event) {
        event.preventDefault();
        console.log('Import submission started');
        
        var fileInput = $('#boa-import-file')[0];
        var confirmCheck = $('#boa-import-confirm');
        
        if (!fileInput.files || fileInput.files.length === 0) {
            alert('Please select a backup file to import.');
            return false;
        }
        
        if (!confirmCheck.is(':checked')) {
            alert('Please confirm that you want to import this data.');
            return false;
        }
        
        $('#boa-import-progress').show();
        $('#boa-progress-text').text('Importing data...');
        
        var formData = new FormData();
        formData.append('action', 'boa_import_plugin_data');
        formData.append('import_file', fileInput.files[0]);
        formData.append('nonce', window.boa_reports_data.nonce);
        
        $.ajax({
            url: window.boa_reports_data.ajax_url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('Import response:', response);
                
                if (response.success) {
                    $('#boa-progress-text').text('Import completed!');
                    $('.boa-progress-fill').css('width', '100%');
                    
                    setTimeout(function() {
                        BOA_CloseImportModal();
                        alert('Data imported successfully! Students: ' + response.data.results.imported_students + ', Courses: ' + response.data.results.imported_courses + ', Fees: ' + response.data.results.imported_fees);
                        window.location.reload();
                    }, 1500);
                } else {
                    BOA_CloseImportModal();
                    alert('Import failed: ' + response.data.message);
                }
            },
            error: function() {
                BOA_CloseImportModal();
                alert('Network error during import.');
            }
        });
        
        return false;
    };

    // Initialize when document is ready
    $(document).ready(function() {
        console.log('Clean Reports JavaScript loaded');
        window.boaReports = new BOA_Reports();
    });

})(jQuery);
