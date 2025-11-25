import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FileText, Presentation, FileSpreadsheet, GraduationCap, Trash2, FolderOpen, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@shared/schema";

const iconMap = {
  report: FileText,
  powerpoint: Presentation,
  conference: FileSpreadsheet,
  thesis: GraduationCap,
};

const gradientMap = {
  report: "from-blue-500 to-cyan-500",
  powerpoint: "from-orange-500 to-red-500",
  conference: "from-purple-500 to-pink-500",
  thesis: "from-green-500 to-emerald-500",
};

export default function MyProjects() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const userId = "demo-user";

  const { data: projectsResponse, isLoading } = useQuery({
    queryKey: ["/api/projects", userId],
  });

  const projects = projectsResponse?.projects || [];

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      return await apiRequest("DELETE", `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", userId] });
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const filteredProjects = projects?.filter((project: Document) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.content as any)?.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" data-testid="page-my-projects">
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Projects</h1>
          <p className="text-muted-foreground">
            Manage and access all your generated documents
          </p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-projects"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try a different search term"
                : "Start by generating your first document"}
            </p>
            {!searchQuery && (
              <Button data-testid="button-create-first-project">
                Create Your First Project
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const Icon = iconMap[project.type];
            const gradient = gradientMap[project.type];

            return (
              <Card
                key={project.id}
                className="hover-elevate transition-all duration-200"
                data-testid={`card-project-${project.id}`}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate mb-1">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {project.content.topic}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {project.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    className="w-full"
                    variant="outline"
                    data-testid={`button-load-${project.id}`}
                  >
                    Load Project
                  </Button>
                  <Button
                    className="w-full"
                    variant="ghost"
                    onClick={() => deleteProjectMutation.mutate(project.id)}
                    disabled={deleteProjectMutation.isPending}
                    data-testid={`button-delete-${project.id}`}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
