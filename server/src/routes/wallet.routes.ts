import {Router} from "express";
import authenticate from "../middleware/auth.middleware";
import {deposit, withdraw, myWallet} from "../controllers/wallet.controller";
import validate from "../middleware/validate.middleware";
import { depositSchema, withdrawSchema } from "../schemas/wallet.schema";

const router = Router();

router.get('/', authenticate, myWallet);
router.post('/deposit', authenticate, validate(depositSchema), deposit)
router.post('/withdraw', authenticate, validate(withdrawSchema), withdraw);

export default router;