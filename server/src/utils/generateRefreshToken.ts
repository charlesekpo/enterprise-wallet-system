import crypto from "crypto";

const generateRefreshToken = ()=>{
    return crypto.randomBytes(32).toString('hex');
};

export default generateRefreshToken;