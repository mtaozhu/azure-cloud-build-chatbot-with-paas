import * as lineService from "./LineService"
import * as nluService from "./NLUService"
import * as cosmosDB from "./CosmosDB"
import { Client, Message, Profile } from "@line/bot-sdk";

import { Member } from "../Model/Member";
import { Product } from "../Model/Product";
import { Store } from "../Model/Store";
import { LINE } from "../Config";

export const createMember = async (userId: string, timestamp: number) => {
    const profile = await lineService.getUserProfile(userId) as Profile;
    const member = new Member(profile, timestamp);
    await cosmosDB.createMember(member);
}

export const predictText = async (phrase: string, replyToken: string) => {

    let products = [] as Array<Product>

    const LUISPrediction = await nluService.languageUnderStanding(phrase)
    const topIntent = LUISPrediction.prediction.topIntent
    console.log(topIntent)

    switch (topIntent) {
        case "FindProducts":
            console.log(LUISPrediction.prediction.entities);
            const productEntity = LUISPrediction.prediction.entities.Product[0];
            console.log(productEntity.brand[0])

            if (productEntity.name[0]) {
                products = await cosmosDB.getProductByName(productEntity.name[0]) as Array<Product>;
            }

            if (products.length > 0) {
                const carouseMessage = lineService.toCarouselTemplateMessage(products);
                console.log(JSON.stringify(carouseMessage))
                await lineService.replyMessage(replyToken, carouseMessage)
            } else {
                const text = "很抱歉本店查無此商品、請確認商品總類再進行查詢。";
                const textMessage = lineService.toTextMessage(text);
                await lineService.replyMessage(replyToken, textMessage);
            }
            break;

        case "FindStore":
            const text = "請輸入您的座標位置，查詢周邊店家。";
            const textMessage = lineService.toTextMessage(text);
            await lineService.replyMessage(replyToken, textMessage);
            break

        default:
            const defaultText = "很抱歉本店無此服務。"
            const defaultMessage = lineService.toTextMessage(defaultText)
            await lineService.replyMessage(replyToken, defaultMessage)
            break
    }
}

export const findStore = async (GPS: any, replyToken: string) => {

    const message = [] as Message[];
    let storeItems = await cosmosDB.getStores() as Array<Store>;
    let nearStores = [] as Array<Store>;

    for (let store of storeItems) {
        const storeLongitude = store.longitude
        const storeLatitude = store.latitude

        let R = 6371 // Radius of the earth in km
        let dLon = (storeLongitude - GPS.lon) * (Math.PI / 180)
        let dLat = (storeLatitude - GPS.lat) * (Math.PI / 180)  // deg2rad below

        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((GPS.lat) * (Math.PI / 180)) * Math.cos((GPS.lat) * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)

        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        let d = R * c // Distance in km
        if (d < 0.8) {
            nearStores.push(store)
        }
    }

    if (nearStores.length > 0) {
        for (const store of nearStores) {
            const storeMessage = lineService.toStoreMessage(store)
            const locationMessage = lineService.toLocationMessage(store.name, store.address, store.latitude, store.longitude)
            message.push(storeMessage)
            message.push(locationMessage)
        }
    } else {
        const textMessage = lineService.toTextMessage("您的附近無店家!")
        message.push(textMessage)
    }

    return lineService.replyMessage(replyToken, message)
}

export const getImageContent = async (messageId: string): Promise<any> => {
    let chunks = [] as Array<any>
    let imageBuffer: ArrayBuffer

    const lineClient = new Client(LINE)

    await lineClient.getMessageContent(messageId).then(stream => {
        return new Promise<void>((resolve, reject) => {
            stream.on('data', (chunk) => {
                chunks.push(chunk)
            });
            stream.on('end', () => {
                imageBuffer = Buffer.concat(chunks)
                resolve();
            });
            stream.on('error', () => {
                reject()
            });
        })
    }).catch(err => console.log(err))

    return imageBuffer
}

export const findProductByTag = async (tagName: string, replyToken: string) => {
    const products = await cosmosDB.getProductsByLabel(tagName) as Array<Product>;
    console.log(products)

    if (products.length > 0) {
        const carouseMessage = lineService.toCarouselTemplateMessage(products);
        return lineService.replyMessage(replyToken, carouseMessage)
    } else {
        const text = "很抱歉本商店無此商品、你可以參考其他商品";
        const textMessage = lineService.toTextMessage(text);
        return lineService.replyMessage(replyToken, textMessage)
    }
}
