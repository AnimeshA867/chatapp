"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { LucideLoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
const Page = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      toast.success("Working.");
      await signIn("google");
    } catch (error) {
      toast.error("Error signing with Google.");
      throw new Error("Error signining in.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
        <div className="w-full flex flex-col items-center max-w-md space-y-8 ">
          <div className="flex flex-col items-center gap-8 ">
            Logo
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 ">
              Sign in to your account
            </h2>
          </div>
          <Button
            disabled={isLoading}
            type="button"
            className="max-w-sm mx-auto w-full"
            onClick={loginWithGoogle}
          >
            {isLoading ? <LucideLoaderCircle /> : <FcGoogle />}
            Sign in With Google
          </Button>
        </div>
      </div>
    </>
  );
};

export default Page;
