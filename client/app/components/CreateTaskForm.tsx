import { Task } from "@/types/todo";
import { FormEvent, useState } from "react";
import { Input } from "./ui/Input";
import { Select } from "./ui/useSelectOptions";
import { STATUS_OPTIONS } from "../constants/status";
import { Button } from "./ui/Button";

interface Props {
  onTaskCreate: (newTask: Task) => void;
}

export function CreateTaskForm({ onTaskCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("todo");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (title.trim() === "") return;

    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ title, description, status }),
      });

      if (!res.ok) throw new Error("Failed to create todo");

      const newTask = await res.json();

      onTaskCreate(newTask);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="animate-pulse text-xl flex justify-center items-center w-full h-full">
        Loading...
      </div>
    );

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="flex flex-col p-6 bg-white rounded-xl border border-gray-200 shadow-sm gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <Input
          type="text"
          label="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-600">Description</label>
        <textarea
          name=""
          id=""
          placeholder="Additional details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2 text-sm text-gray-900 bg-gray-50/50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all placeholder:text-gray-400 resize-none"
        ></textarea>
      </div>

      <Select
        label="Status"
        options={STATUS_OPTIONS}
        value={status}
        onChange={(val) => setStatus(val)}
      />

      <Button type="submit" size="lg" isLoading={isLoading}>
        Create
      </Button>
    </form>
  );
}
