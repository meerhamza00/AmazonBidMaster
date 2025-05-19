import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface DraggableWidgetProps {
  id: string;
  index: number;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
  className?: string;
}

export function DraggableWidget({
  id,
  index,
  moveWidget,
  children,
  className
}: DraggableWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'WIDGET',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveWidget(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging: isBeingDragged }, drag, dragPreview] = useDrag({
    type: 'WIDGET',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div 
      ref={dragPreview}
      className={cn(
        "relative transition-opacity",
        isBeingDragged && "opacity-50",
        className
      )}
      data-handler-id={handlerId}
    >
      <div 
        ref={ref}
        className="absolute top-4 left-4 cursor-move p-1 rounded-md hover:bg-muted z-10"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}
