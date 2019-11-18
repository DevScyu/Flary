const https = require("https")

const config = require("../../../configs/main-config.json")["webhook"]

const webhookUrl =  {
    hostname: "discordapp.com",
    path: config["url"],
    method: "POST"
}

async function publishMessage(title, message) {
    var webhookData = {
        "username": config["username"],
        "avatar_url": config["avatar"],
        "embeds": [
            {
                "title": title,
                "description": message,
                "footer": {
                    "text": "Flary - Wynntils Account Manager"
                }
            }
        ]
    }

    webhookUrl["headers"] = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(webhookData))
    }

    var request = https.request(webhookUrl)
    request.write(JSON.stringify(webhookData))
    await request.end()
}

module.exports.publishMessage = publishMessage