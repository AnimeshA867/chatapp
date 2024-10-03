import { fetchRedis } from "@/app/helper/redis";
import { authOptions } from "@/lib/auth";
import { addFriendValidator } from "@/lib/validator/addFriendValidator";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
export async function POST(req:NextRequest){
    try{
        const body = await req.json();
        
        const {email:emailToAdd} = addFriendValidator.parse(body.email)

        const idToAdd = await fetchRedis('get',`user:email:${emailToAdd}`) as string;
        if(!idToAdd){
            return new Response('This person does not exist.', {status:400})
        }
        const session = await getServerSession(authOptions);

        if(!session){
            return new Response('Unauthorized',{status:401})
        }

        if(idToAdd === session.user.id){
            return new Response('You cannot add yourself as a friend.', {status:400})
        }

        //Check if user is already added.

        const isAlreadyAdded =await  fetchRedis('sismember',`user:${idToAdd}:incoming_friend_requests`,session.user.id) as 0 |1;

        if(isAlreadyAdded){
            return new Response('Already added this user',{status:400})
        }

        const isAlreadyFriends =await  fetchRedis('sismember',`user:${session.user.id}:friends`,session.user.id) as 0 |1;

        if(isAlreadyFriends){
            return new Response('Already your friend.',{status:400})
        }

        //Valid Friend request:4263eeda8f56

        db.sadd(`user:${idToAdd}:incoming_friend_requests`,session.user.id)

        return new Response('OK')
    }catch(error){
        if(error instanceof z.ZodError){
            return new Response('Invalid Request Payload',{status:422})
        }
        return new Response('Invalid Request',{status:400})
    }

}