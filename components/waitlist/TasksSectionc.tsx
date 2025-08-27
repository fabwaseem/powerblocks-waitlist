import React, { useEffect, useState } from "react";
import { useTaskStore } from "@/store/tasks";
import { formatTime } from "@/lib/utils";

const TasksSection = () => {
  const { tasks, loading: tasksLoading, fetchTasks } = useTaskStore();
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState(0);

  // Fetch tasks on component mount
  useEffect(() => {
    if (tasks.length === 0) {
      fetchTasks();
    }
  }, [tasks.length, fetchTasks]);

  // Calculate progress
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const totalTasks = tasks.length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Progress variable to control the circular progress (0-100)
  const circularProgress = 48; // You can change this value or make it dynamic

  // Find next task unlock time
  useEffect(() => {
    const nextTask = tasks.find(
      (task) => task.isNextTask && task.timeUntilUnlock
    );
    if (nextTask?.timeUntilUnlock) {
      setTimeUntilNextClaim(nextTask.timeUntilUnlock);

      const interval = setInterval(() => {
        setTimeUntilNextClaim((prev) => {
          const newTime = prev - 1;
          return newTime > 0 ? newTime : 0;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [tasks]);

  // Generate status grid (5x5 = 25 items) based on actual task completion
  const generateStatusGrid = () => {
    const gridItems = [];

    // Create a pattern that matches the image: some completed (green checkmarks), some available (purple flames), some locked (gray locks)
    for (let i = 0; i < 25; i++) {
      let icon = "lock";
      let bgColor = "bg-gray-700/30";
      let borderColor = "border-gray-600";

      // Based on the image pattern, set different states
      if (i < completedTasks) {
        // Completed tasks - green checkmarks
        icon = "check";
        bgColor = "bg-green-500/20";
        borderColor = "border-green-500";
      } else if (i < completedTasks + 3) {
        // Next few available tasks - purple flames
        icon = "flame";
        bgColor = "bg-purple-500/20";
        borderColor = "border-purple-500";
      }
      // Rest remain locked (gray)

      gridItems.push(
        <div
          key={i}
          className={`w-11 h-11 rounded-lg ${bgColor} border ${borderColor} flex items-center justify-center transition-all duration-200 hover:scale-105`}
        >
          {icon === "check" ? (
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : icon === "flame" ? (
            <svg
              className="w-5 h-5 text-purple-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      );
    }
    return gridItems;
  };

  if (tasksLoading) {
    return (
      <div className="bg-gradient-to-b from-[#11042F] to-[#020106] lg:col-span-2 rounded-2xl border border-[#2a2a4e] p-6">
        <h2 className="text-xl font-bold text-white mb-6">Collect Points</h2>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#11042F] to-[#020106] lg:col-span-2 rounded-2xl border border-[#2a2a4e] p-6">
      <h2 className="text-xl font-bold text-white mb-6">Collect Points</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Progress and Timer */}
        <div className="flex-1 space-y-6">
          {/* Your progress section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Your progress
            </h3>

            {/* Progress segments */}
            <div className="space-y-3">
              {/* Individual progress segments */}
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, index) => {
                  const segmentProgress = ((completedTasks || 10) / 21) * 10; // Assuming 21 total tasks like in image
                  const isCompleted = index < segmentProgress;

                  return (
                    <div
                      key={index}
                      className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                        isCompleted
                          ? "bg-gradient-to-r from-green-400 to-green-500"
                          : "bg-gray-700/50 border border-gray-600"
                      }`}
                    />
                  );
                })}
              </div>

              {/* Progress text moved to bottom */}
              <div className="flex justify-between text-sm">
                <span className="text-green-400 font-medium">
                  10/21 Task Complete
                </span>
                <span className="text-gray-300 font-medium">48%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-44 h-44">
              <div
                className="absolute rounded-full bg-gradient-to-b from-[rgba(111,107,255,0.2)]"
                style={{
                  width: "165px",
                  height: "165px",
                  top: "5px",
                  left: "5px",
                }}
              ></div>
              <svg className="w-44 h-44" viewBox="0 0 176 176">
                <path
                  d={`M 88 18 A 70 70 0 ${circularProgress > 50 ? 1 : 0} 1 ${
                    88 + 70 * Math.sin((circularProgress / 100) * 2 * Math.PI)
                  } ${
                    88 - 70 * Math.cos((circularProgress / 100) * 2 * Math.PI)
                  }`}
                  stroke="url(#timerGradient)"
                  strokeWidth="20"
                  fill="none"
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-in-out"
                />

                {/* Clock icon at start of progress (top) */}
                <g transform="translate(88, 18)">
                  <svg
                    x="-8.5"
                    y="-8.5"
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                  >
                    <path
                      d="M2.4873 8.35491C2.4873 5.01161 5.19715 2.30176 8.54046 2.30176C11.8837 2.30176 14.5936 5.01161 14.5936 8.35491C14.5936 11.6975 11.8837 14.4081 8.54046 14.4081C6.12554 14.4081 4.04114 12.9939 3.06972 10.9488"
                      stroke="white"
                      strokeWidth="1.00886"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.4551 10.0846L8.31982 8.80854V6.05225"
                      stroke="white"
                      strokeWidth="1.00886"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </g>

                {/* Clock icon at end of progress (moves with progress) */}
                <g
                  transform={`translate(${
                    88 + 70 * Math.sin((circularProgress / 100) * 2 * Math.PI)
                  }, ${
                    88 - 70 * Math.cos((circularProgress / 100) * 2 * Math.PI)
                  })`}
                >
                  <svg
                    x="-8.5"
                    y="-8.5"
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                  >
                    <path
                      d="M2.4873 8.35491C2.4873 5.01161 5.19715 2.30176 8.54046 2.30176C11.8837 2.30176 14.5936 5.01161 14.5936 8.35491C14.5936 11.6975 11.8837 14.4081 8.54046 14.4081C6.12554 14.4081 4.04114 12.9939 3.06972 10.9488"
                      stroke="white"
                      strokeWidth="1.00886"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.4551 10.0846L8.31982 8.80854V6.05225"
                      stroke="white"
                      strokeWidth="1.00886"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </g>

                <defs>
                  <linearGradient
                    id="timerGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-white text-3xl font-bold tracking-wider">
                  {formatTime(timeUntilNextClaim, false) ||
                    "22:14"}
                </div>
                <div className="text-gray-400 text-base mt-1">Next claim</div>
              </div>
            </div>

            {/* Text moved to right */}
            <div className="flex-1">
              <p className="text-gray-400 text-base">
                *Tasks unlock every 24h.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Status Grid */}
        <div className="flex-1">
          <h3 className="text-white text-lg font-semibold mb-4">Status</h3>
          <div className="grid grid-cols-5 gap-3 max-w-xs mx-auto lg:mx-0">
            {generateStatusGrid()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksSection;
