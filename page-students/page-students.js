// 🟢 یہاں سے Students Management JavaScript شروع ہو رہا ہے
(function($) {
    'use strict';

    /**
     * BSSMS Students Management - JavaScript functionality
     * (نوٹ: اب یہ فائل 'boa_students_data' آبجیکٹ سے اصلی ڈیٹا استعمال کرتی ہے)
     */

    if (typeof window.boa_students_data === 'undefined') {
        console.warn('boa_students_data is not defined, using safe defaults.');
        window.boa_students_data = {
            ajax_url: (typeof ajaxurl !== 'undefined') ? ajaxurl : '',
            nonce: '',
            student_course_stats: [],
            recent_admissions: [],
            courses_list: []
        };
    }

    class BOA_Students {
        constructor() {
            this.currentPage = 1;
            this.perPage = 10;
            this.totalRecords = 0;
            this.selectedStudents = new Set();
            this.currentStudentId = null;
            this.filters = {
                search: '',
                course: '',
                status: '',
                dateFrom: '',
                dateTo: ''
            };
            this.coursesChartInstance = null;
            this.init();
        }

        init() {
            this.loadStudents(); // اصلی فنکشن کال کریں
            this.initCharts();
            this.loadRecentAdmissions();
            this.loadPopularCourses();
            this.bindEvents();
            console.log('BSSMS Students Management initialized');
        }

        // === سٹوڈنٹس لوڈ کریں (اپ ڈیٹڈ) ===
        loadStudents() {
            const self = this;
            
            $.ajax({
                url: window.boa_students_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_get_students',
                    nonce: window.boa_students_data.nonce,
                    page: this.currentPage,
                    per_page: this.perPage,
                    search: this.filters.search,
                    course_filter: this.filters.course,
                    status_filter: this.filters.status,
                    dateFrom: this.filters.dateFrom,
                    dateTo: this.filters.dateTo
                },
                beforeSend: function() {
                    $('#boa-students-tbody').html('<tr><td colspan="9" class="boa-loading-cell">Loading students...</td></tr>');
                },
                success: function(response) {
                    if (response.success) {
                        self.renderStudentsTable(response.data);
                        self.updatePagination(response.data);
                    } else {
                        $('#boa-students-tbody').html('<tr><td colspan="9" class="boa-no-data">No students found</td></tr>');
                        // اگر کوئی سٹوڈنٹ نہ ملے تو پیجینیشن کو بھی 0 کریں
                        self.updatePagination({ page: 1, per_page: self.perPage, total: 0 });
                    }
                },
                error: function() {
                    self.showError('Network error while loading students');
                    $('#boa-students-tbody').html('<tr><td colspan="9" class="boa-no-data">Error loading students.</td></tr>');
                }
            });
        }

        // === سٹوڈنٹس ٹیبل رینڈر کریں (اپ ڈیٹڈ) ===
        renderStudentsTable(data) {
            const tbody = $('#boa-students-tbody');
            const template = document.getElementById('boa-student-row-template');
            
            tbody.empty();

            if (!data.students || data.students.length === 0) {
                tbody.append('<tr><td colspan="9" class="boa-no-data">No students found</td></tr>');
                return;
            }

            data.students.forEach((student) => {
                const clone = template.content.cloneNode(true);
                const row = clone.querySelector('.boa-student-row');
                
                row.dataset.studentId = student.student_id;
                
                const checkbox = row.querySelector('.boa-student-checkbox');
                checkbox.value = student.student_id;
                
                // student_uid کو student_id سے تبدیل کیا
                row.querySelector('.boa-student-id').textContent = student.student_uid || `STU-${student.student_id}`;
                row.querySelector('.boa-student-name').textContent = student.name || 'N/A';
                row.querySelector('.boa-student-email').textContent = student.email || 'N/A';
                
                // Phone with WhatsApp button
                const phoneCell = row.querySelector('.boa-student-phone');
                const phoneDisplay = phoneCell.querySelector('.boa-phone-display');
                phoneDisplay.textContent = student.phone || 'N/A';
                
                // Show/hide WhatsApp button based on phone availability
                const whatsappBtn = phoneCell.querySelector('.boa-whatsapp-btn');
                if (student.phone && student.phone !== 'N/A') {
                    whatsappBtn.style.display = 'inline-flex';
                } else {
                    whatsappBtn.style.display = 'none';
                }
                
                row.querySelector('.boa-student-course').textContent = student.course_name || 'N/A'; // JOIN سے آیا
                row.querySelector('.boa-admission-date').textContent = this.formatDate(student.admission_date);
                
                const statusBadge = row.querySelector('.boa-status-badge');
                statusBadge.textContent = this.getStatusText(student.status);
                statusBadge.className = `boa-status-badge ${this.getStatusClass(student.status)}`;
                
                tbody.append(row);
            });

            this.totalRecords = data.total;
        }

        // === پیجینیشن اپڈیٹ کریں ===
        updatePagination(data) {
            const from = data.total > 0 ? ((data.page - 1) * data.per_page) + 1 : 0;
            const to = Math.min(data.page * data.per_page, data.total);
            
            $('#boa-showing-from').text(from);
            $('#boa-showing-to').text(to);
            $('#boa-total-records').text(data.total || 0);
            
            this.renderPaginationNumbers(data.page, Math.ceil((data.total || 0) / data.per_page));
        }

        renderPaginationNumbers(currentPage, totalPages) {
            const container = $('#boa-page-numbers');
            container.empty();
            if (!totalPages || totalPages < 2) return;

            if (currentPage > 1) {
                container.append(`<button class="boa-page-btn" onclick="boaStudents.goToPage(${currentPage - 1})">&laquo; Prev</button>`);
            }
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                    const activeClass = i === currentPage ? ' boa-page-active' : '';
                    container.append(`<button class="boa-page-btn${activeClass}" onclick="boaStudents.goToPage(${i})">${i}</button>`);
                } else if (i === currentPage - 3 || i === currentPage + 3) {
                    container.append('<span class="boa-page-dots">...</span>');
                }
            }
            if (currentPage < totalPages) {
                container.append(`<button class="boa-page-btn" onclick="boaStudents.goToPage(${currentPage + 1})">Next &raquo;</button>`);
            }
        }

        // === چارٹس (اصلی ڈیٹا) ===
        initCharts() {
            const ctx = document.getElementById('boa-courses-chart');
            if (!ctx) return;
            if (typeof Chart === 'undefined') {
                console.warn('Chart.js not loaded, skipping courses chart.');
                return;
            }
            if (this.coursesChartInstance) { this.coursesChartInstance.destroy(); }
            const chartData = window.boa_students_data?.student_course_stats || [];
            const labels = chartData.map(item => item.course_name);
            const data = chartData.map(item => item.student_count);
            const finalLabels = data.length > 0 ? labels : ['No Data'];
            const finalData = data.length > 0 ? data : [1];
            const finalColors = data.length > 0 ? ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'] : ['#e5e7eb'];
            this.coursesChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: finalLabels,
                    datasets: [{
                        data: finalData,
                        backgroundColor: finalColors,
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true, cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: (context) => `${context.label}: ${context.parsed} students` } }
                    }
                }
            });
        }

        // === حالیہ ایڈمیشنز (اصلی ڈیٹا) ===
        loadRecentAdmissions() {
            const container = $('#boa-recent-admissions');
            const template = document.getElementById('boa-recent-admission-template');
            const recentAdmissions = window.boa_students_data?.recent_admissions || [];
            container.empty();
            if (recentAdmissions.length === 0) {
                container.append('<div class="boa-no-data" style="padding:0; margin-top:1rem;">No recent admissions</div>');
                return;
            }
            recentAdmissions.forEach(admission => {
                const clone = template.content.cloneNode(true);
                const item = clone.querySelector('.boa-recent-item');
                item.querySelector('.boa-recent-name').textContent = admission.name;
                item.querySelector('.boa-recent-course').textContent = admission.course_name;
                item.querySelector('.boa-recent-date').textContent = this.formatDate(admission.admission_date);
                container.append(item);
            });
        }

        // === مقبول کورسز (اصلی ڈیٹا) ===
        loadPopularCourses() {
            const container = $('#boa-popular-courses');
            const template = document.getElementById('boa-popular-course-template');
            const popularCourses = window.boa_students_data?.student_course_stats || [];
            container.empty();
            if (popularCourses.length === 0) {
                container.append('<div class="boa-no-data" style="padding:0;">No data to show</div>');
                return;
            }
            popularCourses.forEach(course => {
                if (parseInt(course.student_count, 10) > 0) {
                    const clone = template.content.cloneNode(true);
                    const item = clone.querySelector('.boa-popular-course');
                    item.querySelector('.boa-course-name').textContent = course.course_name;
                    item.querySelector('.boa-student-count').textContent = `(${course.student_count} students)`;
                    container.append(item);
                }
            });
            if (container.children().length === 0) {
                 container.append('<div class="boa-no-data" style="padding:0;">No students enrolled in courses.</div>');
            }
        }

        updateStats() { /* (یہ اب PHP سے ہو رہا ہے) */ }

        // === ایونٹ بائنڈنگ ===
        bindEvents() {
            $('#boa-students-search').on('input', (e) => { this.filters.search = e.target.value; this.debouncedSearch(); });
            $('#boa-course-filter').on('change', (e) => { this.filters.course = e.target.value; this.loadStudents(); });
            $('#boa-status-filter').on('change', (e) => { this.filters.status = e.target.value; this.loadStudents(); });
            $('#boa-date-from').on('change', (e) => { this.filters.dateFrom = e.target.value; this.loadStudents(); });
            $('#boa-date-to').on('change', (e) => { this.filters.dateTo = e.target.value; this.loadStudents(); });
            $('.boa-tab-btn').on('click', (e) => { this.switchTab(e.target.dataset.tab); });
            this.initFileUpload();
        }

        debouncedSearch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => { this.loadStudents(); }, 500);
        }

        switchTab(tabName) {
            $('.boa-tab-content').removeClass('boa-tab-active');
            $('.boa-tab-btn').removeClass('boa-tab-active');
            $(`#boa-tab-${tabName}`).addClass('boa-tab-active');
            $(`.boa-tab-btn[data-tab="${tabName}"]`).addClass('boa-tab-active');
            if (tabName === 'fees' && this.currentStudentId) { this.loadFeeHistory(this.currentStudentId); }
            else if (tabName === 'documents' && this.currentStudentId) { this.loadDocuments(this.currentStudentId); }
        }

        initFileUpload() {
            const uploadArea = $('#boa-upload-area');
            const fileInput = $('#boa-csv-file');
            uploadArea.on('click', () => fileInput.click());
            fileInput.on('change', (e) => this.handleFileSelect(e.target.files[0]));
            uploadArea.on('dragover', (e) => { e.preventDefault(); uploadArea.addClass('boa-upload-dragover'); });
            uploadArea.on('dragleave', () => uploadArea.removeClass('boa-upload-dragover'));
            uploadArea.on('drop', (e) => { e.preventDefault(); uploadArea.removeClass('boa-upload-dragover'); this.handleFileSelect(e.originalEvent.dataTransfer.files[0]); });
        }

        handleFileSelect(file) {
            if (!file || !file.name.endsWith('.csv')) { this.showError('Please select a CSV file'); return; }
            const reader = new FileReader();
            reader.onload = (e) => this.showMappingPreview(e.target.result);
            reader.readAsText(file);
        }

        showMappingPreview(csvData) {
            const lines = csvData.split('\n').slice(0, 6); const headers = lines[0].split(',');
            $('#boa-mapping-headers').html(`<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`);
            const previewBody = $('#boa-mapping-preview-body'); previewBody.empty();
            lines.slice(1).forEach(line => {
                const cells = line.split(',');
                previewBody.append(`<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`);
            });
            $('#boa-mapping-preview').show(); $('#boa-import-btn').prop('disabled', false);
        }

        // (ToDo: یہ فنکشنز ابھی بھی ڈیمو ہیں)
        loadFeeHistory(studentId) {
            const tbody = $('#boa-fee-history-tbody');
            tbody.empty().append('<tr><td colspan="5" class="boa-no-data">No fee history found</td></tr>');
        }
        loadDocuments(studentId) {
            const container = $('#boa-documents-list');
            container.empty().append('<div class="boa-no-data">No documents found</div>');
        }

        // === یوٹیلیٹی فنکشنز ===
        goToPage(page) { this.currentPage = page; this.loadStudents(); }
        formatDate(dateString) { if (!dateString) return 'N/A'; const date = new Date(dateString); return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
        getStatusText(status) { const map = { 'active': 'Active', 'pending': 'Pending', 'inactive': 'Inactive', 'completed': 'Completed', 'paid': 'Paid', 'overdue': 'Overdue' }; return map[status] || 'Unknown'; }
        getStatusClass(status) { const map = { 'active': 'boa-status-paid', 'pending': 'boa-status-pending', 'inactive': 'boa-status-overdue', 'completed': 'boa-status-unknown', 'paid': 'boa-status-paid', 'overdue': 'boa-status-overdue' }; return map[status] || 'boa-status-unknown'; }
        showError(message) { console.error('BSSMS Error:', message); alert(`Error: ${message}`); }
        showSuccess(message) { console.log('BSSMS Success:', message); alert(`Success: ${message}`); }
    }

    // === گلوبل فنکشنز ===
    window.boaStudents = new BOA_Students();

    window.BOA_OpenAddStudentModal = function() {
        $('#boa-modal-title').text('Add Student');
        $('#boa-student-form')[0].reset();
        $('#boa-student-id').val('').prop('readonly', true);
        $('#boa-student-admission-date').val(new Date().toISOString().split('T')[0]);
        $('#boa-student-modal').addClass('boa-modal-open');
    };

    window.BOA_CloseStudentModal = function() { $('#boa-student-modal').removeClass('boa-modal-open'); };
    window.BOA_OpenImportModal = function() { $('#boa-import-modal').addClass('boa-modal-open'); };
    window.BOA_CloseImportModal = function() { $('#boa-import-modal').removeClass('boa-modal-open'); $('#boa-mapping-preview').hide(); $('#boa-import-btn').prop('disabled', true); };

    window.BOA_ViewStudent = function(button) {
        const row = $(button).closest('.boa-student-row');
        boaStudents.currentStudentId = row.data('student-id');
        // (ToDo: Get full student details via AJAX)
        const studentData = {
            name: row.find('.boa-student-name').text(),
            student_id: row.find('.boa-student-id').text(),
            email: row.find('.boa-student-email').text(),
            phone: row.find('.boa-student-phone').text(),
            course: row.find('.boa-student-course').text(),
            admission_date: row.find('.boa-admission-date').text(),
            status: row.find('.boa-status-badge').text().toLowerCase()
        };
        $('#boa-profile-title').text(`Student: ${studentData.name}`);
        $('#boa-profile-name').text(studentData.name);
        $('#boa-profile-id').text(studentData.student_id);
        $('#boa-profile-email').text(studentData.email);
        $('#boa-profile-phone').text(studentData.phone);
        $('#boa-profile-course').text(studentData.course);
        $('#boa-profile-admission-date').text(studentData.admission_date);
        const statusBadge = $('#boa-profile-status-badge');
        statusBadge.text(boaStudents.getStatusText(studentData.status));
        statusBadge.attr('class', `boa-status-badge ${boaStudents.getStatusClass(studentData.status)}`);
        $('#boa-student-profile').addClass('boa-slide-open');
        // پہلا ٹیب دکھائیں
        boaStudents.switchTab('profile');
    };

    window.BOA_CloseStudentProfile = function() { $('#boa-student-profile').removeClass('boa-slide-open'); boaStudents.currentStudentId = null; };

    window.BOA_EditStudent = function() {
        const studentData = {
            name: $('#boa-profile-name').text(),
            email: $('#boa-profile-email').text(),
            phone: $('#boa-profile-phone').text(),
            course: $('#boa-profile-course').text(),
            admission_date: $('#boa-profile-admission-date').text(),
            status: $('#boa-profile-status-badge').text().toLowerCase()
        };
        $('#boa-modal-title').text('Edit Student');
        $('#boa-student-name').val(studentData.name);
        $('#boa-student-email').val(studentData.email);
        $('#boa-student-phone').val(studentData.phone);
        $('#boa-student-admission-date').val(window.formatDateForInput(studentData.admission_date));
        $('#boa-student-status').val(studentData.status);
        $('#boa-student-id').val(boaStudents.currentStudentId).prop('readonly', true);
        const course = window.boa_students_data.courses_list.find(c => c.course_name === studentData.course);
        $('#boa-student-course').val(course ? course.course_id : '');
        $('#boa-student-modal').addClass('boa-modal-open');
        $('#boa-student-profile').removeClass('boa-slide-open');
    };

    window.BOA_EditStudentRow = function(button) {
        const row = $(button).closest('.boa-student-row');
        const studentId = row.data('student-id');
        const studentData = {
            name: row.find('.boa-student-name').text(),
            email: row.find('.boa-student-email').text(),
            phone: row.find('.boa-student-phone').text(),
            course: row.find('.boa-student-course').text(),
            admission_date: row.find('.boa-admission-date').text(),
            status: row.find('.boa-status-badge').text().toLowerCase()
        };
        $('#boa-modal-title').text('Edit Student');
        $('#boa-student-name').val(studentData.name);
        $('#boa-student-email').val(studentData.email);
        $('#boa-student-phone').val(studentData.phone);
        $('#boa-student-admission-date').val(window.formatDateForInput(studentData.admission_date));
        $('#boa-student-status').val(studentData.status);
        $('#boa-student-id').val(studentId).prop('readonly', true);
        const course = window.boa_students_data.courses_list.find(c => c.course_name === studentData.course);
        $('#boa-student-course').val(course ? course.course_id : '');
        $('#boa-student-modal').addClass('boa-modal-open');
    };

    // --- اپ ڈیٹ (اصلی AJAX کالز) ---
    window.BOA_DeleteStudent = function() {
        if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            $.ajax({
                url: window.boa_students_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_delete_student',
                    nonce: window.boa_students_data.nonce,
                    student_id: boaStudents.currentStudentId
                },
                success: function(response) {
                    if (response.success) {
                        boaStudents.showSuccess('Student deleted successfully');
                        location.reload(); // پیج ری لوڈ کریں
                    } else {
                        boaStudents.showError(response.data.message || 'Failed to delete student');
                    }
                },
                error: function() { boaStudents.showError('Network error while deleting student'); }
            });
        }
    };

    window.BOA_DeleteStudentRow = function(button) {
        if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            const row = $(button).closest('.boa-student-row');
            const studentId = row.data('student-id');
            $.ajax({
                url: window.boa_students_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_delete_student',
                    nonce: window.boa_students_data.nonce,
                    student_id: studentId
                },
                success: function(response) {
                    if (response.success) {
                        boaStudents.showSuccess('Student deleted successfully');
                        location.reload(); // پیج ری لوڈ کریں
                    } else {
                        boaStudents.showError(response.data.message || 'Failed to delete student');
                    }
                },
                error: function() { boaStudents.showError('Network error while deleting student'); }
            });
        }
    };

    window.BOA_SaveStudent = function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        if (!data.name || !data.email || !data.course_id || !data.admission_date) {
            boaStudents.showError('Please fill all required fields');
            return false;
        }
        data.action = 'boa_save_student';
        data.nonce = window.boa_students_data.nonce;
        
        $.ajax({
            url: window.boa_students_data.ajax_url,
            type: 'POST',
            data: data,
            success: function(response) {
                if (response.success) {
                    boaStudents.showSuccess('Student saved successfully');
                    location.reload(); // پیج ری لوڈ کریں
                } else {
                    boaStudents.showError(response.data.message || 'Failed to save student');
                }
            },
            error: function() { boaStudents.showError('Network error while saving student'); }
        });
        return false;
    };
    // --- /اپ ڈیٹ ---

    window.BOA_ToggleSelectAll = function(checkbox) { $('.boa-student-checkbox').prop('checked', checkbox.checked); window.BOA_UpdateBulkActions(); };
    window.BOA_UpdateBulkActions = function() {
        const selectedCount = $('.boa-student-checkbox:checked').length;
        if (selectedCount > 0) {
            $('#boa-bulk-actions-bar').show();
            $('#boa-selected-count').text(`${selectedCount} students selected`);
        } else {
            $('#boa-bulk-actions-bar').hide();
        }
    };
    window.BOA_ApplyBulkAction = function() {
        const action = $('#boa-bulk-action').val(); if (!action) { boaStudents.showError('Please select a bulk action'); return; }
        const selectedIds = []; $('.boa-student-checkbox:checked').each(function() { selectedIds.push($(this).val()); });
        if (selectedIds.length === 0) { boaStudents.showError('No students selected'); return; }
        if (confirm(`Are you sure you want to ${action} ${selectedIds.length} students?`)) {
            // (ToDo: Bulk actions کے لیے AJAX کالز بنانی ہیں)
            boaStudents.showSuccess(`Bulk ${action} completed successfully (DEMO)`);
            $('#boa-bulk-actions-bar').hide();
            $('.boa-student-checkbox').prop('checked', false);
        }
    };

    window.BOA_SetQuickFilter = function(filter) {
        $('.boa-chip').removeClass('boa-chip-active');
        $(`.boa-chip[data-filter="${filter}"]`).addClass('boa-chip-active');
        const status = (filter === 'all') ? '' : filter;
        $('#boa-status-filter').val(status);
        boaStudents.filters.status = status;
        boaStudents.loadStudents();
    };

    window.BOA_FilterByCourse = function(courseId) {
        $('#boa-course-filter').val(courseId);
        boaStudents.filters.course = courseId;
        boaStudents.loadStudents();
    };

    window.BOA_ClearAllFilters = function() {
        $('#boa-students-search').val('');
        $('#boa-course-filter').val('');
        $('#boa-status-filter').val('');
        $('#boa-date-from').val('');
        $('#boa-date-to').val('');
        $('.boa-chip').removeClass('boa-chip-active');
        $('.boa-chip[data-filter="all"]').addClass('boa-chip-active');
        boaStudents.filters = { search: '', course: '', status: '', dateFrom: '', dateTo: '' };
        boaStudents.loadStudents();
    };

    window.BOA_ResetFilters = function() { window.BOA_ClearAllFilters(); };
    window.BOA_ExportStudents = function() { boaStudents.showSuccess('Export functionality will be implemented'); };
    window.BOA_ExportExcel = function() { boaStudents.showSuccess('Excel export functionality will be implemented'); };
    window.BOA_PrintStudents = function() { window.print(); };
    window.BOA_GenerateDemoData = function() { boaStudents.showSuccess('Demo data functionality will be implemented'); };
    window.BOA_ProcessImport = function() { boaStudents.showSuccess('Import functionality will be implemented'); window.BOA_CloseImportModal(); };
    window.BOA_ExportFeeExcel = function() { boaStudents.showSuccess('Fee export functionality will be implemented'); };
    window.BOA_PrintFeeHistory = function() { window.print(); };
    window.BOA_ViewReceipt = function(button) { boaStudents.showSuccess('Receipt view functionality will be implemented'); };
    window.BOA_ViewDocument = function(button) { boaStudents.showSuccess('Document view functionality will be implemented'); };
    window.BOA_DownloadDocument = function(button) { boaStudents.showSuccess('Document download functionality will be implemented'); };
    window.BOA_DeleteDocument = function(button) { if (confirm('Are you sure?')) { boaStudents.showSuccess('Document deleted (DEMO)'); } };

    // ہیلپر فنکشن
    window.formatDateForInput = function(dateString) {
        if (!dateString) return '';
        //safari compatibility
        const date = new Date(dateString.replace(/-/g, '/'));
        return date.toISOString().split('T')[0];
    };

    $(document).ready(function() {
        console.log('BSSMS Students Management ready');
    });

})(jQuery);

// ✅ Enhanced Functions for WhatsApp and Discount

/**
 * Send WhatsApp message to student
 */
function BOA_SendWhatsApp(phoneElement) {
    const row = phoneElement.closest('tr');
    const studentName = row.querySelector('.boa-student-name').textContent;
    const phone = row.querySelector('.boa-phone-display').textContent;
    
    if (!phone || phone === 'N/A') {
        alert('Phone number not available for this student.');
        return;
    }
    
    // Generate WhatsApp URL
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    let whatsappUrl = `https://wa.me/${cleanPhone}`;
    
    // Add default message
    const message = encodeURIComponent(`Hello ${studentName}, this is from Academic Hub. We want to inform you about your course updates.`);
    whatsappUrl += `?text=${message}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
}

/**
 * Open discount modal for student
 */
function BOA_OpenDiscountModal(buttonElement) {
    const row = buttonElement.closest('tr');
    const studentId = row.querySelector('.boa-student-checkbox').value;
    const studentName = row.querySelector('.boa-student-name').textContent;
    const courseName = row.querySelector('.boa-student-course').textContent;
    const phone = row.querySelector('.boa-phone-display').textContent;
    
    if (!studentId) {
        alert('Student ID not found.');
        return;
    }
    
    // Show loading state
    buttonElement.innerHTML = '<span class="dashicons dashicons-update spin"></span>';
    buttonElement.disabled = true;
    
    // Get student fee information
    jQuery.ajax({
        url: boa_students_data.ajax_url,
        type: 'POST',
        data: {
            action: 'boa_get_student_fees',
            student_id: studentId,
            nonce: boa_students_data.nonce
        },
        success: function(response) {
            if (response.success) {
                const feeData = response.data;
                
                // Populate modal fields
                document.getElementById('boa-discount-student-name').textContent = studentName;
                document.getElementById('boa-discount-student-course').textContent = courseName;
                document.getElementById('boa-discount-student-phone').textContent = `Phone: ${phone}`;
                document.getElementById('boa-discount-total-due').textContent = feeData.total_due;
                document.getElementById('boa-discount-total-paid').textContent = feeData.total_paid;
                document.getElementById('boa-discount-pending').textContent = feeData.pending_amount;
                document.getElementById('boa-discount-student-id').value = studentId;
                
                // Auto-fill discount amount with pending amount
                document.getElementById('boa-discount-amount').value = feeData.pending_amount_numeric;
                document.getElementById('boa-discount-reason').value = `Discount applied for ${studentName} - ${courseName}`;
                
                // Show modal
                document.getElementById('boa-discount-modal').style.display = 'flex';
            } else {
                alert('Error loading fee information: ' + (response.data.message || 'Unknown error'));
            }
        },
        error: function() {
            alert('Error loading fee information. Please try again.');
        },
        complete: function() {
            // Restore button
            buttonElement.innerHTML = '<span class="dashicons dashicons-money-alt"></span>';
            buttonElement.disabled = false;
        }
    });
}

/**
 * Close discount modal
 */
function BOA_CloseDiscountModal() {
    document.getElementById('boa-discount-modal').style.display = 'none';
    document.getElementById('boa-discount-form').reset();
}

/**
 * Apply discount to student
 */
function BOA_ApplyDiscount(event) {
    event.preventDefault();
    
    const form = document.getElementById('boa-discount-form');
    const formData = new FormData(form);
    formData.append('action', 'boa_apply_student_discount');
    formData.append('nonce', boa_students_data.nonce);
    
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<span class="dashicons dashicons-update spin"></span>';
    submitBtn.disabled = true;
    
    jQuery.ajax({
        url: boa_students_data.ajax_url,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            if (response.success) {
                alert('Discount applied successfully!');
                BOA_CloseDiscountModal();
                // Refresh students table to show updated amounts
                BOA_LoadStudents();
            } else {
                alert('Error applying discount: ' + (response.data.message || 'Unknown error'));
            }
        },
        error: function() {
            alert('Error applying discount. Please try again.');
        },
        complete: function() {
            submitBtn.innerHTML = 'Apply Discount';
            submitBtn.disabled = false;
        }
    });
    
    return false;
}
// ✅ Syntax verified block end