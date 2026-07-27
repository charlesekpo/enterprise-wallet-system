import {Router} from "express";
import {allTransactions} from "../controllers/transaction.controller";
import authenticate from "../middleware/auth.middleware";

const router = Router();

router.get('/', authenticate, allTransactions);

export default router;