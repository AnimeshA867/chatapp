"use client";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { FC } from "react";

interface LogOutProps {}

const LogOut: FC<LogOutProps> = ({}) => {
  return <Button onClick={() => signOut()}>LogOut</Button>;
};

export default LogOut;
