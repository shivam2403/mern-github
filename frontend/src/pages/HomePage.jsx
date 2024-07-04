import React, { useCallback, useEffect, useState } from 'react'
import Search from '../components/Search'
import SortRepos from '../components/SortRepos'
import ProfileInfo from '../components/ProfileInfo'
import Repos from '../components/Repos'
import toast from 'react-hot-toast'
import Spinner from '../components/Spinner'
import { useAuthContext } from '../context/AuthContext'

const HomePage = () => {
    const {authUser}=useAuthContext();
    const [userProfile,setUserProfile]=useState(null);
    const [repos,setRepos]=useState([]);
    const [loading,setLoading]=useState(false);
    const [sortType,setSortType]=useState("recent");

    const getUserProfilesAndRepos=useCallback(async(username='shivam2403')=>{
        setLoading(true);
        try {
            
            const res=await fetch(`/api/users/profile/${username}`)
            const {userProfile,repos}=await res.json();

            setUserProfile(userProfile);
            repos.sort((a,b)=>new Date(b.created_at) - new Date(a.created_at));
            setRepos(repos);

            console.log(userProfile);
            console.log(repos);
            return {userProfile,repos};
        } catch (error) {
            // toast.error(error.message)
        }finally{
            setLoading(false);
        }
    },[])

    useEffect(()=>{
       
        getUserProfilesAndRepos();
    },[getUserProfilesAndRepos])

    const onSearch=async(e,username)=>{
        e.preventDefault();

        setLoading(true);
        setRepos([]);
        setUserProfile(null);

        const {userProfile,repos}=await getUserProfilesAndRepos(username);
        setUserProfile(userProfile);
        setRepos(repos);
        setSortType('recent')
        setLoading(false);
    }

    const onSort=async(sortType)=>{
        if(sortType==="recent"){
            repos.sort((a,b)=> new Date(b.created_at)-new Date(a.created_at));
        }else if(sortType==="stars"){
            repos.sort((a,b)=> b.stargazers_count - a.stargazers_count);
        }else if(sortType==="forks"){
            repos.sort((a,b)=> b.forks_count-a.forks_count);
        }
        setSortType(sortType);
        setRepos([...repos]);
    }

  return (
    <div className='m-4 relative'>
        <Search onSearch={onSearch}/>
        <img
				src={authUser?.avatarUrl}
				className='w-10 h-10 rounded-full border border-gray-800 absolute -right-20 -top-2 cursor-pointer'
                onClick={(e)=>onSearch(e,authUser.username)}
			/>
        {repos.length > 0 && <SortRepos onSort={onSort} sortType={sortType}/>}
        <div className="flex gap-4 flex-col lg:flex-row justify-center items-start">
            {userProfile && !loading && <ProfileInfo userProfile={userProfile}/>}
            {!loading && <Repos repos={repos}/>}
            {loading && <Spinner/>}
        </div>
    </div>
  )
}

export default HomePage