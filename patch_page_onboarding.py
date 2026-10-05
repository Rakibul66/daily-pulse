import re

path = 'src/app/page.tsx'
with open(path, 'r') as f:
    content = f.read()

onboarding_effect = """
  // Onboarding Routing
  useEffect(() => {
    if (userProfile?.companyId) {
      const step = localStorage.getItem("dp_onboarding_step");
      if (step === "company") {
        setActiveAdminPage("system-company");
        showToast("Welcome! Please set up your Company Profile first.", "info");
      } else if (step === "branch") {
        setActiveAdminPage("system-branch");
        showToast("Great! Now let's add your first Branch.", "info");
      }
    }
  }, [userProfile?.companyId]);
"""

content = content.replace('  // Auth Modal State', onboarding_effect + '\n  // Auth Modal State')

with open(path, 'w') as f:
    f.write(content)
