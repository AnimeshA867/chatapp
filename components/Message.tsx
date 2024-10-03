"use client";

import { FC, useRef, useState } from "react";
import FriendRequestSidebarOption from "@/components/FriendRequestSidebarOption";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

interface MessageProps {
  initialMessages: Message[];
  sessionId: string;
  sessionImg: string | undefined | null;
  chatPartner: User;
  sessionUser: string | undefined | null;
}

const Message: FC<MessageProps> = ({
  initialMessages,
  sessionId,
  sessionImg,
  chatPartner,
  sessionUser,
}) => {
  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState(initialMessages);
  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef}>
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === sessionId;
          const hasNextMessageFromSameUser =
            messages[index - 1]?.senderId === messages[index].senderId;

          return (
            <div key={message.id} className="chat-message">
              <div
                className={cn("flex items-end", {
                  "justify-end": isCurrentUser,
                })}
              >
                <div
                  className={cn(
                    "flex flex-col space-y-2 text-base max-w-xs mx-2 my-1",
                    {
                      "order-1 items-end": isCurrentUser,
                      "order-2 items-start": !isCurrentUser,
                    }
                  )}
                >
                  <span
                    className={cn("px-4 py-2 rounded-lg inline-block ", {
                      "bg-indigo-600 text-white": isCurrentUser,
                      "bg-grey-200 text-gray-900 ": !isCurrentUser,
                      "rounded-br-none":
                        !hasNextMessageFromSameUser && isCurrentUser,
                      "rounded-bl-none":
                        !hasNextMessageFromSameUser && !isCurrentUser,
                    })}
                  >
                    {message.text}{" "}
                    <span className="ml-2 text-xs text-gray-400">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </span>
                </div>

                <div
                  className={cn("relative w-8 h-8 ", {
                    "order-2": isCurrentUser,
                    "order-1": !isCurrentUser,
                    invisible: hasNextMessageFromSameUser,
                  })}
                >
                  <Image
                    fill
                    src={
                      isCurrentUser ? (sessionImg as string) : chatPartner.image
                    }
                    alt={
                      isCurrentUser ? (sessionUser as string) : chatPartner.name
                    }
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Message;
