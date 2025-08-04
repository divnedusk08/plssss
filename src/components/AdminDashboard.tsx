import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { VolunteerLog, User } from '../lib/supabase';
import DatePicker from 'react-datepicker';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { SearchBar } from "./ui/search-bar";

type FilterState = {
  startDate: Date | null;
  endDate: Date | null;
  organization: string;
  userId: string;
};

export default function AdminDashboard() {
  const [logs, setLogs] = useState<(VolunteerLog & { user: User })[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    startDate: null,
    endDate: null,
    organization: '',
    userId: '',
  });
  // Add per-period search state
  const [periodSearches, setPeriodSearches] = useState<string[]>(Array(6).fill(''));
  // Add dashboard-wide search state
  const [searchQuery, setSearchQuery] = useState('');
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

  // Define period date ranges
  const periodRanges = [
    { name: "Six Weeks 1 (2025-2026)", start: new Date("2025-05-24"), end: new Date("2025-09-19") }, // First period
    { name: "Six Weeks 2", start: new Date("2023-09-20"), end: new Date("2023-10-31") },
    { name: "Six Weeks 3", start: new Date("2023-11-01"), end: new Date("2023-12-15") },
    { name: "Six Weeks 4", start: new Date("2023-12-16"), end: new Date("2024-02-15") },
    { name: "Six Weeks 5", start: new Date("2024-02-16"), end: new Date("2024-04-15") },
    { name: "Six Weeks 6", start: new Date("2024-04-16"), end: new Date("2024-05-31") }
  ];

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, [filters]);

  // Add periodic refresh for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLogs();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Debug: Log all logs when they change
  useEffect(() => {
    console.log('All logs in database:', logs);
  }, [logs]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    }
  };

  const fetchLogs = async () => {
    try {
      setRefreshing(true);
      let query = supabase
        .from('volunteer_log')
        .select(`
          *,
          user:users(*)
        `)
        .order('date_of_service', { ascending: false });

      if (filters.startDate) {
        query = query.gte('date_of_service', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        query = query.lte('date_of_service', filters.endDate.toISOString());
      }
      if (filters.organization) {
        query = query.eq('organization', filters.organization);
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to fetch volunteer logs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Date',
      'User',
      'Organization',
      'Description',
      'Start Time',
      'End Time',
      'Hours',
      'Proof of Service',
      'Additional Info',
    ];

    const csvData = logs.map(log => {
      const start = new Date(`1970-01-01T${log.start_time}`);
      const end = new Date(`1970-01-01T${log.end_time}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      return [
        format(new Date(log.date_of_service), 'MM/dd/yyyy'),
        `${log.user.first_name} ${log.user.last_name}`,
        log.organization,
        log.description,
        log.start_time,
        log.end_time,
        hours.toFixed(2),
        log.proof_of_service,
        log.additional_info || '',
      ];
    });

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `volunteer_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  // Filter logs and users by search query
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredLogs = normalizedQuery
    ? logs.filter(log => {
        const name = `${log.user.first_name} ${log.user.last_name}`.toLowerCase();
        const email = (log.user.email || '').toLowerCase();
        return name.includes(normalizedQuery) || email.includes(normalizedQuery);
      })
    : logs;
  const filteredUsers = normalizedQuery
    ? users.filter(user => {
        const name = `${user.first_name} ${user.last_name}`.toLowerCase();
        const email = (user.email || '').toLowerCase();
        return name.includes(normalizedQuery) || email.includes(normalizedQuery);
      })
    : users;

  // Calculate requirement met stats using filteredUsers and filteredLogs
  const requiredHours = 12; // 12 hours required per semester
  const studentHours: { [userId: string]: number } = {};
  filteredLogs.forEach(log => {
    const start = new Date(`1970-01-01T${log.start_time}`);
    const end = new Date(`1970-01-01T${log.end_time}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    studentHours[log.user.id] = (studentHours[log.user.id] || 0) + hours;
  });
  const totalStudents = filteredUsers.length;
  const metCount = filteredUsers.filter(u => (studentHours[u.id] || 0) >= requiredHours).length;
  const notMetCount = totalStudents - metCount;
  const pieData = [
    { name: 'Met', value: metCount },
    { name: 'Not Met', value: notMetCount },
  ];
  const COLORS = ['#4CAF50', '#F87171'];

  // Helper: returns filtered members for a period based on search
  function filterMembers(members: string[], query: string) {
    if (!query) return members;
    const q = query.trim().toLowerCase();
    return members.filter(name => name.toLowerCase().includes(q));
  }

  // Get users who have submitted logs in a specific period
  function getUsersInPeriod(periodIndex: number) {
    const period = periodRanges[periodIndex];
    
    // Debug log for period dates
    console.log(`Period ${periodIndex}: ${period.name}`, {
      periodStart: period.start.toISOString(),
      periodEnd: period.end.toISOString()
    });
    
    // Filter logs that fall within this period's date range
    const periodLogs = logs.filter(log => {
      // Create date objects and normalize to remove time component
      const logDate = new Date(log.date_of_service);
      logDate.setHours(0, 0, 0, 0);
      
      const periodStart = new Date(period.start);
      periodStart.setHours(0, 0, 0, 0);
      
      const periodEnd = new Date(period.end);
      periodEnd.setHours(23, 59, 59, 999); // End of day
      
      const isInPeriod = logDate >= periodStart && logDate <= periodEnd;
      
      // Debug log for each log date comparison
      if (periodIndex === 0) { // Only log for the first period to avoid console spam
        console.log(`Log date check for period ${periodIndex}:`, {
          logDate: logDate.toISOString(),
          logDateRaw: log.date_of_service,
          periodStart: periodStart.toISOString(),
          periodEnd: periodEnd.toISOString(),
          isInPeriod,
          userName: `${log.user.first_name} ${log.user.last_name}`,
          logDateTimestamp: logDate.getTime(),
          periodStartTimestamp: periodStart.getTime(),
          periodEndTimestamp: periodEnd.getTime()
        });
      }
      
      return isInPeriod;
    });
    
    // Debug log for filtered logs
    console.log(`Period ${periodIndex} logs:`, periodLogs.length);
    
    // Get unique users from these logs
    const userMap = new Map<string, { name: string, hours: number }>();
    
    periodLogs.forEach(log => {
      const userName = `${log.user.first_name} ${log.user.last_name}`;
      const start = new Date(`1970-01-01T${log.start_time}`);
      const end = new Date(`1970-01-01T${log.end_time}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      if (userMap.has(userName)) {
        const current = userMap.get(userName)!;
        userMap.set(userName, { name: userName, hours: current.hours + hours });
      } else {
        userMap.set(userName, { name: userName, hours });
      }
    });
    
    // Debug log for user hours
    if (periodIndex === 0) {
      console.log('User hours for Six Weeks 1:', Array.from(userMap.entries()));
    }
    
    // Convert to array and separate into met/not met requirements
    const userArray = Array.from(userMap.values());
    const periodRequiredHours = 2; // 2 hours required per period
    
    const accomplished = userArray
      .filter(user => user.hours >= periodRequiredHours)
      .map(user => user.name);
      
    // For not accomplished, we need to check against the full NJHS member list
    // First, get members who haven't submitted any logs for this period
    const noSubmission = njhsMembers.filter(member => 
      !userArray.some(u => u.name === member)
    );
    
    // Then, get members who submitted but didn't meet requirements
    const submittedButNotMet = userArray
      .filter(user => user.hours < periodRequiredHours)
      .map(user => user.name);
      
    // Combine both groups for the not accomplished list (FIXED: removed duplication)
    const notAccomplished = [...noSubmission, ...submittedButNotMet];
      
    return {
      accomplished,
      notAccomplished
    };
  }

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard: Volunteer Hour Progress</h2>
        <button
          onClick={() => {
            fetchLogs();
            fetchUsers();
          }}
          disabled={refreshing}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2 ${
            refreshing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {lastUpdated && (
        <p className="text-sm text-gray-500 mb-4">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
      {/* Dashboard-wide Search Bar */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by student name or email..."
          className="w-full sm:w-96 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
        />
      </div>
      {/* Pie Chart Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8 flex flex-col items-center">
        <h3 className="text-lg sm:text-xl font-bold text-primary-dark mb-3 sm:mb-4">Progress Overview</h3>
        <ResponsiveContainer width="100%" height={200} minWidth={280} minHeight={180}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} students`} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem', letterSpacing: '0.02em' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Per-Period Cards: Using actual data! */}
      <div className="space-y-6 sm:space-y-12">
        {periodRanges.map((period, periodIdx) => {
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
          return (
            <div key={period.name} className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{period.name}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {format(period.start, 'MMM d, yyyy')} - {format(period.end, 'MMM d, yyyy')}
              </p>
              {/* Per-Period Search Bar */}
              <div className="mb-4 sm:mb-6">
                <SearchBar
                  placeholder={`Search students in ${period.name}...`}
                  onSearch={setPeriodSearch}
                />
              </div>
              {/* Met Section */}
              <div className="mb-3 sm:mb-4">
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
          );
        })}
      </div>
      {/* End Per-Period Cards */}
      
      {/* ... rest of the component ... */}

        <div className="mb-6 sm:mb-8">
          <div className="mt-4 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <DatePicker
                selected={filters.startDate}
                onChange={(date) => setFilters({ ...filters, startDate: date })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <DatePicker
                selected={filters.endDate}
                onChange={(date) => setFilters({ ...filters, endDate: date })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization</label>
              <input
                type="text"
                value={filters.organization}
                onChange={(e) => setFilters({ ...filters, organization: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">User</label>
              <select
                value={filters.userId}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              >
                <option value="">All Users</option>
                {filteredUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={exportToCSV}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Export to CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mt-8 sm:mt-16">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-3xl shadow-xl border-l-8 border-indigo-400 w-full">
            <table className="w-full divide-y divide-gray-200 rounded-xl sm:rounded-3xl overflow-hidden text-sm sm:text-xl">
              <thead className="bg-gradient-to-r from-indigo-200 to-purple-200 sticky top-0 z-10">
                <tr>
                  <th className="px-3 sm:px-12 py-4 sm:py-8 text-left text-xs sm:text-2xl font-black text-indigo-900 uppercase tracking-wider sm:tracking-widest">Date</th>
                  <th className="px-3 sm:px-12 py-4 sm:py-8 text-left text-xs sm:text-2xl font-black text-indigo-900 uppercase tracking-wider sm:tracking-widest">User</th>
                  <th className="px-3 sm:px-12 py-4 sm:py-8 text-left text-xs sm:text-2xl font-black text-indigo-900 uppercase tracking-wider sm:tracking-widest">Organization</th>
                  <th className="px-3 sm:px-12 py-4 sm:py-8 text-left text-xs sm:text-2xl font-black text-indigo-900 uppercase tracking-wider sm:tracking-widest">Description</th>
                  <th className="px-3 sm:px-12 py-4 sm:py-8 text-left text-xs sm:text-2xl font-black text-indigo-900 uppercase tracking-wider sm:tracking-widest">Hours</th>
                  <th className="px-3 sm:px-12 py-4 sm:py-8 text-left text-xs sm:text-2xl font-black text-indigo-900 uppercase tracking-wider sm:tracking-widest">Proof of Service</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 sm:py-20 text-gray-400 text-lg sm:text-2xl">No volunteer logs found.</td>
                  </tr>
                ) : (
                  filteredLogs.map((log, idx) => {
                    const start = new Date(`1970-01-01T${log.start_time}`);
                    const end = new Date(`1970-01-01T${log.end_time}`);
                    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                    return (
                      <tr
                        key={log.id}
                        className={
                          (idx % 2 === 0 ? 'bg-indigo-100' : 'bg-white') +
                          ' hover:bg-purple-100 transition-colors duration-150'
                        }
                      >
                        <td className="px-3 sm:px-12 py-4 sm:py-8 whitespace-nowrap text-sm sm:text-xl text-gray-900 font-bold">{format(new Date(log.date_of_service), 'MMM d, yyyy')}</td>
                        <td className="px-3 sm:px-12 py-4 sm:py-8 whitespace-nowrap text-sm sm:text-xl text-gray-900">{log.user.first_name} {log.user.last_name}</td>
                        <td className="px-3 sm:px-12 py-4 sm:py-8 whitespace-nowrap text-sm sm:text-xl text-gray-900">{log.organization}</td>
                        <td className="px-3 sm:px-12 py-4 sm:py-8 text-sm sm:text-xl text-gray-900 max-w-xs sm:max-w-2xl truncate" title={log.description}>{log.description}</td>
                        <td className="px-3 sm:px-12 py-4 sm:py-8 whitespace-nowrap text-sm sm:text-xl text-indigo-700 font-extrabold">{hours.toFixed(2)}</td>
                        <td className="px-3 sm:px-12 py-4 sm:py-8 whitespace-nowrap text-sm sm:text-xl text-gray-900">{log.proof_of_service}</td>
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