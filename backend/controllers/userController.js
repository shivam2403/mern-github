import User from "../models/UserModel.js";

export const getUserProfileAndRepos=async(req,res)=>{
    try {
        const {username}=req.params;
        const token=process.env.GITHUB_API_KEY;
        const userRes=await fetch(`https://api.github.com/users/${username}`,{
            headers: {
                Authorization: `token ${token}`
            }
        });
        const userProfile=await userRes.json();
    
        const reposRes=await fetch(userProfile.repos_url,{
            headers: {
                Authorization: `token ${token}`
            }
        });
        const repos=await reposRes.json();
        
        return res.status(200).json({userProfile,repos});
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}

export const likeProfile=async(req,res)=>{
    try {
        const {username}=req.params;
        const user=await User.findById(req.user._id.toString());
        const userToLike=await User.findOne({username});

        if(!userToLike) {
            return res.status(404).json({error:"User is not a member"});
        }

        if(user.likedProfiles.includes(userToLike.username)){
            return res.status(400).json({error:"User already liked"});
        }

        userToLike.likedBy.push({username:user.username,avatarUrl:user.avatarUrl,likedDate:Date.now()})
        user.likedProfiles.push(userToLike.username);

        await Promise.all([userToLike.save(),user.save()]);

        return res.status(200).json({message:"User liked"})
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}

export const getLikes=async(req,res)=>{
    try {
        const user=await User.findById(req.user._id.toString());
        return res.status(200).json({likedBy:user.likedBy});
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
}