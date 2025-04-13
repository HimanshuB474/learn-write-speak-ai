
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  User,
  LogOut,
  BookOpenCheck
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Home", path: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Write & Speak", path: "/write-speak", icon: <PenTool className="h-5 w-5" /> },
    { name: "Dashboard", path: "/dashboard", icon: <BarChart3 className="h-5 w-5" />, authRequired: true },
    { name: "Resources", path: "/resources", icon: <BookOpenCheck className="h-5 w-5" />, authRequired: true },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You have been logged out");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  const authItems = user 
    ? [
        { 
          name: "Sign Out", 
          action: handleSignOut, 
          icon: <LogOut className="h-5 w-5" /> 
        }
      ]
    : [
        { 
          name: "Login", 
          path: "/login", 
          icon: <LogIn className="h-5 w-5" /> 
        },
        { 
          name: "Register", 
          path: "/register", 
          icon: <UserPlus className="h-5 w-5" /> 
        }
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
              if (item.authRequired && !user) return null;
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
            
            {isLoading ? (
              <div className="w-20 h-5 bg-muted animate-pulse rounded"></div>
            ) : (
              authItems.map((item, index) => (
                item.path ? (
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
                ) : (
                  <Button 
                    key={item.name}
                    variant="ghost"
                    className="flex items-center space-x-1"
                    onClick={item.action}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Button>
                )
              ))
            )}
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
              if (item.authRequired && !user) return null;
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
            
            {!isLoading && authItems.map((item) => (
              item.path ? (
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
              ) : (
                <button 
                  key={item.name}
                  className="flex items-center space-x-3 py-2 text-lg text-muted-foreground"
                  onClick={() => {
                    item.action?.();
                    setIsMenuOpen(false);
                  }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              )
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
