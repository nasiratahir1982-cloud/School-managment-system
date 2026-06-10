<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Centralised payment gateway management for JazzCash, EasyPaisa, and future providers.
 */
class BOA_Payments {

    const GATEWAY_JAZZCASH = 'jazzcash';
    const GATEWAY_EASYPAISA = 'easypaisa';

    /**
     * Initialise payment utilities.
     */
    public static function init() {
        add_action( 'init', array( __CLASS__, 'maybe_handle_webhook' ) );
    }

    /**
     * Kick-off a payment for the requested gateway.
     *
     * @param string $gateway
     * @param array  $fee      Fee record (array)
     * @param array  $student  Student record (array)
     * @return array|WP_Error
     */
    public static function initiate_payment( $gateway, $fee, $student ) {
        switch ( $gateway ) {
            case self::GATEWAY_JAZZCASH:
                return self::initiate_jazzcash( $fee, $student );

            case self::GATEWAY_EASYPAISA:
                return self::initiate_easypaisa( $fee, $student );

            default:
                return new WP_Error( 'invalid_gateway', __( 'Unsupported payment gateway.', 'baba-online-academy' ) );
        }
    }

    /**
     * Build webhook URL for each provider.
     */
    private static function get_webhook_url( $gateway ) {
        return add_query_arg(
            array(
                'boa-payment-webhook' => $gateway,
            ),
            home_url( '/' )
        );
    }

    /**
     * Handle JazzCash initiation: create hash, log transaction, return POST form info.
     */
    private static function initiate_jazzcash( $fee, $student ) {
        $settings = BOA_DB::get_settings();
        if ( empty( $settings['jazzcash_enabled'] ) || $settings['jazzcash_enabled'] !== 'on' ) {
            return new WP_Error( 'gateway_disabled', __( 'JazzCash gateway is disabled.', 'baba-online-academy' ) );
        }

        $required_keys = array( 'jazzcash_merchant_id', 'jazzcash_password', 'jazzcash_integrity_salt', 'jazzcash_return_url' );
        foreach ( $required_keys as $key ) {
            if ( empty( $settings[ $key ] ) ) {
                return new WP_Error( 'missing_gateway_settings', __( 'JazzCash credentials are not configured.', 'baba-online-academy' ) );
            }
        }

        $amount_due = max( 0, (float) $fee['amount_due'] - (float) $fee['amount_paid'] );
        if ( $amount_due <= 0 ) {
            return new WP_Error( 'no_due_amount', __( 'There is no outstanding balance for this invoice.', 'baba-online-academy' ) );
        }

        $txn_reference = 'JC' . gmdate( 'YmdHis' ) . absint( $fee['fee_id'] );
        $amount_paisa  = str_pad( (string) round( $amount_due * 100 ), 12, '0', STR_PAD_LEFT );
        $date_time     = gmdate( 'YmdHis' );
        $expiry        = gmdate( 'YmdHis', strtotime( '+1 day' ) );

        $payload = array(
            'pp_Version'           => '1.1',
            'pp_TxnType'           => 'MWALLET',
            'pp_Language'          => 'EN',
            'pp_MerchantID'        => trim( $settings['jazzcash_merchant_id'] ),
            'pp_SubMerchantID'     => '',
            'pp_Password'          => trim( $settings['jazzcash_password'] ),
            'pp_TxnRefNo'          => $txn_reference,
            'pp_Amount'            => $amount_paisa,
            'pp_TxnCurrency'       => 'PKR',
            'pp_TxnDateTime'       => $date_time,
            'pp_BillReference'     => $fee['invoice_id'],
            'pp_Description'       => sprintf( 'Fee payment for %s', $student['name'] ),
            'pp_ReturnURL'         => $settings['jazzcash_return_url'] ?: self::get_webhook_url( self::GATEWAY_JAZZCASH ),
            'pp_SecureHash'        => '',
            'ppmpf_1'              => $student['email'],
            'ppmpf_2'              => (string) $student['phone'],
            'ppmpf_3'              => (string) $fee['fee_id'],
            'ppmpf_4'              => '',
            'ppmpf_5'              => '',
        );

        $payload['pp_SecureHash'] = self::generate_jazzcash_hash( $payload, $settings['jazzcash_integrity_salt'] );

        self::log_transaction(
            array(
                'fee_id'                => $fee['fee_id'],
                'student_id'            => $student['student_id'],
                'gateway'               => self::GATEWAY_JAZZCASH,
                'reference'             => $txn_reference,
                'amount'                => $amount_due,
                'request_payload'       => $payload,
                'status'                => 'initiated',
            )
        );

        return array(
            'mode'      => 'form_post',
            'endpoint'  => 'https://payments.jazzcash.com.pk/ApplicationAPI/API/2.0/Purchase/Purchase.do',
            'fields'    => $payload,
            'gateway'   => self::GATEWAY_JAZZCASH,
            'reference' => $txn_reference,
        );
    }

    /**
     * Handle EasyPaisa initiation by returning redirect URL.
     */
    private static function initiate_easypaisa( $fee, $student ) {
        $settings = BOA_DB::get_settings();
        if ( empty( $settings['easypaisa_enabled'] ) || $settings['easypaisa_enabled'] !== 'on' ) {
            return new WP_Error( 'gateway_disabled', __( 'EasyPaisa gateway is disabled.', 'baba-online-academy' ) );
        }

        $required_keys = array( 'easypaisa_store_id', 'easypaisa_hash_key', 'easypaisa_username', 'easypaisa_password', 'easypaisa_return_url' );
        foreach ( $required_keys as $key ) {
            if ( empty( $settings[ $key ] ) ) {
                return new WP_Error( 'missing_gateway_settings', __( 'EasyPaisa credentials are not configured.', 'baba-online-academy' ) );
            }
        }

        $amount_due = max( 0, (float) $fee['amount_due'] - (float) $fee['amount_paid'] );
        if ( $amount_due <= 0 ) {
            return new WP_Error( 'no_due_amount', __( 'There is no outstanding balance for this invoice.', 'baba-online-academy' ) );
        }

        $txn_reference = 'EP' . gmdate( 'YmdHis' ) . absint( $fee['fee_id'] );
        $expiry_time   = gmdate( 'Y-m-d\TH:i:s\Z', time() + HOUR_IN_SECONDS );

        $payload = array(
            'storeId'     => trim( $settings['easypaisa_store_id'] ),
            'amount'      => number_format( $amount_due, 2, '.', '' ),
            'orderId'     => $txn_reference,
            'postBackURL' => $settings['easypaisa_return_url'] ?: self::get_webhook_url( self::GATEWAY_EASYPAISA ),
            'expiry'      => $expiry_time,
            'autoRedirect'=> true,
            'emailAddr'   => $student['email'],
            'mobileNum'   => preg_replace( '/[^0-9]/', '', $student['phone'] ?? '' ),
        );

        $payload['requestHash'] = self::generate_easypaisa_hash( $payload, $settings['easypaisa_hash_key'] );

        $endpoint = 'https://easypay.easypaisa.com.pk/easypay-service/rest/v4/initiateMerchantTransaction';
        $response = wp_remote_post(
            $endpoint,
            array(
                'headers' => array(
                    'Content-Type'  => 'application/json',
                    'Authorization' => 'Basic ' . base64_encode( $settings['easypaisa_username'] . ':' . $settings['easypaisa_password'] ),
                ),
                'body'    => wp_json_encode( $payload ),
                'timeout' => 30,
            )
        );

        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $body = json_decode( wp_remote_retrieve_body( $response ), true );
        if ( empty( $body['paymentSession'] ) || empty( $body['redirectUrl'] ) ) {
            return new WP_Error( 'gateway_error', __( 'Unable to initiate EasyPaisa payment. Please verify credentials.', 'baba-online-academy' ) );
        }

        self::log_transaction(
            array(
                'fee_id'          => $fee['fee_id'],
                'student_id'      => $student['student_id'],
                'gateway'         => self::GATEWAY_EASYPAISA,
                'reference'       => $txn_reference,
                'amount'          => $amount_due,
                'request_payload' => $payload,
                'status'          => 'initiated',
            )
        );

        return array(
            'mode'      => 'redirect',
            'url'       => $body['redirectUrl'],
            'gateway'   => self::GATEWAY_EASYPAISA,
            'reference' => $txn_reference,
        );
    }

    /**
     * Webhook dispatcher.
     */
    public static function maybe_handle_webhook() {
        $gateway = isset( $_GET['boa-payment-webhook'] ) ? sanitize_key( $_GET['boa-payment-webhook'] ) : '';
        if ( empty( $gateway ) ) {
            return;
        }

        switch ( $gateway ) {
            case self::GATEWAY_JAZZCASH:
                self::handle_jazzcash_webhook( stripslashes_deep( $_POST ) );
                break;

            case self::GATEWAY_EASYPAISA:
                $body    = file_get_contents( 'php://input' );
                $request = json_decode( $body, true );
                if ( empty( $request ) ) {
                    $request = stripslashes_deep( $_REQUEST );
                }
                self::handle_easypaisa_webhook( $request );
                break;

            default:
                break;
        }

        status_header( 200 );
        wp_die( 'OK', '', array( 'response' => 200 ) );
    }

    private static function handle_jazzcash_webhook( $request ) {
        if ( empty( $request['pp_TxnRefNo'] ) ) {
            return;
        }

        $settings = BOA_DB::get_settings();
        if ( empty( $settings['jazzcash_integrity_salt'] ) ) {
            return;
        }

        $expected_hash = self::generate_jazzcash_hash( $request, $settings['jazzcash_integrity_salt'] );
        if ( empty( $request['pp_SecureHash'] ) || strtolower( $expected_hash ) !== strtolower( $request['pp_SecureHash'] ) ) {
            self::update_transaction_status( $request['pp_TxnRefNo'], self::GATEWAY_JAZZCASH, 'failed', $request );
            return;
        }

        $transaction = BOA_DB::get_transaction_by_reference( $request['pp_TxnRefNo'], self::GATEWAY_JAZZCASH );
        if ( ! $transaction ) {
            return;
        }

        if ( isset( $transaction['status'] ) && 'completed' === $transaction['status'] ) {
            return;
        }

        $success_codes = array( '000', '124' );
        $status        = in_array( $request['pp_ResponseCode'], $success_codes, true ) ? 'completed' : 'failed';

        self::finalize_transaction( $transaction, $request, $status );
    }

    private static function handle_easypaisa_webhook( $request ) {
        if ( empty( $request['orderId'] ) ) {
            return;
        }

        $transaction = BOA_DB::get_transaction_by_reference( $request['orderId'], self::GATEWAY_EASYPAISA );
        if ( ! $transaction ) {
            return;
        }

        if ( isset( $transaction['status'] ) && 'completed' === $transaction['status'] ) {
            return;
        }

        $status = ( isset( $request['status'] ) && 'PAID' === strtoupper( $request['status'] ) ) ? 'completed' : 'failed';
        self::finalize_transaction( $transaction, $request, $status );
    }

    /**
     * Update transaction + fee once gateway notifies.
     */
    private static function finalize_transaction( $transaction, $payload, $status ) {
        BOA_DB::update_transaction(
            $transaction['transaction_id'],
            array(
                'status'           => $status,
                'response_payload' => wp_json_encode( $payload ),
            )
        );

        if ( 'completed' !== $status ) {
            return;
        }

        $fee = BOA_DB::get_fee( $transaction['fee_id'] );
        if ( ! $fee ) {
            return;
        }

        $amount_to_record = max( (float) $fee['amount_due'], (float) $transaction['amount'] );
        BOA_DB::mark_fee_paid( $fee['fee_id'], $amount_to_record );

        $student = BOA_DB::get_student_by_id( $fee['student_id'] );
        if ( $student && class_exists( 'BOA_Notifications' ) ) {
            BOA_Notifications::send_fee_payment_email( $student, $fee );
        }
    }

    /**
     * Helper to create hash for JazzCash.
     */
    private static function generate_jazzcash_hash( $fields, $salt ) {
        $hash_string = $salt;
        ksort( $fields );
        foreach ( $fields as $key => $value ) {
            if ( 'pp_SecureHash' === $key || 'pp_SecureHashType' === $key || '' === $value || is_array( $value ) ) {
                continue;
            }
            $hash_string .= '&' . $value;
        }

        return hash_hmac( 'sha256', $hash_string, $salt );
    }

    /**
     * Helper to generate EasyPaisa hash.
     */
    private static function generate_easypaisa_hash( $fields, $secret ) {
        $sequence = sprintf(
            '%s&%s&%s&%s',
            $fields['storeId'],
            $fields['amount'],
            $fields['orderId'],
            $fields['postBackURL']
        );
        return hash_hmac( 'sha256', $sequence, $secret );
    }

    /**
     * Persist transaction entry.
     */
    private static function log_transaction( $args ) {
        BOA_DB::add_transaction(
            array(
                'fee_id'             => $args['fee_id'],
                'student_id'         => $args['student_id'],
                'gateway'            => $args['gateway'],
                'transaction_reference' => $args['reference'],
                'amount'             => $args['amount'],
                'status'             => $args['status'],
                'request_payload'    => wp_json_encode( $args['request_payload'] ),
            )
        );
    }

    /**
     * Helper to update transaction if hash mismatch.
     */
    private static function update_transaction_status( $reference, $gateway, $status, $payload ) {
        $transaction = BOA_DB::get_transaction_by_reference( $reference, $gateway );
        if ( ! $transaction ) {
            return;
        }

        BOA_DB::update_transaction(
            $transaction['transaction_id'],
            array(
                'status'           => $status,
                'response_payload' => wp_json_encode( $payload ),
            )
        );
    }
}
