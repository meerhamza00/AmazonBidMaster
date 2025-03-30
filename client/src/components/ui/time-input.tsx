import React, { useState, useEffect, ChangeEvent } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TimeInputProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

export function TimeInput({
  value = "00:00",
  onChange,
  className,
  ...props
}: TimeInputProps) {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [hoursStr, minutesStr] = value.split(":");
      const parsedHours = parseInt(hoursStr || "0", 10);
      const parsedMinutes = parseInt(minutesStr || "0", 10);
      
      setHours(isNaN(parsedHours) ? 0 : parsedHours);
      setMinutes(isNaN(parsedMinutes) ? 0 : parsedMinutes);
    }
  }, [value]);

  // Format time as HH:MM
  const formatTime = (h: number, m: number): string => {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  // Update parent component
  const updateValue = (h: number, m: number) => {
    const newTime = formatTime(h, m);
    if (onChange) {
      onChange(newTime);
    }
  };

  // Handle manual input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.match(/^\d{0,2}:\d{0,2}$/)) {
      const [hoursStr, minutesStr] = inputValue.split(":");
      const parsedHours = parseInt(hoursStr || "0", 10);
      const parsedMinutes = parseInt(minutesStr || "0", 10);
      
      if (parsedHours >= 0 && parsedHours <= 23 && parsedMinutes >= 0 && parsedMinutes <= 59) {
        setHours(parsedHours);
        setMinutes(parsedMinutes);
        updateValue(parsedHours, parsedMinutes);
      }
    }
  };

  // Increment/decrement hours
  const adjustHours = (delta: number) => {
    let newHours = (hours + delta) % 24;
    if (newHours < 0) newHours = 23;
    setHours(newHours);
    updateValue(newHours, minutes);
  };

  // Increment/decrement minutes
  const adjustMinutes = (delta: number) => {
    let newMinutes = (minutes + delta) % 60;
    if (newMinutes < 0) newMinutes = 59;
    setMinutes(newMinutes);
    updateValue(hours, newMinutes);
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className="relative flex-1">
        <Input
          type="text"
          value={formatTime(hours, minutes)}
          onChange={handleInputChange}
          className="pr-16"
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground text-xs">
          HH:MM
        </div>
      </div>
      
      <div className="flex flex-col ml-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-md mb-1"
          onClick={() => adjustHours(1)}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-md"
          onClick={() => adjustHours(-1)}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="flex flex-col ml-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-md mb-1"
          onClick={() => adjustMinutes(5)}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-md"
          onClick={() => adjustMinutes(-5)}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}