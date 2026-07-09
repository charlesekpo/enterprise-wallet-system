import {Router} from "express";
import {login, register} from "../controllers/auth.controller";
import validate from "../middleware/validate.middleware";
import {registerSchema} from "../schemas/auth.schema";

const router = Router();

router.post('/login', login);

router.post('/register', validate(registerSchema), register);

export default router;