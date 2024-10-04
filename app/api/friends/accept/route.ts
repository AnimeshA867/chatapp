import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { fetchRedis } from "@/app/helper/redis";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    //Verify both users are not already friends
    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends) {
      return new Response("Already Friends", { status: 400 });
    }

    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user?.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFriendRequest) {
      return new Response("No Friend Request", { status: 400 });
    }

    const [userRaw, friendRaw] = (await Promise.all([
      await fetchRedis(`get`, `user:${session.user.id}`),
      await fetchRedis("get", `user:${idToAdd}`),
    ])) as [string, string];

    const user = JSON.parse(userRaw);
    const friend = JSON.parse(friendRaw);

    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${idToAdd}:friends`),
        `new_friend`,
        user
      ),
      pusherServer.trigger(
        toPusherKey(`user:${session.user.id}:friends`),
        `new_friend`,
        friend
      ),
      await db.sadd(`user:${session.user.id}:friends`, idToAdd),

      await db.sadd(`user:${idToAdd}:friends`, session.user.id),
      await db.srem(
        `user:${session.user.id}:incoming_friend_requests`,
        idToAdd
      ),
    ]);

    // await db.srem(`user:${idToAdd}:friends`,session.user.id);

    return new Response("Ok", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid Request", { status: 400 });
  }
}
