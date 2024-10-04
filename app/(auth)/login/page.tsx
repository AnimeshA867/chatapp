"use client";
import Button from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { LucideLoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginValidator as formSchema } from "@/lib/validator/signUpValidator";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();

  const [error, setError] = useState("");

  // Handle error messages passed via query parameters
  useEffect(() => {
    const errorParam = searchParams?.get("error");
    if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      toast.success("Redirecting to Google...");
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error("Error signing in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  async function onSubmit(formData: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Handle credential sign in
      const res = await signIn("credentials", {
        redirect: false, // Do not redirect automatically
        email: formData.email,
        password: formData.password,
        callbackUrl: "/dashboard", // URL to redirect after successful login
      });

      if (res?.error) {
        // Set error message to be displayed
        setError(res.error);
        toast.error(res.error);
      } else if (res?.ok) {
        // Redirect to dashboard on successful login
        toast.success("Login successful.");
        window.location.href = res.url || "/dashboard";
      }
    } catch (error) {
      toast.error("Error signing in.");
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
              Login
            </CardTitle>
            <CardDescription className="text-md">
              Enter your Login Details
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl font-bold">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter email address"
                          {...field}
                          className="w-full"
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
                      <FormLabel className="text-xl font-bold">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter password"
                          {...field}
                          className="w-full"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Error message display */}
                {error && (
                  <div className="text-red-500 text-center">
                    {error === "CredentialsSignin" &&
                      "Invalid email or password."}
                    {error === "OAuthAccountNotLinked" &&
                      "Please sign in with the correct provider."}
                    {error === "AccessDenied" &&
                      "Access denied, please contact support."}
                    {error === "Configuration" &&
                      "Server configuration issue, try again later."}
                    {error === "default" && "Login failed. Please try again."}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <LucideLoaderCircle className="animate-spin h-4 w-4" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-evenly items-center space-x-4 px-4">
            <Button
              disabled={isLoading}
              type="button"
              className="max-w-sm w-fit gap-4"
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
              href="/register"
              className="bg-green-600 flex-1 text-center h-full flex justify-center items-center rounded-lg hover:bg-green-700"
            >
              Sign up
            </Link>
          </CardFooter>
        </Card>
      </main>
    </>
  );
};

export default Page;
