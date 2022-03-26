import { config } from "./config"
import { CosmosClient } from "@azure/cosmos"

/*
// This script ensures that the database is setup and populated correctly
*/
export const create = async (client: CosmosClient, databaseId: string, containerId: string) => {
    const partitionKey = config.partitionKey;

    /**
     * Create the database if it does not exist
     */
    const databaseRes = await client.databases.createIfNotExists({
        id: databaseId
    });
    console.log(`Created database:\n${databaseRes.database.id}\n`);

    /**
     * Create the container if it does not exist
     */
    const containerRes = await client
        .database(databaseId)
        .containers.createIfNotExists(
            { id: containerId, partitionKey },
            { offerThroughput: 400 }
        );

    console.log(`Created container:\n${containerRes.container.id}\n`);
}