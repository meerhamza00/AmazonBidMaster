import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Rule, type InsertRule } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RuleEditor from "@/components/rule-editor";
import AdvancedRuleEditor from "@/components/advanced-rule-editor";
import AdvancedFeatures from "@/components/advanced-features";
import { 
  Plus, 
  AlertCircle, 
  Sparkles, 
  ClipboardList, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Clock, 
  BarChart4,
  Settings,
  ChevronRight,
  Zap,
  Stars
} from "lucide-react";

export default function Rules() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();

  // Fetch rules
  const { data: rules = [], isLoading } = useQuery<Rule[]>({
    queryKey: ["/api/rules"],
  });

  // Create rule mutation
  const createRule = useMutation({
    mutationFn: async (rule: InsertRule) => {
      const response = await apiRequest("POST", "/api/rules", rule);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rules"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Rule created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create rule",
        variant: "destructive",
      });
    },
  });

  // Update rule mutation
  const updateRule = useMutation({
    mutationFn: async ({ id, rule }: { id: number; rule: Partial<Rule> }) => {
      const response = await apiRequest("PATCH", `/api/rules/${id}`, rule);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rules"] });
      setEditingRule(null);
      toast({
        title: "Success",
        description: "Rule updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update rule",
        variant: "destructive",
      });
    },
  });

  // Handle rule toggle
  const handleToggleRule = (rule: Rule) => {
    updateRule.mutate({
      id: rule.id,
      rule: { isActive: !rule.isActive },
    });
  };

  // Calculate active rules count
  const activeRulesCount = rules.filter(rule => rule.isActive).length;
  
  // Calculate rule performance stats
  const calculateRuleStats = () => {
    if (rules.length === 0) return { improved: 0, neutral: 0, decreased: 0 };
    
    // In a real app, this would come from actual performance data
    return {
      improved: Math.floor(rules.length * 0.6),
      neutral: Math.floor(rules.length * 0.3),
      decreased: Math.floor(rules.length * 0.1)
    };
  };
  
  const stats = calculateRuleStats();

  if (isLoading) {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rule-Based Optimization</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage intelligent automation rules for your campaigns
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>
      
      {/* Rules Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Rules</p>
                <h3 className="text-2xl font-bold mt-1">{rules.length}</h3>
              </div>
              <ClipboardList className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active Rules</p>
                <h3 className="text-2xl font-bold mt-1">{activeRulesCount}</h3>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Performance Improved</p>
                <h3 className="text-2xl font-bold mt-1 flex items-center">
                  {stats.improved}
                  <span className="text-green-500 ml-2 text-sm">
                    <ArrowUpCircle className="h-4 w-4 inline" />
                  </span>
                </h3>
              </div>
              <BarChart4 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Performance Decreased</p>
                <h3 className="text-2xl font-bold mt-1 flex items-center">
                  {stats.decreased}
                  <span className="text-red-500 ml-2 text-sm">
                    <ArrowDownCircle className="h-4 w-4 inline" />
                  </span>
                </h3>
              </div>
              <BarChart4 className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Basic Rules</TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Advanced Features
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-8">
          {rules.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-center">No rules found</p>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Create your first rule to start optimizing bids automatically
                </p>
                <Button className="mt-6 bg-orange-500 hover:bg-orange-600" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first rule
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Active Rules</CardTitle>
                <CardDescription>
                  Rules are evaluated in order for each campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Metric</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Threshold</TableHead>
                      <TableHead>Adjustment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((rule) => {
                      // Type casting to handle the unknown type
                      const conditions = rule.conditions as any[];
                      const metric = conditions?.[0]?.conditions?.[0]?.metric || '-';
                      const operator = conditions?.[0]?.conditions?.[0]?.operator?.replace("_", " ") || '-';
                      const value = conditions?.[0]?.conditions?.[0]?.value || 0;
                      
                      return (
                        <TableRow key={rule.id}>
                          <TableCell className="font-medium">{rule.name}</TableCell>
                          <TableCell className="capitalize">
                            {metric}
                          </TableCell>
                          <TableCell>
                            {operator}
                          </TableCell>
                          <TableCell>
                            {value}%
                          </TableCell>
                          <TableCell>{rule.adjustment}%</TableCell>
                          <TableCell>
                            <Switch
                              checked={rule.isActive}
                              onCheckedChange={() => handleToggleRule(rule)}
                              className="data-[state=checked]:bg-orange-500"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingRule(rule)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="border-t bg-black/20 px-6 py-3">
                <div className="flex items-center text-xs text-gray-400 w-full justify-between">
                  <div>Last updated: Today, 12:45 PM</div>
                  <div>
                    Rules are evaluated every hour. Next evaluation in 22 minutes.
                  </div>
                </div>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="advanced">
          <AdvancedFeatures />
        </TabsContent>
      </Tabs>

      {/* Create Rule Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Rule</DialogTitle>
            <DialogDescription>
              Configure conditions and actions for automated bid adjustments
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Editor</TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Advanced Editor
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <RuleEditor onSubmit={(data) => createRule.mutate(data)} />
            </TabsContent>
            
            <TabsContent value="advanced">
              <AdvancedRuleEditor 
                onSubmit={(data) => createRule.mutate(data)}
                campaigns={[]} 
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Dialog */}
      <Dialog
        open={editingRule !== null}
        onOpenChange={(open) => !open && setEditingRule(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
            <DialogDescription>
              Modify your rule conditions and actions
            </DialogDescription>
          </DialogHeader>
          {editingRule && (
            <Tabs defaultValue="basic">
              <TabsList className="mb-4">
                <TabsTrigger value="basic">Basic Editor</TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Advanced Editor
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <RuleEditor
                  defaultValues={editingRule as any}
                  onSubmit={(data) =>
                    updateRule.mutate({ id: editingRule.id, rule: data })
                  }
                />
              </TabsContent>
              
              <TabsContent value="advanced">
                <AdvancedRuleEditor
                  defaultValues={editingRule as any}
                  onSubmit={(data) =>
                    updateRule.mutate({ id: editingRule.id, rule: data })
                  }
                  campaigns={[]}
                />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}