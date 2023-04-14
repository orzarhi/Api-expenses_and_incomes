const nodemailer = require("nodemailer");

exports.sendMail = (mailTo, url, text) => {
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
		subject: "הוצאות😨 vs הכנסות💸",
		html: `<div style="max-width: 700px; margin: auto; border: 10px solid #ddd; padding: 50px 20px;font-size: 110%; ">
        <h5 style="text-align:center; text-transform: uppercase;color: teal;">נא לאמת את המייל, על מנת שנוכל לגלות לאן הכסף נעלם 😅</h5>
        <a href=${url} style="background:#9d174dcc;text-decoration: none;color: white; padding: 10px 20px; margin: 10px 0;display: inline-block">${text}</a>  
		
        </div>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) return error;
		return info;
	});
};
{
	/* <p>אם הכפתור לא עובד מסיבה כלשהי, אפשר גם ללחוץ על הלינק למטה</p>        
        <div>${url}</div>  */
}
