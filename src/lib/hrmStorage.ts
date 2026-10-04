import { getFirebaseServices } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc, updateDoc, orderBy } from 'firebase/firestore';
import { Employee, AttendanceRecord, SalaryPayment } from '@/types/hrm';

const EMPLOYEES_COLLECTION = 'employees';
const ATTENDANCE_COLLECTION = 'attendance';
const PAYROLL_COLLECTION = 'payroll';

// ========================
// EMPLOYEES
// ========================
export const getEmployees = async (userId: string): Promise<Employee[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(
    collection(db, EMPLOYEES_COLLECTION),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  const items: Employee[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as Employee));
  
  // Sort in memory
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items;
};

export const addEmployee = async (employee: Omit<Employee, 'id' | 'createdAt'>): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, EMPLOYEES_COLLECTION));
  const newEmployee: Employee = {
    ...employee,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };

  await setDoc(docRef, newEmployee);
  return docRef.id;
};

export const updateEmployee = async (id: string, updates: Partial<Omit<Employee, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, EMPLOYEES_COLLECTION, id);
  await updateDoc(docRef, updates);
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, EMPLOYEES_COLLECTION, id));
};

// ========================
// ATTENDANCE
// ========================
export const getAttendanceByMonth = async (userId: string, yearMonth: string): Promise<AttendanceRecord[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  // Prefix matching for date YYYY-MM
  const q = query(
    collection(db, ATTENDANCE_COLLECTION),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  const items: AttendanceRecord[] = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data() as AttendanceRecord;
    if (data.date.startsWith(yearMonth)) {
      items.push(data);
    }
  });
  
  return items;
};

export const saveAttendance = async (record: Omit<AttendanceRecord, 'id' | 'createdAt'>): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, ATTENDANCE_COLLECTION));
  const newRecord: AttendanceRecord = {
    ...record,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };

  await setDoc(docRef, newRecord);
  return docRef.id;
};

export const updateAttendance = async (id: string, updates: Partial<Omit<AttendanceRecord, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, ATTENDANCE_COLLECTION, id);
  await updateDoc(docRef, updates);
};

export const deleteAttendance = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, ATTENDANCE_COLLECTION, id));
};

// ========================
// PAYROLL
// ========================
export const getPayrollByMonth = async (userId: string, month: string): Promise<SalaryPayment[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(
    collection(db, PAYROLL_COLLECTION),
    where('userId', '==', userId),
    where('month', '==', month)
  );

  const snapshot = await getDocs(q);
  const items: SalaryPayment[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as SalaryPayment));
  
  // Sort by date desc in memory
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return items;
};

export const addSalaryPayment = async (payment: Omit<SalaryPayment, 'id' | 'createdAt'>): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, PAYROLL_COLLECTION));
  const newRecord: SalaryPayment = {
    ...payment,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };

  await setDoc(docRef, newRecord);
  return docRef.id;
};

export const deleteSalaryPayment = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, PAYROLL_COLLECTION, id));
};

// ========================
// SETTINGS
// ========================
const SETTINGS_COLLECTION = 'hrm_settings';

export const getHRMSettings = async (userId: string): Promise<HRMSettings | null> => {
  const { db } = getFirebaseServices();
  if (!db) return null;
  
  const q = query(
    collection(db, SETTINGS_COLLECTION),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].data() as HRMSettings;
  }
  return null;
};

export const updateHRMSettings = async (userId: string, updates: Partial<Omit<HRMSettings, 'userId'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(
    collection(db, SETTINGS_COLLECTION),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const docRef = snapshot.docs[0].ref;
    await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
  } else {
    const docRef = doc(collection(db, SETTINGS_COLLECTION));
    await setDoc(docRef, {
      userId,
      weekendDays: [],
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }
};
