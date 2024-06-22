import { Router } from "express";
import UserController from "../../controllers/user.controller";
import { authenticate } from "../../middlewares/authenticate";
import { upload } from "../../middlewares/upload";

const router = Router();

router.route("/").get(authenticate, UserController.getUsers);
router.route("/followers").get(authenticate, UserController.getUserFollowers);
router.route("/followings").get(authenticate, UserController.getUserFollowings);
router.route("/profile/:username").get(authenticate, UserController.getProfile);
router.route("/suggested").get(authenticate, UserController.getSuggestedUsers);
router
  .route("/follow/:id")
  .post(authenticate, UserController.followUnfollowUser);
router.route("/profile/update").patch(
  authenticate,
  upload.fields([
    { name: "photoProfile", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  UserController.updateProfile
);

export default router;
