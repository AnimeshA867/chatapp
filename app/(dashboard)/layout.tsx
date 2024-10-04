import { authOptions } from "@/lib/auth";
import React from "react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Icon, Icons } from "@/components/Icons";
import Image from "next/image";
import LogOut from "@/components/LogOut";
import { redirect } from "next/navigation";
import FriendRequestSidebarOption from "@/components/FriendRequestSidebarOption";
import { fetchRedis } from "../helper/redis";
import getFriendsByUserId from "../helper/get-friends-by-user";
import SideBarChatList from "@/components/SideBarChatList";
import MobileChatLayout from "@/components/MobileChatLayout";
interface SidebarOption {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add Friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notFound = () => {
    redirect("/login");
  };

  const session = await getServerSession(authOptions);

  if (!session) notFound();
  const friends = await getFriendsByUserId(session?.user.id as string);

  const unseenRequestCount = (
    await fetchRedis(
      "smembers",
      `user:${session?.user.id}:incoming_friend_requests`
    )
  ).length;

  return (
    <section className="w-full flex h-screen flex-col md:flex-row">
      <div className="md:hidden w-full h-16 flex justify-between items-center px-4 border-b-2 border-gray-200 flex-shrink-0">
        <MobileChatLayout
          friends={friends}
          sessionId={session?.user.id}
          sessionEmail={session?.user.email}
          sessionImage={session?.user.image}
          sessionName={session?.user.name as string}
          unseenRequestCount={unseenRequestCount}
        />
        <Link href="/dashboard" className="p-4 relative">
          <Icons.Logo className=" h-8 w-auto text-indigo-600 " />
        </Link>
      </div>
      <div className="md:flex h-full w-full max-w-sm grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-8 hidden ">
        <Link href="/dashboard" className="p-4">
          <Icons.Logo className="h-8 w-auto text-indigo-600 " />
        </Link>
        {friends.length > 0 ? (
          <div className="text-sm font-semibold leading-6 text-gray-500">
            Your Chats
          </div>
        ) : null}

        <nav className="flex flex-1 flex-col ">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <SideBarChatList friends={friends} sessionId={session?.user.id} />
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-500">
                Overview
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map((options) => {
                  const Icon = Icons[options.Icon];
                  return (
                    <li key={options.id}>
                      <Link
                        href={options.href}
                        className="text-gray-700 hover:text-indigo-700 bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <span className="text-gray-500 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white ">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="truncate">{options.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li>
              <FriendRequestSidebarOption
                sessionId={session?.user.id}
                initialUnSeenRequestCount={unseenRequestCount}
              />
            </li>
            <li className="-mx-6 mt-auto flex items-center ">
              <div className="flex flex-1 items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="relative h-8 w-8 bg-gray-50 ">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session?.user.image || ""}
                    alt="Your Profile Picture"
                  />
                </div>
                <span className="sr-only">Your Profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session?.user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {session?.user.email}
                  </span>
                </div>
              </div>
              <LogOut />
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </section>
  );
}
