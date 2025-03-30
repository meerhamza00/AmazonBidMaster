import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LineChart, 
  Settings, 
  BookOpen, 
  DollarSign, 
  ChevronDown, 
  UserRound,
  BarChart3,
  LucideIcon
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems: NavItem[] = [
    {
      href: "/",
      label: "Dashboard",
      icon: LineChart,
    },
    {
      href: "/rules",
      label: "Optimization Rules",
      icon: Settings,
    },
    {
      href: "/#features",
      label: "Advanced Features",
      icon: DollarSign,
      badge: "NEW"
    }
  ];

  // Helper items
  const helpNavItems: NavItem[] = [
    {
      href: "/documentation",
      label: "Documentation",
      icon: BookOpen,
    },
    {
      href: "/support",
      label: "Support",
      icon: UserRound,
    }
  ];

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center mr-4 cursor-pointer">
                <BarChart3 className="h-6 w-6 text-orange-500 mr-2" />
                <h1 className="text-xl font-bold hidden sm:inline-block">Amazon PPC Optimizer</h1>
                <h1 className="text-xl font-bold sm:hidden">PPC Optimizer</h1>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {mainNavItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors relative",
                    location === item.href 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-accent/50 text-foreground/80 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="outline" className="ml-2 bg-orange-500 text-white border-none text-[10px] px-1.5 h-4">
                      {item.badge}
                    </Badge>
                  )}
                  {location === item.href && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Help dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>Help</span>
                  <ChevronDown className="h-3 w-3 ml-1 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Resources</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {helpNavItems.map((item) => (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link href={item.href} className="flex items-center cursor-pointer">
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "transition-transform",
                  mobileMenuOpen ? "rotate-90" : ""
                )}
              >
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>
                )}
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 space-y-1 border-t">
            {mainNavItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md transition-colors w-full",
                  location === item.href 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-accent/50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge className="ml-2 bg-orange-500 text-white border-none">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
            
            <div className="border-t pt-2 mt-2">
              {helpNavItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-muted-foreground hover:bg-accent/50 hover:text-foreground w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}