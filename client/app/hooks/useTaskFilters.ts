import { FilterStatus, Task } from "@/types/todo";

export const useTaskFilters = (tasks: Task[], filter: FilterStatus) => {
  const newtodo = [...tasks];

  if (filter === "all") return tasks;

  return newtodo.filter((t) => t.status === filter);
};
