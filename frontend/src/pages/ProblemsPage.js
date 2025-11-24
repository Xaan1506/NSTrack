import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API, getAuthHeaders } from '../App';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Trophy, Loader2, Check, Lightbulb, Code, Sun, Moon, FileText, AlertCircle, Filter } from 'lucide-react';
import { toast } from 'sonner';
import CodeEditor from '../components/CodeEditor';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { problemsByTrack, filterProblems } from '../data/codingProblems';

const ProblemsPage = () => {
  const [user, setUser] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [showEditor, setShowEditor] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({ track: 'all', phase: 'all', difficulty: 'all' });
  const { markProblemComplete: markProblemInProgress } = useProgress();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleEditor = (problemId) => {
    setShowEditor(prev => ({ ...prev, [problemId]: !prev[problemId] }));
  };

  const handleCodeSubmit = async (problemId, code) => {
    await markComplete(problemId);
    toast.success('Solution submitted and verified!');
  };

  const markComplete = async (problemId) => {
    try {
      const pointsMap = {
        'Easy': 2,
        'Medium': 5,
        'Hard': 10
      };

      const allProblems = getAllProblems();
      const problem = allProblems.find(p => p.id === problemId);
      const pointsEarned = pointsMap[problem.difficulty] || 0;

      // Update points
      const newPoints = user.points + pointsEarned;
      setUser({ ...user, points: newPoints });
      localStorage.setItem('user', JSON.stringify({ ...user, points: newPoints }));

      setCompletedProblems(new Set([...completedProblems, problemId]));
      toast.success(`+${pointsEarned} points earned!`);
    } catch (error) {
      toast.error('Failed to mark as complete');
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Hard': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[difficulty] || 'bg-slate-500/20 text-slate-400';
  };

  const getAllProblems = () => {
    const allProblems = [];
    Object.values(problemsByTrack).forEach(track => {
      Object.values(track).forEach(phaseProblems => {
        allProblems.push(...phaseProblems);
      });
    });
    return allProblems;
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      track: selectedTrack,
      phase: selectedPhase,
      difficulty: selectedDifficulty
    });
    toast.success('Filters applied!');
  };

  // Get filtered problems based on applied filters
  const getFilteredProblems = () => {
    const { track, phase, difficulty } = appliedFilters;
    let problems = [];

    if (track === 'all') {
      problems = getAllProblems();
    } else {
      const trackData = problemsByTrack[track];
      if (trackData) {
        Object.values(trackData).forEach(phaseProblems => {
          problems.push(...phaseProblems);
        });
      }
    }

    if (phase !== 'all') {
      const phaseNum = parseInt(phase);
      problems = problems.filter(p => p.phase === phaseNum);
    }

    if (difficulty !== 'all') {
      problems = problems.filter(p => p.difficulty === difficulty);
    }

    return problems;
  };

  // Group problems by phase and track for display
  const getGroupedProblems = () => {
    const filtered = getFilteredProblems();
    const grouped = {};

    filtered.forEach(problem => {
      const key = `Phase ${problem.phase}: ${problem.track}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(problem);
    });

    // Sort by phase
    const sortedGrouped = {};
    Object.keys(grouped).sort().forEach(key => {
      sortedGrouped[key] = grouped[key];
    });

    return sortedGrouped;
  };

  const getPhaseColor = (phase) => {
    const colors = {
      1: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      2: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      3: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      4: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    };
    return colors[phase] || 'bg-slate-500/20 text-slate-400';
  };

  const groupedProblems = getGroupedProblems();
  const totalProblems = getFilteredProblems().length;

  const renderProblemCard = (problem, index) => (
    <div
      key={problem.id}
      className={`rounded-xl p-6 transition-all duration-300 animate-slide-up ${theme === 'dark'
        ? 'problem-card'
        : 'bg-white shadow-md border-2 border-gray-200 hover:shadow-xl hover:border-blue-300'
        }`}
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {problem.title}
            </h3>
            <Badge className={getPhaseColor(problem.phase)}>
              Phase {problem.phase}
            </Badge>
            <Badge className={getDifficultyColor(problem.difficulty)}>
              {problem.difficulty}
            </Badge>
            {completedProblems.has(problem.id) && (
              <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Check className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
          <p className={`text-base mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
            {problem.description}
          </p>
          {problem.prerequisites && problem.prerequisites.length > 0 && (
            <div className="mb-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Prerequisites:
              </span>
              <span className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                {' '}{problem.prerequisites.join(', ')}
              </span>
            </div>
          )}
          {problem.tags && (
            <div className="flex gap-2 flex-wrap mt-2">
              {problem.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <Accordion type="single" collapsible className="mt-4">
        {problem.fullDescription && (
          <AccordionItem value="details" className={theme === 'dark' ? 'border-slate-700' : 'border-gray-300'}>
            <AccordionTrigger className={`hover:no-underline ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Full Description
              </div>
            </AccordionTrigger>
            <AccordionContent className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
              <p className="whitespace-pre-line">{problem.fullDescription}</p>
            </AccordionContent>
          </AccordionItem>
        )}

        {problem.hints && (
          <AccordionItem value="hints" className={theme === 'dark' ? 'border-slate-700' : 'border-gray-300'}>
            <AccordionTrigger className={`hover:no-underline ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                View Hints
              </div>
            </AccordionTrigger>
            <AccordionContent className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
              <ul className="space-y-2">
                {problem.hints.map((hint, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className={theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}>
                      {idx + 1}.
                    </span>
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {problem.solution_approach && (
          <AccordionItem value="solution" className={theme === 'dark' ? 'border-slate-700' : 'border-gray-300'}>
            <AccordionTrigger className={`hover:no-underline ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>
              Solution Approach
            </AccordionTrigger>
            <AccordionContent className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
              <pre className="whitespace-pre-line">{problem.solution_approach}</pre>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      <div className="mt-6 space-y-4">
        {!showEditor[problem.id] && (
          <Button
            onClick={() => toggleEditor(problem.id)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
          >
            <Code className="w-4 h-4 mr-2" />
            Open Code Editor
          </Button>
        )}

        {showEditor[problem.id] && (
          <div className="space-y-4">
            <CodeEditor
              problem={problem}
              onSubmit={(code) => handleCodeSubmit(problem.id, code)}
            />
            <Button
              onClick={() => toggleEditor(problem.id)}
              variant="outline"
              className={`${theme === 'dark' ? 'border-slate-600 text-slate-300' : 'border-gray-300 text-slate-700'}`}
            >
              Close Editor
            </Button>
          </div>
        )}

        {!completedProblems.has(problem.id) && !showEditor[problem.id] && (
          <Button
            onClick={() => markComplete(problem.id)}
            className="bg-green-600 hover:bg-green-700 text-white ml-3"
          >
            Mark as Complete
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-300">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{
            opacity: theme === 'dark' ? 0.15 : 0.08,
            filter: theme === 'dark' ? 'brightness(0.7) contrast(1.2)' : 'brightness(1.3) contrast(0.8)'
          }}
        >
          <source src="/1992-153555258.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay for better text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(135deg, rgba(3,7,18,0.95) 0%, rgba(6,15,35,0.92) 100%)'
              : 'linear-gradient(135deg, rgba(243,244,246,0.95) 0%, rgba(229,231,235,0.92) 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header with Theme Toggle */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className={`w-12 h-12 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`} />
              <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500" data-testid="problems-title">
                Coding Problems
              </h1>
            </div>

            <Button
              onClick={toggleTheme}
              data-testid="theme-toggle-btn"
              className={`rounded-full w-12 h-12 p-0 shadow-lg transition-all duration-300 ${theme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400'
                : 'bg-white hover:bg-gray-100 text-slate-800 border-2 border-gray-300'
                }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              {totalProblems} problems available • Challenge yourself and earn points
            </p>
            <p className={`font-semibold mt-2 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`} data-testid="problems-points">
              Your Points: {user?.points || 0}
            </p>
          </div>
        </div>

        {/* Filters Section - At Top */}
        <div
          className={`rounded-2xl p-6 mb-8 transition-all duration-300 animate-slide-up ${theme === 'dark'
            ? 'glass-effect'
            : 'bg-white shadow-lg border-2 border-gray-200'
            }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`} />
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Filter Problems
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={`text-sm font-medium mb-2 block ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                Learning Track
              </label>
              <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                <SelectTrigger
                  className={theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700 text-white'
                    : 'bg-gray-50 border-gray-300 text-slate-900'
                  }
                >
                  <SelectValue placeholder="All Tracks" />
                </SelectTrigger>
                <SelectContent className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}>
                  <SelectItem value="all">All Tracks</SelectItem>
                  <SelectItem value="dsa-cp">DSA & CP</SelectItem>
                  <SelectItem value="web-dev">Web Development</SelectItem>
                  <SelectItem value="app-dev">App Development</SelectItem>
                  <SelectItem value="ai-ml">AI / ML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className={`text-sm font-medium mb-2 block ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                Learning Phase
              </label>
              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger
                  className={theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700 text-white'
                    : 'bg-gray-50 border-gray-300 text-slate-900'
                  }
                >
                  <SelectValue placeholder="All Phases" />
                </SelectTrigger>
                <SelectContent className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}>
                  <SelectItem value="all">All Phases</SelectItem>
                  <SelectItem value="1">Phase 1: Foundations</SelectItem>
                  <SelectItem value="2">Phase 2: Core Concepts</SelectItem>
                  <SelectItem value="3">Phase 3: Advanced</SelectItem>
                  <SelectItem value="4">Phase 4: Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className={`text-sm font-medium mb-2 block ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                Difficulty
              </label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger
                  className={theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700 text-white'
                    : 'bg-gray-50 border-gray-300 text-slate-900'
                  }
                >
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy (+2 points)</SelectItem>
                  <SelectItem value="Medium">Medium (+5 points)</SelectItem>
                  <SelectItem value="Hard">Hard (+10 points)</SelectItem>
                </SelectContent>
              </Select>
            </div>


          </div>

          {/* Apply Filters Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleApplyFilters}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8"
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Problems by Track */}
        {Object.keys(groupedProblems).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedProblems).map(([trackName, problems]) => (
              <div key={trackName} className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {trackName}
                  </h2>
                  <Badge className={`${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'} text-sm px-3 py-1`}>
                    {problems.length} {problems.length === 1 ? 'problem' : 'problems'}
                  </Badge>
                </div>

                <div className="space-y-6">
                  {problems.map((problem, index) => renderProblemCard(problem, index))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`text-center py-12 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
          >
            <Trophy className={`w-16 h-16 mx-auto mb-4 opacity-50 ${theme === 'dark' ? '' : 'text-slate-400'}`} />
            <p className="text-lg">No problems match your filters</p>
            <p className="text-sm mt-2">Try adjusting your filters to see more problems</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemsPage;