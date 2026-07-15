import mongoose from "mongoose";

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
    }
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;