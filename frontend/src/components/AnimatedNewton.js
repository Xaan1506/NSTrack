import React, { useState, useEffect } from 'react';

const AnimatedNewton = ({ className = '' }) => {
    const [isAnimating, setIsAnimating] = useState(true);
    const letters = ['N', 'E', 'W', 'T', 'O', 'N'];

    useEffect(() => {
        // Stop animation after letters have joined
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    // Generate random starting positions for each letter
    const getRandomStartPosition = (index) => {
        const positions = [
            { x: -300, y: -200, rotate: -720 },
            { x: 250, y: -180, rotate: 540 },
            { x: -280, y: 200, rotate: -540 },
            { x: 300, y: 180, rotate: 720 },
            { x: -250, y: 150, rotate: -360 },
            { x: 280, y: -150, rotate: 480 },
        ];
        return positions[index] || { x: 0, y: 0, rotate: 0 };
    };

    return (
        <>
            <style>{`
        @keyframes flyInLetter {
          0% {
            transform: translate(var(--start-x), var(--start-y)) rotate(var(--start-rotate)) scale(0);
            opacity: 0;
          }
          60% {
            opacity: 1;
          }
          80% {
            transform: translate(0, 0) rotate(0deg) scale(1.15);
          }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
        }
      `}</style>

            <div className={`relative inline-flex items-center justify-center ${className}`}>
                {letters.map((letter, index) => {
                    const startPos = getRandomStartPosition(index);
                    const animationDelay = index * 0.2;

                    return (
                        <span
                            key={index}
                            className="inline-block font-bold"
                            style={{
                                '--start-x': `${startPos.x}px`,
                                '--start-y': `${startPos.y}px`,
                                '--start-rotate': `${startPos.rotate}deg`,
                                animation: isAnimating ? `flyInLetter 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${animationDelay}s forwards` : 'none',
                                opacity: isAnimating ? 0 : 1,
                                transform: isAnimating ? `translate(${startPos.x}px, ${startPos.y}px) rotate(${startPos.rotate}deg) scale(0)` : 'translate(0, 0) rotate(0deg) scale(1)',
                            }}
                        >
                            {letter}
                        </span>
                    );
                })}
            </div>
        </>
    );
};

export default AnimatedNewton;
