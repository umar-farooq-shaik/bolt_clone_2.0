"use client"
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const {messages, setMessages} = useContext(MessagesContext);
  const {userDetail,setUserDetail} = useContext(UserDetailContext); 
  const [userInput,setUserInput]=useState();
  const[loading,setLoading]=useState(false);
  const UpdateMessages=useMutation(api.workspace.UpdateMessages)
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
    setMessages(result?.messages);
    console.log(result);
  };

  useEffect(()=>{
    if(messages?.length>0)
      {
      const role=messages[messages?.length-1].role;
      if(role=='user'){
        GetAiResponse()
      }
    }
  },[messages])
  
  const GetAiResponse=async()=>{
    setLoading(true);
      const PROMPT = JSON.stringify(messages)+Prompt.CHAT_PROMPT;
      const result=await axios.post('/api/ai-chat',{
        prompt:PROMPT
      });

      const aiResp={
          role:'ai',
          content:result.data.result
        }
      setMessages(prev=>[...prev,aiResp])
      await UpdateMessages({
        messages:[...messages,aiResp],
        workspaceId:id
      })
      setLoading(false);
  }


  const onGenerate=(input)=>{
    setMessages(prev=>[...prev,{
      role:'user',
      content:input
    }]);
    setUserInput('')
  }

  return (
    <div className='relative h-[85vh] flex flex-col'>
     <div className='flex-1 overflow-y-scroll scrollbar-hide'>
  {messages?.length ? (
    messages.map((msg, index) => (
      <div
        key={index}
        className="p-3 rounded-lg mb-2 flex gap-2 items-center leading-7"
        style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
      >
        {msg?.role === "user" && userDetail?.picture && (
          <Image
            src={userDetail.picture}
            alt="userImage"
            width={35}
            height={35}
            className="rounded-full"
          />
        )}
        <ReactMarkdown className='flex flex-col'>{msg.content}</ReactMarkdown>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500">No messages available.</p>
  )}
  {loading && <div className="p-3 rounded-lg mb-2 flex gap-2 items-center"
  style={{ backgroundColor: Colors.CHAT_BACKGROUND }}>
          <Loader2Icon className='animate-spin'/>
          <h2>Generating response...</h2>
    </div>
}
</div>

    {<div className='p-5 border rounded-xl max-w-xl w-full mt-3'
        style={{
          backgroundColor:Colors.BACKGROUND
        }}>
        <div className='flex gap-2'>
          <textarea placeholder={Lookup.INPUT_PLACEHOLDER}
          value={userInput}
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