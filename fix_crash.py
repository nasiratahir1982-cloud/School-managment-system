import re

def main():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix Imports
    if 'import { database }' not in content:
        content = content.replace("import React, { useState } from 'react';", 
                                  "import React, { useState, useEffect } from 'react';\nimport { database } from '../firebase';\nimport { ref, onValue, set } from 'firebase/database';")

    # 2. Remove the poorly placed hooks
    bad_hooks = r"""  const \[initialLoadDone, setInitialLoadDone\] = useState\(false\);

  useEffect\(\(\) => \{
    let loadedCount = 0;
    const checkLoaded = \(\) => \{
      loadedCount\+\+;
      if \(loadedCount === 4\) setInitialLoadDone\(true\);
    \};

    onValue\(ref\(database, 'countries'\), \(snap\) => \{
      if \(snap\.exists\(\)\) setCountries\(snap\.val\(\)\);
      else set\(ref\(database, 'countries'\), countries\);
      checkLoaded\(\);
    \}, \{ onlyOnce: true \}\);

    onValue\(ref\(database, 'organizations'\), \(snap\) => \{
      if \(snap\.exists\(\)\) setOrganizations\(snap\.val\(\)\);
      else set\(ref\(database, 'organizations'\), organizations\);
      checkLoaded\(\);
    \}, \{ onlyOnce: true \}\);

    onValue\(ref\(database, 'campuses'\), \(snap\) => \{
      if \(snap\.exists\(\)\) setSchoolsList\(snap\.val\(\)\);
      else set\(ref\(database, 'campuses'\), schoolsList\);
      checkLoaded\(\);
    \}, \{ onlyOnce: true \}\);

    onValue\(ref\(database, 'apiKeys'\), \(snap\) => \{
      if \(snap\.exists\(\)\) setApiKeys\(snap\.val\(\)\);
      else set\(ref\(database, 'apiKeys'\), apiKeys\);
      checkLoaded\(\);
    \}, \{ onlyOnce: true \}\);
  \}, \[\]\);

  useEffect\(\(\) => \{
    if \(initialLoadDone\) set\(ref\(database, 'countries'\), countries\);
  \}, \[countries, initialLoadDone\]\);

  useEffect\(\(\) => \{
    if \(initialLoadDone\) set\(ref\(database, 'organizations'\), organizations\);
  \}, \[organizations, initialLoadDone\]\);

  useEffect\(\(\) => \{
    if \(initialLoadDone\) set\(ref\(database, 'campuses'\), schoolsList\);
  \}, \[schoolsList, initialLoadDone\]\);

  useEffect\(\(\) => \{
    if \(initialLoadDone\) set\(ref\(database, 'apiKeys'\), apiKeys\);
  \}, \[apiKeys, initialLoadDone\]\);"""

    content = re.sub(bad_hooks, "", content)
    
    # Also clean up any extra newlines left
    content = re.sub(r'\n\s*\n\s*const \[secureDeletePrompt, setSecureDeletePrompt\]', '\n  const [secureDeletePrompt, setSecureDeletePrompt]', content)

    # 3. Inject them safely AFTER the state definitions (before the first useEffect or after completedAssignments)
    # Finding a safe anchor
    good_hooks = """
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
    # Let's inject right before `const navigate = useNavigate();` if it exists, or just after `const [completedAssignments, setCompletedAssignments] = useState<string[]>([]);`
    anchor = r"const \[completedAssignments, setCompletedAssignments\] = useState<string\[\]>\(\[\]\);"
    if re.search(anchor, content):
        content = re.sub(anchor, "const [completedAssignments, setCompletedAssignments] = useState<string[]>([]);\n" + good_hooks, content)

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Fix script completed successfully.")

if __name__ == '__main__':
    main()
