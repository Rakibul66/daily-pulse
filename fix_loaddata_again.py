import glob

for path in glob.glob('src/components/pages/HRM*.tsx') + glob.glob('src/components/pages/hrm/*.tsx'):
    with open(path, 'r') as f:
        content = f.read()

    # Rewrite loadData to not take uid
    content = content.replace("const loadData = async (uid: string | undefined, ym: string) => {", "const loadData = async (ym?: string) => {\n    const uid = userProfile?.companyId;\n    const yearMonth = ym || (currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0'));")
    content = content.replace("const loadData = async (uid: string | undefined) => {", "const loadData = async () => {\n    const uid = userProfile?.companyId;")
    
    # Fix calls
    content = content.replace("loadData(userProfile?.companyId,  yearMonth)", "loadData(yearMonth)")
    content = content.replace("loadData(userProfile?.companyId, yearMonth)", "loadData(yearMonth)")
    content = content.replace("loadData(user!.uid)", "loadData()")
    content = content.replace("loadData(user?.uid)", "loadData()")
    
    with open(path, 'w') as f:
        f.write(content)
