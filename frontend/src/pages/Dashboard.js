import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Code, Smartphone, Brain, Trophy, User, LogOut, Sun, Moon, Flame } from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { progress, getProblemsSolved, getTopicProgress } = useProgress();
  const [user, setUser] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));

      // Check if this is the first time the user is logging in
      const firstLogin = localStorage.getItem('firstLogin');
      if (firstLogin === null) {
        // This is the first login
        localStorage.setItem('firstLogin', 'false');
        // You could also set a state to show a special welcome message
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    window.location.href = '/';
  };

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    navigate(`/language/${lang}`);
  };

  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
    localStorage.setItem('selectedTrack', track);
    toast.success(`${track} selected!`);
  };

  const handleGenerateRoadmap = () => {
    if (!selectedTrack) {
      toast.error('Please select a learning track first');
      return;
    }
    navigate('/roadmap');
  };

  const tracks = [
    {
      id: 'web-dev',
      name: 'Web Development',
      icon: Code,
      description: 'Build modern websites and web applications',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'app-dev',
      name: 'App Development',
      icon: Smartphone,
      description: 'Create mobile applications for iOS and Android',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'ai-ml',
      name: 'AI / Machine Learning',
      icon: Brain,
      description: 'Master artificial intelligence and ML algorithms',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'dsa-cp',
      name: 'DSA & Competitive Programming',
      icon: Trophy,
      description: 'Excel in data structures and problem-solving',
      color: 'from-pink-500 to-red-600'
    }
  ];

  const problemsSolved = getProblemsSolved();
  const topicsCompleted = progress.selectedLanguage ? getTopicProgress(progress.selectedLanguage) : 0;
  const totalProgress = Math.min(((problemsSolved * 10 + topicsCompleted * 15) / 100) * 100, 100);

  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-200">
      {/* Header */}
      <nav className="bg-black/90 backdrop-blur-sm border-b border-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500" data-testid="dashboard-title">
              NSTrack
            </h1>
          </Link>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <div className="hidden md:block">
              <Select value={selectedLanguage} onValueChange={handleLanguageSelect}>
                <SelectTrigger className="w-[220px] bg-gray-900/70 border-gray-800 text-slate-200 hover:border-cyan-500/50 transition-all duration-300" data-testid="language-nav-selector">
                  <SelectValue placeholder="Languages" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800 text-slate-200 animate-slide-down">
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="html_css">HTML & CSS</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-800 text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <Link to="/problems">
              <Button variant="ghost" className="text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50 transition-all duration-300" data-testid="problems-nav-btn">
                <Trophy className="w-4 h-4 mr-2" />
                Problems
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" className="text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50 transition-all duration-300" data-testid="profile-nav-btn">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-300 hover:text-red-400 hover:bg-gray-800/50 transition-all duration-300"
              data-testid="logout-button"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Welcome Section */}
        <section className="mb-12 animate-fade-in">
          <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800 overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-[length:200%_auto] animate-shimmer">
                {localStorage.getItem('firstLogin') === 'false' ?
                  `Welcome to NSTrack, ${user?.name?.split(' ')[0]}! 🎉` :
                  `Welcome back, ${user?.name?.split(' ')[0]}!`}
              </h2>
              <div className="flex items-center gap-3">
                <p className="text-lg text-slate-300">
                  Your Points:
                </p>
                <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 rounded-lg border border-cyan-500/30">
                  <Flame className="w-5 h-5 text-cyan-400 animate-bounce-subtle" />
                  <span className="text-cyan-400 font-bold text-2xl" data-testid="user-points">{user?.points || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid with Staggered Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 font-medium">Overall Progress</p>
              <span className="text-cyan-400 font-bold text-lg">{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-3 bg-gray-800 transition-all duration-500" data-testid="overall-progress" />
            <div className="mt-2 text-xs text-gray-500">Keep pushing forward!</div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <p className="text-gray-400 mb-3 font-medium">Topics Completed</p>
            <div className="flex items-center gap-3">
              <p className="text-4xl font-bold text-white" data-testid="topics-completed">{topicsCompleted}</p>
              <Trophy className="w-8 h-8 text-blue-400" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Topics mastered</div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <p className="text-gray-400 mb-3 font-medium">Problems Solved</p>
            <div className="flex items-center gap-3">
              <p className="text-4xl font-bold text-white" data-testid="problems-solved">{problemsSolved}</p>
              <Code className="w-8 h-8 text-purple-400" />
            </div>
            <div className="mt-2 text-xs text-gray-500">Challenges conquered</div>
          </div>
        </div>

        {/* Mobile Language Selector */}
        <div className="md:hidden mb-12 bg-black/80 rounded-2xl p-6 border border-gray-800 animate-fade-in">
          <h3 className="text-xl font-bold text-white mb-3">Languages</h3>
          <Select value={selectedLanguage} onValueChange={handleLanguageSelect}>
            <SelectTrigger className="bg-black/80 border-gray-800 text-white hover:border-cyan-500/50 transition-colors" data-testid="language-selector-mobile">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800 text-gray-100 animate-slide-down">
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="html_css">HTML & CSS</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Learning Tracks */}
        <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <h3 className="text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Select a Learning Track</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                onClick={() => handleTrackSelect(track.name)}
                className="group relative bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 cursor-pointer border border-gray-800 hover:border-transparent transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-scale-in overflow-hidden"
                style={{ animationDelay: `${0.5 + index * 0.1}s`, animationFillMode: 'both' }}
                data-testid={`track-card-${track.id}`}
              >
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${track.color} text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <track.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                    {track.name}
                  </h3>
                  <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">{track.description}</p>
                </div>

                {/* Selection indicator */}
                {selectedTrack === track.name && (
                  <div className="absolute top-3 right-3 w-3 h-3 bg-cyan-400 rounded-full animate-pulse-glow"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Generate Roadmap Button */}
        {selectedTrack && (
          <div className="flex justify-center mb-12 animate-slide-up">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500 animate-pulse-glow"></div>
              <div className="relative bg-gradient-to-r from-gray-900 to-black border border-gray-800 text-white rounded-2xl p-8 shadow-xl">
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none text-lg"
                  onClick={handleGenerateRoadmap}
                  data-testid="generate-roadmap-btn"
                >
                  Generate Roadmap
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Motivational Message */}
        {totalProgress > 0 && (
          <div className="mt-12 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 text-center border border-gray-800 hover:border-cyan-500/30 transition-all duration-500 animate-slide-up shadow-lg hover:shadow-cyan-500/10">
            <p className="text-xl text-gray-300 font-medium">
              {totalProgress < 25 && "🌱 Great start! Keep learning consistently."}
              {totalProgress >= 25 && totalProgress < 50 && "🚀 You're making solid progress! Keep going."}
              {totalProgress >= 50 && totalProgress < 75 && "🌟 Excellent work! You're more than halfway there."}
              {totalProgress >= 75 && "🏆 Outstanding! You're becoming a master!"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;