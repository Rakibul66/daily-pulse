import re

path = 'src/components/auth/AuthModal.tsx'
with open(path, 'r') as f:
    content = f.read()

content = content.replace(
    'await signUpWithEmail(email, password, name);\n        onSuccess?.();\n        onClose();',
    'await signUpWithEmail(email, password, name);\n        localStorage.setItem("dp_onboarding_step", "company");\n        onSuccess?.();\n        onClose();'
)

with open(path, 'w') as f:
    f.write(content)
