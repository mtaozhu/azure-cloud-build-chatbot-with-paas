import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ServiceBusMessage } from "@azure/service-bus";
import * as sender from './sender'
import * as cosmos from '../LineWebhook/Chatbot/CosmosDB'
import { Member } from "../LineWebhook/Model/Member";

const intercept = require('azure-function-log-intercept');

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    intercept(context);
    console.log("Send message to Queue: ", req.body.text);

    let serviceBusMessages = [] as ServiceBusMessage[];
    const members = await cosmos.getMembers() as Member[];
    
    for (let member of members) {
        const message = {
            body: {
                userId: member.userId,
                text: `${req.body.text}`
            }
        } as ServiceBusMessage
        serviceBusMessages.push(message)
    }

    await sender.send(serviceBusMessages)
    context.res = { status: 200, body: 'ok' };
};

export default httpTrigger;