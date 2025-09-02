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
      <div className="flex flex-wrap justify-center gap-3 max-w-xs mx-auto lg:mx-0 ">
        {gridItems}
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
