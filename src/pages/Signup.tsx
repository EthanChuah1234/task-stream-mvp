import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const benefits = [
    'Unlimited projects and tasks',
    'Beautiful kanban boards',
    'Real-time progress tracking',
    'Works offline',
    'No credit card required',
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left side - Benefits */}
        <div className="hidden lg:block space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">ProjectMate</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              Start organizing your projects{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                beautifully
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join thousands of students, developers, and creators who've transformed their productivity with ProjectMate.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">What you get for free:</h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-card p-6 rounded-2xl shadow-card border border-border/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">5,000+</div>
              <div className="text-sm text-muted-foreground">Happy users already organizing their life</div>
            </div>
          </div>
        </div>

        {/* Right side - Signup Form */}
        <div className="w-full max-w-md mx-auto animate-scale-in">
          <Card className="bg-gradient-card shadow-hover border-border/50">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/')}
                  className="hover:bg-accent p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="lg:hidden flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-foreground">ProjectMate</span>
                </div>
              </div>
              <div className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Create your account
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Start your journey to better project management
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary hover:opacity-90 text-white py-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              <div className="relative">
                <Separator className="bg-border" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-card px-3 text-sm text-muted-foreground">or</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full py-3 border-border hover:bg-accent"
                onClick={() => navigate('/dashboard')}
              >
                Try Demo First
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>

              {/* Mobile benefits */}
              <div className="lg:hidden pt-4 border-t border-border/50">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">What's included:</h4>
                  {benefits.slice(0, 3).map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}