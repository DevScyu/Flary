const ITEM_URL = "https://api.wynncraft.com/public_api.php?action=itemDB&category=all"
const TERRITORY_URL = "https://api.wynncraft.com/public_api.php?action=territoryList"
const SCYU_TERRITORIES = "https://raw.githubusercontent.com/DevScyu/Wynn/master/territories.json"
const GUILD_INFO = "https://api.wynncraft.com/public_api.php?action=guildStats&command="

const https = require("https")
const fs = require("fs")

var cachedItems = {"items":[]}

var territoryCache = {}
var scyuTerritories = null
var lastTerritoryCache = 0

var guildList = null
var guildColors = null

function cacheItems() {
    https.get(ITEM_URL, (resp) => {
        var data = ""

        resp.on("data", (chunk) => {
             data += chunk
        })

        resp.on("end", () => {
            if(data == "") return

            this.cachedItems = JSON.parse(data)
        })
    })
}

function getTerritoryCache() {
    var time = new Date().getTime()

    if(time - lastTerritoryCache >= 30000) {
        lastTerritoryCache = time
        updateTerritories()
    }

    return territoryCache
}

function setGuildColor(guild, color) {
    guildColors[guild] = color

    fs.writeFileSync("data/guild_colors.json", JSON.stringify(guildColors))
}

function getGuildColor(guild) {
   if(guild === null) return null
   
   if(guildColors === null) {
       if(fs.existsSync("data/guild_colors.json")) {
           var rawData = fs.readFileSync("data/guild_colors.json")
           guildColors = JSON.parse(rawData)
       }else{
           guildColors = {}

           fs.writeFileSync("data/guild_colors.json", JSON.stringify(guildColors))
       }
   }

   return guildColors[guild] == undefined ? null : guildColors[guild]
}

function getGuildPrefix(guild) {
    if(guild === null) return null

    if(guildList === null) {
        if(fs.existsSync("data/guilds.json")) {
            var rawData = fs.readFileSync("data/guilds.json")
            guildList = JSON.parse(rawData)
        }else{
            guildList = {}

            fs.writeFileSync("data/guilds.json", JSON.stringify(guildList))
        }
    }

    var result = guildList[guild]
    if(result === undefined) {
        https.get(GUILD_INFO + guild, (resp) => {
            var data = ""

            resp.on("data", (chunk) => {
                data += chunk
            })

            resp.on("end", () => {
                if(data == "") return

                guildList[guild] = JSON.parse(data)["prefix"]

                fs.writeFileSync("data/guilds.json", JSON.stringify(guildList))
            })
        })
    }

    if(result === undefined) return null
    return result
}

function updateTerritories() {
    if(scyuTerritories === null) {
        https.get(SCYU_TERRITORIES, (resp) => {
            var data = ""

            resp.on("data", (chunk) => {
                data += chunk
            })

            resp.on("end", () => {
                if(data == "") return

                scyuTerritories = JSON.parse(data)
                getWynnTerritories()
            })
        })
    }else { getWynnTerritories() }

    var wynnTerritories = {}

    function getWynnTerritories() {
        https.get(TERRITORY_URL, (resp) => {
            var data = ""

            resp.on("data", (chunk) => {
                data += chunk
            })

            resp.on("end", () => {
                if(data == "") return

                wynnTerritories = JSON.parse(data)
                if(wynnTerritories["territories"] === undefined) return

                mergeData()
            })
        })
    }

    function mergeData() {
        if(wynnTerritories["territories"] === undefined) return

        var finalData = {}

        for(var index in scyuTerritories) {
            var scyu = scyuTerritories[index]

            var wynn = wynnTerritories["territories"][scyu["name"]]
            if(typeof wynn === "undefined") return

            var start = scyu["start"].split(",")
            var end = scyu["end"].split(",")

            var location = {
                "startX": parseInt(start[0]),
                "startY": parseInt(start[1]),
                "endX": parseInt(end[0]),
                "endY": parseInt(end[1]),
                "spawn": scyu["spawnLocation"]
            }

            var final = {
                "territory": wynn["territory"],
                "guild": wynn["guild"],
                "guildPrefix": getGuildPrefix(wynn["guild"]),
                "guildColor": getGuildColor(wynn["guild"]),
                "acquired": wynn["acquired"],
                "attacker": wynn["attacker"],
                "level": scyu["level"],
                "location": location
            }

            finalData[wynn["territory"]] = final
        }

        territoryCache = {"territories": finalData}
    }
}

module.exports.cacheItems = cacheItems
module.exports.getTerritoryCache = getTerritoryCache
module.exports.cachedItems = cachedItems
module.exports.setGuildColor = setGuildColor