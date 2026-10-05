import re

path = 'src/components/pages/hrm/DailyWorkReportsPage.tsx'
with open(path, 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'Leads Generated' in line:
        # The line above it has the syntax error
        lines[i-2] = "                  {(report.leadCount ?? 0) > 0 && (\n"
        break

with open(path, 'w') as f:
    f.writelines(lines)
