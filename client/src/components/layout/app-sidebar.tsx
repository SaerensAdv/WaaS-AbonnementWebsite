import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  FolderKanban,
  Puzzle,
  FileText,
  CreditCard,
  Settings,
  Users,
  UserCog,
  Layers,
  ClipboardList,
  LogOut,
  ChevronUp,
  Globe,
} from "lucide-react";

const customerMenuItems = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard },
  { title: "Mijn Project", url: "/app/project", icon: FolderKanban },
  { title: "Add-ons", url: "/app/addons", icon: Puzzle },
  { title: "Rapporten", url: "/app/reports", icon: FileText },
  { title: "Facturatie", url: "/app/billing", icon: CreditCard },
];

const adminMenuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Klanten", url: "/admin/customers", icon: Users },
  { title: "Projecten", url: "/admin/projects", icon: FolderKanban },
  { title: "Specialisten", url: "/admin/specialists", icon: UserCog },
  { title: "Plannen", url: "/admin/plans", icon: Layers },
  { title: "Add-ons", url: "/admin/addons", icon: Puzzle },
  { title: "Templates", url: "/admin/templates", icon: ClipboardList },
  { title: "Instellingen", url: "/admin/settings", icon: Settings },
];

const specialistMenuItems = [
  { title: "Dashboard", url: "/specialist", icon: LayoutDashboard },
  { title: "Toewijzingen", url: "/specialist/assignments", icon: ClipboardList },
  { title: "Rapporten", url: "/specialist/reports", icon: FileText },
  { title: "Profiel", url: "/specialist/profile", icon: Settings },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case "ADMIN":
        return adminMenuItems;
      case "SPECIALIST":
        return specialistMenuItems;
      default:
        return customerMenuItems;
    }
  };

  const menuItems = getMenuItems();
  const roleLabel = user?.role === "ADMIN" ? "Admin" : user?.role === "SPECIALIST" ? "Specialist" : "Klant";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Globe className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">WebsiteAbonnementen</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{roleLabel} Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                  >
                    <Link href={item.url} data-testid={`sidebar-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 px-2" data-testid="button-user-menu">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col items-start text-left">
                <span className="text-sm font-medium truncate max-w-[140px]">{user?.name}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user?.email}</span>
              </div>
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/app/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Instellingen
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-destructive focus:text-destructive"
              data-testid="button-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Uitloggen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
