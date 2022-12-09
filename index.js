let express = require("express");
let app = express();
let route = require("./route/user")
let { port } = require("./config/constant")
let { logger } = require("./init/winston")


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
logger.error("Error")

app.use("/api/v1/user", route)

app.listen(port, () => {
    console.log(`Connected To Server on ${port}`)
})