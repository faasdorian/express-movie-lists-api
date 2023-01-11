import { Router } from "express";
import { createList, getLists, getListById, addItemsToList } from "../controllers/list.controller";
import checkValidation from "../middleware/checkValidation";
import verifyJwt from "../middleware/verifyJwt";
import validateItems from "../validation/items.validation";
import validateList from "../validation/list.validation";

const router = Router();

router.post("/", verifyJwt, validateList, checkValidation, createList);
router.get("/", verifyJwt, getLists);
router.get("/:listId", verifyJwt, getListById);
router.post("/:listId/items", verifyJwt, validateItems, checkValidation, addItemsToList);

export default router;
