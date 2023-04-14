const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expensesSchema = new Schema({
	name: {
		type: String,
		trim: true,
		required: true,
	},
	price: {
		type: Number,
		trim: true,
		required: true,
	},
	date: {
		type: Date,
		trim: true,
		required: true,
	},
});

const Expenses = mongoose.model("expenses", expensesSchema);
module.exports = Expenses;
