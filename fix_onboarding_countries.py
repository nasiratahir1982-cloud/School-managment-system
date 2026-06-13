import re

def main():
    with open('frontend/src/pages/Login.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add setupRealtimeSync to imports
    if "import { auth } from '../store/firebase';" in content:
        content = content.replace(
            "import { auth } from '../store/firebase';", 
            "import { auth, setupRealtimeSync } from '../store/firebase';"
        )

    # 2. Add state and useEffect for activeCountries
    state_injection_point = "const [selectedCountry, setSelectedCountry] = useState<SupportedCountry | ''>('');"
    if state_injection_point in content:
        new_state_code = """const [selectedCountry, setSelectedCountry] = useState<SupportedCountry | ''>('');
  const [activeCountries, setActiveCountries] = useState<string[] | null>(null);

  useEffect(() => {
    const unsub = setupRealtimeSync('admin_countries', (data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setActiveCountries(data.filter(c => c.status === 'Active').map(c => c.code));
      } else {
        // Fallback or leave as null if DB is empty to show all default
        setActiveCountries(null);
      }
    });
    return unsub;
  }, []);"""
        content = content.replace(state_injection_point, new_state_code)

    # 3. Update the map filter
    map_target = "{(Object.keys(COUNTRY_CONFIGS) as SupportedCountry[]).map((code) => {"
    if map_target in content:
        new_map = "{(Object.keys(COUNTRY_CONFIGS) as SupportedCountry[]).filter(code => activeCountries === null || activeCountries.includes(code)).map((code) => {"
        content = content.replace(map_target, new_map)

    with open('frontend/src/pages/Login.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully updated Login.tsx with active countries filter!")

if __name__ == '__main__':
    main()
