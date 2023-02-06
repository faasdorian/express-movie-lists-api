import { Router } from "express";
import { deleteUser } from "../controllers/user.controller";
import verifyJwt from "../middleware/verifyJwt";

const router = Router();

router.delete("/:id", verifyJwt, deleteUser);

export default router;