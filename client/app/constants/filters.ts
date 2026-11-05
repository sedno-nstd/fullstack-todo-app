import { FilterStatus } from "@/types/todo";

export interface FilterOption {
  value: FilterStatus;
  label: string;
}

export const FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "All" },
  { value: "in progress", label: "In progress" },
  { value: "todo", label: "Todo" },
  { value: "done", label: "Done" },
];
