// import { NextApiHandler } from "next";
import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

const handler: any = NextAuth(authOptions);
export { handler as GET, handler as POST };
