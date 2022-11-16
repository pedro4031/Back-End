const { createTransport } = require("nodemailer");
const config = require("./config");
const { logger, loggerE } = require("./loger");

const transporter = createTransport({
	service: "gmail",
	port: 587,
	auth: {
		user: config.MAIL_NOTIFICACIONES,
		pass: config.CONTRASEÑA_MAIL,
	},
});

async function sendMail(asunto, cuerpo) {
	const mailOptions = {
		from: "Notificaciones Handlebars",
		to: config.MAIL_NOTIFICACIONES,
		subject: asunto,
		html: cuerpo,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		logger.info("mail enviado. " + info);
	} catch (err) {
		loggerE.error("no se envio el mail. " + err);
	}
}

const accountSid = config.SID;
const authToken = config.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

function sendWpp(destino, cuerpo) {
	client.messages
		.create({
			body: cuerpo,
			from: "whatsapp:+14155238886",
			to: `whatsapp:+${destino}`,
		})
		.then((message) => logger.info("Mensaje de whatsapp enviado." + message.sid))
		.done();
}

module.exports = { sendMail, sendWpp };
