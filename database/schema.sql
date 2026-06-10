-- PostgreSQL Multi-Tenant Database DDL Schema
-- System: Academic Hub Enterprise ERP
-- Standards: UUIDs, Soft Deletes, Row-Level Security (RLS)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. COUNTRIES CONFIGURATION TABLE
-- =========================================================================
CREATE TABLE countries (
    country_code VARCHAR(10) PRIMARY KEY, -- e.g., 'PK', 'UK', 'AE', 'SA', 'US', 'CA'
    country_name VARCHAR(100) NOT NULL,
    default_currency VARCHAR(10) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,
    date_format VARCHAR(30) DEFAULT 'DD/MM/YYYY',
    time_format VARCHAR(30) DEFAULT 'HH:mm',
    timezone VARCHAR(100) DEFAULT 'UTC',
    locale VARCHAR(20) DEFAULT 'en-US',
    phone_prefix VARCHAR(10) NOT NULL,
    roll_number_label VARCHAR(50) DEFAULT 'Roll Number'
);

-- Seed defaults
INSERT INTO countries (country_code, country_name, default_currency, currency_symbol, date_format, time_format, timezone, locale, phone_prefix, roll_number_label) VALUES
('PK', 'Pakistan', 'PKR', 'Rs', 'DD/MM/YYYY', 'hh:mm A', 'Asia/Karachi', 'ur-PK', '+92', 'Roll Number'),
('UK', 'United Kingdom', 'GBP', '£', 'DD/MM/YYYY', 'HH:mm', 'Europe/London', 'en-GB', '+44', 'Candidate No'),
('AE', 'United Arab Emirates', 'AED', 'د.إ', 'DD/MM/YYYY', 'HH:mm', 'Asia/Dubai', 'ar-AE', '+971', 'Student ID'),
('SA', 'Saudi Arabia', 'SAR', '﷼', 'DD/MM/YYYY', 'HH:mm', 'Asia/Riyadh', 'ar-SA', '+966', 'Register ID'),
('US', 'United States', 'USD', '$', 'MM/DD/YYYY', 'hh:mm A', 'America/New_York', 'en-US', '+1', 'Student ID'),
('CA', 'Canada', 'CAD', '$', 'YYYY-MM-DD', 'HH:mm', 'America/Toronto', 'en-CA', '+1', 'Student ID')
ON CONFLICT (country_code) DO NOTHING;

-- =========================================================================
-- 2. ORGANIZATIONS TABLE
-- =========================================================================
CREATE TABLE organizations (
    org_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- =========================================================================
-- 3. TENANTS / SCHOOLS TABLE (Supports White Label & Localization Override)
-- =========================================================================
CREATE TABLE tenants (
    tenant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(org_id) ON DELETE SET NULL,
    school_name VARCHAR(255) NOT NULL,
    domain VARCHAR(100) UNIQUE NOT NULL,
    custom_domain VARCHAR(100) UNIQUE,
    country_code VARCHAR(10) NOT NULL REFERENCES countries(country_code),
    city VARCHAR(100) NOT NULL,
    logo_url VARCHAR(1000),
    favicon_url VARCHAR(1000),
    theme_settings JSONB DEFAULT '{"primaryHsl": "263.4 70% 50.4%", "secondaryHsl": "217.2 32.6% 16%"}'::jsonb,
    subscription_status VARCHAR(50) NOT NULL DEFAULT 'trial',
    currency_override VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_tenants_domain ON tenants(domain);
CREATE INDEX idx_tenants_org ON tenants(org_id);

-- =========================================================================
-- 4. BRANCHES TABLE
-- =========================================================================
CREATE TABLE branches (
    branch_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    branch_name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_branches_tenant ON branches(tenant_id);

-- =========================================================================
-- 5. CAMPUSES TABLE
-- =========================================================================
CREATE TABLE campuses (
    campus_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    campus_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_campuses_tenant_id ON campuses(tenant_id);
CREATE INDEX idx_campuses_branch_id ON campuses(branch_id);

-- =========================================================================
-- 6. ACADEMIC SESSIONS
-- =========================================================================
CREATE TABLE academic_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    campus_id UUID NOT NULL REFERENCES campuses(campus_id) ON DELETE CASCADE,
    session_label VARCHAR(100) NOT NULL, -- e.g. "2026-2027"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 7. DYNAMIC MODULE CONFIGURATION
-- =========================================================================
CREATE TABLE module_configurations (
    config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    transport_enabled BOOLEAN DEFAULT TRUE,
    hostel_enabled BOOLEAN DEFAULT TRUE,
    inventory_enabled BOOLEAN DEFAULT TRUE,
    library_enabled BOOLEAN DEFAULT TRUE,
    lms_enabled BOOLEAN DEFAULT TRUE,
    payroll_enabled BOOLEAN DEFAULT TRUE,
    admissions_enabled BOOLEAN DEFAULT TRUE,
    exams_enabled BOOLEAN DEFAULT TRUE,
    accounting_enabled BOOLEAN DEFAULT TRUE
);

-- =========================================================================
-- 8. USERS TABLE
-- =========================================================================
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    campus_id UUID REFERENCES campuses(campus_id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- e.g., super_admin, admin, teacher, student, parent, accountant, hr_manager, school_owner
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    two_factor_secret VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_tenant_email UNIQUE(tenant_id, email)
);

CREATE INDEX idx_users_tenant_role ON users(tenant_id, role);

-- =========================================================================
-- 9. CLASSES & SECTIONS
-- =========================================================================
CREATE TABLE classes (
    class_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    campus_id UUID NOT NULL REFERENCES campuses(campus_id) ON DELETE CASCADE,
    class_name VARCHAR(100) NOT NULL,
    section_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tenant_class_section UNIQUE(tenant_id, campus_id, class_name, section_name)
);

-- =========================================================================
-- 10. STUDENTS TABLE
-- =========================================================================
CREATE TABLE students (
    student_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    campus_id UUID NOT NULL REFERENCES campuses(campus_id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(class_id) ON DELETE SET NULL,
    admission_number VARCHAR(100) NOT NULL,
    roll_number VARCHAR(100),
    dob DATE NOT NULL,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    religion VARCHAR(50),
    address TEXT,
    emergency_contact VARCHAR(100),
    previous_school VARCHAR(255),
    admission_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_tenant_admission UNIQUE(tenant_id, admission_number)
);

CREATE INDEX idx_students_tenant_class ON students(tenant_id, class_id);

-- =========================================================================
-- 11. ATTENDANCE TABLE (PARTITIONED)
-- =========================================================================
CREATE TABLE attendance (
    attendance_id UUID DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- e.g. present, absent, late
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (attendance_id, attendance_date)
) PARTITION BY RANGE (attendance_date);

-- Example Partition
CREATE TABLE attendance_y2026m06 PARTITION OF attendance
    FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');

CREATE INDEX idx_attendance_query ON attendance(tenant_id, student_id, attendance_date);

-- =========================================================================
-- 12. FEE INVOICES & TRANSACTIONS
-- =========================================================================
CREATE TABLE fee_invoices (
    invoice_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    challan_number VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'unpaid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_challan UNIQUE(tenant_id, challan_number)
);

CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES fee_invoices(invoice_id) ON DELETE CASCADE,
    amount_paid DECIMAL(12, 2) NOT NULL,
    gateway VARCHAR(50) NOT NULL, -- stripe, easypaisa, jazzcash
    reference_number VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'completed',
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_defaulters ON fee_invoices(tenant_id, status, due_date);

-- =========================================================================
-- 13. AUDIT LOGS
-- =========================================================================
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity_affected VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_tenants ON tenants FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_campuses ON campuses FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_users ON users FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_classes ON classes FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_students ON students FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_attendance ON attendance FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_invoices ON fee_invoices FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_transactions ON transactions FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_audit_logs ON audit_logs FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

-- =========================================================================
-- 15. EXPANDED ERP SYSTEM TABLES (AI, PAYROLL, EXPENSES, TIMETABLES, GATEWAYS)
-- =========================================================================

CREATE TABLE payment_gateways (
    gateway_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    gateway_name VARCHAR(100) NOT NULL, -- stripe, paypal, razorpay, easypaisa, jazzcash
    api_key VARCHAR(500),
    api_secret VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_insights (
    insight_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL, -- academic, financial, attendance, assistant
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    predictions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payroll (
    payroll_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    basic_salary DECIMAL(12, 2) NOT NULL,
    allowances DECIMAL(12, 2) DEFAULT 0.00,
    deductions DECIMAL(12, 2) DEFAULT 0.00,
    net_salary DECIMAL(12, 2) NOT NULL,
    month VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'unpaid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    expense_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- utilities, rent, salaries, maintenance, marketing, etc.
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    expense_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE timetables (
    timetable_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(class_id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    day_of_week VARCHAR(20) NOT NULL, -- Monday, Tuesday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_allocation VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;

-- Isolation policies
CREATE POLICY tenant_isolation_gateways ON payment_gateways FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_ai ON ai_insights FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_payroll ON payroll FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_expenses ON expenses FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);
CREATE POLICY tenant_isolation_timetables ON timetables FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);

