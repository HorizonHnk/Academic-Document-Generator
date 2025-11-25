import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Home from "@/pages/home";
import MyProjects from "@/pages/my-projects";
import GenerateReport from "@/pages/generate-report";
import GeneratePowerPoint from "@/pages/generate-powerpoint";
import GenerateConference from "@/pages/generate-conference";
import GenerateThesis from "@/pages/generate-thesis";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects" component={MyProjects} />
      <Route path="/generate/report" component={GenerateReport} />
      <Route path="/generate/powerpoint" component={GeneratePowerPoint} />
      <Route path="/generate/conference" component={GenerateConference} />
      <Route path="/generate/thesis" component={GenerateThesis} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={sidebarStyle as React.CSSProperties}>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset className="flex flex-col flex-1">
              <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div className="flex-1" />
              </header>
              <main className="flex-1 overflow-auto">
                <Router />
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
