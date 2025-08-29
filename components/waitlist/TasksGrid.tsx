import { PhoneVerificationModal } from "@/components/home/phone-verification-modal";
import { UsernameModal } from "@/components/home/username-modal";
import { GenderModal } from "@/components/home/gender-modal";
import { AgeDobModal } from "@/components/home/age-dob-modal";
import { CountryModal } from "@/components/home/country-modal";
import { CityModal } from "@/components/home/city-modal";
import { AvatarModal } from "@/components/home/avatar-modal";
import { Gender, Task, TaskType } from "@/lib/api/tasks";
import { useAuthStore } from "@/store/auth";
import { useTaskStore } from "@/store/tasks";
import { CheckIcon, FlameIcon, LockIcon } from "lucide-react";
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
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const { user, checkAuth } = useAuthStore();

  const {
    tasks,
    loading: tasksLoading,
    fetchTasks,
    completeTask,
    completingTask,
  } = useTaskStore();

  const gridItems = [];

  // Create grid items based on actual tasks (minimum 25 for visual consistency)
  const gridSize = totalTasks;

  for (let i = 0; i < gridSize; i++) {
    const task = tasks[i];
    let icon = "lock";
    let bgColor = "bg-gray-700/30";
    let borderColor = "border-gray-600";
    let isClickable = false;

    if (task) {
      if (task.isCompleted) {
        // Completed tasks - green checkmarks
        icon = "check";
        bgColor = "bg-green-500/20";
        borderColor = "border-green-500";
      } else if (task.isNextTask && !task.isLocked) {
        // Next available task - purple flame
        icon = "flame";
        bgColor = "bg-purple-500/20";
        borderColor = "border-purple-500";
        isClickable = true;
      } else if (task.isLocked) {
        // Locked tasks - gray lock
        icon = "lock";
        bgColor = "bg-gray-700/30";
        borderColor = "border-gray-600";
      }
    } else {
      // No task at this position - gray lock
      icon = "lock";
      bgColor = "bg-gray-700/30";
      borderColor = "border-gray-600";
    }

    gridItems.push(
      <div
        key={i}
        className={`w-11 h-11 rounded-lg ${bgColor} border ${borderColor} flex items-center justify-center transition-all duration-200 ${
          isClickable
            ? "hover:scale-105 cursor-pointer hover:bg-purple-500/30"
            : "hover:scale-105"
        }`}
        onClick={() => isClickable && !completingTask && handleTaskClick(task)}
      >
        {completingTask && isClickable ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
        ) : icon === "check" ? (
          <CheckIcon className="w-5 h-5 text-green-400" />
        ) : icon === "flame" ? (
          <FlameIcon className="w-5 h-5 text-purple-400" />
        ) : (
          <LockIcon className="w-5 h-5 text-gray-500" />
        )}
      </div>
    );
  }

  const handleTaskClick = async (task: Task) => {
    if (!task || task.isCompleted || task.isLocked || !task.isNextTask) {
      return;
    }

    if (task.taskType === TaskType.VERIFY_PHONE_NUMBER) {
      setSelectedTaskId(task.id);
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

    if (task.taskType === TaskType.ENABLE_2FA) {
      handleCompleteTask(task);
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
      const result = await completeTask(task.id);
      if (result) {
        toast.success(`Task completed! +${result.xpEarned} XP`);
        handleTaskSuccess();
      } else {
        toast.error("Failed to complete task");
      }
    } catch (error) {
      toast.error("Failed to complete task");
    }
  };

  const handleTaskSuccess = () => {
    fetchTasks();
    checkAuth();
  };

  return (
    <>
      {gridItems}
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
    </>
  );
};

export default TasksGrid;
