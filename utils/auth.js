const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.hashPassword = async (value) => {
	const salt = await bcrypt.genSalt();
	return await bcrypt.hash(value, salt);
};

exports.login = async (email, password) => {
	try {
		const user = await User.findOne({ email });
		if (user) {
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) return false;

			return user;
		}
		return false;
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};

exports.createToken = (user) => {
	return jwt.sign(
		{
			fullName: user.fullName,
			email: user.email,
			id: user._id,
		},
		process.env.ACTIVATION_TOKEN_SECRET,
		{
			expiresIn: "1d",
		}
	);
};
