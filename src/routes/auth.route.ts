import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";
import checkValidation from "../middleware/checkValidation";
import verifyJwt, { verifyJwtNoMandatory } from "../middleware/verifyJwt";
import validateSignup from "../validation/signup.validation";

const router = Router();

router.post("/signup", validateSignup, checkValidation, verifyJwtNoMandatory, signup);
router.post("/login", login);

export default router;
