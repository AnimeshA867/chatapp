"use client";

import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Icon, Icons } from "./Icons";
import { FC } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SideBarChatList from "./SideBarChatList";
import FriendRequestSidebarOption from "./FriendRequestSidebarOption";
import Image from "next/image";
import LogOut from "./LogOut";
import { Menu } from "lucide-react";
interface MobileChatLayoutType {
  friends: User[];
  sessionId: string | undefined | null;
  sessionImage: string | undefined | null;
  sessionEmail: string | undefined | null;
  sessionName: string;
  unseenRequestCount: string;
}
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
const MobileChatLayout: FC<MobileChatLayoutType> = ({
  friends,
  sessionId,
  sessionImage,
  sessionEmail,
  sessionName,
  unseenRequestCount,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 ">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bg-none">
            <Menu className="font-semibold text-3xl" />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>
              <div className="text-sm font-semibold leading-6 text-gray-500 border-b-2 border-gray-200 mb-4">
                Overview
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="md:flex h-full w-full max-w-sm grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white ">
            {friends.length > 0 ? (
              <div className="text-sm font-semibold leading-6 text-gray-500">
                Your Chats
              </div>
            ) : null}

            <nav className="flex flex-1 flex-col ">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <SideBarChatList
                  friends={friends}
                  sessionId={sessionId as string}
                />
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-500">
                    Overview
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {sidebarOptions.map(
                      (options: (typeof sidebarOptions)[0]) => {
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
                      }
                    )}
                  </ul>
                </li>
                <li>
                  <FriendRequestSidebarOption
                    sessionId={sessionId as string}
                    initialUnSeenRequestCount={parseInt(unseenRequestCount)}
                  />
                </li>
                <li className=" mt-auto flex items-center absolute bottom-0 mx-auto ">
                  <div className="flex flex-1 items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900 w-2/5">
                    <div className="relative h-8 w-8 bg-gray-50 ">
                      <Image
                        fill
                        referrerPolicy="no-referrer"
                        className="rounded-full"
                        src={sessionImage || ""}
                        alt="Your Profile Picture"
                      />
                    </div>
                    <span className="sr-only">Your Profile</span>
                    <div className="flex flex-col">
                      <span aria-hidden="true">{sessionName}</span>
                    </div>
                  </div>
                  <LogOut />
                </li>
              </ul>
            </nav>
          </div>
          <SheetFooter></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
export default MobileChatLayout;
