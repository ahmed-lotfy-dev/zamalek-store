"use client";

import { useActionState } from "react";
import { signUpAction } from "@/app/lib/actions/auth-actions";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@heroui/react";
import Link from "next/link";

export default function SignUpForm() {
  const [state, dispatch, isPending] = useActionState(signUpAction, null);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col gap-1 items-center justify-center pb-0">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-small text-default-500">Join Zamalek Store today</p>
      </CardHeader>
      <CardBody>
        <form action={dispatch} className="flex flex-col gap-4">
          {state?.error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {state.error}
            </div>
          )}
          <Input
            label="Name"
            name="name"
            type="text"
            placeholder="John Doe"
            variant="bordered"
            isRequired
          />

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
