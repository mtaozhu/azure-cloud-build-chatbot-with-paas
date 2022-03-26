import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { WebhookEvent, validateSignature } from "@line/bot-sdk"

import { LINE } from "./Config"
import * as dispatcher from './chatbot/Dispatcher'
import * as errorHandle from './Chatbot/ErrorHandle'

const intercept = require('azure-function-log-intercept');

const lineWebhook: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    intercept(context);// console.log works now!

    const signature: string = req.headers["x-line-signature"]
    if (validateSignature(JSON.stringify(req.body), LINE.channelSecret, signature)) {
        const events = req.body.events as Array<WebhookEvent>
        
        for (const event of events) {
            await dispatcher.eventDispatcher(event).catch(async (err) => {
                const errorLog = {
                    userId: event.source.userId,
                    code: err.code,
                    message: err.message,
                    time: new Date(event.timestamp).toISOString()
                }
                console.log(JSON.stringify(errorLog))
                await errorHandle.alert(errorLog);

            })
        }
    }

    context.res = { status: 200, body: 'ok' };
};

export default lineWebhook;
