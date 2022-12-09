let winston = require("winston");

let logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user service" },
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
        new winston.transports.Console({ level: "error" })
    ]
});

module.exports = { logger }