"use client";
import React,{useState} from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormType = {
  Email: string;
  Password: string;
};

export default function Page() {
  const [resError, setResError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const { register, handleSubmit, formState: { errors } } = useForm<FormType>();

  const onSubmit = async (data: FormType) => {
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
    <div className="max-w-sm mx-auto mt-10">
      {resError && <p className="text-red-500 mb-2">{resError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            {...register("Email", { required: "This field is required" })}
          />
          <p className="text-red-500 text-sm">{errors.Email?.message}</p>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            {...register("Password", { required: "This field is required" })}
          />
          <p className="text-red-500 text-sm">{errors.Password?.message}</p>
        </div>

        <Button type="submit">Sign In</Button>
        <Button variant="destructive" onClick={() => signOut()}>
          Sign Out
        </Button>
      </form>
    </div>
  );
}
