'use client'
import React from 'react' 
import Navbar from '@/components/Navbar'
import { useSession, signIn, signOut } from "next-auth/react"

const Home = () => {
  const { data: session } = useSession();
  console.log(session)
  const username = session?.user?.name ? session.user.name.split(" ")[0] : "Guest";
  return (
    <>
      <Navbar username={username} />
    </>
  )
}

export default Home
