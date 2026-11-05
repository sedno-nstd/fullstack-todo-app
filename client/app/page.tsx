"use client";
import { FiltersBar } from "./components/FiltersBar";
import { useEffect, useState, useSyncExternalStore } from "react";
import { FilterStatus, Task, User } from "@/types/todo";
import { useTaskFilters } from "./hooks/useTaskFilters";
import { TaskList } from "./components/TaskList";
import { CreateTaskForm } from "./components/CreateTaskForm";
import { Header } from "./components/Header";
import { AuthForm } from "./components/ui/AuthForm";

const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function Home() {
  const isHydrated = useHydrated();
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });

  const [user, setUser] = useState<User | null>(null);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    let isCancelled = false;

    queueMicrotask(() => {
      if (!isCancelled) setIsLoading(true);
    });

    const getTasks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok && !isCancelled) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    getTasks();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  const filteredTasks = useTaskFilters(tasks, currentFilter);

  const handleTaskCreated = (newTask: Task) =>
    setTasks((prev) => [newTask, ...prev]);
  const handleTaskDeleted = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));
  const handleTaskUpdated = (id: number, updated: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t)),
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setTasks([]);
  };

  if (!isHydrated) return null;

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <AuthForm
          onSuccess={(newToken) => {
            localStorage.setItem("token", newToken);
            setToken(newToken);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <Header user={user} onLogout={handleLogout} />
      <main className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-6  mt-5">
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <FiltersBar
              currentFilter={currentFilter}
              onSelectFilter={setCurrentFilter}
            />
          </div>

          {isLoading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm shadow-sm">
              Loading task...
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onDelete={handleTaskDeleted}
              onUpdate={handleTaskUpdated}
            />
          )}
        </section>

        <aside className="lg:col-span-4 lg:sticky lg:top-6 self-start">
          <CreateTaskForm onTaskCreate={handleTaskCreated} />
        </aside>
      </main>
    </div>
  );
}
