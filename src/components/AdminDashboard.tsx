import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { VolunteerLog, User } from '../lib/supabase';
import DatePicker from 'react-datepicker';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [searchQuery, setSearchQuery] = useState('');

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
      {/* Per-Period Cards (example for 6 periods) */}
      <div className="space-y-12">
        {[1,2,3,4,5,6].map((periodIdx) => {
          // Replace with your actual period data/logic
          const periodName = `Six Weeks ${periodIdx}`;
          // Example: get accomplished and notAccomplished arrays for this period
          const accomplished = [/* ... */]; // Fill with actual data
          const notAccomplished = [/* ... */]; // Fill with actual data
          const [periodSearch, setPeriodSearch] = React.useState('');
          const filteredAccomplished = filterMembers(accomplished, periodSearch);
          const filteredNotAccomplished = filterMembers(notAccomplished, periodSearch);
          return (
            <div key={periodName} className="border border-gray-200 rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-primary-dark mb-4">{periodName}</h3>
              {/* Per-Period Search Bar */}
              <div className="mb-4 flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={periodSearch}
                  onChange={e => setPeriodSearch(e.target.value)}
                  placeholder={`Search students in ${periodName}...`}
                  className="w-full sm:w-96 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base"
                />
              </div>
              {/* Met Section */}
              <div>
                <h4 className="text-lg font-semibold text-green-700 mb-2">Met ({filteredAccomplished.length})</h4>
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
                <h4 className="text-lg font-semibold text-red-700 mb-2">Not Met ({filteredNotAccomplished.length})</h4>
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proof of Service
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.map((log) => {
              const start = new Date(`1970-01-01T${log.start_time}`);
              const end = new Date(`1970-01-01T${log.end_time}`);
              const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

              return (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(log.date_of_service), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.user.first_name} {log.user.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.organization}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {log.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hours.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.proof_of_service}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No volunteer logs found.</p>
        </div>
      )}
    </div>
  );
} 