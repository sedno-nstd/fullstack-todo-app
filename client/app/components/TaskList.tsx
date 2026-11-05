import { Task } from "@/types/todo";
import { TaskCard } from "./TaskCard";
import Link from "next/link";

interface Props {
  tasks: Task[];
}

export function TaskList({ tasks }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {tasks.length > 0 ? (
        tasks.map((item) => {
          return (
            <TaskCard
              descriptions={item.description}
              status={item.status}
              title={item.title}
              key={item.id}
            />
          );
        })
      ) : (
        <Link href="/create">Create new task</Link>
      )}
    </div>
  );
}
