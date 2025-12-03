"use client";

import { useActionState } from "react";
import { signInAction } from "@/app/lib/actions/auth-actions";
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

export default function SignInForm() {
  const [state, dispatch, isPending] = useActionState(signInAction, null);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col gap-1 items-center justify-center pb-0">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-small text-default-500">
          Sign in to your account to continue
        </p>
      </CardHeader>
      <CardBody>
        <form action={dispatch} className="flex flex-col gap-4">
          {state?.error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {state.error}
            </div>
          )}
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="john@example.com"
            variant="bordered"
            isRequired
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            variant="bordered"
            isRequired
          />

          <Button
            type="submit"
            isLoading={isPending}
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
