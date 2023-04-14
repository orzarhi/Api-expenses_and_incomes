const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);

router.post("/verify-email", userController.verifyEmail);

router.post("/login", userController.login);

module.exports = router;
