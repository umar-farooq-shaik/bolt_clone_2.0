"use client"
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import { useConvex } from 'convex/react';
import { ArrowRight, Link } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const {messages, setMessages} = useContext(MessagesContext);
  const {userDetail,setUserDetail} = useContext(UserDetailContext); 
  const [userInput,setUserInput]=useState();
  useEffect(() => {
    id && GetWorkspaceData();
  }, [id]);

  /**
  * Used to get workspace data using WorkspaceId
  */
  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspaceData, {
      workspaceId: id
    });
    setMessages(result.messages || []);
  };

  return (
    <div className='relative h-[85vh] flex flex-col'>
      <div className='flex-1 overflow-y-scroll '>
      {messages?.map((msg, index)=>(
        <div key={index} 
        
        className='p-3 rounded-lg mb-2 flex gap-2 items-start'
        style={{
          backgroundColor:Colors.CHAT_BACKGROUND       
           }}>
            {msg?.role=='user'&&
            <Image src={userDetail?.picture} alt='userImage'
            width={35} height={35} className='rounded-full' />}
          <h2>{msg.content}</h2>
        </div>
      ))}
    </div>
    {<div className='p-5 border rounded-xl max-w-xl w-full mt-3'
        style={{
          backgroundColor:Colors.BACKGROUND
        }}>
        <div className='flex gap-2'>
          <textarea placeholder={Lookup.INPUT_PLACEHOLDER}
          onChange={(event)=>setUserInput(event.target.value)}
          className='outline-none bg-transparent w-full h-32 max-h-56 resize-none'
          /> 
         {userInput && <ArrowRight
         onClick={()=>onGenerate(userInput)}
         className='bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer' />}
        </div>
        <div>
        <Link className='h-5 w-5'/>
        </div>
      </div>
      }
    </div>
  );
}

export default ChatView;