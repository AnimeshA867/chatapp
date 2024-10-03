import { fetchRedis } from "@/app/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req:Request){
    try{
        const body = await req.json();

        const {id:idToReject}= z.object({id:z.string()}).parse(body);

        const session = await getServerSession(authOptions)
        if(!session){
            return new Response("Unauthorized",{status:401})
        }

       

        const alreadyFriends = await fetchRedis('sismember',`user:${session.user.id}:friends`,idToReject);
        if(alreadyFriends){
            return new Response("Already friends",{status:400});
        }

        const hasIncomingRequests = await fetchRedis('sismember',`user:${session.user.id}:incoming_friend_requests`,idToReject);

        if(!hasIncomingRequests){
            return new Response("No such friend requests",{status:400});

        }

        await db.srem(`user:${session.user.id}:incoming_friend_requests`,idToReject);
        await db.srem(`user:${idToReject}:incoming_friend_requests`,session.user.id);
        return new Response("OK")
    }catch(error){
        if(error instanceof z.ZodError){
            return new Response("Unable to parse the data",{status:422});

        }
        return new Response("Error",{status:400})
    };
    
}