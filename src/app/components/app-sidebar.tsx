"use client"

import * as React from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  GalleryHorizontal,
  Sparkles,
  Building2,
  HelpCircle,
  MessageSquareText,
  Star,
  Users,
} from "lucide-react"

import { NavMain } from "@/app/components/nav-main"
import { NavUser } from "@/app/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/app/components/ui/sidebar"

const navMain = [
  { title: "대시보드", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "메인 페이지", url: "/admin/hero", icon: GalleryHorizontal },
  { title: "포트폴리오", url: "/admin/works", icon: GalleryHorizontal },
  { title: "서비스 소개", url: "/admin/services", icon: Sparkles },
  { title: "회사소개", url: "/admin/about", icon: Building2 },
  { title: "FAQ", url: "/admin/faq", icon: HelpCircle },
  { title: "고객후기", url: "/admin/reviews", icon: Star },
  { title: "견적 문의", url: "/admin/inquiries", icon: MessageSquareText },
  { title: "관리자 계정", url: "/admin/users", icon: Users },
]

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar?: string | null }
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">인테리어 스튜디오</span>
                  <span className="truncate text-xs">관리자</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
