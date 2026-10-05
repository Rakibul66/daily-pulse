import re

path = 'src/components/layout/AdminTopBar.tsx'
with open(path, 'r') as f:
    content = f.read()

content = content.replace('"hrm-payroll": "Payroll Management",', '"hrm-payroll": "Payroll Management",\n  "hrm-daily-reports": "Daily Work Reports",')

with open(path, 'w') as f:
    f.write(content)
