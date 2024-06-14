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
  .route("/:id")
  .get(authenticate, ThreadController.getThreadById)
  .patch(authenticate, upload.single("image"), ThreadController.updateThread)
  .delete(authenticate, ThreadController.deleteThread);

export default router;
