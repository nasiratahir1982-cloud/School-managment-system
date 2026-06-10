# Payment Gateways – JazzCash & EasyPaisa (Sandbox Testing Guide)

یہ دستاویز JazzCash اور EasyPaisa کے end-to-end ٹیسٹس (sandbox) اور ویب ہُک کنفیگریشن کی مکمل ورک فلوز کو بیان کرتی ہے۔ پاکستانی گیٹ ویز کے ساتھ کام کرنے سے پہلے برائے مہربانی یہ اقدامات مکمل کریں۔

---

## 1. Prerequisites

| ضرورت | تفصیل |
|-------|-------|
| WordPress Admin Access | `Baba Online Academy` پلگ اِن کنفیگریشن کیلئے |
| HTTPS یا لوکل ٹنل | JazzCash/EasyPaisa ویب ہُک کیلئے publicly reachable URL (ngrok/Cloudflared وغیرہ) |
| Sandbox Credentials | دونوں گیٹ ویز کے test merchant IDs، passwords، salts، hash keys |
| Test Student Login | کسی فعال فیس انوائس کے ساتھ طالب علم کا اکاؤنٹ |

> **Tip:** لوکل مشین پر https کیلئے `ngrok http 80` جیسا ٹنل بنائیں اور حاصل شدہ URL کو settings میں return URL کے طور پر استعمال کریں۔

---

## 2. Configure Settings

1. ورڈپریس ایڈمن → **Baba Academy → Settings → Payment Gateways**.
2. **Stripe** سیکشن کے بعد **JazzCash** اور **EasyPaisa** فارم نظر آئیں گے۔
3. ہر گیٹ وے کیلئے درج ذیل فیلڈز بھریں:

### JazzCash Fields
| Field | Example |
|-------|---------|
| Merchant ID | `MC12345` |
| API Password | `xxxxxx` |
| Integrity Salt | `aaaaaaaaaaaaaaaa` |
| Return URL | `https://<your-tunnel>/ ?boa-payment-webhook=jazzcash` (پہلے سے prefill ہوتا ہے) |
| Toggle | **Enable JazzCash** آن کریں |

### EasyPaisa Fields
| Field | Example |
|-------|---------|
| Store ID | `EP12345` |
| Hash Key | `bbbbbbbbbbbbbbbb` |
| API Username | `testuser` |
| API Password | `testpass` |
| Return URL | `https://<your-tunnel>/?boa-payment-webhook=easypaisa` |
| Toggle | **Enable EasyPaisa** آن کریں |

4. **Save Changes** پر کلک کریں۔ JS فارم سیٹنگز کو `boa_settings_data` میں محفوظ کرے گا۔

---

## 3. JazzCash Sandbox Flow

1. طالب علم کے ڈیش بورڈ پر جائیں (student role سے لاگ اِن).  
2. **Fee History** میں کسی `pending` انوائس پر **Pay via JazzCash** بٹن دبائیں۔
3. بیک اینڈ `boa_initiate_gateway_payment` کال کرے گا:
   - `class-boa-payments.php::initiate_jazzcash()` JazzCash payload بناتا ہے۔
   - Payload hash (`pp_SecureHash`) integrity salt سے بنے گا۔
   - `boa_fee_transactions` میں نئی row درج ہو گی (status: `initiated`).
4. فرنٹ اینڈ خفیہ فارم JazzCash کے purchase endpoint پر POST کرے گا۔  
5. JazzCash test UI میں mock card/wallet credentials ڈال کر ٹرانزیکشن مکمل کریں۔
6. کامیابی کے بعد JazzCash return URL پر POST کرے گا (اسے آپ کے ngrok/HTTPS URL تک پہنچنا چاہئے):
   - `boa-payment-webhook=jazzcash` ہٹ `BOA_Payments::handle_jazzcash_webhook()` تک پہنچتی ہے۔
   - `pp_SecureHash` verify ہوتی ہے؛ response code `000` یا `124` ہو تو fee `paid`، ورنہ `failed`.
7. WP میں تصدیق:
   - `boa_fee_transactions` row کا status `completed`، response payload محفوظ۔
   - `boa_fees` میں متعلقہ invoice کی status `paid`, `payment_date` current date۔
   - طالب علم کے ڈیش بورڈ پر invoice `Paid` نظر آئے اور receipts جدول اپ ڈیٹ ہو۔

### Failure Cases
1. JazzCash test panel میں payment cancel کریں → webhook کا response code non-success (مثلاً `101`).  
2. Expected result: transaction row `failed`, fee status `pending` رہے، ڈیش بورڈ message "Unable to initiate payment" یا webhook log accessible.
3. Hash mismatch (مثلاً salt غلط ہو) → `update_transaction_status()` status = `failed`.

### Logging / Debug
| محل | تفصیل |
|-----|--------|
| `boa_fee_transactions.request_payload/response_payload` | Raw JSON دیکھیں |
| `wp-content/debug.log` (اگر WP_DEBUG_LOG آن ہو) | `error_log` entries |

---

## 4. EasyPaisa Sandbox Flow

1. طالب علم کے ڈیش بورڈ میں **Pay via EasyPaisa** بٹن دبائیں۔
2. AJAX call `BOA_Payments::initiate_easypaisa()`:
   - API request `initiateMerchantTransaction` پر جاتا ہے۔
   - Response میں `redirectUrl` + `paymentSession`.  
   - Transaction `boa_fee_transactions` میں create، status `initiated`.
3. فرنٹ اینڈ یوزر کو EasyPaisa کے hosted page پر redirect کرتا ہے۔
4. Sandbox credentials سے payment complete/abort کریں۔
5. EasyPaisa webhook JSON `orderId` کے ساتھ `?boa-payment-webhook=easypaisa` پر POST کرے گا۔
6. `handle_easypaisa_webhook()` transaction fetch کر کے status `PAID` ہونے پر fee کو `paid` سیٹ کرے گا۔

### Manual Verification
- `boa_fee_transactions` میں `gateway = easypaisa` rows چیک کریں۔  
- Success پر `status=completed`, otherwise `failed`.  
- Fees table میں `payment_date`, `amount_paid` اپڈیٹ ہو۔

### Sandbox Notes
- EasyPaisa REST API sometimes requires whitelisted IP — sandbox whitelisting کریں یا VPN استعمال کریں۔
- Hash mismatch ہونے پر gateway `"Unable to initiate EasyPaisa payment"` error دے گا؛ hash key دوبارہ چیک کریں۔

---

## 5. Webhook Configuration (Prod & Sandbox)

| Gateway | Callback URL Format | Notes |
|---------|--------------------|-------|
| JazzCash | `https://YOUR_DOMAIN/?boa-payment-webhook=jazzcash` | Merchant portal میں return URL کے طور پر add کریں |
| EasyPaisa | `https://YOUR_DOMAIN/?boa-payment-webhook=easypaisa` | Post-back URL میں یہی value دیں |

**Local Testing:**  
1. `ngrok http 80` → e.g., `https://abc123.ngrok.app`.  
2. Settings میں return URLs کو ngrok endpoint سے replace کریں۔  
3. Merchant sandbox میں بھی اسی URL کو add کریں۔

---

## 6. Database & Admin Validation Checklist

1. **boa_fee_transactions** میں ہر attempt کیلئے ایک ریکارڈ ہونا چاہیے:
   - `status`: `initiated`, `completed`, `failed`
   - `request_payload`/`response_payload` JSON میں stored
2. **boa_fees** میں:
   - `status = paid`
   - `amount_paid` پورا due
   - `payment_date` webhook کے وقت
3. **Notifications**: اگر `class-boa-notifications` فعال ہے، تو successful payment پر student کو email/SMS alert جاتا ہے۔
4. **Logs**: `debug.log` میں integration errors کو trace کریں۔

---

## 7. Troubleshooting Tips

| مسئلہ | ممکنہ حل |
|-------|----------|
| ویب ہُک receive نہیں ہو رہا | ٹنل/SSL چیک کریں، firewall کھولیے، URL merchant portal میں verify کریں |
| Hash mismatch | Integrity Salt / Hash Key دوبارہ چیک کریں، request payload سے blank values remove کریں |
| Fee status update نہیں ہو رہا | `boa_fee_transactions` میں reference/fk verify کریں، fee ID student سے match کریں |
| AJAX “Unable to initiate payment” | Settings میں toggle یا credentials missing، WP debug log دیکھیں |

---

## 8. Next Steps

- Production credentials insert کریں اور webhook URLs کو live domain پر point کریں۔
- Admin guide میں screenshots شامل کریں (optional)۔
- اگر دیگر گیٹ ویز (مثلاً PayFast) جوڑنے ہوں تو `BOA_Payments::initiate_payment()` میں نئے cases add کریں۔

کامیاب ٹیسٹنگ کے بعد پروڈکشن environment میں یہی کنفیگریشن apply کریں۔ کسی سوال کی صورت میں development log یا `error_log` سے تفصیل حاصل کریں۔ شکریہ!
