import re

path = 'src/components/pages/SystemBranchPage.tsx'
with open(path, 'r') as f:
    content = f.read()

new_save_logic = """
      if (!editingId && localStorage.getItem("dp_onboarding_step") === "branch") {
        localStorage.removeItem("dp_onboarding_step");
        window.location.reload(); // back to dashboard
      }
"""

content = content.replace(
    "showToast('Branch added', 'success');",
    "showToast('Branch added', 'success');" + new_save_logic
)

with open(path, 'w') as f:
    f.write(content)
