import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './supabaseClient';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function SplashScreen({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary via-primary-dark to-blue-200 ${className}`}>
      <div className="mb-4 drop-shadow-lg">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="torch-intro-animated">
          {/* White circle background for contrast */}
          <circle cx="50" cy="50" r="40" fill="#fff" />
          {/* Torch body */}
          <rect x="46" y="40" width="8" height="30" rx="4" fill="#2563EB" />
          {/* Torch base */}
          <rect x="43" y="70" width="14" height="6" rx="3" fill="#FBBF24" />
          {/* Torch flame */}
          <path d="M50 30 C48 36, 54 38, 50 46 C54 42, 60 38, 50 30 Z" fill="#FBBF24" />
        </svg>
      </div>
      <h1 className="text-4xl font-extrabold font-inter text-accent drop-shadow-lg text-hover-effect">HourTrackr NJHS</h1>
      <div className="mt-2 text-xl font-montserrat text-[#FBBF24]">Service. Leadership. Citizenship. Character. Scholarship.</div>
    </div>
  );
}

function Header() {
  const { user, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-300 shadow-lg">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#FBBF24" fillOpacity="0.15" />
            <path d="M32 8C28 16 36 20 32 28C36 24 44 20 32 8Z" fill="#FBBF24"/>
            <rect x="29" y="28" width="6" height="24" rx="3" fill="#2563EB"/>
            <rect x="27" y="52" width="10" height="4" rx="2" fill="#FBBF24"/>
          </svg>
          <span className="font-montserrat text-2xl font-extrabold text-white drop-shadow">HourTrackr NJHS</span>
        </div>
        <div className="flex gap-4 items-center font-semibold">
          <Link to="/" className="font-bold text-white text-fill-hover-yellow">Home</Link>
          {user && <Link to="/log" className="font-bold text-white text-fill-hover-yellow">Log Hours</Link>}
          {user && <Link to="/dashboard" className="font-bold text-white text-fill-hover-yellow">Dashboard</Link>}
          {user && <Link to="/profile" className="font-bold text-white text-fill-hover-yellow">Profile</Link>}
          <Link to="/contact" className="font-bold text-white text-fill-hover-yellow">Contact Us</Link>
          {user && <Link to="/admin" className="font-bold text-white text-fill-hover-yellow">Admin</Link>}
          {user ? (
            <button onClick={signOut} className="ml-4 px-4 py-1.5 rounded-lg bg-accent text-primary-dark font-bold shadow hover:bg-accent-dark transition">Sign out</button>
          ) : (
            <Link to="/login" className="ml-4 px-4 py-1.5 rounded-lg bg-accent text-primary-dark font-bold shadow hover:bg-accent-dark transition">Sign in</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const homeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (homeRef.current) {
        const rect = homeRef.current.getBoundingClientRect();
        homeRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        homeRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }
    };

    const currentHomeRef = homeRef.current;
    if (currentHomeRef) {
      currentHomeRef.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (currentHomeRef) {
        currentHomeRef.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div ref={homeRef} className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 bg-white">
      {/* Removed animated-gradient-bg, parallax-container, spotlight-container, and gray/gradient backgrounds */}
      {/* Removed <div className="spotlight-overlay"></div> */}
      {/* Removed decorative blobs */}
      
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-6 fade-in">
        <div className="relative">
          <svg width="100" height="100" viewBox="0 0 64 64" fill="none" className="torch-animated" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#FBBF24" fillOpacity="0.15" />
            <path d="M32 8C28 16 36 20 32 28C36 24 44 20 32 8Z" fill="#FBBF24"/>
            <rect x="29" y="28" width="6" height="24" rx="3" fill="#2563EB"/>
            <rect x="27" y="52" width="10" height="4" rx="2" fill="#FBBF24"/>
          </svg>
          <div className="absolute inset-0 animate-ping-slow opacity-20">
            <svg width="100" height="100" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="32" fill="#FBBF24"/>
            </svg>
          </div>
        </div>
        <h1 className="text-5xl font-extrabold text-primary-dark font-montserrat mt-4 mb-2 drop-shadow">HourTrackr NJHS</h1>
        <div className="text-blue-900 text-xl font-montserrat mb-4">National Junior Honor Society</div>
      </div>

      {/* Tagline */}
      <div className="max-w-xl text-center mb-8 fade-in">
        <p className="text-2xl text-gray-800 font-montserrat mb-4 text-hover-effect">
          Log and track your NJHS volunteer hours in one place.
        </p>
      </div>

      {/* Get Started Button */}
      <button
        onClick={() => navigate(user ? '/log' : '/login')}
        className="mb-12 px-8 py-4 rounded-lg bg-primary text-white font-bold text-xl hover:bg-primary-dark transition glow-on-hover"
      >
        Get Started
      </button>

      {/* How it works section */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-50 rounded-xl shadow-xl p-6 flex flex-col items-center border-t-4 border-primary card-animated fade-in hover:shadow-2xl hover:scale-[1.02] transition-all duration-300" style={{ '--animation-delay': '0.2s' } as React.CSSProperties}>
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="torch-animated"><path d="M12 2v20M5 12h14" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <h3 className="font-bold text-primary-dark mb-2 text-lg font-montserrat text-hover-effect">Log Your Hours</h3>
          <p className="text-gray-600 text-sm font-inter text-center text-hover-effect">Submit hours easily. All submissions stored securely.</p>
        </div>
        <div className="bg-gray-50 rounded-xl shadow-xl p-6 flex flex-col items-center border-t-4 border-accent card-animated fade-in hover:shadow-2xl hover:scale-[1.02] transition-all duration-300" style={{ '--animation-delay': '0.4s' } as React.CSSProperties}>
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="torch-animated"><path d="M3 17l6-6 4 4 8-8" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <h3 className="font-bold text-primary-dark mb-2 text-lg font-montserrat text-hover-effect">Track Progress</h3>
          <p className="text-gray-600 text-sm font-inter text-center text-hover-effect">View total hours and history. Stay on top of requirements.</p>
        </div>
        <div className="bg-gray-50 rounded-xl shadow-xl p-6 flex flex-col items-center border-t-4 border-primary-dark card-animated fade-in hover:shadow-2xl hover:scale-[1.02] transition-all duration-300" style={{ '--animation-delay': '0.6s' } as React.CSSProperties}>
          <div className="w-20 h-20 bg-primary-dark/10 rounded-full flex items-center justify-center mb-4">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="torch-animated"><path d="M12 17l-5 3 1-5.5L3 9.5l5.5-.5L12 4l3.5 5 5.5.5-4 5 1 5.5z" stroke="#1e3a8a" strokeWidth="2" strokeLinejoin="round"/></svg>
          </div>
          <h3 className="font-bold text-primary-dark mb-2 text-lg font-montserrat text-hover-effect">Get Recognized</h3>
          <p className="text-gray-600 text-sm font-inter text-center text-hover-effect">Earn recognition for service and leadership. Your impact matters!</p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center mt-4 border-t-4 border-primary-dark fade-in">
        <h3 className="font-bold text-primary-dark mb-2 font-montserrat text-hover-effect">Need Help?</h3>
        <p className="text-gray-700 text-base font-inter text-hover-effect">
          Contact NJHS advisors or email <a href="mailto:dhriti.erusalagandi58@k12.leanderisd.org" className="text-primary underline hover:text-primary-dark transition-colors">dhriti.erusalagandi58@k12.leanderisd.org</a>
        </p>
      </div>

      {/* Simple Footer */}
      <footer className="w-full text-center text-gray-400 text-xs mt-12 mb-2 fade-in text-hover-effect">
        © {new Date().getFullYear()} HourTrackr NJHS. Not affiliated with National Junior Honor Society. <a href="https://www.njhs.us/" className="underline hover:text-accent">njhs.us</a>
      </footer>
    </div>
  );
}

function LogHours({ setDashboardRefreshKey }: { setDashboardRefreshKey: React.Dispatch<React.SetStateAction<number>> }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPeriod = location.state?.selectedPeriod; // Get the selected period from navigation state

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [organization, setOrganization] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [proofOfService, setProofOfService] = React.useState('');
  const [timeStart, setTimeStart] = React.useState('');
  const [timeEnd, setTimeEnd] = React.useState('');
  const [date, setDate] = React.useState(() => {
    // Pre-fill date if a period is selected and it's current/future
    if (selectedPeriod) {
      const today = new Date();
      const periodStartDate = new Date(selectedPeriod.startDate);
      const periodEndDate = new Date(selectedPeriod.endDate);

      if (today >= periodStartDate && today <= periodEndDate) {
        return today.toISOString().split('T')[0];
      } else if (today < periodStartDate) {
        return periodStartDate.toISOString().split('T')[0];
      }
    }
    return '';
  });
  const [additionalInformation, setAdditionalInformation] = React.useState(''); // New state for additional info
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setFirstName(user.user_metadata?.full_name?.split(' ')[0] || '');
      setLastName(user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '');
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  function calcHours() {
    if (!timeStart || !timeEnd) return '';
    const [sh, sm] = timeStart.split(':').map(Number);
    const [eh, em] = timeEnd.split(':').map(Number);
    let diff = (eh + em / 60) - (sh + sm / 60);
    if (diff < 0) diff += 24;
    return diff.toFixed(2);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const hours = calcHours();
    if (!hours || isNaN(Number(hours))) {
      setError('Please enter valid start and end times.');
      setIsSubmitting(false);
      return;
    }

    // Validate date against selected period if applicable
    if (selectedPeriod) {
      const enteredDate = new Date(date);
      const periodStartDate = new Date(selectedPeriod.startDate);
      const periodEndDate = new Date(selectedPeriod.endDate);

      if (enteredDate < periodStartDate || enteredDate > periodEndDate) {
        setError(`Date must be within ${selectedPeriod.startDate} and ${selectedPeriod.endDate} for ${selectedPeriod.name}.`);
        setIsSubmitting(false);
        return;
      }
    }

    console.log('Submitting hours:', {
      user_email: user.email,
      first_name: firstName,
      last_name: lastName,
      organization,
      description,
      proof_of_service: proofOfService,
      time_start: timeStart,
      time_end: timeEnd,
      date,
      hours: parseFloat(hours),
      period_name: selectedPeriod ? selectedPeriod.name : null,
      additional_info: additionalInformation, // Include new field
    });

    try {
      const { error } = await supabase
        .from('volunteer_log')
        .insert({
          user_email: user.email,
          user_uid: user.id,
          first_name: firstName,
          last_name: lastName,
          organization,
          description,
          proof_of_service: proofOfService,
          time_range: `${timeStart}-${timeEnd}`,
          date,
          hours: parseFloat(hours),
          additional_info: additionalInformation,
          status: 'approved', // Auto-approve for testing
          role: 'admin',      // <--- Add this line
        });

      if (error) throw error;
      setSubmitted(true);
      // Clear form after submission
      setOrganization('');
      setDescription('');
      setProofOfService('');
      setTimeStart('');
      setTimeEnd('');
      setDate('');
      setAdditionalInformation(''); // Clear new field
      setError('');
      setDashboardRefreshKey(prev => prev + 1); // Trigger dashboard refresh
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-10 px-4 bg-gray-100">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-primary-dark text-center font-montserrat mb-8">Log Volunteer Hours</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              id="firstName"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              readOnly // First name is pre-filled from user metadata
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              id="lastName"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              readOnly // Last name is pre-filled from user metadata
            />
          </div>

          {/* Organization */}
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
              Organization (What group or person or event did you help with? If you volunteered with other NJHS members, you would say Stiles NJHS.)<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="organization"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g., Stiles NJHS"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (tell us a little about what you did while you were there)<span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Proof of Service */}
          <div>
            <label htmlFor="proofOfService" className="block text-sm font-medium text-gray-700">
              Proof of Service (Representative email, phone number or organization contact information- If you volunteer with other NJHS members, you can say Mrs. Chenault/Mrs. Torres.)<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="proofOfService"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={proofOfService}
              onChange={(e) => setProofOfService(e.target.value)}
              required
            />
          </div>

          {/* Time Start & Finish */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="timeStart" className="block text-sm font-medium text-gray-700">What time did you start & finish?<span className="text-red-500">*</span></label>
              <input
                type="time"
                id="timeStart"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="timeEnd" className="block text-sm font-medium text-gray-700 invisible">Time End</label> {/* Invisible label for alignment */}
              <input
                type="time"
                id="timeEnd"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date you did your service:<span className="text-red-500">*</span></label>
            <input
              type="date"
              id="date"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Additional Information (Optional) */}
          <div>
            <label htmlFor="additionalInformation" className="block text-sm font-medium text-gray-700">Additional Information (Optional)</label>
            <textarea
              id="additionalInformation"
              rows={3}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={additionalInformation}
              onChange={(e) => setAdditionalInformation(e.target.value)}
            ></textarea>
          </div>

          {/* Total Hours Display */}
          <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 mt-4 text-left">
            <p className="text-lg font-semibold text-primary-dark">
              Total Hours: {calcHours()}
            </p>
          </div>

          {/* Success message just above the submit button */}
          {submitted && (
            <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg text-center">
              Hours submitted successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Hours'}
          </button>
        </form>
      </div>
    </div>
  );
}

type Log = {
  id: string;
  first_name: string;
  last_name: string;
  organization: string;
  description: string;
  proof_of_service: string;
  time_range: string;
  date: string;
  hours?: number;
  user_email?: string;
  user_uid?: string;
  status?: string;
};

function Dashboard({ dashboardRefreshKey }: { dashboardRefreshKey: number }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = React.useState<Log[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editingLog, setEditingLog] = React.useState<Log | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  // Define 6-week periods
  const sixWeekPeriods = [
    { name: 'Six Weeks 1 (2025-2026)', startDate: '2025-08-14', endDate: '2025-09-23', targetHours: 2 },
    { name: 'Six Weeks 2 (2025-2026)', startDate: '2025-09-24', endDate: '2025-11-04', targetHours: 2 },
    { name: 'Six Weeks 3 (2025-2026)', startDate: '2025-11-05', endDate: '2025-12-20', targetHours: 2 },
    { name: 'Six Weeks 4 (2025-2026)', startDate: '2026-01-07', endDate: '2026-02-18', targetHours: 2 },
    { name: 'Six Weeks 5 (2025-2026)', startDate: '2026-02-19', endDate: '2026-04-08', targetHours: 2 },
    { name: 'Six Weeks 6 (2025-2026)', startDate: '2026-04-09', endDate: '2026-05-23', targetHours: 2 },
  ];

  React.useEffect(() => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    console.log('Fetching logs for user:', user.email);
    
    const fetchLogs = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('volunteer_log')
          .select('*')
          .eq('user_email', user.email)
          .order('date', { ascending: false });

        if (fetchError) {
          console.error('Error fetching logs:', fetchError);
          setError(fetchError.message);
          return;
        }

        console.log('Fetched logs:', data);
        setLogs(data || []);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [user, dashboardRefreshKey]);

  const handleDelete = async (logId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('volunteer_log')
        .delete()
        .eq('id', logId);

      if (deleteError) throw deleteError;

      setLogs(logs.filter(log => log.id !== logId));
    } catch (err) {
      console.error('Error deleting log:', err);
      setError('Failed to delete entry');
    }
  };

  const handleEdit = async (updatedLog: Log) => {
    // Determine the six-week period for the log
    const logDate = new Date(updatedLog.date);
    const currentPeriod = sixWeekPeriods.find(period => {
      const start = new Date(period.startDate);
      const end = new Date(period.endDate);
      return logDate >= start && logDate <= end;
    });

    // Prevent editing if the period has ended
    if (currentPeriod && new Date() > new Date(currentPeriod.endDate)) {
      alert('Cannot edit logs for a past six-week period.');
      setEditingLog(null);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('volunteer_log')
        .update(updatedLog)
        .eq('id', updatedLog.id);

      if (updateError) throw updateError;

      setLogs(logs.map(log => log.id === updatedLog.id ? updatedLog : log));
      setEditingLog(null);
    } catch (err) {
      console.error('Error updating log:', err);
      setError('Failed to update entry');
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) throw new Error('Could not open print window');

      // Create the HTML content
      const content = `
        <html>
          <head>
            <title>Volunteer Hours Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              .header { text-align: center; margin-bottom: 20px; }
              .total { margin-top: 20px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Volunteer Hours Report</h1>
              <p>Student: ${user?.user_metadata?.full_name || user?.email}</p>
              <p>Generated: ${new Date().toLocaleDateString()}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Organization</th>
                  <th>Description</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                ${logs.map(log => `
                  <tr>
                    <td>${log.date}</td>
                    <td>${log.organization}</td>
                    <td>${log.description}</td>
                    <td>${log.hours?.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">
              Total Hours: ${logs.reduce((sum, log) => sum + (log.hours || 0), 0).toFixed(2)}
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    } catch (err) {
      console.error('Error exporting to PDF:', err);
      setError('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  if (!user) return <Navigate to="/login" />;
  
  const totalHours = logs.reduce((sum, l) => sum + (l.hours || 0), 0);
  
  return (
    <div className="max-w-7xl mx-auto my-6 p-4 bg-white rounded-2xl shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-3xl font-extrabold text-primary-dark font-montserrat">Your Volunteer Hours</h2>
        <div className="flex flex-col items-end gap-2">
          <div className="text-gray-600 text-sm font-medium">Today: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div className="flex gap-4">
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Report
                </>
              )}
            </button>
            <div className="bg-accent text-primary-dark font-bold px-6 py-2 rounded-lg shadow text-lg">
              Total Hours: {totalHours.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars for each Six Weeks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {sixWeekPeriods.map((period) => {
          const periodLogs = logs.filter(log => {
            const logDate = new Date(log.date);
            const startDate = new Date(period.startDate);
            const endDate = new Date(period.endDate);
            return logDate >= startDate && logDate <= endDate;
          });
          const periodHours = periodLogs.reduce((sum, log) => sum + (log.hours || 0), 0);
          const periodProgress = Math.min((periodHours / period.targetHours) * 100, 100);

          return (
            <div key={period.name} 
            className="bg-white rounded-xl shadow-md p-4 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/log', { state: { selectedPeriod: period } })}
            >
              <h3 className="font-bold text-lg text-primary-dark mb-2">{period.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{period.startDate} - {period.endDate}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Hours: {periodHours.toFixed(2)} / {period.targetHours}</span>
                <span className="text-sm font-medium text-gray-600">{periodProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${periodProgress >= 100 ? 'bg-green-500' : 'bg-primary'}`}
                  style={{ width: `${periodProgress}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          Error: {error}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-gray-500 text-center p-4">No submissions yet. Log your first hours!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-t rounded-lg overflow-hidden">
            <thead className="bg-primary text-white font-bold sticky top-0 z-10">
              <tr>
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Organization</th>
                <th className="py-2 px-2">Description</th>
                <th className="py-2 px-2">Hours</th>
                <th className="py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => {
                const logDate = new Date(log.date);
                const canEditDelete = !sixWeekPeriods.some(period => {
                  const endDate = new Date(period.endDate);
                  return logDate >= new Date(period.startDate) && logDate <= endDate && new Date() > endDate;
                });

                return (
                  <tr key={log.id} className={i % 2 === 0 ? 'bg-background' : 'bg-white'}>
                    <td className="py-2 px-2">{log.date}</td>
                    <td className="py-2 px-2">{log.organization}</td>
                    <td className="py-2 px-2">{log.description}</td>
                    <td className="py-2 px-2 font-bold">{log.hours?.toFixed(2)}</td>
                    <td className="py-2 px-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingLog(log)}
                          className={`text-primary hover:text-primary-dark transition-colors ${
                            canEditDelete ? '' : 'opacity-50 cursor-not-allowed'
                          }`}
                          disabled={!canEditDelete}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          className={`text-red-500 hover:text-red-700 transition-colors ${
                            canEditDelete ? '' : 'opacity-50 cursor-not-allowed'
                          }`}
                          disabled={!canEditDelete}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingLog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full z-60">
            <h3 className="text-xl font-bold mb-4">Edit Entry</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEdit(editingLog);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={editingLog.date}
                    onChange={e => setEditingLog({...editingLog, date: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organization</label>
                  <input
                    type="text"
                    value={editingLog.organization}
                    onChange={e => setEditingLog({...editingLog, organization: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editingLog.description}
                    onChange={e => setEditingLog({...editingLog, description: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hours</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingLog.hours}
                    onChange={e => setEditingLog({...editingLog, hours: parseFloat(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditingLog(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Admin({ dashboardRefreshKey }: { dashboardRefreshKey: any }) {
  const { user } = useAuth();
  // Allow all logged-in users to access the admin dashboard
  if (!user) return <Navigate to="/dashboard" />;
  const [allLogs, setAllLogs] = React.useState<Log[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Define sixWeekPeriods for use in processPeriodData and rendering
  const sixWeekPeriods = [
    { name: 'Six Weeks 1 (2025-2026)', startDate: '2025-08-14', endDate: '2025-09-23', targetHours: 2 },
    { name: 'Six Weeks 2 (2025-2026)', startDate: '2025-09-24', endDate: '2025-11-04', targetHours: 2 },
    { name: 'Six Weeks 3 (2025-2026)', startDate: '2025-11-05', endDate: '2025-12-20', targetHours: 2 },
    { name: 'Six Weeks 4 (2025-2026)', startDate: '2026-01-07', endDate: '2026-02-18', targetHours: 2 },
    { name: 'Six Weeks 5 (2025-2026)', startDate: '2026-02-19', endDate: '2026-04-08', targetHours: 2 },
    { name: 'Six Weeks 6 (2025-2026)', startDate: '2026-04-09', endDate: '2026-05-23', targetHours: 2 },
  ];

  // Move fetchAllLogs to outer scope so it can be used in both useEffects
  const fetchAllLogs = React.useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('volunteer_log')
        .select('*')
        .order('date', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }
      setAllLogs(data || []);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchAllLogs();
  }, [dashboardRefreshKey, fetchAllLogs]);

  React.useEffect(() => {
    const subscription = supabase
      .channel('volunteer_log_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'volunteer_log' }, () => {
        // Re-fetch logs when any change happens
        fetchAllLogs();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchAllLogs]);

  const processPeriodData = (period: any) => {
    const accomplished: string[] = [];
    const notAccomplished: string[] = [];

    // 1. Filter logs for this period only
    const logsInPeriod = allLogs.filter(log => {
      const logDate = new Date(log.date);
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      // Include logs that are approved or have no status (null/undefined) for backward compatibility
      return logDate >= startDate && logDate <= endDate && (log.status === 'approved' || !log.status);
    });

    console.log(`\n=== PERIOD: ${period.name} ===`);
    console.log(`Period dates: ${period.startDate} to ${period.endDate}`);
    console.log(`Total logs in database: ${allLogs.length}`);
    console.log(`Logs in period: ${logsInPeriod.length}`);
    
    // Debug: Show all logs and their status
    allLogs.forEach(log => {
      const logDate = new Date(log.date);
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      const inPeriod = logDate >= startDate && logDate <= endDate;
      const statusOk = log.status === 'approved' || !log.status;
      console.log(`  Log: ${log.first_name} ${log.last_name} - Date: ${log.date} - Status: "${log.status}" - In period: ${inPeriod} - Status OK: ${statusOk}`);
    });

    njhsMembers.forEach(memberName => {
      // Normalize the member name from the list (e.g., "Annie Addison" -> "annieaddison", "divineduskdragon" -> "divineduskdragon")
      const memberNameNormalized = memberName.toLowerCase().replace(/[^a-z]/g, '');
      console.log(`\n=== Processing member: ${memberName} (Normalized: ${memberNameNormalized}) ===`);
      
      // For this member, filter logs in this period that match
      const memberLogs = logsInPeriod.filter(log => {
        const logFirstName = (log.first_name || '').toLowerCase().replace(/[^a-z]/g, '');
        const logLastName = (log.last_name || '').toLowerCase().replace(/[^a-z]/g, '');
        const combinedFullName = `${logFirstName}${logLastName}`;
        const logEmailPrefix = (log.user_email || '').split('@')[0].toLowerCase().replace(/[^a-z]/g, '');
        
        console.log(`  Checking log: ${log.first_name} ${log.last_name} (${log.user_email})`);
        console.log(`    Normalized: firstName="${logFirstName}", lastName="${logLastName}", combined="${combinedFullName}", emailPrefix="${logEmailPrefix}"`);
        
        // Flexible matching: match if any normalized field contains or equals the member name
        return (
          combinedFullName === memberNameNormalized ||
          combinedFullName.includes(memberNameNormalized) ||
          logFirstName === memberNameNormalized ||
          logLastName === memberNameNormalized ||
          logFirstName.includes(memberNameNormalized) ||
          logLastName.includes(memberNameNormalized) ||
          logEmailPrefix === memberNameNormalized ||
          logEmailPrefix.includes(memberNameNormalized)
        );
      });
      
      const totalHours = memberLogs.reduce((sum, log) => sum + (log.hours || 0), 0);
      console.log(`  Total hours for ${memberName}: ${totalHours} (target: ${period.targetHours})`);
      
      if (totalHours >= period.targetHours) {
        accomplished.push(memberName);
      } else {
        notAccomplished.push(memberName);
      }
    });

    return {
      accomplishedCount: accomplished.length,
      notAccomplishedCount: notAccomplished.length,
      accomplishedMembers: accomplished,
      notAccomplishedMembers: notAccomplished,
    };
  };

  const COLORS = ['#4CAF50', '#F44336']; // Green for accomplished, Red for not accomplished

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-primary-dark font-montserrat mb-8 text-center">Admin Dashboard: Volunteer Hour Compliance</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          Error: {error}
        </div>
      ) : (
        <div className="space-y-12">
          {sixWeekPeriods.map((period) => {
            const { accomplishedCount, notAccomplishedCount, accomplishedMembers, notAccomplishedMembers } = processPeriodData(period);
            const data = [
              { name: 'Accomplished', value: accomplishedCount },
              { name: 'Not Accomplished', value: notAccomplishedCount },
            ];

            return (
              <div key={period.name} className="border border-gray-200 rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-primary-dark mb-4">{period.name} ({period.startDate} - {period.endDate})</h3>
                <p className="text-gray-700 mb-4">Target Hours: {period.targetHours}</p>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="w-full md:w-1/2 h-64 flex justify-center items-center">
                    {accomplishedCount === 0 && notAccomplishedCount === 0 ? (
                      <p className="text-gray-500">No data available for this period.</p>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {data.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="w-full md:w-1/2 space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-green-700 mb-2">Accomplished ({accomplishedMembers.length})</h4>
                      <div className="max-h-40 overflow-y-auto border border-green-200 rounded-md p-3 bg-green-50">
                        {accomplishedMembers.length > 0 ? (
                          <ul className="list-disc list-inside text-sm text-green-800">
                            {accomplishedMembers.map(member => <li key={member}>{member}</li>)}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No members accomplished the goal for this period yet.</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-red-700 mb-2">Not Accomplished ({notAccomplishedMembers.length})</h4>
                      <div className="max-h-40 overflow-y-auto border border-red-200 rounded-md p-3 bg-red-50">
                        {notAccomplishedMembers.length > 0 ? (
                          <ul className="list-disc list-inside text-sm text-red-800">
                            {notAccomplishedMembers.map(member => <li key={member}>{member}</li>)}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">All members accomplished the goal for this period!</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Login() {
  const { signInWithGoogle, loading, user } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [authLoading, setAuthLoading] = React.useState(false);
  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin');

  if (user) return <Navigate to="/dashboard" />;

  // Email/password sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('Invalid login credentials. Please check your email and password.');
      } else if (data.user) {
        // Success - user will be redirected automatically
        console.log('Sign in successful:', data.user.email);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Sign in failed. Please try again.');
    }
    setAuthLoading(false);
  };

  // Email/password sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        setError(error.message);
      } else if (data.user) {
        if (data.user.email_confirmed_at) {
          // User is already confirmed (email confirmation disabled)
          setSuccess('Account created successfully! You can now sign in.');
          setError('');
          setMode('signin');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        } else {
          // Email confirmation required
          setSuccess('Check your email for a confirmation link! Please confirm your email before signing in.');
          setError('');
          setMode('signin');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError('Sign up failed. Please try again.');
    }
    setAuthLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-2xl border-t-4 border-primary flex flex-col items-center">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-2">
          <circle cx="32" cy="32" r="32" fill="#FBBF24" fillOpacity="0.15" />
          <path d="M32 8C28 16 36 20 32 28C36 24 44 20 32 8Z" fill="#FBBF24"/>
          <rect x="29" y="28" width="6" height="24" rx="3" fill="#2563EB"/>
          <rect x="27" y="52" width="10" height="4" rx="2" fill="#FBBF24"/>
        </svg>
        <h2 className="text-center text-3xl font-extrabold text-primary-dark font-montserrat mt-4 mb-2 drop-shadow text-hover-effect">
          HourTrackr NJHS
        </h2>
        <p className="text-center text-base text-gray-600 font-inter mb-4">
          Welcome! {mode === 'signin' ? 'Sign in to log and track your NJHS volunteer hours.' : 'Sign up to create your account.'}
        </p>
        {mode === 'signin' ? (
          <form className="w-full space-y-4" onSubmit={handleSignIn}>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675m1.675-2.325A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.234-.938 4.675m-1.675 2.325A9.956 9.956 0 0112 21c-1.657 0-3.234-.336-4.675-.938m-2.325-1.675A9.956 9.956 0 013 12c0-1.657.336-3.234.938-4.675" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.642 1.624-1.09 2.354M15.54 15.54A9.956 9.956 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675" /></svg>
                  )}
                </button>
              </div>
            </div>
            {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
            {success && <div className="text-green-600 text-sm font-semibold">{success}</div>}
            <div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition"
              >
                {authLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
            <div className="text-center text-sm mt-2">
              Don't have an account?{' '}
              <button type="button" className="text-primary underline hover:text-primary-dark" onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}>
                Sign up
              </button>
            </div>
          </form>
        ) : (
          <form className="w-full space-y-4" onSubmit={handleSignUp}>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675m1.675-2.325A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.234-.938 4.675m-1.675 2.325A9.956 9.956 0 0112 21c-1.657 0-3.234-.336-4.675-.938m-2.325-1.675A9.956 9.956 0 013 12c0-1.657.336-3.234.938-4.675" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.642 1.624-1.09 2.354M15.54 15.54A9.956 9.956 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675" /></svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
            {success && <div className="text-green-600 text-sm font-semibold">{success}</div>}
            <div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2 rounded-lg bg-accent text-primary-dark font-bold hover:bg-accent-dark transition"
              >
                {authLoading ? 'Signing up...' : 'Sign Up'}
              </button>
            </div>
            <div className="text-center text-sm mt-2">
              Already have an account?{' '}
              <button type="button" className="text-primary underline hover:text-primary-dark" onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}>
                Back to Sign In
              </button>
            </div>
          </form>
        )}
        <div className="w-full flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-gray-400 font-semibold">or sign in with Google</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full flex justify-center py-3 px-6 border border-transparent text-lg font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-dark transition shadow-md transform hover:scale-105"
        >
          <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.675 12.187c0-.79-.062-1.572-.19-2.344H12v4.46h6.474c-.295 1.488-1.157 2.774-2.502 3.633v2.96h3.818c2.23-2.052 3.511-5.074 3.511-8.71z" fill="#4285F4"/>
            <path d="M12 23c3.245 0 5.99-1.082 7.98-2.939l-3.819-2.96c-1.047.7-2.345 1.11-3.959 1.11-3.046 0-5.63-2.052-6.557-4.806H1.996v2.96A11.002 11.002 0 0012 23z" fill="#34A853"/>
            <path d="M5.443 14.28c-.247-.7-.386-1.44-.386-2.28s.139-1.58.386-2.28V6.76H1.996a10.973 10.973 0 000 10.48L5.443 14.28z" fill="#FBBC05"/>
            <path d="M12 4.757c1.777 0 3.351.61 4.597 1.775l3.327-3.327C17.983 1.258 15.238 0 12 0A11.002 11.002 0 001.996 6.76l3.447 2.64C6.37 6.809 8.954 4.757 12 4.757z" fill="#EA4335"/>
          </svg>
          <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>
      </div>
    </div>
  );
}

function ContactUs() {
  const njhsOfficers = [
    { name: 'Dhriti Erusalagandi', email: 'dhriti.erusalagandi58@k12.leanderisd.org' },
    { name: 'Kavya Mukherjee', email: 'kavya.mukherjee18@k12.leanderisd.org' },
    { name: 'Aarna Mishra', email: 'aarna.mishra63@k12.leanderisd.org' },
    { name: 'Adhrit Premkumar', email: 'adhrit.premkumar33@k12.leanderisd.org' },
    { name: 'Arshiya Khanna', email: 'arshiya.khanna47@k12.leanderisd.org' },
    { name: 'Sree Saril', email: 'sreenandana.kamattathilsaril62@k12.leanderisd.org' },
  ];

  const njhsAdvisors = [
    { name: 'Karen Currie', email: 'karen.currie@leanderisd.org' },
    { name: 'Kellie Bruce', email: 'kellie.bruce@leanderisd.org' },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-3xl shadow-2xl font-inter">
      <h2 className="text-4xl font-extrabold text-primary-dark font-montserrat mb-10 text-center">Contact Us</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-primary hover:shadow-xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-primary-dark mb-4 border-b-2 border-primary-light pb-2">NJHS Officers</h3>
          <ul className="space-y-4">
            {njhsOfficers.map((officer, index) => {
              const [firstName, ...lastNameParts] = officer.name.split(' ');
              const lastName = lastNameParts.join(' ');
              return (
                <li key={index} className="flex items-center text-gray-800">
                  <div className="flex items-center space-x-3 flex-shrink-0 w-[180px]">
                    <svg className="w-6 h-6 text-primary-dark" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                    <div className="flex flex-col">
                      <span className="text-lg font-medium">{firstName}</span>
                      {lastName && <span className="text-base text-gray-600">{lastName}</span>}
                    </div>
                  </div>
                  <a href={`mailto:${officer.email}`} className="text-primary hover:text-primary-dark underline transition-colors text-base font-medium flex-grow overflow-hidden whitespace-nowrap text-ellipsis ml-2">
                    {officer.email}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-accent hover:shadow-xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-primary-dark mb-4 border-b-2 border-primary-light pb-2">NJHS Advisors</h3>
          <ul className="space-y-4">
            {njhsAdvisors.map((advisor, index) => {
              const [firstName, ...lastNameParts] = advisor.name.split(' ');
              const lastName = lastNameParts.join(' ');
              return (
                <li key={index} className="flex items-center text-gray-800">
                  <div className="flex items-center space-x-3 flex-shrink-0 w-[180px]">
                    <svg className="w-6 h-6 text-primary-dark" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                    <div className="flex flex-col">
                      <span className="text-lg font-medium">{firstName}</span>
                      {lastName && <span className="text-base text-gray-600">{lastName}</span>}
                    </div>
                  </div>
                  <a href={`mailto:${advisor.email}`} className="text-primary hover:text-primary-dark underline transition-colors text-base font-medium flex-grow overflow-hidden whitespace-nowrap text-ellipsis ml-2">
                    {advisor.email}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="text-center text-gray-600 mt-10 text-lg">
        For general inquiries, please reach out to the advisors or use the emails listed above.
      </p>
    </div>
  );
}

function Profile() {
  const { user } = useAuth();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [profilePicture, setProfilePicture] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (user) {
      setFirstName(user.user_metadata?.full_name?.split(' ')[0] || '');
      setLastName(user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '');
      setProfilePicture(user.user_metadata?.avatar_url || '');
    }
  }, [user]);

  // Remove debug message from click handler
  const handleProfilePictureClick = () => {
    if (isUploading) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      setError('File input ref is not set!');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (!user) {
      setError('You must be logged in to upload a profile picture.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        setError('Upload error: ' + uploadError.message);
        return;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      if (!publicUrl) {
        setError('Failed to get public URL for uploaded image.');
        return;
      }

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          avatar_url: publicUrl,
          full_name: `${firstName} ${lastName}`.trim()
        }
      });

      if (updateError) {
        setError('Profile update error: ' + updateError.message);
        return;
      }

      setProfilePicture(publicUrl);
    } catch (error: any) {
      setError('Error uploading profile picture: ' + (error.message || error.toString()));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          avatar_url: profilePicture // Preserve the avatar URL
        }
      });

      if (updateError) throw updateError;
      setIsEditing(false);
      setError('');
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    }
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 font-inter">
        <h2 className="text-3xl font-extrabold mb-8 text-primary-dark text-center font-montserrat">Your Profile</h2>
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}
        <div className="flex flex-col items-center space-y-6">
          {/* Profile Picture */}
          <div 
            className={`relative group w-32 h-32 rounded-full overflow-hidden cursor-pointer border-4 border-primary hover:border-primary-dark transition-all duration-300 flex items-center justify-center ${isUploading ? 'opacity-50' : ''}`}
            tabIndex={0}
            onClick={handleProfilePictureClick}
          >
            {profilePicture ? (
              <img 
                key={profilePicture}
                src={profilePicture} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => { 
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=2563EB&color=fff&size=128`;
                }}
              />
            ) : (
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=2563EB&color=fff&size=128`} 
                alt="Default Profile" 
                className="w-full h-full object-cover"
              />
            )}
            {/* PATCH: Un-hide file input for direct testing */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          {/* Profile Information */}
          <div className="w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1">First Name</label>
                <input
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1">Last Name</label>
                <input
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1">Email</label>
              <input
                value={user.email}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-100"
              />
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setError('');
                    // Reset to original values
                    setFirstName(user.user_metadata?.full_name?.split(' ')[0] || '');
                    setLastName(user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '');
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppRoutes({ setDashboardRefreshKey, dashboardRefreshKey }: { setDashboardRefreshKey: React.Dispatch<React.SetStateAction<number>>, dashboardRefreshKey: number }) {
  const { loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-primary-light text-xl font-semibold font-montserrat text-primary-dark">Loading...</div>;
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/log" element={<LogHours setDashboardRefreshKey={setDashboardRefreshKey} />} />
      <Route path="/dashboard" element={<Dashboard dashboardRefreshKey={dashboardRefreshKey} />} />
      <Route path="/admin" element={<Admin dashboardRefreshKey={dashboardRefreshKey} />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function Footer() {
  return (
    <footer className="bg-primary text-white text-center py-4">
      <div>© 2025 HourTrackr NJHS. All rights reserved.</div>
      <div className="text-xs mt-1">Not affiliated with National Junior Honor Society. For official info, visit <a href="https://www.njhs.us/" className="underline hover:text-accent">njhs.us</a>.</div>
    </footer>
  );
}

export default function WrappedApp() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [isFadingOut, setIsFadingOut] = React.useState(false);
  const [dashboardRefreshKey, setDashboardRefreshKey] = React.useState(0);

  React.useEffect(() => {
    const splashDuration = 2000; // Adjusted duration for a longer splash screen animation
    const fadeOutDuration = 100; // Fade out duration remains

    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, splashDuration);

    const hideSplashTimer = setTimeout(() => {
      setShowSplash(false);
    }, splashDuration + fadeOutDuration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideSplashTimer);
    };
  }, []);

  return (
    <AuthProvider>
      {showSplash ? (
        <SplashScreen className={isFadingOut ? 'fade-out' : ''} />
      ) : (
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow fade-in bg-white">
              <AppRoutes setDashboardRefreshKey={setDashboardRefreshKey} dashboardRefreshKey={dashboardRefreshKey} />
            </main>
            <Footer />
          </div>
        </Router>
      )}
    </AuthProvider>
  );
}