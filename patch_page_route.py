import re

path = 'src/app/page.tsx'
with open(path, 'r') as f:
    content = f.read()

# Add import
import_statement = "import { EmployeeLoanPage } from '@/components/pages/hrm/EmployeeLoanPage';\nimport { DailyWorkReportsPage } from '@/components/pages/hrm/DailyWorkReportsPage';"
content = content.replace("import { EmployeeLoanPage } from '@/components/pages/hrm/EmployeeLoanPage';", import_statement)

# Add route
route_statement = "if (activeAdminPage === 'hrm-payroll') return <PayrollPage showToast={showToast} />;\n  if (activeAdminPage === 'hrm-daily-reports') return <DailyWorkReportsPage showToast={showToast} />;"
content = content.replace("if (activeAdminPage === 'hrm-payroll') return <PayrollPage showToast={showToast} />;", route_statement)

with open(path, 'w') as f:
    f.write(content)
