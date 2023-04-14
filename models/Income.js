const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const incomeSchema = new Schema({
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

const Income = mongoose.model("income", incomeSchema);
module.exports = Income;
