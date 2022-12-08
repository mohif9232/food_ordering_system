
let { sequelize, QueryTypes } = require("../init/dbconnect")
let jwt = require("jsonwebtoken")
let { secretKey } = require("../config/constant")

function auth(param) {
    return async function (request, response, next) {
        if (!request.headers || !request.headers.token) {
            return response.status(401).send("token not found")
        }
        let token = request.headers.token;
        let verifyToken = '';
        try {
            verifyToken = jwt.verify(token, secretKey)
        } catch (error) {
            if (!verifyToken || verifyToken.error) {
                return response.status(401).send({ error: "Unauthorized person" })
            }
        }

        let result = await sequelize.query("SELECT user.id,user.name, permission.permission as permission FROM user LEFT JOIN user_permission ON user.id = user_permission.user_id LEFT JOIN permission ON permission.id = user_permission.permission_id WHERE user.id=:key", {
            replacements: { key: verifyToken.id },
            type: QueryTypes.SELECT
        }).catch((err) => {
            return { error: err }
        })

        if (!result || (result && result.error)) {
            return { error: "User Not found" }
        }
        let uPer = {};
        for (let data of result) {
            uPer[data.permission] = 1
        }

        if (param && !uPer[param]) {
            return response.status(401).send("Access Denied")
        }
        request.userData = { id: verifyToken.id, name: result[0].name, permission: uPer }
        next();
    }
}

module.exports = auth