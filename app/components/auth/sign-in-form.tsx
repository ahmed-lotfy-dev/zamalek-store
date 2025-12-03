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
  Link as HeroLink,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/app/components/ui/toast";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await authClient.signIn.email({
      email,
      password,
      fetchOptions: {
        onSuccess: () => {
          router.push("/admin");
        },
        onError: (ctx: any) => {
          const message =
            ctx.error.message || "An error occurred during sign in";
          toast.error(message);
          setLoading(false);
        },
      },
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col gap-1 items-center justify-center pb-0">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-small text-default-500">
          Sign in to your account to continue
        </p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
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
            Sign In
          </Button>
        </form>
      </CardBody>
      <CardFooter className="justify-center pt-0">
        <div className="text-center text-small">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium underline hover:text-primary"
          >
            Sign Up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
