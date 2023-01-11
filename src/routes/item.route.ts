import { Router } from "express";
import { addItemsToList, deleteItem, updateItem } from "../controllers/item.controller";
import checkValidation from "../middleware/checkValidation";
import verifyJwt from "../middleware/verifyJwt";
import createItemValidation from "../validation/createItems.validation";
import updateItemValidation from "../validation/updateItem.validation";


const router = Router();

router.post("/", verifyJwt, createItemValidation, checkValidation, addItemsToList);
router.put("/:itemId", verifyJwt, updateItemValidation, checkValidation, updateItem);
router.delete("/:itemId", verifyJwt, deleteItem);

export default router;
