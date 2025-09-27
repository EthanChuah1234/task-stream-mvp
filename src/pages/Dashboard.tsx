import { ProjectCard } from '@/components/ProjectCard';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { XPDisplay } from '@/components/gamification/XPDisplay';
import { useProjects } from '@/hooks/useProjects';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Target } from 'lucide-react';

export default function Dashboard() {
  const { projects, createProject } = useProjects();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleCreateProject = (name: string, description: string) => {
    const newProject = createProject(name, description);
    navigate(`/project/${newProject.id}`);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome to ProjectMate
              </h1>
              <p className="text-muted-foreground">
                Organize your projects and stay on top of your tasks
              </p>
            </div>
            <div className="flex gap-4 items-start">
              {profile && <XPDisplay profile={profile} />}
              <CreateProjectDialog onCreateProject={handleCreateProject} />
            </div>
          </div>
          
          {projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project.id)}
                />
              ))}
            </div>
          )}
          
          {projects.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gradient-card shadow-card rounded-lg p-8 max-w-md mx-auto border-border/50">
                <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Start Your First Project
                </h2>
                <p className="text-muted-foreground mb-6">
                  Create a project to organize your tasks and track your progress with our intuitive Kanban board.
                </p>
                <CreateProjectDialog onCreateProject={handleCreateProject} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}