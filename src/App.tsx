import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './supabaseClient';

function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary via-primary-dark to-blue-200">
      <div className="mb-4 drop-shadow-lg">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
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
      <h1 className="text-4xl font-extrabold font-montserrat text-accent drop-shadow-lg">HourTrackr NJHS</h1>
      <div className="mt-2 text-lg font-inter text-accent">Service. Leadership. Citizenship. Character. Scholarship.</div>
    </div>
  );
}

function Header() {
  const { user, signOut } = useAuth();
  const isAdmin = user?.email === 'dhriti.erusalagandi58@k12.leanderisd.org';
  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-primary via-primary-dark to-accent shadow-lg">
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
          <Link to="/" className="hover:underline text-white">Home</Link>
          {user && <Link to="/log" className="hover:underline text-white">Log Hours</Link>}
          {user && <Link to="/dashboard" className="hover:underline text-white">Dashboard</Link>}
          {user && isAdmin && <Link to="/admin" className="hover:underline text-yellow-300">Admin</Link>}
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
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 bg-background">
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-6">
        <svg width="72" height="72" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="#2563EB" fillOpacity="0.10" />
          <path d="M32 8C28 16 36 20 32 28C36 24 44 20 32 8Z" fill="#2563EB"/>
          <rect x="29" y="28" width="6" height="24" rx="3" fill="#2563EB"/>
          <rect x="27" y="52" width="10" height="4" rx="2" fill="#2563EB"/>
        </svg>
        <h1 className="text-5xl font-extrabold text-primary-dark font-montserrat mt-2 mb-1 drop-shadow">HourTrackr NJHS</h1>
        <div className="text-blue-900 text-lg font-montserrat mb-2">National Junior Honor Society</div>
      </div>
      {/* About Section */}
      <div className="max-w-2xl text-center mb-8">
        <p className="text-lg text-gray-700 font-inter mb-2">
          HourTrackr NJHS is the official platform for members to log and track their volunteer hours. Stay organized, see your progress, and help us celebrate your service.
        </p>
        <p className="text-base text-gray-500 font-inter">
          NJHS recognizes outstanding middle school students who demonstrate excellence in scholarship, service, leadership, character, and citizenship.
        </p>
      </div>
      {/* How It Works */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border-t-4 border-primary">
          <h3 className="font-bold text-primary-dark mb-2 text-lg font-montserrat">Log Your Hours</h3>
          <p className="text-gray-600 text-sm font-inter">Submit your volunteer service quickly and easily with our streamlined form. All your submissions are securely stored and accessible anytime.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border-t-4 border-accent">
          <h3 className="font-bold text-primary-dark mb-2 text-lg font-montserrat">Track Progress</h3>
          <p className="text-gray-600 text-sm font-inter">View your total hours, see your history, and stay on top of your NJHS requirements with a clear, organized dashboard.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start border-t-4 border-primary-dark">
          <h3 className="font-bold text-primary-dark mb-2 text-lg font-montserrat">Get Recognized</h3>
          <p className="text-gray-600 text-sm font-inter">Earn recognition for your service and leadership in your school and community. Your impact matters!</p>
        </div>
      </div>
      {/* Contact/Help Section */}
      <div className="bg-white rounded-xl shadow p-6 max-w-xl w-full text-center mt-4 border-t-4 border-primary-dark">
        <h3 className="font-bold text-primary-dark mb-1 font-montserrat">Need Help?</h3>
        <p className="text-gray-600 text-sm mb-2 font-inter">Contact your NJHS sponsor or email <a href="mailto:dhriti.erusalagandi58@k12.leanderisd.org" className="text-primary underline">dhriti.erusalagandi58@k12.leanderisd.org</a> for support.</p>
      </div>
    </div>
  );
}

function LogHours() {
  const { user } = useAuth();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [organization, setOrganization] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [proofOfService, setProofOfService] = React.useState('');
  const [timeStart, setTimeStart] = React.useState('');
  const [timeEnd, setTimeEnd] = React.useState('');
  const [date, setDate] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

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
    const hours = calcHours();
    if (!hours || isNaN(Number(hours))) {
      setError('Please enter valid start and end times.');
      return;
    }
    const { error } = await supabase.from('volunteer_logs').insert([
      {
        user_email: user.email,
        first_name: firstName,
        last_name: lastName,
        organization,
        description,
        proof_of_service: proofOfService,
        time_range: `${timeStart} - ${timeEnd}`,
        date,
        hours: Number(hours),
        user_uid: user.id,
      }
    ]);
    if (!error) {
      setSubmitted(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    } else {
      setError('Error submitting hours: ' + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-primary-light via-accent-light to-primary-dark">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 font-inter">
        <h2 className="text-3xl font-extrabold mb-6 text-primary-dark text-center font-montserrat">Log Volunteer Hours</h2>
        {submitted ? (
          <div className="text-green-600 font-semibold text-center text-lg">✅ Submitted Successfully!</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1">First Name*</label>
                <input required value={firstName} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1">Last Name*</label>
                <input required value={lastName} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary-dark mb-1">Email*</label>
                <input required value={user.email} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1">Organization*</label>
              <input required value={organization} onChange={e => setOrganization(e.target.value)} placeholder="Stiles NJHS" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1">Description*</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1">Representative Email or Phone Number*</label>
              <input required value={proofOfService} onChange={e => setProofOfService(e.target.value)} placeholder="Contact info or Mrs. Chenault/Mrs. Torres" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1">Start Time*</label>
                <input required type="time" value={timeStart} onChange={e => setTimeStart(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1">End Time*</label>
                <input required type="time" value={timeEnd} onChange={e => setTimeEnd(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1">Date you did your service*</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-primary-dark font-semibold">Total Hours:</span>
              <span className="text-lg font-bold">{calcHours() || '--'}</span>
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <button type="submit" className="w-full py-2 px-4 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition shadow">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
}

type Log = {
  first_name: string;
  last_name: string;
  organization: string;
  description: string;
  proof_of_service: string;
  time_range: string;
  date: string;
  hours?: number;
};

function Dashboard() {
  const { user } = useAuth();
  const [logs, setLogs] = React.useState<Log[]>([]);
  React.useEffect(() => {
    if (!user) return;
    supabase
      .from('volunteer_logs')
      .select('*')
      .eq('user_email', user.email)
      .order('date', { ascending: false })
      .then(({ data }) => setLogs(data || []));
  }, [user]);
  if (!user) return <Navigate to="/login" />;
  const totalHours = logs.reduce((sum, l) => sum + (l.hours || 0), 0);
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-3xl font-extrabold text-primary-dark font-montserrat">Your Volunteer Hours</h2>
        <div className="bg-accent text-primary-dark font-bold px-6 py-2 rounded-lg shadow text-lg">Total Hours: {totalHours.toFixed(2)}</div>
      </div>
      {logs.length === 0 ? (
        <div className="text-gray-500">No submissions yet. Log your first hours!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-t rounded-lg overflow-hidden">
            <thead className="bg-primary text-white font-bold sticky top-0 z-10">
              <tr>
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">First Name</th>
                <th className="py-2 px-2">Last Name</th>
                <th className="py-2 px-2">Organization</th>
                <th className="py-2 px-2">Description</th>
                <th className="py-2 px-2">Proof of Service</th>
                <th className="py-2 px-2">Time</th>
                <th className="py-2 px-2">Hours</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((s, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-background' : 'bg-white'}>
                  <td className="py-2 px-2">{s.date}</td>
                  <td className="py-2 px-2">{s.first_name}</td>
                  <td className="py-2 px-2">{s.last_name}</td>
                  <td className="py-2 px-2">{s.organization}</td>
                  <td className="py-2 px-2">{s.description}</td>
                  <td className="py-2 px-2">{s.proof_of_service}</td>
                  <td className="py-2 px-2">{s.time_range}</td>
                  <td className="py-2 px-2 font-bold">{s.hours?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Admin() {
  const { user } = useAuth();
  const isAdmin = user?.email === 'your-admin-email@example.com'; // Change to your admin email
  if (!user || !isAdmin) return <Navigate to="/dashboard" />;
  // No mock data, just a friendly message
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-primary-dark mb-4">All Volunteer Submissions</h2>
      <div className="text-gray-500">No submissions yet. Submissions will appear here for admins.</div>
    </div>
  );
}

function Login() {
  const { signInWithGoogle, loading, user } = useAuth();
  if (user) return <Navigate to="/dashboard" />;
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded shadow">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-dark">
          HourTrackr NJHS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to track your volunteer hours
        </p>
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-dark transition"
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-primary-light">Loading...</div>;
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/log" element={<LogHours />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function Footer() {
  return (
    <footer className="bg-primary text-white text-center py-4 mt-12">
      <div>© {new Date().getFullYear()} HourTrackr NJHS. All rights reserved.</div>
      <div className="text-xs mt-1">Not affiliated with National Junior Honor Society. For official info, visit <a href="https://www.njhs.us/" className="underline hover:text-accent">njhs.us</a>.</div>
    </footer>
  );
}

export default function WrappedApp() {
  const [showSplash, setShowSplash] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);
  return (
    <AuthProvider>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <Router>
          <Header />
          <main className="bg-background min-h-screen">
            <AppRoutes />
          </main>
          <Footer />
        </Router>
      )}
    </AuthProvider>
  );
}