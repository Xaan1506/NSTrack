import React, { useState, useEffect, useRef, useCallback } from 'react';

const InteractiveSection = ({ children, intensity = 0.03, className = '' }) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const sectionRef = useRef(null);
    const animationFrameRef = useRef(null);
    const targetOffsetRef = useRef({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e) => {
        if (!sectionRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const sectionCenterX = rect.left + rect.width / 2;
        const sectionCenterY = rect.top + rect.height / 2;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate distance from mouse to section center
        const dx = mouseX - sectionCenterX;
        const dy = mouseY - sectionCenterY;

        // Apply parallax effect based on mouse position
        const moveX = dx * intensity;
        const moveY = dy * intensity;

        targetOffsetRef.current = { x: moveX, y: moveY };
    }, [intensity]);

    // Smooth animation loop
    useEffect(() => {
        const animate = () => {
            setOffset(prev => {
                const target = targetOffsetRef.current;

                // Smooth interpolation (lerp)
                const lerpFactor = 0.1;
                const newX = prev.x + (target.x - prev.x) * lerpFactor;
                const newY = prev.y + (target.y - prev.y) * lerpFactor;

                // Stop updating if very close to target
                if (Math.abs(newX - target.x) < 0.1 && Math.abs(newY - target.y) < 0.1) {
                    return target;
                }

                return { x: newX, y: newY };
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [handleMouseMove]);

    return (
        <div
            ref={sectionRef}
            className={className}
            style={{
                transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
                transition: 'transform 0.1s ease-out',
                willChange: 'transform',
            }}
        >
            {children}
        </div>
    );
};

export default InteractiveSection;
