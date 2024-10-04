import { getUsers } from "@/app/helper/getUsers";
import AddFriendBtn from "@/components/AddFriendBtn";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

const Page = async () => {
  const users = await getUsers();
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  return (
    <main className="container pt-8 flex justify-center items-center flex-col">
      <AddFriendBtn users={users} sessionId={session.user.id as string} />
    </main>
  );
};

export default Page;
