import { Router } from "express";
import UserController from "../../controllers/user.controller";
import { authenticate } from "../../middlewares/authenticate";
import { upload } from "../../middlewares/upload";

const router = Router();

router.route("/profile/:username").get(authenticate, UserController.getProfile);
router.route("/suggested").get(authenticate, UserController.getSuggestedUsers);
router
  .route("/follow/:id")
  .post(authenticate, UserController.followUnfollowUser);
router.route("/profile/update/:id").patch(
  authenticate,
  upload.fields([
    { name: "photoProfile", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  UserController.updateProfile
);

export default router;
