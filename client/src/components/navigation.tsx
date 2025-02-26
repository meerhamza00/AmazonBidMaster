import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LineChart, Settings } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Amazon PPC Manager</h1>
            <div className="flex space-x-2">
              <Link 
                href="/"
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                  location === "/" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                )}
              >
                <LineChart className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/rules"
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                  location === "/rules" ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                )}
              >
                <Settings className="h-4 w-4" />
                <span>Rules</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}