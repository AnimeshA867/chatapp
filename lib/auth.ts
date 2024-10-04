import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { fetchRedis } from "@/app/helper/redis";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"; // Make sure bcrypt is installed

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
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
    Credentials({
      name: "Welcome Back",
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const { email, password } = credentials;

        try {
          // Fetch user credentials from Redis
          const userJson = await fetchRedis("get", `user:credentials:${email}`);

          if (!userJson) {
            throw new Error("No user found with that email.");
          }

          // Parse the fetched user data
          const user = JSON.parse(userJson);

          // Compare the hashed password with the incoming password
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            throw new Error("Invalid password.");
          }

          // If password matches, return the user object
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          const errorMessage = error as string;
          return new Response(errorMessage, { status: 400 });
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If a user is passed in (during login), attach their info to the token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        // Optionally add user to Redis if they don’t exist yet
        await db.sadd("users", user.id);
      }
      return token;
    },
    async session({ session, token }) {
      // Attach token info to session object
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};
