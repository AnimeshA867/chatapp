const upstashRedisRestUrl = process.env.UPSTASH_REDIS_URL;
const authToken=process.env.UPSTASH_REDIS_TOKEN;


type Commands = 'zrange'|'sismember'| 'get' | 'smembers'

export async function fetchRedis(command:Commands,...args:(string|number)[]){

    const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join('/')}`

          const response= await fetch(commandUrl,{
            headers:{
                Authorization:`Bearer ${process.env.UPSTASH_REDIS_TOKEN}`
            },
            cache:'no-store',
        })
    if(!response.ok){
        throw new Error(`Error executing Redis Command: ${response.statusText}`)
    }

    const data = await response.json();
    return data.result;
}
