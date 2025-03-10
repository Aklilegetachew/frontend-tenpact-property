"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Edit,
  PlusSquare,
  Building,
  UserPlus,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import router from "next/router";

export function DashboardSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin-dashboard",
    },
    {
      title: "Show Available Shops",
      icon: Store,
      href: "/admin-dashboard/available-shops",
    },
    {
      title: "Show Sold Shops",
      icon: Edit,
      href: "/admin-dashboard/sold-shops",
    },
    {
      title: "Add a Floor",
      icon: Building,
      href: "/admin-dashboard/add-floor",
    },
    {
      title: "Add a Shop",
      icon: PlusSquare,
      href: "/admin-dashboard/add-shop",
    },
    {
      title: "Add User (Sign Up)",
      icon: UserPlus,
      href: "/admin-dashboard/add-user",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6" />
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
