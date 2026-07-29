import {Router} from "express";
import {allTransactions, transactionByRef} from "../controllers/transaction.controller";
import authenticate from "../middleware/auth.middleware";

const router = Router();

router.get('/', authenticate, allTransactions);

router.get('/:reference', authenticate, transactionByRef);

export default router;