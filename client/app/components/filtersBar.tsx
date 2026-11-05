import { FilterStatus } from "@/types/todo";
import { FILTER_OPTIONS } from "../constants/filters";

interface FiltersBarProps {
  currentFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
}

export function FiltersBar({
  currentFilter: currentStatus,
  onSelectFilter,
}: FiltersBarProps) {
  return (
    <div className="flex flex-row gap-3 w-full justify-center items-center">
      {FILTER_OPTIONS.map((t) => {
        const isActive = t.value === currentStatus;
        return (
          <div
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none ${
              isActive
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            key={t.value}
            onClick={() => onSelectFilter(t.value)}
          >
            {t.label}
          </div>
        );
      })}
    </div>
  );
}
