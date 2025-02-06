"use client"
import React, { useContext, useEffect, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import axios from 'axios';
import { MessagesContext } from '@/context/MessagesContext';
import Prompt from '@/data/Prompt';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';

function CodeView() {
  const {id}=useParams();
  const [activeTab,setActiveTab]=useState('code')
  const[files,setFiles]=useState(Lookup?.DEFAULT_FILE)
  const {messages,setMessages}=useContext(MessagesContext);
  const UpdateFiles=useMutation(api.workspace.UpdateFiles)

  useEffect(()=>{
      if(messages?.length>0)
        {
        const role=messages[messages?.length-1].role;
        if(role=='user'){
          GenerateAiCode();
        }
      }
    },[messages])
    
  const GenerateAiCode=async()=>{
    const PROMPT=JSON.stringify(messages)+" "+Prompt.CODE_GEN_PROMPT;
    const result=await axios.post('/api/gen-ai-code',{
      prompt:PROMPT
    });
    console.log(result.data);
    const aiResp=result.data;

    const mergedFiles={...Lookup.DEFAULT_FILE,...aiResp?.files}
    setFiles(mergedFiles);
    await UpdateFiles({
      workspaceId:id,
      files:aiResp?.files
    });
  }
  return (
    <div>
      <div className='bg-[#181818] w-full p-2 border-'>
        <div className='flex items-center flex-wrap shrink-8
       bg-black p-1 justify-center rounded-full
        w-[140px] gap-3'>
          <h2 onClick={()=>setActiveTab('code')}className={`text-sm cursor-pointer 
            ${activeTab=='code'&&'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}>Code</h2>

          <h2 onClick={()=>setActiveTab('preview')}
          className={`text-sm cursor-pointer ${activeTab=='preview'&&'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}>Preview</h2>
        </div>
      </div>
      <SandpackProvider template="react" theme={'dark'}
      files={files}
      customSetup={{
        dependencies:{
          ...Lookup.DEPENDANCY
        }
      }}
      options={{
        externalResources:['https://cdn.tailwindcss.com']
      }}>
    <SandpackLayout>
      {activeTab=='code'?<>
      <SandpackFileExplorer style={{height:'80vh'}}/>
      <SandpackCodeEditor style={{height:'80vh'}}/>
      </>:
      <>
      <SandpackPreview style={{height:'80vh'}} showNavigator={true}/>
    </>}
    </SandpackLayout>
  </SandpackProvider>
    </div>
  )
}

export default CodeView