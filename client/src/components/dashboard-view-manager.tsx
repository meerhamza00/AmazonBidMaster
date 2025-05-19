import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, ChevronDown, Trash, Edit, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export interface DashboardView {
  id: string;
  name: string;
  layout: any[];
  filters: Record<string, any>;
  isDefault?: boolean;
}

interface DashboardViewManagerProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  onSaveCurrentView: (name: string) => DashboardView;
}

export function DashboardViewManager({
  currentView,
  onViewChange,
  onSaveCurrentView,
}: DashboardViewManagerProps) {
  const [views, setViews] = useState<DashboardView[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [editingView, setEditingView] = useState<DashboardView | null>(null);
  const { toast } = useToast();

  // Load saved views from localStorage on mount
  useEffect(() => {
    const savedViews = localStorage.getItem('dashboardViews');
    if (savedViews) {
      try {
        const parsedViews = JSON.parse(savedViews);
        setViews(parsedViews);
      } catch (error) {
        console.error('Error loading saved dashboard views:', error);
      }
    } else {
      // Initialize with default view
      const defaultView: DashboardView = {
        id: 'default',
        name: 'Default View',
        layout: [],
        filters: {},
        isDefault: true
      };
      setViews([defaultView]);
    }
  }, []);

  // Save views to localStorage whenever they change
  useEffect(() => {
    if (views.length > 0) {
      localStorage.setItem('dashboardViews', JSON.stringify(views));
    }
  }, [views]);

  const handleCreateView = () => {
    if (!newViewName.trim()) {
      toast({
        title: "View name required",
        description: "Please enter a name for your new view.",
        variant: "destructive"
      });
      return;
    }

    const newView = onSaveCurrentView(newViewName);
    setViews([...views, newView]);
    setIsCreateDialogOpen(false);
    setNewViewName('');
    
    toast({
      title: "View created",
      description: `"${newViewName}" has been saved.`
    });
  };

  const handleUpdateView = () => {
    if (!editingView || !editingView.name.trim()) {
      toast({
        title: "View name required",
        description: "Please enter a name for your view.",
        variant: "destructive"
      });
      return;
    }

    const updatedViews = views.map(view => 
      view.id === editingView.id ? { ...editingView } : view
    );
    
    setViews(updatedViews);
    setIsEditDialogOpen(false);
    setEditingView(null);
    
    toast({
      title: "View updated",
      description: `"${editingView.name}" has been updated.`
    });
  };

  const handleDeleteView = (viewId: string) => {
    const viewToDelete = views.find(view => view.id === viewId);
    if (!viewToDelete) return;
    
    if (viewToDelete.isDefault) {
      toast({
        title: "Cannot delete default view",
        description: "The default view cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedViews = views.filter(view => view.id !== viewId);
    setViews(updatedViews);
    
    // If the current view is deleted, switch to default
    if (currentView.id === viewId) {
      const defaultView = updatedViews.find(view => view.isDefault) || updatedViews[0];
      onViewChange(defaultView);
    }
    
    toast({
      title: "View deleted",
      description: `"${viewToDelete.name}" has been deleted.`
    });
  };

  const handleEditView = (view: DashboardView) => {
    setEditingView(view);
    setIsEditDialogOpen(true);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-1">
            {currentView.name}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {views.map(view => (
            <DropdownMenuItem
              key={view.id}
              onClick={() => onViewChange(view)}
              className="flex justify-between items-center"
            >
              <span>{view.name}</span>
              {!view.isDefault && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditView(view);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteView(view.id);
                    }}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Create New View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const updatedView = onSaveCurrentView(currentView.name);
              const updatedViews = views.map(view => 
                view.id === updatedView.id ? updatedView : view
              );
              setViews(updatedViews);
              
              toast({
                title: "View updated",
                description: `"${currentView.name}" has been updated with current settings.`
              });
            }}
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            Save Current View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create View Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New View</DialogTitle>
            <DialogDescription>
              Save your current dashboard layout and filters as a new view.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">View Name</Label>
              <Input
                id="name"
                placeholder="My Custom View"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateView}>
              Create View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit View Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit View</DialogTitle>
            <DialogDescription>
              Update the name of your saved view.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">View Name</Label>
              <Input
                id="edit-name"
                value={editingView?.name || ''}
                onChange={(e) => setEditingView(prev => prev ? { ...prev, name: e.target.value } : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateView}>
              Update View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}