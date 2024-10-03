"use client";

import { FC, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/button";

import axios, { AxiosError } from "axios";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addFriendValidator as formSchema } from "@/lib/validator/addFriendValidator";
import toast from "react-hot-toast";
interface AddFriendBtnProps {}

const AddFriendBtn: FC<AddFriendBtnProps> = ({}) => {
  // 1. Define your form.
  const [showSuccessState, setShowSuccessState] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(formData: z.infer<typeof formSchema>) {
    addFriend(formData.email);
  }

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = formSchema.parse({ email });
      await axios.post("/api/friends/add", {
        email: validatedEmail,
      });

      toast.success("Friend Request Sent.");

      setShowSuccessState(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        form.setError("email", { message: error.message });
        return;
      }

      if (error instanceof AxiosError) {
        form.setError("email", { message: error.response?.data });
        return;
      }
      form.setError("email", { message: "Something went wrong" });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-bold">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormDescription>Enter your friends email</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
};

export default AddFriendBtn;
