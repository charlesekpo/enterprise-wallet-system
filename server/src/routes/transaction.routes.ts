import {Router} from "express";
import {allTransactions, transactionByRef} from "../controllers/transaction.controller";
import authenticate from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import {transactionParamsSchema, transactionQuerySchema} from "../schemas/transaction.schema";

const router = Router();

router.get('/', authenticate, validate(transactionQuerySchema, 'query'),  allTransactions);

router.get('/:reference', authenticate, validate(transactionParamsSchema, 'params'), transactionByRef);

export default router;