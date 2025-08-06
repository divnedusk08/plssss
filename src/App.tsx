import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import sneakPeakImg from './assets/LogHoursInterface.png';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

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
  const isSuperAdmin = user?.email === 'divineduskdragon08@gmail.com' || user?.email === 'dhriti.erusalagandi58@k12.leanderisd.org';
  const location = useLocation();
  const navLinkClass = (path: string) =>
    location.pathname === path
      ? 'bg-accent text-primary font-bold rounded-lg px-5 py-1.5 shadow text-base'
      : 'font-bold text-white text-fill-hover-yellow px-5 py-1.5 rounded-xl text-base';
  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-300 shadow-lg">
      <nav className="max-w-4xl mx-auto flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#FBBF24" fillOpacity="0.15" />
            <path d="M32 8C28 16 36 20 32 28C36 24 44 20 32 8Z" fill="#FBBF24"/>
            <rect x="29" y="28" width="6" height="24" rx="3" fill="#2563EB"/>
            <rect x="27" y="52" width="10" height="4" rx="2" fill="#FBBF24"/>
          </svg>
          <span className="font-montserrat text-xl font-extrabold text-white drop-shadow">HourTrackr NJHS</span>
        </div>
        <div className="flex gap-2 items-center font-semibold">
          {user && <Link to="/log" className={navLinkClass('/log')}>Log Hours</Link>}
          {user && <Link to="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</Link>}
          {user && <Link to="/profile" className={navLinkClass('/profile')}>Profile</Link>}
          <Link to="/contact" className={navLinkClass('/contact')}>Contact Us</Link>
          {user && isSuperAdmin && <Link to="/admin" className={navLinkClass('/admin')}>Admin</Link>}
          {user ? (
            <button onClick={signOut} className="ml-2 px-4 py-1.5 rounded-lg bg-accent text-primary-dark font-bold shadow hover:bg-accent-dark transition text-base">Sign out</button>
          ) : (
            <Link to="/login" className="bg-accent text-primary font-bold rounded-lg px-5 py-1.5 shadow ml-2 text-base">Sign in</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/log', { replace: true });
      }
  }, [user, navigate]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] px-2 sm:px-4 md:px-8 py-4 bg-white" style={{ zoom: 1 }}>
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-4 md:mb-6 mt-8 md:mt-12 fade-in">
        <div className="relative">
          <svg width="90" height="90" viewBox="0 0 64 64" fill="none" className="torch-animated" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#FBBF24" fillOpacity="0.15" />
            <path d="M32 8C28 16 36 20 32 28C36 24 44 20 32 8Z" fill="#FBBF24"/>
            <rect x="29" y="28" width="6" height="24" rx="3" fill="#2563EB"/>
            <rect x="27" y="52" width="10" height="4" rx="2" fill="#FBBF24"/>
          </svg>
          <div className="absolute inset-0 animate-ping-slow opacity-20">
            <svg width="90" height="90" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="32" fill="#FBBF24"/>
            </svg>
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary-dark font-montserrat mt-2 mb-1 drop-shadow text-center">HourTrackr NJHS</h1>
        <div className="text-blue-900 text-lg md:text-xl font-montserrat mb-2 text-center">National Junior Honor Society</div>
      </div>

      {/* Tagline */}
      <div className="max-w-xs sm:max-w-md md:max-w-xl text-center mb-4 md:mb-6 fade-in">
        <p className="text-lg md:text-2xl text-gray-800 font-montserrat mb-2 text-hover-effect">
          Log and track your NJHS volunteer hours in one place.
        </p>
      </div>

      {/* Get Started Button */}
      <button
        onClick={() => navigate('/login')}
        className="mb-6 md:mb-8 px-6 md:px-8 py-3 md:py-4 rounded-lg bg-primary text-white font-bold text-lg md:text-xl hover:bg-primary-dark transition glow-on-hover"
      >
        Get Started
      </button>

      {/* Sneak Peek Image */}
      <div className="flex flex-col items-center mt-2 md:mt-4 mb-8 md:mb-14 w-full">
        <img
          src={sneakPeakImg}
          alt="Dashboard sneak peek"
          className="rounded-2xl shadow-2xl border border-gray-200 w-full max-w-xs sm:max-w-md md:w-[65vw] md:max-w-[1050px]"
          style={{ objectFit: 'contain', opacity: 0, transform: 'translateY(32px)', animation: 'fadeInUp 1.4s cubic-bezier(0.23, 1, 0.32, 1) 0s forwards' }}
        />
      </div>

      {/* How it works section */}
      <div className="w-full max-w-xs sm:max-w-xl md:max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8" style={{ opacity: 0, animation: 'fadeIn 1.2s ease 0.4s forwards' }}>
        <div className="bg-gray-50 rounded-xl shadow-xl p-4 md:p-6 flex flex-col items-center border-t-4 border-primary hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3 md:mb-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="torch-animated"><path d="M12 2v20M5 12h14" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <h3 className="font-bold text-primary-dark mb-1 md:mb-2 text-base md:text-lg font-montserrat text-hover-effect text-center">Log Your Hours</h3>
          <p className="text-gray-600 text-xs md:text-sm font-inter text-center text-hover-effect">Submit hours easily. All submissions stored securely.</p>
        </div>
        <div className="bg-gray-50 rounded-xl shadow-xl p-4 md:p-6 flex flex-col items-center border-t-4 border-accent hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-accent/10 rounded-full flex items-center justify-center mb-3 md:mb-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="torch-animated"><path d="M3 17l6-6 4 4 8-8" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <h3 className="font-bold text-primary-dark mb-1 md:mb-2 text-base md:text-lg font-montserrat text-hover-effect text-center">Track Progress</h3>
          <p className="text-gray-600 text-xs md:text-sm font-inter text-center text-hover-effect">View total hours and history. Stay on top of requirements.</p>
        </div>
        <div className="bg-gray-50 rounded-xl shadow-xl p-4 md:p-6 flex flex-col items-center border-t-4 border-primary-dark hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-primary-dark/10 rounded-full flex items-center justify-center mb-3 md:mb-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="torch-animated"><path d="M12 17l-5 3 1-5.5L3 9.5l5.5-.5L12 4l3.5 5 5.5.5-4 5 1 5.5z" stroke="#1e3a8a" strokeWidth="2" strokeLinejoin="round"/></svg>
          </div>
          <h3 className="font-bold text-primary-dark mb-1 md:mb-2 text-base md:text-lg font-montserrat text-hover-effect text-center">Get Recognized</h3>
          <p className="text-gray-600 text-xs md:text-sm font-inter text-center text-hover-effect">Earn recognition for service and leadership. Your impact matters!</p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 max-w-xs sm:max-w-md md:max-w-md w-full text-center mt-4 md:mt-6 border-t-4 border-primary-dark fade-in">
        <h3 className="font-bold text-primary-dark mb-2 font-montserrat text-hover-effect text-center">Need Help?</h3>
        <p className="text-gray-700 text-sm md:text-base font-inter text-hover-effect flex flex-col items-center gap-2">
          Contact NJHS advisors or email
          <span className="flex items-center justify-center gap-2 relative">
            <button
              onClick={() => {
                navigator.clipboard.writeText('dhriti.erusalagandi58@k12.leanderisd.org');
                // Show feedback
                const button = document.activeElement as HTMLButtonElement;
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.className = 'text-green-600 underline hover:text-green-700 transition-colors select-all cursor-pointer';
                setTimeout(() => {
                  button.textContent = originalText;
                  button.className = 'text-primary underline hover:text-primary-dark transition-colors select-all cursor-pointer';
                }, 2000);
              }}
              className="text-primary underline hover:text-primary-dark transition-colors select-all cursor-pointer"
              title="Copy email address"
            >
              dhriti.erusalagandi58@k12.leanderisd.org
            </button>
          </span>
        </p>
      </div>

      {/* Not affiliated notice and copyright - centered between box and blue footer */}
      <div className="w-full flex justify-center">
        <div className="text-gray-400 text-xs mt-8 mb-4 text-center max-w-lg flex flex-wrap items-center justify-center gap-2">
          <span>Not affiliated with National Junior Honor Society. <a href="https://www.njhs.us/" className="underline hover:text-accent">njhs.us</a></span>
          <span className="hidden sm:inline">|</span>
          <span>© {new Date().getFullYear()} HourTrackr NJHS.</span>
        </div>
      </div>
    </div>
  );
}

// Stepper Progress Tracker for Log Hours
function LogHoursStepper({ steps, currentStep, onStepClick }: { steps: string[]; currentStep: number; onStepClick?: (idx: number) => void }) {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="flex w-full max-w-2xl items-center gap-x-2 overflow-x-auto max-w-full">
        {steps.map((step, idx) => (
          <div key={step} className="flex-1 flex flex-col items-center">
            <button
              type="button"
              disabled={onStepClick == null || idx > currentStep}
              onClick={() => onStepClick && idx <= currentStep && onStepClick(idx)}
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 focus:outline-none
                ${idx < currentStep ? 'bg-primary text-white border-primary' : idx === currentStep ? 'bg-accent text-primary-dark border-accent' : 'bg-gray-200 text-gray-400 border-gray-300'}
                ${onStepClick && idx <= currentStep ? 'cursor-pointer hover:scale-110 hover:shadow-lg' : 'cursor-default'}`}
              aria-label={`Go to step ${step}`}
            >
              {idx < currentStep ? '✓' : idx + 1}
            </button>
            <div className={`mt-2 text-xs text-center font-semibold h-7 flex items-center justify-center whitespace-nowrap ${idx === currentStep ? 'text-primary-dark' : 'text-gray-500'}`}>{step}</div>
            {idx < steps.length - 1 ? (
              <div className="h-1 w-full bg-gray-300 mt-1 mb-1">
                <div className={`h-1 transition-all duration-300 ${idx < currentStep ? 'bg-primary' : 'bg-gray-300'}`}></div>
              </div>
            ) : (
              // For the last step, add a full-width underline
              <div className="h-1 w-full bg-gray-300 mt-1 mb-1 mx-auto rounded">
                <div className={`h-1 w-full mx-auto rounded transition-all duration-300 ${idx < currentStep ? 'bg-primary' : 'bg-gray-300'}`}></div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm text-gray-600">{Math.round((currentStep / (steps.length - 1)) * 100)}% complete</div>
    </div>
  );
}

function LogHours({ setDashboardRefreshKey }: { setDashboardRefreshKey: React.Dispatch<React.SetStateAction<number>> }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPeriod = location.state?.selectedPeriod; // Get the selected period from navigation state

  // Define six-week periods (same as in Dashboard)
  const sixWeekPeriods = [
    { name: 'Six Weeks 1 (2025-2026)', startDate: '2025-05-09', endDate: '2025-09-19', targetHours: 2 },
    { name: 'Six Weeks 2 (2025-2026)', startDate: '2025-09-23', endDate: '2025-10-31', targetHours: 2 },
    { name: 'Six Weeks 3 (2025-2026)', startDate: '2025-11-05', endDate: '2025-12-19', targetHours: 2 },
    { name: 'Six Weeks 4 (2025-2026)', startDate: '2026-01-06', endDate: '2026-02-11', targetHours: 2 },
    { name: 'Six Weeks 5 (2025-2026)', startDate: '2026-02-17', endDate: '2026-04-10', targetHours: 2 },
    { name: 'Six Weeks 6 (2025-2026)', startDate: '2026-04-12', endDate: '2026-05-29', targetHours: 2 },
  ];

  // Function to get the current period based on today's date
  const getCurrentPeriod = () => {
    const today = new Date();
    // Always include Six Weeks 1 (first period) regardless of current date
    const sixWeeks1 = sixWeekPeriods[0];
    
    // Check if today falls within any active period
    const activePeriod = sixWeekPeriods.find(period => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      return today >= startDate && today <= endDate;
    });
    
    // Return active period if found, otherwise return Six Weeks 1
    return activePeriod || sixWeeks1;
  };

  // Get the current period (either from navigation or based on today's date)
  const currentPeriod = selectedPeriod || getCurrentPeriod();

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [organization, setOrganization] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [proofOfService, setProofOfService] = React.useState('');
  const [timeStart, setTimeStart] = React.useState('');
  const [timeEnd, setTimeEnd] = React.useState('');
  const [date, setDate] = React.useState(() => {
    // Pre-fill date if a period is selected and it's current/future
    if (currentPeriod) {
      const today = new Date();
      const periodStartDate = new Date(currentPeriod.startDate);
      const periodEndDate = new Date(currentPeriod.endDate);

      if (today >= periodStartDate && today <= periodEndDate) {
        return today.toISOString().split('T')[0];
      } else if (today < periodStartDate) {
        return periodStartDate.toISOString().split('T')[0];
      }
    }
    return '';
  });
  const [additionalInformation, setAdditionalInformation] = React.useState(''); // New state for additional information
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setFirstName(user.user_metadata?.full_name?.split(' ')[0] || '');
      setLastName(user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '');
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  // If no current period is available, show an error (this should never happen now since Six Weeks 1 is always available)
  if (!currentPeriod) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-10 px-4 bg-white">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-12 text-center">
          <h2 className="text-3xl font-extrabold text-primary-dark font-montserrat mb-8">No Active Period</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <p className="text-yellow-800 mb-4">
              There is no active six-week period for today's date ({new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}).
            </p>
            <p className="text-yellow-700 text-sm">
              You can only log hours during active six-week periods. Please check the dashboard for available periods.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Function to check if a date is in the blocked range (May 10-23, 2025)
  const isDateBlocked = (dateString: string): boolean => {
    const date = new Date(dateString);
    const blockedStart = new Date('2025-05-10');
    const blockedEnd = new Date('2025-05-23');
    return date >= blockedStart && date <= blockedEnd;
  };

  function calcHours() {
    if (!timeStart || !timeEnd) return '';
    const [sh, sm] = timeStart.split(':').map(Number);
    const [eh, em] = timeEnd.split(':').map(Number);
    let diff = (eh + em / 60) - (sh + sm / 60);
    if (diff < 0) diff += 24;
    return diff.toFixed(2);
  }

  const handleSubmit = async () => {
    setHasAttemptedSubmit(true);
    setError('');
    setIsSubmitting(true);

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first name and last name.');
      setIsSubmitting(false);
      return;
    }

    const hours = calcHours();
    if (!hours || isNaN(Number(hours))) {
      setError('Please enter valid start and end times.');
      setIsSubmitting(false);
      return;
    }

    // Check if the selected date is in the blocked range
    if (isDateBlocked(date)) {
      setError('Dates from May 10-23, 2025 are not available for volunteer hour submission.');
      setIsSubmitting(false);
      return;
    }

    // Validate date against selected period if applicable
    if (currentPeriod) {
      // Parse the date string properly to avoid timezone issues
      const [year, month, day] = date.split('-').map(Number);
      const enteredDate = new Date(year, month - 1, day);
      const periodStartDate = new Date(currentPeriod.startDate);
      const periodEndDate = new Date(currentPeriod.endDate);

      // Allow Six Weeks 1 even when outside the time period
      const isSixWeeks1 = currentPeriod.name === 'Six Weeks 1 (2025-2026)';
      
      // For Six Weeks 1, allow the full range from May 9 to Sep 19
      if (isSixWeeks1) {
        const sixWeeks1FullStart = new Date('2025-05-09');
        const sixWeeks1FullEnd = new Date('2025-09-19');
        
        if (enteredDate < sixWeeks1FullStart || enteredDate > sixWeeks1FullEnd) {
          setError(`Date must be within May 9, 2025 and September 19, 2025 for Six Weeks 1.`);
          setIsSubmitting(false);
          return;
        }
      } else {
        // For other periods, use the normal validation
        if (enteredDate < periodStartDate || enteredDate > periodEndDate) {
          setError(`Date must be within ${currentPeriod.startDate} and ${currentPeriod.endDate} for ${currentPeriod.name}.`);
          setIsSubmitting(false);
          return;
        }
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
      period_name: currentPeriod ? currentPeriod.name : null,
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
      setHasAttemptedSubmit(false); // Reset after successful submit
      navigate('/dashboard'); // Redirect immediately
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stepper logic
  const steps = [
    'First Name',
    'Last Name',
    'Organization',
    'Description',
    'Proof',
    'Time',
    'Date',
    'Additional Info',
    'Submit', // Changed from 'Review & Submit' to 'Submit'
  ];
  const [stepIndex, setStepIndex] = React.useState(0);

  // Helper to go to next/prev step
  const nextStep = () => {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    setHasAttemptedSubmit(false);
  };
  const prevStep = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
    setHasAttemptedSubmit(false);
  };

  // Validation for each step
  const isStepValid = () => {
    switch (stepIndex) {
      case 0: return !!firstName;
      case 1: return !!lastName;
      case 2: return !!organization;
      case 3: return !!description;
      case 4: return !!proofOfService;
      case 5: return !!timeStart && !!timeEnd;
      case 6: return !!date;
      // Additional Info is optional
      default: return true;
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-10 px-4 bg-white">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-12 min-h-[400px]">
        <h2 className="text-3xl font-extrabold text-primary-dark text-center font-montserrat mb-8">Log Volunteer Hours</h2>

        {/* Stepper Progress Tracker */}
        <LogHoursStepper steps={steps} currentStep={stepIndex} onStepClick={(idx) => setStepIndex(idx)} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Only show one question per step */}
          {stepIndex === 0 && (
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              id="firstName"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
                required
            />
          </div>
          )}
          {stepIndex === 1 && (
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              id="lastName"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
                required
            />
          </div>
          )}
          {stepIndex === 2 && (
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
          )}
          {stepIndex === 3 && (
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
          )}
          {stepIndex === 4 && (
          <div>
            <label htmlFor="proofOfService" className="block text-sm font-medium text-gray-700">
              Proof of Service (Representative email, phone number or organization contact information- If you volunteer with other NJHS members, you can say Ms. Currie/Ms. Bruce.)<span className="text-red-500">*</span>
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
          )}
          {stepIndex === 5 && (
            <div className="space-y-4">
            <div>
                <label htmlFor="timeStart" className="block text-sm font-medium text-gray-700">Start Time<span className="text-red-500">*</span></label>
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
                <label htmlFor="timeEnd" className="block text-sm font-medium text-gray-700">End Time<span className="text-red-500">*</span></label>
              <input
                type="time"
                id="timeEnd"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                required
              />
            </div>
              {timeStart && timeEnd && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-center">
                  <span className="text-sm font-semibold text-green-800">
                    Total Hours: {calcHours()}
                  </span>
          </div>
              )}
            </div>
          )}
          {stepIndex === 6 && (
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date you did your service:<span className="text-red-500">*</span></label>
            <div className="relative">
            <input
              type="date"
              id="date"
                className="mt-1 block w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={date}
              onChange={(e) => {
                const selectedDate = e.target.value;
                if (isDateBlocked(selectedDate)) {
                  setError('Dates from May 10-23, 2025 are not available for volunteer hour submission.');
                  return;
                }
                setError(''); // Clear any existing error
                setDate(selectedDate);
              }}
                min={currentPeriod.name === 'Six Weeks 1 (2025-2026)' ? '2025-05-09' : currentPeriod.startDate}
                max={currentPeriod.name === 'Six Weeks 1 (2025-2026)' ? '2025-09-19' : currentPeriod.endDate}
              required
            />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            {date && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold text-blue-800">
                    Selected Date: {(() => {
                      // Parse the date string properly to avoid timezone issues
                      const [year, month, day] = date.split('-').map(Number);
                      const parsedDate = new Date(year, month - 1, day);
                      return parsedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      });
                    })()}
                  </span>
                </div>
              </div>
            )}
          </div>
          )}
          {stepIndex === 7 && (
          <div>
            <label htmlFor="additionalInformation" className="block text-sm font-medium text-gray-700">
              Additional Information (Optional)
            </label>
            <input
              type="text"
              id="additionalInformation"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={additionalInformation}
              onChange={(e) => setAdditionalInformation(e.target.value)}
              placeholder="Any extra details (optional)"
            />
          </div>
          )}
          {stepIndex === 8 && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-primary-dark text-center">Review Your Submission</h3>
              <div className="bg-gray-100 rounded-lg p-6 border border-gray-200 text-center mb-6">
                <span className="text-xl font-bold text-primary-dark">
                  Total Hours: {calcHours() || '0.00'}
                </span>
                {(!hasAttemptedSubmit && (!timeStart || !timeEnd)) && (
                  <p className="text-sm text-red-600 mt-2">Please enter start and end times</p>
                )}
          </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
                <p className="text-base font-semibold text-blue-800 mb-2">Are you sure you want to submit?</p>
                <p className="text-sm text-blue-600">Please review your information before submitting your volunteer hours.</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
          <button
              type="button"
              onClick={prevStep}
              disabled={stepIndex === 0}
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition disabled:opacity-50"
            >
              Back
            </button>
            {stepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !isStepValid()}
                className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Hours'}
          </button>
            )}
          </div>
        </div>
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
  additional_info?: string;
};

function Dashboard({ dashboardRefreshKey }: { dashboardRefreshKey: number }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = React.useState<Log[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editingLog, setEditingLog] = React.useState<Log | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  // Helper function to format dates nicely
  const formatDateRange = (startDate: string, endDate: string) => {
    const formatDate = (dateStr: string) => {
      // Parse the date string properly to avoid timezone issues
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    };
    return `${formatDate(startDate)} → ${formatDate(endDate)}`;
  };

  // Define 6-week periods
  const sixWeekPeriods = [
    { name: 'Six Weeks 1 (2025-2026)', startDate: '2025-05-09', endDate: '2025-09-19', targetHours: 2 },
    { name: 'Six Weeks 2 (2025-2026)', startDate: '2025-09-23', endDate: '2025-10-31', targetHours: 2 },
    { name: 'Six Weeks 3 (2025-2026)', startDate: '2025-11-05', endDate: '2025-12-19', targetHours: 2 },
    { name: 'Six Weeks 4 (2025-2026)', startDate: '2026-01-06', endDate: '2026-02-11', targetHours: 2 },
    { name: 'Six Weeks 5 (2025-2026)', startDate: '2026-02-17', endDate: '2026-04-10', targetHours: 2 },
    { name: 'Six Weeks 6 (2025-2026)', startDate: '2026-04-12', endDate: '2026-05-29', targetHours: 2 },
  ];

  // Deadline alert functions
  const getDeadlineStatus = (period: any, periodHours: number) => {
    const today = new Date();
    const deadline = new Date(period.endDate);
    const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const hoursNeeded = period.targetHours - periodHours;
    
    if (daysRemaining < 0) {
      return { status: 'overdue', daysRemaining: 0, hoursNeeded, color: 'red' };
    } else if (daysRemaining <= 7 && hoursNeeded > 0) {
      return { status: 'urgent', daysRemaining, hoursNeeded, color: 'red' };
    } else if (daysRemaining <= 14 && hoursNeeded > 0) {
      return { status: 'warning', daysRemaining, hoursNeeded, color: 'yellow' };
    } else if (hoursNeeded > 0) {
      return { status: 'pending', daysRemaining, hoursNeeded, color: 'blue' };
    } else {
      return { status: 'completed', daysRemaining, hoursNeeded: 0, color: 'green' };
    }
  };

  const DeadlineAlert = ({ period, periodHours }: { period: any, periodHours: number }) => {
    const status = getDeadlineStatus(period, periodHours);
    
    if (status.status === 'completed') {
      return (
        <div className="flex items-center justify-center mt-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="ml-2 text-sm font-semibold text-green-600">Completed</span>
        </div>
      );
    }
    
    const getCircleColor = () => {
      switch (status.color) {
        case 'red': return 'text-red-600';
        case 'yellow': return 'text-yellow-600';
        case 'blue': return 'text-blue-600';
        default: return 'text-gray-600';
      }
    };

    const getCircleBgColor = () => {
      switch (status.color) {
        case 'red': return 'bg-red-50';
        case 'yellow': return 'bg-yellow-50';
        case 'blue': return 'bg-blue-50';
        default: return 'bg-gray-50';
      }
    };

    return (
      <div className={`mt-2 p-2 ${getCircleBgColor()} rounded-lg border`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full border-2 ${getCircleColor()} flex items-center justify-center text-xs font-bold`}>
              {status.daysRemaining}
            </div>
            <div className="ml-2">
              <div className="text-xs font-semibold">Days Left</div>
              <div className="text-xs text-gray-600">Need {status.hoursNeeded}h</div>
            </div>
          </div>
          <div className="text-xs font-semibold text-gray-600">
            {status.status === 'overdue' ? 'OVERDUE' : 
             status.status === 'urgent' ? 'URGENT' : 
             status.status === 'warning' ? 'WARNING' : 'PENDING'}
          </div>
        </div>
      </div>
    );
  };

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
      const requiredHours = 12; // Set required hours for the semester here
  const percent = Math.min((totalHours / requiredHours) * 100, 100);
  
  return (
    <div className="max-w-5xl mx-auto my-4 p-3 bg-white rounded-2xl shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-2xl font-extrabold text-primary-dark font-montserrat">Your Volunteer Hours</h2>
        <div className="flex flex-col items-end gap-2">
          <div className="text-gray-600 text-xs font-medium">Today: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div className="flex gap-2">
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 text-sm"
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
            <div className="bg-accent text-primary-dark font-bold px-4 py-1.5 rounded-lg shadow text-base">
              Total Hours: {totalHours.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      {/* Urgent Deadline Alerts Banner */}
      {(() => {
        const urgentAlerts = sixWeekPeriods
          .map(period => {
            const periodLogs = logs.filter(log => {
              const logDate = new Date(log.date);
              const startDate = new Date(period.startDate);
              const endDate = new Date(period.endDate);
              return logDate >= startDate && logDate <= endDate;
            });
            const periodHours = periodLogs.reduce((sum, log) => sum + (log.hours || 0), 0);
            const status = getDeadlineStatus(period, periodHours);
            return { period, periodHours, status };
          })
          .filter(({ status }) => status.status === 'urgent' || status.status === 'overdue');

        if (urgentAlerts.length === 0) return null;

        return (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-red-800">Urgent Deadlines</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {urgentAlerts.map(({ period, status }) => (
                <div key={period.name} className="flex items-center p-3 bg-white rounded-lg border border-red-200">
                  <div className={`w-10 h-10 rounded-full border-2 ${status.color === 'red' ? 'border-red-500 text-red-600' : 'border-orange-500 text-orange-600'} flex items-center justify-center text-sm font-bold mr-3`}>
                    {status.daysRemaining}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">{period.name}</div>
                    <div className="text-xs text-gray-600">
                      {status.status === 'overdue' 
                        ? `Overdue - Need ${status.hoursNeeded}h`
                        : `${status.daysRemaining} days left - Need ${status.hoursNeeded}h`
                      }
                    </div>
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded ${status.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {status.status === 'overdue' ? 'OVERDUE' : 'URGENT'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
      {/* Progress Bar for Required Hours (Yearly) */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-1">
          <span className="text-lg font-bold text-primary-dark">Progress Toward Total Required Hours</span>
          <span className="text-sm font-semibold text-gray-700">{totalHours.toFixed(2)} / {requiredHours} hours</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-5 shadow-inner">
          <div
            className={`h-5 rounded-full transition-all duration-500 ${percent >= 100 ? 'bg-green-500' : 'bg-primary'}`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
        {percent >= 100 && (
          <div className="mt-2 text-green-700 font-semibold text-sm">Congratulations! You have met the required hours for this year.</div>
        )}
      </div>
      {/* Progress Bars for each Six Weeks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-0">
        {sixWeekPeriods.map((period) => {
          const periodLogs = logs.filter(log => {
            const logDate = new Date(log.date);
            
            // Special handling for Six Weeks 1 - use full date range
            if (period.name === 'Six Weeks 1 (2025-2026)') {
              const sixWeeks1Start = new Date('2025-05-09');
              const sixWeeks1End = new Date('2025-09-19');
              return logDate >= sixWeeks1Start && logDate <= sixWeeks1End;
            }
            
            // For other periods, use their normal date ranges
            const startDate = new Date(period.startDate);
            const endDate = new Date(period.endDate);
            return logDate >= startDate && logDate <= endDate;
          });
          const periodHours = periodLogs.reduce((sum, log) => sum + (log.hours || 0), 0);
          const periodProgress = Math.min((periodHours / period.targetHours) * 100, 100);

          // Check if this period is currently active
          const today = new Date();
          const periodStartDate = new Date(period.startDate);
          const periodEndDate = new Date(period.endDate);
          const isCurrentPeriod = today >= periodStartDate && today <= periodEndDate;
          const isFuturePeriod = today < periodStartDate;
          const isPastPeriod = today > periodEndDate;
          
          // Special handling for Six Weeks 1 - always accessible
          const isSixWeeks1 = period.name === 'Six Weeks 1 (2025-2026)';
          const isAccessible = isCurrentPeriod || isPastPeriod || isSixWeeks1;

          return (
            <div key={period.name} 
            className={`bg-white rounded-xl shadow-md p-3 border mb-2 transition-all ${
              isAccessible 
                ? 'border-green-300 cursor-pointer hover:shadow-lg hover:border-green-400' 
                : 'border-gray-200 cursor-not-allowed opacity-60'
            }`}
            onClick={() => {
              if (!isAccessible) return; // Don't allow clicking on inaccessible periods
              navigate('/log', { state: { selectedPeriod: period } });
            }}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-base text-primary-dark">{period.name}</h3>
                {isCurrentPeriod && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs font-semibold text-green-600">ACTIVE</span>
                  </div>
                )}
                {isFuturePeriod && !isSixWeeks1 && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                    <span className="text-xs font-semibold text-gray-500">FUTURE</span>
                  </div>
                )}
                {isPastPeriod && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
                    <span className="text-xs font-semibold text-blue-600">PAST</span>
                  </div>
                )}
                {isSixWeeks1 && isFuturePeriod && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs font-semibold text-green-600">CURRENT</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-1">
                {period.name === 'Six Weeks 1 (2025-2026)' ? 'May 9, 2025 → Sep 19, 2025' : formatDateRange(period.startDate, period.endDate)}
              </p>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-600">Hours: {periodHours.toFixed(2)} / {period.targetHours}</span>
                <span className="text-xs font-medium text-gray-600">{periodProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${periodProgress >= 100 ? 'bg-green-500' : 'bg-primary'}`}
                  style={{ width: `${periodProgress}%` }}
                ></div>
              </div>
              <DeadlineAlert period={period} periodHours={periodHours} />
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
                <th className="py-2 px-2">Additional Info</th>
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
                    <td className="py-2 px-2">{log.additional_info || ''}</td>
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

  if (user) return <Navigate to="/log" />;

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
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(officer.email);
                      // Show feedback
                      const button = document.activeElement as HTMLButtonElement;
                      const originalText = button.textContent;
                      button.textContent = 'Copied!';
                      button.className = 'text-green-600 hover:text-green-700 underline transition-colors text-base font-medium flex-grow overflow-hidden whitespace-nowrap text-ellipsis ml-2';
                      setTimeout(() => {
                        button.textContent = originalText;
                        button.className = 'text-primary hover:text-primary-dark underline transition-colors text-base font-medium flex-grow overflow-hidden whitespace-nowrap text-ellipsis ml-2';
                      }, 2000);
                    }}
                    className="text-primary hover:text-primary-dark underline transition-colors text-base font-medium flex-grow overflow-hidden whitespace-nowrap text-ellipsis ml-2" 
                    title="Copy email address"
                  >
                    {officer.email}
                  </button>
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
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(advisor.email);
                      // Show feedback
                      const button = document.activeElement as HTMLButtonElement;
                      const originalText = button.textContent;
                      button.textContent = 'Copied!';
                      button.className = 'text-green-600 hover:text-green-700 underline transition-colors text-base font-medium flex-grow overflow-hidden whitespace-nowrap text-ellipsis ml-2';
                      setTimeout(() => {
                        button.textContent = originalText;
                        button.className = 'text-primary hover:text-primary-dark underline transition-colors text-base font-medium flex-grow overflow-hidden whitespace-nowrap text-ellipsis ml-2';
                      }, 2000);
                    }}
                    className="text-primary hover:text-primary-dark underline transition-colors text-base font-medium flex-grow overflow-hidden whitespace-nowrap text-ellipsis ml-2" 
                    title="Copy email address"
                  >
                    {advisor.email}
                  </button>
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
  const [profilePicture, setProfilePicture] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (user) {
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
          avatar_url: publicUrl
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



  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 font-inter">
        <h2 className="text-3xl font-extrabold mb-8 text-primary-dark text-center font-montserrat">Your Profile</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>
        )}
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <img
              src={profilePicture || '/default-profile.png'}
                alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={handleProfilePictureClick}
              style={{ background: '#f3f4f6' }}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
          <div className="w-full max-w-md mx-auto">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-center text-base font-semibold border border-gray-200">
                {user?.email}
              </div>
              </div>
                <div className="flex justify-center mt-4">
                <button
                    className="bg-[#2563EB] text-white rounded-lg font-semibold shadow px-6 py-2 hover:bg-[#1d4ed8] transition text-center"
              onClick={handleProfilePictureClick}
              disabled={isUploading}
                >
                    Edit Profile
                </button>
                </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppRoutes({ setDashboardRefreshKey, dashboardRefreshKey }: { setDashboardRefreshKey: React.Dispatch<React.SetStateAction<number>>, dashboardRefreshKey: number }) {
  const { loading, user } = useAuth();
  const isSuperAdmin = user?.email === 'divineduskdragon08@gmail.com' || user?.email === 'dhriti.erusalagandi58@k12.leanderisd.org';
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-primary-light text-xl font-semibold font-montserrat text-primary-dark">Loading...</div>;
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/log" element={<LogHours setDashboardRefreshKey={setDashboardRefreshKey} />} />
      <Route path="/dashboard" element={<Dashboard dashboardRefreshKey={dashboardRefreshKey} />} />
      {isSuperAdmin && <Route path="/admin" element={<AdminDashboard />} />}
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
      <div className="text-xs mt-2">2025 Dhriti Erusalagandi | Developer & Designer</div>
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
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 overflow-auto fade-in bg-white min-h-[102vh]">
              <AppRoutes setDashboardRefreshKey={setDashboardRefreshKey} dashboardRefreshKey={dashboardRefreshKey} />
            </main>
            <Footer />
          </div>
        </Router>
      )}
    </AuthProvider>
  );
}