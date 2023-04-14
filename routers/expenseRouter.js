const router = require("express").Router();
const expenseController = require("../controllers/expenseController");

router.post("/add/:userId", expenseController.addExpense);

router.patch("/update/:expenseId", expenseController.updateExpense);

router.get("/:userId", expenseController.getExpensesForUser);

router.delete(
	"/:userId/delete/:expenseId",
	expenseController.deleteExpenseForUser
);

module.exports = router;
