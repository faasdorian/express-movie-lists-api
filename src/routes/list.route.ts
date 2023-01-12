import { Router } from "express";
import {
  createList,
  getLists,
  getListById,
  deleteList,
  updateList
} from "../controllers/list.controller";
import checkValidation from "../middleware/checkValidation";
import verifyJwt from "../middleware/verifyJwt";
import createListValidation from "../validation/list/createList.validation";
import updateListValidation from "../validation/list/updateList.validation";


const router = Router();

router.post("/", verifyJwt, createListValidation, checkValidation, createList);
router.put("/:listId", verifyJwt, updateListValidation, checkValidation, updateList);
router.delete("/:listId", verifyJwt, deleteList);
router.get("/", verifyJwt, getLists);
router.get("/:listId", verifyJwt, getListById);

export default router;
