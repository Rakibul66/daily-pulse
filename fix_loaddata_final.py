import glob
import re

for path in glob.glob('src/components/pages/HRM*.tsx') + glob.glob('src/components/pages/hrm/*.tsx'):
    with open(path, 'r') as f:
        content = f.read()

    # Just regex replace all loadData(...) with loadData(yearMonth) if yearMonth is present
    # Or loadData() if not.
    # It's easier to just find the exact lines
    content = content.replace("loadData(userProfile?.companyId, user!.uid, yearMonth);", "loadData(yearMonth);")
    content = content.replace("loadData(userProfile?.companyId, yearMonth);", "loadData(yearMonth);")
    content = content.replace("loadData(userProfile?.companyId);", "loadData();")
    
    with open(path, 'w') as f:
        f.write(content)
