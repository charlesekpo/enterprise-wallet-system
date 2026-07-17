import {Router} from "express";
import authenticate from "../middleware/auth.middleware";
import getWallet from "../controllers/wallet.controller";

const router = Router();

router.get('/', authenticate, getWallet);

export default router;