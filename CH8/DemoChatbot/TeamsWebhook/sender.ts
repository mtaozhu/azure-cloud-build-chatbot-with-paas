import { ServiceBusClient, ServiceBusMessage } from '@azure/service-bus';

export const connectionString = "<CONNECTION STRING TO NAMESPACE>";
export const queueName = "<QUEUE NAME>"

export const send = async (messages: ServiceBusMessage[]): Promise<any> => {

    const sbClient = new ServiceBusClient(connectionString);
    const sender = sbClient.createSender(queueName);

    try {

        let batch = await sender.createMessageBatch();

        for (let i = 0; i < messages.length; i++) {
            console.log(`message to batch: ${JSON.stringify(messages[i])}`)
            // try to add the message to the batch
            if (!batch.tryAddMessage(messages[i])) {
                await sender.sendMessages(batch);
                // then, create a new batch 
                batch = await sender.createMessageBatch();
            }
        }

        // Send the created batch of messages to the queue
        await sender.sendMessages(batch);
        console.log(`Sent a batch of messages to the queue: ${queueName}`);

        // Close the sender
        await sender.close();

    } catch (err) {
        console.log("Error occurred: ", err);
        process.exit(1);
    } finally {
        await sbClient.close();
    }
}