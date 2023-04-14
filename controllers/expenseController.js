const escape = require("escape-html");
const validation = require("../utils/validation");
const Expenses = require("../models/Expense");
const User = require("../models/User");

exports.addExpense = async (req, res) => {
	const userId = escape(req.params.userId);
	const name = escape(req.body.name);
	const price = escape(req.body.price);
	const date = escape(req.body.date);

	let expenditure, user;
	try {
		if (!name || !price || !date) {
			return res.status(400).json({ message: "נא למלא את כל הפרטים." });
		}

		const checkUserId = validation.addSlashes(userId);
		const checkName = validation.addSlashes(name);
		const checkPrice = validation.addSlashes(price);
		const checkDate = validation.addSlashes(date);

		expenditure = new Expenses({
			name: checkName,
			price: checkPrice,
			date: checkDate,
		});

		await expenditure.save();
		user = await User.findById(checkUserId);
		if (!user) {
			return res.status(404).json({ message: "לא קיים משתמש." });
		}
		user.expenses.push(expenditure);

		await user.save();
	} catch (err) {
		return res.status(401).json({ message: err.message });
	}
	if (!expenditure) {
		return res
			.status(500)
			.json({ message: "לא נוספה ההוצאה - נא לנסות שוב." });
	}
	return res.status(201).json({ message: "ההוצאה נוספה בהצלחה." });
};

exports.updateExpense = async (req, res) => {
	const expenseId = escape(req.params.expenseId);
	const name = escape(req.body.name);
	const price = escape(req.body.price);
	const date = escape(req.body.date);

	let expenditure;
	try {
		if (!name || !price || !date) {
			return res.status(400).json({ message: "נא להזין את ההוצאה." });
		}

		const checkExpenseId = validation.addSlashes(expenseId);
		const checkName = validation.addSlashes(name);
		const checkPrice = validation.addSlashes(price);
		const checkDate = validation.addSlashes(date);

		expenditure = await Expenses.findByIdAndUpdate(checkExpenseId, {
			name: checkName,
			price: checkPrice,
			date: checkDate,
		});

		await expenditure.save();
	} catch (err) {
		return res.status(401).json({ message: err.message });
	}
	if (!expenditure) {
		return res
			.status(500)
			.json({ message: "לא עודכנה ההוצאה - נא לנסות שוב." });
	}
	return res.status(201).json({ message: "ההוצאה עודכנה בהצלחה." });
};

exports.getExpensesForUser = async (req, res) => {
	const userId = escape(req.params.userId);
	const allExpensesForUser = [];
	const expensesUser = [];

	try {
		const checkUserId = validation.addSlashes(userId);

		const user = await User.findById(checkUserId);
		if (!user) {
			return res.status(404).json({ message: "לא קיים משתמש." });
		}

		const expenses = await Expenses.find();

		user.expenses.forEach((e) => {
			allExpensesForUser.push(e.toString());
		});

		expenses.forEach((b) => {
			allExpensesForUser.forEach((u) => {
				if (b._id.toString() === u) {
					expensesUser.push(b);
				}
			});
		});

		if (!expenses) {
			return res.status(404).json({ message: "ההוצאה לא נמצאה." });
		}

		return res.status(200).send(expensesUser);
	} catch (err) {
		return res.status(401).json({ message: err });
	}
};

exports.deleteExpenseForUser = async (req, res) => {
	const userId = escape(req.params.userId);
	const expenseId = escape(req.params.expenseId);

	let user;
	try {
		const checkUserId = validation.addSlashes(userId);

		user = await User.findById(checkUserId);
		if (!user) {
			return res.status(404).json({ message: "לא קיים משתמש." });
		}

		const expenseExists = user.expenses.find(
			(e) => e.toString() === expenseId
		);
		if (expenseExists) {
			user.expenses.pull(expenseExists);
		}
		await user.save();

		return res.status(200).json({ message: "ההוצאה נמחקה בהצלחה." });
	} catch (err) {
		return res.status(404).json({ message: err });
	}
};
