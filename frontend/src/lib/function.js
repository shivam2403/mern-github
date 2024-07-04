export const handleLoginWithGithub=(e)=>{
    e.preventDefault();
    window.open('/api/auth/github',"_self")
}