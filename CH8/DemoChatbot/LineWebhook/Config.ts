export const LINE = {
    channelSecret: "<YOUR_CHANNEL_SECRET>",
    channelAccessToken: "<YOUR_CHANNEL_ACCESS_TOKEN>"
}

export const COSMOS = {
    endpoint: "<YOUR_COSMOSDB_ENDPOINT>",
    key: "<YOUR_COSMOSDB_KEY>",
    databaseId: "<YOUR_COSMOSDB_DATABASEID>",
    productContainer: {
        containerId: "Container1",
        partitionKey: { kind: "Hash", paths: ["/brand"] }
    },
    storeContainer: {
        containerId: "Container2",
        partitionKey: { kind: "Hash", paths: ["/city"] }
    },
    memberContainer: {
        containerId: "Container3",
        partitionKey: { kind: "Hash", paths: ["/userId"] }
    }    
};

export const REDIS = {
    redisCacheHostName: "<YOUR_REDIS_CACHE_HOSTNAME>",
    redisCacheKey: "<YOUR_REDIS_CACHE_KEY>"
}

export const LUIS = {
    appId: "<LUIS_APPID>",
    authoringKey: "<LUIS_AUTHORING_KEY>",
    predictionResourceName: "<LUIS_PREDICTION_RESOURCE_NAME>"
}

export const CUSTOMVISION = {
    projectId: "<YOUR_CUSTOMVISION_PROJECTID>",
    key: "<YOUR_CUSTOMVISION_KEY>",
    endpoint: "<YOUR_CUSTOMVISION_ENDPOINT>"
}
