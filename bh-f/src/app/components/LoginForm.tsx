"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/page.module.css";
import "@/app/globals.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Неверный логин или пароль");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-md space-y-6 p-8 sm:p-10 border rounded-2xl shadow bg-white flex flex-col justify-center"
        style={{ height: "400px" }}
      >
        <h2
          className={`text-[#4b4845] text-3xl font-semibold text-center ${styles.titleMain}`}
        >
          Вход в админку
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-white border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-white border border-gray-300 rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {errorMessage && (
          <p className="text-red-500 text-center text-sm">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-auto w-full border border-gray-600 text-gray-800 text-[20px] px-10 py-3 rounded-[10px] hover:bg-gray-100 transition"
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
