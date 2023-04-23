const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);

router.post("/verify-email", userController.verifyEmail);

router.post("/login", userController.login);

router.post("/forgot-password", userController.forgotPassword);

router.post("/verification-code", userController.verificationCode);

router.post("/change-password", userController.changePassword);

module.exports = router;
