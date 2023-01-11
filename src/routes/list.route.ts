import { Router } from "express";
import {
  createList,
  getLists,
  getListById,
  addItemsToList,
  deleteList,
  deleteItem,
  updateList,
  updateItem
} from "../controllers/list.controller";
import checkValidation from "../middleware/checkValidation";
import verifyJwt from "../middleware/verifyJwt";
import createItemValidation from "../validation/createItems.validation";
import createListValidation from "../validation/createList.validation";
import updateListValidation from "../validation/updateList.validation";


const router = Router();

router.post("/", verifyJwt, createListValidation, checkValidation, createList);
router.put("/:listId", verifyJwt, updateListValidation, checkValidation, updateList);
router.delete("/:listId", verifyJwt, deleteList);
router.get("/", verifyJwt, getLists);
router.get("/:listId", verifyJwt, getListById);
router.post("/:listId/items", verifyJwt, createItemValidation, checkValidation, addItemsToList);
router.put("/:listId/items/:itemId", verifyJwt, updateListValidation, checkValidation, updateItem);
router.delete("/:listId/items/:itemId", verifyJwt, deleteItem);

export default router;
