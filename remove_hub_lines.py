def clean_hub(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Find the start and end of the block we want to remove
    start_idx = -1
    end_idx = -1

    for i, line in enumerate(lines):
        if "{(() => {" in line and "const isOperations" in lines[i+1]:
            start_idx = i
        if start_idx != -1 and i > start_idx:
            if "})()}" in line:
                end_idx = i
                break

    print(f"Start: {start_idx}, End: {end_idx}")

    if start_idx != -1 and end_idx != -1:
        new_lines = lines[:start_idx] + lines[end_idx+1:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print("Removed hub block.")
    else:
        print("Could not find block.")

if __name__ == '__main__':
    clean_hub('frontend/src/pages/UnifiedDashboard.tsx')
