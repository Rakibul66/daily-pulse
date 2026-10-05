import re

path = 'src/app/page.tsx'
with open(path, 'r') as f:
    content = f.read()

import_statement = "import { DailyWorkReportsPage } from '@/components/pages/hrm/DailyWorkReportsPage';\nimport { HRMSettingsPage } from '@/components/pages/hrm/HRMSettingsPage';"
content = content.replace("import { DailyWorkReportsPage } from '@/components/pages/hrm/DailyWorkReportsPage';", import_statement)

route_statement = "if (activeAdminPage === 'hrm-daily-reports') return <DailyWorkReportsPage showToast={showToast} />;\n  if (activeAdminPage === 'hrm-settings') return <HRMSettingsPage showToast={showToast} />;"
content = content.replace("if (activeAdminPage === 'hrm-daily-reports') return <DailyWorkReportsPage showToast={showToast} />;", route_statement)

with open(path, 'w') as f:
    f.write(content)
