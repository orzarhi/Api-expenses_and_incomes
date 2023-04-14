const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		fullName: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		emailToken: {
			type: String,
		},
		expenses: [
			{
				type: Schema.Types.ObjectId,
				ref: "Expenses",
			},
		],
		incomes: [
			{
				type: Schema.Types.ObjectId,
				ref: "Income",
			},
		],
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("users", userSchema);
module.exports = User;
