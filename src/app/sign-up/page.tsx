"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
type FormData = {
  username: string;
  email: string;
  password: string;
};

export default function Page() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>();
  const [err, setErr] = useState("");
  const [res, setRes] = useState("");

  async function registerUser(value: FormData) {
    const { username, email, password } = value;
    try {
      const res = await axios.post("/api/user/signup", {
        username,
        email,
        password,
      });
      console.log(res);
      if (res.status >= 200 && res.status < 300) {
        setRes(`${res.data?.message}`);
        setErr("");
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setErr(error.response?.data?.error || "Request failed");
        setRes("");
      } else {
        setErr("Something went wrong");
        setRes("");
      }
    }
  }
  return (
    <div className="flex w-screen h-screen justify-center items-center ">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create a account</CardTitle>
          <CardDescription>
            Enter your credentials below to create an account
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => router.push("/sign-in")}>
              Sign In
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(registerUser)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  {...register("username")}
                  id="username"
                  type="text"
                  placeholder="foxCleaverDev"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Signup
            </Button>
          </form>
        </CardContent>
        {res ? res : err}

        <CardFooter className="flex-col gap-2">
          <Button variant="outline" className="w-full">
            Signup with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
