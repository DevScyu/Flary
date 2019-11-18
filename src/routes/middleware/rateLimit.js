const main = require("../../main")
const dayManager = require("../../core/managers/dayManager")

const webhook = require("../../core/managers/webhookManager")

var rateLimits = {}

function readRequest(req, res, next) {
    let ip = req.headers["x-forwarded-for"]
    if(ip == null) ip = "localhost"

    //this sets the requestJson data
    const time = new Date().getTime()
    req.requestJson = {"ipAddress":ip, "timestamp" : time}

    //global ratelimits
    /*if(isRateLimited("global", main.config.ratelimit.global, time)) {
        res.status(429).send({"error": "You're being ratelimited!"})
        dayManager.getCurrentDay().updateDdos()
        return
    }*/

    //user ratelimits below
    if(isRateLimited(ip, main.config.ratelimit.user, time, req.url)) {
        res.status(429).send({"error": "You're being ratelimited!"})
        return
    }

    if(req.url.indexOf("/api") > -1) {
        dayManager.getCurrentDay().updateApiRequests()
    }
    
    dayManager.getCurrentDay().updateDailyRequests()
    next()
}

function isRateLimited(address, limit, time, url) {
    for(i in main.config.ratelimit.exceptions) {
        if(main.config.ratelimit.exceptions[i] === address) {
            return false
        }
    }

    if(!rateLimits[address]) { // <--- check if contains
        rateLimits[address] = {"amount":1, "lastCall": time, "rateLimited": false}

        return false
    }

    if(rateLimits[address].rateLimited) { // <--- check if it is ratelimited
        if(time - rateLimits[address].lastCall <= 600000) {
            return true
        }
        rateLimits[address].rateLimited = false
    }

    if(time - rateLimits[address].lastCall >= 600000) { // <---- check if the ratelimit expired
        rateLimits[address].amount = 0
    }

    rateLimits[address].amount += 1

    if(rateLimits[address].amount > limit) { // <--- checks if the ratelimit was exceeded
        rateLimits[address].rateLimited = true

        console.log("\x1b[31m%s\x1b[0m", `[RTLM] RateLimit ----> The IP ${address} was RateLimited for 10 minutes`)
        dayManager.getCurrentDay().updateDailyRatelimits()

        webhook.publishMessage(":fire: An user was ratelimited", `The following IP \`\`${address}\`\` was ratelimited\nRoute \`\`${url}\`\``)
        return true
    }
    
    rateLimits[address].lastCall = time
    return false
}

module.exports.readRequest = readRequest