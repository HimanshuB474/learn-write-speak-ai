
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Menu, 
  X, 
  Home, 
  PenTool, 
  BarChart3,
  LogIn,
  UserPlus,
  User
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Mock authentication state - replace with actual auth later
  const isAuthenticated = false;

  const navItems = [
    { name: "Home", path: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Write & Speak", path: "/write-speak", icon: <PenTool className="h-5 w-5" /> },
    { name: "Dashboard", path: "/dashboard", icon: <BarChart3 className="h-5 w-5" />, authRequired: true },
  ];

  const authItems = isAuthenticated 
    ? [
        { name: "Profile", path: "/profile", icon: <User className="h-5 w-5" /> }
      ]
    : [
        { name: "Login", path: "/login", icon: <LogIn className="h-5 w-5" /> },
        { name: "Register", path: "/register", icon: <UserPlus className="h-5 w-5" /> }
      ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 border-b bg-card shadow-sm">
        <div className="container flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold">LearningAid</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => {
              if (item.authRequired && !isAuthenticated) return null;
              return (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={cn(
                    "flex items-center space-x-1 py-2 text-base transition-colors",
                    isActive(item.path) 
                      ? "text-accent font-medium" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {authItems.map(item => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={cn(
                  "flex items-center space-x-1 py-2 text-base transition-colors",
                  isActive(item.path) 
                    ? "text-accent font-medium" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 flex flex-col md:hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold">LearningAid</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <nav className="flex flex-col p-6 space-y-6">
            {navItems.map((item) => {
              if (item.authRequired && !isAuthenticated) return null;
              return (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={cn(
                    "flex items-center space-x-3 py-2 text-lg",
                    isActive(item.path) 
                      ? "text-accent font-medium" 
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            <div className="border-t pt-6"></div>
            
            {authItems.map(item => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={cn(
                  "flex items-center space-x-3 py-2 text-lg",
                  isActive(item.path) 
                    ? "text-accent font-medium" 
                    : "text-muted-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-grow container py-8 px-4 md:px-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t bg-muted">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LearningAid. An AI-powered tool for dyslexia and learning disabilities.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
