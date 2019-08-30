const userManager = require("../core/managers/userManager")
const up = require("../core/profiles/userProfile")

function createResponse() {
    var helpers = []
    var moderators = []
    var donators = []
    var contentTeam = []

    userManager.userProfiles.forEach(c => {
        if(c.getAccountType() === up.AccountType.HELPER) helpers.push(c.getId())
        else if(c.getAccountType() === up.AccountType.CONTENT_TEAM) contentTeam.push(c.getId())
        else if(c.getAccountType() === up.AccountType.MODERATOR) moderators.push(c.getId())
        else if(c.getAccountType() === up.AccountType.DONATOR) donators.push(c.getId())
    })

    return {
        normalUsers: [],
        donatorUsers: donators,
        contentTeamUsers: contentTeam,
        moderatorUsers: moderators,
        helperUsers: helpers
    }
}

function readRequest(req, res) {
    var json = createResponse()

    json.request = req.requestJson

    res.status(200).send(json)
}

module.exports.createResponse = createResponse
module.exports.readRequest = readRequest
