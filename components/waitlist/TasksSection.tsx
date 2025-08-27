import { useTaskStore } from "@/store/tasks";
import TaskCard from "./TaskCard";

const TasksSection = () => {
  const {
    tasks,
    loading: tasksLoading,
    fetchTasks,
    completeTask,
    completingTask,
  } = useTaskStore();
  return (
    <div className="bg-gradient-to-b from-[#11042F] to-[#020106] lg:col-span-2 rounded-2xl border border-[#2a2a4e] ">
      <h2 className="text-xl font-bold text-white  p-6">Collect Points</h2>

      <div className="no-scrollbar max-h-[250px] overflow-y-auto">
        {tasksLoading ? (
          <div className="text-center text-[#A5A9C1] py-8">
            Loading tasks...
          </div>
        ) : tasks && tasks.length > 0 ? (
          tasks
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="text-center text-[#A5A9C1] py-8">
            No tasks available
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksSection;
