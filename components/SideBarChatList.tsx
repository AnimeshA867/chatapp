"use client";

import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import UnseenChatToast from "./ui/UnseenChatToast";

interface SideBarChatListProps {
  friends: User[];
  sessionId: string | undefined;
}

interface extendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

const SideBarChatList: FC<SideBarChatListProps> = ({ friends, sessionId }) => {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const newFriendHandler = () => {
    router.refresh();
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const chatHandler = (extendedMessage: extendedMessage) => {
    const shouldNotify =
      pathName !==
      `/dashboard/chat/${chatHrefConstructor(
        sessionId as string,
        extendedMessage.senderId
      )}`;
    console.log(pathName);
    if (!shouldNotify) return;

    toast.custom((t) => (
      //Custom Component
      <UnseenChatToast
        t={t}
        sessionId={sessionId as string}
        senderId={extendedMessage.senderId}
        senderImage={extendedMessage.senderImg}
        senderName={extendedMessage.senderName}
        senderMessage={extendedMessage.text}
      />
    ));

    setUnseenMessages((prev) => [...prev, extendedMessage]);

    console.log(extendedMessage);
  };

  useEffect(() => {
    try {
      pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));
      pusherClient.bind(`new_message`, chatHandler);
      pusherClient.bind(`new_friend`, newFriendHandler);
      return () => {
        pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
        pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
        pusherClient.unbind(`new_message`, chatHandler);
        pusherClient.unbind(`new_friend`, newFriendHandler);
      };
    } catch (error) {
      console.log(error);
    }
  }, [pathName, sessionId, router, chatHandler, newFriendHandler]);

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
