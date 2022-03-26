const redis = require("redis");
const bluebird = require("bluebird");
import { REDIS } from '../Config'

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const cacheConnection = redis.createClient(6380, REDIS.redisCacheHostName,
    { auth_pass: REDIS.redisCacheKey, tls: { servername: REDIS.redisCacheHostName } });

export const setData = async (key: string, data: any) => {
    console.log("\nCache command: SET Message");
    cacheConnection.setAsync(key, JSON.stringify(data));
}

export const getData = async (key: string) => {
    console.log("\nCache command: GET Message");
    const product = await cacheConnection.getAsync(key)
    return JSON.parse(product)
}
