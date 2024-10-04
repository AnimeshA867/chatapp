"use client";

import { FC, useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { addFriendValidator as formSchema } from "@/lib/validator/addFriendValidator";
import toast from "react-hot-toast";
import React from "react";
import { getUsers } from "@/app/helper/getUsers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
interface AddFriendBtnProps {
  users: User[];
  sessionId: string;
}

const AddFriendBtn: FC<AddFriendBtnProps> = ({ users, sessionId }) => {
  const router = useRouter();
  const [value, setValue] = useState("");
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
    router.refresh();
    form.setValue("email", "");
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

  const usersToAdd = users.sort().filter((user) => {
    return user.id !== sessionId;
  });

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <>
      <Card className="md:w-[500px] border-b shadow-sm  shadow-black flex flex-col ">
        <CardHeader>
          <h1 className={"font-bold md:text-5xl text-3xl mb-8 text-center"}>
            Add a friend
          </h1>
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
                    <FormLabel className="text-xl font-bold  ">Email</FormLabel>

                    <FormControl>
                      {/*  <Input
                        placeholder="Enter email address"
                        {...field}
                        className="w-[20rem]"
                      /> */}
                      <Command>
                        <CommandInput
                          placeholder="Enter the name"
                          value={value}
                          onValueChange={setValue}
                        />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup>
                            {value !== "" &&
                              usersToAdd.map((user, _) => (
                                <CommandItem
                                  key={user.id}
                                  onSelect={(value) => {
                                    setValue(user.name);
                                    form.setValue("email", user.email);
                                  }}
                                >
                                  <div className="py-1 px-2 flex justify-center items-center border-b-2 border-gray-200 last:border-none gap-4 cursor-pointer hover:ring-2 hover:ring-indigo-500 w-full rounded-md group">
                                    <div className="h-8 w-8 m-auto overflow-hidden relative ">
                                      {user.image ? (
                                        <Image
                                          fill
                                          referrerPolicy="no-referrer"
                                          src={
                                            user.image !== null
                                              ? user.image
                                              : ""
                                          }
                                          alt={`${user.name}'s Photo`}
                                          className="rounded-full group-hover:ring-2 hover:ring-indigo-500"
                                        />
                                      ) : (
                                        <UserPlus className="mx-auto my-auto" />
                                      )}
                                    </div>
                                    <div className="h-4/5 w-4/5 flex-auto ">
                                      <p className="indent-0 text-md text-gray-700 font-semibold">
                                        {user.name}
                                      </p>{" "}
                                      <p className="text-sm text-gray-600 font-semibold">
                                        {user.email}
                                      </p>
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                          <CommandSeparator />
                        </CommandList>
                      </Command>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full ">
                Add Friend
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {/*   */}
    </>
  );
};

export default AddFriendBtn;
