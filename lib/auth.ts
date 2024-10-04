import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { fetchRedis } from "@/app/helper/redis";

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || clientId.length === 0) {
    throw new Error("Missing Google_CLIENT_ID");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing Google_CLIENT_SECRET");
  }
  return {
    clientId,
    clientSecret,
  };
}

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUserResult = (await fetchRedis("get", `user:${token.id}`)) as
        | string
        | null;
      console.log(dbUserResult);
      if (!dbUserResult) {
        token.id = user!.id;
        await db.sadd(`users`, user!.id);
        return token;
      }
      const dbUser = JSON.parse(dbUserResult) as User;
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        (session.user.id = token.id),
          (session.user.email = token.email),
          (session.user.image = token.picture),
          (session.user.email = token.email);
      }
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};
