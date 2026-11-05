import { User } from "@/types/todo";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function Header({ onLogout, user }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between shadow-sm">
      <span className="font-semibold text-gray-900 text-sm">TODO App</span>

      <div className="flex items-center gap-4 text-sm">
        {user?.email && (
          <span className="text-gray-600 font-medium">{user.email}</span>
        )}
        <button
          onClick={onLogout}
          className="text-sm font-medium text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
