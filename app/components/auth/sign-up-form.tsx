"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authClient.signUp.email({
        email,
        password,
        name,
        fetchOptions: {
          onSuccess: () => {
            router.push("/admin");
          },
          onError: (ctx: any) => {
            alert(ctx.error.message);
            setLoading(false);
          },
        },
      });
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Failed to sign up. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col gap-1 items-center justify-center pb-0">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-small text-default-500">Join Zamalek Store today</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <Input
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            variant="bordered"
            isRequired
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            variant="bordered"
            isRequired
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            variant="bordered"
            isRequired
          />

          <Button
            type="submit"
            isLoading={loading}
            color="primary"
            className="w-full font-medium mt-2"
          >
            Sign Up
          </Button>
        </form>
      </CardBody>
      <CardFooter className="justify-center pt-0">
        <div className="text-center text-small">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium underline hover:text-primary"
          >
            Sign In
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
