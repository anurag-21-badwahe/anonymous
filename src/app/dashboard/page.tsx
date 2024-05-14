'use client'
import React from 'react' 
import Navbar from '@/components/Navbar'
import { useSession, signIn, signOut } from "next-auth/react"

const page = () => {
  const { data: session } = useSession();
  console.log(session)
  const username = session?.user?.name ? session.user.name.split(" ")[0] : "Guest";
//   console.log("username",username);
  
  return (
    <>
      <Navbar username={username} />
    </>
  )
}

export default page
