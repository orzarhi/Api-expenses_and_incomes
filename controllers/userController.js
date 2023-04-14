const jwt = require("jsonwebtoken");
const escape = require("escape-html");
const auth = require("../utils/auth");
const validation = require("../utils/validation");
const User = require("../models/User");
const { sendMail } = require("./sendMail");
const crypto = require("crypto");

exports.register = async (req, res) => {
	const fullName = escape(req.body.fullName);
	const email = escape(req.body.email);
	const password = escape(req.body.password);
	const confirmPassword = escape(req.body.confirmPassword);

	let user;
	try {
		if (!fullName || !password || !email || !confirmPassword) {
			return res.status(400).json({ message: "נא למלא את כל השדות." });
		}
		if (!validation.checkEmail(email)) {
			return res.status(400).json({ message: "מייל לא תקין." });
		}
		if (!validation.checkUsername(fullName)) {
			return res.status(400).json({
				message: "שם צריך להכיל מינימום 2 תווים.",
			});
		}
		if (!validation.checkPassword(password)) {
			return res
				.status(400)
				.json({ message: "סיסמא צריכה להכיל מינימום 7 תווים." });
		}
		if (password !== confirmPassword) {
			return res.status(400).json({ message: "הסיסמאות אינן תאומות." });
		}

		const checkFullName = validation.addSlashes(fullName);
		const checkPassword = validation.addSlashes(password);
		const checkEmail = validation.addSlashes(email);
		console.log("🚀 checkEmail:", checkEmail);

		const userName = await User.findOne({
			fullName: checkFullName,
		});

		if (userName) {
			return res.status(400).json({ message: "שם קיים במערכת." });
		}

		const userEmail = await User.findOne({ email: checkEmail });
		if (userEmail) {
			return res.status(400).json({ message: "מייל קיים במערכת." });
		}

		const passwordHash = await auth.hashPassword(checkPassword);

		user = new User({
			fullName: checkFullName,
			email: checkEmail,
			password: passwordHash,
			emailToken: crypto.randomBytes(64).toString("hex"),
		});

		const url = `${process.env.URL}/user/verify-email/${user.emailToken}`;
		sendMail(checkEmail, "ברוכים הבאים", url, "אמת את כתובת המייל");

		await user.save();
	} catch (err) {
		return res.status(401).json({ message: err.message });
	}
	if (!user) {
		return res.status(500).json({ message: "לא נוסף המשתמש." });
	}

	return res
		.status(201)
		.json({ message: "הרישום בוצע בהצלחה, נשלח אלייך מייל לאימות." });
};

exports.verifyEmail = async (req, res) => {
	try {
		const emailToken = escape(req.body.emailToken);

		if (!emailToken) {
			return res
				.status(404)
				.json({ message: "האימות נכשל, טוקן לא תקין" });
		}

		const checkEmailToken = validation.addSlashes(emailToken);
		let user = await User.findOne({ emailToken: checkEmailToken });

		if (!user) {
			return res.status(404).json({ message: "לא נמצא משתמש." });
		}

		await User.findByIdAndUpdate(user._id, {
			emailToken: null,
			verified: true,
		});

		const token = auth.createToken(user);
		return res.status(200).json({
			message: "האימות התבצע בהצלחה.",
			token,
			verified: user.verified,
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

exports.login = async (req, res) => {
	const email = escape(req.body.email);
	const password = escape(req.body.password);

	try {
		if (!email || !password) {
			return res.status(400).json({ message: "נא למלא את כל השדות." });
		}
		const checkEmail = validation.addSlashes(email);
		const checkPassword = validation.addSlashes(password);

		const user = await auth.login(checkEmail, checkPassword);

		if (!user) {
			return res
				.status(400)
				.json({ message: "שם משתמש או סיסמא שגויים." });
		}
		if (!user.verified) {
			return res.status(400).json({ message: "לא התבצע אימות." });
		}
		const token = auth.createToken(user);

		return res.status(200).json(token);
	} catch (err) {
		return res.status(401).json({ message: err });
	}
};
