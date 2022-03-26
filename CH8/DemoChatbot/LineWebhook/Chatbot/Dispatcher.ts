import { WebhookEvent, EventMessage } from "@line/bot-sdk"
import * as lineService from "./LineService"
import * as workflow from "./Workflow"
import * as customVision from "./CustomVision"

export const eventDispatcher = async (event: WebhookEvent) => {

    let replyToken: string
    let userId: string
    let timestamp = event.timestamp;

    switch (event.type) {
        case "follow":
            const replyMessage = "歡迎加入範例商家，很高興為您服務"
            replyToken = event.replyToken
            userId = event.source.userId

            await workflow.createMember(userId, timestamp);

            const textMessage = lineService.toTextMessage(replyMessage)
            await lineService.replyMessage(replyToken, textMessage)
            break;

        case "message":
            const message: EventMessage = event.message
            replyToken = event.replyToken
            userId = event.source.userId
            await messageDispatcher(message, replyToken, userId)
            break

        default:
            break
    }
}

const messageDispatcher = async (message: EventMessage, replyToken: string, userId: string) => {
    switch (message.type) {
        case "text":
            const phrase = message.text
            await workflow.predictText(phrase, replyToken)
            break

        case "location":
            const GPS = {
                lat: message.latitude,
                lon: message.longitude
            }
            await workflow.findStore(GPS, replyToken)
            break

        case "image":
            const messageId = message.id
            let imageBuffer = await workflow.getImageContent(messageId)
            const tagName = await customVision.classifyImageByCustomVision(imageBuffer)

            console.log("TagName: ", tagName);
            await workflow.findProductByTag(tagName, replyToken);

        default:
            break
    }
}

