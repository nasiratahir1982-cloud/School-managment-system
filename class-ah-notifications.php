<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Centralized notification helper for emails and SMS alerts.
 */
class BOA_Notifications {

    protected static function get_sender_details() {
        $settings = BOA_DB::get_settings();
        $from_email = ! empty( $settings['notify_sender_email'] ) ? $settings['notify_sender_email'] : get_option( 'admin_email' );
        $from_name  = ! empty( $settings['notify_sender_name'] ) ? $settings['notify_sender_name'] : get_bloginfo( 'name' );

        return array( $from_name, $from_email );
    }

    protected static function is_setting_enabled( $value, $default = false ) {
        if ( null === $value ) {
            return $default;
        }

        if ( is_bool( $value ) ) {
            return $value;
        }

        $value = strtolower( (string) $value );
        if ( in_array( $value, array( '', '0', 'false', 'off' ), true ) ) {
            return false;
        }

        return true;
    }

    public static function send_email( $to, $subject, $message ) {
        if ( empty( $to ) || empty( $subject ) || empty( $message ) ) {
            return false;
        }

        list( $from_name, $from_email ) = self::get_sender_details();
        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . sanitize_text_field( $from_name ) . ' <' . sanitize_email( $from_email ) . '>',
        );

        return wp_mail( sanitize_email( $to ), wp_strip_all_tags( $subject ), $message, $headers );
    }

    public static function send_sms( $phone, $message ) {
        $settings = BOA_DB::get_settings();
        if ( empty( $settings['sms_api_url'] ) || empty( $message ) || empty( $phone ) ) {
            return false;
        }

        $body = array(
            'api_key' => $settings['sms_api_key'] ?? '',
            'sender'  => $settings['sms_sender_id'] ?? '',
            'to'      => $phone,
            'message' => $message,
        );

        $response = wp_remote_post(
            esc_url_raw( $settings['sms_api_url'] ),
            array(
                'timeout' => 15,
                'body'    => $body,
            )
        );

        return ! is_wp_error( $response ) && wp_remote_retrieve_response_code( $response ) < 400;
    }

    public static function send_certificate_email( $student, $course_name, $certificate_url, $verification_url ) {
        if ( empty( $student['email'] ) ) {
            return;
        }

        $subject = sprintf(
            __( 'Congratulations %s! Your Certificate Is Ready', 'baba-online-academy' ),
            $student['name']
        );

        $message  = '<p>' . sprintf( __( 'Dear %s,', 'baba-online-academy' ), esc_html( $student['name'] ) ) . '</p>';
        $message .= '<p>' . sprintf(
            __( 'We are excited to let you know that your certificate for the <strong>%s</strong> course is now available.', 'baba-online-academy' ),
            esc_html( $course_name )
        ) . '</p>';
        $message .= '<p><a href="' . esc_url( $certificate_url ) . '">' . __( 'Download Certificate', 'baba-online-academy' ) . '</a></p>';
        $message .= '<p>' . __( 'You can verify the certificate anytime using the secure link below:', 'baba-online-academy' ) . '</p>';
        $message .= '<p><a href="' . esc_url( $verification_url ) . '">' . esc_html( $verification_url ) . '</a></p>';
        $message .= '<p>' . __( 'Keep learning and growing!', 'baba-online-academy' ) . '</p>';

        self::send_email( $student['email'], $subject, $message );
        if ( ! empty( $student['phone'] ) ) {
            self::send_sms(
                $student['phone'],
                sprintf( __( 'Congrats %s! Download your certificate: %s', 'baba-online-academy' ), $student['name'], $certificate_url )
            );
        }
    }

    public static function send_fee_payment_email( $student, $fee ) {
        if ( empty( $student['email'] ) ) {
            return;
        }

        $subject = __( 'Payment Received', 'baba-online-academy' );
        $message  = '<p>' . sprintf( __( 'Hello %s,', 'baba-online-academy' ), esc_html( $student['name'] ) ) . '</p>';
        $message .= '<p>' . __( 'Thank you for submitting your course fee. We have updated your account with the following details:', 'baba-online-academy' ) . '</p>';
        $message .= '<ul>';
        $message .= '<li>' . sprintf( __( 'Invoice: %s', 'baba-online-academy' ), esc_html( $fee['invoice_id'] ?? '' ) ) . '</li>';
        $message .= '<li>' . sprintf( __( 'Amount Paid: %s', 'baba-online-academy' ), boa_format_currency( $fee['amount_paid'] ?? 0 ) ) . '</li>';
        $message .= '<li>' . sprintf( __( 'Payment Date: %s', 'baba-online-academy' ), esc_html( $fee['payment_date'] ?? date_i18n( 'Y-m-d' ) ) ) . '</li>';
        $message .= '</ul>';
        $message .= '<p>' . __( 'If you have any questions, feel free to contact the academy office.', 'baba-online-academy' ) . '</p>';

        self::send_email( $student['email'], $subject, $message );
        if ( ! empty( $student['phone'] ) ) {
            self::send_sms(
                $student['phone'],
                __( 'We received your fee payment. Thank you!', 'baba-online-academy' )
            );
        }
    }

    public static function send_admission_status_email( $student, $status ) {
        if ( empty( $student['email'] ) ) {
            return;
        }

        $status_label = ucfirst( $status );
        $subject = sprintf( __( 'Admission %s', 'baba-online-academy' ), $status_label );
        $message  = '<p>' . sprintf( __( 'Hi %s,', 'baba-online-academy' ), esc_html( $student['name'] ) ) . '</p>';

        if ( 'approved' === $status ) {
            $message .= '<p>' . __( 'Great news! Your admission has been approved and your student portal account is active.', 'baba-online-academy' ) . '</p>';
        } else {
            $message .= '<p>' . __( 'Unfortunately, your admission could not be approved at this time. Please contact support for more details.', 'baba-online-academy' ) . '</p>';
        }

        self::send_email( $student['email'], $subject, $message );
    }

    public static function send_fee_overdue_reminder( $record ) {
        if ( empty( $record['email'] ) ) {
            return;
        }

        $subject = __( 'Fee Reminder', 'baba-online-academy' );
        $message  = '<p>' . sprintf( __( 'Dear %s,', 'baba-online-academy' ), esc_html( $record['student_name'] ?? '' ) ) . '</p>';
        $message .= '<p>' . __( 'Our records show that your course fee is overdue. Please submit the payment at your earliest convenience to avoid any disruption in classes.', 'baba-online-academy' ) . '</p>';
        $message .= '<ul>';
        $message .= '<li>' . sprintf( __( 'Invoice: %s', 'baba-online-academy' ), esc_html( $record['invoice_id'] ?? '' ) ) . '</li>';
        $message .= '<li>' . sprintf( __( 'Amount Due: %s', 'baba-online-academy' ), boa_format_currency( (float) ( $record['amount_due'] ?? 0 ) ) ) . '</li>';
        $message .= '<li>' . sprintf( __( 'Due Date: %s', 'baba-online-academy' ), esc_html( $record['due_date'] ?? '' ) ) . '</li>';
        $message .= '</ul>';
        $message .= '<p>' . __( 'If you have already cleared the payment, please ignore this reminder.', 'baba-online-academy' ) . '</p>';

        self::send_email( $record['email'], $subject, $message );
        if ( ! empty( $record['phone'] ) ) {
            self::send_sms(
                $record['phone'],
                __( 'Reminder: your course fee is overdue. Please pay today.', 'baba-online-academy' )
            );
        }
    }

    /**
     * Send live session join details to a student (email + SMS when available).
     */
    public static function send_live_session_notification( array $session, $course_name = '', array $student = array() ) {
        $join_url = ! empty( $session['join_url'] ) ? esc_url( $session['join_url'] ) : '';
        if ( empty( $join_url ) ) {
            return;
        }

        $course_label  = $course_name ? sanitize_text_field( $course_name ) : __( 'your course', 'baba-online-academy' );
        $session_title = ! empty( $session['session_title'] ) ? sanitize_text_field( $session['session_title'] ) : __( 'Live class', 'baba-online-academy' );
        $start_time    = ! empty( $session['start_time'] ) ? $session['start_time'] : '';
        $start_label   = $start_time ? date_i18n( 'M j, Y g:i a', strtotime( $start_time ) ) : __( 'Scheduled time', 'baba-online-academy' );

        if ( ! empty( $student['email'] ) ) {
            $subject = sprintf(
                __( 'Live class for %1$s: %2$s', 'baba-online-academy' ),
                $course_label,
                $session_title
            );

            $message  = '<p>' . sprintf( __( 'Dear %s,', 'baba-online-academy' ), esc_html( $student['name'] ?? '' ) ) . '</p>';
            $message .= '<p>' . __( 'Your live class details are below:', 'baba-online-academy' ) . '</p>';
            $message .= '<ul>';
            $message .= '<li>' . sprintf( __( 'Course: %s', 'baba-online-academy' ), esc_html( $course_label ) ) . '</li>';
            $message .= '<li>' . sprintf( __( 'Session: %s', 'baba-online-academy' ), esc_html( $session_title ) ) . '</li>';
            $message .= '<li>' . sprintf( __( 'Starts: %s', 'baba-online-academy' ), esc_html( $start_label ) ) . '</li>';
            $message .= '<li>' . sprintf( __( 'Join Link: %s', 'baba-online-academy' ), '<a href="' . esc_url( $join_url ) . '">' . esc_html( $join_url ) . '</a>' ) . '</li>';
            $message .= '</ul>';
            $message .= '<p>' . __( 'See you in class!', 'baba-online-academy' ) . '</p>';

            self::send_email( $student['email'], $subject, $message );
        }

        if ( ! empty( $student['phone'] ) ) {
            $sms_text = sprintf(
                __( 'Live class: %1$s - %2$s at %3$s. Join: %4$s', 'baba-online-academy' ),
                $course_label,
                $session_title,
                $start_label,
                $join_url
            );
            self::send_sms( $student['phone'], $sms_text );
        }
    }

    public static function send_attendance_alert( $student, $status, $date, $course_name = '', $remarks = '' ) {
        $settings = BOA_DB::get_settings();
        $email_enabled = self::is_setting_enabled( $settings['attendance_alert_email'] ?? null, true );
        $sms_enabled   = self::is_setting_enabled( $settings['attendance_alert_sms'] ?? null, false );

        if ( ( empty( $student['email'] ) || ! $email_enabled ) && ( empty( $student['phone'] ) || ! $sms_enabled ) ) {
            return;
        }

        $status_labels = array(
            'present' => __( 'present', 'baba-online-academy' ),
            'absent'  => __( 'absent', 'baba-online-academy' ),
            'late'    => __( 'late', 'baba-online-academy' ),
        );

        $status_label = $status_labels[ $status ] ?? $status;
        $course_label = $course_name ? esc_html( $course_name ) : __( 'your course', 'baba-online-academy' );
        $date_label   = $date ? esc_html( date_i18n( 'd M, Y', strtotime( $date ) ) ) : __( 'today', 'baba-online-academy' );

        if ( $email_enabled && ! empty( $student['email'] ) ) {
            $subject = sprintf(
                __( 'Attendance update for %s', 'baba-online-academy' ),
                $course_name ? $course_name : __( 'your course', 'baba-online-academy' )
            );

            $message  = '<p>' . sprintf( __( 'Hello %s,', 'baba-online-academy' ), esc_html( $student['name'] ?? '' ) ) . '</p>';
            $message .= '<p>' . sprintf(
                __( 'You have been marked <strong>%1$s</strong> for %2$s on %3$s.', 'baba-online-academy' ),
                esc_html( ucfirst( $status_label ) ),
                $course_label,
                $date_label
            ) . '</p>';

            if ( ! empty( $remarks ) ) {
                $message .= '<p>' . sprintf( __( 'Remarks: %s', 'baba-online-academy' ), esc_html( $remarks ) ) . '</p>';
            }

            $message .= '<p>' . __( 'Please contact the academy if you have any questions.', 'baba-online-academy' ) . '</p>';

            self::send_email( $student['email'], $subject, $message );
        }

        if ( $sms_enabled && ! empty( $student['phone'] ) ) {
            $sms = sprintf(
                __( '%1$s marked %2$s on %3$s.', 'baba-online-academy' ),
                $student['name'] ?? __( 'Student', 'baba-online-academy' ),
                $status_label,
                $date_label
            );
            if ( ! empty( $remarks ) ) {
                $sms .= ' ' . __( 'Remarks:', 'baba-online-academy' ) . ' ' . $remarks;
            }
            self::send_sms( $student['phone'], $sms );
        }
    }
}
