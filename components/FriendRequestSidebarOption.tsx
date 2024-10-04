"use client";

import Link from "next/link";
import { FC, useEffect, useState } from "react";

import { User } from "lucide-react";
import { pusherClient } from "../lib/pusher";
import { toPusherKey } from "@/lib/utils";
interface FriendRequestSidebarOptionProps {
  sessionId: undefined | string;
  initialUnSeenRequestCount: number;
}

const FriendRequestSidebarOption: FC<FriendRequestSidebarOptionProps> = ({
  sessionId,
  initialUnSeenRequestCount,
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState(
    initialUnSeenRequestCount
  );

  useEffect(() => {
    try {
      console.log("This is indeed working.");
      const channel = toPusherKey(`user:${sessionId}:incoming_friend_requests`);
      const channelForFriends = toPusherKey(`user:${sessionId}:friends`);
      pusherClient.subscribe(channel);
      pusherClient.subscribe(channelForFriends);
      const friendRequestHandler = () => {
        console.log(unseenRequestCount);
        setUnseenRequestCount((prev) => prev + 1);
      };
      const addFriendHandler = () => {
        console.log(unseenRequestCount);
        setUnseenRequestCount((prev) => prev - 1);
      };
      pusherClient.bind("new_friend", addFriendHandler);
      pusherClient.bind("incoming_friend_requests", friendRequestHandler);
      return () => {
        pusherClient.unsubscribe(channel);
        pusherClient.subscribe(channelForFriends);
        pusherClient.unbind("new_friend", addFriendHandler);

        pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
      };
    } catch (error) {
      console.log(error);
    }
  }, [sessionId, unseenRequestCount]);

  return (
    <Link
      href={"/dashboard/requests"}
      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md  text-sm leading-6 font-semibold"
    >
      <div className="text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
        <User className="h-4 w-4" />
      </div>
      <p className="truncate ">Friend Requests</p>

      {unseenRequestCount > 0 ? (
        <div className="rounded-full h-5 w-5 text-xs flex justify-center items-center text-white bg-indigo-600">
          {unseenRequestCount}
        </div>
      ) : null}
    </Link>
  );
};

export default FriendRequestSidebarOption;
