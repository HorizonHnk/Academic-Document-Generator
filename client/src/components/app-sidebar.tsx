import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Home,
  FolderOpen,
  FileText,
  Presentation,
  BookOpen,
  GraduationCap,
  Sparkles,
  Info,
  Mail,
  Settings,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";
import { onAuthChange, signOut } from "@/lib/firebase";
import type { User as FirebaseUser } from "firebase/auth";
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
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "My Projects",
    url: "/projects",
    icon: FolderOpen,
  },
];

const generatorItems = [
  {
    title: "Technical Report",
    url: "/generate/report",
    icon: FileText,
    description: "BET-standard format",
  },
  {
    title: "PowerPoint",
    url: "/generate/powerpoint",
    icon: Presentation,
    description: "Professional slides",
  },
  {
    title: "Conference Paper",
    url: "/generate/conference",
    icon: BookOpen,
    description: "IEEE format",
  },
  {
    title: "Thesis",
    url: "/generate/thesis",
    icon: GraduationCap,
    description: "Harvard citations",
  },
];

const supportItems = [
  {
    title: "About",
    url: "/about",
    icon: Info,
  },
  {
    title: "Contact",
    url: "/contact",
    icon: Mail,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { setOpenMobile, isMobile } = useSidebar();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2" onClick={handleNavClick}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">PaperGen AI</span>
            <span className="text-xs text-muted-foreground">Academic Documents</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url} onClick={handleNavClick}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Document Generators</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generatorItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url} onClick={handleNavClick}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={item.url} onClick={handleNavClick}>
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

      <SidebarFooter className="p-4 space-y-3">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <User className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.displayName || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={handleSignOut}
              data-testid="button-sign-out"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => setShowAuthDialog(true)}
            data-testid="button-sign-in"
          >
            <LogIn className="h-4 w-4" />
            Sign In / Sign Up
          </Button>
        )}
      </SidebarFooter>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </Sidebar>
  );
}
