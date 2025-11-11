import { Moon, Sun, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface NavbarProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: string;
}

export const Navbar = ({ onRefresh, isRefreshing, lastUpdated }: NavbarProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Set dark theme by default
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-2xl">🎮</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">CS2 Tracker</h1>
              <p className="text-xs text-muted-foreground">Steam Investment Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground hidden sm:block">
              Last Updated: <span className="text-foreground font-medium">{lastUpdated}</span>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="border-primary/20 hover:bg-primary/10"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="border-primary/20 hover:bg-primary/10"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
