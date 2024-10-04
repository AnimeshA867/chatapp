import bcrypt from "bcryptjs";

import { fetchRedis } from "@/app/helper/redis";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const userExists = await fetchRedis(`get`, `user:email:${email}`);
    if (userExists) {
      return new Response("User Already Exists", { status: 400 });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = nanoid();
      const user = await db.set(`user:credentials:${email}`, {
        name: name,
        email: email,
        password: hashedPassword,
        id: id,
      });

      await db.set(`user:${id}`, {
        email: email,
        id: id,
        image: null,
        name: name,
      });
      await db.set(`user:email:${email}`, id);
      await db.sadd(`users`, id);
      return new Response("User Successfully Added.", { status: 201 });
    }
  } catch (error) {
    return new Response("Error ", { status: 400 });
  }
}
