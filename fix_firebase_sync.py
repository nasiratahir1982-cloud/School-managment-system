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

    if 'admin_countries' not in content:
        content = content.replace("const [newApiKeyForm, setNewApiKeyForm] = useState({appName: '', key: ''});", 
                                  "const [newApiKeyForm, setNewApiKeyForm] = useState({appName: '', key: ''});\n" + sync_effects)
                                  
        with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Added Firebase sync hooks!")
    else:
        print("Firebase sync hooks already exist.")

if __name__ == '__main__':
    main()
