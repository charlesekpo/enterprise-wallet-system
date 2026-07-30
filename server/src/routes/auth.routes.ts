import {Router} from "express";
import {login, register, changePassword, forgetMyPassword} from "../controllers/auth.controller";
import validate from "../middleware/validate.middleware";
import {registerSchema, loginSchema, changePasswordSchema, forgotPasswordSchema} from "../schemas/auth.schema";
import authenticate from "../middleware/auth.middleware";

const router = Router();

router.post('/login', validate(loginSchema), login);

router.post('/register', validate(registerSchema), register);

router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword);

router.post('/forgot-password', validate(forgotPasswordSchema), forgetMyPassword);

export default router;