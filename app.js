require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const userRouter = require("./routers/userRouter");
const expenseRouter = require("./routers/expenseRouter");
const incomeRouter = require("./routers/incomeRouter");
const { auth } = require("./middleware/auth");

const URI = process.env.URI;
const URL = process.env.URL;
const URL_CLIENT = process.env.URL_CLIENT;
const PORT = process.env.PORT;

mongoose.set("strictQuery", true);
const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: URL_CLIENT }));
// app.use(cors({ origin: "*", allowedHeaders: ["token", "Content-type"] }));
// app.use(cors());

// app.use(cors());
// app.get("/", (req, res) => {
// 	res.setHeader("Access-Control-Allow-Credentials", "true");
// 	res.send("Api is running...");
// });

// app.all("*", function (req, res, next) {
// 	const origin = cors.origin.includes(req.header("origin").toLowerCase())
// 		? req.headers.origin
// 		: cors.default;
// 	res.header("Access-Control-Allow-Origin", origin);
// 	res.header(
// 		"Access-Control-Allow-Headers",
// 		"Origin, X-Requested-With, Content-Type, Accept"
// 	);
// 	next();
// });

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
