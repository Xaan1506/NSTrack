import React, { useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Play, RotateCcw, CheckCircle, AlertCircle, ListChecks } from 'lucide-react';
import { toast } from 'sonner';

const CodeEditor = ({ language: initialLanguage, problem, onSubmit }) => {
  const [language, setLanguage] = useState(initialLanguage || 'javascript');
  const [code, setCode] = useState(problem?.starter || '');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [userInput, setUserInput] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'mismatch' | 'error', message: string }
  const [showTestCases, setShowTestCases] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const expectedOutput = useMemo(() => {
    return (
      problem?.expectedOutput ||
      problem?.expected_output ||
      problem?.output ||
      null
    );
  }, [problem]);

  const availableTestCases = useMemo(() => {
    return problem?.test_cases || problem?.testCases || [];
  }, [problem]);

  const getLanguageMode = (lang) => {
    const key = (lang || '').toLowerCase();
    const modes = {
      python: 'python',
      javascript: 'javascript',
      java: 'java',
      cpp: 'cpp',
      html: 'html',
      css: 'css',
      html_css: 'html'
    };
    return modes[key] || 'plaintext';
  };

  // Friendly label for UI (guard against undefined language)
  const displayLanguage = (language && typeof language === 'string' && language.trim())
    ? language.replace(/_/g, ' ').toUpperCase()
    : 'PLAINTEXT';

  const handleRun = () => {
    setIsRunning(true);
    setHasRun(true);
    setFeedback(null);
    setOutput('');
    setError('');

    setTimeout(() => {
      const trimmed = code.trim();
      if (!trimmed) {
        setError('Please write some code before running the program.');
        setIsRunning(false);
        toast.error('No code to run');
        return;
      }

      const syntaxIssue = detectSyntaxIssues(trimmed, language);
      if (syntaxIssue) {
        setError(syntaxIssue);
        setOutput('');
        setIsRunning(false);
        toast.error('Found issues in your code');
        return;
      }

      const prints = extractOutputIntent(trimmed, language);
      const preview = buildOutputPreview(prints, language);
      setOutput(preview || 'No output detected. Add print statements to display results.');
      setError('');
      setIsRunning(false);
      toast.success('Code executed (simulated)');
    }, 1000);
  };

  const handleReset = () => {
    setCode('');
    setOutput('');
    setError('');
    setUserInput('');
    setHasRun(false);
    setFeedback(null);
    setShowTestCases(false);
    toast.info('Code reset to starter template');
  };

  const detectSyntaxIssues = (source, lang) => {
    if (lang === 'python') {
      const lines = source.split('\n');
      if (source.includes('\t')) {
        return 'IndentationError: Detected tab characters. Please use spaces for indentation.';
      }
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i].trimEnd();
        if (!line.trim()) continue;
        if (line.trim().endsWith(':')) {
          let j = i + 1;
          while (j < lines.length && !lines[j].trim()) {
            j += 1;
          }
          if (j >= lines.length || !/^\s+/.test(lines[j])) {
            return `IndentationError near line ${i + 1}: expected an indented block after ':'`;
          }
        }
      }
      return null;
    }

    if (lang === 'java') {
      const javaIssue = detectJavaIssues(source);
      if (javaIssue) return javaIssue;
    }

    const issue = detectBraceMismatch(source);
    if (issue) {
      return issue;
    }

    if (lang === 'cpp') {
      const undefinedToken = detectUndeclaredCppIdentifier(source);
      if (undefinedToken) {
        return `CompileError: Identifier '${undefinedToken}' is not declared.`;
      }
    }

    return null;
  };

  // Simple Java checks: missing semicolons and missing main method scaffold
  const detectJavaIssues = (source) => {
    const lines = source.split('\n');
    // check for obvious missing semicolons on lines that look like statements
    for (let i = 0; i < lines.length; i += 1) {
      const raw = lines[i];
      const line = raw.trim();
      if (!line) continue;
      // skip lines that are block openers/closers, annotations or comments
      if (line.endsWith('{') || line.endsWith('}') || line.startsWith('//') || line.startsWith('*') || line.startsWith('@')) continue;
      // if it's a control statement or method signature, skip
      if (/^(if|for|while|switch|else|try|catch|public|private|protected|class|interface|enum)\b/.test(line)) continue;
      // lines that are method calls or statements should usually end with ';'
      if (!line.endsWith(';')) {
        // allow lines that close parentheses (e.g., method declarations) or are annotations we've skipped
        if (!/\)\s*$/.test(line)) {
          return `SyntaxError (Java) near line ${i + 1}: possible missing semicolon.`;
        }
      }
    }

    // check for main method presence - not strictly required but helpful for beginners
    if (!/public\s+static\s+void\s+main\s*\(/.test(source)) {
      // not an error, but warn if code is short and no main exists
      if (source.split('\n').length > 6 && !/class\s+\w+\s*\{/.test(source)) {
        return 'Warning: Java programs typically require a class with a main method to run.';
      }
    }

    return null;
  };

  const detectBraceMismatch = (source) => {
    const stack = [];
    const opening = new Set(['{', '(', '[']);
    const pairs = {
      '{': '}',
      '(': ')',
      '[': ']'
    };
    for (let i = 0; i < source.length; i += 1) {
      const char = source[i];
      if (opening.has(char)) {
        stack.push({ char, index: i });
      } else if (char === '}' || char === ')' || char === ']') {
        const last = stack.pop();
        if (!last || pairs[last.char] !== char) {
          return 'SyntaxError: Mismatched brackets or parentheses detected.';
        }
      }
    }
    if (stack.length > 0) {
      return 'SyntaxError: Missing closing bracket/parenthesis.';
    }
    return null;
  };

  const extractOutputIntent = (source, lang) => {
    const results = [];
    const regexMap = {
      python: /print\((.*?)\)/g,
      javascript: /console\.log\((.*?)\)/g,
      java: /System\.out\.println\((.*?)\)/g,
      cpp: /cout\s*<<\s*(.*?);/g
    };
    const regex = regexMap[lang];
    if (!regex) return results;
    let match;
    while ((match = regex.exec(source)) !== null) {
      results.push(match[1]?.trim());
    }
    return results;
  };

  const buildOutputPreview = (prints, lang) => {
    if (!prints.length) return '';
    return prints
      .map((statement) => sanitizeOutput(statement, lang))
      .filter(Boolean)
      .join('\n');
  };

  const sanitizeOutput = (raw, lang) => {
    if (!raw) return '';

    const literalMatches = [...raw.matchAll(/(["'`])([^"'`]*?)\1/g)].map((match) => match[2]);
    if (literalMatches.length > 0) {
      return literalMatches.join(' ').trim();
    }

    let cleaned = raw;
    if (lang === 'cpp') {
      cleaned = cleaned
        .replace(/std::endl/g, '\n')
        .replace(/<<\s*/g, ' ')
        .replace(/;\s*$/g, '');
    }
    cleaned = cleaned
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned;
  };

  const detectUndeclaredCppIdentifier = (source) => {
    const usageRegex = /cout\s*<<\s*([a-zA-Z_][a-zA-Z0-9_]*)\b(?!\s*<<)/g;
    let match;
    while ((match = usageRegex.exec(source)) !== null) {
      const identifier = match[1];
      if (identifier === 'std' || identifier === 'endl') continue;
      const declarationRegex = new RegExp(`\\b(int|long|float|double|char|bool|string|auto)\\s+${identifier}\\b`);
      const stdStringRegex = new RegExp(`std::(?:string|vector)<.*>\\s+${identifier}\\b`);
      if (!declarationRegex.test(source) && !stdStringRegex.test(source)) {
        return identifier;
      }
    }
    return null;
  };

  const normalizeOutputText = (text) => {
    if (Array.isArray(text)) {
      return text.map((item) => normalizeOutputText(item)).join('\n');
    }
    return text?.toString().replace(/\r/g, '').trim();
  };

  const handleSubmit = () => {
    setFeedback(null);
    if (!hasRun) {
      setFeedback({ type: 'error', message: 'Run your code before submitting.' });
      toast.error('Please run your code first');
      return;
    }
    if (error) {
      setFeedback({ type: 'error', message: 'Resolve errors before submitting.' });
      toast.error('Fix errors before submitting');
      return;
    }
    if (!output.trim() || output.includes('No output detected')) {
      setFeedback({ type: 'error', message: 'No valid output detected.' });
      toast.error('No output produced');
      return;
    }
    if (expectedOutput) {
      if (normalizeOutputText(output) !== normalizeOutputText(expectedOutput)) {
        setFeedback({
          type: 'mismatch',
          message: 'Output does not match the expected result. Review the failing test cases.'
        });
        toast.error('Output mismatch');
        return;
      }
    }
    if (onSubmit) {
      onSubmit(code);
      toast.success('Solution submitted!');
    }
  };

  return (
    <div className="space-y-4" data-testid="code-editor">
      <div className="glass-effect rounded-xl overflow-hidden border border-cyan-500/20">
        <div className="bg-slate-800/60 px-3 py-2 border-b border-slate-700">
          {/* Tab bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-900/20 rounded-t-md px-2 py-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="ml-2 text-slate-200 font-semibold">{problem?.title || 'Challenge'}</div>
              </div>
              <div className="ml-3 flex items-center text-xs text-slate-400">
                <span className="px-2 py-0.5 bg-slate-900/30 rounded">{displayLanguage}</span>
              </div>
            </div>

            {/* Editor actions resembling VS Code toolbar */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <Select
                value={language}
                onValueChange={(value) => {
                  setLanguage(value);
                  // Prevent page scroll
                  setTimeout(() => {
                    const activeElement = document.activeElement;
                    if (activeElement && activeElement.blur) {
                      activeElement.blur();
                    }
                  }, 0);
                }}
              >
                <SelectTrigger className="w-[140px] bg-slate-900/30 border-slate-700 text-slate-200 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>

              <Button size="sm" variant="ghost" onClick={handleReset} className="text-slate-300 hover:text-cyan-400" data-testid="reset-code-btn">
                <RotateCcw className="w-4 h-4 mr-1" /> Reset
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowTestCases(prev => !prev)} className="text-slate-300 border-slate-700">
                <ListChecks className="w-4 h-4 mr-1" /> {showTestCases ? 'Hide Tests' : 'Show Tests'}
              </Button>
              <Button size="sm" onClick={handleRun} disabled={isRunning} className="bg-green-600 hover:bg-green-700 text-white" data-testid="run-code-btn">
                <Play className="w-4 h-4 mr-1" /> {isRunning ? 'Running...' : 'Run'}
              </Button>
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="bg-cyan-600 hover:bg-cyan-700 text-white ml-2"
                data-testid="submit-code-btn"
              >
                <CheckCircle className="w-4 h-4 mr-1" /> Submit
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <Editor
              height="780px"
              language={getLanguageMode(language)}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: true, side: 'right', showSlider: 'hover' },
                fontSize: 13,
                fontFamily: "'Fira Code', 'Menlo', monospace",
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'off',
                folding: true,
                renderLineHighlight: 'all',
                glyphMargin: true,
                smoothScrolling: true,
                cursorBlinking: 'blink'
              }}
            />
          </div>
          <div className="md:col-span-1 p-3">
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-100 font-semibold">Custom Input</span>
              </div>
              <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} className="w-full bg-slate-900/60 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 font-mono min-h-[120px]" placeholder="Provide sample stdin values..." />
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-100 font-semibold">Output</span>
              </div>
              <pre className="bg-slate-900/60 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 min-h-[120px] whitespace-pre-wrap">{output || 'Run your code to view simulated output here.'}</pre>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-slate-100 font-semibold">Errors</span>
              </div>
              <pre className="bg-slate-900/60 border border-slate-700 rounded-lg p-3 text-sm text-rose-200 min-h-[120px] whitespace-pre-wrap">{error || 'No errors detected.'}</pre>
            </div>
          </div>
        </div>

        {/* side panel already rendered next to editor */}

        {feedback?.type === 'mismatch' && (
          <div className="glass-effect rounded-xl border border-rose-500/30 p-4 space-y-3">
            <p className="text-rose-200 text-sm">{feedback.message}</p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setFeedback(null)}
                className="border-rose-400 text-rose-200 hover:bg-rose-500/10"
              >
                Retry Answer
              </Button>
              {availableTestCases.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowTestCases((prev) => !prev)}
                  className="border-cyan-400 text-cyan-200 hover:bg-cyan-500/10"
                >
                  <ListChecks className="w-4 h-4 mr-2" />
                  {showTestCases ? 'Hide Test Cases' : 'View Test Cases'}
                </Button>
              )}
            </div>
            {showTestCases && (
              <div className="mt-3 space-y-3">
                {availableTestCases.map((test, idx) => (
                  <div key={idx} className="bg-slate-900/60 border border-slate-700 rounded-lg p-3 text-sm text-slate-200">
                    <p className="font-semibold text-cyan-300 mb-1">Test #{idx + 1}</p>
                    {test.input && (
                      <p className="mb-1">
                        <span className="text-slate-400">Input:</span> {test.input}
                      </p>
                    )}
                    {test.output && (
                      <p>
                        <span className="text-slate-400">Expected:</span> {test.output}
                      </p>
                    )}
                    {test.explanation && (
                      <p className="text-slate-400 mt-1">{test.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {feedback?.type === 'error' && (
          <div className="glass-effect rounded-xl border border-yellow-500/30 p-3 text-sm text-yellow-100">
            {feedback.message}
          </div>
        )}

        {onSubmit && (
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              data-testid="submit-solution-btn"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit Solution
            </Button>
          </div>
        )}
        {/* Status bar (VS Code style) */}
        <div className="mt-2 bg-slate-900/40 border border-slate-800 rounded-b-md px-4 py-2 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="px-2 py-0.5 bg-slate-800/40 rounded">UTF-8</span>
            <span className="px-2 py-0.5 bg-slate-800/40 rounded">Spaces: 4</span>
            <span className="px-2 py-0.5 bg-slate-800/40 rounded">LF</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Ln 1, Col 1</span>
            <span className="text-slate-400">Prettier</span>
            <span className="text-slate-400">main</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;