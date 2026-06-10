# Frontend Student Dashboard - User Guide

## Overview
The Frontend Student Dashboard provides students with a modern, responsive interface to view their academic progress, courses, and fees directly from your website's frontend.

## 🚀 Features

### ✅ **Modern Responsive Design**
- Beautiful gradient background with glass-morphism effects
- Mobile-responsive layout that works on all devices
- Interactive charts using Chart.js
- Smooth animations and transitions

### ✅ **Student Personalization**
- Displays student name and ID
- Personalized welcome message
- Avatar with student initial

### ✅ **Comprehensive Statistics**
- **Total Courses:** Number of enrolled courses
- **Completed Courses:** Courses successfully finished
- **In Progress Courses:** Currently active courses
- **Pending Fees:** Outstanding fee amount

### ✅ **Visual Progress Tracking**
- Interactive doughnut chart showing course completion status
- Real-time data visualization
- Color-coded progress indicators

### ✅ **Course Management**
- List of all enrolled courses
- Course status badges (Active, Completed)
- Course duration information
- Hover effects for better UX

### ✅ **Fee Tracking**
- Recent fee payments and dues
- Payment status indicators
- Due date tracking
- Amount formatting in PKR

## 📋 How to Use

### Method 1: Shortcode (Recommended)
Add this shortcode to any page or post where you want the dashboard to appear:

```
[boa_student_dashboard]
```

**Example Usage:**
1. Create a new WordPress page
2. Title it "Student Dashboard"
3. Add the shortcode `[boa_student_dashboard]` in the content
4. Publish the page
5. Students can access it via the page URL

### Method 2: Page Template
1. Upload the `student-dashboard-page-template.php` to your theme folder
2. Create a new page in WordPress
3. In Page Attributes, select "Student Dashboard" as the template
4. Students can access this dedicated dashboard page

## 🔐 Security Features

### ✅ **User Authentication**
- Only logged-in users can access the dashboard
- Automatic redirect to login if not authenticated
- Role-based access (Student role required)

### ✅ **Data Security**
- All database queries use WordPress $wpdb for security
- User data sanitization and validation
- SQL injection protection

## 📱 Mobile Responsive

The dashboard is fully responsive and includes:
- **Mobile-first design approach**
- **Touch-friendly interface**
- **Optimized charts and cards for small screens**
- **Collapsible navigation on mobile**

## 🎨 Customization

### Colors and Styling
The dashboard uses CSS custom properties for easy customization:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --card-bg: rgba(255, 255, 255, 0.95);
    --text-primary: #2d3748;
    --text-secondary: #718096;
}
```

### Adding More Statistics
You can extend the dashboard by adding more database queries in the PHP file:

```php
// Add new statistics
$new_stat = $wpdb->get_var($wpdb->prepare(
    "SELECT COUNT(*) FROM {$wpdb->prefix}boa_assignments 
     WHERE student_id = %d AND status = 'completed'",
    $student->id
));
```

## 🔧 Technical Details

### Dependencies
- **Font Awesome 6.4.0** (for icons)
- **Google Fonts - Inter** (for typography)
- **Chart.js 4.0.0** (for data visualization)

### File Structure
```
page-student-dashboard-frontend/
├── page-student-dashboard-frontend.php    # Main dashboard file
└── student-dashboard-page-template.php    # WordPress page template
```

### Database Tables Used
- `wp_boa_students` - Student information
- `wp_boa_student_course_enrollments` - Course enrollments
- `wp_boa_fees` - Fee records

## 🚀 Installation

1. **Upload Plugin Files**
   - The frontend dashboard is automatically included in the main plugin

2. **Create Dashboard Page**
   - Add `[boa_student_dashboard]` shortcode to any page
   - OR use the page template method

3. **Test Access**
   - Log in as a student
   - Navigate to the dashboard page
   - Verify all data displays correctly

## 📊 Sample Data Structure

The dashboard expects the following data structure:

### Student Record
```php
$student = [
    'id' => 1,
    'student_id' => 'BOA-001',
    'name' => 'Student Name',
    'user_id' => 123
];
```

### Course Enrollment
```php
$enrollment = [
    'course_id' => 1,
    'course_name' => 'Web Development',
    'status' => 'active', // active, completed, dropped
    'enrollment_date' => '2025-01-01'
];
```

### Fee Record
```php
$fee = [
    'amount' => 5000,
    'amount_paid' => 5000,
    'due_date' => '2025-02-01',
    'payment_status' => 'paid' // paid, pending, overdue
];
```

## 🔍 Troubleshooting

### Dashboard Not Loading
- Check if user is logged in
- Verify student record exists in database
- Check browser console for JavaScript errors

### Data Not Showing
- Ensure student is enrolled in courses
- Verify fee records exist
- Check database table names match

### Styling Issues
- Clear browser cache
- Check if Font Awesome and Google Fonts are loading
- Verify CSS is not being overridden

## 📞 Support

For technical support or customization requests:
- Contact your system administrator
- Check plugin documentation
- Review WordPress error logs

---

**Version:** 1.0  
**Compatibility:** WordPress 5.0+  
**PHP Requirements:** PHP 7.4+  
**Last Updated:** November 2025