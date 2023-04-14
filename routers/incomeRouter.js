const router = require("express").Router();
const incomeController = require("../controllers/incomeController");

router.post("/add/:userId", incomeController.addIncome);

router.patch("/update/:incomeId", incomeController.updateIncome);

router.get("/:userId", incomeController.getIncomesForUser);

router.delete(
	"/:userId/delete/:IncomeId",
	incomeController.deleteIncomeForUser
);

module.exports = router;
