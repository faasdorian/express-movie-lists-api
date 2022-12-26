import { Router } from "express";
import { createList, getLists } from "../controllers/list.controller";
import checkValidation from "../middleware/checkValidation";
import verifyJwt from "../middleware/verifyJwt";
import validateList from "../validation/list.validation";

const router = Router();

router.post("/", verifyJwt, validateList, checkValidation, createList);
router.get("/", verifyJwt, getLists);

export default router;
