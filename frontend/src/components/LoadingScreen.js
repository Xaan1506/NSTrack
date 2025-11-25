import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState('particles'); // particles -> assembly -> reveal -> powerup -> charge -> explode -> blast -> fadeout

  useEffect(() => {
    const assemblyTimer = setTimeout(() => setPhase('assembly'), 1500); // Particles: 1.5s
    const revealTimer = setTimeout(() => setPhase('reveal'), 3500); // Assembly: 2s
    const powerupTimer = setTimeout(() => setPhase('powerup'), 4300); // Reveal: 0.8s
    const chargeTimer = setTimeout(() => setPhase('charge'), 6000); // Powerup: 1.7s
    const explodeTimer = setTimeout(() => setPhase('explode'), 7700); // Charge: 1.7s
    const blastTimer = setTimeout(() => setPhase('blast'), 8200); // Explode: 0.5s
    const fadeTimer = setTimeout(() => setPhase('fadeout'), 8900); // Blast: 0.7s
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 10500); // Total: 10.5s

    return () => {
      clearTimeout(assemblyTimer);
      clearTimeout(revealTimer);
      clearTimeout(powerupTimer);
      clearTimeout(chargeTimer);
      clearTimeout(explodeTimer);
      clearTimeout(blastTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  const letters = ['N', 'S', 'T', 'r', 'a', 'c', 'k'];

  // Generate particle positions
  const particles = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    startX: -200 + Math.random() * 600,
    startY: -200 + Math.random() * 600,
    endAngle: (i * 360) / 100,
    delay: Math.random() * 1.2,
  }));

  return (
    <>
      <style>{`
        @keyframes particleSwirl {
          0% {
            transform: translate(var(--start-x), var(--start-y)) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y)) scale(1);
            opacity: 1;
          }
        }

        @keyframes pixelMerge {
          0% {
            transform: scale(0.5);
            opacity: 0.5;
            filter: blur(4px);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }

        @keyframes screwPixelRotate {
          0% { 
            transform: rotate(0deg) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% { 
            transform: rotate(360deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes backgroundTextPulse {
          0%, 100% { 
            opacity: 0.05;
            text-shadow: 0 0 20px rgba(34, 211, 238, 0.1);
          }
          50% { 
            opacity: 0.15;
            text-shadow: 0 0 40px rgba(34, 211, 238, 0.2);
          }
        }

        @keyframes cameraOrbit {
          0% { transform: perspective(1200px) rotateY(0deg) rotateX(5deg); }
          100% { transform: perspective(1200px) rotateY(360deg) rotateX(5deg); }
        }

        @keyframes electricSpark {
          0% { 
            transform: translate(0, 0) scale(0) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
            transform: translate(var(--spark-x), var(--spark-y)) scale(1.5) rotate(180deg);
          }
          100% { 
            transform: translate(calc(var(--spark-x) * 2), calc(var(--spark-y) * 2)) scale(0) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes floatIn {
          0% { opacity: 0; transform: translateY(80px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 30px rgba(34, 211, 238, 0.6), 0 0 60px rgba(34, 211, 238, 0.4); }
          50% { text-shadow: 0 0 50px rgba(34, 211, 238, 0.9), 0 0 100px rgba(34, 211, 238, 0.6); }
        }

        @keyframes vibrate {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 1px); }
          50% { transform: translate(2px, -1px); }
          75% { transform: translate(-1px, -2px); }
        }

        @keyframes letterBlast {
          0% { 
            transform: translateZ(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateZ(450px) scale(2.8);
            opacity: 1;
          }
          100% { 
            transform: translateZ(900px) scale(4.5);
            opacity: 0;
          }
        }

        @keyframes letterFadeAway {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
          50% {
            opacity: 0.5;
            transform: translateY(-30px) scale(1.2);
            filter: blur(2px);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(1.5);
            filter: blur(8px);
          }
        }

        @keyframes starShimmer {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(2); opacity: 1; }
        }

        @keyframes hologramReveal {
          0% { opacity: 0; transform: scale(0.3); filter: blur(10px); }
          100% { opacity: 0.3; transform: scale(1); filter: blur(0); }
        }

        @keyframes energyPowerUp {
          0% { opacity: 0.3; filter: brightness(0.5); }
          100% { opacity: 0.8; filter: brightness(1.5); }
        }

        @keyframes energyCharge {
          0% { opacity: 0.8; filter: brightness(1.5); transform: scale(1); }
          100% { opacity: 1; filter: brightness(3); transform: scale(1.15); }
        }

        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes ringRotateFast {
          from { transform: rotate(0deg); }
          to { transform: rotate(720deg); }
        }

        @keyframes corePulse {
          0%, 100% { 
            opacity: 0.8;
            box-shadow: 
              0 0 40px rgba(100, 200, 255, 1),
              0 0 80px rgba(100, 200, 255, 0.8),
              0 0 120px rgba(34, 211, 238, 0.6),
              inset 0 0 40px rgba(200, 230, 255, 0.9);
          }
          50% { 
            opacity: 1;
            box-shadow: 
              0 0 60px rgba(100, 200, 255, 1),
              0 0 120px rgba(100, 200, 255, 1),
              0 0 180px rgba(34, 211, 238, 0.8),
              inset 0 0 60px rgba(255, 255, 255, 1);
          }
        }

        @keyframes coreCharge {
          0%, 100% { 
            opacity: 1;
            box-shadow: 
              0 0 80px rgba(200, 230, 255, 1),
              0 0 160px rgba(100, 200, 255, 1),
              0 0 240px rgba(34, 211, 238, 1),
              inset 0 0 80px rgba(255, 255, 255, 1);
          }
          50% { 
            opacity: 1;
            box-shadow: 
              0 0 100px rgba(255, 255, 255, 1),
              0 0 200px rgba(100, 200, 255, 1),
              0 0 300px rgba(34, 211, 238, 1),
              inset 0 0 100px rgba(255, 255, 255, 1);
          }
        }

        @keyframes explosionFlash {
          0% { opacity: 0; transform: scale(0.5); }
          40% { opacity: 1; transform: scale(2.5); }
          100% { opacity: 0; transform: scale(6); }
        }

        @keyframes whiteBlast {
          0% { opacity: 0; }
          60% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes volumetricLight {
          0% { 
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.5);
          }
          100% { 
            opacity: 0;
            transform: scale(3);
          }
        }

        @keyframes dissolve {
          to { opacity: 0; }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
        style={{
          animation: phase === 'fadeout' ? 'dissolve 0.5s ease-out forwards' : 'none',
          perspective: '1200px',
        }}
      >
        {/* Background NSTrack Text (Faint) */}
        {(phase === 'particles' || phase === 'assembly') && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="flex">
              {letters.map((letter, i) => (
                <span
                  key={i}
                  className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: '0.05em',
                    animation: 'backgroundTextPulse 3s ease-in-out infinite',
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Volumetric Light Rays */}
        {(phase === 'charge' || phase === 'explode' || phase === 'blast') && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(100, 200, 255, 0.1) 0%, transparent 70%)',
              animation: 'volumetricLight 2s ease-out infinite',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Main Container with 3D Camera */}
        <div
          className="relative"
          style={{
            transformStyle: 'preserve-3d',
            animation: (phase === 'particles' || phase === 'assembly') ? 'cameraOrbit 3.5s linear forwards' : 'none',
          }}
        >
          {/* PARTICLE SWIRL PHASE */}
          {phase === 'particles' && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ top: '80px' }}>
              {particles.map((particle) => {
                const endRadius = 250;
                const endX = Math.cos((particle.endAngle * Math.PI) / 180) * endRadius;
                const endY = Math.sin((particle.endAngle * Math.PI) / 180) * endRadius;

                return (
                  <div
                    key={particle.id}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      '--start-x': `${particle.startX}px`,
                      '--start-y': `${particle.startY}px`,
                      '--end-x': `${endX}px`,
                      '--end-y': `${endY}px`,
                      background: 'radial-gradient(circle, #94a3b8, #64748b)',
                      animation: `particleSwirl 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                      animationDelay: `${particle.delay}s`,
                      boxShadow: '0 0 4px rgba(148, 163, 184, 0.8)',
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* ASSEMBLY PHASE */}
          {phase === 'assembly' && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ top: '80px' }}>
              {/* Pixel Rings Materializing */}
              {[0, 1, 2].map((ring, i) => (
                <div
                  key={`ring-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${(3 - i) * 160}px`,
                    height: `${(3 - i) * 160}px`,
                    border: `4px solid rgba(${100 + i * 30}, ${150 + i * 20}, ${200 + i * 20}, ${0.4 + i * 0.2})`,
                    animation: `pixelMerge 0.8s ease-out forwards`,
                    animationDelay: `${i * 0.3}s`,
                    boxShadow: `0 0 ${20 + i * 10}px rgba(${100 + i * 30}, ${150 + i * 20}, ${200 + i * 20}, 0.6)`,
                    background: `radial-gradient(circle, rgba(${100 + i * 30}, ${150 + i * 20}, ${200 + i * 20}, 0.1), transparent)`,
                  }}
                />
              ))}

              {/* Glowing Pixel Screws */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 360) / 8;
                const x = Math.cos((angle * Math.PI) / 180) * 200;
                const y = Math.sin((angle * Math.PI) / 180) * 200;
                return (
                  <div
                    key={`screw-${i}`}
                    className="absolute w-4 h-4 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      background: 'linear-gradient(135deg, #94a3b8, #64748b)',
                      animation: `screwPixelRotate 0.6s ease-out forwards`,
                      animationDelay: `${0.5 + i * 0.1}s`,
                      boxShadow: '0 0 8px rgba(148, 163, 184, 1), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-0.5 bg-gray-900 absolute rounded-full" />
                      <div className="w-0.5 h-3 bg-gray-900 absolute rounded-full" />
                    </div>
                  </div>
                );
              })}

              {/* Yellow Sparks */}
              {Array.from({ length: 15 }).map((_, i) => {
                const angle = Math.random() * 360;
                const distance = 50 + Math.random() * 80;
                const sparkX = Math.cos((angle * Math.PI) / 180) * distance;
                const sparkY = Math.sin((angle * Math.PI) / 180) * distance;
                return (
                  <div
                    key={`spark-${i}`}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      '--spark-x': `${sparkX}px`,
                      '--spark-y': `${sparkY}px`,
                      background: 'radial-gradient(circle, #fef08a, #fbbf24)',
                      animation: `electricSpark 0.5s ease-out infinite`,
                      animationDelay: `${1 + Math.random() * 0.8}s`,
                      boxShadow: '0 0 6px rgba(255, 200, 0, 1)',
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* HOLOGRAPHIC ARC REACTOR */}
          {(phase !== 'particles' && phase !== 'assembly' && phase !== 'blast' && phase !== 'fadeout') && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                animation: phase === 'reveal'
                  ? 'hologramReveal 0.8s ease-out forwards'
                  : phase === 'powerup'
                    ? 'energyPowerUp 1.7s ease-out forwards'
                    : phase === 'charge'
                      ? 'energyCharge 1.7s ease-in-out forwards'
                      : phase === 'explode'
                        ? 'explosionFlash 0.5s ease-out forwards'
                        : 'none',
                top: '80px',
              }}
            >
              {/* Outer Ring */}
              <div
                className="absolute rounded-full"
                style={{
                  width: '500px',
                  height: '500px',
                  background: 'transparent',
                  border: '3px solid rgba(100, 200, 255, 0.6)',
                  boxShadow:
                    '0 0 20px rgba(100, 200, 255, 0.8), ' +
                    '0 0 40px rgba(34, 211, 238, 0.6), ' +
                    'inset 0 0 30px rgba(100, 200, 255, 0.3)',
                  animation: phase === 'charge' || phase === 'explode'
                    ? 'ringRotateFast 2s linear infinite'
                    : 'ringRotate 8s linear infinite',
                }}
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 360) / 12;
                  const x = Math.cos((angle * Math.PI) / 180) * 245;
                  const y = Math.sin((angle * Math.PI) / 180) * 245;
                  return (
                    <div
                      key={`node-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: '16px',
                        height: '16px',
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        background: 'radial-gradient(circle, rgba(200, 230, 255, 1), rgba(100, 200, 255, 0.8))',
                        boxShadow: '0 0 15px rgba(100, 200, 255, 1)',
                        animation: 'starShimmer 1s ease-in-out infinite',
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  );
                })}
              </div>

              {/* Middle Ring */}
              <div
                className="absolute rounded-full"
                style={{
                  width: '380px',
                  height: '380px',
                  background: 'transparent',
                  border: '2px solid rgba(100, 200, 255, 0.7)',
                  boxShadow:
                    '0 0 25px rgba(100, 200, 255, 0.9), ' +
                    'inset 0 0 25px rgba(100, 200, 255, 0.4)',
                  animation: phase === 'charge' || phase === 'explode'
                    ? 'ringRotateFast 1.5s linear infinite reverse'
                    : 'ringRotate 6s linear infinite reverse',
                }}
              />

              {/* Inner Ring */}
              <div
                className="absolute rounded-full"
                style={{
                  width: '260px',
                  height: '260px',
                  background: 'radial-gradient(circle, rgba(100, 200, 255, 0.3), transparent 70%)',
                  border: '2px solid rgba(100, 200, 255, 0.8)',
                  boxShadow:
                    '0 0 30px rgba(100, 200, 255, 1), ' +
                    'inset 0 0 30px rgba(100, 200, 255, 0.5)',
                  animation: phase === 'charge' || phase === 'explode'
                    ? 'ringRotateFast 1s linear infinite'
                    : 'ringRotate 4s linear infinite',
                }}
              />

              {/* Energy Core */}
              <div
                className="absolute"
                style={{
                  width: '150px',
                  height: '150px',
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                  background: 'linear-gradient(to bottom, rgba(220, 240, 255, 0.95), rgba(100, 200, 255, 0.9))',
                  animation: phase === 'charge' || phase === 'explode'
                    ? 'coreCharge 0.3s ease-in-out infinite'
                    : 'corePulse 1s ease-in-out infinite',
                  filter: phase === 'explode' ? 'brightness(5) blur(2px)' : 'brightness(2)',
                }}
              />

              {/* Electric Sparks During Glow-Up */}
              {(phase === 'powerup' || phase === 'charge' || phase === 'explode') && Array.from({ length: 30 }).map((_, i) => {
                const angle = Math.random() * 360;
                const distance = 150 + Math.random() * 150;
                const sparkX = Math.cos((angle * Math.PI) / 180) * distance;
                const sparkY = Math.sin((angle * Math.PI) / 180) * distance;
                return (
                  <div
                    key={`electric-spark-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width: '12px',
                      height: '12px',
                      left: '50%',
                      top: '50%',
                      '--spark-x': `${sparkX}px`,
                      '--spark-y': `${sparkY}px`,
                      background: 'radial-gradient(circle, #60a5fa, #3b82f6)',
                      animation: `electricSpark ${0.5 + Math.random() * 0.5}s ease-out infinite`,
                      animationDelay: `${Math.random() * 2}s`,
                      boxShadow: '0 0 8px rgba(96, 165, 250, 1), 0 0 16px rgba(59, 130, 246, 0.8)',
                    }}
                  />
                );
              })}

              {/* Glow Sphere */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: '450px',
                  height: '450px',
                  background: 'radial-gradient(circle, rgba(100, 200, 255, 0.2) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                  opacity: phase === 'charge' || phase === 'explode' ? 0.8 : 0.4,
                }}
              />
            </div>
          )}

          {/* NSTrack Text */}
          {phase !== 'particles' && phase !== 'assembly' && phase !== 'explode' && phase !== 'blast' && phase !== 'fadeout' && (
            <div
              className="relative z-10 flex"
              style={{
                animation: phase === 'reveal'
                  ? 'floatIn 0.8s ease-out forwards'
                  : phase === 'charge'
                    ? 'vibrate 0.1s infinite'
                    : 'none',
              }}
            >
              {letters.map((letter, i) => (
                <span
                  key={i}
                  className="text-7xl sm:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: '0.05em',
                    animation: 'textGlow 2s ease-in-out infinite',
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          )}

          {/* Exploding/Fading Letters */}
          {(phase === 'explode' || phase === 'blast' || phase === 'fadeout') && (
            <div className="relative z-10 flex" style={{ transformStyle: 'preserve-3d' }}>
              {letters.map((letter, i) => (
                <span
                  key={i}
                  className="text-7xl sm:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: '0.05em',
                    animation: phase === 'fadeout'
                      ? `letterFadeAway 0.6s ease-out forwards`
                      : `letterBlast 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                    animationDelay: `${i * 0.05}s`,
                    textShadow: '0 0 40px rgba(255, 255, 255, 1), 0 0 80px rgba(100, 200, 255, 1)',
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Energy Blast Overlay */}
        {(phase === 'explode' || phase === 'blast') && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(220, 240, 255, 0.9) 20%, rgba(100, 200, 255, 0.5) 50%, transparent 80%)',
              animation: 'whiteBlast 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
              mixBlendMode: 'screen',
            }}
          />
        )}
      </div>
    </>
  );
};

export default LoadingScreen;
