import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Check } from 'lucide-react';

export function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);

  const handleThemeSelect = (themeId: typeof theme) => {
    setTheme(themeId);
    setOpen(false);
  };

  const currentTheme = themes.find(t => t.id === theme);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          {currentTheme?.name || 'Theme'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose Your Theme</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {themes.map((themeOption) => (
            <Card 
              key={themeOption.id}
              className={`cursor-pointer bg-gradient-card shadow-card hover:shadow-hover transition-all duration-200 border-2 ${
                theme === themeOption.id ? 'border-primary' : 'border-border/50'
              }`}
              onClick={() => handleThemeSelect(themeOption.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {themeOption.name}
                  </CardTitle>
                  {theme === themeOption.id && (
                    <Badge variant="default" className="gap-1">
                      <Check className="w-3 h-3" />
                      Active
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs">
                  {themeOption.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-1 mb-2">
                  {/* Theme preview colors */}
                  {themeOption.id === 'default' && (
                    <>
                      <div className="w-4 h-4 rounded-full bg-[hsl(263_70%_50%)]" />
                      <div className="w-4 h-4 rounded-full bg-[hsl(240_10%_3.9%)]" />
                      <div className="w-4 h-4 rounded-full bg-[hsl(0_0%_98%)]" />
                    </>
                  )}
                  {themeOption.id === 'neon-code' && (
                    <>
                      <div className="w-4 h-4 rounded-full bg-[hsl(280_100%_70%)]" />
                      <div className="w-4 h-4 rounded-full bg-[hsl(120_100%_50%)]" />
                      <div className="w-4 h-4 rounded-full bg-[hsl(240_100%_3%)]" />
                    </>
                  )}
                  {themeOption.id === 'ocean-breeze' && (
                    <>
                      <div className="w-4 h-4 rounded-full bg-[hsl(195_100%_50%)]" />
                      <div className="w-4 h-4 rounded-full bg-[hsl(175_100%_60%)]" />
                      <div className="w-4 h-4 rounded-full bg-[hsl(200_30%_98%)]" />
                    </>
                  )}
                  {themeOption.id === 'retro-terminal' && (
                    <>
                      <div className="w-4 h-4 rounded-full bg-[hsl(120_100%_50%)]" />
                      <div className="w-4 h-4 rounded-full bg-[hsl(120_100%_40%)]" />
                      <div className="w-4 h-4 rounded-full bg-[hsl(120_100%_2%)]" />
                    </>
                  )}
                  {themeOption.id === 'solar-sunset' && (
                    <>
                      <div className="w-4 h-4 rounded-full bg-[hsl(15_100%_60%)]" />
                      <div className="w-4 h-4 rounded-full bg-[hsl(330_100%_70%)]" />
                      <div className="w-4 h-4 rounded-full bg-[hsl(45_100%_97%)]" />
                    </>
                  )}
                  {themeOption.id === 'minimal-zen' && (
                    <>
                      <div className="w-4 h-4 rounded-full bg-[hsl(260_60%_65%)]" />
                      <div className="w-4 h-4 rounded-full bg-[hsl(200_60%_70%)]" />
                      <div className="w-4 h-4 rounded-full bg-[hsl(300_20%_99%)]" />
                    </>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Click to apply theme
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}