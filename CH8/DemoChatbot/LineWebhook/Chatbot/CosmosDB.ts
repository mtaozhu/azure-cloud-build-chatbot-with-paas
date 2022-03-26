import { CosmosClient } from "@azure/cosmos"
import { COSMOS } from "../Config"
import { Member } from "../Model/Member";
import { Product } from "../Model/Product";
import * as redisCache from './RedisCache'

const client = new CosmosClient(
    {
        endpoint: COSMOS.endpoint,
        key: COSMOS.key
    }
);

const database = client.database(COSMOS.databaseId);
const memberContainer = database.container(COSMOS.memberContainer.containerId);
const productContainer = database.container(COSMOS.productContainer.containerId);
const storeContainer = database.container(COSMOS.storeContainer.containerId);

export const createMember = async (member: Member): Promise<any> => {
    return await memberContainer.items.create(member).then(data => {
        if (data.resource) {
            const item = data.resource;
            console.log(`\r\nCreated new item ${item.userId} - ${item.displayName}\r\n`);
        }
    });
}

export const getMembers = async (): Promise<any> => {
    const querySpec = {
        query: "SELECT * from c"
    };

    const { resources: items } = await memberContainer.items
        .query(querySpec)
        .fetchAll();
    items.forEach(item => {
        console.log(`${item.userId}: ${item.displayName}`);
    });
    return items;
}

export const getProductByName = async (name: string): Promise<any> => {
    let products = [] as Array<Product>
    let cacheKey = `ProductName:${name}`;

    const querySpec = {
        query: `SELECT * from c WHERE c.name like '%${name}%'`
    };

    if (await redisCache.getData(cacheKey)) {
        products = await redisCache.getData(cacheKey)
    } else {
        const { resources: items } = await productContainer.items
            .query(querySpec)
            .fetchAll();

        items.forEach(item => {
            products.push(item);
            console.log(`${item.id}: ${item.brand} ${item.name}`);
        });

        redisCache.setData(cacheKey, items)
    }
    return products;
}

export const getProductsByLabel = async (tagName: string): Promise<any> => {

    const querySpec = {
        query: `SELECT * from c WHERE c.label = '${tagName}'`
    };

    const { resources: items } = await productContainer.items
        .query(querySpec)
        .fetchAll();

    items.forEach(item => {
        console.log(`${item.id}: ${item.brand} ${item.name}`);
    });

    return items;
}

export const getStores = async (): Promise<any> => {

    const querySpec = {
        query: "SELECT * from c"
    };

    const { resources: items } = await storeContainer.items
        .query(querySpec)
        .fetchAll();
    items.forEach(item => {
        console.log(`${item.id}: ${item.brand} ${item.name}`);
        redisCache.setData(item.id, item)
    });
    return items;
}
