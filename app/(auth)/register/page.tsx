"use client";
import Button from "@/components/ui/button";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { LucideLoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpValidator as formSchema } from "@/lib/validator/signUpValidator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import axios from "axios";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast.error("Error signing with Google.");
      throw new Error("Error signining in.");
    } finally {
      setIsLoading(false);
    }
  };
  async function onSubmit(formData: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await axios.post(`/api/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      router.replace(`/login`);
    } catch (error) {
      console.log("Error Signing in.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <main className="flex max-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 h-screen">
        <Card className="w-[500px] aspect-square flex justify-center flex-col">
          <CardHeader>
            <CardTitle className="text-3xl font-bold md:text-4xl">
              Register
            </CardTitle>
            <CardDescription className="text-md">
              Enter your Detials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6 "
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl font-bold  ">
                        Name
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          {...field}
                          autoComplete={"off"}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl font-bold  ">
                        Email
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Enter email address"
                          {...field}
                          className="w-full"
                          autoComplete={"off"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl font-bold  ">
                        Password
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Enter password"
                          {...field}
                          className="w-full"
                          autoComplete={"off"}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full " disabled={isLoading}>
                  Sign Up
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-evenly items-center space-x-4 px-4 ">
            <Button
              disabled={isLoading}
              type="button"
              className="max-w-sm  w-fit gap-4"
              onClick={loginWithGoogle}
            >
              {isLoading ? (
                <LucideLoaderCircle className="animate-spin h-4 w-4" />
              ) : (
                <FcGoogle />
              )}
              Sign in With Google
            </Button>

            <Link
              href="/login"
              className="bg-green-600 flex-1 text-center h-full flex justify-center items-center rounded-lg hover:bg-green-700"
            >
              Login
            </Link>
          </CardFooter>
        </Card>
        {/*  <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
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
          {isLoading ? (
            <LucideLoaderCircle className="animate-spin h-4 w-4" />
            ) : (
              <FcGoogle />
              )}
              Sign in With Google
              </Button>
              </div>
              </div> */}
      </main>
    </>
  );
};

export default Page;
