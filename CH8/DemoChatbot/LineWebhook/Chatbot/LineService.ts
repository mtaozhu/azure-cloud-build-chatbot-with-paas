import { LINE } from "../Config"
import { Client, LocationMessage, Message, TextMessage, TemplateMessage } from "@line/bot-sdk"
import { Store } from "../Model/Store"

export const getUserProfile = async (userId: string) : Promise<any> => {
    const client = new Client(LINE)
    return client.getProfile(userId)
}

export const replyMessage = async (replyToken: string, message: Message | Message[]): Promise<any> => {
    const client = new Client(LINE)
    return client.replyMessage(replyToken, message)
}

export const pushMessage = async (userId: string, message: Message | Message[]): Promise<any> => {
    const client = new Client(LINE)
    return client.pushMessage(userId, message)
}

export const toTextMessage = (text: string): TextMessage => {
    return {
        type: "text",
        text: text
    }
}

export const toLocationMessage = (title: string, address: string, lat: number, long: number): LocationMessage => {
    return {
        "type": "location",
        "title": title,
        "address": address,
        "latitude": lat,
        "longitude": long
    }
}

export const toCarouselTemplateMessage = (arr: Array<any>): TemplateMessage => {

    const columns = [] as Array<any>;

    for (let val of arr) {
        const column = {
            "thumbnailImageUrl": `${val.imageUri}`,
            "imageBackgroundColor": "#FFFFFF",
            "title": `${val.brand}${val.name}`,
            "text": `${val.description}`,
            "actions": [
                {
                    "type": "uri",
                    "label": "查看更多",
                    "uri": "https://xxx.xxx.xxx"
                },
                {
                    "type": "postback",
                    "label": "直接購買",
                    "data": `${val.id}`
                }
            ]
        }
        columns.push(column);
    }
    return {
        "type": "template",
        "altText": "this is a carousel template",
        "template": {
            "type": "carousel",
            "columns": columns,
            "imageAspectRatio": "rectangle",
            "imageSize": "cover"
        }
    }
}

export function toStoreMessage(nearStore: Store) {
    const storeMessage = 
        `城市: ${nearStore.city}\n` +
        `地址: ${nearStore.address}\n` +
        `店名: ${nearStore.name}\n` +
        `電話: ${nearStore.phone}`
    
    return toTextMessage(storeMessage)
}
