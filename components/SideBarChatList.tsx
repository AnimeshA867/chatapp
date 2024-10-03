"use client";

import { chatHrefConstructor } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface SideBarChatListProps {
  friends: User[];
  sessionId: string | undefined;
}

const SideBarChatList: FC<SideBarChatListProps> = ({ friends, sessionId }) => {
  console.log("This is working.");
  console.log(friends);
  const router = useRouter();
  const pathName = usePathname();

  // State to track unseen messages
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

  // Effect to filter out unseen messages when user navigates to a chat
  useEffect(() => {
    if (pathName?.includes("chat")) {
      setUnseenMessages((prev) =>
        prev.filter((msg) => !pathName.includes(msg.senderId))
      );
    }
  }, [pathName]);

  return (
    <ul role="list" className="max-h-[20rem] overflow-y-auto -mx-2 space-y-1">
      {friends.map((friend: User) => {
        const unseenMessagesCount = unseenMessages.filter(
          (msg) => msg.senderId === friend.id
        ).length;
        console.log(friend);
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId as string,
                friend.id
              )}`}
              className="text-gray-700 hover:text-indigo-700 bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              {friend.name} {/* Access the friend's name here */}
              {unseenMessagesCount > 0 && (
                <span className="bg-gradient-to-l from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
                  {unseenMessagesCount} new messages
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SideBarChatList;
