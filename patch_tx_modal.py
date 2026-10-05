import re

path = 'src/components/finance/TxHistoryModal.tsx'
with open(path, 'r') as f:
    content = f.read()

content = content.replace('if (isOpen && partner && user)&& user) userProfile?.companyId) {', 'if (isOpen && partner && userProfile?.companyId) {')
content = content.replace('if (isOpen && partner && user) {', 'if (isOpen && partner && userProfile?.companyId) {')

with open(path, 'w') as f:
    f.write(content)
