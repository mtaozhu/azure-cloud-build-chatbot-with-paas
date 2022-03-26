import axios from "axios";
import { incomingWebhookURL } from '../Config'

export const alert = async (errorLog: any) => {
    const errorMessage = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "summary": "範例商店系統錯誤通知",
        "sections": [
            {
                "activityTitle": "範例商店系統錯誤通知",
                "activityImage": "",
                "facts": [
                    {
                        "name": "使用者userID",
                        "value": errorLog.userId
                    },
                    {
                        "name": "錯誤代碼",
                        "value": errorLog.code
                    },
                    {
                        "name": "錯誤訊息",
                        "value": errorLog.message
                    },
                    {
                        "name": "發生時間",
                        "value": errorLog.time
                    }
                ]
            }
        ]
    }

    return axios.post(incomingWebhookURL, errorMessage)
}
