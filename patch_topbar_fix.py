import re

path = 'src/components/layout/AdminTopBar.tsx'
with open(path, 'r') as f:
    content = f.read()

new_block = """  "hrm-payroll": {
    title: "Payroll & Salary",
    subtitle: "Manage monthly salary payouts",
  },
  "hrm-daily-reports": {
    title: "Daily Work Reports",
    subtitle: "Track employee daily tasks and productivity",
  },"""

content = content.replace("""  "hrm-payroll": {
    title: "Payroll & Salary",
    subtitle: "Manage monthly salary payouts",
  },""", new_block)

with open(path, 'w') as f:
    f.write(content)
