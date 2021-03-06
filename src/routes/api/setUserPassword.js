const main = require("../../main")
const userManager = require("../../core/managers/userManager")
const up = require("../../core/profiles/userProfile")

const bcrypt = require("bcrypt")

function readRequest(req, res) {
    var valid = false
    for(i in main.config.apikeys) {
        if(main.config.apikeys[i] === req.params.apitoken) {
            valid = true;
            break;
        }
    }

    var response = new Object()

    if(!valid) {
        response.result = "Invalid API Key"
        response.request = req.requestJson
        res.status(200).send(response)
        return
    }

    var user = userManager.getUserProfileByToken(req.params.token)
    if(user == undefined) {
        response.result = "The provided user token is invalid"
        response.request = req.requestJson
        res.status(200).send(response)
        return
    }
    if(user.getAccountType() === up.AccountType.BANNED) {
        response.result = "The provided user is banned"
        response.request = req.requestJson
        res.status(200).send(response)
        return
    }

    var pass = req.params.pass
    if(pass.length < 8)  {
        response.result = "The provided password has less than 8 characters"
        response.request = req.requestJson
        res.status(200).send(response)
        return
    }
    pass = bcrypt.hashSync(pass, 12)

    user.updatePassword(pass)
    
    response.result = "success"
    response.request = req.requestJson
    res.status(200).send(response)
}

module.exports.readRequest = readRequest