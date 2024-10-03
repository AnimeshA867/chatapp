import { fetchRedis } from "@/app/helper/redis";
import FriendRequests from "@/components/FriendRequests";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    notFound();
  }
  //ids of people who sent current logged in user a friend requests

  const incomingSenderIDs = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingSenderIDs?.map(async (senderId) => {
      const sender = JSON.parse(
        await fetchRedis("get", `user:${senderId}`)
      ) as User;

      return { senderId, senderEmail: sender.email };
    })
  );

  return (
    <main className="pt-8 flex justify-center items-center flex-col">
      <h1 className={"font-bold text-5xl mb-8"}>Friend Requests</h1>
      <div className="flex flex-col gap-4 ">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
};

export default page;
