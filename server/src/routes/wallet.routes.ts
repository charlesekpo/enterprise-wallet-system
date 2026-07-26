import {Router} from "express";
import authenticate from "../middleware/auth.middleware";
import {deposit, withdraw, transfer, myWallet} from "../controllers/wallet.controller";
import validate from "../middleware/validate.middleware";
import { depositSchema, withdrawSchema, transferSchema } from "../schemas/wallet.schema";

const router = Router();

router.get('/', authenticate, myWallet);
router.post('/deposit', authenticate, validate(depositSchema), deposit)
router.post('/withdraw', authenticate, validate(withdrawSchema), withdraw);
router.post('/transfer', authenticate, validate(transferSchema), transfer);

export default router;