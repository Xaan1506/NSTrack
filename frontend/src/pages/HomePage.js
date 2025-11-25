import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Users, ArrowRight, Sun, Moon, CheckCircle2, Bell, ChevronDown } from 'lucide-react';
// theme toggle removed for landing page to enforce all-black design
import FeaturesSection from '../components/FeaturesSection';
import InteractiveBubble from '../components/InteractiveBubble';
import InteractiveSection from '../components/InteractiveSection';
import LoadingScreen from '../components/LoadingScreen';
import { useTheme } from '../context/ThemeContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Check if animation has already been shown in this session
  const [showLoading, setShowLoading] = useState(() => {
    return !sessionStorage.getItem('animationShown');
  });


  // Create refs for all bubbles for collision detection
  const bubbleData = [
    { key: 'CMD', delay: '0s', duration: '20s', x: '10%', y: '20%' },
    { key: 'RETURN', delay: '2s', duration: '25s', x: '80%', y: '15%' },
    { key: 'SHIFT', delay: '4s', duration: '22s', x: '15%', y: '70%' },
    { key: 'ENTER', delay: '1s', duration: '24s', x: '85%', y: '60%' },
    { key: 'CTRL', delay: '3s', duration: '23s', x: '50%', y: '30%' },
    { key: 'ALT', delay: '5s', duration: '21s', x: '30%', y: '50%' },
    { key: 'ESC', delay: '2.5s', duration: '26s', x: '70%', y: '40%' },
    { key: 'TAB', delay: '4.5s', duration: '19s', x: '20%', y: '80%' },
    { key: 'SPACE', delay: '1.5s', duration: '27s', x: '60%', y: '75%' },
    { key: 'DEL', delay: '3.5s', duration: '20s', x: '90%', y: '85%' },
  ];

  // Initialize refs array - use useRef to create stable refs
  const bubbleRefs = useRef(
    bubbleData.map(() => ({ current: null }))
  );


  useEffect(() => {
    try {
      const saved = localStorage.getItem('profilePhoto');
      setProfilePhoto(saved);
    } catch (e) {
      setProfilePhoto(null);
    }
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      setUser(u);
    } catch (e) {
      setUser(null);
    }
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  const benefits = [
    'Personalized learning paths tailored to YOUR goals',
    'AI-powered content generation for roadmaps and problems',
    'Gamified point system to track your progress',
    'Internal learning resources - everything in one place',
    'No scattered tutorials or random YouTube playlists',
    'Community-focused for NST students'
  ];

  // Show loading screen if not yet completed
  if (showLoading) {
    return <LoadingScreen onComplete={() => {
      setShowLoading(false);
      // Mark animation as shown for this session
      sessionStorage.setItem('animationShown', 'true');
    }} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Floating Interactive Keyboard Keys */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Keyboard keys that move away from mouse */}
          {bubbleData.map((item, index) => (
            <InteractiveBubble
              key={index}
              ref={bubbleRefs.current[index]}
              keyText={item.key}
              initialX={item.x}
              initialY={item.y}
              delay={item.delay}
              duration={item.duration}
              theme={theme}
              bubbles={bubbleRefs.current}
              index={index}
            />
          ))}
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-60 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <nav className="flex items-center justify-between mb-20">
            <h1 className={`text-3xl font-bold text-cyan-400`} data-testid="home-logo">
              NSTrack
            </h1>
            <div className="flex items-center gap-4">
              {/* theme toggle intentionally removed from landing */}

              {/* people icon with dot */}
              <div className="relative">
                <button className="p-2 rounded-md hover:bg-white/5">
                  <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} />
                </button>
                <span className={`absolute -top-1 -right-0.5 w-2.5 h-2.5 bg-blue-400 rounded-full ring-2 ${theme === 'dark' ? 'ring-black' : 'ring-white'}`} />
              </div>

              {/* bell */}
              <button className="p-2 rounded-md hover:bg-white/5">
                <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} />
              </button>

              {/* Dropdown menu: shows Login/Sign Up when unauthenticated; Profile/Logout when authenticated */}
              <div className="relative">
                <button
                  onClick={(e) => { e.preventDefault(); setMenuOpen((s) => !s); }}
                  className="flex items-center gap-2 px-2 py-1 rounded-full hover:shadow-sm border border-transparent"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  {isAuthenticated ? (
                    profilePhoto ? (
                      <img src={profilePhoto} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center overflow-hidden transform transition-all hover:scale-105">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center overflow-hidden transform transition-all hover:scale-105">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white/30 rounded-full animate-pulse" />
                      </div>
                      <span className="text-sm font-medium text-cyan-400">Account</span>
                    </div>
                  )}
                  <ChevronDown className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                    {isAuthenticated ? (
                      <div className="flex flex-col py-1">
                        <button onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate('/profile'); }} className="text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Profile</button>
                        <button onClick={(e) => { e.preventDefault(); localStorage.removeItem('token'); localStorage.removeItem('user'); setIsAuthenticated(false); setMenuOpen(false); navigate('/'); }} className="text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Logout</button>
                      </div>
                    ) : (
                      <div className="flex flex-col py-1">
                        <button onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate('/login'); }} className="text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Login</button>
                        <button onClick={(e) => { e.preventDefault(); setMenuOpen(false); navigate('/signup'); }} className="text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Sign Up</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 mb-6">
              <Users className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
              <span className="text-cyan-700 dark:text-cyan-400 text-sm font-medium">Built for NST Students</span>
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-400 dark:to-blue-500">
                Your AI-Powered
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-cyan-400 dark:to-blue-500">
                Learning Mentor
              </span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Stop struggling with scattered resources. NSTrack creates personalized learning paths,
              generates practice problems, and guides you from basics to mastery - all in one place.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/signup', { replace: false });
                }}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-6 text-lg shadow-md hover:shadow-lg transition-all"
                data-testid="hero-get-started-btn"
              >
                Start Learning Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
                variant="outline"
                className="border-cyan-500 text-cyan-600 hover:bg-cyan-50 dark:text-cyan-400 hover:dark:bg-cyan-500/10 px-8 py-6 text-lg"
                data-testid="learn-more-btn"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>


      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section (dark) */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-800 shadow-xl">
          <h3 className="text-5xl font-extrabold text-white mb-6">
            Ready to Transform Your Learning Journey?
          </h3>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
            Join NSTrack today and get your personalized AI-powered learning roadmap in minutes
          </p>
          <Button
            onClick={(e) => {
              e.preventDefault();
              navigate('/signup', { replace: false });
            }}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-12 py-6 text-xl"
            data-testid="cta-signup-btn"
          >
            Get Started Free
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 dark:text-slate-400">
          <p>© 2025 NSTrack - AI-Powered Learning Mentor for NST Students</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;