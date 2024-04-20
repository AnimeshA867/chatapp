import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./db";


function getGoogleCredentials(){
    const clientId=process.env.GOOGLE_CLIENT_ID;
    const clientSecret= process.env.GOOGLE_CLIENT_SECRET;
    if(!clientId||clientId.length===0){
        throw new Error("Missing Google_CLIENT_ID");
    }
    if(!clientSecret||clientSecret.length===0){
        throw new Error("Missing Google_CLIENT_SECRET");
    }
    return {
        clientId,clientSecret
    }
}


export const authOptions:NextAuthOptions={
    adapter: UpstashRedisAdapter(db),
    session:{
        strategy:'jwt'
    },
    pages:{
        signIn:'/Login'
    },
    providers:[
        Google({
            clientId:getGoogleCredentials().clientId,
            clientSecret:getGoogleCredentials().clientSecret
        })
    ],
    callbacks:{
        async jwt ({token,user}){
            const dbUser = (await db.get(`user:${token.id}`)) as User | null ;

            if(!dbUser){
                token.id= user!.id;
                return token;
            }

            return {
                id:dbUser.id,
                name:dbUser.name,
                email:dbUser.email,
                image:dbUser.image,
            }
        },
        async session ({session, token}){
            if(token){
                session.user.id= token.id,
                session.user.email=token.email,
                session.user.image=token.picture,
                session.user.email=token.email
            }
            return session;
        },
        redirect(){
            return '/Dashboard'
        }
    }
}