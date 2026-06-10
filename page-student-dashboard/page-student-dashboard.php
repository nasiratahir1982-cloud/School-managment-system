<?php
/**
 * Student Dashboard
 */
if ( ! defined( 'ABSPATH' ) ) exit;

$current_user = wp_get_current_user();
$student_data = BOA_DB::get_student_by_wp_user_id( $current_user->ID );

if ( ! $student_data ) {
    echo '<div class="boa-error">Could not find your student profile. Please contact administration.</div>';
    return;
}
$max_upload_size = size_format( wp_max_upload_size() );


// اسٹرائپ سیٹنگز حاصل کریں
$settings = BOA_DB::get_settings();
$stripe_enabled = isset( $settings['stripe_enabled'] ) && $settings['stripe_enabled'] === 'on';
$stripe_pk = isset( $settings['stripe_publishable_key'] ) ? $settings['stripe_publishable_key'] : '';
$jazzcash_enabled = isset( $settings['jazzcash_enabled'] ) && $settings['jazzcash_enabled'] === 'on';
$easypaisa_enabled = isset( $settings['easypaisa_enabled'] ) && $settings['easypaisa_enabled'] === 'on';
$payment_nonce = wp_create_nonce( 'boa_payment_nonce' );
$active_notices = BOA_DB::get_active_notices_for_role( 'student' );
$statement_url = add_query_arg(
    array(
        'action' => 'boa_download_fee_statement',
        'nonce'  => wp_create_nonce( 'boa_download_fee_statement' ),
    ),
    admin_url( 'admin-ajax.php' )
);

if ( $stripe_enabled ) {
    wp_enqueue_script( 'stripe-js', 'https://js.stripe.com/v3/', array(), null, true );
}
?>
<script>
window.ajaxurl = window.ajaxurl || '<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>';
window.BOA_PAYMENT = window.BOA_PAYMENT || {};
window.BOA_PAYMENT.nonce = '<?php echo esc_js( $payment_nonce ); ?>';
window.BOA_PAYMENT.ajaxurl = window.ajaxurl;
</script>
<?php
?>

<div class="boa-student-dashboard">
    <div class="boa-dashboard-header">
        <h1>Welcome, <?php echo esc_html( $current_user->display_name ); ?>!</h1>
        <p>This is your student portal. Here you can manage your courses, fees, and profile.</p>
        <a href="<?php echo wp_logout_url( get_permalink() ); ?>" class="boa-btn boa-btn-secondary">Logout</a>
    </div>

    <?php if ( ! empty( $active_notices ) ) : ?>
        <div class="boa-student-notice-board">
            <h3><?php esc_html_e( 'Notice Board', 'baba-online-academy' ); ?></h3>
            <ul>
                <?php foreach ( $active_notices as $notice ) : ?>
                    <li>
                        <div class="boa-notice-meta">
                            <span class="boa-notice-priority boa-priority-<?php echo esc_attr( $notice['priority'] ); ?>">
                                <?php echo esc_html( ucfirst( $notice['priority'] ) ); ?>
                            </span>
                            <?php if ( ! empty( $notice['start_date'] ) ) : ?>
                                <span class="boa-notice-date">
                                    <?php echo esc_html( date_i18n( 'd M, Y', strtotime( $notice['start_date'] ) ) ); ?>
                                </span>
                            <?php endif; ?>
                        </div>
                        <strong><?php echo esc_html( $notice['title'] ); ?></strong>
                        <p><?php echo wp_kses_post( wpautop( $notice['message'] ) ); ?></p>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <div class="boa-dashboard-content">
        <div class="boa-dashboard-tabs">
            <button class="boa-tab-link active" onclick="openTab(event, 'profile')">My Profile</button>
            <button class="boa-tab-link" onclick="openTab(event, 'courses')">My Courses</button>
            <button class="boa-tab-link" onclick="openTab(event, 'fees')">Fee History</button>
            <button class="boa-tab-link" onclick="openTab(event, 'quizzes')"><?php esc_html_e( 'Quizzes', 'baba-online-academy' ); ?></button>
            <button class="boa-tab-link" onclick="openTab(event, 'assignments')"><?php esc_html_e( 'Assignments', 'baba-online-academy' ); ?></button>
            <button class="boa-tab-link" onclick="openTab(event, 'materials')">Course Materials</button>
            <button class="boa-tab-link" onclick="openTab(event, 'live')">Live Classes</button>
        </div>

        <div id="profile" class="boa-tab-content" style="display: block;">
            <h2>My Profile</h2>
            <p><strong>Student ID:</strong> <?php echo esc_html( $student_data['student_uid'] ); ?></p>
            <p><strong>Name:</strong> <?php echo esc_html( $student_data['name'] ); ?></p>
            <p><strong>Email:</strong> <?php echo esc_html( $student_data['email'] ); ?></p>
            <p><strong>Phone:</strong> <?php echo esc_html( $student_data['phone'] ); ?></p>
            <p><strong>Admission Date:</strong> <?php echo esc_html( $student_data['admission_date'] ); ?></p>
            <?php if ( ! empty( $student_data['certificate_url'] ) ) : ?>
                <p><strong><?php esc_html_e( 'Certificate', 'baba-online-academy' ); ?>:</strong>
                    <a href="<?php echo esc_url( $student_data['certificate_url'] ); ?>" class="boa-btn boa-btn-sm" target="_blank" rel="noopener noreferrer">
                        <?php esc_html_e( 'Download Certificate', 'baba-online-academy' ); ?>
                    </a>
                </p>
            <?php endif; ?>
        </div>

        <div id="courses" class="boa-tab-content">
            <h2>My Courses</h2>
            <?php
            $enrolled_courses = BOA_DB::get_courses_by_student_id( $student_data['student_id'] );
            if ( ! empty( $enrolled_courses ) ) :
            ?>
                <table class="boa-data-table">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Duration</th>
                            <th>Start Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ( $enrolled_courses as $course ) : ?>
                            <tr>
                                <td><?php echo esc_html( $course['course_name'] ); ?></td>
                                <td><?php echo esc_html( $course['duration'] ); ?></td>
                                <td><?php echo esc_html( $course['start_date'] ? date( 'd M, Y', strtotime( $course['start_date'] ) ) : 'N/A' ); ?></td>
                                <td><span class="boa-status-badge boa-status-<?php echo esc_attr( $student_data['status'] ); ?>"><?php echo esc_html( ucfirst( $student_data['status'] ) ); ?></span></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else : ?>
                <p>You are not enrolled in any courses yet.</p>
            <?php endif; ?>
        </div>

        <div id="fees" class="boa-tab-content">
            <div class="boa-tab-heading">
                <h2>Fee History</h2>
                <a href="<?php echo esc_url( $statement_url ); ?>" class="boa-btn boa-btn-secondary" target="_blank" rel="noopener noreferrer">
                    <?php esc_html_e( 'Download Statement', 'baba-online-academy' ); ?>
                </a>
            </div>
            <?php
            $fee_history = BOA_DB::get_fees_by_student_id( $student_data['student_id'] );
            $receipt_map = array();
            if ( ! empty( $fee_history ) ) {
                $fee_ids = wp_list_pluck( $fee_history, 'fee_id' );
                $receipt_map = ! empty( $fee_ids ) ? BOA_DB::get_fee_receipts_map( $fee_ids ) : array();
            }
            if ( ! empty( $fee_history ) ) :
            ?>
                <table class="boa-data-table">
                    <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Course</th>
                            <th>Amount Due</th>
                            <th>Amount Paid</th>
                            <th>Status</th>
                            <th>Payment Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ( $fee_history as $fee ) : 
                            $amount_to_pay = $fee['amount_due'] - $fee['amount_paid'];
                            ?>
                            <tr>
                                <td><?php echo esc_html( $fee['invoice_id'] ); ?></td>
                                <td><?php echo esc_html( $fee['course_name'] ); ?></td>
                                <td><?php echo boa_format_currency( $fee['amount_due'] ); ?></td>
                                <td><?php echo boa_format_currency( $fee['amount_paid'] ); ?></td>
                                <td><span class="boa-status-badge boa-status-<?php echo esc_attr( $fee['status'] ); ?>"><?php echo esc_html( ucfirst( $fee['status'] ) ); ?></span></td>
                                <td><?php echo esc_html( $fee['payment_date'] ? date( 'd M, Y', strtotime( $fee['payment_date'] ) ) : 'N/A' ); ?></td>
                                <td class="boa-fee-actions">
                                    <?php if ( $fee['status'] === 'paid' ) : ?>
                                        <?php if ( ! empty( $receipt_map[ $fee['fee_id'] ] ) ) : ?>
                                            <div class="boa-receipt-list">
                                                <?php foreach ( $receipt_map[ $fee['fee_id'] ] as $index => $receipt ) : ?>
                                                    <a href="<?php echo esc_url( $receipt['file_url'] ); ?>" class="boa-btn boa-btn-sm" target="_blank" rel="noopener noreferrer">
                                                        <?php echo esc_html( ! empty( $receipt['file_name'] ) ? $receipt['file_name'] : sprintf( __( 'Receipt %d', 'baba-online-academy' ), $index + 1 ) ); ?>
                                                    </a>
                                                <?php endforeach; ?>
                                            </div>
                                        <?php elseif ( ! empty( $fee['receipt_url'] ) ) : ?>
                                            <a href="<?php echo esc_url( $fee['receipt_url'] ); ?>" target="_blank" rel="noopener noreferrer" class="boa-btn boa-btn-sm">
                                                <?php esc_html_e( 'Download Receipt', 'baba-online-academy' ); ?>
                                            </a>
                                        <?php else : ?>
                                            <span class="boa-muted"><?php esc_html_e( 'Receipt not uploaded yet.', 'baba-online-academy' ); ?></span>
                                        <?php endif; ?>
                                    <?php elseif ( $fee['status'] === 'pending' ) : ?>
                                        <?php
                                        $actions_rendered = false;
                                        if ( $stripe_enabled && $amount_to_pay > 0 ) :
                                            $actions_rendered = true;
                                            ?>
                                            <button class="boa-btn boa-btn-sm boa-btn-primary" 
                                                    onclick="BOA_PayWithStripe(this)"
                                                    data-fee-id="<?php echo esc_attr( $fee['fee_id'] ); ?>"
                                                    data-amount="<?php echo esc_attr( $amount_to_pay * 100 ); ?>"
                                                    data-email="<?php echo esc_attr( $student_data['email'] ); ?>"
                                                    data-key="<?php echo esc_attr( $stripe_pk ); ?>">
                                                <?php esc_html_e( 'Pay with Card', 'baba-online-academy' ); ?>
                                            </button>
                                        <?php
                                        endif;

                                        if ( $jazzcash_enabled ) :
                                            $actions_rendered = true;
                                            ?>
                                            <button class="boa-btn boa-btn-sm boa-btn-outline" 
                                                    data-gateway="jazzcash"
                                                    data-fee-id="<?php echo esc_attr( $fee['fee_id'] ); ?>"
                                                    onclick="BOA_InitiateGatewayPayment(this)">
                                                <?php esc_html_e( 'Pay via JazzCash', 'baba-online-academy' ); ?>
                                            </button>
                                        <?php
                                        endif;

                                        if ( $easypaisa_enabled ) :
                                            $actions_rendered = true;
                                            ?>
                                            <button class="boa-btn boa-btn-sm boa-btn-outline" 
                                                    data-gateway="easypaisa"
                                                    data-fee-id="<?php echo esc_attr( $fee['fee_id'] ); ?>"
                                                    onclick="BOA_InitiateGatewayPayment(this)">
                                                <?php esc_html_e( 'Pay via EasyPaisa', 'baba-online-academy' ); ?>
                                            </button>
                                        <?php endif; ?>

                                        <?php if ( ! $actions_rendered ) : ?>
                                            <span class="boa-muted"><?php esc_html_e( 'No online gateways are enabled. Please contact administration.', 'baba-online-academy' ); ?></span>
                                        <?php endif; ?>
                                    <?php else : ?>
                                        <span class="boa-muted"><?php esc_html_e( 'No actions available.', 'baba-online-academy' ); ?></span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else : ?>
                <p>No fee history found.</p>
            <?php endif; ?>
        </div>

        <div id="quizzes" class="boa-tab-content">
            <div class="boa-tab-section-header">
                <div>
                    <h2><?php esc_html_e( 'Quizzes', 'baba-online-academy' ); ?></h2>
                    <p class="boa-muted"><?php esc_html_e( 'Attempt quizzes assigned to your course and track your latest scores.', 'baba-online-academy' ); ?></p>
                </div>
                <button type="button" class="boa-btn boa-btn-secondary" id="boa-refresh-student-quizzes">
                    <span class="dashicons dashicons-update"></span>
                    <?php esc_html_e( 'Refresh', 'baba-online-academy' ); ?>
                </button>
            </div>
            <div id="boa-student-quizzes" class="boa-quiz-list">
                <div class="boa-empty-state"><?php esc_html_e( 'Published quizzes will appear here.', 'baba-online-academy' ); ?></div>
            </div>
            <div id="boa-quiz-attempt-wrapper" class="boa-quiz-attempt" style="display:none;">
                <div class="boa-quiz-attempt-bar">
                    <button type="button" class="boa-btn boa-btn-secondary" id="boa-quiz-back"><?php esc_html_e( 'Back to quizzes', 'baba-online-academy' ); ?></button>
                    <div id="boa-quiz-meta" class="boa-quiz-meta"></div>
                </div>
                <form id="boa-quiz-attempt-form">
                    <p class="boa-muted"><?php esc_html_e( 'Once you submit an attempt it will be recorded instantly.', 'baba-online-academy' ); ?></p>
                    <div id="boa-quiz-questions"></div>
                    <div class="boa-form-actions">
                        <button type="submit" class="boa-btn boa-btn-primary"><?php esc_html_e( 'Submit Quiz', 'baba-online-academy' ); ?></button>
                    </div>
                </form>
                <div id="boa-quiz-result" class="boa-inline-alert" style="display:none;"></div>
            </div>
        </div>

        <div id="assignments" class="boa-tab-content">
            <div class="boa-tab-section-header">
                <div>
                    <h2><?php esc_html_e( 'Assignments', 'baba-online-academy' ); ?></h2>
                    <p class="boa-muted"><?php esc_html_e( 'Download the brief, complete your work and upload the file before the due date.', 'baba-online-academy' ); ?></p>
                </div>
                <button type="button" class="boa-btn boa-btn-secondary" id="boa-refresh-student-assignments">
                    <span class="dashicons dashicons-update"></span>
                    <?php esc_html_e( 'Refresh', 'baba-online-academy' ); ?>
                </button>
            </div>
            <div id="boa-student-assignments" class="boa-assignment-list">
                <div class="boa-empty-state"><?php esc_html_e( 'Assignments for your enrolled courses will show up here.', 'baba-online-academy' ); ?></div>
            </div>
            <input type="file" id="boa-assignment-file" name="submission_file" accept=".pdf,.doc,.docx,image/*" style="display:none;">
            <p class="boa-upload-note">
                <?php printf( esc_html__( 'Maximum upload size: %s per file.', 'baba-online-academy' ), esc_html( $max_upload_size ) ); ?>
            </p>
        </div>
        <div id="materials" class="boa-tab-content">
            <h2>Course Materials</h2>
            <?php
            $course_materials = BOA_DB::get_materials_by_student_id( $student_data['student_id'] );
            if ( ! empty( $course_materials ) ) :
                foreach ( $course_materials as $course_name => $materials ) :
            ?>
                    <div class="boa-course-material-group">
                        <h3><?php echo esc_html( $course_name ); ?></h3>
                        <ul class="boa-material-list">
                            <?php foreach ( $materials as $material ) : ?>
                                <li>
                                    <a href="<?php echo esc_url( $material['content_url'] ); ?>" target="_blank" rel="noopener noreferrer">
                                        <span class="dashicons dashicons-admin-media"></span>
                                        <?php echo esc_html( $material['title'] ); ?>
                                    </a>
                                    <p class="boa-material-description"><?php echo esc_html( $material['description'] ); ?></p>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php
                endforeach;
            else :
            ?>
                <p>No course materials found for your enrolled courses.</p>
            <?php endif; ?>
        </div>

        <div id="live" class="boa-tab-content">
            <h2>Live Classes</h2>
            <?php
            $live_sessions = BOA_DB::get_live_sessions_by_student_id( $student_data['student_id'] );
            if ( ! empty( $live_sessions ) ) :
            ?>
                <ul class="boa-live-sessions-list">
                    <?php foreach ( $live_sessions as $session ) : ?>
                        <li>
                            <div class="boa-session-info">
                                <strong><?php echo esc_html( $session['session_title'] ); ?></strong>
                                <span>(<?php echo esc_html( $session['course_name'] ); ?>)</span>
                                <p>Date: <?php echo esc_html( date( 'l, F j, Y, g:i A', strtotime( $session['start_time'] ) ) ); ?></p>
                            </div>
                            <a href="<?php echo esc_url( $session['join_url'] ); ?>" target="_blank" rel="noopener noreferrer" class="boa-btn boa-btn-primary">Join Class</a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php else : ?>
                <p>No upcoming live classes scheduled for your courses.</p>
            <?php endif; ?>
        </div>
    </div>
</div>




