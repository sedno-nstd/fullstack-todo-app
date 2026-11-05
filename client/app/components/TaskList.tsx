import { Task, TaskStatus } from "@/types/todo";
import { TaskCard } from "./TaskCard";

interface Props {
  onDelete: (id: number) => void;
  onUpdate: (
    id: number,
    updated: { title: string; description: string; status: TaskStatus },
  ) => void;
  tasks: Task[];
}

export function TaskList({ tasks, onDelete, onUpdate }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-900">No tasks yet</p>
        <p className="text-xs text-gray-500 mt-1">
          Use the form to add your first task.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 bg-white items-center justify-center border border-gray-200 rounded-lg py-10">
      {tasks.map((item) => {
        return (
          <TaskCard
            onUpdate={onUpdate}
            id={item.id}
            onDelete={onDelete}
            descriptions={item.description}
            status={item.status}
            title={item.title}
            key={item.id}
          />
        );
      })}
    </div>
  );
}
