import { TaskStatus } from "@/types/todo";
import { StatusBadge } from "./ui/StatusBadge";

interface Props {
  title: string;
  descriptions: string;
  status: TaskStatus;
}

export function TaskCard({ descriptions, title, status }: Props) {
  return (
    <div className="flex flex-row gap-4 p-6 bg-gray-300 rounded-lg">
      <div className="flex flex-col gap-4">
        <span>{title}</span>
        <span>{descriptions}</span>
      </div>
      <div>
        <span className={`${StatusBadge(status)}`}>{status}</span>
      </div>
    </div>
  );
}
