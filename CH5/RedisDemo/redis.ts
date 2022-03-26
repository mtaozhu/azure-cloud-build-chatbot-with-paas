const redis = require("redis");
const bluebird = require("bluebird");

const REDISCACHEHOSTNAME = '<YOUR_AZURE_REDIS_REDISCACHEHOSTNAME>'
const REDISCACHEKEY = '<YOUR_AZURE_REDIS_REDISCACHEKEY>'


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

async function testCache() {
    // Connect to the Azure Cache for Redis over the TLS port using the key.
    const cacheConnection = redis.createClient(6380, REDISCACHEHOSTNAME,
        { auth_pass: REDISCACHEKEY, tls: { servername: REDISCACHEHOSTNAME } });

        console.log(cacheConnection)
    // Perform cache operations using the cache connection object...
    // Simple PING command
    console.log("\nCache command: PING");
    console.log("Cache response : " + await cacheConnection.pingAsync());

    // Simple get and put of integral data types into the cache
    console.log("\nCache command: GET Message");
    console.log("Cache response : " + await cacheConnection.getAsync("Message"));

    console.log("\nCache command: SET Message");
    console.log("Cache response : " + await cacheConnection.setAsync("Message",
        "Hello! The cache is working from Node.js!"));

    // Demonstrate "SET Message" executed as expected...
    console.log("\nCache command: GET Message");
    console.log("Cache response : " + await cacheConnection.getAsync("Message"));

    // Get the client list, useful to see if connection list is growing...
    console.log("\nCache command: CLIENT LIST");
    console.log("Cache response : " + await cacheConnection.clientAsync("LIST"));

    cacheConnection.clent
}

testCache();