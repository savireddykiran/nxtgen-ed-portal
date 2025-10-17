import { GraduationCap, Home, BookOpen, FileText, Award, MessageSquare, Settings, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AppSidebarProps {
  role: string;
}

export function AppSidebar({ role }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const teacherMenuItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Courses", url: "/courses", icon: BookOpen },
    { title: "Assignments", url: "/assignments", icon: FileText },
    { title: "Grades", url: "/grades", icon: Award },
    { title: "Discussions", url: "/discussions", icon: MessageSquare },
  ];

  const studentMenuItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Courses", url: "/courses", icon: BookOpen },
    { title: "My Courses", url: "/my-courses", icon: BookOpen },
    { title: "Assignments", url: "/my-assignments", icon: FileText },
    { title: "Grades", url: "/my-grades", icon: Award },
    { title: "Discussions", url: "/discussions", icon: MessageSquare },
  ];

  const menuItems = role === "teacher" ? teacherMenuItems : studentMenuItems;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <div className="p-4 flex items-center gap-2 border-b">
          <GraduationCap className="h-8 w-8 text-primary" />
          {!collapsed && <span className="text-xl font-bold">Nxtgen LMS</span>}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && "Main Menu"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/settings">
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
