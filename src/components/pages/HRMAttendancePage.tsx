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
  const { user } = useAuth();
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
    if (user) {
      loadData(user.uid, yearMonth);
    }
  }, [user, yearMonth]);

  const loadData = async (uid: string, ym: string) => {
    setIsLoading(true);
    try {
      const [emps, recs, settings] = await Promise.all([
        getEmployees(uid),
        getAttendanceByMonth(uid, ym),
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
    if (!user) return;
    try {
      await saveAttendance({ ...record, userId: user.uid });
      showToast('Attendance recorded', 'success');
      loadData(user.uid, yearMonth);
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
      loadData(user!.uid, yearMonth);
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
    <div className="w-full mx-auto space-y-6">
      <div className="bg-slate-900 p-4 sm:p-5 rounded-md border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 text-white">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <h2 className="text-lg font-bold text-white">Attendance Register</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Track employee attendance for {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-md overflow-hidden">
            <button onClick={handlePrevMonth} className="px-3 py-2 hover:bg-slate-800 text-slate-400 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
            <div className="px-4 py-2 text-sm font-bold text-white min-w-[120px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <button onClick={handleNextMonth} className="px-3 py-2 hover:bg-slate-800 text-slate-400 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors text-xs font-bold shadow-md shadow-indigo-950"
          >
            <Plus className="w-3.5 h-3.5" />
            Manual Entry
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-900 border-t-indigo-500 animate-spin"></div>
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
                      <div className={`text-[9px] font-semibold ${['SAT','SUN'].includes(d.dayStr) ? 'text-rose-400' : 'text-slate-500'}`}>{d.dayStr}</div>
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

                    let cellColor = 'text-slate-500';
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
                        <div className="text-[10px] text-slate-500 font-normal">{emp.department}</div>
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
                    <td colSpan={daysInMonth + 5} className="py-10 text-slate-500">No active employees found.</td>
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
