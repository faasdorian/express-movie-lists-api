import { Router } from "express";
import { createList, getLists } from "../controllers/listController";
import verifyJwt from "../middleware/verifyJwt";

const router = Router();

router.post("/", verifyJwt, createList);
router.get("/", verifyJwt, getLists);

export default router;
