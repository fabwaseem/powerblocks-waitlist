import { AgeDobModal } from "@/components/home/age-dob-modal";
import { AvatarModal } from "@/components/home/avatar-modal";
import { CityModal } from "@/components/home/city-modal";
import { CountryModal } from "@/components/home/country-modal";
import { GenderModal } from "@/components/home/gender-modal";
import { PhoneVerificationModal } from "@/components/home/phone-verification-modal";
import { TwitterTaskModal } from "@/components/home/twitter-task-modal";
import { UsernameModal } from "@/components/home/username-modal";
import { useAuth } from "@/hooks/use-auth";
import { useCompleteTask, useTasks } from "@/hooks/use-tasks";
import { Task, TaskType } from "@/lib/api/tasks";
import {
  CheckIcon,
  FlameIcon,
  LockIcon,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const TasksGrid = ({ totalTasks }: { totalTasks: number }) => {
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);
  const [genderModalOpen, setGenderModalOpen] = useState(false);
  const [ageDobModalOpen, setAgeDobModalOpen] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [twitterModalOpen, setTwitterModalOpen] = useState(false);

  const { data: tasks, refetch } = useTasks();
  const { refetch: refetchAuth } = useAuth();

  const { mutate: completeTask, isPending: completingTask } = useCompleteTask();

  const gridItems = [];

  // Create grid items based on actual tasks (minimum 25 for visual consistency)
  const gridSize = totalTasks;

  for (let i = 0; i < gridSize; i++) {
    const task = tasks?.[i];
    let icon = "lock";
    let bgColor = "bg-gradient-to-br from-gray-700/30 to-gray-800/40";
    let borderColor = "border-gray-600/50";
    let iconColor = "text-gray-500";
    let isClickable = false;
    let glowEffect = "";
    let hoverEffect = "";

    if (task) {
      if (task.isCompleted) {
        // Completed tasks - green checkmarks with glow
        icon = "check";
        bgColor = "bg-gradient-to-br from-green-500/20 to-emerald-600/30";
        borderColor = "border-green-500/60";
        iconColor = "text-green-400";
        glowEffect = "shadow-lg shadow-green-500/25";
        hoverEffect =
          "hover:scale-110 hover:shadow-xl hover:shadow-green-500/40";
      } else if (task.isNextTask && !task.isLocked) {
        // Next available task - purple flame with animation
        icon = "flame";
        bgColor = "bg-gradient-to-br from-[#EE4FFB]/20 to-[#FF6B9D]/30";
        borderColor = "border-[#EE4FFB]/60";
        iconColor = "text-[#EE4FFB]";
        glowEffect = "shadow-lg shadow-[#EE4FFB]/25 animate-pulse";
        hoverEffect =
          "hover:scale-110 hover:shadow-xl hover:shadow-[#EE4FFB]/40 hover:bg-gradient-to-br hover:from-[#EE4FFB]/30 hover:to-[#FF6B9D]/40 cursor-pointer";
        isClickable = true;
      } else if (task.isLocked) {
        // Locked tasks - gray lock with subtle effect
        icon = "lock";
        bgColor = "bg-gradient-to-br from-gray-700/30 to-gray-800/40";
        borderColor = "border-gray-600/50";
        iconColor = "text-gray-500";
        glowEffect = "";
        hoverEffect =
          "hover:scale-105 hover:bg-gradient-to-br hover:from-gray-600/40 hover:to-gray-700/50";
      }
    } else {
      // No task at this position - gray lock
      icon = "lock";
      bgColor = "bg-gradient-to-br from-gray-700/30 to-gray-800/40";
      borderColor = "border-gray-600/50";
      iconColor = "text-gray-500";
      glowEffect = "";
      hoverEffect =
        "hover:scale-105 hover:bg-gradient-to-br hover:from-gray-600/40 hover:to-gray-700/50";
    }

    gridItems.push(
      <div
        key={i}
        className={`w-12 h-12 rounded-2xl ${bgColor} border-2 ${borderColor} flex items-center justify-center transition-all duration-300 ${glowEffect} ${hoverEffect} relative overflow-hidden group ${
          isClickable ? "cursor-pointer" : ""
        }`}
        onClick={() => isClickable && !completingTask && handleTaskClick(task)}
      >
        {/* Background glow effect for active tasks */}
        {isClickable && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#EE4FFB]/10 to-[#FF6B9D]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        )}

        {/* Icon with enhanced styling */}
        <div className="relative z-10">
          {completingTask && isClickable ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#EE4FFB] border-t-transparent"></div>
          ) : icon === "check" ? (
            <div className="relative">
              <CheckIcon className="w-6 h-6 text-green-400 drop-shadow-lg" />
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-sm animate-pulse"></div>
            </div>
          ) : icon === "flame" ? (
            <div className="relative">
              <FlameIcon className="w-6 h-6 text-[#EE4FFB] drop-shadow-lg" />
              <div className="absolute inset-0 bg-[#EE4FFB]/20 rounded-full blur-sm animate-pulse"></div>
            </div>
          ) : (
            <LockIcon className="w-6 h-6 text-gray-500" />
          )}
        </div>

        {/* Hover effect overlay */}
        {isClickable && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#EE4FFB]/5 to-[#FF6B9D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        )}
      </div>
    );
  }

  const handleTaskClick = async (task?: Task) => {
    if (!task || task.isCompleted || task.isLocked || !task.isNextTask) {
      return;
    }

    if (task.taskType === TaskType.VERIFY_PHONE_NUMBER) {
      setPhoneModalOpen(true);
      return;
    }

    if (task.taskType === TaskType.CREATE_USERNAME) {
      setUsernameModalOpen(true);
      return;
    }

    if (task.taskType === TaskType.SELECT_GENDER) {
      setGenderModalOpen(true);
      return;
    }

    if (task.taskType === TaskType.ADD_AGE_DOB) {
      setAgeDobModalOpen(true);
      return;
    }

    if (task.taskType === TaskType.VERIFY_LOCATION_COUNTRY) {
      setCountryModalOpen(true);
      return;
    }

    if (task.taskType === TaskType.VERIFY_LOCATION_CITY) {
      setCityModalOpen(true);
      return;
    }

    if (task.taskType === TaskType.ADD_PROFILE_PIC) {
      setAvatarModalOpen(true);
      return;
    }

    if (task.taskType === TaskType.ENABLE_WEB_PUSH) {
      if (Notification.permission === "denied") {
        toast.error(
          "Push notifications are disabled, please enable them in your browser settings"
        );
        return;
      }
      if (Notification.permission === "granted") {
        handleCompleteTask(task);
        return;
      }
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            toast.success("Push notifications are enabled");
            handleCompleteTask(task);
          }
          if (permission === "denied") {
            toast.error(
              "Push notifications are disabled, please enable them in your browser settings"
            );
            return;
          }
        });
      }
      return;
    }

    if (task.taskType === TaskType.FOLLOW_X_ACCOUNT) {
      setTwitterModalOpen(true);
      return;
    }

    if (
      task.taskType === TaskType.FOLLOW_IG_ACCOUNT ||
      task.taskType === TaskType.FOLLOW_TG_ACCOUNT ||
      task.taskType === TaskType.FOLLOW_DISCORD_ACCOUNT ||
      task.taskType === TaskType.JOIN_REDDIT
    ) {
      if (task.data?.link) {
        window.open(task.data.link, "_blank");
        handleCompleteTask(task);
        return;
      }
      return;
    }

    if (
      task.taskType === TaskType.MYSTERY_BOX_QUESTION ||
      task.taskType === TaskType.RAFFLE_LOTTERY_QUESTION ||
      task.taskType === TaskType.CHECK_BLOG ||
      task.taskType === TaskType.WATCH_VIDEO
    ) {
      if (task.data?.link) {
        window.open(task.data.link, "_blank");
        handleCompleteTask(task);
        return;
      }
    }
  };

  const handleCompleteTask = async (task: Task) => {
    try {
      completeTask(task.id, {
        onSuccess: (result) => {
          toast.success(`Task completed! +${result.xpEarned} XP`);
          handleTaskSuccess();
        },
      });
    } catch (error) {
      toast.error("Failed to complete task");
    }
  };

  const handleTaskSuccess = () => {
    refetch();
    refetchAuth();
  };

  return (
    <>
      {/* Enhanced Grid Container */}
      <div className="relative">

        {/* Enhanced Grid */}
        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto lg:mx-0">
          {gridItems}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-green-500/20 to-emerald-600/30 border-2 border-green-500/60 rounded-lg flex items-center justify-center">
              <CheckIcon className="w-3 h-3 text-green-400" />
            </div>
            <span className="text-gray-300">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-[#EE4FFB]/20 to-[#FF6B9D]/30 border-2 border-[#EE4FFB]/60 rounded-lg flex items-center justify-center">
              <FlameIcon className="w-3 h-3 text-[#EE4FFB]" />
            </div>
            <span className="text-gray-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-gray-700/30 to-gray-800/40 border-2 border-gray-600/50 rounded-lg flex items-center justify-center">
              <LockIcon className="w-3 h-3 text-gray-500" />
            </div>
            <span className="text-gray-300">Locked</span>
          </div>
        </div>
      </div>

      <PhoneVerificationModal
        open={phoneModalOpen}
        onOpenChange={setPhoneModalOpen}
        onSuccess={handleTaskSuccess}
      />
      <UsernameModal
        open={usernameModalOpen}
        onOpenChange={setUsernameModalOpen}
        onSuccess={handleTaskSuccess}
      />
      <GenderModal
        open={genderModalOpen}
        onOpenChange={setGenderModalOpen}
        onSuccess={handleTaskSuccess}
      />
      <AgeDobModal
        open={ageDobModalOpen}
        onOpenChange={setAgeDobModalOpen}
        onSuccess={handleTaskSuccess}
      />
      <CountryModal
        open={countryModalOpen}
        onOpenChange={setCountryModalOpen}
        onSuccess={handleTaskSuccess}
      />
      <CityModal
        open={cityModalOpen}
        onOpenChange={setCityModalOpen}
        onSuccess={handleTaskSuccess}
      />
      <AvatarModal
        open={avatarModalOpen}
        onOpenChange={setAvatarModalOpen}
        onSuccess={handleTaskSuccess}
      />
      <TwitterTaskModal
        open={twitterModalOpen}
        onOpenChange={setTwitterModalOpen}
        onSuccess={handleTaskSuccess}
        task={tasks?.find(
          (task) => task.taskType === TaskType.FOLLOW_X_ACCOUNT
        )}
      />
    </>
  );
};

export default TasksGrid;
