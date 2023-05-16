require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const userRouter = require("./routers/userRouter");
const expenseRouter = require("./routers/expenseRouter");
const incomeRouter = require("./routers/incomeRouter");
const { auth } = require("./middleware/auth");

const URI = process.env.URI;
const URI_DEV = process.env.URI_DEV;
const URL_CLIENT = process.env.URL_CLIENT;
const URL_CLIENT2 = process.env.URL_CLIENT2;

const PORT = process.env.PORT;

mongoose.set("strictQuery", true);
const app = express();

app.use(express.json());
app.use(
	cors({
		credentials: true,
		origin: [URL_CLIENT, URL_CLIENT2],
	})
);

mongoose
	.connect(URI)
	.then(() => console.log("Connected to DataBase"))
	.catch((err) => console.log(err.message));

app.use("/api/user/", userRouter);
app.use("/api/expense/", auth, expenseRouter);
app.use("/api/income/", auth, incomeRouter);

app.listen(PORT || 5000, () => {
	console.log("Connection Successful!");
});
