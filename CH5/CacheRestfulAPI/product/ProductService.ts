import { config } from "./config"
import { Product } from "./Product";
import { CosmosClient } from "@azure/cosmos"
import * as Cache from './cache'
import { context } from "@azure/core-tracing";

const client = new CosmosClient(
    {
        endpoint: config.endpoint,
        key: config.key
    }
);

const database = client.database(config.databaseId);
const container = database.container(config.containerId);

/** Create new item*/
export const createProduct = async (product: Product): Promise<any> => {
    return await container.items.create(product).then(data => {
        if (data.resource) {
            const item = data.resource;
            console.log(`\r\nCreated new item ${item.id} - ${item.brand} ${item.name}\r\n`);
        }
    });
}

/** Read items in the Items container*/
export const readProduct = async (id: string): Promise<any> => {
    let queryString = "";

    if (id != null) {
        queryString = `SELECT * from c WHERE c.id = '${id}'`
    } else {
        queryString = "SELECT * from c"
    }

    const querySpec = {
        query: queryString
    };
   
    if (await Cache.getProduct(id)) {
        return Cache.getProduct(id)
    } else {
        const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();
        items.forEach(item => {
            console.log(`${item.id}: ${item.brand} ${item.name}`);
        });
        Cache.setProduct(id, items)
        return items;
    }   
}

/** Update item */
export const updateProduct = async (product: Product): Promise<any> => {
    return await container.item(product.id, product.brand).replace(product).then(data => {
        if (data.resource) {
            const item = data.resource;
            console.log(`Updated item: ${item.id} - ${item.brand} ${item.name}`);
            console.log(`Updated price to ${item.price}\r\n`);
        }
    });
}

/** Delete item */
export const deleteProduct = async (product: Product) => {
    return await container.item(product.id, product.brand).delete().then(data => {
        console.log(`Deleted item with id: ${product.id}`);
    });
}