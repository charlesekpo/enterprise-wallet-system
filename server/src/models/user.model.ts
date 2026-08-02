import mongoose from "mongoose";
import {Roles} from "../types/role.type";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
        // select: false
    },
    role:{
        type: String,
        enum: Object.values(Roles),
        default: Roles.USER
    }
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;