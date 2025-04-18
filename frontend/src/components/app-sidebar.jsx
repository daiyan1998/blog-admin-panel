import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronUp, LogOut, Mail, Rss, Shield, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuthStore } from "@/store";

const data = {
  navMain: [
    {
      title: "Blogs",
      url: "#",
      icon: <Rss />,
      items: [
        {
          title: "List",
          url: "/blogs",
        },
        {
          title: "Create",
          url: "/blogs/create",
        },
      ],
    },
    {
      title: "Users",
      // url: "#",
      icon: <User2 />,
      items: [
        {
          title: "List",
          url: "/users",
        },
        {
          title: "Create",
          url: "/users/create",
        },
      ],
    },
    {
      title: "Categories",
      url: "/categories",
      icon: <User2 />,
    },
    {
      title: "Tags",
      url: "/tags",
      icon: <User2 />,
    },
    {
      title: "Our Members",
      url: "/members",
      icon: <User2 />,
      // items: [
      //   {
      //     title: "List",
      //     url: "/teams",
      //   },
      //   {
      //     title: "Create",
      //     url: "/teams/create",
      //   },
      // ],
    },
    {
      title: "Mail",
      url: "/mails",
      icon: <Mail />,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 font-semibold text-2xl">
          <Shield />
          <div>{user?.role}</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        <SidebarMenu>
          {data.navMain.map((item) => (
            <Collapsible key={item.title}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <Link to={item.url}>
                    <SidebarMenuButton>
                      {item.icon}
                      {item.title}
                    </SidebarMenuButton>
                  </Link>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      {item.items?.map((item) => (
                        <Link key={item.title} to={item.url}>
                          <SidebarMenuSubButton asChild>
                            <span>{item.title}</span>
                          </SidebarMenuSubButton>
                        </Link>
                      ))}
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="flex gap-2">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout(navigate)}>
                  <span>
                    <LogOut className="mr-2 inline-block h-4 w-4" /> Sign out
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
