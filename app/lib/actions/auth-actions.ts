"use server";

import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signInAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    if (!result) {
      return { error: "Invalid credentials" };
    }
  } catch (error: any) {
    return { error: error.message || "Something went wrong" };
  }

  redirect("/");
}

export async function signUpAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: await headers(),
    });

    if (!result) {
      return { error: "Failed to create account" };
    }
  } catch (error: any) {
    return { error: error.message || "Something went wrong" };
  }

  redirect("/");
}
