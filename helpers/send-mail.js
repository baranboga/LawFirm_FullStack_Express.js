const nodemailer = require("nodemailer");
const config = require("../config");

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.email.username,
        pass: config.email.password
    },
    tls: {
        rejectUnauthorized: false,
    }
});

module.exports = transporter;