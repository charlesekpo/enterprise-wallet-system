import {Router} from "express";
import {login, register, changePassword} from "../controllers/auth.controller";
import validate from "../middleware/validate.middleware";
import {registerSchema, loginSchema, changePasswordSchema} from "../schemas/auth.schema";
import authenticate from "../middleware/auth.middleware";

const router = Router();

router.post('/login', validate(loginSchema), login);

router.post('/register', validate(registerSchema), register);

router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword);

export default router;