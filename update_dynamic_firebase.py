import re

def modify_firebase():
    with open('frontend/src/store/firebase.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # Add dynamic loading to firebase.ts
    target_config = """const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB5jhrEr8C6rp9YC5vmqJk1DL7XDcoYAus",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "school-management-system-cac21.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://school-management-system-cac21-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "school-management-system-cac21",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "school-management-system-cac21.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "324840021726",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:324840021726:web:58cfb07f0cb4b0c21b2c4f"
};"""

    dynamic_config = """// Load custom config from localStorage if it exists
let customConfig = null;
try {
  const savedConfig = localStorage.getItem('ah_custom_firebase_config');
  if (savedConfig) {
    customConfig = JSON.parse(savedConfig);
  }
} catch (e) {
  console.error("Failed to parse custom Firebase config from localStorage", e);
}

// Fallback to environment variables or hardcoded default
const firebaseConfig = customConfig || {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB5jhrEr8C6rp9YC5vmqJk1DL7XDcoYAus",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "school-management-system-cac21.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://school-management-system-cac21-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "school-management-system-cac21",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "school-management-system-cac21.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "324840021726",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:324840021726:web:58cfb07f0cb4b0c21b2c4f"
};"""

    if target_config in content:
        content = content.replace(target_config, dynamic_config)
        with open('frontend/src/store/firebase.ts', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated firebase.ts dynamically")
    else:
        print("Target config not found in firebase.ts")


def modify_dashboard():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Add the state variables for the new form
    if 'const [firebaseApiKey, setFirebaseApiKey] = useState(' not in content:
        state_injection = """  const [firebaseApiKey, setFirebaseApiKey] = useState('');
  const [firebaseAuthDomain, setFirebaseAuthDomain] = useState('');
  const [firebaseDbUrl, setFirebaseDbUrl] = useState('');
  const [firebaseProjectId, setFirebaseProjectId] = useState('');
  const [firebaseStorageBucket, setFirebaseStorageBucket] = useState('');
  const [firebaseMessagingId, setFirebaseMessagingId] = useState('');
  const [firebaseAppId, setFirebaseAppId] = useState('');

  // Pre-fill if custom config exists
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('ah_custom_firebase_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFirebaseApiKey(parsed.apiKey || '');
        setFirebaseAuthDomain(parsed.authDomain || '');
        setFirebaseDbUrl(parsed.databaseURL || '');
        setFirebaseProjectId(parsed.projectId || '');
        setFirebaseStorageBucket(parsed.storageBucket || '');
        setFirebaseMessagingId(parsed.messagingSenderId || '');
        setFirebaseAppId(parsed.appId || '');
      }
    } catch(e) {}
  }, []);

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseApiKey) return;
    const newConfig = {
      apiKey: firebaseApiKey,
      authDomain: firebaseAuthDomain,
      databaseURL: firebaseDbUrl,
      projectId: firebaseProjectId,
      storageBucket: firebaseStorageBucket,
      messagingSenderId: firebaseMessagingId,
      appId: firebaseAppId
    };
    localStorage.setItem('ah_custom_firebase_config', JSON.stringify(newConfig));
    alert('Firebase Database Configuration saved! The system will now reload to apply the new database connection.');
    window.location.reload();
  };
"""
        
        # Inject state near other states (e.g., const [newCountryCode...)
        state_target = "const [newCountryCode, setNewCountryCode] = useState('');"
        content = content.replace(state_target, state_target + "\n" + state_injection)

    # Add "Firebase Database Settings" to the Super Admin features
    # 'Backup Manager', 'API Key Management', 'SMS Gateway Settings' -> Add 'Firebase Database Settings'
    if "'Firebase Database Settings'" not in content:
        content = content.replace(
            "'API Key Management', 'SMS Gateway Settings'",
            "'Firebase Database Settings', 'API Key Management', 'SMS Gateway Settings'"
        )

    # Add the actual UI panel
    ui_injection = """
                  {/* Super Admin Advanced Feature: Firebase Database Settings */}
                  {activeFeature === 'Firebase Database Settings' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="p-3 bg-muted/20 border border-border rounded-xl text-xs text-foreground/75 leading-relaxed">
                        ?? Live Database Linkage: Update your Firebase API keys to switch the backend data sink. Note that any data added/updated anywhere in the system is automatically synced to the active Firebase database in real-time.
                      </div>
                      <form onSubmit={handleSaveFirebaseConfig} className="bg-card/50 border border-border p-4 rounded-xl space-y-4">
                        <h4 className="text-sm font-bold text-foreground">Custom Firebase Configuration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">API Key</label>
                            <input type="text" required value={firebaseApiKey} onChange={(e) => setFirebaseApiKey(e.target.value)} className="w-full bg-muted border border-border rounded-lg text-xs p-2.5" placeholder="AIzaSy..." />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">Auth Domain</label>
                            <input type="text" value={firebaseAuthDomain} onChange={(e) => setFirebaseAuthDomain(e.target.value)} className="w-full bg-muted border border-border rounded-lg text-xs p-2.5" placeholder="project-id.firebaseapp.com" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">Database URL</label>
                            <input type="url" value={firebaseDbUrl} onChange={(e) => setFirebaseDbUrl(e.target.value)} className="w-full bg-muted border border-border rounded-lg text-xs p-2.5" placeholder="https://project-id.firebaseio.com" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">Project ID</label>
                            <input type="text" value={firebaseProjectId} onChange={(e) => setFirebaseProjectId(e.target.value)} className="w-full bg-muted border border-border rounded-lg text-xs p-2.5" placeholder="project-id" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">Storage Bucket</label>
                            <input type="text" value={firebaseStorageBucket} onChange={(e) => setFirebaseStorageBucket(e.target.value)} className="w-full bg-muted border border-border rounded-lg text-xs p-2.5" placeholder="project-id.appspot.com" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">Messaging Sender ID</label>
                            <input type="text" value={firebaseMessagingId} onChange={(e) => setFirebaseMessagingId(e.target.value)} className="w-full bg-muted border border-border rounded-lg text-xs p-2.5" placeholder="123456789" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-foreground/70 uppercase mb-1">App ID</label>
                            <input type="text" value={firebaseAppId} onChange={(e) => setFirebaseAppId(e.target.value)} className="w-full bg-muted border border-border rounded-lg text-xs p-2.5" placeholder="1:123456:web:abcd" />
                          </div>
                        </div>
                        <div className="flex justify-end pt-2 border-t border-border/50">
                          <button type="submit" className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow hover:bg-primary/90 transition-all">
                            Save Database Config & Reload
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
"""
        
        # Inject UI panel right before "API Key Management" block
    ui_target = "{/* Super Admin Advanced Feature 6: API Key Management */}"
    if ui_target in content:
        content = content.replace(ui_target, ui_injection + "\n                  " + ui_target)

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated UnifiedDashboard.tsx dynamically")

if __name__ == '__main__':
    modify_firebase()
    modify_dashboard()

