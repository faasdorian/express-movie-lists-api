import { Router } from "express";
import { createList } from "../controllers/listController";
import verifyJwt from "../middleware/verifyJwt";

const router = Router();

router.post("/", verifyJwt, createList);

export default router;
