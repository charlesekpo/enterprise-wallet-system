import {Router} from "express";
import authenticate from "../middleware/auth.middleware";
import {deposit, myWallet} from "../controllers/wallet.controller";
import validate from "../middleware/validate.middleware";
import { depositSchema } from "../schemas/wallet.schema";

const router = Router();

router.get('/', authenticate, myWallet);
router.post('/deposit', authenticate, validate(depositSchema), deposit)

export default router;