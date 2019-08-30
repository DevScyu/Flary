const userManager = require("../core/managers/userManager")

function createResponse() {
    var capes = []
    var elytra = []
    var ears = []

    userManager.userProfiles.forEach(c => {
        if(c.getActiveModels().capeActive) capes.push(c.getId())
        if(c.getActiveModels().elytraActive) elytra.push(c.getId())
        if(c.getActiveModels().earsActive) ears.push(c.getId())
    })

    return {
        capeActive: capes,
        elytraActive: elytra,
        earsActive: ears
    }
}

function readRequest(req, res) {
    var json = createResponse()

    json.request = req.requestJson

    res.status(200).send(json)
}

module.exports.createResponse = createResponse
module.exports.readRequest = readRequest
