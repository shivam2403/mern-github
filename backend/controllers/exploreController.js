export const exploreRepos=async(req,res)=>{
    const {language}=req.params;
    const token=process.env.GITHUB_API_KEY;

    try {
        const reposRes=await fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=10`,{
            headers:{
                Authorization: `token ${token}`
            }
        })
        const data=await reposRes.json();

        return res.status(200).json({repos:data.items});
    } catch (error) {
        return res.status(200).json({error:error.message});
    }
}