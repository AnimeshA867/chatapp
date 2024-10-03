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

    const { text, chatId: id } = z
      .object({ text: z.string(), chatId: z.string() })
      .parse(body);
    const session = await getServerSession(authOptions);
    if (!session) notFound();

    const [userId1, userId2] = id.split("--");

    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthoried", { status: 401 });
    }

    const friendId = session.user.id === userId1 ? userId2 : userId1;

    const friendList = (await fetchRedis(
      "smembers",
      `user:${session.user.id}:friends`
    )) as string[];

    const isFriend = friendList.includes(friendId);

    if (!isFriend) {
      return new Response("Unauthorized", { status: 401 });
    }
    const rawSender = (await fetchRedis(
      "get",
      `user:${session.user.id}`
    )) as string;
    const sender = JSON.parse(rawSender) as User;
    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      receiverId: friendId,
      text: text,
      timestamp: timestamp,
    };

    const message = messageSchema.parse(messageData);

    pusherServer.trigger(toPusherKey(`chat:${id}`), id, messageData);
    pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), "new_message", {
      ...message,
      senderImg: sender.image,
      senderName: sender.name,
    });
    await db.zadd(`chat:${id}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response("Ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Error sending the message.", { status: 500 });
  }
}
