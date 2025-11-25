import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
