import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        info: "border-blue-200 text-blue-800 dark:border-blue-800 dark:text-blue-200 [&>svg]:text-blue-500 bg-blue-50 dark:bg-blue-950/50",
        success: "border-green-200 text-green-800 dark:border-green-800 dark:text-green-200 [&>svg]:text-green-500 bg-green-50 dark:bg-green-950/50",
        warning: "border-yellow-200 text-yellow-800 dark:border-yellow-800 dark:text-yellow-200 [&>svg]:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/50",
        error: "border-red-200 text-red-800 dark:border-red-800 dark:text-red-200 [&>svg]:text-red-500 bg-red-50 dark:bg-red-950/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ThemedAlertProps {
  title?: string;
  description?: React.ReactNode;
  variant?: "default" | "info" | "success" | "warning" | "error";
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function ThemedAlert({
  title,
  description,
  variant = "default",
  icon,
  onClose,
  className,
  children,
}: ThemedAlertProps) {
  const { isDark } = useTheme();
  
  // Default icons based on variant
  const defaultIcon = React.useMemo(() => {
    switch (variant) {
      case "info":
        return <Info className="h-5 w-5" />;
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "error":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return null;
    }
  }, [variant]);

  return (
    <div
      className={cn(
        alertVariants({ variant }),
        onClose && "pr-10",
        className
      )}
      role="alert"
    >
      {icon || defaultIcon}
      <div className="flex flex-col gap-1">
        {title && (
          <h5 className="font-medium leading-none tracking-tight">
            {title}
          </h5>
        )}
        {description && (
          <div className="text-sm [&_p]:leading-relaxed">
            {description}
          </div>
        )}
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full p-1 text-foreground/50 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// Toast notification component
interface ThemedToastProps {
  title: string;
  description?: React.ReactNode;
  variant?: "default" | "info" | "success" | "warning" | "error";
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  duration?: number; // in milliseconds
}

export function ThemedToast({
  title,
  description,
  variant = "default",
  icon,
  onClose,
  className,
  duration = 5000,
}: ThemedToastProps) {
  const { isDark } = useTheme();
  const [visible, setVisible] = React.useState(true);
  
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  if (!visible) return null;
  
  // Default icons based on variant
  const defaultIcon = React.useMemo(() => {
    switch (variant) {
      case "info":
        return <Info className="h-5 w-5" />;
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "error":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return null;
    }
  }, [variant]);

  return (
    <div
      className={cn(
        "max-w-sm rounded-lg border shadow-lg",
        variant === "info" && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50",
        variant === "success" && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50",
        variant === "warning" && "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/50",
        variant === "error" && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50",
        variant === "default" && "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        "animate-in slide-in-from-top-full duration-300",
        className
      )}
      role="alert"
    >
      <div className="flex p-4">
        {(icon || defaultIcon) && (
          <div className="flex-shrink-0 mr-3">
            {icon || defaultIcon}
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-medium text-sm">
            {title}
          </h4>
          {description && (
            <div className="mt-1 text-sm opacity-90">
              {description}
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={() => {
              setVisible(false);
              if (onClose) onClose();
            }}
            className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {duration > 0 && (
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-300 ease-linear",
              variant === "info" && "bg-blue-500",
              variant === "success" && "bg-green-500",
              variant === "warning" && "bg-yellow-500",
              variant === "error" && "bg-red-500",
              variant === "default" && "bg-gray-500"
            )}
            style={{ 
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      )}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}