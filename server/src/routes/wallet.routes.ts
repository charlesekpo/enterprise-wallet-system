import {Router} from "express";
import authenticate from "../middleware/auth.middleware";
import {deposit, withdraw, transfer, myWallet} from "../controllers/wallet.controller";
import validate from "../middleware/validate.middleware";
import { depositSchema, withdrawSchema, transferSchema } from "../schemas/wallet.schema";
// import authorize from "../middleware/authorize.middleware";
// import {Roles} from "../types/role.type";

const router = Router();

router.get('/', authenticate, myWallet);
// router.get('/', authenticate, authorize(Roles.ADMIN), myWallet);
router.post('/deposit', authenticate, validate(depositSchema), deposit)
router.post('/withdraw', authenticate, validate(withdrawSchema), withdraw);
router.post('/transfer', authenticate, validate(transferSchema), transfer);

export default router;