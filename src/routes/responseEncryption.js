const fakeAuth = require("../core/instances/fakeAuth")
const userManager = require("../core/managers/userManager")
const dayManager = require("../core/managers/dayManager")
const wynnData = require("../core/managers/wynnData")

function readRequest(req, res) {
    if(!req.body || !req.body.username || !req.body.key || !req.body.version) {
        res.status(400).send({"error": "Bad Request, expecting parameters (username & key)"})
        return
    }

    fakeAuth.encryptionKeyResponse(req.body.username, req.body.key, (json) => {
        if(json.error) {
            res.status(200).send({"error": "The provided user is on offline mode!"})

            console.log("\x1b[31m%s\x1b[0m", `[POST] responseEncryption ----> Failed | The user ${req.body.username} is using offline mode!`)
            return
        }

        if(json.id == null) {
            console.log(json)
        }

        const profile = userManager.registerUser(json.id, json.name)
        profile.updateUserVersion(req.body.version, json.name)

        const token = profile.updateUserToken()
        var response = new Object()
        response.authtoken = token
        response.result = "success!"
        response.hashes = {
            "itemList": wynnData.itemCacheHash,
            "newItemList": wynnData.newItemCacheHash,
            "mapLocations": wynnData.mapCacheHash
        }
        response.configFiles = profile.getConfigFiles()
        response.request = req.requestJson

        res.status(200).send(JSON.stringify(response))

        dayManager.getCurrentDay().updateUniqueUsers(json.id, req.body.version)

        console.log("\x1b[36m%s\x1b[0m", `[POST] responseEncryption ----> Success | ${req.body.username} - ${req.body.version} - ${token}`)
    })

}

module.exports.readRequest = readRequest