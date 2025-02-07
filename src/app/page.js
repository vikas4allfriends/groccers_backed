"use client"; // ✅ Required for useSelector

import SidebarLayout from "./SidebarLayout";
import { useSelector } from "react-redux";
import LogoutHandler from "../components/LogoutHandler";
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {LOGIN_SUCESS} from '../constants';
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
    console.log('token>>>>',token)
    setToken(token)
    if(!token){
      window.location.replace("/auth/Login");
    }else{
      window.location.replace('/product/dashboard')
    }
    // if(token){
    //   dispatch({type:LOGIN_SUCESS, payload:{token:token}})
    // }
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
