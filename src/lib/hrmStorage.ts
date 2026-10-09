import { getFirebaseServices } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc, updateDoc, orderBy } from 'firebase/firestore';
import { sanitizeForFirestore } from './firestoreUtils';
import { encryptField, decryptField } from './cryptoUtils';
import { Employee, AttendanceRecord, SalaryPayment, HRMSettings, EmployeeLoan, EmployeeOvertime } from '@/types/hrm';

const EMPLOYEES_COLLECTION = 'employees';
const ATTENDANCE_COLLECTION = 'attendance';
const PAYROLL_COLLECTION = 'payroll';

// ========================
// EMPLOYEES
// ========================
export const getEmployees = async (companyId: string): Promise<Employee[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(
    collection(db, EMPLOYEES_COLLECTION),
    where('companyId', '==', companyId)
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

  await setDoc(docRef, sanitizeForFirestore(newEmployee));
  return docRef.id;
};

export const updateEmployee = async (id: string, updates: Partial<Omit<Employee, 'id' | 'companyId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, EMPLOYEES_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore(updates));
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, EMPLOYEES_COLLECTION, id));
};

// ========================
// ATTENDANCE
// ========================
export const getAttendanceByMonth = async (companyId: string, yearMonth: string): Promise<AttendanceRecord[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  // Prefix matching for date YYYY-MM
  const q = query(
    collection(db, ATTENDANCE_COLLECTION),
    where('companyId', '==', companyId)
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

  await setDoc(docRef, sanitizeForFirestore(newRecord));
  return docRef.id;
};

export const updateAttendance = async (id: string, updates: Partial<Omit<AttendanceRecord, 'id' | 'companyId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, ATTENDANCE_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore(updates));
};

export const deleteAttendance = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, ATTENDANCE_COLLECTION, id));
};

// ========================
// PAYROLL
// ========================
export const getPayrollByMonth = async (companyId: string, month: string): Promise<SalaryPayment[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(
    collection(db, PAYROLL_COLLECTION),
    where('companyId', '==', companyId),
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

  await setDoc(docRef, sanitizeForFirestore(newRecord));
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

export const getHRMSettings = async (companyId: string): Promise<HRMSettings | null> => {
  const { db } = getFirebaseServices();
  if (!db) return null;
  
  const q = query(
    collection(db, SETTINGS_COLLECTION),
    where('companyId', '==', companyId)
  );

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const data = snapshot.docs[0].data() as HRMSettings;
    // Decrypt sensitive credentials if present
    if (data.geminiApiKey) {
      try {
        data.geminiApiKey = await decryptField(data.geminiApiKey, companyId);
      } catch (err) {
        console.error('Failed to decrypt geminiApiKey:', err);
      }
    }
    return data;
  }
  return null;
};

export const updateHRMSettings = async (companyId: string, updates: Partial<Omit<HRMSettings, 'companyId'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  // Encrypt sensitive credentials before saving to Firestore
  const sanitizedUpdates = { ...updates };
  if (sanitizedUpdates.geminiApiKey) {
    sanitizedUpdates.geminiApiKey = await encryptField(sanitizedUpdates.geminiApiKey, companyId);
  }

  const q = query(
    collection(db, SETTINGS_COLLECTION),
    where('companyId', '==', companyId)
  );

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const docRef = snapshot.docs[0].ref;
    await updateDoc(docRef, sanitizeForFirestore({ ...sanitizedUpdates, updatedAt: new Date().toISOString() }));
  } else {
    const docRef = doc(collection(db, SETTINGS_COLLECTION));
    await setDoc(docRef, sanitizeForFirestore({
      companyId,
      weekendDays: [],
      ...sanitizedUpdates,
      updatedAt: new Date().toISOString(),
    }));
  }
};

// --- LOANS ---
const LOANS_COLLECTION = 'hrm_loans';

export const getEmployeeLoans = async (companyId: string): Promise<EmployeeLoan[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, LOANS_COLLECTION), where('companyId', '==', companyId));
  const snapshot = await getDocs(q);
  const items: EmployeeLoan[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as EmployeeLoan));
  
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items;
};

export const addEmployeeLoan = async (loan: Omit<EmployeeLoan, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, LOANS_COLLECTION));
  const newLoan = {
    ...loan,
    id: docRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, sanitizeForFirestore(newLoan));
  return docRef.id;
};

export const updateEmployeeLoan = async (id: string, updates: Partial<Omit<EmployeeLoan, "id" | "companyId" | "createdAt">>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, LOANS_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
};

export const deleteEmployeeLoan = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, LOANS_COLLECTION, id));
};

// --- OVERTIME ---
const OVERTIME_COLLECTION = 'hrm_overtimes';

export const getEmployeeOvertimes = async (companyId: string): Promise<EmployeeOvertime[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const q = query(collection(db, OVERTIME_COLLECTION), where('companyId', '==', companyId));
  const snapshot = await getDocs(q);
  const items: EmployeeOvertime[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data() as EmployeeOvertime));
  
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items;
};

export const addEmployeeOvertime = async (overtime: Omit<EmployeeOvertime, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, OVERTIME_COLLECTION));
  const newOvertime = {
    ...overtime,
    id: docRef.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, sanitizeForFirestore(newOvertime));
  return docRef.id;
};

export const updateEmployeeOvertime = async (id: string, updates: Partial<Omit<EmployeeOvertime, 'id' | 'companyId' | 'createdAt'>>): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  const docRef = doc(db, OVERTIME_COLLECTION, id);
  await updateDoc(docRef, sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() }));
};

export const deleteEmployeeOvertime = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, OVERTIME_COLLECTION, id));
};

// ========================
// DAILY WORK REPORTS
// ========================
const DAILY_REPORTS_COLLECTION = 'daily_work_reports';

export const getDailyWorkReports = async (companyId: string, dateStr?: string): Promise<any[]> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const conditions: any[] = [where('companyId', '==', companyId)];
  if (dateStr) {
    conditions.push(where('date', '==', dateStr));
  }

  const q = query(collection(db, DAILY_REPORTS_COLLECTION), ...conditions);
  const snapshot = await getDocs(q);
  const items: any[] = [];
  snapshot.forEach((docSnap) => items.push(docSnap.data()));
  
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return items;
};

export const addDailyWorkReport = async (reportData: any): Promise<string> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(collection(db, DAILY_REPORTS_COLLECTION));
  const newReport = {
    ...reportData,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };

  await setDoc(docRef, sanitizeForFirestore(newReport));
  return docRef.id;
};

export const deleteDailyWorkReport = async (id: string): Promise<void> => {
  const { db } = getFirebaseServices();
  if (!db) throw new Error('Firebase not configured');
  
  await deleteDoc(doc(db, DAILY_REPORTS_COLLECTION, id));
};
