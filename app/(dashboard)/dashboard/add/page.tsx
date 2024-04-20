import AddFriendBtn from "@/components/AddFriendBtn";
import React from "react";

const Page = () => {
  return (
    <main className="pt-8 flex justify-center items-center flex-col">
      <h1 className={"font-bold text-5xl mb-8"}>Add a friend</h1>
      <AddFriendBtn />
    </main>
  );
};

export default Page;
