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
        enum: ["NGN","USD"],
        default: "NGN"
    },
    status: {
        type: String,
        enum: ["ACTIVE","SUSPENDED","CLOSED"],
        default: "ACTIVE"
    }

},{timestamps: true});

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;