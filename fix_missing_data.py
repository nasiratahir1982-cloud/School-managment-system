import re

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the block with the 4 React.useEffects
    old_sync_block = """  // Sync to Firebase whenever these registries change
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
  }, [apiKeys]);"""

    new_sync_block = """  // Advanced Bi-directional Firebase Sync with Loop Prevention
  const isRemoteUpdate = React.useRef({ countries: false, organizations: false, campuses: false, apikeys: false });
  const isInitialLoad = React.useRef({ countries: true, organizations: true, campuses: true, apikeys: true });

  React.useEffect(() => {
    const unsub1 = setupRealtimeSync('admin_countries', (data) => {
      if (data && Array.isArray(data)) {
        isRemoteUpdate.current.countries = true;
        setCountries(data);
      } else if (isInitialLoad.current.countries) {
        // Seed if empty
        updateRealtimeData('admin_countries', countries);
      }
      isInitialLoad.current.countries = false;
    });

    const unsub2 = setupRealtimeSync('admin_organizations', (data) => {
      if (data && Array.isArray(data)) {
        isRemoteUpdate.current.organizations = true;
        setOrganizations(data);
      } else if (isInitialLoad.current.organizations) {
        updateRealtimeData('admin_organizations', organizations);
      }
      isInitialLoad.current.organizations = false;
    });

    const unsub3 = setupRealtimeSync('admin_campuses', (data) => {
      if (data && Array.isArray(data)) {
        isRemoteUpdate.current.campuses = true;
        setSchoolsList(data);
      } else if (isInitialLoad.current.campuses) {
        updateRealtimeData('admin_campuses', schoolsList);
      }
      isInitialLoad.current.campuses = false;
    });

    const unsub4 = setupRealtimeSync('admin_apikeys', (data) => {
      if (data && Array.isArray(data)) {
        isRemoteUpdate.current.apikeys = true;
        setApiKeys(data);
      } else if (isInitialLoad.current.apikeys) {
        updateRealtimeData('admin_apikeys', apiKeys);
      }
      isInitialLoad.current.apikeys = false;
    });

    return () => { unsub1(); unsub2(); unsub3(); unsub4(); };
  }, []);

  React.useEffect(() => {
    if (isInitialLoad.current.countries) return;
    if (isRemoteUpdate.current.countries) { isRemoteUpdate.current.countries = false; return; }
    updateRealtimeData('admin_countries', countries);
  }, [countries]);

  React.useEffect(() => {
    if (isInitialLoad.current.organizations) return;
    if (isRemoteUpdate.current.organizations) { isRemoteUpdate.current.organizations = false; return; }
    updateRealtimeData('admin_organizations', organizations);
  }, [organizations]);

  React.useEffect(() => {
    if (isInitialLoad.current.campuses) return;
    if (isRemoteUpdate.current.campuses) { isRemoteUpdate.current.campuses = false; return; }
    updateRealtimeData('admin_campuses', schoolsList);
  }, [schoolsList]);

  React.useEffect(() => {
    if (isInitialLoad.current.apikeys) return;
    if (isRemoteUpdate.current.apikeys) { isRemoteUpdate.current.apikeys = false; return; }
    updateRealtimeData('admin_apikeys', apiKeys);
  }, [apiKeys]);"""

    if old_sync_block in content:
        content = content.replace(old_sync_block, new_sync_block)
        with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully updated bi-directional sync logic.")
    else:
        print("Error: Could not find old sync block.")

if __name__ == '__main__':
    main()
