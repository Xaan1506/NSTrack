import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import ConfettiCelebration from '../components/ConfettiCelebration';
import { useProgress } from '../context/ProgressContext';

const LoginPage = ({ setAuth }) => {
  const navigate = useNavigate();
  const { updateStreak } = useProgress();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert email to lowercase before sending to the server
      const loginData = {
        ...formData,
        email: formData.email.toLowerCase()
      };

      const response = await axios.post(`${API}/auth/login`, loginData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Show celebration
      setShowConfetti(true);
      setShowWelcome(true);
      updateStreak();

      toast.success('Login successful!');

      // Navigate after animation
      setTimeout(() => {
        setAuth(true);
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
      setLoading(false);
    }
  };

  // Force dark theme for login page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('bg-black', 'text-white');
    return () => {
      // Cleanup if needed when component unmounts
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
      {/* Background video */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none">
        <source src="/background-video.mp4" type="video/mp4" />
      </video>
      <ConfettiCelebration show={showConfetti} onComplete={() => setShowConfetti(false)} />

      <Link to="/" className="absolute top-6 left-6">
        <Button variant="ghost" className="text-slate-300 hover:text-cyan-400" data-testid="home-btn">
          ← Home
        </Button>
      </Link>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {showWelcome && (
          <div className="bg-gray-900/90 rounded-2xl p-6 mb-6 text-center border border-gray-800">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
              Welcome Back! 🎉
            </h2>
            <p className="text-gray-400">Redirecting to your dashboard...</p>
          </div>
        )}

        <div className="bg-gray-900/90 rounded-2xl p-8 border border-gray-800 hover:border-cyan-500/30 transition-colors">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2" data-testid="login-title">
              NSTrack
            </h1>
            <p className="text-gray-400 text-lg font-medium">Your AI-Powered Learning Mentor</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            <div>
              <Label htmlFor="email" className="text-slate-200 text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="email-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2 bg-gray-800 border-gray-700 text-white focus:border-cyan-500 focus:ring-cyan-500"
                placeholder="your.email@nst.edu"
                required
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Label htmlFor="password" className="text-slate-200 text-sm font-medium">Password</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  data-testid="password-input"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 300);
                  }}
                  className="bg-gray-800 border-gray-700 text-white focus:border-cyan-500 focus:ring-cyan-500 pr-12"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>

                {/* Typing Animation Effect */}
                {isTyping && formData.password && (
                  <>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 animate-pulse pointer-events-none" />

                    {/* Particle effects */}
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping pointer-events-none"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '0.6s'
                        }}
                      />
                    ))}

                    {/* Scanning line effect */}
                    <div
                      className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-scan pointer-events-none"
                      style={{
                        animation: 'scan 0.8s ease-in-out'
                      }}
                    />
                  </>
                )}
              </div>
            </div>

            <Button
              type="submit"
              data-testid="login-submit-btn"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium" data-testid="signup-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;