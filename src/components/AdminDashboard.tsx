import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// Update the types to match both database schemas
type VolunteerLogFromDB = {
  id: string;
  user_email?: string;
  user_uid?: string;
  user_id?: string;  // New schema
  first_name?: string;
  last_name?: string;
  organization?: string;
  description?: string;
  proof_of_service?: string;
  time_range?: string;  // Old schema
  start_time?: string;  // New schema
  end_time?: string;    // New schema
  date?: string;        // Old schema
  date_of_service?: string;  // New schema
  hours?: number;
  additional_info?: string;
  status?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
};

export default function AdminDashboard() {
  const { user } = useAuth();
  
  // Allow specific emails to access the admin dashboard
  if (!user || (user.email !== 'divineduskdragon08@gmail.com' && user.email !== 'dhriti.erusalagandi58@k12.leanderisd.org')) {
    return <Navigate to="/dashboard" />;
  }

  const [logs, setLogs] = useState<VolunteerLogFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodSearches, setPeriodSearches] = useState<string[]>(Array(6).fill(''));
  // Add this array at the top of the component (after useState declarations):
  const njhsMembers: string[] = [
    "Annie Addison", "Stephanie Adelowokan", "Nazila Allaudin", "Anvi Alleti", "Farhan Altaf", 
    "Abigail Antony", "Rivaan Arvapalli", "Diya Babu", "Vrinda Balasani", "Kabir Baweja", 
    "Lila Belanger", "Nihaarika Bhamidipati", "Sydney Bhattacharya", "Rithvik Bomidika", "Rohan Busa", 
    "Haime Cha", "Sarah Chakkumcal", "Braden Chambers", "Colin Chambers", "Shivi Chauhan", 
    "Swara Chaukade", "Jing hao Cheng", "Atharv Choubey", "Saanvi Choubey", "Rafael De faria peixoto", 
    "Dhruv Deepak", "Saketh Donikena", "Ansh Dubey", "Eashan Emani", 
    "Dhriti Erusalagandi", "Emery Erwin", "Angelo Gauna", "Joann George", "Caleb Gore", "Kylie Hall", "Griffin Hartigan", 
    "Ashur Hasnat", "Easton Heinrich", "Camden Henry", "Kaytlin Huerta", "Harshitha Indukuri", 
    "Jashwanth Jagadeesan", "Arnav Jain", "Anwitha Jeyakumar", "Sreenandana Kamattathil saril", "Maanya Katari", 
    "Aiza Khan", "Arshiya Khanna", "Ryan Klassen", "Ashwika Konchada", "Lakshan Lakshminarayanan", 
    "Samanvi Mane", "Esther Mathew", "Grace Mccloskey", "Cade Mehrens", "Harper Miller", 
    "Harrison Miller", "Aarna Mishra", "Julia Moffitt", "Katelyn Moffitt", "Cade Morrison", 
    "Kavya Mukherjee", "Ryan Nalam", "Venkata sravan reddy Naru", "Pravin Navin", "Benjamin Newton", 
    "Reyansh Nighojkar", "James Orourke", "Soham Pachpande", "Connor Plante", "Satvik Prasad", 
    "Pranav Pratheesh", "Adhrit Premkumar", "Bella Qiu", "Eeshaan Raj", "Diya Raveendran", 
    "Vedant Rungta", "Anirudh Sathyan", "Brynn Schielein", "Yunseo Seo", "Ansh Shah", 
    "Shubh Sharma", "Avikaa Shrivastava", "Ayush Singh", "Saanvi Singh", "Shreyasha Singh", 
    "Gia Singla", "Kate Smith", "Bailey Sparrow", "Tharun Sridhar", "Laasya Sunkara", 
    "Kyra Suri", "Parker Swan", "Pavit Tamilselvan", "Truett Van daley", "Reyansh Vanga", 
    "Nikhil Vasepalli", "Brylee White", "Varun Yenna", "Jia Yoon"
  ];

  // Define six week periods
  const sixWeekPeriods = [
    { name: 'Six Weeks 1 (2025-2026)', startDate: '2025-05-09', endDate: '2025-09-19', targetHours: 2 },
    { name: 'Six Weeks 2 (2025-2026)', startDate: '2025-09-23', endDate: '2025-10-31', targetHours: 2 },
    { name: 'Six Weeks 3 (2025-2026)', startDate: '2025-11-05', endDate: '2025-12-19', targetHours: 2 },
    { name: 'Six Weeks 4 (2025-2026)', startDate: '2026-01-06', endDate: '2026-02-11', targetHours: 2 },
    { name: 'Six Weeks 5 (2025-2026)', startDate: '2026-02-17', endDate: '2026-04-10', targetHours: 2 },
    { name: 'Six Weeks 6 (2025-2026)', startDate: '2026-04-12', endDate: '2026-05-29', targetHours: 2 },
  ];

  useEffect(() => {
    fetchLogs();
  }, []);

  // Debug: Log all logs when they change
  useEffect(() => {
    console.log('All logs in database:', logs);
    console.log('Total number of logs:', logs.length);
    if (logs.length > 0) {
      console.log('Sample log:', logs[0]);
      console.log('All user names:', logs.map(log => `${log.first_name} ${log.last_name}`));
    }
  }, [logs]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      console.log('Fetching logs from Supabase...');
      
      const { data, error } = await supabase
        .from('volunteer_log')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Fetched raw logs from Supabase:', data);
      console.log('Number of logs fetched:', data?.length || 0);
      
      // Normalize the data to handle both database schemas
      const normalizedLogs = (data || []).map(log => {
        // Handle both schema types
        const isOldSchema = log.user_email && log.first_name && log.last_name;
        const isNewSchema = log.user_id && log.date_of_service;
        
        if (isOldSchema) {
          // Already in the expected format
          return log;
        } else if (isNewSchema) {
          // Convert new schema to old schema format
          return {
            ...log,
            user_email: log.user_email || '', // May not exist in new schema
            user_uid: log.user_id,
            first_name: log.first_name || 'Unknown',
            last_name: log.last_name || 'User',
            date: log.date_of_service,
            time_range: log.start_time && log.end_time ? `${log.start_time}-${log.end_time}` : '',
            // Keep other fields as-is
          };
        } else {
          // Fallback for unknown schema
          return {
            ...log,
            user_email: log.user_email || '',
            user_uid: log.user_uid || log.user_id || '',
            first_name: log.first_name || 'Unknown',
            last_name: log.last_name || 'User',
            date: log.date || log.date_of_service || '',
            time_range: log.time_range || (log.start_time && log.end_time ? `${log.start_time}-${log.end_time}` : ''),
          };
        }
      });
      
      console.log('Normalized logs:', normalizedLogs);
      setLogs(normalizedLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to fetch volunteer logs');
    } finally {
      setLoading(false);
    }
  };

  // Filter logs and users by search query
  const COLORS = ['#4CAF50', '#F44336']; // Green for met, Red for not met

  // Helper: returns filtered members for a period based on search
  const filterMembers = (members: string[], search: string): string[] => {
    if (!search.trim()) return members;
    const normalizedSearch = search.trim().toLowerCase();
    return members.filter(member => member.toLowerCase().includes(normalizedSearch));
  };

  // Get users who have submitted logs in a specific period
  function getUsersInPeriod(periodIndex: number) {
    const period = sixWeekPeriods[periodIndex];
    
    // Debug log for period dates
    console.log(`Period ${periodIndex}: ${period.name}`, {
      periodStart: period.startDate,
      periodEnd: period.endDate
    });
    
    // Filter logs that fall within this period's date range
    const periodLogs = logs.filter(log => {
      // Get the date from either schema format
      const logDateString = log.date || log.date_of_service;
      if (!logDateString) return false;
      
      // Create date objects and normalize to remove time component
      const logDate = new Date(logDateString);
      logDate.setHours(0, 0, 0, 0);
      
      const periodStart = new Date(period.startDate);
      periodStart.setHours(0, 0, 0, 0);
      
      const periodEnd = new Date(period.endDate);
      periodEnd.setHours(23, 59, 59, 999); // End of day
      
      const isInPeriod = logDate >= periodStart && logDate <= periodEnd;
      
      // Debug log for each log date comparison
      if (periodIndex === 0) { // Only log for the first period to avoid console spam
        console.log(`Log date check for period ${periodIndex}:`, {
          logDate: logDate.toISOString(),
          logDateRaw: logDateString,
          periodStart: periodStart.toISOString(),
          periodEnd: periodEnd.toISOString(),
          isInPeriod,
          userName: `${log.first_name || 'Unknown'} ${log.last_name || 'User'}`,
          logDateTimestamp: logDate.getTime(),
          periodStartTimestamp: periodStart.getTime(),
          periodEndTimestamp: periodEnd.getTime()
        });
      }
      
      return isInPeriod;
    });
    
    // Debug log for filtered logs
    console.log(`Period ${periodIndex} logs:`, periodLogs.length);
    
    // Get unique users from these logs and calculate their hours
    const userHoursMap = new Map<string, number>();
    
    periodLogs.forEach(log => {
      // Handle time_range parsing safely for both schemas
      let hours = 0;
      
      if (log.time_range) {
        // Handle old schema time_range format
        const timeParts = log.time_range.split('-');
        const startTime = timeParts[0] || '';
        const endTime = timeParts[1] || '';
        
        if (startTime && endTime) {
          try {
            const start = new Date(`1970-01-01T${startTime}`);
            const end = new Date(`1970-01-01T${endTime}`);
            hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          } catch (e) {
            console.error('Error parsing time range:', log.time_range, e);
            // Fallback to log.hours if available
            hours = log.hours || 0;
          }
        }
      } else if (log.start_time && log.end_time) {
        // Handle new schema start_time/end_time format
        try {
          const start = new Date(`1970-01-01T${log.start_time}`);
          const end = new Date(`1970-01-01T${log.end_time}`);
          hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        } catch (e) {
          console.error('Error parsing start/end time:', log.start_time, log.end_time, e);
          hours = log.hours || 0;
        }
      } else if (log.hours) {
        // Use the hours field directly if time parsing fails
        hours = log.hours;
      }
      
      // Try multiple ways to match names
      const logFullName = `${log.first_name || ''} ${log.last_name || ''}`.trim();
      const logEmail = log.user_email || '';
      
      // Find matching NJHS member
      let matchedMember = null;
      for (const member of njhsMembers) {
        const memberNormalized = member.toLowerCase().replace(/[^a-z\s]/g, '');
        const logNameNormalized = logFullName.toLowerCase().replace(/[^a-z\s]/g, '');
        
        // Direct name match
        if (memberNormalized === logNameNormalized) {
          matchedMember = member;
          break;
        }
        
        // First name + last name match
        const memberParts = member.toLowerCase().split(' ');
        const logParts = logFullName.toLowerCase().split(' ');
        if (memberParts.length >= 2 && logParts.length >= 2) {
          if (memberParts[0] === logParts[0] && memberParts[memberParts.length - 1] === logParts[logParts.length - 1]) {
            matchedMember = member;
            break;
          }
        }
        
        // Special case for Dhriti Erusalagandi
        if (member === 'Dhriti Erusalagandi' && logEmail.includes('dhriti.erusalagandi')) {
          matchedMember = member;
          break;
        }
      }
      
      if (matchedMember) {
        const currentHours = userHoursMap.get(matchedMember) || 0;
        userHoursMap.set(matchedMember, currentHours + hours);
      }
    });
    
    // Debug log for user hours
    if (periodIndex === 0) {
      console.log('User hours for Six Weeks 1:', Array.from(userHoursMap.entries()));
    }
    
    // Separate into met/not met requirements
    const periodRequiredHours = period.targetHours;
    const accomplished: string[] = [];
    const notAccomplished: string[] = [];
    
    njhsMembers.forEach(member => {
      const memberHours = userHoursMap.get(member) || 0;
      if (memberHours >= periodRequiredHours) {
        accomplished.push(member);
      } else {
        notAccomplished.push(member);
      }
    });
      
    return {
      accomplished,
      notAccomplished
    };
  }

  // Export to CSV function
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      // Create CSV headers
      const headers = ['Date', 'User', 'Organization', 'Description', 'Hours', 'Proof of Service', 'Submitted At'];
      
      // Create CSV rows
      const rows = logs.map(log => {
        // Calculate hours from time_range or start_time/end_time
        let hours = 0;
        
        if (log.time_range) {
          // Handle old schema time_range format
          const timeParts = log.time_range.split('-');
          const startTime = timeParts[0] || '';
          const endTime = timeParts[1] || '';
          
          if (startTime && endTime) {
            try {
              const start = new Date(`1970-01-01T${startTime}`);
              const end = new Date(`1970-01-01T${endTime}`);
              hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            } catch (e) {
              console.error('Error parsing time range:', log.time_range, e);
            }
          }
        } else if (log.start_time && log.end_time) {
          // Handle new schema start_time/end_time format
          try {
            const start = new Date(`1970-01-01T${log.start_time}`);
            const end = new Date(`1970-01-01T${log.end_time}`);
            hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          } catch (e) {
            console.error('Error parsing start/end time:', log.start_time, log.end_time, e);
          }
        } else if (log.hours) {
          // Use hours field if available
          hours = log.hours;
        }

        const submittedAt = log.created_at ? format(new Date(log.created_at), 'MMM d, yyyy h:mm a') : 'Not tracked';
        const logDate = log.date || log.date_of_service || '';
        
        return [
          logDate ? format(new Date(logDate), 'MMM d, yyyy') : 'Unknown',
          `${log.first_name || 'Unknown'} ${log.last_name || 'User'}`,
          log.organization || 'Unknown',
          `"${(log.description || '').replace(/"/g, '""')}"`, // Escape quotes in description
          hours.toFixed(2),
          log.proof_of_service || 'Not provided',
          submittedAt
        ];
      });

      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `volunteer_hours_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-primary-dark font-montserrat mb-4 sm:mb-0">
          Admin Dashboard: Volunteer Hour Progress
        </h1>
        <button
          onClick={exportToCSV}
          disabled={isExporting || logs.length === 0}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Exporting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export to CSV
            </>
          )}
        </button>
      </div>
      {/* Per-Period Cards: Using actual data! */}
      <div className="space-y-6 sm:space-y-12">
        {sixWeekPeriods.map((period, periodIdx) => {
          const { accomplished, notAccomplished } = getUsersInPeriod(periodIdx);
          const periodSearch = periodSearches[periodIdx] || '';
          const setPeriodSearch = (val: string) => {
            setPeriodSearches(prev => {
              const copy = [...prev];
              copy[periodIdx] = val;
              return copy;
            });
          };
          const filteredAccomplished = filterMembers(accomplished, periodSearch);
          const filteredNotAccomplished = filterMembers(notAccomplished, periodSearch);
          
          // Create pie chart data for this period
          const periodPieData = [
            { name: 'Met Requirements', value: accomplished.length, color: '#4CAF50' },
            { name: 'Not Met', value: notAccomplished.length, color: '#F44336' }
          ];
          
          return (
            <div key={period.name} className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{period.name}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {format(new Date(period.startDate), 'MMM d, yyyy')} - {format(new Date(period.endDate), 'MMM d, yyyy')}
              </p>
              
              {/* Per-Period Search Bar */}
              <div className="mb-4 sm:mb-6">
                <input
                  type="text"
                  value={periodSearch}
                  onChange={e => setPeriodSearch(e.target.value)}
                  placeholder={`Search students in ${period.name}...`}
                  className="w-full sm:w-96 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                />
              </div>

              {/* Pie Chart and Lists Layout */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Pie Chart */}
                <div className="lg:w-1/3 flex flex-col items-center">
                  <h4 className="text-base font-semibold text-gray-700 mb-3">Progress Overview</h4>
                  <div className="w-full max-w-xs">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={periodPieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {periodPieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} students`} />
                        <Legend
                          verticalAlign="bottom"
                          iconType="circle"
                          wrapperStyle={{ fontWeight: 600, fontSize: '0.75rem' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-sm text-gray-600">
                      Target: {period.targetHours} hours
                    </p>
                  </div>
                </div>

                {/* Lists */}
                <div className="lg:w-2/3 space-y-4">
                  {/* Met Section */}
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-green-700 mb-2">Met Requirements ({filteredAccomplished.length})</h4>
                    <div className="max-h-32 sm:max-h-40 overflow-y-auto border border-green-200 rounded-md p-2 sm:p-3 bg-green-50">
                      {filteredAccomplished.length > 0 ? (
                        <ul className="list-disc list-inside text-xs sm:text-sm text-green-800">
                          {filteredAccomplished.map(member => <li key={member}>{member}</li>)}
                        </ul>
                      ) : (
                        <p className="text-xs sm:text-sm text-gray-500">No members met the goal for this period yet.</p>
                      )}
                    </div>
                  </div>
                  {/* Not Met Section */}
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-red-700 mb-2">Not Met Requirements ({filteredNotAccomplished.length})</h4>
                    <div className="max-h-32 sm:max-h-40 overflow-y-auto border border-red-200 rounded-md p-2 sm:p-3 bg-red-50">
                      {filteredNotAccomplished.length > 0 ? (
                        <ul className="list-disc list-inside text-xs sm:text-sm text-red-800">
                          {filteredNotAccomplished.map(member => <li key={member}>{member}</li>)}
                        </ul>
                      ) : (
                        <p className="text-xs sm:text-sm text-gray-500">All members met the goal for this period!</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* End Per-Period Cards */}
      
      {/* ... rest of the component ... */}

        <div className="overflow-x-auto mt-4 sm:mt-8">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl shadow-lg border-l-4 border-indigo-400 w-full">
            <table className="w-full divide-y divide-gray-200 rounded-lg sm:rounded-xl overflow-hidden text-sm">
              <thead className="bg-gradient-to-r from-indigo-200 to-purple-200 sticky top-0 z-10">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-lg font-black text-indigo-900 uppercase tracking-wide">Date</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-lg font-black text-indigo-900 uppercase tracking-wide">User</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-lg font-black text-indigo-900 uppercase tracking-wide">Organization</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-lg font-black text-indigo-900 uppercase tracking-wide">Description</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-lg font-black text-indigo-900 uppercase tracking-wide">Hours</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-lg font-black text-indigo-900 uppercase tracking-wide">Proof of Service</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-lg font-black text-indigo-900 uppercase tracking-wide">Submitted At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 sm:py-8 text-gray-400" style={{fontSize: '12px'}}>No volunteer logs found.</td>
                  </tr>
                ) : (
                  logs.map((log, idx) => {
                    // Handle time_range parsing safely for both schemas
                    let hours = 0;
                    
                    if (log.time_range) {
                      // Handle old schema time_range format
                      const timeParts = log.time_range.split('-');
                      const startTime = timeParts[0] || '';
                      const endTime = timeParts[1] || '';
                      
                      if (startTime && endTime) {
                        try {
                          const start = new Date(`1970-01-01T${startTime}`);
                          const end = new Date(`1970-01-01T${endTime}`);
                          hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                        } catch (e) {
                          console.error('Error parsing time range:', log.time_range, e);
                        }
                      }
                    } else if (log.start_time && log.end_time) {
                      // Handle new schema start_time/end_time format
                      try {
                        const start = new Date(`1970-01-01T${log.start_time}`);
                        const end = new Date(`1970-01-01T${log.end_time}`);
                        hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                      } catch (e) {
                        console.error('Error parsing start/end time:', log.start_time, log.end_time, e);
                      }
                    } else if (log.hours) {
                      // Use hours field if available
                      hours = log.hours;
                    }

                    const logDate = log.date || log.date_of_service || '';
                    
                    return (
                      <tr
                        key={log.id}
                        className={
                          (idx % 2 === 0 ? 'bg-indigo-100' : 'bg-white') +
                          ' hover:bg-purple-100 transition-colors duration-150'
                        }
                      >
                        <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-gray-900 font-bold" style={{fontSize: '12px'}}>
                          {logDate ? format(new Date(logDate), 'MMM d, yyyy') : 'Unknown'}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-gray-900" style={{fontSize: '12px'}}>
                          {log.first_name || 'Unknown'} {log.last_name || 'User'}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-gray-900" style={{fontSize: '12px'}}>
                          {log.organization || 'Unknown'}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 max-w-xs sm:max-w-lg truncate" style={{fontSize: '12px'}} title={log.description || 'No description'}>
                          {log.description || 'No description'}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-indigo-700 font-extrabold" style={{fontSize: '12px'}}>
                          {hours.toFixed(2)}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-gray-900" style={{fontSize: '12px'}}>
                          {log.proof_of_service || 'Not provided'}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-gray-600" style={{fontSize: '12px'}}>
                          {log.created_at ? format(new Date(log.created_at), 'MMM d, yyyy h:mm a') : 'Not tracked'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }