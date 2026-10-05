import re

path = 'src/types/hrm.ts'
with open(path, 'r') as f:
    content = f.read()

content = content.replace('  userId: string;\n  weekendDays: string[];', '  companyId: string;\n  weekendDays: string[];')

with open(path, 'w') as f:
    f.write(content)
