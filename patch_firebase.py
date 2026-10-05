import re

path = 'src/lib/firebase.ts'
with open(path, 'r') as f:
    content = f.read()

# Update import
content = content.replace(
    'import { getFirestore, initializeFirestore, Firestore, enableIndexedDbPersistence } from "firebase/firestore";',
    'import { getFirestore, initializeFirestore, Firestore, persistentLocalCache, setupIndexedDbCache } from "firebase/firestore";'
)

# Update logic
old_block = """    let db: Firestore;
    try {
      db = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
      });
      // OPTIMIZATION: Enable offline caching for lightning-fast reads
      if (typeof window !== "undefined") {
        enableIndexedDbPersistence(db).catch((err) => {
          if (err.code == 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
          } else if (err.code == 'unimplemented') {
            console.warn('The current browser does not support all of the features required to enable persistence');
          }
        });
      }
    } catch {
      // If already initialized, get existing instance
      db = getFirestore(app);
    }"""

new_block = """    let db: Firestore;
    try {
      db = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
        localCache: typeof window !== "undefined" ? persistentLocalCache({tabManager: setupIndexedDbCache()}) : undefined
      });
    } catch {
      // If already initialized, get existing instance
      db = getFirestore(app);
    }"""

content = content.replace(old_block, new_block)

with open(path, 'w') as f:
    f.write(content)
