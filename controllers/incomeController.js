const escape = require("escape-html");
const validation = require("../utils/validation");
const Income = require("../models/Income");
const User = require("../models/User");

exports.addIncome = async (req, res) => {
	const userId = escape(req.params.userId);
	const name = escape(req.body.name);
	const price = escape(req.body.price);
	const date = escape(req.body.date);

	let income, user;

	try {
		if (!name || !price || !date) {
			return res.status(400).json({ message: "נא להזין את ההכנסה." });
		}

		const checkUserId = validation.addSlashes(userId);
		const checkName = validation.addSlashes(name);
		const checkPrice = validation.addSlashes(price);
		const checkDate = validation.addSlashes(date);

		income = new Income({
			name: checkName,
			price: checkPrice,
			date: checkDate,
		});
		await income.save();

		user = await User.findById(checkUserId);
		if (!user) {
			return res.status(404).json({ message: "לא קיים משתמש." });
		}

		user.incomes.push(income);

		await user.save();
	} catch (err) {
		return res.status(401).json({ message: err.message });
	}
	if (!income) {
		return res.status(500).json({ message: "לא נוספה ההכנסה." });
	}
	return res.status(201).json({ message: "ההכנסה נוספה בהצלחה." });
};

exports.getIncomesForUser = async (req, res) => {
	const userId = escape(req.params.userId);
	const allIncomesForUser = [];
	const incomesUser = [];

	try {
		const checkUserId = validation.addSlashes(userId);

		const user = await User.findById(checkUserId);
		if (!user) {
			return res.status(404).json({ message: "לא קיים משתמש." });
		}
		const incomes = await Income.find();

		user.incomes.forEach((e) => {
			allIncomesForUser.push(e.toString());
		});

		incomes.forEach((b) => {
			allIncomesForUser.forEach((u) => {
				if (b._id.toString() === u) {
					incomesUser.push(b);
				}
			});
		});

		if (!incomes) {
			return res.status(404).json({ message: "הכנסה לא נמצאה." });
		}
		return res.status(200).send(incomesUser);
	} catch (err) {
		return res.status(401).json({ message: err });
	}
};

exports.updateIncome = async (req, res) => {
	const incomeId = escape(req.params.incomeId);
	const name = escape(req.body.name);
	const price = escape(req.body.price);
	const date = escape(req.body.date);

	let income;
	try {
		if (!name || !price || !date) {
			return res.status(400).json({ message: "נא להזין את ההכנסה." });
		}

		const checkIncomeId = validation.addSlashes(incomeId);
		const checkName = validation.addSlashes(name);
		const checkPrice = validation.addSlashes(price);
		const checkDate = validation.addSlashes(date);

		income = await Income.findByIdAndUpdate(checkIncomeId, {
			name: checkName,
			price: checkPrice,
			date: checkDate,
		});

		await income.save();
	} catch (err) {
		return res.status(401).json({ message: err.message });
	}
	if (!income) {
		return res
			.status(500)
			.json({ message: "לא עודכנה ההכנסה - נא לנסות שוב." });
	}
	return res.status(201).json({ message: "ההכנסה עודכנה בהצלחה." });
};

exports.deleteIncomeForUser = async (req, res) => {
	const userId = escape(req.params.userId);
	const incomeId = escape(req.params.IncomeId);

	let user;
	try {
		const checkUserId = validation.addSlashes(userId);
		user = await User.findById(checkUserId);
		if (!user) {
			return res.status(404).json({ message: "לא קיים משתמש." });
		}

		const incomeExists = user.incomes.find(
			(e) => e.toString() === incomeId
		);
		if (incomeExists) {
			user.incomes.pull(incomeExists);
		}
		await user.save();
		return res.status(200).json({ message: "הכנסה נמחקה בהצלחה." });
	} catch (err) {
		return res.status(401).json({ message: err });
	}
};
