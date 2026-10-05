import re

path = 'src/components/layout/Sidebar.tsx'
with open(path, 'r') as f:
    content = f.read()

content = content.replace('  | "hrm-payroll"', '  | "hrm-payroll"\n  | "hrm-daily-reports"')

content = content.replace('    { id: "hrm-payroll", label: "Payroll" },', '    { id: "hrm-payroll", label: "Payroll" },\n    { id: "hrm-daily-reports", label: "Daily Reports" },')

with open(path, 'w') as f:
    f.write(content)
