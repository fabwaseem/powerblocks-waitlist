"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

const MouseFollower = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [clickRipples, setClickRipples] = useState<
    { id: number; x: number; y: number; timestamp: number }[]
  >([]);
  const [isHovering, setIsHovering] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rippleIdRef = useRef(0);

  // Create audio context and sound effect
  const createClickSound = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      400,
      audioContext.currentTime + 0.1
    );

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1
    );

    oscillator.type = "sine";
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, []);


  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);

      const newRipple = {
        id: rippleIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      };

      setClickRipples((prev) => [...prev, newRipple]);

      try {
        createClickSound();
      } catch (error) {
        console.log("Audio context not available");
      }

      // Remove ripple after animation
      setTimeout(() => {
        setClickRipples((prev) =>
          prev.filter((ripple) => ripple.id !== newRipple.id)
        );
      }, 600);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Detect hoverable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverableElement =
        target?.tagName === "BUTTON" ||
        target?.tagName === "A" ||
        target?.classList.contains("cursor-pointer") ||
        target?.closest("button") ||
        target?.closest("a") ||
        target?.closest('[role="button"]') ||
        getComputedStyle(target as HTMLElement).cursor === "pointer";

      setIsHovering(isHoverableElement as boolean);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [createClickSound]);

  return (
    <>
      {/* Trailing cursor */}
      <div
        className="fixed pointer-events-none z-[9998] mix-blend-difference"
        style={{
          left: mousePosition.x - 20,
          top: mousePosition.y - 20,
          transform: `scale(${isClicking ? 1.2 : isHovering ? 0.8 : 1})`,
          transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div
          className={`w-10 h-10 rounded-full border transition-all duration-300 ${
            isHovering
              ? "border-[#28A9A3]/50 bg-[#28A9A3]/5"
              : "border-white/20 bg-white/5"
          }`}
          style={{
            boxShadow: isHovering
              ? "0 0 30px rgba(40, 169, 163, 0.3)"
              : "0 0 15px rgba(255, 255, 255, 0.1)",
          }}
        />
      </div>

      {/* Click ripples */}
      {clickRipples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-[9997]"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
          }}
        >
          <div
            className="w-12 h-12 rounded-full border-2 border-[#EE4FFB] animate-ping opacity-75"
            style={{
              animationDuration: "0.6s",
              boxShadow: "0 0 20px rgba(238, 79, 251, 0.5)",
            }}
          />
        </div>
      ))}

      <style jsx global>{`
        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        .animate-ripple {
          animation: ripple 0.6s ease-out forwards;
        }

        /* Ensure text selection still works */
        ::selection {
          background: rgba(238, 79, 251, 0.3);
        }

        ::-moz-selection {
          background: rgba(238, 79, 251, 0.3);
        }
      `}</style>
    </>
  );
};

export default MouseFollower;
