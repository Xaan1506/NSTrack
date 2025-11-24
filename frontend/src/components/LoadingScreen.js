import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState('reveal'); // reveal -> powerup -> charge -> explode -> blast -> fadeout

  useEffect(() => {
    const powerupTimer = setTimeout(() => setPhase('powerup'), 800); // Faster: 0.8s instead of 1s
    const chargeTimer = setTimeout(() => setPhase('charge'), 2500); // Faster: 2.5s instead of 3.5s
    const explodeTimer = setTimeout(() => setPhase('explode'), 4200); // Faster: 4.2s instead of 5.2s
    const blastTimer = setTimeout(() => setPhase('blast'), 4700); // Slower blast: 0.5s duration
    const fadeTimer = setTimeout(() => setPhase('fadeout'), 5400); // Slower: 0.7s blast total
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 6000); // Total: 6s

    return () => {
      clearTimeout(powerupTimer);
      clearTimeout(chargeTimer);
      clearTimeout(explodeTimer);
      clearTimeout(blastTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  const orbitalStars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 20,
  }));

  const shootingStars = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    delay: Math.random() * 6,
  }));

  const letters = ['N', 'S', 'T', 'r', 'a', 'c', 'k'];

  return (
    <>
      <style>{`
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

        @keyframes orbitNormal { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbitFast { from { transform: rotate(0deg); } to { transform: rotate(720deg); } }
        
        @keyframes starShimmer {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(2); opacity: 1; }
        }

        @keyframes shootingStar {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate(-400px, 400px); opacity: 0; }
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

        @keyframes plasmaPulse {
          0% { opacity: 0; transform: scaleY(0); }
          50% { opacity: 0.8; transform: scaleY(1); }
          100% { opacity: 0.4; transform: scaleY(0.7); }
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

        @keyframes dissolve {
          to { opacity: 0; }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden"
        style={{
          animation: phase === 'fadeout' ? 'dissolve 0.5s ease-out forwards' : 'none',
          perspective: '1000px',
        }}
      >
        {/* Shooting Stars */}
        {(phase === 'reveal' || phase === 'powerup' || phase === 'charge') && shootingStars.map((star) => (
          <div
            key={`shooting-${star.id}`}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              animation: `shootingStar ${phase === 'charge' ? '1.5s' : '3s'} linear infinite`,
              animationDelay: `${star.delay}s`,
              boxShadow: '0 0 8px rgba(255, 255, 255, 1), 0 0 16px rgba(34, 211, 238, 0.8)',
            }}
          />
        ))}

        {/* Main Container */}
        <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
          {/* HOLOGRAPHIC ARC REACTOR */}
          {(phase !== 'blast' && phase !== 'fadeout') && (
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
              {/* Outer Holographic Ring */}
              <div
                className="absolute w-64 h-64 rounded-full"
                style={{
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
                {/* Energy Nodes on Outer Ring */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 360) / 12;
                  const x = Math.cos((angle * Math.PI) / 180) * 125;
                  const y = Math.sin((angle * Math.PI) / 180) * 125;
                  return (
                    <div
                      key={`node-${i}`}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
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

              {/* Middle Holographic Ring */}
              <div
                className="absolute w-48 h-48 rounded-full"
                style={{
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

              {/* Energy Channels */}
              <div className="absolute w-44 h-44">
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * 360) / 8;
                  const x = Math.cos((angle * Math.PI) / 180) * 80;
                  const y = Math.sin((angle * Math.PI) / 180) * 80;
                  return (
                    <div
                      key={`channel-${i}`}
                      className="absolute w-2 h-12 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle + 90}deg)`,
                        background: 'linear-gradient(to bottom, rgba(100, 200, 255, 0.9), rgba(34, 211, 238, 0.7))',
                        boxShadow: '0 0 15px rgba(100, 200, 255, 1)',
                        animation: (phase === 'charge' || phase === 'explode')
                          ? 'plasmaPulse 0.4s ease-in-out infinite'
                          : 'none',
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                  );
                })}
              </div>

              {/* Inner Holographic Ring */}
              <div
                className="absolute w-32 h-32 rounded-full"
                style={{
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

              {/* Triangular Energy Core */}
              <div
                className="absolute w-24 h-24"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                  background: 'linear-gradient(to bottom, rgba(220, 240, 255, 0.95), rgba(100, 200, 255, 0.9))',
                  animation: phase === 'charge' || phase === 'explode'
                    ? 'coreCharge 0.3s ease-in-out infinite'
                    : 'corePulse 1s ease-in-out infinite',
                  filter: phase === 'explode' ? 'brightness(5) blur(2px)' : 'brightness(2)',
                }}
              />

              {/* Plasma Energy Lines */}
              {(phase === 'charge' || phase === 'explode') && Array.from({ length: 6 }).map((_, i) => {
                const angle = (i * 360) / 6;
                const x = Math.cos((angle * Math.PI) / 180) * 50;
                const y = Math.sin((angle * Math.PI) / 180) * 50;
                return (
                  <div
                    key={`plasma-${i}`}
                    className="absolute w-1 h-20"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle}deg)`,
                      background: 'linear-gradient(to top, transparent, rgba(220, 240, 255, 1), transparent)',
                      boxShadow: '0 0 15px rgba(220, 240, 255, 1)',
                      animation: 'plasmaPulse 0.5s ease-in-out infinite',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                );
              })}

              {/* Holographic Glow Sphere */}
              <div
                className="absolute w-56 h-56 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(100, 200, 255, 0.2) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                  opacity: phase === 'charge' || phase === 'explode' ? 0.8 : 0.4,
                }}
              />
            </div>
          )}

          {/* Orbital Stars */}
          {(phase === 'reveal' || phase === 'powerup' || phase === 'charge') && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                animation: phase === 'charge'
                  ? 'orbitFast 1.5s linear infinite'
                  : 'orbitNormal 8s linear infinite',
              }}
            >
              {orbitalStars.map((star) => {
                const radius = 220;
                const x = Math.cos((star.angle * Math.PI) / 180) * radius;
                const y = Math.sin((star.angle * Math.PI) / 180) * radius;
                return (
                  <div
                    key={star.id}
                    className="absolute w-3 h-3 bg-cyan-400 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      animation: 'starShimmer 1.2s ease-in-out infinite',
                      animationDelay: `${star.id * 0.08}s`,
                      boxShadow: '0 0 12px rgba(34, 211, 238, 1)',
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* NSTrack Text */}
          {phase !== 'explode' && phase !== 'blast' && phase !== 'fadeout' && (
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

          {/* Exploding Letters */}
          {(phase === 'explode' || phase === 'blast') && (
            <div className="relative z-10 flex" style={{ transformStyle: 'preserve-3d' }}>
              {letters.map((letter, i) => (
                <span
                  key={i}
                  className="text-7xl sm:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: '0.05em',
                    animation: 'letterBlast 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
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
