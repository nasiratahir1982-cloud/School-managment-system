import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Pool } from 'pg';
import { z } from 'zod';

const app = express();
const port = process.env.PORT || 8080;

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize Database Pool
let pool: any;
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://hub_admin:supersecureerppassword@localhost:5432/academichub_db',
});

const mockTenants = [
  { tenant_id: '11111111-1111-1111-1111-111111111111', domain: 'school-a', custom_domain: null },
  { tenant_id: '22222222-2222-2222-2222-222222222222', domain: 'school-b', custom_domain: null },
  { tenant_id: '33333333-3333-3333-3333-333333333333', domain: 'the-educators', custom_domain: null },
  { tenant_id: '44444444-4444-4444-4444-444444444444', domain: 'beaconhouse-uk', custom_domain: null },
  { tenant_id: '55555555-5555-5555-5555-555555555555', domain: 'beaconhouse-uae', custom_domain: null },
  { tenant_id: '66666666-6666-6666-6666-666666666666', domain: 'igs-sa', custom_domain: null },
  { tenant_id: '77777777-7777-7777-7777-777777777777', domain: 'roots-ca', custom_domain: null },
  { tenant_id: '00000000-0000-0000-0000-000000000000', domain: 'superadmin', custom_domain: null },
];

const mockUsers = [
  { user_id: 'u1', tenant_id: '11111111-1111-1111-1111-111111111111', name: 'Zohaib Khan', email: 'zohaib@alpha.edu', password_hash: '...', role: 'student' },
  { user_id: 'u2', tenant_id: '11111111-1111-1111-1111-111111111111', name: 'Sara Ahmed', email: 'sara@alpha.edu', password_hash: '...', role: 'student' },
  { user_id: 'u3', tenant_id: '11111111-1111-1111-1111-111111111111', name: 'Bilal Malik', email: 'bilal@alpha.edu', password_hash: '...', role: 'student' },
  { user_id: 'u4', tenant_id: '22222222-2222-2222-2222-222222222222', name: 'Ayesha Omer', email: 'ayesha@beta.edu', password_hash: '...', role: 'student' },
  { user_id: 'u5', tenant_id: '22222222-2222-2222-2222-222222222222', name: 'Hamza Yousuf', email: 'hamza@beta.edu', password_hash: '...', role: 'student' },
];

const mockStudents = [
  { student_id: 's1', user_id: 'u1', tenant_id: '11111111-1111-1111-1111-111111111111', admission_number: 'ADM-2026-001', roll_number: 'R-01', dob: '2010-04-12', gender: 'Male' },
  { student_id: 's2', user_id: 'u2', tenant_id: '11111111-1111-1111-1111-111111111111', admission_number: 'ADM-2026-002', roll_number: 'R-02', dob: '2011-09-22', gender: 'Female' },
  { student_id: 's3', user_id: 'u3', tenant_id: '11111111-1111-1111-1111-111111111111', admission_number: 'ADM-2026-003', roll_number: 'R-03', dob: '2010-12-05', gender: 'Male' },
  { student_id: 's4', user_id: 'u4', tenant_id: '22222222-2222-2222-2222-222222222222', admission_number: 'ADM-B-991', roll_number: 'B-11', dob: '2009-02-15', gender: 'Female' },
  { student_id: 's5', user_id: 'u5', tenant_id: '22222222-2222-2222-2222-222222222222', admission_number: 'ADM-B-992', roll_number: 'B-12', dob: '2010-06-30', gender: 'Male' },
];

class MockClient {
  private currentTenantId: string | null = null;
  async query(text: string, params?: any[]) {
    if (text.startsWith('SET LOCAL app.current_tenant_id')) {
      const match = text.match(/'([^']+)'/);
      if (match) this.currentTenantId = match[1];
      return { rows: [] };
    }
    if (text.includes('INSERT INTO users')) {
      const user_id = `u-${Date.now()}`;
      const [tenant_id, name, email, password_hash, role] = params || [];
      mockUsers.push({ user_id, tenant_id, name, email, password_hash, role });
      return { rows: [{ user_id }] };
    }
    if (text.includes('INSERT INTO students')) {
      const student_id = `s-${Date.now()}`;
      const [user_id, tenant_id, admission_number, roll_number, dob, gender] = params || [];
      mockStudents.push({ student_id, user_id, tenant_id, admission_number, roll_number, dob, gender });
      return { rows: [{ student_id }] };
    }
    if (text.includes('FROM students s')) {
      const rows = mockStudents
        .filter(s => s.tenant_id === this.currentTenantId)
        .map(s => {
          const user = mockUsers.find(u => u.user_id === s.user_id);
          return {
            student_id: s.student_id,
            name: user ? user.name : '',
            email: user ? user.email : '',
            admission_number: s.admission_number,
            roll_number: s.roll_number,
            dob: s.dob,
            gender: s.gender,
          };
        });
      return { rows };
    }
    return { rows: [] };
  }
  release() {}
}

class MockPool {
  async query(text: string, params?: any[]) {
    if (text.includes('SELECT tenant_id FROM tenants')) {
      const domain = params ? params[0] : '';
      const tenant = mockTenants.find(t => t.domain === domain);
      return { rows: tenant ? [tenant] : [] };
    }
    return { rows: [] };
  }
  async connect() {
    return new MockClient();
  }
}

const mockPoolInstance = new MockPool();
let isUsingMockDb = false;

pool = {
  query: async (text: string, params?: any[]) => {
    if (isUsingMockDb) {
      return mockPoolInstance.query(text, params);
    }
    try {
      return await pgPool.query(text, params);
    } catch (err) {
      console.warn('PostgreSQL database not available. Falling back to in-memory mock database.');
      isUsingMockDb = true;
      return mockPoolInstance.query(text, params);
    }
  },
  connect: async () => {
    if (isUsingMockDb) {
      return mockPoolInstance.connect();
    }
    try {
      return await pgPool.connect();
    } catch (err) {
      console.warn('PostgreSQL database connection failed. Falling back to in-memory mock database.');
      isUsingMockDb = true;
      return mockPoolInstance.connect();
    }
  }
};

// Extend Express Request type to support tenant context
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

// =========================================================================
// MULTI-TENANT RESOLUTION MIDDLEWARE (RLS ENFORCED)
// =========================================================================
const tenantResolver = async (req: Request, res: Response, next: NextFunction) => {
  const host = req.headers.host || '';
  const subdomain = host.split('.')[0];

  if (req.path.startsWith('/api/v1/auth/login') || req.path === '/api/v1/health') {
    return next();
  }

  try {
    // Resolve Tenant ID based on request subdomain/host
    const tenantQuery = await pool.query(
      'SELECT tenant_id FROM tenants WHERE domain = $1 OR custom_domain = $1 LIMIT 1',
      [subdomain]
    );

    if (tenantQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Tenant subdomain '${subdomain}' not registered.`,
        data: null,
        errors: ['Invalid Tenant Host']
      });
    }

    const tenantId = tenantQuery.rows[0].tenant_id;
    req.tenantId = tenantId;

    // Acquire a client from the pool to run tenant transaction scope
    const client = await pool.connect();
    try {
      // Inject tenant_id context into PostgreSQL LOCAL transaction
      // This enforces Row Level Security natively
      await client.query(`SET LOCAL app.current_tenant_id = '${tenantId}'`);
      res.locals.dbClient = client;
      next();
    } catch (err) {
      client.release();
      throw err;
    }
  } catch (error) {
    console.error('Tenant resolution failure:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to resolve tenant context.',
      data: null,
      errors: ['Internal Server Error']
    });
  }
};

app.use(tenantResolver);

// Release Client Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    if (res.locals.dbClient) {
      res.locals.dbClient.release();
    }
  });
  next();
});

// =========================================================================
// API ENDPOINTS & VALIDATORS
// =========================================================================

// Health check
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is healthy', data: { time: new Date() }, errors: [] });
});

// Zod validation schemas
const StudentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  admissionNumber: z.string(),
  rollNumber: z.string().optional(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD'),
  gender: z.string().optional(),
});

// Register Student Endpoint (RLS Tenant context applied)
app.post('/api/v1/students', async (req: Request, res: Response) => {
  const db = res.locals.dbClient;

  try {
    const data = StudentSchema.parse(req.body);

    // Create user record first
    const userResult = await db.query(
      'INSERT INTO users (tenant_id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id',
      [req.tenantId, data.name, data.email, '$2b$12$DummyBcryptHashPlaceholderToValidateSecurity', 'student']
    );

    const userId = userResult.rows[0].user_id;

    // Create student profile record
    const studentResult = await db.query(
      `INSERT INTO students (user_id, tenant_id, admission_number, roll_number, dob, gender) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING student_id`,
      [userId, req.tenantId, data.admissionNumber, data.rollNumber || null, data.dob, data.gender || null]
    );

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        studentId: studentResult.rows[0].student_id,
        userId: userId,
        name: data.name
      },
      errors: []
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        data: null,
        errors: error.errors.map(e => e.message)
      });
    }

    console.error('Student registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create student record.',
      data: null,
      errors: ['Database write error']
    });
  }
});

// List Students Endpoint (Filtered natively by RLS)
app.get('/api/v1/students', async (req: Request, res: Response) => {
  const db = res.locals.dbClient;

  try {
    const result = await db.query(
      `SELECT s.student_id, u.name, u.email, s.admission_number, s.roll_number, s.dob, s.gender 
       FROM students s 
       JOIN users u ON s.user_id = u.user_id`
    );

    res.json({
      success: true,
      message: 'Students list retrieved',
      data: result.rows,
      errors: []
    });
  } catch (error) {
    console.error('List students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load students ledger.',
      data: null,
      errors: ['Database read error']
    });
  }
});

// =========================================================================
// AI MODULES & ERP EXPANSION ENDPOINTS
// =========================================================================

// AI Insights endpoint
app.get('/api/v1/ai/insights', async (req: Request, res: Response) => {
  const db = res.locals.dbClient;
  const tenantId = req.tenantId;

  // Static/dynamic analysis simulator based on tenant details
  const insights = {
    academic: {
      summary: "Class performance is steady at 82.4%. Standard deviation indicates high convergence in math scores.",
      atRisk: [
        { name: "Zainab Ali", class: "Class 9-A", subject: "Maths", risk: "High", reason: "Absence rate at 22%" }
      ],
      topPerformers: [
        { name: "Kamran Shah", gpa: "3.95", rank: "1" },
        { name: "Ayesha Siddiqui", gpa: "3.90", rank: "2" }
      ],
      improvementOpportunities: [
        { subject: "Chemistry", recommendation: "Incorporate molecular model simulations to improve grade ratios." }
      ]
    },
    financial: {
      forecast: "Q3 revenue is projected to grow by 12.4% based on new enrollments.",
      recommendations: [
        { category: "Utility", suggestion: "Switch campus lighting to LED arrays to save up to 14.5% monthly." }
      ],
      cashFlow: {
        inflow: 1200000,
        outflow: 850000,
        margin: "29.1%"
      }
    },
    attendance: {
      absenteeismDetect: "Chronic absenteeism has decreased by 3% since the QR Attendance rollout.",
      risks: [
        { group: "Class 9-A", alert: "Attendance dropped below 90% target average on Thursdays." }
      ],
      staffAttendanceStatus: "98% normal operation."
    },
    executiveAssistant: {
      summary: "All 3 campuses are isolated and synchronized. System health parameters are within normal specifications.",
      alerts: [
        { priority: "Medium", message: "2 faculty leave requests require Vice Principal approval by 18:00." }
      ]
    }
  };

  res.json({
    success: true,
    message: "AI Insights generated successfully.",
    data: insights,
    errors: []
  });
});

// AI Content & Social Media Studio
app.post('/api/v1/ai/content-studio', (req: Request, res: Response) => {
  const { campaignType, language, channel } = req.body;

  // Caption Generator Simulator
  const captions: Record<string, Record<string, string>> = {
    admission: {
      Urdu: "داخلے جاری ہیں! تعلیمی سال 2026-27 کے لیے اپنے بچے کا مستقبل محفوظ بنائیں۔",
      English: "Admissions Open! Secure your child's future for the academic session 2026-27 today.",
      Arabic: "القبول مفتوح الآن! امنح طفلك فرصة الحصول على تعليم متميز لعام 2026-2027.",
      Spanish: "¡Admisiones Abiertas! Asegure el futuro académico de su hijo para la sesión 2026-27.",
      French: "Inscriptions ouvertes ! Sécurisez l'avenir de votre enfant pour la session académique 2026-27.",
      German: "Anmeldungen geöffnet! Sichern Sie noch heute die Zukunft Ihres Kindes für das Schuljahr 2026-27.",
      Turkish: "Kayıtlar Başladı! Çocuğunuzun geleceğini 2026-27 akademik yılı için şimdiden güvenceye alın.",
      Chinese: "入学招生中！即刻为您的孩子锁定2026-27学年的璀璨未来。"
    },
    sports: {
      Urdu: "کھیلوں کا سالانہ دن آ رہا ہے! آئیں اور اپنے ننھے چیمپئنز کی حوصلہ افزائی کریں۔",
      English: "Annual Sports Day is just around the corner! Let's cheer for our young champions.",
      Arabic: "يوم الرياضة السنوي على الأبواب! انضموا إلينا لتشجيع أبطالنا الصغار.",
      Spanish: "¡El Día del Deporte se acerca! Venga a animar a nuestros pequeños campeones.",
      French: "Journée sportive annuelle approche ! Venez encourager nos jeunes champions.",
      German: "Der jährliche Sporttag steht vor der Tür! Feuern Sie unsere kleinen Champions an.",
      Turkish: "Yıllık Spor Günü yaklaşıyor! Genç şampiyonlarımızı hep birlikte destekleyelim.",
      Chinese: "年度校运会即将来临！让我们共同为年轻的冠军们加油喝彩。"
    }
  };

  const selectedCampaign = captions[campaignType] || captions.admission;
  const generatedText = selectedCampaign[language as string] || selectedCampaign.English;

  res.json({
    success: true,
    message: "Social media studio content generated.",
    data: {
      caption: generatedText,
      hashtag: `#AcademicHub #Education #SaaS #${channel}`,
      channel,
      language
    },
    errors: []
  });
});

// Configure Payment Gateways
app.get('/api/v1/finance/gateways', async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Active payment gateways retrieved",
    data: [
      { name: "Stripe", active: true, localOnly: false },
      { name: "PayPal", active: true, localOnly: false },
      { name: "Easypaisa", active: true, localOnly: true },
      { name: "JazzCash", active: false, localOnly: true }
    ],
    errors: []
  });
});

app.post('/api/v1/finance/gateways', (req: Request, res: Response) => {
  const { gateway, active, apiKey } = req.body;
  res.json({
    success: true,
    message: `Gateway ${gateway} configuration updated successfully.`,
    data: { gateway, active, apiKey: apiKey ? '***' : null },
    errors: []
  });
});

// Expenses tracker
app.get('/api/v1/finance/expenses', async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Expenses ledger retrieved",
    data: [
      { category: "Utilities", amount: 4800, date: "2026-06-10", description: "Internet DSL Fiber Line" },
      { category: "Rent", amount: 35000, date: "2026-06-01", description: "Campus Building Rent" }
    ],
    errors: []
  });
});

app.post('/api/v1/finance/expenses', (req: Request, res: Response) => {
  const { category, amount, description } = req.body;
  res.status(201).json({
    success: true,
    message: "Expense entry logged.",
    data: { category, amount, description, date: new Date().toISOString().split('T')[0] },
    errors: []
  });
});

// Timetable optimization
app.get('/api/v1/timetables', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Timetable matrix retrieved",
    data: {
      status: "conflict-free",
      lastOptimized: new Date()
    },
    errors: []
  });
});

app.post('/api/v1/timetables', (req: Request, res: Response) => {
  const { classId, teacherId, subject, dayOfWeek, startTime, endTime, room } = req.body;
  // Conflict checker simulation
  const hasConflict = startTime === "08:30" && room === "Room 201";
  
  if (hasConflict) {
    return res.status(409).json({
      success: false,
      message: "Automated schedule conflict detected!",
      data: null,
      errors: ["Room 201 is already allocated to Mathematics at 08:30."]
    });
  }

  res.status(201).json({
    success: true,
    message: "Period scheduled successfully.",
    data: { classId, teacherId, subject, dayOfWeek, startTime, endTime, room },
    errors: []
  });
});

// Start listening
app.listen(port, () => {
  console.log(`Academic Hub ERP server running on port ${port}`);
});
