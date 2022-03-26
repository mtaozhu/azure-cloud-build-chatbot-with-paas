import { ServiceBusClient } from '@azure/service-bus';
import * as Config from './config';

const send = async () => {
    
    // create a Service Bus client using the connection string to the Service Bus namespace
    const sbClient = new ServiceBusClient(Config.connectionString);

    // createSender() can also be used to create a sender for a topic.
    const sender = sbClient.createSender(Config.queueName);

    try {
    
        // create a batch object
        let batch = await sender.createMessageBatch();

        for (let i = 0; i < Config.messages.length; i++) {
            console.log(`message to batch: ${JSON.stringify(Config.messages[i])}`)
            // try to add the message to the batch
			if (!batch.tryAddMessage(Config.messages[i])) {	

				await sender.sendMessages(batch);

				// then, create a new batch 
				batch = await sender.createMessageBatch();
			}
           
        }

        // Send the created batch of messages to the queue
        await sender.sendMessages(batch);
        console.log(`Sent a batch of messages to the queue: ${Config.queueName}`);

        // Close the sender
        await sender.close();

    } catch (err) {
        console.log("Error occurred: ", err);
        process.exit(1);
    } finally {
        await sbClient.close();
    }
}

// call the main function
send();