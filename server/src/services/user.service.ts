import User from "../models/user.model";
import AppError from "../utils/AppError";

const getProfile = async (userId: string)=>{
    
    const findProfile = await User.findById(userId);

    if(!findProfile){
        throw new AppError("Profile not found", 404);
    }

    return {
        success: true,
        message: "Profile retrieved successfully",
        data: findProfile
    }

}

export default getProfile;