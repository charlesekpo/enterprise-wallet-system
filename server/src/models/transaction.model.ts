import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    reference: {
        type: String,
        unique: true,
        required: true
    },

    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true
    },

    status: {
        required: true,
        type: String,
        enum: ["SUCCESS","PENDING","FAILED","REVERSED"],
        default: "SUCCESS"
    },

    type: {
        type: String,
        required: true,
        enum: ["DEPOSIT","WITHDRAWAL","TRANSFER_IN","TRANSFER_OUT"]
    },

    amount: {
        type: Number,
        required: true,
        min: 1
    },

    balanceBefore: {
        required: true,
        type: Number
    },

    balanceAfter: {
        type: Number,
        required: true
    },

    description: {
        type: String
    },

    currency: {
        type: String,
        enum: ["NGN","USD"],
        default: "NGN"
    }
},{
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;