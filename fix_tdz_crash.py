import re

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    sync_effects = """
  // Sync to Firebase whenever these registries change
  React.useEffect(() => {
    updateRealtimeData('admin_countries', countries);
  }, [countries]);

  React.useEffect(() => {
    updateRealtimeData('admin_organizations', organizations);
  }, [organizations]);

  React.useEffect(() => {
    updateRealtimeData('admin_campuses', schoolsList);
  }, [schoolsList]);

  React.useEffect(() => {
    updateRealtimeData('admin_apikeys', apiKeys);
  }, [apiKeys]);
"""

    if sync_effects in content:
        # Remove the incorrectly placed sync_effects
        content = content.replace(sync_effects, "")
        
        # Inject it in the correct place, after the declarations
        target = "const [newSchoolSubdomain, setNewSchoolSubdomain] = useState('');"
        content = content.replace(target, target + "\n" + sync_effects)
        
        with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Fixed TDZ ReferenceError by moving sync_effects down.")
    else:
        print("Could not find the exact sync_effects block.")

if __name__ == '__main__':
    main()
