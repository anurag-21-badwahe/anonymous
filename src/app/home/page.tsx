'use client'
import React from 'react' 
import Navbar from '@/components/Navbar'
import { useSession, signIn, signOut } from "next-auth/react"
import { setServers } from 'dns'

const Home = () => {
  const { data: session } = useSession();
  const username = session?.user?.name ? session.user.name.split(" ")[0] : "Guest";
  // console.log("username",username);
  
  return (
    <>
      <Navbar username={username} />
    </>
  )
}

export default Home
