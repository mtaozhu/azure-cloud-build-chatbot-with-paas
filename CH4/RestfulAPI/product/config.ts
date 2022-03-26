export const config = {
    endpoint:"<Your Azure Cosmos account URI>",
    key: "<Your Azure Cosmos account key>",
    databaseId: "DemoDatabase1",
    containerId: "Container1",
    partitionKey: { kind: "Hash", paths: ["/brand"] }
};