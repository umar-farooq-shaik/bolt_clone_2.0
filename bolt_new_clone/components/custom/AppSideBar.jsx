import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { Button } from '../ui/button';
import { MessageCircleCodeIcon, PanelRightOpen } from 'lucide-react';
import WorkspaceHistory from './WorkspaceHistory';
import SideBarFooter from './SideBarFooter';
import Link from 'next/link';

function AppSideBar() {
  return (
    
      <Sidebar>
        <SidebarHeader className="p-5">
          
             {/* Logo and SnapSite text together */}
       <Link href={'/'} className="flex items-center gap-1">
        <div className="w-[40px] h-[40px] overflow-hidden rounded-full">
          <Image src="/logo2.png" alt="logo" width={40} height={40} />
        </div>
        <div className="font-bold text-3xl">SnapSite</div>
      </Link>
            <Link href={'/'}>
            <Button className="mt-5 ml-5"><MessageCircleCodeIcon /> Start New Chat</Button>
        </Link>
        </SidebarHeader>
        <SidebarContent className="">
          <SidebarGroup>
            <WorkspaceHistory />
          </SidebarGroup>
          {/* <SidebarGroup /> */}
        </SidebarContent>
        <SidebarFooter>
            <SideBarFooter></SideBarFooter>
        </SidebarFooter>
      </Sidebar>
    
  );
}

export default AppSideBar;