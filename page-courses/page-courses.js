// 🟢 یہاں سے Courses Management JavaScript شروع ہو رہا ہے
(function($) {
    'use strict';

    /**
     * BSSMS Courses Management - JavaScript functionality
     * کورسز مینجمنٹ، کیٹیگریز، اور انکم رپورٹس
     */

    // اگر PHP سے boa_courses_data نہ آیا ہو تو سیف ڈیفالٹ بنا دو
    if (typeof window.boa_courses_data === 'undefined') {
        console.warn('boa_courses_data is not defined, using safe defaults.');
        window.boa_courses_data = {
            ajax_url: (typeof ajaxurl !== 'undefined') ? ajaxurl : '',
            nonce: '',
            categories: [],
            courses_stats: { total: 0, active: 0, inactive: 0 },
            category_stats: [] // نیا ڈیفالٹ
        };
    }

    class BOA_Courses {
        constructor() {
            this.currentPage = 1;
            this.perPage = 10;
            this.totalRecords = 0;
            this.selectedCourses = new Set();
            this.currentCourseId = null;
            this.currency = window.boa_courses_data?.currency || 'PKR'; // Currency symbol
            this.filters = {
                search: '',
                category: '',
                status: '',
                duration: ''
            };
            
            // چارٹ کا انسٹینس محفوظ کریں تاکہ اسے destroy کیا جا سکے
            this.categoriesChartInstance = null;
            
            this.init();
        }

        init() {
            try {
                this.safeLoadCourses();
            } catch (e) {
                console.error('Error in loadCourses:', e);
            }

            try {
                this.initCharts(); // یہ اب اصلی ڈیٹا استعمال کرے گا
            } catch (e) {
                console.error('Error in initCharts:', e);
            }

            try {
                this.loadCategories();
                this.loadPopularCategories(); // یہ اب اصلی ڈیٹا استعمال کرے گا
            } catch (e) {
                console.error('Error in loading categories:', e);
            }

            this.bindEvents();
            
            console.log('BSSMS Courses Management initialized');
        }

        safeLoadCourses() {
            if (!window.boa_courses_data || !window.boa_courses_data.ajax_url) {
                console.warn('ajax_url not set, skipping AJAX course load.');
                this.updateStats();
                return;
            }
            this.loadCourses();
        }

        // === کورسز لوڈ کریں ===
        loadCourses() {
            const self = this;
            
            $.ajax({
                url: window.boa_courses_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_get_courses',
                    nonce: window.boa_courses_data.nonce,
                    page: this.currentPage,
                    per_page: this.perPage,
                    search: this.filters.search,
                    category_filter: this.filters.category,
                    status_filter: this.filters.status
                },
                beforeSend: function() {
                    $('#boa-courses-tbody').html('<tr><td colspan="8" class="boa-loading-cell">Loading courses...</td></tr>');
                },
                success: function(response) {
                    if (response && response.success) {
                        self.renderCoursesTable(response.data);
                        self.updatePagination(response.data);
                        // Stats کو بھی اپ ڈیٹ کریں (یہ اب AJAX کال کے ساتھ نہیں، بلکہ localize سے آ رہا ہے)
                        self.updateStats(); 
                    } else {
                        $('#boa-courses-tbody').html('<tr><td colspan="8" class="boa-no-data">No courses found</td></tr>');
                        self.updateStats(); // 0 دکھانے کے لیے
                    }
                },
                error: function() {
                    self.showError('Network error while loading courses');
                    $('#boa-courses-tbody').html('<tr><td colspan="8" class="boa-no-data">Error loading courses.</td></tr>');
                }
            });
        }

        // === کورسز ٹیبل رینڈر کریں ===
        renderCoursesTable(data) {
            const tbody = $('#boa-courses-tbody');
            const template = document.getElementById('boa-course-row-template');
            
            tbody.empty();

            if (!data || !data.courses || data.courses.length === 0) {
                tbody.append('<tr><td colspan="10" class="boa-no-data">No courses found</td></tr>');
                return;
            }

            data.courses.forEach((course) => {
                const clone = template.content.cloneNode(true);
                const row = clone.querySelector('.boa-course-row');
                
                row.dataset.courseId = course.course_id;
                
                const checkbox = row.querySelector('.boa-course-checkbox');
                checkbox.value = course.course_id;
                
                row.querySelector('.boa-course-id').textContent = course.course_id || 'N/A';
                row.querySelector('.boa-course-name').textContent = course.course_name || 'N/A';
                row.querySelector('.boa-course-category').textContent = course.category_name || 'N/A';
                const instructorsList = (course.instructors || []).map((item) => item.display_name || item.name || '').filter(Boolean).join(', ');
                row.querySelector('.boa-course-instructors').textContent = instructorsList || '-';
                row.querySelector('.boa-course-duration').textContent = course.duration || 'N/A';
                row.querySelector('.boa-course-start-date').textContent = course.start_date ? this.formatDate(course.start_date) : '-';
                row.querySelector('.boa-course-end-date').textContent = course.end_date ? this.formatDate(course.end_date) : '-';
                row.querySelector('.boa-course-fee').textContent = course.fee_amount ? `${this.currency} ${parseFloat(course.fee_amount).toFixed(2)}` : `${this.currency} 0.00`;
                
                const statusBadge = row.querySelector('.boa-status-badge');
                statusBadge.textContent = this.getStatusText(course.status);
                statusBadge.className = `boa-status-badge ${this.getStatusClass(course.status)}`;

                $(row).data('course', course);
                
                tbody.append(row);
            });

            this.totalRecords = data.total || 0;
        }

        // === پیجینیشن اپڈیٹ کریں ===
        updatePagination(data) {
            if (!data) return;
            const from = ((data.page - 1) * data.per_page) + 1;
            const to = Math.min(data.page * data.per_page, data.total);
            $('#boa-showing-from').text(data.total ? from : 0);
            $('#boa-showing-to').text(data.total ? to : 0);
            $('#boa-total-records').text(data.total || 0);
            this.renderPaginationNumbers(data.page, Math.ceil((data.total || 0) / data.per_page));
        }

        renderPaginationNumbers(currentPage, totalPages) {
            const container = $('#boa-page-numbers');
            container.empty();
            if (!totalPages || totalPages < 2) return;

            if (currentPage > 1) {
                container.append(`<button class="boa-page-btn" onclick="boaCourses.goToPage(${currentPage - 1})">&laquo; Prev</button>`);
            }
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                    const activeClass = i === currentPage ? ' boa-page-active' : '';
                    container.append(`<button class="boa-page-btn${activeClass}" onclick="boaCourses.goToPage(${i})">${i}</button>`);
                } else if (i === currentPage - 3 || i === currentPage + 3) {
                    container.append('<span class="boa-page-dots">...</span>');
                }
            }
            if (currentPage < totalPages) {
                container.append(`<button class="boa-page-btn" onclick="boaCourses.goToPage(${currentPage + 1})">Next &raquo;</button>`);
            }
        }

        // === چارٹس ===
        initCharts() {
            this.initCategoriesChart();
        }

        // --- اپ ڈیٹ ---
        initCategoriesChart() {
            const ctx = document.getElementById('boa-categories-chart');
            if (!ctx) return;
            if (typeof Chart === 'undefined') {
                console.warn('Chart.js not loaded, skipping categories chart.');
                return;
            }

            // پرانا چارٹ (اگر ہو) تو اسے ختم کریں
            if (this.categoriesChartInstance) {
                this.categoriesChartInstance.destroy();
            }

            // PHP سے آنے والا اصلی ڈیٹا استعمال کریں
            const chartData = window.boa_courses_data.category_stats || [];
            
            const labels = chartData.map(item => item.category_name);
            const data = chartData.map(item => item.course_count);
            
            // اگر ڈیٹا خالی ہے تو ڈیمو والا ڈیٹا استعمال کریں تاکہ چارٹ ٹوٹا ہوا نہ لگے
            const finalLabels = data.length > 0 ? labels : ['No Data'];
            const finalData = data.length > 0 ? data : [1];
            const finalColors = data.length > 0 ? 
                ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'] : 
                ['#e5e7eb'];

            this.categoriesChartInstance = new Chart(ctx, {
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
                    responsive: true,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
        // --- /اپ ڈیٹ ---

        // === کیٹیگریز لوڈ کریں ===
        loadCategories() {
            const container = $('#boa-categories-list');
            const template = document.getElementById('boa-category-item-template');
            const categories = window.boa_courses_data.categories || [];

            container.empty();
            if (categories.length === 0) {
                container.append('<div class="boa-no-data">No categories found</div>');
                return;
            }
            categories.forEach(category => {
                const clone = template.content.cloneNode(true);
                const item = clone.querySelector('.boa-category-item');
                item.querySelector('.boa-category-name').textContent = category.category_name;
                item.dataset.categoryId = category.category_id;
                container.append(item);
            });
        }

        // --- اپ ڈیٹ ---
        // === مقبول کیٹیگریز ===
        loadPopularCategories() {
            const container = $('#boa-popular-categories');
            const template = document.getElementById('boa-popular-category-template');

            // PHP سے آنے والا اصلی ڈیٹا استعمال کریں
            const popularCategories = window.boa_courses_data.category_stats || [];

            container.empty();

            if (popularCategories.length === 0) {
                container.append('<div class="boa-no-data" style="padding: 0;">No data to show.</div>');
                return;
            }

            popularCategories.forEach(category => {
                // صرف وہی دکھائیں جن میں کورسز ہیں
                if (parseInt(category.course_count, 10) > 0) {
                    const clone = template.content.cloneNode(true);
                    const item = clone.querySelector('.boa-popular-category');
                    
                    item.querySelector('.boa-category-name').textContent = category.category_name;
                    item.querySelector('.boa-courses-count').textContent = `(${category.course_count} courses)`;
                    
                    container.append(item);
                }
            });
            
            // اگر فلٹر ہونے کے بعد بھی کچھ نہ بچے
            if (container.children().length === 0) {
                 container.append('<div class="boa-no-data" style="padding: 0;">No courses found in categories.</div>');
            }
        }
        // --- /اپ ڈیٹ ---

        // === سٹیٹس اپڈیٹ کریں ===
        updateStats() {
            const stats = window.boa_courses_data.courses_stats || {
                total: 0,
                active: 0,
                inactive: 0
            };
            $('#boa-total-courses').text(stats.total || 0);
            $('#boa-active-courses').text(stats.active || 0);
            $('#boa-inactive-courses').text(stats.inactive || 0);
        }

        // === ایونٹ بائنڈنگ ===
        bindEvents() {
            $('#boa-courses-search').on('input', (e) => {
                this.filters.search = e.target.value;
                this.debouncedSearch();
            });
            $('#boa-category-filter').on('change', (e) => {
                this.filters.category = e.target.value;
                this.safeLoadCourses();
            });
            $('#boa-status-filter').on('change', (e) => {
                this.filters.status = e.target.value;
                this.safeLoadCourses();
            });
            $('#boa-duration-filter').on('change', (e) => {
                this.filters.duration = e.target.value;
                this.safeLoadCourses();
            });
            $('.boa-course-tabs .boa-tab-btn').on('click', (e) => {
                this.switchCourseTab(e.target.dataset.tab);
            });
        }

        debouncedSearch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.safeLoadCourses();
            }, 500);
        }

        switchCourseTab(tabName) {
            $('.boa-tab-content').removeClass('boa-tab-active');
            $('.boa-course-tabs .boa-tab-btn').removeClass('boa-tab-active');
            $(`#boa-tab-${tabName}`).addClass('boa-tab-active');
            $(`.boa-course-tabs .boa-tab-btn[data-tab="${tabName}"]`).addClass('boa-tab-active');
            if (tabName === 'students' && this.currentCourseId) {
                this.loadCourseStudents(this.currentCourseId);
            } else if (tabName === 'income' && this.currentCourseId) {
                this.loadCourseIncome(this.currentCourseId);
            }
        }

        // (یہ فنکشنز اب بھی ڈیمو ہیں، کیونکہ ہم نے ابھی سٹوڈنٹس کو نہیں جوڑا)
        loadCourseStudents(courseId) {
            const tbody = $('#boa-course-students-tbody');
            const template = document.getElementById('boa-student-row-template');
            const students = [
                { name: 'John Doe', admission_date: '2024-01-15', status: 'active' },
                { name: 'Sarah Smith', admission_date: '2024-01-10', status: 'active' }
            ];
            tbody.empty();
            if (students.length === 0) {
                tbody.append('<tr><td colspan="3" class="boa-no-data">No students enrolled</td></tr>');
                return;
            }
            students.forEach(student => {
                const clone = template.content.cloneNode(true);
                const row = clone.querySelector('.boa-student-row');
                row.querySelector('.boa-student-name').textContent = student.name;
                row.querySelector('.boa-admission-date').textContent = this.formatDate(student.admission_date);
                const statusBadge = row.querySelector('.boa-status-badge');
                statusBadge.textContent = this.getStudentStatusText(student.status);
                statusBadge.className = `boa-status-badge ${this.getStudentStatusClass(student.status)}`;
                tbody.append(row);
            });
        }

        loadCourseIncome(courseId) {
            $('#boa-total-income').text(`${this.currency} 4,500.00`);
            $('#boa-avg-monthly').text(`${this.currency} 750.00`);
            this.initIncomeChart();
        }

        initIncomeChart() {
            const ctx = document.getElementById('boa-income-chart');
            if (!ctx) return;
            if (typeof Chart === 'undefined') {
                console.warn('Chart.js not loaded, skipping income chart.');
                return;
            }
            const chartData = {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                data: [1200, 1900, 1500, 1800, 2200, 1950]
            };
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Monthly Income',
                        data: chartData.data,
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: '#3b82f6',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { callback: function(value) { return '$' + value; } }
                        }
                    }
                }
            });
        }
        // (ڈیمو فنکشنز یہاں ختم ہوتے ہیں)


        // === یوٹیلیٹی فنکشنز ===
        goToPage(page) {
            this.currentPage = page;
            this.safeLoadCourses();
        }

        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        getStatusText(status) {
            const statusMap = { 'active': 'Active', 'inactive': 'Inactive' };
            return statusMap[status] || 'Unknown';
        }

        getStatusClass(status) {
            const classMap = { 'active': 'boa-status-paid', 'inactive': 'boa-status-overdue' };
            return classMap[status] || 'boa-status-unknown';
        }

        getStudentStatusText(status) {
            const statusMap = { 'active': 'Active', 'completed': 'Completed' };
            return statusMap[status] || 'Unknown';
        }

        getStudentStatusClass(status) {
            const classMap = { 'active': 'boa-status-paid', 'completed': 'boa-status-overdue' };
            return classMap[status] || 'boa-status-unknown';
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

    // === Manage Categories method (class کے ساتھ اٹیچ) ===
    BOA_Courses.prototype.loadManageCategories = function() {
        const tbody = $('#boa-manage-categories-tbody');
        const template = document.getElementById('boa-manage-category-template');
        const categories = window.boa_courses_data.categories || [];
        tbody.empty();
        categories.forEach(category => {
            const clone = template.content.cloneNode(true);
            const row = clone.querySelector('.boa-manage-category-row');
            row.querySelector('.boa-category-name').textContent = category.category_name;
            row.querySelector('.boa-courses-count').textContent = '0'; // ڈیمو ڈیٹا
            row.dataset.categoryId = category.category_id;
            tbody.append(row);
        });
    };

    // === گلوبل انسٹینس ===
    window.boaCourses = new BOA_Courses();

    // === گلوبل فنکشنز ===
    window.BOA_OpenAddCourseModal = function() {
        // Check if categories are loaded
        const categoriesSelect = $('#boa-course-category');
        if (categoriesSelect.find('option').length <= 1) {
            boaCourses.showError('No categories available. Please add categories first.');
            return;
        }
        
        $('#boa-modal-title').text('Add Course');
        $('#boa-course-form')[0].reset();
        $('#boa-course-id').val('').prop('readonly', true);
        $('#boa-course-instructors').val([]);
        $('#boa-course-modal').addClass('boa-modal-open');
    };

    window.BOA_CloseCourseModal = function() {
        $('#boa-course-modal').removeClass('boa-modal-open');
    };

    window.BOA_ViewCourse = function(button) {
        const row = $(button).closest('.boa-course-row');
        const courseId = row.data('course-id');
        const courseData = {
            name: row.find('.boa-course-name').text(),
            category: row.find('.boa-course-category').text(),
            duration: row.find('.boa-course-duration').text(),
            startDate: row.find('.boa-course-start-date').text() !== '-' ? row.find('.boa-course-start-date').text() : 'Not set',
            endDate: row.find('.boa-course-end-date').text() !== '-' ? row.find('.boa-course-end-date').text() : 'Not set',
            fee: row.find('.boa-course-fee').text(),
            status: row.find('.boa-status-badge').text().toLowerCase(),
            description: 'This is a comprehensive course...' // (ToDo: DB سے لانا ہے)
        };
        $('#boa-course-detail-title').text(`Course: ${courseData.name}`);
        $('#boa-detail-name').text(courseData.name);
        $('#boa-detail-category').text(courseData.category);
        $('#boa-detail-duration').text(courseData.duration);
        $('#boa-detail-start-date').text(courseData.startDate);
        $('#boa-detail-end-date').text(courseData.endDate);
        $('#boa-detail-fee').text(courseData.fee);
        const statusBadge = $('#boa-detail-status-badge');
        statusBadge.text(boaCourses.getStatusText(courseData.status));
        statusBadge.attr('class', `boa-status-badge ${boaCourses.getStatusClass(courseData.status)}`);
        $('#boa-detail-description').text(courseData.description);
        boaCourses.currentCourseId = courseId;
        $('#boa-course-details').addClass('boa-slide-open');
    };

    window.BOA_CloseCourseDetails = function() {
        $('#boa-course-details').removeClass('boa-slide-open');
        boaCourses.currentCourseId = null;
    };

    window.BOA_EditCourse = function(button) {
        const row = $(button).closest('.boa-course-row');
        const courseId = row.data('course-id');
        const course = $(row).data('course') || {};

        $('#boa-modal-title').text('Edit Course');
        $('#boa-course-name').val(course.course_name || row.find('.boa-course-name').text());
        $('#boa-course-duration').val(course.duration || row.find('.boa-course-duration').text());
        $('#boa-course-start-date').val(course.start_date || (row.find('.boa-course-start-date').text() !== '-' ? row.find('.boa-course-start-date').text() : ''));
        $('#boa-course-end-date').val(course.end_date || (row.find('.boa-course-end-date').text() !== '-' ? row.find('.boa-course-end-date').text() : ''));
        $('#boa-course-fee').val(course.fee_amount || row.find('.boa-course-fee').text().replace(this.currency, '').trim());
        $('#boa-course-status').val(course.status || row.find('.boa-status-badge').text().toLowerCase());
        $('#boa-course-description').val(course.description || '');
        $('#boa-course-id').val(courseId).prop('readonly', true);

        if (course.category_id) {
            $('#boa-course-category').val(course.category_id);
        } else {
            const categories = window.boa_courses_data.categories || [];
            const category = categories.find((c) => c.category_name === row.find('.boa-course-category').text());
            $('#boa-course-category').val(category ? category.category_id : '');
        }

        const instructorIds = (course.instructors || []).map((item) => String(item.user_id));
        $('#boa-course-instructors').val(instructorIds);

        $('#boa-course-modal').addClass('boa-modal-open');
    };

    window.BOA_DeleteCourse = function(button) {
        if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            const row = $(button).closest('.boa-course-row');
            const courseId = row.data('course-id');
            $.ajax({
                url: window.boa_courses_data.ajax_url,
                type: 'POST',
                data: {
                    action: 'boa_delete_course',
                    nonce: window.boa_courses_data.nonce,
                    course_id: courseId
                },
                success: function(response) {
                    if (response.success) {
                        boaCourses.showSuccess('Course deleted successfully');
                        location.reload(); 
                    } else {
                        boaCourses.showError(response.data.message || 'Failed to delete course');
                    }
                },
                error: function() {
                    boaCourses.showError('Network error while deleting course');
                }
            });
        }
    };

    window.BOA_SaveCourse = function(event) {
        event.preventDefault();
        const form = $('#boa-course-form');
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        const instructorIds = $('#boa-course-instructors').val() || [];
        data.instructor_ids = instructorIds.join(',');
        
        // Enhanced validation
        if (!data.course_name || data.course_name.trim() === '') {
            boaCourses.showError('Course name is required');
            $('#boa-course-name').focus();
            return false;
        }
        
        if (!data.category_id || data.category_id === '') {
            boaCourses.showError('Please select a category');
            $('#boa-course-category').focus();
            return false;
        }
        
        if (!data.fee_amount || data.fee_amount === '' || parseFloat(data.fee_amount) <= 0) {
            boaCourses.showError('Please enter a valid fee amount');
            $('#boa-course-fee').focus();
            return false;
        }
        
        if (!data.duration || data.duration.trim() === '') {
            boaCourses.showError('Course duration is required');
            $('#boa-course-duration').focus();
            return false;
        }
        
        // Validate date fields if provided
        if (data.start_date && data.end_date) {
            const startDate = new Date(data.start_date);
            const endDate = new Date(data.end_date);
            if (startDate >= endDate) {
                boaCourses.showError('End date must be after start date');
                $('#boa-course-end-date').focus();
                return false;
            }
        }
        data.action = 'boa_save_course';
        data.nonce = window.boa_courses_data.nonce;
        $.ajax({
            url: window.boa_courses_data.ajax_url,
            type: 'POST',
            data: data, 
            success: function(response) {
                if (response.success) {
                    boaCourses.showSuccess('Course saved successfully');
                    $('#boa-course-modal').removeClass('boa-modal-open');
                    location.reload();
                } else {
                    // Show the specific error message from server
                    const errorMessage = response.data && response.data.message ? response.data.message : 'Failed to save course';
                    boaCourses.showError(errorMessage);
                    
                    // Log detailed error for debugging
                    console.error('Course save error:', response);
                }
            },
            error: function(xhr, status, error) {
                boaCourses.showError('Network error while saving course: ' + error);
                console.error('AJAX Error:', {xhr, status, error});
            }
        });
        return false;
    };

    // (یہ کیٹیگری فنکشنز اب Settings پیج پر ہیں،
    // لیکن ہم انہیں یہاں پلیس ہولڈر کے طور پر رکھ سکتے ہیں)
    window.BOA_AddCategory = function() {
        alert('Please manage categories from the Settings page.');
    };
    window.BOA_EditCategory = function(button) {
        alert('Please manage categories from the Settings page.');
    };
    window.BOA_DeleteCategory = function(button) {
        alert('Please manage categories from the Settings page.');
    };
    
    // (یہ فنکشنز بھی پلیس ہولڈر ہیں)
    window.BOA_ManageCategories = function() {
        $('#boa-categories-modal').addClass('boa-modal-open');
        boaCourses.loadManageCategories();
    };
    window.BOA_CloseCategoriesModal = function() {
        $('#boa-categories-modal').removeClass('boa-modal-open');
    };
    window.BOA_AddNewCategory = function() {
        alert('Please manage categories from the Settings page.');
    };
    window.BOA_EditManageCategory = function(button) {
        alert('Please manage categories from the Settings page.');
    };
    window.BOA_DeleteManageCategory = function(button) {
        alert('Please manage categories from the Settings page.');
    };
    // (پلیس ہولڈرز ختم)

    window.BOA_ToggleSelectAll = function(checkbox) {
        const isChecked = checkbox.checked;
        $('.boa-course-checkbox').prop('checked', isChecked);
    };

    window.BOA_ResetFilters = function() {
        $('#boa-courses-search').val('');
        $('#boa-category-filter').val('');
        $('#boa-status-filter').val('');
        $('#boa-duration-filter').val('');
        boaCourses.filters = { search: '', category: '', status: '', duration: '' };
        boaCourses.safeLoadCourses();
    };

    window.BOA_ExportCourses = function() {
        boaCourses.showSuccess('Export functionality will be implemented');
    };
    window.BOA_ExportExcel = function() {
        boaCourses.showSuccess('Excel export functionality will be implemented');
    };
    window.BOA_PrintCourses = function() {
        window.print();
    };
    window.BOA_GenerateDemoData = function() {
        if (confirm('This will generate demo course data. Continue?')) {
            boaCourses.showSuccess('Demo data generated successfully (DEMO)');
        }
    };
    window.BOA_ViewReports = function() {
        boaCourses.showSuccess('Reports functionality will be implemented in Reports module');
    };

    // === ڈاکیومینٹ ریڈی ===
    $(document).ready(function() {
        // ریڈی فنکشن کو boaCourses کے انسٹینس بنانے کے بعد کال کریں
    });

})(jQuery);
// ✅ Syntax verified block end
