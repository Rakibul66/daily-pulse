import re

path = 'src/lib/hrmStorage.ts'
with open(path, 'r') as f:
    content = f.read()

# Update getHRMSettings
content = content.replace(
    'export const getHRMSettings = async (userId: string): Promise<HRMSettings | null> => {',
    'export const getHRMSettings = async (companyId: string): Promise<HRMSettings | null> => {'
)
content = content.replace(
    "const q = query(collection(db, SETTINGS_COLLECTION), where('userId', '==', userId));",
    "const q = query(collection(db, SETTINGS_COLLECTION), where('companyId', '==', companyId));"
)

# Update updateHRMSettings
content = content.replace(
    "export const updateHRMSettings = async (userId: string, updates: Partial<Omit<HRMSettings, 'userId'>>): Promise<void> => {",
    "export const updateHRMSettings = async (companyId: string, updates: Partial<Omit<HRMSettings, 'companyId'>>): Promise<void> => {"
)
content = content.replace(
    "const q = query(collection(db, SETTINGS_COLLECTION), where('userId', '==', userId));",
    "const q = query(collection(db, SETTINGS_COLLECTION), where('companyId', '==', companyId));"
)
content = content.replace(
    "await setDoc(doc(collection(db, SETTINGS_COLLECTION)), { ...updates, userId, updatedAt: new Date().toISOString() });",
    "await setDoc(doc(collection(db, SETTINGS_COLLECTION)), { ...updates, companyId, updatedAt: new Date().toISOString() });"
)

with open(path, 'w') as f:
    f.write(content)
