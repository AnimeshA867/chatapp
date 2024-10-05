import { fetchRedis } from "@/app/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { z } from "zod";
import { nanoid } from "nanoid";
import { messageSchema } from "@/lib/validator/messages";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body
    const { text, chatId } = z
      .object({ text: z.string(), chatId: z.string() })
      .parse(body);

    // Ensure chatId exists
    if (!chatId) {
      return new Response("Invalid chat ID", { status: 400 });
    }

    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session) notFound();

    const [userId1, userId2] = chatId.split("--");

    // Ensure chatId is correctly formatted
    if (!userId1 || !userId2) {
      return new Response("Invalid chat ID format", { status: 400 });
    }

    // Check if the user is part of the chat
    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthorized", { status: 401 });
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1;

    // Fetch user's friend list
    const friendList = (await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`
    )) as string[];

    const isFriend = friendList.includes(friendId);

    // Ensure the recipient is a friend
    if (!isFriend) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Fetch sender details
    const rawSender = (await fetchRedis(
      "get",
      `user:${session.user.id}`
    )) as string;
    const sender = JSON.parse(rawSender) as User;
    const timestamp = Date.now();

    // Create message object
    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      receiverId: friendId,
      text: text || "",
      timestamp: timestamp,
    };

    // Validate message data
    const message = messageSchema.parse(messageData);

    // Trigger Pusher events
    pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      "incoming-messages",
      messageData
    );
    pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), "new_message", {
      ...message,
      senderImg: sender.image,
      senderName: sender.name,
    });

    // Save message in Redis
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response("Ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }
    return new Response("Error sending the message.", { status: 500 });
  }
}
