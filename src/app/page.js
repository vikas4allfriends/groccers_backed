"use client"; // ✅ Required for useSelector

import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useRouter} from 'next/navigation';
import {setRouter} from '../utils/navigation';

export default function Home() {
  const dispatch = useDispatch();
  const [token, setToken] = useState(null)
  console.log('src/app/page.js Home-->>>')
  // const Auth_Data = useSelector((state) => state.Auth_Data); // ✅ Ensure this matches your Redux slice
  // console.log('Auth_Data--',Auth_Data)
  const router = useRouter();

  useEffect(() => {
    setRouter(router); // Store router for use in Redux-Saga
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('root page token>>>>',token)
    setToken(token)
    if(!token){
      window.location.replace("/auth/Login");
    }else{
      window.location.replace('/product/dashboard')
    }
  }, [])
  


  // return (
  //   <>
  //     {/* <LogoutHandler token={token} /> */}
  //      {/* Always include this so it handles redirects */}
      
  //     {/* { token ?  */}
  //     <SidebarLayout /> 
  //      {/* : null}  */}
  //     {/* ✅ Show SidebarLayout only if logged in */}
  //   </>
  // );
}
