import { RiLogoutBoxLine } from "react-icons/ri";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
// TODO Implement Logout functionality

const Logout = () => {
	const {authUser,setAuthUser}=useAuthContext();
	const handleLogout=async(e)=>{
		e.preventDefault();
		try {
			const res=await fetch('/api/auth/logout',{credentials:'include'});
			const data = await res.json();
			setAuthUser(null);
			window.location.href='/login';
			
		} catch (error) {
			toast.error(error.message);
		}
	}

	return (
		<>
			<img
				src={authUser?.avatarUrl}
				className='w-10 h-10 rounded-full border border-gray-800'
			/>

			<div className='cursor-pointer flex items-center p-2 rounded-lg bg-glass mt-auto border border-gray-800' onClick={handleLogout}>
				<RiLogoutBoxLine size={22} />
			</div>
		</>
	);
};

export default Logout;