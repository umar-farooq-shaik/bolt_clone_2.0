import React from 'react'
import ChatView from '@/components/custom/ChatView'
import CodeView from '@/components/custom/CodeView'
function Workspace() {
  return (
    <div className='p-10'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-10'>
        <ChatView/>
        <div className='col-span-3'>
        <CodeView/>
        </div>
      </div>
    </div>
  )
}

export default Workspace
