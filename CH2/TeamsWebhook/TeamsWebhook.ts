import express from 'express'
import crypto from 'crypto'
import bodyParser from 'body-parser'

// 填入Step8 Teams 提供的Security token
// ex: "RQG3VpVBRtxSJ3lzLcmUNo1xZ+0eFOwLf5YI5kdnmsE="
const sharedSecret = "<Security token generated by Microsoft Teams>";
const bufSecret = Buffer.from(sharedSecret, "base64");
// Initialize express and define a port
const app = express()
const PORT = 8080
app.use(bodyParser.json())

app.post('/teamsWebhook', (req, res) => {

    const auth = req.headers['authorization'];
    const msgBuf = Buffer.from(JSON.stringify(req.body), 'utf8');
    
    // Calculate HMAC on the message we've received using the shared secret			
    const msgHash = "HMAC " + crypto.createHmac('sha256', bufSecret)
        .update(msgBuf).digest("base64");

    //判斷事件來源是否為我們建立的Teams團隊
    if (auth == msgHash) {
        const textMessage = {
            "type": "message",
            "text": `您輸入的訊息是${req.body.text}`
        }
        res.status(200).send(textMessage)
    } else {
        const errorMessage = {
            "type": "message",
            "text": "Error: message sender cannot be authenticated."
        }
        res.status(400).send(errorMessage);
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})