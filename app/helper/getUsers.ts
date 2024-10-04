import { fetchRedis } from "./redis";

export async function getUsers() {
  const userIds = (await fetchRedis("smembers", `users`)) as string[];

  const users = await Promise.all(
    userIds.map(async (userId: string) => {
      const userData = await fetchRedis("get", `user:${userId}`);
      const user = JSON.parse(userData) as User;
      return user;
    })
  );
  return users;
}
