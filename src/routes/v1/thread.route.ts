import { Router } from "express";
import ThreadController from "../../controllers/thread.controller";
import { authenticate } from "../../middlewares/authenticate";
import { upload } from "../../middlewares/upload";

const router = Router();

router
  .route("/")
  .get(authenticate, ThreadController.getThread)
  .post(authenticate, upload.single("image"), ThreadController.createThread);

router
  .route("/user/following")
  .get(authenticate, ThreadController.getFollowingThread);

router
  .route("/:id")
  .get(authenticate, ThreadController.getThreadById)
  .patch(authenticate, upload.single("image"), ThreadController.updateThread)
  .delete(authenticate, ThreadController.deleteThread);

router.route("/user/:id").get(authenticate, ThreadController.getUserThread);
router
  .route("/user/replies/:id")
  .get(authenticate, ThreadController.getThreadUserReply);

router
  .route("/reply/:id")
  .get(authenticate, ThreadController.getReplyThread)
  .post(authenticate, upload.single("image"), ThreadController.replyThread);

router.route("/like/:id").post(authenticate, ThreadController.likeUnlikeThread);

router
  .route("/user/likes/:id")
  .get(authenticate, ThreadController.getLikedThread);

export default router;
