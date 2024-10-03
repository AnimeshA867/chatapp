"use client";

import { FC, useState } from "react";
import { Check, UserPlus, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  const acceptFriend = async (senderId: string) => {
    await axios.post("/api/friends/accept", { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );
    router.refresh();
  };
  const rejectFriend = async (senderId: string) => {
    await axios.post("/api/friends/reject", { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );
    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm ">You&apos;re all upto date.</p>
      ) : (
        friendRequests.map((requests) => (
          <div key={requests.senderId} className="flex gap-4 items-center">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{requests.senderEmail}</p>
            <button
              onClick={() => acceptFriend(requests.senderId)}
              aria-label="Accept Friend"
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>
            <button
              onClick={() => rejectFriend(requests.senderId)}
              aria-label="Reject Friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
