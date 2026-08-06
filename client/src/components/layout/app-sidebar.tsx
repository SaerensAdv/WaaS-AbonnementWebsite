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
  Puzzle,
  CreditCard,
  Settings,
  Users,
  LogOut,
  ChevronUp,
  MessageSquare,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import logoImage from "@assets/logo-abonnement-website.webp";

const customerMenuItems = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard },
  { title: "Analytics", url: "/app/analytics", icon: BarChart3 },
  { title: "Add-ons", url: "/app/addons", icon: Puzzle },
  { title: "Support", url: "/app/support", icon: MessageSquare },
  { title: "Facturatie", url: "/app/billing", icon: CreditCard },
  { title: "Instellingen", url: "/app/settings", icon: Settings },
];

const adminMenuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Klanten", url: "/admin/customers", icon: Users },
  { title: "Projectbeheer", url: "/admin/clickup", icon: ClipboardList },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const menuItems = user?.role === "ADMIN" ? adminMenuItems : customerMenuItems;
  const roleLabel = user?.role === "ADMIN" ? "Admin" : "Klant";

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
          <img
            src={logoImage}
            alt="WebsiteAbonnementen"
            className="h-8 w-8 rounded-md object-contain"
          />
          <span className="font-semibold">abonnement.website</span>
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
              <Link href={user?.role === "ADMIN" ? "/admin" : "/app/settings"} className="cursor-pointer">
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
