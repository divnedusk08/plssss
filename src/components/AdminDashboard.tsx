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

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, [filters]);

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
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to fetch volunteer logs');
    } finally {
      setLoading(false);
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h2>
      {/* Dashboard-wide Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by student name or email..."
          className="w-full sm:w-96 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base"
        />
      </div>
      {/* Pie Chart Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex flex-col items-center">
        <h3 className="text-xl font-bold text-primary-dark mb-4">Progress Overview</h3>
        <ResponsiveContainer width="100%" height={260} minWidth={320} minHeight={220}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
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
              wrapperStyle={{ fontWeight: 700, color: '#111827', fontSize: '1.1rem', letterSpacing: '0.02em' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Per-Period Cards: Always Rendered! */}
      <div className="space-y-12">
        {[1,2,3,4,5,6].map((periodIdx) => {
          const periodName = `Six Weeks ${periodIdx}`;
          // Simulate realistic data: some members met requirements, some didn't
          const accomplished: string[] = njhsMembers.slice(0, Math.floor(njhsMembers.length * (0.3 + periodIdx * 0.1)));
          const notAccomplished: string[] = njhsMembers.filter(member => !accomplished.includes(member));
          const periodSearch = periodSearches[periodIdx-1] || '';
          const setPeriodSearch = (val: string) => {
            setPeriodSearches(prev => {
              const copy = [...prev];
              copy[periodIdx-1] = val;
              return copy;
            });
          };
          const filteredAccomplished = filterMembers(accomplished, periodSearch);
          const filteredNotAccomplished = filterMembers(notAccomplished, periodSearch);
          return (
            <div key={periodName} className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{periodName}</h3>
              {/* Per-Period Search Bar */}
              <div className="mb-6">
                <SearchBar
                  placeholder={`Search students in ${periodName}...`}
                  onSearch={setPeriodSearch}
                />
              </div>
              {/* Met Section */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-green-700 mb-2">Met Requirements ({filteredAccomplished.length})</h4>
                <div className="max-h-40 overflow-y-auto border border-green-200 rounded-md p-3 bg-green-50">
                  {filteredAccomplished.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-green-800">
                      {filteredAccomplished.map(member => <li key={member}>{member}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No members met the goal for this period yet.</p>
                  )}
                </div>
              </div>
              {/* Not Met Section */}
              <div>
                <h4 className="text-lg font-semibold text-red-700 mb-2">Not Met Requirements ({filteredNotAccomplished.length})</h4>
                <div className="max-h-40 overflow-y-auto border border-red-200 rounded-md p-3 bg-red-50">
                  {filteredNotAccomplished.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-red-800">
                      {filteredNotAccomplished.map(member => <li key={member}>{member}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">All members met the goal for this period!</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* End Per-Period Cards */}
      <div className="mb-8">
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <DatePicker
              selected={filters.startDate}
              onChange={(date) => setFilters({ ...filters, startDate: date })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <DatePicker
              selected={filters.endDate}
              onChange={(date) => setFilters({ ...filters, endDate: date })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization</label>
            <input
              type="text"
              value={filters.organization}
              onChange={(e) => setFilters({ ...filters, organization: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">User</label>
            <select
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Export to CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 rounded-2xl overflow-hidden">
            <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Proof of Service</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-lg">No volunteer logs found.</td>
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
                        (idx % 2 === 0 ? 'bg-gray-50' : 'bg-white') +
                        ' hover:bg-indigo-50 transition-colors duration-150'
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{format(new Date(log.date_of_service), 'MMM d, yyyy')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user.first_name} {log.user.last_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.organization}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={log.description}>{log.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700 font-semibold">{hours.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.proof_of_service}</td>
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