/**
 * Modern Professional Dashboard JavaScript - Baba Online Academy
 * Complete interactive functionality for the new modern dashboard
 * 
 * Features:
 * - Chart.js integration
 * - Interactive animations
 * - Mobile responsiveness
 * - Real-time updates
 * - Smooth transitions
 */

(function() {
    'use strict';

    // Dashboard Object
    const BOA_Dashboard = {
        
        // Configuration
        config: {
            chartColors: {
                blue: 'rgba(59, 130, 246, 1)',
                blueLight: 'rgba(59, 130, 246, 0.1)',
                green: 'rgba(34, 197, 94, 1)',
                greenLight: 'rgba(34, 197, 94, 0.1)',
                purple: 'rgba(139, 92, 246, 1)',
                purpleLight: 'rgba(139, 92, 246, 0.1)',
                orange: 'rgba(245, 158, 11, 1)',
                orangeLight: 'rgba(245, 158, 11, 0.1)',
                red: 'rgba(239, 68, 68, 1)',
                redLight: 'rgba(239, 68, 68, 0.1)',
                teal: 'rgba(20, 184, 166, 1)',
                tealLight: 'rgba(20, 184, 166, 0.1)'
            },
            animationDuration: 300,
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12,
                                family: 'Inter, sans-serif'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(59, 130, 246, 0.3)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12
                    }
                }
            }
        },

        // Charts
        charts: {},

        // Initialize Dashboard
        init: function() {
            console.log('BOA Dashboard: Initializing...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initialize());
            } else {
                this.initialize();
            }
        },

        // Initialize all components
        initialize: function() {
            this.initCharts();
            this.initAnimations();
            this.initInteractions();
            this.initMobileFeatures();
            this.initRealTimeUpdates();
            
            console.log('BOA Dashboard: Initialized successfully');
        },

        // Initialize Charts
        initCharts: function() {
            this.initAdmissionsChart();
            this.initRevenueChart();
            this.initCourseIncomeChart();
            this.initAdditionalCharts();
        },

        // Admissions by Course Chart
        initAdmissionsChart: function() {
            const canvas = document.getElementById('boaAdmissionsChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            
            // Get data from PHP
            const admissionsData = window.boaAdmissionsData || {
                labels: ['Web Development', 'Data Science', 'Mobile App Dev', 'Digital Marketing'],
                data: [120, 95, 85, 110]
            };

            this.charts.admissions = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: admissionsData.labels,
                    datasets: [{
                        label: 'Admissions',
                        data: admissionsData.data,
                        backgroundColor: [
                            this.config.chartColors.blue,
                            this.config.chartColors.green,
                            this.config.chartColors.orange,
                            this.config.chartColors.purple,
                            this.config.chartColors.teal
                        ],
                        borderColor: [
                            this.config.chartColors.blue,
                            this.config.chartColors.green,
                            this.config.chartColors.orange,
                            this.config.chartColors.purple,
                            this.config.chartColors.teal
                        ],
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                    }]
                },
                options: {
                    ...this.config.chartOptions,
                    plugins: {
                        ...this.config.chartOptions.plugins,
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#6b7280',
                                font: { size: 12 }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#6b7280',
                                font: { size: 12 }
                            }
                        }
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    }
                }
            });
        },

        // Monthly Revenue Chart
        initRevenueChart: function() {
            const canvas = document.getElementById('boaRevenueChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            
            const revenueData = window.boaRevenueData || {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                data: [125000, 135000, 142000, 158000, 165000, 175000]
            };

            this.charts.revenue = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: revenueData.labels,
                    datasets: [{
                        label: 'Revenue',
                        data: revenueData.data,
                        borderColor: this.config.chartColors.blue,
                        backgroundColor: this.config.chartColors.blueLight,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: this.config.chartColors.blue,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 3,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    ...this.config.chartOptions,
                    plugins: {
                        ...this.config.chartOptions.plugins,
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#6b7280',
                                font: { size: 12 },
                                callback: function(value) {
                                    return 'PKR ' + (value/1000).toFixed(0) + 'K';
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#6b7280',
                                font: { size: 12 }
                            }
                        }
                    },
                    animation: {
                        duration: 1200,
                        easing: 'easeOutQuart'
                    }
                }
            });
        },

        // Course Income Chart
        initCourseIncomeChart: function() {
            const canvas = document.getElementById('boaCourseIncomeChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            
            const courseIncomeData = window.boaCourseIncomeData || {
                labels: ['Web Development', 'Data Science', 'Mobile Dev', 'UI/UX Design'],
                data: [5200000, 4100000, 3200000, 2800000]
            };

            this.charts.courseIncome = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: courseIncomeData.labels,
                    datasets: [{
                        data: courseIncomeData.data,
                        backgroundColor: [
                            this.config.chartColors.blue,
                            this.config.chartColors.green,
                            this.config.chartColors.orange,
                            this.config.chartColors.purple,
                            this.config.chartColors.teal
                        ],
                        borderColor: '#fff',
                        borderWidth: 3,
                        hoverOffset: 8
                    }]
                },
                options: {
                    ...this.config.chartOptions,
                    scales: {},
                    plugins: {
                        ...this.config.chartOptions.plugins,
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 24,
                                usePointStyle: true,
                                font: {
                                    size: 13,
                                    family: 'Inter, sans-serif'
                                }
                            }
                        }
                    },
                    animation: {
                        animateRotate: true,
                        duration: 1500
                    }
                }
            });
        },

        // Initialize additional charts
        initAdditionalCharts: function() {
            // Add more charts as needed
            this.initFeeStatusChart();
            this.initStudentProgressChart();
        },

        // Fee Status Chart
        initFeeStatusChart: function() {
            const canvas = document.getElementById('boaFeeStatusChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Paid', 'Pending', 'Overdue'],
                    datasets: [{
                        data: [65, 25, 10],
                        backgroundColor: [
                            this.config.chartColors.green,
                            this.config.chartColors.orange,
                            this.config.chartColors.red
                        ],
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { padding: 20 }
                        }
                    }
                }
            });
        },

        // Student Progress Chart
        initStudentProgressChart: function() {
            const canvas = document.getElementById('boaStudentProgressChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Attendance', 'Assignments', 'Projects', 'Exams', 'Participation'],
                    datasets: [{
                        label: 'Current Month',
                        data: [85, 78, 92, 88, 76],
                        borderColor: this.config.chartColors.blue,
                        backgroundColor: this.config.chartColors.blueLight,
                        pointBackgroundColor: this.config.chartColors.blue
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: 'rgba(0,0,0,0.1)' }
                        }
                    }
                }
            });
        },

        // Initialize Animations
        initAnimations: function() {
            // Animate cards on load
            this.animateCardsOnLoad();
            
            // Counter animations
            this.animateCounters();
            
            // Progress bar animations
            this.animateProgressBars();
        },

        // Animate cards on load
        animateCardsOnLoad: function() {
            const cards = document.querySelectorAll('.boa-card');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                    }
                });
            }, { threshold: 0.1 });

            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.6s ease';
                observer.observe(card);
            });
        },

        // Animate counters
        animateCounters: function() {
            const counters = document.querySelectorAll('.boa-summary-number');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => {
                observer.observe(counter);
            });
        },

        // Animate individual counter
        animateCounter: function(element) {
            const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                const originalText = element.textContent;
                const unit = originalText.match(/[KM]/)?.[0] || '';
                element.textContent = Math.floor(current).toLocaleString() + unit;
            }, 16);
        },

        // Animate progress bars
        animateProgressBars: function() {
            const progressBars = document.querySelectorAll('.boa-progress-bar');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        const width = bar.dataset.width || 0;
                        bar.style.width = width + '%';
                    }
                });
            });

            progressBars.forEach(bar => {
                bar.style.width = '0%';
                observer.observe(bar);
            });
        },

        // Initialize Interactions
        initInteractions: function() {
            this.initCardHoverEffects();
            this.initButtonEffects();
            this.initTableInteractions();
            this.initModalHandlers();
        },

        // Card hover effects
        initCardHoverEffects: function() {
            const cards = document.querySelectorAll('.boa-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', this.handleCardHover.bind(this));
                card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            });
        },

        handleCardHover: function(event) {
            const card = event.currentTarget;
            card.style.transform = 'translateY(-4px) scale(1.02)';
            card.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
        },

        handleCardLeave: function(event) {
            const card = event.currentTarget;
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        },

        // Button effects
        initButtonEffects: function() {
            const buttons = document.querySelectorAll('.boa-action-btn');
            
            buttons.forEach(button => {
                button.addEventListener('click', this.handleButtonClick.bind(this));
                button.addEventListener('mouseenter', this.handleButtonHover.bind(this));
            });
        },

        handleButtonClick: function(event) {
            const button = event.currentTarget;
            const ripple = document.createElement('span');
            ripple.className = 'boa-ripple';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = event.clientX - rect.left - size/2 + 'px';
            ripple.style.top = event.clientY - rect.top - size/2 + 'px';
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        },

        handleButtonHover: function(event) {
            const button = event.currentTarget;
            if (button.classList.contains('boa-btn-primary')) {
                button.style.transform = 'translateY(-2px)';
            }
        },

        // Table interactions
        initTableInteractions: function() {
            const tableRows = document.querySelectorAll('.boa-data-table tr');
            
            tableRows.forEach(row => {
                row.addEventListener('mouseenter', () => {
                    row.style.background = '#f8fafc';
                });
                
                row.addEventListener('mouseleave', () => {
                    row.style.background = '';
                });
            });
        },

        // Modal handlers
        initModalHandlers: function() {
            // Add modal functionality as needed
            this.initQuickActionModals();
        },

        initQuickActionModals: function() {
            // Implementation for quick action modals
        },

        // Initialize Mobile Features
        initMobileFeatures: function() {
            this.initMobileSidebar();
            this.initMobileGestures();
            this.initResponsiveCharts();
        },

        initMobileSidebar: function() {
            if (window.innerWidth <= 1200) {
                this.createMobileSidebarToggle();
            }
            
            window.addEventListener('resize', () => {
                if (window.innerWidth <= 1200) {
                    this.createMobileSidebarToggle();
                } else {
                    this.removeMobileSidebarToggle();
                }
            });
        },

        createMobileSidebarToggle: function() {
            if (document.querySelector('.boa-mobile-toggle')) return;
            
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'boa-mobile-toggle boa-action-btn boa-btn-secondary';
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            toggleBtn.style.cssText = `
                position: fixed;
                top: 40px;
                left: 20px;
                z-index: 1000;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            toggleBtn.addEventListener('click', this.toggleMobileSidebar.bind(this));
            document.body.appendChild(toggleBtn);
        },

        removeMobileSidebarToggle: function() {
            const toggle = document.querySelector('.boa-mobile-toggle');
            if (toggle) toggle.remove();
        },

        toggleMobileSidebar: function() {
            const sidebar = document.querySelector('.boa-sidebar');
            if (sidebar) {
                const isVisible = sidebar.style.transform !== 'translateX(-100%)';
                sidebar.style.transform = isVisible ? 'translateX(-100%)' : 'translateX(0)';
            }
        },

        // Mobile gestures
        initMobileGestures: function() {
            if (!this.isMobile()) return;
            
            let startX, startY;
            
            document.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });
            
            document.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const deltaX = endX - startX;
                const deltaY = endY - startY;
                
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                    if (deltaX > 0 && startX < 50) {
                        this.toggleMobileSidebar();
                    }
                }
            });
        },

        // Responsive charts
        initResponsiveCharts: function() {
            window.addEventListener('resize', () => {
                Object.values(this.charts).forEach(chart => {
                    if (chart && chart.resize) {
                        chart.resize();
                    }
                });
            });
        },

        // Initialize Real-time Updates
        initRealTimeUpdates: function() {
            this.initLiveDataUpdates();
            this.initNotificationSystem();
        },

        initLiveDataUpdates: function() {
            // Update charts every 30 seconds
            setInterval(() => {
                this.updateCharts();
            }, 30000);
        },

        updateCharts: function() {
            // Fetch new data and update charts
            fetch(ajaxurl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=boa_update_dashboard_data'
            })
            .then(response => response.json())
            .then(data => {
                this.updateChartData(data);
            })
            .catch(error => console.error('Error updating dashboard:', error));
        },

        updateChartData: function(data) {
            // Update chart datasets with new data
            Object.keys(data).forEach(chartName => {
                if (this.charts[chartName] && data[chartName]) {
                    this.charts[chartName].data = data[chartName];
                    this.charts[chartName].update('none');
                }
            });
        },

        // Notification system
        initNotificationSystem: function() {
            this.notifications = [];
            this.createNotificationContainer();
        },

        createNotificationContainer: function() {
            const container = document.createElement('div');
            container.id = 'boa-notifications';
            container.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        },

        showNotification: function(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `boa-notification boa-notification-${type}`;
            notification.style.cssText = `
                background: white;
                border-left: 4px solid #3b82f6;
                padding: 16px;
                margin-bottom: 10px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                    <span>${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            document.getElementById('boa-notifications').appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        },

        getNotificationIcon: function(type) {
            const icons = {
                success: 'check-circle',
                error: 'exclamation-circle',
                warning: 'exclamation-triangle',
                info: 'info-circle'
            };
            return icons[type] || icons.info;
        },

        // Utility methods
        isMobile: function() {
            return window.innerWidth <= 768;
        },

        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Public API
        api: {
            refreshCharts: function() {
                BOA_Dashboard.updateCharts();
            },
            showNotification: function(message, type) {
                BOA_Dashboard.showNotification(message, type);
            },
            resizeCharts: function() {
                Object.values(BOA_Dashboard.charts).forEach(chart => {
                    if (chart && chart.resize) {
                        chart.resize();
                    }
                });
            }
        }
    };

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .boa-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .boa-summary-card:hover .boa-card-icon {
            transform: scale(1.1) rotate(5deg);
        }
        
        .boa-notification {
            backdrop-filter: blur(10px);
        }
    `;
    document.head.appendChild(style);

    // Initialize dashboard
    BOA_Dashboard.init();

    // Expose to global scope
    window.BOA_Dashboard = BOA_Dashboard;

    // Debug info
    if (typeof console !== 'undefined') {
        console.log('BOA Dashboard: JavaScript loaded successfully');
        console.log('Available API:', Object.keys(BOA_Dashboard.api));
    }

})();