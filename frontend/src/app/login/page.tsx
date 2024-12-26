"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "@/app/api";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/token/", { username, password });

      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        router.push("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(`An error occurred during login: ${err}`);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
      <h1 className="text-3xl font-bold text-black text-center mb-6">
        Login Form
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Input */}
        <div>
          <label htmlFor="username" className="block text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}

      {/* Redirect to Register */}
      <div className="mt-4 text-center">
        <span
          onClick={() => router.push("/register")}
          className="text-blue-500 hover:underline cursor-pointer"
        >
          Register here
        </span>
      </div>
    </div>
  );
}

export default LoginPage;
