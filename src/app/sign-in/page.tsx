"use client";
import React, { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FormType = {
  Email: string;
  Password: string;
};

export default function Page() {
  const [resError, setResError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>();

  const onSubmit = async (data: FormType) => {
    console.log("btn clicked");

    const { Email: email, Password: password } = data;

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!res) {
        setResError("No response from server");
        return;
      }

      if (res.error) {
        setResError(`Error logging in: ${res.error}`);
        return;
      }

      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (error: any) {
      setResError("Unexpected error: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {resError && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {resError}
            </div>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("Email")}
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                {...register("Password")}
              />
            </div>
            <Button type="submit" className="w-full border-2">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
