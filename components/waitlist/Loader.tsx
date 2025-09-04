import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#EE4FFB]/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#28A9A3]/20 blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#EE4FFB]/10 blur-[50px] animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          <svg
            className="w-24 h-24 animate-spin"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="gradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#EE4FFB" />
                <stop offset="100%" stopColor="#28A9A3" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="70 200"
              filter="url(#glow)"
              className="animate-pulse"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-16 h-16">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full animate-ping`}
                  style={{
                    background: i % 2 === 0 ? "#EE4FFB" : "#28A9A3",
                    top: "50%",
                    left: "50%",
                    transform: `
                      translate(-50%, -50%)
                      rotate(${i * 45}deg)
                      translateY(-24px)
                    `,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "1.5s",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#EE4FFB] to-[#28A9A3] animate-pulse shadow-lg shadow-[#EE4FFB]/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
