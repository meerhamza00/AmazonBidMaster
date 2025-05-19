import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
  useFormField,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// Enhanced form label with optional tooltip
interface ThemedLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  tooltip?: string;
  required?: boolean;
  className?: string;
}

export function ThemedLabel({ 
  htmlFor, 
  children, 
  tooltip, 
  required = false,
  className 
}: ThemedLabelProps) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <Label 
        htmlFor={htmlFor} 
        className={cn(
          "text-sm font-medium",
          className
        )}
      >
        {children}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {tooltip && (
        <div className="relative group">
          <div className="cursor-help text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50">
            <div className="bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg max-w-xs">
              {tooltip}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced text input with validation styling
interface ThemedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  tooltip?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
}

export function ThemedInput({
  label,
  tooltip,
  error,
  success,
  helperText,
  required,
  wrapperClassName,
  className,
  id,
  ...props
}: ThemedInputProps) {
  const { isDark } = useTheme();
  
  return (
    <div className={cn("space-y-1", wrapperClassName)}>
      {label && (
        <ThemedLabel 
          htmlFor={id} 
          tooltip={tooltip}
          required={required}
        >
          {label}
        </ThemedLabel>
      )}
      <Input
        id={id}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive/30",
          success && "border-green-500 focus-visible:ring-green-500/30",
          className
        )}
        aria-invalid={!!error}
        aria-required={required}
        {...props}
      />
      {(error || helperText) && (
        <div className="flex items-start gap-1 mt-1">
          {error && <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />}
          {success && <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />}
          <p className={cn(
            "text-xs",
            error ? "text-destructive" : "text-muted-foreground",
            success && !error && "text-green-500"
          )}>
            {error || helperText}
          </p>
        </div>
      )}
    </div>
  );
}

// Enhanced textarea with validation styling
interface ThemedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  tooltip?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
}

export function ThemedTextarea({
  label,
  tooltip,
  error,
  success,
  helperText,
  required,
  wrapperClassName,
  className,
  id,
  ...props
}: ThemedTextareaProps) {
  return (
    <div className={cn("space-y-1", wrapperClassName)}>
      {label && (
        <ThemedLabel 
          htmlFor={id} 
          tooltip={tooltip}
          required={required}
        >
          {label}
        </ThemedLabel>
      )}
      <Textarea
        id={id}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive/30",
          success && "border-green-500 focus-visible:ring-green-500/30",
          className
        )}
        aria-invalid={!!error}
        aria-required={required}
        {...props}
      />
      {(error || helperText) && (
        <div className="flex items-start gap-1 mt-1">
          {error && <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />}
          {success && <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />}
          <p className={cn(
            "text-xs",
            error ? "text-destructive" : "text-muted-foreground",
            success && !error && "text-green-500"
          )}>
            {error || helperText}
          </p>
        </div>
      )}
    </div>
  );
}

// Enhanced select with validation styling
interface ThemedSelectProps {
  label?: string;
  tooltip?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
  className?: string;
  id?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
}

export function ThemedSelect({
  label,
  tooltip,
  error,
  success,
  helperText,
  required,
  wrapperClassName,
  className,
  id,
  value,
  onValueChange,
  placeholder,
  options,
  disabled,
}: ThemedSelectProps) {
  return (
    <div className={cn("space-y-1", wrapperClassName)}>
      {label && (
        <ThemedLabel 
          htmlFor={id} 
          tooltip={tooltip}
          required={required}
        >
          {label}
        </ThemedLabel>
      )}
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger 
          id={id}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive/30",
            success && "border-green-500 focus-visible:ring-green-500/30",
            className
          )}
          aria-invalid={!!error}
          aria-required={required}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(error || helperText) && (
        <div className="flex items-start gap-1 mt-1">
          {error && <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />}
          {success && <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />}
          <p className={cn(
            "text-xs",
            error ? "text-destructive" : "text-muted-foreground",
            success && !error && "text-green-500"
          )}>
            {error || helperText}
          </p>
        </div>
      )}
    </div>
  );
}

// Enhanced checkbox with validation styling
interface ThemedCheckboxProps {
  label?: string;
  tooltip?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
  className?: string;
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function ThemedCheckbox({
  label,
  tooltip,
  error,
  success,
  helperText,
  required,
  wrapperClassName,
  className,
  id,
  checked,
  onCheckedChange,
  disabled,
}: ThemedCheckboxProps) {
  return (
    <div className={cn("space-y-1", wrapperClassName)}>
      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive/30",
            success && "border-green-500 focus-visible:ring-green-500/30",
            className
          )}
          aria-invalid={!!error}
          aria-required={required}
        />
        {label && (
          <label 
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
            {tooltip && (
              <span className="relative group ml-1">
                <span className="cursor-help text-muted-foreground">
                  <AlertCircle className="inline h-3 w-3" />
                </span>
                <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50">
                  <span className="bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg max-w-xs">
                    {tooltip}
                  </span>
                </span>
              </span>
            )}
          </label>
        )}
      </div>
      {(error || helperText) && (
        <div className="flex items-start gap-1 mt-1 ml-6">
          {error && <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />}
          {success && <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />}
          <p className={cn(
            "text-xs",
            error ? "text-destructive" : "text-muted-foreground",
            success && !error && "text-green-500"
          )}>
            {error || helperText}
          </p>
        </div>
      )}
    </div>
  );
}

// Enhanced switch with validation styling
interface ThemedSwitchProps {
  label?: string;
  tooltip?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  required?: boolean;
  wrapperClassName?: string;
  className?: string;
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function ThemedSwitch({
  label,
  tooltip,
  error,
  success,
  helperText,
  required,
  wrapperClassName,
  className,
  id,
  checked,
  onCheckedChange,
  disabled,
}: ThemedSwitchProps) {
  return (
    <div className={cn("space-y-1", wrapperClassName)}>
      <div className="flex items-center justify-between">
        {label && (
          <label 
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
          >
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
            {tooltip && (
              <span className="relative group">
                <span className="cursor-help text-muted-foreground">
                  <AlertCircle className="inline h-3 w-3" />
                </span>
                <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50">
                  <span className="bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg max-w-xs">
                    {tooltip}
                  </span>
                </span>
              </span>
            )}
          </label>
        )}
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive/30",
            success && "border-green-500 focus-visible:ring-green-500/30",
            className
          )}
          aria-invalid={!!error}
          aria-required={required}
        />
      </div>
      {(error || helperText) && (
        <div className="flex items-start gap-1 mt-1">
          {error && <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />}
          {success && <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />}
          <p className={cn(
            "text-xs",
            error ? "text-destructive" : "text-muted-foreground",
            success && !error && "text-green-500"
          )}>
            {error || helperText}
          </p>
        </div>
      )}
    </div>
  );
}