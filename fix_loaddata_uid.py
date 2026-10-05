import glob
import re

for path in glob.glob('src/components/pages/HRM*.tsx') + glob.glob('src/components/pages/hrm/*.tsx'):
    with open(path, 'r') as f:
        content = f.read()

    # ensure uid check is present
    content = content.replace("const uid = userProfile?.companyId;\n    const yearMonth = ym", "const uid = userProfile?.companyId;\n    if (!uid) return;\n    const yearMonth = ym")
    content = content.replace("const uid = userProfile?.companyId;\n    setIsLoading", "const uid = userProfile?.companyId;\n    if (!uid) return;\n    setIsLoading")
    
    with open(path, 'w') as f:
        f.write(content)
