import { TaskStatus } from "@/types/todo";

export const StatusBadge = (status: TaskStatus) => {
  if (status === "done") return "bg-green-600";
  if (status === "in progress") return "bg-blue-600";
  if (status === "todo") return "bg-gray-600";
};
