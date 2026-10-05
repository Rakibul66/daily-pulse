import re

path = 'src/components/pages/SystemCompanyPage.tsx'
with open(path, 'r') as f:
    content = f.read()

new_save_logic = """
      if (localStorage.getItem("dp_onboarding_step") === "company") {
        localStorage.setItem("dp_onboarding_step", "branch");
        window.location.reload(); // trigger page effect
      }
"""

content = content.replace(
    "showToast('Company profile updated successfully', 'success');",
    "showToast('Company profile updated successfully', 'success');" + new_save_logic
)

with open(path, 'w') as f:
    f.write(content)
