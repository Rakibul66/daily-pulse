export interface Employee {
  id: string;
  companyId: string;
  name: string;
  department: string;
  baseSalary: number;
  joinedDate: string;
  isActive: boolean;
  createdAt: string;
}

export type AttendanceStatus = 'P' | 'A' | 'L' | 'LV' | '-';

export interface AttendanceRecord {
  id: string;
  companyId: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  reason?: string;
  createdAt: string;
}

export interface SalaryPayment {
  id: string;
  companyId: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  amount: number;
  note?: string;
  createdAt: string;
}


export interface RoleTemplate {
  id: string;
  roleName: string;
  responsibilities: string[];
}

export interface HRMSettings {
  companyId: string;
  weekendDays: string[]; // e.g. ['FRI', 'SAT']
  roles?: RoleTemplate[];
  aiEnabled?: boolean;
  geminiApiKey?: string;
  updatedAt: string;
}

export type LoanType = 'Salary Advance' | 'Personal Loan' | string;
export type LoanStatus = 'Pending' | 'Approved' | 'Rejected';

export interface EmployeeLoan {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string; 
  loanType: LoanType;
  payrollMonth: string;
  payrollYear: number;
  loanAmount: number;
  installmentAmount: number;
  installmentTotal: number;
  loanDate: string;
  status: LoanStatus;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export type OvertimeType = 'Regular Overtime' | 'Holiday Overtime' | 'Weekend Overtime' | string;
export type OvertimeStatus = 'Pending' | 'Approved' | 'Rejected';

export interface EmployeeOvertime {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string; 
  overtimeType: OvertimeType;
  payrollMonth: string;
  payrollYear: number;
  overtimeHour: number;
  overtimeRate: number;
  overtimeAmount: number;
  overtimeDate: string;
  status: OvertimeStatus;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReportStatus = 'Completed' | 'In Progress' | 'Blocked';

export interface DailyWorkReport {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  tasksCompleted: string; // Detailed text of what they did
  leadCount?: number; // Optional metric for leads collected
  issuesBlocked?: string; // Any problems they faced
  status: ReportStatus;
  createdAt: string;
}
