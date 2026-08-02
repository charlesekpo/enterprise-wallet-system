import {Router} from "express";
import {login, register, changePassword, forgetMyPassword, resetMyPassword, refreshMyToken, myLogout} from "../controllers/auth.controller";
import validate from "../middleware/validate.middleware";
import {registerSchema, loginSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema, refreshTokenSchema} from "../schemas/auth.schema";
import authenticate from "../middleware/auth.middleware";

const router = Router();

router.post('/login', validate(loginSchema), login);

router.post('/register', validate(registerSchema), register);

router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword);

router.post('/forgot-password', validate(forgotPasswordSchema), forgetMyPassword);

router.post('/reset-password', validate(resetPasswordSchema), resetMyPassword);

router.post('/refresh-token',validate(refreshTokenSchema), refreshMyToken);

router.post('/logout',validate(refreshTokenSchema), myLogout);

export default router;