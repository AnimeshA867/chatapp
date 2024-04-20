import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import React from "react";
import { Button } from "@/components/ui/button";
import LogOut from "@/components/LogOut";
const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <>
      <LogOut />
      <pre>{JSON.stringify(session)}</pre>;
    </>
  );
};

export default Dashboard;
