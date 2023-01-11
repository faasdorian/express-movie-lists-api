import { Router } from "express";
import { createList, getLists, getListById, addItemsToList, deleteList, deleteItem } from "../controllers/list.controller";
import checkValidation from "../middleware/checkValidation";
import verifyJwt from "../middleware/verifyJwt";
import validateItems from "../validation/items.validation";
import validateList from "../validation/list.validation";

const router = Router();

router.post("/", verifyJwt, validateList, checkValidation, createList);
router.delete("/:listId", verifyJwt, deleteList);
router.get("/", verifyJwt, getLists);
router.get("/:listId", verifyJwt, getListById);
router.post("/:listId/items", verifyJwt, validateItems, checkValidation, addItemsToList);
router.delete("/:listId/items/:itemId", verifyJwt, deleteItem);

export default router;
