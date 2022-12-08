let express = require("express");
let app = express();
let route = require("./route/user")
let { port } = require("./config/constant")


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/user", route)

app.listen(port, () => {
    console.log(`Connected To Server on ${port}`)
})