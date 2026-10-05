import re

path = 'src/app/page.tsx'
with open(path, 'r') as f:
    content = f.read()

# Fix imports
if "DailyWorkReportsPage" not in content:
    content = content.replace(
        'import { HRMSettingsPage } from "@/components/pages/HRMSettingsPage";',
        'import { HRMSettingsPage } from "@/components/pages/hrm/HRMSettingsPage";\nimport { DailyWorkReportsPage } from "@/components/pages/hrm/DailyWorkReportsPage";'
    )
else:
    # Fix the wrong import if it exists
    content = content.replace(
        'import { HRMSettingsPage } from "@/components/pages/HRMSettingsPage";',
        'import { HRMSettingsPage } from "@/components/pages/hrm/HRMSettingsPage";'
    )

# Fix JSX routing
if 'activeAdminPage === "hrm-daily-reports"' not in content:
    new_routes = """
          {activeAdminPage === "hrm-daily-reports" && (
            <DailyWorkReportsPage showToast={showToast} />
          )}
          {activeAdminPage === "hrm-settings" && (
            <HRMSettingsPage showToast={showToast} />
          )}"""
    
    content = content.replace(
        '{activeAdminPage === "hrm-overtime" && (\n            <HRMOvertimePage showToast={showToast} />\n          )}',
        '{activeAdminPage === "hrm-overtime" && (\n            <HRMOvertimePage showToast={showToast} />\n          )}' + new_routes
    )

# Remove the incorrect 'settings' fallback if any
content = content.replace("""          {activeAdminPage === "settings" && (
            <HRMSettingsPage showToast={showToast} />
          )}""", "")

with open(path, 'w') as f:
    f.write(content)
