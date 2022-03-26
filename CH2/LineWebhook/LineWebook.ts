import { Client, middleware, WebhookEvent, Message, TextMessage, StickerMessage, LocationMessage, ImageMessage } from '@line/bot-sdk';
import express, { Request, Response } from 'express';

const config = {
    channelAccessToken: '<YOUR_CHANNEL_ACCESS_TOKEN>',
    channelSecret: '<YOUR_CHANNEL_SECRET>'
};

const client = new Client(config);
const app = express();

app.post('/lineWebhook', middleware(config), async (req: Request, res: Response) => {
    // webhook event objects
    const events = req.body.events as Array<WebhookEvent>
    for (const event of events) {
        await handleWebhookEvent(event);
    }
    res.status(200).end();
})

const handleWebhookEvent = async (event: WebhookEvent): Promise<any> => {
    console.log(event);
    if (event.type == "message") {
        let responseMessage: Message;

        switch (event.message.type) {
            case "text":
                responseMessage = toTextMessage(event.message.text);
                await replyMessage(event.replyToken, responseMessage);
                break;
            case "sticker":
                const packageId = event.message.packageId;
                const stickerId = event.message.stickerId;
                responseMessage = toStickerMessage(packageId, stickerId);
                await replyMessage(event.replyToken, responseMessage);
                break;
            case "image":
                responseMessage = toImageMessage();
                replyMessage(event.replyToken, responseMessage);
                break;
            case "location":
                const address = event.message.address;
                const lat = event.message.latitude;
                const long = event.message.longitude;
                responseMessage = toLocationMessage(address, lat, long);
                await replyMessage(event.replyToken, responseMessage);
                break;
            default:
                break;
        }
    }
}

const toTextMessage = (str: string): TextMessage => {
    return {
        "type": "text",
        "text": `您輸入的訊息是: ${str}`
    }
}

const toStickerMessage = (packageId: string, stickerId: string): StickerMessage => {
    return {
        "type": "sticker",
        "packageId": packageId,
        "stickerId": stickerId
    }
}

const toLocationMessage = (addr: string, lat: number, lon: number): LocationMessage => {
    return {
        "type": "location",
        "title": "my location",
        "address": addr,
        "latitude": lat,
        "longitude": lon
    }
}

const toImageMessage = (): ImageMessage => {
    return {
        "type": "image",
        "originalContentUrl": "https://i.imgur.com/XrSELBT.jpg",
        "previewImageUrl": "https://i.imgur.com/XrSELBT.jpg"
    }
}

const replyMessage = async (token: string, message: Message): Promise<any> => {
    return client.replyMessage(token, message);
}

app.listen(8080, () => {
    console.log(`Server running on port 8080`);
})