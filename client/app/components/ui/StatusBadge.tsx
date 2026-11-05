import { TaskStatus } from "@/types/todo";

export const StatusBadge = (status: TaskStatus) => {
  if (status === "done") return "bg-green-300";
  if (status === "in progress") return "bg-blue-300";
  if (status === "todo") return "bg-gray-300";
};
