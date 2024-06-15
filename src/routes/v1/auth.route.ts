import { Router } from "express";
import AuthController from "../../controllers/auth.controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

router.route("/check-me").post(authenticate, AuthController.checkAuth);
router.route("/login").post(AuthController.login);
router.route("/register").post(AuthController.register);
router.route("/logout").post(authenticate, AuthController.logout);
router.route("/forgot-password").post();
router.route("/reset-password").post();
router.route("/change-password").post();

export default router;
