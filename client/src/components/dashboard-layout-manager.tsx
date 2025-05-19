import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableWidget } from '@/components/ui/draggable-widget';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type WidgetConfig = {
  id: string;
  type: string;
  title: string;
  visible: boolean;
  props?: Record<string, any>;
};

interface DashboardLayoutManagerProps {
  defaultLayout: WidgetConfig[];
  renderWidget: (widget: WidgetConfig, index: number) => React.ReactNode;
  onLayoutChange?: (layout: WidgetConfig[]) => void;
}

export function DashboardLayoutManager({
  defaultLayout,
  renderWidget,
  onLayoutChange
}: DashboardLayoutManagerProps) {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(defaultLayout);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  // Load saved layout from localStorage on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboardLayout');
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        setWidgets(parsedLayout);
      } catch (error) {
        console.error('Error loading saved dashboard layout:', error);
      }
    }
  }, []);

  // Move widget in the array
  const moveWidget = (dragIndex: number, hoverIndex: number) => {
    const draggedWidget = widgets[dragIndex];
    const newWidgets = [...widgets];
    newWidgets.splice(dragIndex, 1);
    newWidgets.splice(hoverIndex, 0, draggedWidget);
    
    setWidgets(newWidgets);
    setHasChanges(true);
  };

  // Toggle widget visibility
  const toggleWidgetVisibility = (id: string) => {
    const newWidgets = widgets.map(widget => 
      widget.id === id ? { ...widget, visible: !widget.visible } : widget
    );
    
    setWidgets(newWidgets);
    setHasChanges(true);
  };

  // Save layout
  const saveLayout = () => {
    localStorage.setItem('dashboardLayout', JSON.stringify(widgets));
    if (onLayoutChange) {
      onLayoutChange(widgets);
    }
    setHasChanges(false);
    toast({
      title: "Dashboard layout saved",
      description: "Your custom dashboard layout has been saved."
    });
  };

  // Reset to default layout
  const resetLayout = () => {
    setWidgets(defaultLayout);
    localStorage.removeItem('dashboardLayout');
    setHasChanges(true);
    toast({
      title: "Dashboard layout reset",
      description: "Dashboard has been reset to the default layout."
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          {isEditMode && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetLayout}
                className="gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={saveLayout}
                disabled={!hasChanges}
                className="gap-1"
              >
                <Save className="h-4 w-4" />
                Save Layout
              </Button>
            </>
          )}
          <Button 
            variant={isEditMode ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? "Done" : "Customize Dashboard"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets
          .filter(widget => widget.visible)
          .map((widget, index) => (
            <DraggableWidget
              key={widget.id}
              id={widget.id}
              index={index}
              moveWidget={moveWidget}
              className={isEditMode ? "border-2 border-dashed border-primary/50 rounded-lg" : ""}
            >
              {renderWidget(widget, index)}
              {isEditMode && (
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleWidgetVisibility(widget.id)}
                  >
                    Hide
                  </Button>
                </div>
              )}
            </DraggableWidget>
          ))}
      </div>

      {isEditMode && (
        <div className="mt-8 p-4 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-4">Hidden Widgets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets
              .filter(widget => !widget.visible)
              .map((widget) => (
                <div 
                  key={widget.id}
                  className="p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex justify-between items-center">
                    <span>{widget.title}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWidgetVisibility(widget.id)}
                    >
                      Show
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </DndProvider>
  );
}