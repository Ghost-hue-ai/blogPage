"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

type FormData = {
  username: string;
  email: string;
  password: string;
};

export default function Page() {
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
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setErr(error.response?.data?.error || "Request failed");
      } else {
        setErr("Something went wrong");
      }
    }
  }
  return (
    <div className="flex w-screen h-screen justify-center items-center ">
      <form onSubmit={handleSubmit((data) => registerUser(data))}>
        <div className="flex flex-col gap-2">
          <div>
            <Label htmlFor="username">Username: </Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              {...register("username")}
              required={true}
            />
          </div>
          <div>
            <Label htmlFor="email">Email: </Label>
            <Input
              id="email"
              type="text"
              placeholder="email"
              {...register("email")}
              required={true}
            />
          </div>
          <div>
            <Label htmlFor="password">Password: </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              required={true}
            />
          </div>
          <p className="text-red-600 text-sm ">{err}</p>
          <p className="text-blue-600 text-sm ">{res}</p>
          <Button type="submit">Create account</Button>
        </div>
      </form>
    </div>
  );
}
