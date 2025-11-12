import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API, getAuthHeaders } from '../App';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Trophy, Loader2, Check, Lightbulb, Code, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import CodeEditor from '../components/CodeEditor';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';

const ProblemsPage = () => {
  const [user, setUser] = useState(null);
  const [track, setTrack] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showEditor, setShowEditor] = useState({});
  const { markProblemComplete: markProblemInProgress } = useProgress();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    const savedTrack = localStorage.getItem('selectedTrack');
    if (savedTrack) {
      setTrack(savedTrack);
    }
  }, []);

  const generateProblems = async () => {
    if (!track || !difficulty) {
      toast.error('Please select both track and difficulty');
      return;
    }

    setLoading(true);
    try {
      const trackNames = {
        'web-dev': 'Web Development',
        'app-dev': 'App Development',
        'ai-ml': 'AI Machine Learning',
        'dsa-cp': 'DSA Competitive Programming'
      };

      const response = await axios.post(
        `${API}/problems/generate`,
        {
          track: trackNames[track] || track,
          difficulty: difficulty,
          count: 5
        },
        { headers: getAuthHeaders() }
      );

      setProblems(response.data.problems);
      toast.success('Problems generated!');
    } catch (error) {
      toast.error('Failed to generate problems');
    } finally {
      setLoading(false);
    }
  };

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

      await axios.post(
        `${API}/problems/complete`,
        { problem_id: problemId, user_id: user.id },
        { headers: getAuthHeaders() }
      );

      const problem = problems.find(p => p.id === problemId);
      const pointsEarned = pointsMap[problem.difficulty] || 0;

      // Update points
      const newPoints = user.points + pointsEarned;
      await axios.put(
        `${API}/auth/profile`,
        { points: newPoints },
        { headers: getAuthHeaders() }
      );

      setUser({ ...user, points: newPoints });
      localStorage.setItem('user', JSON.stringify({ ...user, points: newPoints }));

      // Track in progress context
      markProblemInProgress(track, problemId, problemId);

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

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ 
      background: theme === 'dark' 
        ? 'linear-gradient(135deg, rgb(3,7,18) 0%, rgb(6,15,35) 100%)' 
        : 'linear-gradient(135deg, rgb(243,244,246) 0%, rgb(229,231,235) 100%)'
    }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header with Theme Toggle */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Trophy className={`w-12 h-12 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`} />
              <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500" data-testid="problems-title">
                Practice Problems
              </h1>
            </div>
            
            {/* Theme Toggle Button */}
            <Button
              onClick={toggleTheme}
              data-testid="theme-toggle-btn"
              className={`rounded-full w-12 h-12 p-0 shadow-lg transition-all duration-300 ${
                theme === 'dark'
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
              Challenge yourself and earn points
            </p>
            <p className={`font-semibold mt-2 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`} data-testid="problems-points">
              Your Points: {user?.points || 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div 
          className={`rounded-2xl p-6 mb-8 transition-all duration-300 ${
            theme === 'dark' 
              ? 'glass-effect' 
              : 'bg-white shadow-lg border-2 border-gray-200'
          }`} 
          style={{ position: 'relative', zIndex: 10 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div style={{ position: 'relative', zIndex: 30 }}>
              <label className={`text-sm font-medium mb-2 block ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                Learning Track
              </label>
              <Select value={track} onValueChange={setTrack}>
                <SelectTrigger 
                  className={theme === 'dark' 
                    ? 'bg-slate-800/50 border-slate-700 text-white' 
                    : 'bg-gray-50 border-gray-300 text-slate-900'
                  } 
                  data-testid="track-selector"
                >
                  <SelectValue placeholder="Select track" />
                </SelectTrigger>
                <SelectContent 
                  className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'} 
                  style={{ zIndex: 9999 }}
                >
                  <SelectItem value="web-dev">Web Development</SelectItem>
                  <SelectItem value="app-dev">App Development</SelectItem>
                  <SelectItem value="ai-ml">AI / ML</SelectItem>
                  <SelectItem value="dsa-cp">DSA & CP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div style={{ position: 'relative', zIndex: 20 }}>
              <label className={`text-sm font-medium mb-2 block ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                Difficulty
              </label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger 
                  className={theme === 'dark' 
                    ? 'bg-slate-800/50 border-slate-700 text-white' 
                    : 'bg-gray-50 border-gray-300 text-slate-900'
                  } 
                  data-testid="difficulty-selector"
                >
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent 
                  className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'} 
                  style={{ zIndex: 9999 }}
                >
                  <SelectItem value="Easy">Easy (+2 points)</SelectItem>
                  <SelectItem value="Medium">Medium (+5 points)</SelectItem>
                  <SelectItem value="Hard">Hard (+10 points)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={generateProblems}
                data-testid="generate-problems-btn"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Problems'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Problems List */}
        {problems.length > 0 && (
          <div className="space-y-4" data-testid="problems-list">
            {problems.map((problem, index) => (
              <div 
                key={problem.id} 
                className={`rounded-xl p-6 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'problem-card'
                    : 'bg-white shadow-md border-2 border-gray-200 hover:shadow-xl hover:border-blue-300'
                }`}
                data-testid={`problem-${index}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {problem.title}
                      </h3>
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      {completedProblems.has(problem.id) && (
                        <Badge className="bg-cyan-500/20 text-cyan-400">
                          <Check className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
                      {problem.description}
                    </p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="mt-4">
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

                  <AccordionItem value="solution" className={theme === 'dark' ? 'border-slate-700' : 'border-gray-300'}>
                    <AccordionTrigger className={`hover:no-underline ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>
                      Solution Approach
                    </AccordionTrigger>
                    <AccordionContent className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                      {problem.solution_approach}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="mt-4 space-y-4">
                  {!showEditor[problem.id] && (
                    <Button
                      onClick={() => toggleEditor(problem.id)}
                      data-testid={`open-editor-${index}`}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Open Code Editor
                    </Button>
                  )}

                  {showEditor[problem.id] && (
                    <div className="space-y-4" data-testid={`editor-${index}`}>
                      <CodeEditor
                        language={track === 'web-dev' ? 'javascript' : 'python'}
                        problem={problem}
                        onSubmit={(code) => handleCodeSubmit(problem.id, code)}
                      />
                      <Button
                        onClick={() => toggleEditor(problem.id)}
                        variant="outline"
                        className="border-slate-600 text-slate-300"
                      >
                        Close Editor
                      </Button>
                    </div>
                  )}

                  {!completedProblems.has(problem.id) && !showEditor[problem.id] && (
                    <Button
                      onClick={() => markComplete(problem.id)}
                      data-testid={`complete-problem-${index}`}
                      className="bg-green-600 hover:bg-green-700 text-white ml-3"
                    >
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && problems.length === 0 && (
          <div className="text-center text-slate-400 py-12" data-testid="no-problems">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Select track and difficulty to generate problems</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemsPage;