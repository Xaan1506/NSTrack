import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';

const InteractiveBubble = forwardRef(({ keyText, initialX, initialY, delay, duration, theme, bubbles, index }, ref) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [showAngry, setShowAngry] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const animationFrameRef = useRef(null);
    const targetOffsetRef = useRef({ x: 0, y: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e) => {
        if (!ref || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const bubbleCenterX = rect.left + rect.width / 2;
        const bubbleCenterY = rect.top + rect.height / 2;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate distance from mouse to bubble center
        const dx = bubbleCenterX - mouseX;
        const dy = bubbleCenterY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Repulsion radius
        const repulsionRadius = 200;

        if (distance < repulsionRadius && distance > 0) {
            // Calculate repulsion force
            const force = (repulsionRadius - distance) / repulsionRadius;
            const pushX = (dx / distance) * force * 100;
            const pushY = (dy / distance) * force * 100;

            targetOffsetRef.current = { x: pushX, y: pushY };

            // Set velocity for collision detection
            velocityRef.current = {
                x: (pushX - offset.x) * 0.3,
                y: (pushY - offset.y) * 0.3
            };
        } else {
            targetOffsetRef.current = { x: 0, y: 0 };
            velocityRef.current = { x: velocityRef.current.x * 0.95, y: velocityRef.current.y * 0.95 };
        }
    }, [ref, offset]);

    // Check collision with other bubbles
    const checkCollisions = useCallback(() => {
        if (!ref || !ref.current || !bubbles) return;

        const myRect = ref.current.getBoundingClientRect();
        const myCenterX = myRect.left + myRect.width / 2;
        const myCenterY = myRect.top + myRect.height / 2;
        const myRadius = myRect.width / 2;

        bubbles.forEach((otherBubble, otherIndex) => {
            if (otherIndex === index || !otherBubble || !otherBubble.current) return;

            const otherRect = otherBubble.current.getBoundingClientRect();
            const otherCenterX = otherRect.left + otherRect.width / 2;
            const otherCenterY = otherRect.top + otherRect.height / 2;
            const otherRadius = otherRect.width / 2;

            const dx = myCenterX - otherCenterX;
            const dy = myCenterY - otherCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = myRadius + otherRadius;

            // Collision detected!
            if (distance < minDistance && distance > 0) {
                // Show angry emoji
                setShowAngry(true);
                setIsShaking(true);

                // Hide after 1 second
                setTimeout(() => {
                    setShowAngry(false);
                    setIsShaking(false);
                }, 1000);

                // Bounce away
                const angle = Math.atan2(dy, dx);
                const bounceForce = 50;
                targetOffsetRef.current = {
                    x: targetOffsetRef.current.x + Math.cos(angle) * bounceForce,
                    y: targetOffsetRef.current.y + Math.sin(angle) * bounceForce
                };
            }
        });
    }, [bubbles, index, ref]);

    // Smooth animation loop
    useEffect(() => {
        const animate = () => {
            setOffset(prev => {
                const target = targetOffsetRef.current;

                // Smooth interpolation (lerp)
                const lerpFactor = 0.15;
                const newX = prev.x + (target.x - prev.x) * lerpFactor;
                const newY = prev.y + (target.y - prev.y) * lerpFactor;

                // Stop updating if very close to target
                if (Math.abs(newX - target.x) < 0.1 && Math.abs(newY - target.y) < 0.1) {
                    return target;
                }

                return { x: newX, y: newY };
            });

            // Check for collisions
            checkCollisions();

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [checkCollisions]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [handleMouseMove]);

    return (
        <div
            ref={ref}
            className={`absolute animate-float-bubble ${isShaking ? 'animate-shake' : ''}`}
            style={{
                left: initialX,
                top: initialY,
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                animationDelay: delay,
                animationDuration: duration,
                transition: 'transform 0.1s ease-out',
            }}
        >
            <div
                className="relative w-20 h-20 rounded-full flex items-center justify-center font-mono text-sm font-bold cursor-pointer group"
                style={{
                    background: theme === 'dark'
                        ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(34, 211, 238, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%)',
                    boxShadow: theme === 'dark'
                        ? '0 8px 32px rgba(34, 211, 238, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)'
                        : '0 8px 32px rgba(34, 211, 238, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
                    border: theme === 'dark' ? '2px solid rgba(34, 211, 238, 0.3)' : '2px solid rgba(34, 211, 238, 0.4)',
                    backdropFilter: 'blur(10px)',
                    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(-10deg) rotateY(10deg) scale(1.1)';
                    e.currentTarget.style.boxShadow = theme === 'dark'
                        ? '0 12px 48px rgba(34, 211, 238, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.3)'
                        : '0 12px 48px rgba(34, 211, 238, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 0 rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                    e.currentTarget.style.boxShadow = theme === 'dark'
                        ? '0 8px 32px rgba(34, 211, 238, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)'
                        : '0 8px 32px rgba(34, 211, 238, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1)';
                }}
            >
                {/* Inner glow */}
                <div
                    className="absolute inset-0 rounded-full opacity-50"
                    style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent 50%)',
                    }}
                />

                {/* Text or Angry Emoji */}
                <span
                    className={`relative z-10 ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600'}`}
                    style={{
                        textShadow: theme === 'dark'
                            ? '0 2px 8px rgba(34, 211, 238, 0.5)'
                            : '0 2px 8px rgba(34, 211, 238, 0.3)',
                        fontSize: showAngry ? '2rem' : 'inherit',
                        transition: 'font-size 0.2s ease',
                    }}
                >
                    {showAngry ? '😠' : keyText}
                </span>

                {/* Shine effect */}
                <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%)',
                    }}
                />
            </div>
        </div>
    );
});

InteractiveBubble.displayName = 'InteractiveBubble';

export default InteractiveBubble;
