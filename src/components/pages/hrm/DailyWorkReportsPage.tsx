import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  getEmployees, 
  getDailyWorkReports, 
  addDailyWorkReport, 
  deleteDailyWorkReport, 
  getHRMSettings 
} from '@/lib/hrmStorage';
import { Employee, DailyWorkReport, RoleTemplate } from '@/types/hrm';
import { WorkReportHeaderCard } from './work-reports/WorkReportHeaderCard';
import { WorkReportStatsRow } from './work-reports/WorkReportStatsRow';
import { WorkReportCardGrid } from './work-reports/WorkReportCardGrid';
import { WorkReportModal } from './work-reports/WorkReportModal';

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const DailyWorkReportsPage: React.FC<Props> = ({ showToast }) => {
  const { userProfile } = useAuth();
  const [reports, setReports] = useState<DailyWorkReport[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<RoleTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Filters
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filterEmp, setFilterEmp] = useState<string>('ALL');

  // Form
  const [formData, setFormData] = useState<Partial<DailyWorkReport>>({
    date: new Date().toISOString().split('T')[0],
    employeeId: '',
    tasksCompleted: '',
    leadCount: 0,
    issuesBlocked: '',
    status: 'Completed'
  });

  useEffect(() => {
    if (userProfile?.companyId) {
      loadData();
    }
  }, [userProfile?.companyId, filterDate]);

  const loadData = async () => {
    if (!userProfile?.companyId) return;
    setIsLoading(true);
    try {
      const [emps, reps, settings] = await Promise.all([
        getEmployees(userProfile.companyId),
        getDailyWorkReports(userProfile.companyId, filterDate),
        getHRMSettings(userProfile.companyId)
      ]);
      setEmployees(emps);
      setReports(reps);
      if (settings?.roles) {
        setRoles(settings.roles);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load reports', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userProfile?.companyId) return;
    if (!formData.employeeId || !formData.tasksCompleted || !formData.status) {
      showToast('Please fill required fields (Employee, Tasks, Status)', 'error');
      return;
    }

    const emp = employees.find(e => e.id === formData.employeeId);
    if (!emp) return;

    setIsSaving(true);
    try {
      const payload = {
        companyId: userProfile.companyId,
        employeeId: emp.id,
        employeeName: emp.name,
        date: formData.date || filterDate,
        tasksCompleted: formData.tasksCompleted,
        leadCount: formData.leadCount || 0,
        issuesBlocked: formData.issuesBlocked || '',
        status: formData.status
      };
      
      await addDailyWorkReport(payload);
      showToast('Daily report submitted!', 'success');
      setIsAdding(false);
      setFormData({
        date: filterDate,
        employeeId: '',
        tasksCompleted: '',
        leadCount: 0,
        issuesBlocked: '',
        status: 'Completed'
      });
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to save report', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this report?')) return;
    try {
      await deleteDailyWorkReport(id);
      showToast('Report deleted', 'success');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Failed to delete report', 'error');
    }
  };

  // Date Navigation Helpers
  const handlePrevDay = () => {
    const [y, m, d] = filterDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() - 1);
    const yStr = dateObj.getFullYear();
    const mStr = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dStr = String(dateObj.getDate()).padStart(2, '0');
    setFilterDate(`${yStr}-${mStr}-${dStr}`);
  };

  const handleNextDay = () => {
    const [y, m, d] = filterDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + 1);
    const yStr = dateObj.getFullYear();
    const mStr = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dStr = String(dateObj.getDate()).padStart(2, '0');
    setFilterDate(`${yStr}-${mStr}-${dStr}`);
  };

  const handleSetToday = () => {
    setFilterDate(new Date().toISOString().split('T')[0]);
  };

  const formatDisplayDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const filteredReports = filterEmp === 'ALL' 
    ? reports 
    : reports.filter(r => r.employeeId === filterEmp);

  // KPI Calculations
  const totalReports = filteredReports.length;
  const completedCount = filteredReports.filter(r => r.status === 'Completed').length;
  const inProgressCount = filteredReports.filter(r => r.status === 'In Progress').length;
  const blockedCount = filteredReports.filter(r => r.status === 'Blocked' || Boolean(r.issuesBlocked?.trim())).length;
  const totalLeads = filteredReports.reduce((sum, r) => sum + (r.leadCount || 0), 0);

  return (
    <div className="w-full mx-auto space-y-6 pb-20 font-sans text-black">
      {/* 1. Top Header Card */}
      <WorkReportHeaderCard
        filterDate={filterDate}
        onFilterDateChange={setFilterDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onSetToday={handleSetToday}
        formatDisplayDate={formatDisplayDate}
        filterEmp={filterEmp}
        onFilterEmpChange={setFilterEmp}
        employees={employees}
        onOpenAddModal={() => {
          setFormData({
            date: filterDate,
            employeeId: filterEmp !== 'ALL' ? filterEmp : '',
            tasksCompleted: '',
            leadCount: 0,
            issuesBlocked: '',
            status: 'Completed'
          });
          setIsAdding(true);
        }}
      />

      {/* 2. Metric Stats Row */}
      <WorkReportStatsRow
        totalReports={totalReports}
        completedCount={completedCount}
        inProgressCount={inProgressCount}
        totalLeads={totalLeads}
        blockedCount={blockedCount}
      />

      {/* 3. Main Body: Reports Grid or Redesigned Empty State */}
      <WorkReportCardGrid
        isLoading={isLoading}
        reports={filteredReports}
        filterDate={filterDate}
        formatDisplayDate={formatDisplayDate}
        onOpenAddModal={() => {
          setFormData({
            date: filterDate,
            employeeId: filterEmp !== 'ALL' ? filterEmp : '',
            tasksCompleted: '',
            leadCount: 0,
            issuesBlocked: '',
            status: 'Completed'
          });
          setIsAdding(true);
        }}
        onSetToday={handleSetToday}
        onDeleteReport={handleDelete}
      />

      {/* 4. New Report Modal Overlay */}
      <WorkReportModal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        formData={formData}
        onChange={setFormData}
        employees={employees}
        roles={roles}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};
