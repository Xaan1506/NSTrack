import React, { useState, useEffect, useRef, useCallback } from 'react';

const InteractiveBubble = ({ keyText, initialX, initialY, delay, duration, theme }) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const bubbleRef = useRef(null);
    const animationFrameRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        if (!bubbleRef.current) return;

        const rect = bubbleRef.current.getBoundingClientRect();
        const bubbleCenterX = rect.left + rect.width / 2;
        const bubbleCenterY = rect.top + rect.height / 2;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate distance from mouse to bubble center
        const dx = bubbleCenterX - mouseX;
        const dy = bubbleCenterY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Repulsion radius (how close mouse needs to be to push bubble)
        const repulsionRadius = 150;

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
            if (distance < repulsionRadius && distance > 0) {
                // Calculate repulsion force (stronger when closer)
                const force = (repulsionRadius - distance) / repulsionRadius;
                const pushX = (dx / distance) * force * 80;
                const pushY = (dy / distance) * force * 80;

                setOffset({ x: pushX, y: pushY });
            } else {
                // Gradually return to original position
                setOffset(prev => {
                    const newX = prev.x * 0.92;
                    const newY = prev.y * 0.92;

                    // Stop updating if very close to zero
                    if (Math.abs(newX) < 0.1 && Math.abs(newY) < 0.1) {
                        return { x: 0, y: 0 };
                    }

                    return { x: newX, y: newY };
                });
            }
        });
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [handleMouseMove]);

    return (
        <div
            ref={bubbleRef}
            className="absolute animate-float-bubble transition-transform duration-200 ease-out"
            style={{
                left: initialX,
                top: initialY,
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                animationDelay: delay,
                animationDuration: duration,
            }}
        >
            <div
                className={`px-4 py-2 rounded-lg border-2 font-mono text-sm font-bold backdrop-blur-sm shadow-lg cursor-pointer hover:scale-110 transition-all ${theme === 'dark'
                    ? 'bg-slate-800/30 border-cyan-500/30 text-cyan-400 hover:bg-slate-800/50 hover:border-cyan-500/50'
                    : 'bg-white/40 border-cyan-400/40 text-cyan-600 hover:bg-white/60 hover:border-cyan-400/60'
                    }`}
            >
                {keyText}
            </div>
        </div>
    );
};

export default InteractiveBubble;
