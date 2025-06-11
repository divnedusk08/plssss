import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { VolunteerLog } from '../lib/supabase';

export default function VolunteerLogDashboard() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<VolunteerLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('volunteer_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date_of_service', { ascending: false });

      if (error) throw error;

      setLogs(data || []);
      calculateTotalHours(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to fetch volunteer logs');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalHours = (logs: VolunteerLog[]) => {
    const total = logs.reduce((acc, log) => {
      const start = new Date(`1970-01-01T${log.start_time}`);
      const end = new Date(`1970-01-01T${log.end_time}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return acc + hours;
    }, 0);
    setTotalHours(total);
  };

  const deleteLog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('volunteer_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLogs(logs.filter(log => log.id !== id));
      fetchLogs(); // Refresh the list and recalculate hours
    } catch (error) {
      console.error('Error deleting log:', error);
      setError('Failed to delete volunteer log');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Your Volunteer Logs</h2>
        <p className="mt-2 text-sm text-gray-600">
          Total Hours: {totalHours.toFixed(2)}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => {
              const start = new Date(`1970-01-01T${log.start_time}`);
              const end = new Date(`1970-01-01T${log.end_time}`);
              const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

              return (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(log.date_of_service), 'MMM d, yyyy')}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => deleteLog(log.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
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