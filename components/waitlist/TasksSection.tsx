import { formatTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import TasksGrid from "./TasksGrid";
import { Button } from "../ui/button";
import { PhoneVerificationModal } from "../home/phone-verification-modal";
import { useTasks } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "../ui/skeleton";
import { Clock, Target, CheckCircle, Lock, Zap } from "lucide-react";

const TasksSection = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    refetch: fetchTasks,
  } = useTasks();
  const { user, refetch } = useAuth();

  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState(0);
  const [isTaskUnlocked, setIsTaskUnlocked] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);

  // Calculate progress
  const completedTasks = tasks?.filter((task) => task.isCompleted).length || 0;
  const totalTasks = tasks?.length || 0;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const nextTask = tasks?.find((task) => task.isNextTask);

  // Check if there's an unlocked task available
  const hasUnlockedTask = tasks?.some(
    (task) => task.isNextTask && !task.isLocked && !task.isCompleted
  );

  // Update unlocked state
  useEffect(() => {
    setIsTaskUnlocked(hasUnlockedTask || false);
  }, [hasUnlockedTask]);

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
  const circularProgress = isTaskUnlocked ? 100 : timeProgress; // Show full progress when unlocked

  // Find next task unlock time
  useEffect(() => {
    const nextTask = tasks?.find(
      (task) => task.isNextTask && task.timeUntilUnlock
    );
    if (nextTask?.timeUntilUnlock) {
      setTimeUntilNextClaim(nextTask.timeUntilUnlock);

      const interval = setInterval(() => {
        setTimeUntilNextClaim((prev) => {
          const newTime = prev - 1;

          // Refetch tasks when timer reaches 0
          if (newTime <= 0) {
            // Add a small delay to ensure backend has updated
            setTimeout(() => {
              fetchTasks();
            }, 500);
            return 0;
          }

          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [tasks, fetchTasks]);

  const handleTaskSuccess = () => {
    fetchTasks();
    refetch();
  };

  if (tasksLoading) {
    return (
      <div className="bg-gradient-to-br from-[#11042F]/80 to-[#020106]/90 backdrop-blur-xl lg:col-span-2 rounded-3xl border border-[#2a2a4e]/50 p-8 shadow-2xl shadow-[#EE4FFB]/10 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Collect Points</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <div>
              <Skeleton className="h-6 w-32 mb-6 bg-gray-700/50" />

              <div className="space-y-4">
                <div className="flex gap-2">
                  {Array.from({ length: 10 }, (_, index) => (
                    <Skeleton
                      key={index}
                      className="flex-1 h-3 rounded-full bg-gray-700/50"
                    />
                  ))}
                </div>

                <div className="flex justify-between">
                  <Skeleton className="h-5 w-32 bg-gray-700/50" />
                  <Skeleton className="h-5 w-16 bg-gray-700/50" />
                </div>
              </div>
            </div>

            {/* Timer section skeleton */}
            <div className="flex items-center gap-8">
              <Skeleton className="w-48 h-48 rounded-full bg-gray-700/50" />

              <div className="flex-1 mt-auto">
                <Skeleton className="h-5 w-56 bg-gray-700/50" />
              </div>
            </div>
          </div>

          {/* Right side - Status Grid Skeleton */}
          <div className="flex-1">
            <Skeleton className="h-6 w-20 mb-6 bg-gray-700/50" />
            <div className="flex flex-wrap justify-center gap-3 max-w-xs mx-auto lg:mx-0">
              {Array.from({ length: 25 }, (_, index) => (
                <Skeleton
                  key={index}
                  className="w-12 h-12 rounded-xl bg-gray-700/50"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#11042F]/80 to-[#020106]/90 backdrop-blur-xl lg:col-span-2 rounded-3xl border border-[#2a2a4e]/50 p-8 shadow-2xl shadow-[#EE4FFB]/10 relative overflow-hidden group">
      {/* Card Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#EE4FFB]/5 to-[#28A9A3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {!user?.phoneVerified && (
        <div className="inset-0 absolute bg-black/60 z-100 backdrop-blur-sm w-full h-full  flex items-center justify-center rounded-3xl">
          <div className="text-center space-y-4">
            <div className="p-4 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-2xl inline-block">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Account Verification Required
            </h3>
            <p className="text-gray-300 max-w-md">
              Verify your phone number to unlock tasks and start earning XP
              points
            </p>
            <Button
              variant="outline"
              onClick={() => setPhoneModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 border-white/30 text-white hover:text-white transition-all duration-300"
            >
              Verify Your Account to Unlock
            </Button>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-xl">
            <Target className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Collect Points</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-white text-xl font-semibold">
                  Your Progress
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  {Array.from({ length: 10 }, (_, index) => {
                    const totalProgress =
                      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                    const segmentStart = index * 10;
                    const segmentEnd = (index + 1) * 10;

                    let segmentFillPercentage = 0;

                    if (totalProgress >= segmentEnd) {
                      segmentFillPercentage = 100;
                    } else if (totalProgress > segmentStart) {
                      segmentFillPercentage =
                        ((totalProgress - segmentStart) / 10) * 100;
                    }

                    return (
                      <div
                        key={index}
                        className="flex-1 h-3 rounded-full bg-gray-700/50 border border-gray-600/50 overflow-hidden group/segment hover:scale-110 transition-transform duration-300"
                      >
                        <div
                          className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 transition-all duration-500 ease-out shadow-lg"
                          style={{ width: `${segmentFillPercentage}%` }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Progress text */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-bold text-lg">
                      {completedTasks}
                    </span>
                    <span className="text-gray-300 text-sm">of</span>
                    <span className="text-white font-bold text-lg">
                      {totalTasks}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Tasks Complete
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-2 rounded-full">
                    <span className="text-white font-bold text-sm">
                      {progressPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="relative w-48 h-48">
                {/* Background circle */}
                <div
                  className="absolute rounded-full bg-gradient-to-b from-[rgba(111,107,255,0.1)] to-[rgba(238,79,251,0.1)]"
                  style={{
                    width: "180px",
                    height: "180px",
                    top: "6px",
                    left: "6px",
                  }}
                ></div>

                {!isTaskUnlocked && (
                  <svg className="w-48 h-48" viewBox="0 0 192 192">
                    <path
                      d={`M 96 20 A 76 76 0 ${
                        circularProgress > 50 ? 1 : 0
                      } 1 ${
                        96 +
                        76 *
                          Math.sin(
                            (Math.min(circularProgress, 100) / 100) *
                              2 *
                              Math.PI
                          )
                      } ${
                        96 -
                        76 *
                          Math.cos(
                            (Math.min(circularProgress, 100) / 100) *
                              2 *
                              Math.PI
                          )
                      }`}
                      stroke={
                        isTaskUnlocked
                          ? "url(#readyGradient)"
                          : "url(#timerGradient)"
                      }
                      strokeWidth="24"
                      fill="none"
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out drop-shadow-lg"
                    />

                    {/* Clock icon at start of progress (top) */}
                    <g transform="translate(96, 20)">
                      <svg
                        x="-9"
                        y="-9"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                      >
                        <path
                          d="M2.4873 8.35491C2.4873 5.01161 5.19715 2.30176 8.54046 2.30176C11.8837 2.30176 14.5936 5.01161 14.5936 8.35491C14.5936 11.6975 11.8837 14.4081 8.54046 14.4081C6.12554 14.4081 4.04114 12.9939 3.06972 10.9488"
                          stroke="white"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10.4551 10.0846L8.31982 8.80854V6.05225"
                          stroke="white"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </g>

                    {/* Clock icon at end of progress (moves with progress) */}
                    {circularProgress > 10 && (
                      <g
                        transform={`translate(${
                          96 +
                          76 *
                            Math.sin(
                              (Math.min(circularProgress, 100) / 100) *
                                2 *
                                Math.PI
                            )
                        }, ${
                          96 -
                          76 *
                            Math.cos(
                              (Math.min(circularProgress, 100) / 100) *
                                2 *
                                Math.PI
                            )
                        })`}
                      >
                        <svg
                          x="-9"
                          y="-9"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            d="M2.4873 8.35491C2.4873 5.01161 5.19715 2.30176 8.54046 2.30176C11.8837 2.30176 14.5936 5.01161 14.5936 8.35491C14.5936 11.6975 11.8837 14.4081 8.54046 14.4081C6.12554 14.4081 4.04114 12.9939 3.06972 10.9488"
                            stroke="white"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10.4551 10.0846L8.31982 8.80854V6.05225"
                            stroke="white"
                            strokeWidth="1.2"
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
                  <div className="text-white text-3xl font-bold tracking-wider mb-2">
                    {isTaskUnlocked
                      ? "Claim"
                      : timeUntilNextClaim > 0
                      ? formatTime(timeUntilNextClaim)
                      : "00:00"}
                  </div>
                  <div className="text-gray-400 text-base text-center">
                    {isTaskUnlocked ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <Zap className="w-4 h-4" />
                        Task available
                      </div>
                    ) : (
                      "Next claim"
                    )}
                  </div>
                </div>
              </div>

              {/* Info text */}
              <div className="flex-1 mt-auto">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#EE4FFB]" />
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Tasks unlock every 24h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Status Grid */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-[#28A9A3]" />
              <h3 className="text-white text-xl font-semibold">Task Status</h3>
            </div>

            <TasksGrid totalTasks={tasks?.length || 0} />
          </div>
        </div>
      </div>

      <PhoneVerificationModal
        open={phoneModalOpen}
        onOpenChange={setPhoneModalOpen}
        onSuccess={handleTaskSuccess}
      />
    </div>
  );
};

export default TasksSection;
