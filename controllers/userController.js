const jwt = require("jsonwebtoken");
const escape = require("escape-html");
const auth = require("../utils/auth");
const validation = require("../utils/validation");
const User = require("../models/User");
const { sendMail } = require("../services/sendMail");
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

		const url = `${process.env.URL_CLIENT}/user/verify-email/${user.emailToken}`;
		sendMail(
			checkEmail,
			url,
			"register",
			"הוצאות😨 vs הכנסות💸",
			"אמת את כתובת המייל",
			"נא לאמת את המייל, על מנת שנוכל לגלות לאן הכסף נעלם"
		);

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
				.json({ message: "האימות נכשל, נא לסנות שוב." });
		}

		const checkEmailToken = validation.addSlashes(emailToken);

		let user = await User.findOne({ emailToken: checkEmailToken });

		if (user === null) {
			return res.status(404).json({ message: "האימות כבר בוצע." });
		}

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

		const userEmail = await User.findOne({ email: checkEmail });
		if (!userEmail) {
			return res.status(400).json({ message: "משתמש לא קיים." });
		}

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

exports.forgotPassword = async (req, res) => {
	const email = escape(req.body.email);
	const forgotPasswordToken = crypto.randomBytes(64).toString("hex");

	if (!email) {
		return res.status(400).json({ message: "נא למלא את השדה." });
	}
	const checkEmail = validation.addSlashes(email);

	const userEmail = await User.findOne({ email: checkEmail });
	if (!userEmail) {
		return res.status(400).json({ message: "משתמש לא קיים." });
	}

	const codeSlice = forgotPasswordToken.slice(0, 8).toLowerCase();

	const url = `${process.env.URL_CLIENT}/user/forgot-password/${forgotPasswordToken}`;
	sendMail(
		checkEmail,
		url,
		"changePassword",
		"איפוס סיסמא",
		"",
		"קוד האימות הינו",
		codeSlice
	);

	return res.status(200).json({
		message: "נשלח אלייך למייל קוד לאימות.",
		code: codeSlice,
	});
};

exports.verificationCode = async (req, res) => {
	try {
		const code = escape(req.body.code);
		const currentRealCode = escape(req.body.currentRealCode.toLowerCase());

		const checkCode = validation.addSlashes(code);

		if (!checkCode) {
			return res
				.status(404)
				.json({ message: "האימות נכשל, נא לנסות שוב." });
		}

		if (checkCode !== currentRealCode) {
			return res.status(400).json({ message: "קוד אימות אינו תואם." });
		}
		return res.status(200).json({
			message: "האימות התבצע בהצלחה.",
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};
exports.changePassword = async (req, res) => {
	const email = escape(req.body.email);
	const password = escape(req.body.password);
	const confrimPassword = escape(req.body.confrimPassword);

	try {
		if (!password || !confrimPassword) {
			return res.status(400).json({ message: "נא למלא את כל השדות." });
		}
		if (!validation.checkPassword(password)) {
			return res
				.status(400)
				.json({ message: "סיסמא צריכה להכיל מינימום 7 תווים." });
		}
		if (password !== confrimPassword) {
			return res.status(400).json({ message: "הסיסמאות אינן תאומות." });
		}

		const checkEmail = validation.addSlashes(email);
		const checkPassword = validation.addSlashes(password);

		const user = await User.findOne({ email: checkEmail });

		const passwordHash = await auth.hashPassword(checkPassword);

		await User.findByIdAndUpdate(user._id, {
			password: passwordHash,
		});

		return res.status(200).json({ message: "הסיסמא עודכנה בהצלחה." });
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};
