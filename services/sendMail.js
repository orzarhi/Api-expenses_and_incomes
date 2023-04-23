const nodemailer = require("nodemailer");
const { htmlEmail } = require("../utils/htmlEmail");

exports.sendMail = (
	mailTo,
	url,
	action,
	subject = "",
	text = "",
	title = "",
	subTitle = ""
) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_AUTH,
			pass: process.env.PASSWORD_AUTH,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_AUTH,
		to: mailTo,
		subject: `${subject}`,
		html: htmlEmail(action, url, text, title, subTitle),
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) return error;
		return info;
	});
};
