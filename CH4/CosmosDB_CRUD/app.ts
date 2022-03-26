import { config } from "./config"
import { CosmosClient } from "@azure/cosmos"
import * as dbConnection from "./dbConnection"

//  欲新增的新資料(Item)
const newItem = {
    id: "3",
    brand: "Porsche",
    name: "Taycan 4S",
    description: "4門4人座 | 滿電續航464KM",
    price: 4840000
}

async function doCRUD() {

    const client = new CosmosClient(
        {
            endpoint: config.endpoint,
            key: config.key
        }
    );

    const database = client.database(config.databaseId);
    const container = database.container(config.containerId);

    // Make sure Tasks database is already setup. If not, create it.
    await dbConnection.create(client, config.databaseId, config.containerId);

    try {
        console.log(`Querying container: Items`);

        // query to return all items
        const querySpec = {
            query: "SELECT * from c"
        };

        // read all items in the Items container
        const { resources: items } = await container.items
            .query(querySpec)
            .fetchAll();

        items.forEach(item => {
            console.log(`${item.id}: ${item.brand} ${item.name}`);
        });

        /** Create new item
         * newItem is defined at the top of this file
         */
        const createdItem = await container.items.create(newItem).then(data => {
            if (data.resource) {
                const item = data.resource;
                console.log(`\r\nCreated new item ${item.id} - ${item.brand} ${item.name}\r\n`);
                return item;
            }
        });

        /** Update item
         * Pull the id and partition key value from the newly created item.
         * Update the isComplete field to true.
         */

        //  欲更新的資料(Item)
        const updateItem = {
            id: "3",
            brand: "Porsche",
            name: "Taycan 4S",
            description: "4門4人座 | 滿電續航464KM",
            price: 4930000
        }

        const updatedItem = await container
        .item(updateItem.id, updateItem.brand).replace(updateItem).then(data => {
                if (data.resource) {
                    const item = data.resource;
                    console.log(`Updated item: ${item.id} - ${item.brand} ${item.name}`);
                    console.log(`Updated price to ${item.price}\r\n`);
                    return item;
                }
            });

        /**
         * Delete item
         * Pass the id and partition key value to delete the item
         */
        await container.item(newItem.id, newItem.brand).delete().then(data => {
            console.log(`Deleted item with id: ${newItem.id}`);
        });

    } catch (e: any) {
        console.log(e.message);
    }
}

doCRUD();