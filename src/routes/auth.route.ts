import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";
import checkValidation from "../middleware/checkValidation";
import validateSignup from "../validation/signup.validation";

const router = Router();

router.post("/signup", validateSignup, checkValidation, signup);
router.post("/login", login);

export default router;
