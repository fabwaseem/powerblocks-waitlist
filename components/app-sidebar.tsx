'use client'

import * as React from 'react'
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Link,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Image from 'next/image'
import pinkDivider from '@/public/images/pink-divider.svg'
import grayDivider from '@/public/images/gray-divider.svg'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Lottery',
      url: '#',
      icon: SquareTerminal,
      // isActive: true,
      // items: [
      //   {
      //     title: 'History',
      //     url: '#',
      //   },
      //   {
      //     title: 'Starred',
      //     url: '#',
      //   },
      //   {
      //     title: 'Settings',
      //     url: '#',
      //   },
      // ],
    },
    {
      title: 'PWR Originals',
      url: '#',
      icon: Bot,
    },
    {
      title: 'Prediction Markets',
      url: '#',
      icon: BookOpen,
    },
    {
      title: 'Live Casino',
      url: '#',
      icon: Settings2,
    },
    {
      title: 'Slots',
      url: '#',
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: 'Favourites',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Recent Games',
      url: '#',
      icon: Send,
    },
  ],
  projects: [
    {
      name: 'VIP Rewards',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Affiliate Program',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Promotions',
      url: '#',
      icon: Map,
    },
    {
      name: 'Leaderboard',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Competitions',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Live Support',
      url: '#',
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <SidebarMenuButton size="lg" asChild> */}
            {/* <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a> */}
            <a href="#">
              <div className="flex items-center justify-center gap-3">
                <Image
                  src="/logo.svg"
                  alt="Powerblocks"
                  width={33}
                  height={42}
                />
                <h2 className="text-white text-2xl font-aeonik-bold">
                  Powerblocks
                </h2>
              </div>
            </a>
            {/* <Image src="/logo.svg" alt="Powerblocks" width={33} height={42} /> */}
            {/* <h2 className="text-white text-2xl font-aeonik-bold">
                Powerblocks
              </h2> */}
            {/* </SidebarMenuButton> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Image src={pinkDivider} alt="Divider" className="w-full h-[2px] my-4" />
      <SidebarContent>
        <NavSecondary items={data.navSecondary} />
        <Image src={grayDivider} alt="Divider" className="w-full h-[2px]" />
        <NavMain items={data.navMain} />
        <Image src={grayDivider} alt="Divider" className="w-full h-[2px]" />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}
