import re

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Imports
    if 'import { database }' not in content:
        content = content.replace('import React, { useState } from "react";', 
                                  'import React, { useState, useEffect } from "react";\nimport { database } from "../firebase";\nimport { ref, onValue, set } from "firebase/database";')
        
    # 2. Add the Sync Hook inside UnifiedDashboard
    sync_hook = """
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 4) setInitialLoadDone(true);
    };

    onValue(ref(database, 'countries'), (snap) => {
      if (snap.exists()) setCountries(snap.val());
      else set(ref(database, 'countries'), countries);
      checkLoaded();
    }, { onlyOnce: true });

    onValue(ref(database, 'organizations'), (snap) => {
      if (snap.exists()) setOrganizations(snap.val());
      else set(ref(database, 'organizations'), organizations);
      checkLoaded();
    }, { onlyOnce: true });

    onValue(ref(database, 'campuses'), (snap) => {
      if (snap.exists()) setSchoolsList(snap.val());
      else set(ref(database, 'campuses'), schoolsList);
      checkLoaded();
    }, { onlyOnce: true });

    onValue(ref(database, 'apiKeys'), (snap) => {
      if (snap.exists()) setApiKeys(snap.val());
      else set(ref(database, 'apiKeys'), apiKeys);
      checkLoaded();
    }, { onlyOnce: true });
  }, []);

  useEffect(() => {
    if (initialLoadDone) set(ref(database, 'countries'), countries);
  }, [countries, initialLoadDone]);

  useEffect(() => {
    if (initialLoadDone) set(ref(database, 'organizations'), organizations);
  }, [organizations, initialLoadDone]);

  useEffect(() => {
    if (initialLoadDone) set(ref(database, 'campuses'), schoolsList);
  }, [schoolsList, initialLoadDone]);

  useEffect(() => {
    if (initialLoadDone) set(ref(database, 'apiKeys'), apiKeys);
  }, [apiKeys, initialLoadDone]);
"""
    if 'const [initialLoadDone, setInitialLoadDone]' not in content:
        content = content.replace("const [secureDeletePrompt, setSecureDeletePrompt] = useState", sync_hook + "\n  const [secureDeletePrompt, setSecureDeletePrompt] = useState")

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Updated UnifiedDashboard.tsx successfully with Firebase Sync hooks.")

if __name__ == '__main__':
    main()
