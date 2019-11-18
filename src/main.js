const express = require("express")
const http = require("http")
const config = require("../configs/main-config.json")

const server = express()
const bodyParser = require('body-parser')

//<--------- ROUTES --------->
server.use(bodyParser.json({type:() => {return true}, limit: "16mb" }))
server.use(require("./routes/middleware/rateLimit").readRequest)

server.get("/api/getDayStatistics/:apitoken/:id", require("./routes/api/getDayStatistics").readRequest)
server.get("/api/validToken/:apitoken/:token", require("./routes/api/validTokenRoute").readRequest)
server.get("/api/getUserByPassword/:apitoken/:name/:pass", require("./routes/api/getUserByPassword").readRequest)
server.get("/api/setUserPassword/:apitoken/:token/:pass", require("./routes/api/setUserPassword").readRequest)
server.get("/api/setAccountType/:apitoken/:token/:type", require("./routes/api/setAccountType").readRequest)
server.get("/api/updateUserModels/:apitoken/:name/:cape/:elytra/:ears", require("./routes/api/updateUserModels").readRequest)
server.post("/api/setGuildColor/:apitoken", require("./routes/api/setGuildColor").readRequest)

server.get("/requestEncryption", require("./routes/requestEncryption").readRequest)
server.post("/responseEncryption", require("./routes/responseEncryption").readRequest)
server.post("/uploadConfig/:token", require("./routes/uploadConfig").readRequest)
server.post("/updateDiscord/:token", require("./routes/updateDiscord").readRequest)

var bulkRoutes = {
    itemList: {
        route: "/cache/getItemList",
        module: require("./routes/cache/getItemList")
    },
    mapLocations: {
        route: "/cache/getMapLocations",
        module: require("./routes/cache/getMapLocations")
    },
    territoryList: {
        route: "/cache/getTerritoryList",
        module: require("./routes/cache/getTerritoryList")
    },
    userModels: {
        route: "/getUserModels",
        module: require("./routes/getUserModelsRoute")
    },
    userRoles: {
        route: "/getUsersRoles",
        module: require("./routes/getUsersRolesRoute")
    }
}

require("./routes/bulk")(server, bulkRoutes)

server.use((req, res) => {res.status(200).redirect(config.redirectUrl)})

//<--------- STARTING WEBSERVER --------->
function startWebServer() {
    http.createServer(server).listen(config.port)

    require("./core/managers/userManager").getAllProfiles()
    require("./core/managers/dayManager").getAllProfiles()
    require("./core/managers/wynnData").cacheItems()
    require("./core/managers/wynnData").cacheMapLocations()

    console.log("\x1b[32m%s\x1b[0m", ">>> WebServer listening on " + config.port)
    console.log(" ")

    require("./core/managers/wynnData").getTerritoryCache()
}

//<--------- START RETHINK DATABASE --------->
const RethinkDatabase = require("./core/instances/rdb")
const rethink = new RethinkDatabase(config.rethink.ip, config.rethink.port, config.rethink.database, config.rethink.username, config.rethink.password)
rethink.openConnection()

rethink.on("connectionSuccess", () => {
    console.log("\x1b[33m%s\x1b[0m", "> Connected successfuly with the database. Creating tables...")

    //tables being created
    rethink.createTable("users", () => { // <--- users table
        rethink.createTable("analytics_days", () => { // <--- analytics_days table
            console.log("\x1b[33m%s\x1b[0m", "> Tables created correctly. Starting the WebServer...")
            startWebServer()
        })
    })

})

//<--------- PRINT LOGO --------->
require("./core/instances/logo").printLogo()

//<--------- EXPORTS EVERYTHING --------->
module.exports.config = config
module.exports.rethink = rethink