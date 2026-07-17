import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    currency: {
        type: String,
        default: "NGN"
    },
    status: {
        type: String,
        default: "ACTIVE"
    }

},{timestamps: true});

const wallet = mongoose.model('Wallet', walletSchema);

export default wallet;