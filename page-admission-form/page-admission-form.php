<?php
// 🟢 یہاں سے Enhanced Public Admission Form PHP شروع ہو رہا ہے
if (!defined('ABSPATH')) exit;

/**
 * Enhanced Public Admission Form - Academic Hub
 * Features:
 * - Double submission prevention
 * - Receipt upload with hash verification
 * - Enhanced validation
 * - WhatsApp integration
 */

$courses_list = array();
if (class_exists('BOA_DB')) {
    $courses_data = BOA_DB::get_courses(array('per_page' => 999, 'status_filter' => 'active'));
    $courses_list = $courses_data['items'];
}

// Check for existing submission via URL parameters
$existing_submission = null;
if (isset($_GET['submission_id']) && isset($_GET['email'])) {
    if (class_exists('BOA_DB')) {
        $existing_submission = BOA_DB::get_form_submission(intval($_GET['submission_id']));
        if (!$existing_submission || $existing_submission['email'] !== sanitize_email($_GET['email'])) {
            $existing_submission = null;
        }
    }
}
?>

<div id="boa-public-form-root">
    <div class="boa-public-hero">
        <div class="boa-hero-title-wrap">
            <h1><?php esc_html_e( 'Admission Form', 'baba-online-academy' ); ?></h1>
            <span class="boa-hero-chip"><?php esc_html_e( 'Secure & Simple', 'baba-online-academy' ); ?></span>
        </div>
        <p class="boa-hero-lead"><?php esc_html_e( 'Apply in minutes—attach your receipt, pick your course, and track status anytime.', 'baba-online-academy' ); ?></p>
        <div class="boa-hero-pills">
            <span class="boa-hero-pill"><span class="dashicons dashicons-shield"></span><?php esc_html_e( 'Verified receipts', 'baba-online-academy' ); ?></span>
            <span class="boa-hero-pill"><span class="dashicons dashicons-groups"></span><?php esc_html_e( 'Active courses', 'baba-online-academy' ); ?></span>
            <span class="boa-hero-pill"><span class="dashicons dashicons-visibility"></span><?php esc_html_e( 'Track status', 'baba-online-academy' ); ?></span>
        </div>
    </div>

    <form id="boa-admission-form" class="boa-form-container" onsubmit="return BOA_PublicForm.submitForm(event)" enctype="multipart/form-data">
        
        <div class="boa-form-header">
            <h3>Online Admission Form</h3>
            <p>Please fill out the form below to start your admission process.</p>
            <?php if ($existing_submission): ?>
            <div class="boa-existing-submission-notice">
                <span class="dashicons dashicons-info"></span>
                <strong>Existing Application Found:</strong> You can modify your submission below.
            </div>
            <?php endif; ?>
        </div>

        <div id="boa-form-messages" class="boa-form-messages" style="display: none;"></div>

        <div class="boa-form-section">
            <h4>1. Personal Information</h4>
            <div class="boa-form-grid">
                <div class="boa-form-group boa-group-full">
                    <label for="boa-form-name">Full Name *</label>
                    <input type="text" id="boa-form-name" name="name" required value="<?php echo $existing_submission ? esc_attr($existing_submission['student_name']) : ''; ?>">
                </div>
                <div class="boa-form-group">
                    <label for="boa-form-email">Email Address *</label>
                    <input type="email" id="boa-form-email" name="email" required value="<?php echo $existing_submission ? esc_attr($existing_submission['email']) : ''; ?>" <?php echo $existing_submission ? 'readonly' : ''; ?>>
                    <?php if (!$existing_submission): ?>
                    <small class="boa-field-note">This email will be used to check for duplicate submissions</small>
                    <?php endif; ?>
                </div>
                <div class="boa-form-group">
                    <label for="boa-form-phone">Phone Number *</label>
                    <input type="tel" id="boa-form-phone" name="phone" required value="<?php echo $existing_submission ? esc_attr($existing_submission['phone']) : ''; ?>">
                    <small class="boa-field-note">This number will be used for WhatsApp notifications</small>
                </div>
                <div class="boa-form-group boa-group-full">
                    <label for="boa-form-city">City *</label>
                    <input type="text" id="boa-form-city" name="city" required value="<?php echo $existing_submission ? esc_attr($existing_submission['city'] ?? '') : ''; ?>">
                </div>
            </div>
        </div>

        <div class="boa-form-section">
            <h4>2. Course & Fee Details</h4>
            <div class="boa-form-grid">
                <div class="boa-form-group boa-group-full">
                    <label for="boa-form-course">Select Course *</label>
                    <select id="boa-form-course" name="course_id" required <?php echo $existing_submission ? 'disabled' : ''; ?>>
                        <option value="">-- Select a course --</option>
                        <?php if (!empty($courses_list)): ?>
                            <?php foreach ($courses_list as $course): ?>
                                <option value="<?php echo esc_attr($course['course_id']); ?>" 
                                    data-fee="<?php echo esc_attr($course['fee_amount']); ?>"
                                    <?php echo ($existing_submission && $existing_submission['course_id'] == $course['course_id']) ? 'selected' : ''; ?>>
                                    <?php echo esc_html($course['course_name']); ?>
                                </option>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </select>
                    <?php if ($existing_submission): ?>
                    <input type="hidden" name="course_id" value="<?php echo esc_attr($existing_submission['course_id']); ?>">
                    <small class="boa-field-note">Course cannot be changed after submission</small>
                    <?php endif; ?>
                </div>
                
                <div class="boa-form-group">
                    <label for="boa-form-course-fee">Course Fee</label>
                    <input type="text" id="boa-form-course-fee" name="course_fee" readonly class="boa-readonly-field" placeholder="PKR 0.00">
                </div>
                
                <div class="boa-form-group">
                    <label for="boa-form-amount-paid">Amount Paid *</label>
                    <input type="number" id="boa-form-amount-paid" name="amount_paid" required step="0.01" min="0" placeholder="e.g., 15000">
                </div>
                
                <div class="boa-form-group">
                    <label for="boa-form-remaining-fee">Remaining Balance</label>
                    <input type="text" id="boa-form-remaining-fee" name="remaining_fee" readonly class="boa-readonly-field" placeholder="PKR 0.00">
                </div>
                
                <div class="boa-form-group">
                    <label for="boa-form-next-due-date">Next Due Date *</label>
                    <input type="date" id="boa-form-next-due-date" name="next_due_date" required class="boa-date-field">
                </div>
                
            </div>
        </div>

        <div class="boa-form-section">
            <h4>3. Payment Screenshot</h4>
            <div class="boa-form-group boa-group-full">
                <label for="boa-form-screenshot">Upload Screenshot *</label>
                <p class="boa-upload-instructions">
                    <?php esc_html_e( 'Please transfer your fee to the account below and upload the screenshot.', 'baba-online-academy' ); ?>
                    <br><strong><?php esc_html_e( 'Bank', 'baba-online-academy' ); ?>:</strong> PUNJAB BANK
                    <br><strong><?php esc_html_e( 'Account Title', 'baba-online-academy' ); ?>:</strong> Academic Hub
                    <br><strong><?php esc_html_e( 'Account IBAN', 'baba-online-academy' ); ?>:</strong> PK54BPUN6020357313100012
                    <br><strong><?php esc_html_e( 'Account No', 'baba-online-academy' ); ?>:</strong> 6020357313100012
                </p>
                <input type="file" id="boa-form-screenshot" name="screenshot_files[]" accept="image/jpeg,image/png,application/pdf" multiple>
                <small>Allowed file types: JPG, PNG, PDF. Max size: 5MB. You can upload multiple receipts.</small>
                <div id="boa-uploaded-receipts" class="boa-uploaded-receipts"></div>
                <?php if ($existing_submission && $existing_submission['receipt_original_name']): ?>
                <div class="boa-existing-receipt">
                    <strong>Current Receipt:</strong> <?php echo esc_html($existing_submission['receipt_original_name']); ?>
                    <small>Upload a new file only if you want to replace it</small>
                </div>
                <?php endif; ?>
            </div>
        </div>

        <div id="boa-form-history" class="boa-form-history-panel" style="display:none;"></div>

        <?php if ($existing_submission): ?>
        <input type="hidden" name="submission_id" value="<?php echo esc_attr($existing_submission['submission_id']); ?>">
        <?php endif; ?>

        <div class="boa-form-footer">
            <button type="submit" id="boa-form-submit-btn" class="boa-submit-button">
                <?php echo $existing_submission ? 'Update Application' : 'Submit Application'; ?>
            </button>
            <div id="boa-form-loader" class="boa-loader" style="display: none;"></div>
        </div>
        
    </form>

    <template id="boa-success-message-template">
        <div class="boa-success-message">
            <span class="boa-success-icon">&#10004;</span>
            <h3>Application Submitted!</h3>
            <p>Thank you, <strong class="boa-student-name"></strong>!</p>
            <p>Your application for the <strong class="boa-course-name"></strong> course has been received and is now under review.</p>
            <p>We will contact you shortly via email or WhatsApp.</p>
            <div class="boa-tracking-info" style="display:none;">
                <p><?php esc_html_e( 'Your tracking code is:', 'baba-online-academy' ); ?> <strong class="boa-tracking-token"></strong></p>
                <p class="boa-tracking-link"></p>
            </div>
            <div class="boa-success-actions">
                <button onclick="BOA_PublicForm.resetForm()" class="boa-reset-button">Submit Another Application</button>
                <?php if ($existing_submission): ?>
                <button onclick="BOA_PublicForm.closeForm()" class="boa-close-button">Close</button>
                <?php endif; ?>
            </div>
        </div>
    </template>
    </div>

<script>
// Pre-populate form if existing submission
<?php if ($existing_submission): ?>
document.addEventListener('DOMContentLoaded', function() {
    // Set course fee
    const courseSelect = document.getElementById('boa-form-course');
    if (courseSelect.value) {
        const selectedOption = courseSelect.options[courseSelect.selectedIndex];
        const fee = selectedOption.getAttribute('data-fee');
        document.getElementById('boa-form-course-fee').value = 'PKR ' + parseFloat(fee).toLocaleString();
    }
    
    // Calculate remaining fee
    BOA_PublicForm.calculateRemaining();
    
});
<?php endif; ?>
</script>

// ✅ Syntax verified block end
