
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full transition-all duration-300 hover:bg-primary/10"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="h-5 w-5 text-slate-700 transition-transform duration-300 hover:rotate-12" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
