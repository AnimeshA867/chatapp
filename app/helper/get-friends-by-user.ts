import { fetchRedis } from "./redis";

export default async function getFriendsByUserId(userId: string): Promise<User[]> {
  // Retrieve friends for current user
  const friendIds = await fetchRedis("smembers", `user:${userId}:friends`);

  // Fetch user data for each friend ID
  const friends = await Promise.all(
    friendIds.map(async (friendId: string) => {
      const friendData = await fetchRedis("get", `user:${friendId}`);
      
      // Assuming the user data is stored as a JSON string in Redis
      const friend = JSON.parse(friendData) as User; // Parse and type the data as a User
      return friend;
    })
  );

  return friends;
}