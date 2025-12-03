"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    await authClient.signIn.email({
      email,
      password,
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx: any) => {
          alert(ctx.error.message);
          setLoading(false);
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
      <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
      <p className="text-center text-zinc-500 dark:text-zinc-400 mb-6">
        Sign in to your account to continue
      </p>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
          placeholder="john@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
          placeholder="••••••••"
        />
      </div>

      <Button
        isLoading={loading}
        onPress={handleSignIn}
        className="w-full bg-black text-white dark:bg-white dark:text-black font-medium mt-4"
      >
        Sign In
      </Button>

      <div className="text-center text-sm mt-4">
        Don't have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium underline hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
