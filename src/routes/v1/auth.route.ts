import { Router } from "express";
import AuthController from "../../controllers/auth.controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

router.route("/check-me").get(authenticate, AuthController.checkAuth);
router.route("/login").post(AuthController.login);
router.route("/register").post(AuthController.register);
router.route("/logout").post(AuthController.logout);
router.route("/forgot-password").post(AuthController.forgotPassword);
router.route("/reset-password/:token").post(AuthController.resetPassword);
router.route("/change-password").post();

export default router;
