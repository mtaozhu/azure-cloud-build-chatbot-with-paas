import { delay, ServiceBusClient, MessageHandlers, ServiceBusReceivedMessage, ProcessErrorArgs } from '@azure/service-bus';
import * as Config from './config';

const receive = async () => {
    // create a Service Bus client using the connection string to the Service Bus namespace
    const sbClient = new ServiceBusClient(Config.connectionString);

    // createReceiver() can also be used to create a receiver for a subscription.
    const receiver = sbClient.createReceiver(Config.queueName);

    // function to handle messages
    const myMessageHandler = async (message: ServiceBusReceivedMessage) => {
        console.log(`Received message: ${message.body}`);
    };

    // function to handle any errors
    const myErrorHandler = async (err: ProcessErrorArgs) => {
        console.log(err);
    };

    const messageHandlers = {
        processMessage: myMessageHandler,
        processError: myErrorHandler
    } as MessageHandlers;

    // subscribe and specify the message and error handlers
    receiver.subscribe(messageHandlers);

    // Waiting long enough before closing the sender to send messages
    await delay(20000);
    await receiver.close();
    await sbClient.close();
}

// call the main function
receive().catch((err) => {
    console.log("Error occurred: ", err);
    process.exit(1);
});