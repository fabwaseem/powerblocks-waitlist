import { Task } from "@/lib/api/tasks";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useTaskStore } from "@/store/tasks";
import moment from "moment";
import { formatTime } from "@/lib/utils";

const TaskCard = ({ task }: { task: Task }) => {
  const { completeTask, completingTask } = useTaskStore();

  // time left to unlock

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (task.timeUntilUnlock && task.isNextTask) {
      setTimeLeft(task.timeUntilUnlock);

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [task.timeUntilUnlock]);

  return (
    <div
      key={task.id}
      className={`flex items-center justify-between p-4 border-b border-white/10 ${
        task.isCompleted ? "bg-[#EE4FFB]/10" : ""
      }`}
    >
      <span className="text-white font-medium text-base">
        Task {task.orderIndex} - {task.name}
      </span>
      <div className="flex items-center gap-3">
        <span
          className={`font-bold text-base ${
            task.isCompleted ? "text-green-400" : "text-purple-1"
          }`}
        >
          {task.isCompleted && `Completed +${task.xpReward} XP`}
        </span>
        <span className={`font-bold text-base text-purple-1`}>
          {!task.isCompleted && task.isNextTask && `+${task.xpReward} XP`}
        </span>

        {!task.isCompleted && task.isNextTask && task.isLocked && (
          <Button variant="purple" disabled>
            Unlock in {formatTime(timeLeft)}
          </Button>
        )}
        {!task.isLocked && task.isNextTask && (
          <Button
            variant="purple"
            disabled={task.isLocked || !task.isActive}
            onClick={async () => {
              try {
                const result = await completeTask(task.id);
                if (result) {
                  // Task completed successfully
                  console.log("Task completed:", result);
                }
              } catch (error) {
                console.error("Failed to complete task:", error);
              }
            }}
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
