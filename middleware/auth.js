const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
	try {
		const token = req.header("token");

		if (!token || token.length === 0) {
			throw new Error("לא נמצא טוקן.");
		}
		const decoded = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);

		if (!decoded) {
			throw new Error("טוקן לא תקין.");
		}
		const user = await User.findOne({ _id: decoded.id, token });

		if (!user) {
			throw new Error("לא קיים משתמש.");
		}
		req.user = user;

		next();
	} catch (err) {
		return res.status(401).json({ message: err.message });
	}
};
