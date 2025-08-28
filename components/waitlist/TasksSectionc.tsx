import React, { useEffect, useState } from "react";
import { useTaskStore } from "@/store/tasks";
import { formatTime } from "@/lib/utils";
import { CheckIcon, FlameIcon } from "lucide-react";
import { LockIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Task } from "@/lib/api/tasks";
import TasksGrid from "./TasksGrid";

const TasksSection = () => {
  const {
    tasks,
    loading: tasksLoading,
    fetchTasks,
    completeTask,
    completingTask,
  } = useTaskStore();
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState(0);
  const [isTaskUnlocked, setIsTaskUnlocked] = useState(false);

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
  const nextTask = tasks.find((task) => task.isNextTask);

  // Check if there's an unlocked task available
  const hasUnlockedTask = tasks.some(
    (task) => task.isNextTask && !task.isLocked && !task.isCompleted
  );

  // Update unlocked state
  useEffect(() => {
    setIsTaskUnlocked(hasUnlockedTask);
  }, [hasUnlockedTask]);

  // Calculate circular progress based on time remaining for next task unlock
  // Assuming 24 hours (86400 seconds) as the full cycle
  const fullCycleTime = nextTask?.unlockDelay ?? 24 * 60 * 60; // 24 hours in seconds
  const timeProgress =
    timeUntilNextClaim > 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((fullCycleTime - timeUntilNextClaim) / fullCycleTime) * 100
          )
        )
      : 0;

  // Progress variable to control the circular progress (0-100)
  const circularProgress = isTaskUnlocked ? 100 : timeProgress; // Show full progress when unlocked

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

  // Handle task completion



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
                  const totalProgress =
                    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                  const segmentStart = index * 10;
                  const segmentEnd = (index + 1) * 10;

                  // Calculate how much of this segment should be filled
                  let segmentFillPercentage = 0;

                  if (totalProgress >= segmentEnd) {
                    // Segment is completely filled
                    segmentFillPercentage = 100;
                  } else if (totalProgress > segmentStart) {
                    // Segment is partially filled
                    segmentFillPercentage =
                      ((totalProgress - segmentStart) / 10) * 100;
                  }

                  return (
                    <div
                      key={index}
                      className="flex-1 h-2 rounded-full bg-gray-700/50 border border-gray-600 overflow-hidden"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300"
                        style={{ width: `${segmentFillPercentage}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Progress text moved to bottom */}
              <div className="flex justify-between text-sm">
                <span className="text-green-400 font-medium">
                  {completedTasks}/{totalTasks} Task Complete
                </span>
                <span className="text-gray-300 font-medium">
                  {progressPercentage}%
                </span>
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
              {!isTaskUnlocked && (
                <svg className="w-44 h-44" viewBox="0 0 176 176">
                  <path
                    d={`M 88 18 A 70 70 0 ${circularProgress > 50 ? 1 : 0} 1 ${
                      88 +
                      70 *
                        Math.sin(
                          (Math.min(circularProgress, 100) / 100) * 2 * Math.PI
                        )
                    } ${
                      88 -
                      70 *
                        Math.cos(
                          (Math.min(circularProgress, 100) / 100) * 2 * Math.PI
                        )
                    }`}
                    stroke={
                      isTaskUnlocked
                        ? "url(#readyGradient)"
                        : "url(#timerGradient)"
                    }
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
                  {circularProgress > 10 && (
                    <g
                      transform={`translate(${
                        88 +
                        70 *
                          Math.sin(
                            (Math.min(circularProgress, 100) / 100) *
                              2 *
                              Math.PI
                          )
                      }, ${
                        88 -
                        70 *
                          Math.cos(
                            (Math.min(circularProgress, 100) / 100) *
                              2 *
                              Math.PI
                          )
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
                  )}
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
                    <linearGradient
                      id="readyGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="50%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-white text-2xl font-bold tracking-wider">
                  {isTaskUnlocked
                    ? "Claim"
                    : timeUntilNextClaim > 0
                    ? formatTime(timeUntilNextClaim)
                    : "00:00"}
                </div>
                <div className="text-gray-400 text-base mt-1">
                  {isTaskUnlocked ? "Task available" : "Next claim"}
                </div>
              </div>
            </div>

            {/* Text moved to right */}
            <div className="flex-1 mt-auto">
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
           <TasksGrid totalTasks={tasks.length} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksSection;
