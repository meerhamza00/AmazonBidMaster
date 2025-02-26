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
} from "@/components/ui/dialog";
import RuleEditor from "@/components/rule-editor";
import { Plus, AlertCircle } from "lucide-react";

export default function Rules() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const { toast } = useToast();

  // Fetch rules
  const { data: rules = [], isLoading } = useQuery<Rule[]>({
    queryKey: ["/api/rules"],
  });

  // Create rule mutation
  const createRule = useMutation({
    mutationFn: async (rule: InsertRule) => {
      const res = await apiRequest("POST", "/api/rules", rule);
      return res.json();
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
      const res = await apiRequest("PATCH", `/api/rules/${id}`, rule);
      return res.json();
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bid Optimization Rules</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage rules for automatic bid adjustments
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {rules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-center">No rules found</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Create your first rule to start optimizing bids automatically
            </p>
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
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell className="capitalize">
                      {rule.conditions[0]?.conditions[0]?.metric || '-'}
                    </TableCell>
                    <TableCell>
                      {rule.conditions[0]?.conditions[0]?.operator?.replace("_", " ") || '-'}
                    </TableCell>
                    <TableCell>
                      {rule.conditions[0]?.conditions[0]?.value || 0}%
                    </TableCell>
                    <TableCell>{rule.adjustment}%</TableCell>
                    <TableCell>
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => handleToggleRule(rule)}
                        className="data-[state=checked]:bg-primary"
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create Rule Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Rule</DialogTitle>
          </DialogHeader>
          <RuleEditor onSubmit={(data) => createRule.mutate(data)} />
        </DialogContent>
      </Dialog>

      {/* Edit Rule Dialog */}
      <Dialog
        open={editingRule !== null}
        onOpenChange={(open) => !open && setEditingRule(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
          </DialogHeader>
          {editingRule && (
            <RuleEditor
              defaultValues={editingRule}
              onSubmit={(data) =>
                updateRule.mutate({ id: editingRule.id, rule: data })
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}