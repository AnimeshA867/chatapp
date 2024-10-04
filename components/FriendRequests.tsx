"use client";

import Skeleton from "react-loading-skeleton"; // Assuming you're using shadcn-ui skeleton loader
import { FC, useEffect, useState } from "react";
import { Check, UserPlus, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
  outgoingFriendRequests: IncomingFriendRequest[];
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
  outgoingFriendRequests,
}) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );
  const [outgoingFriendRequest, setOutgoingFriendRequests] = useState<
    IncomingFriendRequest[]
  >(outgoingFriendRequests);

  const [loading, setLoading] = useState(true);

  // Handler for new incoming friend requests via Pusher
  const friendRequestHandler = ({
    senderId,
    senderEmail,
  }: IncomingFriendRequest) => {
    setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
  };

  const cancelRequests = async (senderId: string) => {
    try {
      await axios.post("/api/friends/cancel", { id: senderId });
      setOutgoingFriendRequests((prev) =>
        prev.filter((request) => request.senderId !== senderId)
      );
    } catch (error) {
      console.error("Error canceling the friend request.", error);
    }
  };

  const acceptFriend = async (senderId: string) => {
    try {
      await axios.post("/api/friends/accept", { id: senderId });
      setFriendRequests((prev) =>
        prev.filter((request) => request.senderId !== senderId)
      );
    } catch (error) {
      console.error("Error accepting the friend request.", error);
    }
  };

  const rejectFriend = async (senderId: string) => {
    try {
      await axios.post("/api/friends/reject", { id: senderId });
      setFriendRequests((prev) =>
        prev.filter((request) => request.senderId !== senderId)
      );
    } catch (error) {
      console.error("Error rejecting the friend request.", error);
    }
  };

  useEffect(() => {
    // Subscribe to Pusher events for incoming friend requests
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );
    pusherClient.bind("incoming_friend_requests", friendRequestHandler);

    setLoading(false); // Simulate loading finished

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

  return (
    <>
      <Tabs defaultValue="incoming" className="w-[500px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="incoming">Incoming Friend Requests</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing Friend Requests</TabsTrigger>
        </TabsList>

        {/* Incoming Friend Requests Tab */}
        <TabsContent value="incoming">
          {loading ? (
            <div className="space-y-4">
              {/* Skeleton while loading */}
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
            </div>
          ) : friendRequests.length === 0 ? (
            <p className="text-sm">You&apos;re all up to date.</p>
          ) : (
            friendRequests.map((request) => (
              <div
                key={request.senderId}
                className="flex gap-4 items-center p-4 border-b"
              >
                <UserPlus className="text-black" />
                <div>
                  <p className="font-medium text-lg">{request.senderEmail}</p>
                </div>
                <button
                  onClick={() => acceptFriend(request.senderId)}
                  aria-label="Accept Friend"
                  className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
                >
                  <Check className="font-semibold text-white w-3/4 h-3/4" />
                </button>
                <button
                  onClick={() => rejectFriend(request.senderId)}
                  aria-label="Reject Friend"
                  className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
                >
                  <X className="font-semibold text-white w-3/4 h-3/4" />
                </button>
              </div>
            ))
          )}
        </TabsContent>

        {/* Outgoing Friend Requests Tab */}
        <TabsContent value="outgoing">
          {loading ? (
            <div className="space-y-4">
              {/* Skeleton while loading */}
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
            </div>
          ) : outgoingFriendRequest.length === 0 ? (
            <p className="text-sm">No outgoing requests.</p>
          ) : (
            outgoingFriendRequest.map((request) => (
              <div
                key={request.senderId}
                className="flex gap-4 items-center p-4 border-b"
              >
                <UserPlus className="text-black" />
                <div>
                  <p className="font-medium text-lg">{request.senderEmail}</p>
                </div>
                <button
                  onClick={() => cancelRequests(request.senderId)}
                  aria-label="Cancel Request"
                  className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
                >
                  <X className="font-semibold text-white w-3/4 h-3/4" />
                </button>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default FriendRequests;
