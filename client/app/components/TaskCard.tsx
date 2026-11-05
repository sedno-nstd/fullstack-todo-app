import { TaskStatus } from "@/types/todo";
import { StatusBadge } from "./ui/StatusBadge";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "./ui/Input";
import { Select } from "./ui/useSelectOptions";
import { STATUS_OPTIONS } from "../constants/status";
import { Button } from "./ui/Button";
import { useClickOutside } from "../hooks/useClickOutside";

interface Props {
  id: number;
  title: string;
  descriptions: string;
  status: TaskStatus;
  onDelete: (id: number) => void;
  onUpdate?: (
    id: number,
    updated: { title: string; description: string; status: TaskStatus },
  ) => void;
}

export function TaskCard({
  id,
  descriptions,
  title,
  status,
  onDelete,
  onUpdate,
}: Props) {
  const [showActions, setShowActions] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const actionsRef = useRef<HTMLDivElement>(null);

  useClickOutside(actionsRef, () => setShowActions(false));

  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(descriptions);
  const [editStatus, setEditStatus] = useState<TaskStatus>(status);
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) onDelete(id);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          status: editStatus,
        }),
      });

      if (res.ok) {
        onUpdate?.(id, {
          title: editTitle,
          description: editDescription,
          status: editStatus,
        });
        setIsEditing(false);
        setShowActions(false);
      }
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="w-full">
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-white border border-gray-300 mx-6 shadow-sm">
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
            label="Title"
          />

          <label className="text-sm font-medium text-gray-600">
            Description
          </label>
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 text-gray-900 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Additional details"
            rows={2}
          />
          <div className="flex justify-between items-center pt-1">
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={editStatus}
              onChange={(val) => setEditStatus(val as TaskStatus)}
            />
          </div>
          <div className="flex items-center gap-2 w-full">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setIsEditing(false)}
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </Button>

            <Button variant="primary" size="lg" onClick={() => handleSave()}>
              <X className="w-3.5 h-3.5" /> <Check className="w-3.5 h-3.5" />{" "}
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between gap-4 p-6 rounded-lg bg-gray-50 mx-6 items-center">
        <div className="flex flex-col gap-4 items-center justify-center">
          <span className="text-black font-medium text-xl">{title}</span>
          <span className="text-xs text-black">{descriptions}</span>
        </div>

        <div className="relative flex items-center gap-2">
          <span
            className={`px-2 py-1 text-sm rounded-xl ${StatusBadge(status)}`}
          >
            {status}
          </span>

          <button
            type="button"
            onClick={() => setShowActions((prev) => !prev)}
            className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg hover:text-black cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {showActions && (
            <div
              className="absolute right-0 top-full mt-2 z-10 bg-white border border-gray-200 rounded-lg shadow-md p-1 flex flex-col gap-1"
              ref={actionsRef}
            >
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-xs text-gray-700 hover:bg-gray-100 px-2.5 py-1.5 rounded cursor-pointer whitespace-nowrap font-medium"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-xs text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded cursor-pointer whitespace-nowrap font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
