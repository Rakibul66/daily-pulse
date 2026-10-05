import glob
import os

files = glob.glob('src/components/pages/HRM*.tsx') + glob.glob('src/components/pages/hrm/*.tsx') + ['src/components/pages/AssetsManagementPage.tsx']

for path in files:
    if os.path.exists(path):
        with open(path, 'r') as f:
            content = f.read()
        
        # Replace useAuth() if needed
        if "const { user }" in content or "const { user," in content or "const { user " in content:
            content = content.replace("const { user }", "const { user, userProfile }")
            content = content.replace("const { user,", "const { user, userProfile,")
            content = content.replace("const { user } = useAuth();", "const { user, userProfile } = useAuth();")
            # If it's already got userProfile it might mess up, but we can assume mostly simple cases.
            
        content = content.replace('user.uid', 'userProfile?.companyId')
        content = content.replace('if (!user) return;', 'if (!user || !userProfile?.companyId) return;')
        content = content.replace('if (user)', 'if (user && userProfile?.companyId)')
        content = content.replace('[user]', '[user, userProfile?.companyId]')
        content = content.replace('loadData(userProfile?.companyId)', 'loadData()')
        content = content.replace('loadData(userProfile?.companyId,', 'loadData(')

        with open(path, 'w') as f:
            f.write(content)
