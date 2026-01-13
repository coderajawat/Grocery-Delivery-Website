import { auth } from '@/auth';
import EditRoleAndMobile from '@/components/EditRoleAndMobile';
import Nav from '@/components/Nav';
import connectDb from '@/lib/db'
import User from '@/models/user.model';
import { redirect } from 'next/navigation';
import React from 'react'

async function Home() {
  await connectDb();
  const session = await auth();
  //console.log(session);
  const user = await User.findById(session?.user?.id);
  if(!user){
    redirect("/login");
  }

  const inComplete = !user.mobile || !user.role || (!user.mobile && user.role == "user")

  if(inComplete){
    return <EditRoleAndMobile />;
  }

  const plainUser = JSON.parse(JSON.stringify(user));
  return (
    <>
      <Nav user={plainUser}/>
    </>
  )
}

export default Home