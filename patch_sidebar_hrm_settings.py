import re

path = 'src/components/layout/Sidebar.tsx'
with open(path, 'r') as f:
    content = f.read()

content = content.replace('  | "hrm-daily-reports"', '  | "hrm-daily-reports"\n  | "hrm-settings"')
content = content.replace('    { id: "hrm-daily-reports", label: "Daily Reports" },', '    { id: "hrm-daily-reports", label: "Daily Reports" },\n    { id: "hrm-settings", label: "Weekend & Holidays" },')

with open(path, 'w') as f:
    f.write(content)
