import getFriendsByUserId from "@/app/helper/get-friends-by-user";
import { fetchRedis } from "@/app/helper/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const friendWithLastMessageRaw = await Promise.all(
    friends.map(async (friend) => {
      console.log(
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`
      );
      const [lastMessageRaw] = (await fetchRedis(
        "zrange",
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as string[];
      if (!lastMessageRaw) {
        return;
      }
      const lastMessage = JSON.parse(lastMessageRaw) as Message;
      return {
        ...friend,
        lastMessage,
      };
    })
  );
  const friendWithLastMessage = friendWithLastMessageRaw.filter(Boolean);
  console.log(friendWithLastMessageRaw);
  console.log(friendWithLastMessage);
  return (
    <>
      <div className="container py-12 ">
        <h1 className="text-3xl font-semibold mb-4">Recents Chats</h1>
        {friendWithLastMessage.length == 0 ? (
          <p className="text-sm text-zinc-500">Nothing to show here...</p>
        ) : (
          friendWithLastMessage.map((friend) => (
            <div
              key={friend.id}
              className="relative bg-zinc-50 border-zinc-200 p-3 rounded-lg hover:ring-indigo-500 hover:ring transition ease-linear duration-200  "
            >
              <div className="absolute right-4 inset-y-0 flex items-center ">
                <ChevronRight className="h-7 w-7 text-zinc-400" />
              </div>
              <a
                className="relative sm:flex "
                href={`/dashboard/chat/${chatHrefConstructor(
                  session.user.id,
                  friend.id
                )}`}
              >
                <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                  <div className="relative h-6 w-6">
                    <Image
                      referrerPolicy="no-referrer"
                      className="rounded-full"
                      alt={`${friend.name}'s Profile`}
                      src={friend.image}
                      fill
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{friend.name}</h4>
                  <p className="mt-1 max-w-md">
                    <span className="text-zinc-400">
                      {friend.lastMessage.senderId === session.user.id
                        ? `You: `
                        : ``}
                    </span>
                    {friend.lastMessage.text}
                  </p>
                </div>
              </a>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Page;
