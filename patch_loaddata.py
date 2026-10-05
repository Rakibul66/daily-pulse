import glob

for path in glob.glob('src/components/pages/HRM*.tsx') + glob.glob('src/components/pages/hrm/*.tsx'):
    with open(path, 'r') as f:
        content = f.read()
    
    content = content.replace("const loadData = async (uid: string, ym: string) => {", "const loadData = async (uid: string | undefined, ym: string) => {\n    if (!uid) return;")
    content = content.replace("const loadData = async (uid: string) => {", "const loadData = async (uid: string | undefined) => {\n    if (!uid) return;")
    
    with open(path, 'w') as f:
        f.write(content)
