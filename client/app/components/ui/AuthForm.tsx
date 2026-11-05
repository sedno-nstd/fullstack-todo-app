import { FormEvent, useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";

interface Props {
  onSuccess: (token: string) => void;
}

export function AuthForm({ onSuccess }: Props) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Authentication failed");
      localStorage.setItem("token", data.token);
      onSuccess(data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      className="flex flex-col gap-6 bg-white rounded-lg justify-center items-start p-10 w-full max-w-[448px]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-2 w-full">
        <Input
          label="Email"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <div className="w-full flex items-center justify-center">
            <span className="text-red-600 text-sm font-medium">{error}</span>
          </div>
        )}
      </div>
      <Button type="submit" size="lg" isLoading={isLoading}>
        {isLogin ? "Login" : "Registration"}
      </Button>

      <p className="text-sm font-medium text-center text-gray-500 mt-2 w-full">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
          }}
          className="text-blue-600 hover:underline font-medium cursor-pointer"
        >
          {isLogin ? "Register" : "Sign In"}
        </button>
      </p>
    </form>
  );
}
