import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '../components/ui/button';
import InteractiveBubble from '../components/InteractiveBubble';

const BubbleGame = () => {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [collisions, setCollisions] = useState(0);
    const bubbleRefs = useRef([]);

    // Generate 30 bubbles with random positions
    const bubbleData = Array.from({ length: 30 }, (_, i) => ({
        key: ['😀', '😎', '🎮', '🚀', '⭐', '💎', '🔥', '⚡', '🎯', '🏆'][i % 10],
        delay: `${Math.random() * 5}s`,
        duration: `${15 + Math.random() * 15}s`,
        x: `${5 + Math.random() * 85}%`,
        y: `${5 + Math.random() * 85}%`,
    }));

    // Initialize refs array
    if (bubbleRefs.current.length !== bubbleData.length) {
        bubbleRefs.current = Array(bubbleData.length)
            .fill(null)
            .map((_, i) => bubbleRefs.current[i] || React.createRef());
    }

    // Listen for collision events
    useEffect(() => {
        const handleCollision = () => {
            setCollisions(prev => prev + 1);
            setScore(prev => prev + 10);
        };

        window.addEventListener('bubbleCollision', handleCollision);
        return () => window.removeEventListener('bubbleCollision', handleCollision);
    }, []);

    const handleReset = () => {
        setScore(0);
        setCollisions(0);
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 overflow-hidden relative">
            {/* Game Header */}
            <div className="absolute top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                            Bubble Collision Game
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="bg-cyan-500/20 px-4 py-2 rounded-lg border border-cyan-500/30">
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-400" />
                                    <span className="text-white font-bold">{score}</span>
                                    <span className="text-cyan-300 text-sm">points</span>
                                </div>
                            </div>
                            <div className="bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-500/30">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold">{collisions}</span>
                                    <span className="text-purple-300 text-sm">collisions</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                        </Button>
                        <Button
                            onClick={() => navigate('/')}
                            variant="ghost"
                            className="text-white hover:bg-white/10"
                        >
                            <X className="w-5 h-5 mr-2" />
                            Exit Game
                        </Button>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-40 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                <p className="text-white text-center">
                    <span className="text-cyan-400 font-bold">Move your mouse</span> to push bubbles into each other!
                    <span className="text-purple-400 font-bold ml-2">+10 points</span> per collision! 😠
                </p>
            </div>

            {/* Bubbles */}
            <div className="absolute inset-0 overflow-hidden">
                {bubbleData.map((item, index) => (
                    <InteractiveBubble
                        key={index}
                        ref={bubbleRefs.current[index]}
                        keyText={item.key}
                        initialX={item.x}
                        initialY={item.y}
                        delay={item.delay}
                        duration={item.duration}
                        theme="dark"
                        bubbles={bubbleRefs.current}
                        index={index}
                    />
                ))}
            </div>

            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Score milestone celebrations */}
            {score > 0 && score % 100 === 0 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
                        🎉 {score} Points! 🎉
                    </div>
                </div>
            )}
        </div>
    );
};

export default BubbleGame;
