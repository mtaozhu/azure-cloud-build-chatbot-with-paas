import { AzureFunction, Context } from "@azure/functions"
import * as lineService from '../LineWebhook/Chatbot/LineService'

const serviceBusQueueTrigger: AzureFunction = async function (context: Context, mySbMsg: any): Promise<void> {
    context.log('ServiceBus queue trigger function processed message', mySbMsg);
    
    const text = mySbMsg.text.replace(/(<([^>]+)>)/ig,"")
    const textMessage = lineService.toTextMessage(text);
    await lineService.pushMessage(mySbMsg.userId, textMessage);
};

export default serviceBusQueueTrigger;
