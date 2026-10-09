import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Employee, AttendanceRecord, AttendanceStatus } from '@/types/hrm';
import { getEmployees, getAttendanceByMonth, saveAttendance, deleteAttendance, getHRMSettings } from '@/lib/hrmStorage';
import { AttendanceModal } from '../hrm/AttendanceModal';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  showToast: (msg: string, type: 'success'|'error') => void;
}

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

export const HRMAttendancePage: React.FC<Props> = ({ showToast }) => {
  const { user, userProfile } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [weekendDays, setWeekendDays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Default to current month
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  useEffect(() => {
    if (user && userProfile?.companyId) {
      loadData(yearMonth);
    }
  }, [user, yearMonth]);

  const loadData = async (ym?: string) => {
    const uid = userProfile?.companyId;
    if (!uid) return;
    const yearMonth = ym || (currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0'));
    if (!uid) return;
    setIsLoading(true);
    try {
      const [emps, recs, settings] = await Promise.all([
        getEmployees(uid),
        getAttendanceByMonth(uid, yearMonth),
        getHRMSettings(uid)
      ]);
      setEmployees(emps.filter((e: any) => e.isActive));
      setRecords(recs);
      if (settings) setWeekendDays(settings.weekendDays || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load attendance data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleSaveRecord = async (record: Omit<AttendanceRecord, 'id' | 'createdAt'>) => {
    if (!user || !userProfile?.companyId) return;
    try {
      await saveAttendance({ ...record, companyId: userProfile?.companyId });
      showToast('Attendance recorded', 'success');
      loadData(yearMonth);
    } catch (err) {
      console.error(err);
      showToast('Error saving attendance', 'error');
      throw err;
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await deleteAttendance(id);
      showToast('Record deleted', 'success');
      loadData(yearMonth);
    } catch (err) {
      console.error(err);
      showToast('Error deleting record', 'error');
    }
  };

  // Generate grid columns (1 to daysInMonth)
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    return { dayNum: i + 1, dayStr };
  });

  return (
    <div className="w-full mx-auto space-y-6 pb-20 font-sans text-black">
      {/* 1. Header Hero Card with High-Contrast Month Navigator */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-6 sm:p-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-300 border-2 border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000] mb-1.5">
            STAFF ATTENDANCE
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black leading-none">
            ATTENDANCE REGISTER
          </h1>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mt-1">
            Track daily employee attendance, leaves & absences for {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* High-Contrast Month Navigator */}
          <div className="flex items-center bg-white border-3 border-black shadow-[3px_3px_0px_#000] overflow-hidden">
            <button 
              onClick={handlePrevMonth} 
              className="p-2.5 hover:bg-amber-100 text-black border-r-2 border-black transition-colors cursor-pointer active:translate-x-0.5"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </button>
            <div className="px-5 py-2 font-display font-black text-sm uppercase text-black bg-[#FFFDF0] min-w-[140px] text-center tracking-wider select-none">
              {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <button 
              onClick={handleNextMonth} 
              className="p-2.5 hover:bg-amber-100 text-black border-l-2 border-black transition-colors cursor-pointer active:translate-x-0.5"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-display font-black text-xs uppercase tracking-wider border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>MANUAL ENTRY</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-primary-900 border-t-primary-500 animate-spin"></div>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-md border border-slate-800 shadow-md overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-950/80">
                  <th className="px-4 py-3 font-bold text-slate-300 text-left sticky left-0 z-10 bg-slate-950/90 border-r border-b border-slate-800 min-w-[150px]">Employee</th>
                  {daysArray.map(d => (
                    <th key={d.dayNum} className="px-2 py-2 border-r border-b border-slate-800 min-w-[40px]">
                      <div className="font-bold text-white">{d.dayNum}</div>
                      <div className={`text-[9px] font-semibold ${['SAT','SUN'].includes(d.dayStr) ? 'text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>{d.dayStr}</div>
                    </th>
                  ))}
                  <th className="px-3 py-3 border-r border-b border-slate-800 text-emerald-400 font-bold sticky right-[120px] bg-slate-950/90">P</th>
                  <th className="px-3 py-3 border-r border-b border-slate-800 text-rose-400 font-bold sticky right-[80px] bg-slate-950/90">A</th>
                  <th className="px-3 py-3 border-r border-b border-slate-800 text-amber-400 font-bold sticky right-[40px] bg-slate-950/90">L</th>
                  <th className="px-3 py-3 border-b border-slate-800 text-sky-400 font-bold sticky right-0 bg-slate-950/90">LV</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => {
                  const empRecords = records.filter(r => r.employeeId === emp.id);
                  let [pCount, aCount, lCount, lvCount] = [0, 0, 0, 0];
                  
                  const rowCells = daysArray.map(d => {
                    const dateStr = `${yearMonth}-${String(d.dayNum).padStart(2, '0')}`;
                    const record = empRecords.find(r => r.date === dateStr);
                    
                    let status: AttendanceStatus | 'H' = record ? record.status : '-';
                    
                    if (!record) {
                      // Check if it's a weekend holiday
                      if (weekendDays.includes(d.dayStr)) {
                        status = 'H';
                      }
                    }

                    if (status === 'P') pCount++;
                    if (status === 'A') aCount++;
                    if (status === 'L') lCount++;
                    if (status === 'LV') lvCount++;

                    let cellColor = 'text-slate-500 dark:text-slate-400';
                    if (status === 'P') cellColor = 'text-emerald-400 font-bold bg-emerald-500/10';
                    if (status === 'A') cellColor = 'text-rose-400 font-bold bg-rose-500/10';
                    if (status === 'L') cellColor = 'text-amber-400 font-bold bg-amber-500/10';
                    if (status === 'LV') cellColor = 'text-sky-400 font-bold bg-sky-500/10';
                    if (status === 'H') cellColor = 'text-rose-500 font-bold bg-rose-500/20'; // Red H

                    return (
                      <td key={d.dayNum} className={`border-r border-slate-800/50 ${cellColor}`} title={record?.reason || ''}>
                        {status}
                      </td>
                    );
                  });

                  return (
                    <tr key={emp.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-bold text-white text-left sticky left-0 z-10 bg-slate-900 border-r border-slate-800">
                        {emp.name}
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{emp.department}</div>
                      </td>
                      {rowCells}
                      <td className="font-bold text-emerald-400 border-r border-slate-800 sticky right-[120px] bg-slate-900">{pCount}</td>
                      <td className="font-bold text-rose-400 border-r border-slate-800 sticky right-[80px] bg-slate-900">{aCount}</td>
                      <td className="font-bold text-amber-400 border-r border-slate-800 sticky right-[40px] bg-slate-900">{lCount}</td>
                      <td className="font-bold text-sky-400 sticky right-0 bg-slate-900">{lvCount}</td>
                    </tr>
                  );
                })}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={daysInMonth + 5} className="py-10 text-slate-500 dark:text-slate-400">No active employees found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employees={employees}
        records={records}
        onSave={handleSaveRecord}
      />
    </div>
  );
};
