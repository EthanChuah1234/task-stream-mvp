import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Users, Zap, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroMockup from '@/assets/hero-mockup.jpg';
import kanbanIcon from '@/assets/kanban-icon.jpg';
import progressIcon from '@/assets/progress-icon.jpg';
import teamIcon from '@/assets/team-icon.jpg';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: kanbanIcon,
      title: 'Visual Kanban Boards',
      description: 'Drag and drop tasks between To-Do, In Progress, and Done. See your workflow at a glance.',
    },
    {
      icon: progressIcon,
      title: 'Smart Progress Tracking',
      description: 'Watch your projects come to life with real-time progress bars and completion statistics.',
    },
    {
      icon: teamIcon,
      title: 'Built for Creators',
      description: 'Perfect for students, developers, and small teams who want to stay organized without the complexity.',
    },
  ];

  const useCases = [
    {
      title: 'For Students',
      description: 'Track assignments, manage group projects, and never miss a deadline again.',
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      title: 'For Developers',
      description: 'Organize coding projects, track features, and manage your development workflow.',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: 'For Small Teams',
      description: 'Coordinate with teammates, share progress, and keep everyone on the same page.',
      icon: <Users className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">ProjectMate</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-gradient-primary hover:opacity-90"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Project management made{' '}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    joyful & simple
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Turn your chaotic to-do lists into beautiful, organized projects. 
                  Perfect for students, developers, and creative teams who want to stay productive without the overwhelm.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-4"
                >
                  Start Your First Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="text-lg px-8 py-4"
                >
                  See Demo
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Free to start • No credit card required • Works offline</span>
              </div>
            </div>
            <div className="animate-scale-in">
              <div className="relative">
                <img 
                  src={heroMockup} 
                  alt="ProjectMate Kanban Board Interface" 
                  className="rounded-2xl shadow-2xl border border-border/50"
                />
                <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, powerful features that help you focus on what matters most - getting things done.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border-border/50 group"
              >
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden">
                    <img 
                      src={feature.icon} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for how you actually work
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're cramming for finals, building your next app, or coordinating with your team - 
              ProjectMate adapts to your workflow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div 
                key={index}
                className="text-center p-8 rounded-2xl bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border border-border/50"
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{useCase.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform your productivity?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of students, developers, and creators who've already made the switch to organized, joyful project management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4"
              >
                Start Your First Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4"
              >
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">ProjectMate</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <button className="hover:text-foreground transition-colors">Privacy</button>
              <button className="hover:text-foreground transition-colors">Terms</button>
              <button className="hover:text-foreground transition-colors">Support</button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>© 2024 ProjectMate. Made with ❤️ for productive creators.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}