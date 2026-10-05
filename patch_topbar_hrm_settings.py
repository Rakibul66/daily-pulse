import re

path = 'src/components/layout/AdminTopBar.tsx'
with open(path, 'r') as f:
    content = f.read()

new_block = """  "hrm-daily-reports": {
    title: "Daily Work Reports",
    subtitle: "Track employee daily tasks and productivity",
  },
  "hrm-settings": {
    title: "Weekend & Holidays",
    subtitle: "Configure company working days and leave policies",
  },"""

content = content.replace("""  "hrm-daily-reports": {
    title: "Daily Work Reports",
    subtitle: "Track employee daily tasks and productivity",
  },""", new_block)

with open(path, 'w') as f:
    f.write(content)
