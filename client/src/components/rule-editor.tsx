import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ruleSchema, metricOperatorSchema, timeframeSchema, type InsertRule, type Campaign, type Rule } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { PlusCircle, MinusCircle, Clock, AlertTriangle, CheckCircle2, BarChart4, ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";

interface RuleEditorProps {
  onSubmit: (data: InsertRule) => void;
  defaultValues?: Partial<InsertRule>;
}

// Interface for validation result
interface ValidationResult {
  affectedCampaigns: Campaign[];
  unaffectedCampaigns: Campaign[];
  impactSummary: {
    totalBidChange: number;
    averageBidChange: number;
    estimatedAcosDelta: number;
    estimatedRoasDelta: number;
    confidence: number;
  };
  metrics: {
    current: {
      spend: number;
      sales: number;
      acos: number;
      roas: number;
      ctr: number;
    };
    projected: {
      spend: number;
      sales: number;
      acos: number;
      roas: number;
      ctr: number;
    };
  };
  campaignImpacts: Array<{
    campaign: Campaign;
    bidChange: number;
    currentBid: number;
    newBid: number;
    metrics: {
      currentAcos: number;
      projectedAcos: number;
      currentRoas: number;
      projectedRoas: number;
      acosDelta: number;
      roasDelta: number;
    };
    confidence: number;
  }>;
  conflictingRules: Rule[];
  validationScore: number;
  warnings: string[];
}

const AVAILABLE_METRICS = [
  { value: "acos", label: "ACOS" },
  { value: "roas", label: "ROAS" },
  { value: "ctr", label: "CTR" },
  { value: "spend", label: "Spend" },
  { value: "impressions", label: "Impressions" },
  { value: "clicks", label: "Clicks" },
];

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export default function RuleEditor({ onSubmit, defaultValues }: RuleEditorProps) {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("impact");
  
  const form = useForm<InsertRule>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      name: "",
      description: "",
      conditions: [
        {
          operator: "AND",
          conditions: [
            {
              metric: "acos",
              operator: "greater_than",
              value: 0,
              timeframe: "last_24_hours",
            },
          ],
        },
      ],
      action: "decrease_bid",
      adjustment: "0",
      isActive: true,
      priority: 0,
      ...defaultValues,
    },
  });

  const { fields: conditionGroups, append: appendGroup, remove: removeGroup } = 
    useFieldArray({
      control: form.control,
      name: "conditions",
    });
    
  // Function to validate the rule
  const validateRule = async () => {
    try {
      // Check if the form is valid
      const isValid = await form.trigger();
      if (!isValid) {
        return;
      }
      
      setIsValidating(true);
      setValidationResult(null);
      
      // Get the current form values
      const formData = form.getValues();
      
      // Call the validation API
      const response = await apiRequest('/api/rules/validate', {
        method: 'POST',
        data: formData,
      });
      
      // Parse and set the validation result
      setValidationResult(response as ValidationResult);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error validating rule:', error);
      // Handle error
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rule Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            // Ensure field.value is a string
            const safeValue = typeof field.value === 'string' ? field.value : '';
            
            return (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    value={safeValue}
                  />
                </FormControl>
                <FormDescription>
                  Explain what this rule does and when it should be triggered.
                </FormDescription>
              </FormItem>
            );
          }}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Conditions</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendGroup({
                operator: "AND",
                conditions: [{ metric: "acos", operator: "greater_than", value: 0 }]
              })}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Condition Group
            </Button>
          </div>

          {conditionGroups.map((group, groupIndex) => (
            <Card key={group.id} className="relative">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Condition Group {groupIndex + 1}
                  {groupIndex > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeGroup(groupIndex)}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`conditions.${groupIndex}.operator`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Match Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select match type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AND">Match ALL conditions (AND)</SelectItem>
                          <SelectItem value="OR">Match ANY condition (OR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Individual conditions within the group */}
                {/* Add your condition fields here */}
              </CardContent>
            </Card>
          ))}
        </div>

        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="increase_bid">Increase Bid</SelectItem>
                  <SelectItem value="decrease_bid">Decrease Bid</SelectItem>
                  <SelectItem value="pause_campaign">Pause Campaign</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Rule Status</FormLabel>
                <FormDescription>
                  Enable or disable this rule
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-[#ff6b00]"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adjustment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adjustment (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.1" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0"
                  max="100"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Higher priority rules are evaluated first (0-100)
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={validateRule} 
            disabled={isValidating}
            className="w-full"
          >
            {isValidating ? (
              <>Validating...</>
            ) : (
              <>
                <BarChart4 className="h-4 w-4 mr-2" />
                Validate Rule
              </>
            )}
          </Button>
          <Button type="submit" className="w-full">Save Rule</Button>
        </div>
      </form>
      
      {/* Validation Result Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart4 className="h-5 w-5" />
              Rule Validation Results
            </DialogTitle>
            <DialogDescription>
              Analysis of how this rule will affect your campaigns.
            </DialogDescription>
          </DialogHeader>
          
          {validationResult && (
            <div className="space-y-4">
              {/* Validation Score */}
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Validation Score</h3>
                  <p className="text-sm text-muted-foreground">
                    {validationResult.validationScore >= 70 
                      ? "This rule looks good and should improve performance." 
                      : "This rule may need some adjustments."}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {validationResult.validationScore}%
                  </div>
                  <div className="text-xs uppercase">
                    {validationResult.validationScore >= 80 
                      ? "Excellent" 
                      : validationResult.validationScore >= 60 
                        ? "Good" 
                        : "Needs Review"}
                  </div>
                </div>
              </div>
              
              <Progress 
                value={validationResult.validationScore} 
                className={cn(
                  "h-2 w-full", 
                  validationResult.validationScore >= 80 ? "bg-green-500" :
                  validationResult.validationScore >= 60 ? "bg-amber-500" :
                  "bg-red-500"
                )}
              />
              
              {/* Warnings */}
              {validationResult.warnings.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warnings</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 space-y-1">
                      {validationResult.warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Tabs for different views of validation results */}
              <Tabs defaultValue="impact" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="impact">Impact Summary</TabsTrigger>
                  <TabsTrigger value="campaigns">
                    Affected Campaigns
                    <Badge variant="outline" className="ml-2">
                      {validationResult.affectedCampaigns.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="conflicts">
                    Conflicting Rules
                    <Badge variant="outline" className="ml-2">
                      {validationResult.conflictingRules.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                
                {/* Impact Summary Tab */}
                <TabsContent value="impact" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Bid Changes</CardTitle>
                        <CardDescription>
                          Average adjustment based on rule settings
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {validationResult.impactSummary.averageBidChange > 0 ? '+' : ''}
                          {validationResult.impactSummary.averageBidChange.toFixed(2)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total impact: {validationResult.impactSummary.totalBidChange.toFixed(2)}%
                          across {validationResult.affectedCampaigns.length} campaigns
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Confidence</CardTitle>
                        <CardDescription>
                          Estimated reliability of predictions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {(validationResult.impactSummary.confidence * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Based on historical data and rule complexity
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Metrics Impact</CardTitle>
                      <CardDescription>
                        Estimated changes to important performance indicators
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <h4 className="text-sm font-medium">Current ACOS</h4>
                            <div className="text-xl">
                              {validationResult.metrics.current.acos.toFixed(2)}%
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Projected ACOS</h4>
                            <div className="text-xl">
                              {validationResult.metrics.projected.acos.toFixed(2)}%
                            </div>
                            <div className={cn(
                              "text-xs",
                              validationResult.impactSummary.estimatedAcosDelta < 0 
                                ? "text-green-500" 
                                : "text-red-500"
                            )}>
                              {validationResult.impactSummary.estimatedAcosDelta > 0 ? '+' : ''}
                              {validationResult.impactSummary.estimatedAcosDelta.toFixed(2)}%
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Current ROAS</h4>
                            <div className="text-xl">
                              {validationResult.metrics.current.roas.toFixed(2)}x
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Projected ROAS</h4>
                            <div className="text-xl">
                              {validationResult.metrics.projected.roas.toFixed(2)}x
                            </div>
                            <div className={cn(
                              "text-xs",
                              validationResult.impactSummary.estimatedRoasDelta > 0 
                                ? "text-green-500" 
                                : "text-red-500"
                            )}>
                              {validationResult.impactSummary.estimatedRoasDelta > 0 ? '+' : ''}
                              {validationResult.impactSummary.estimatedRoasDelta.toFixed(2)}x
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <h4 className="text-sm font-medium">Current Spend</h4>
                            <div className="text-xl">
                              ${validationResult.metrics.current.spend.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Projected Spend</h4>
                            <div className="text-xl">
                              ${validationResult.metrics.projected.spend.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Current Sales</h4>
                            <div className="text-xl">
                              ${validationResult.metrics.current.sales.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Projected Sales</h4>
                            <div className="text-xl">
                              ${validationResult.metrics.projected.sales.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Affected Campaigns Tab */}
                <TabsContent value="campaigns">
                  <Card>
                    <CardHeader>
                      <CardTitle>Affected Campaigns</CardTitle>
                      <CardDescription>
                        {validationResult.affectedCampaigns.length} campaign(s) will be affected by this rule
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-4">
                          {validationResult.campaignImpacts.map((impact, i) => (
                            <div key={i} className="flex items-start space-x-4 p-3 border rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium">{impact.campaign.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Current bid: ${impact.currentBid.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">
                                  New bid: ${impact.newBid.toFixed(2)}
                                </div>
                                <div className={cn(
                                  "text-sm",
                                  impact.bidChange > 0 ? "text-amber-500" : "text-blue-500"
                                )}>
                                  {impact.bidChange > 0 ? '+' : ''}
                                  {impact.bidChange.toFixed(2)}%
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 font-medium">
                                  ACOS: <span className={cn(
                                    impact.metrics.acosDelta < 0 ? "text-green-500" : "text-red-500"
                                  )}>
                                    {impact.metrics.acosDelta > 0 ? '+' : ''}
                                    {impact.metrics.acosDelta.toFixed(2)}%
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  ROAS: <span className={cn(
                                    impact.metrics.roasDelta > 0 ? "text-green-500" : "text-red-500"
                                  )}>
                                    {impact.metrics.roasDelta > 0 ? '+' : ''}
                                    {impact.metrics.roasDelta.toFixed(2)}x
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {validationResult.affectedCampaigns.length === 0 && (
                            <div className="p-4 text-center text-muted-foreground">
                              No campaigns will be affected by this rule. Consider adjusting your conditions.
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Conflicting Rules Tab */}
                <TabsContent value="conflicts">
                  <Card>
                    <CardHeader>
                      <CardTitle>Conflicting Rules</CardTitle>
                      <CardDescription>
                        Rules that may conflict with this one
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-4">
                          {validationResult.conflictingRules.map((rule, i) => (
                            <div key={i} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{rule.name}</h4>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {rule.description}
                                  </p>
                                </div>
                                <Badge variant={rule.isActive ? "default" : "secondary"}>
                                  {rule.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Action: </span>
                                {rule.action === 'increase_bid' && 'Increase Bid'}
                                {rule.action === 'decrease_bid' && 'Decrease Bid'}
                                {rule.action === 'pause_campaign' && 'Pause Campaign'}
                                {' by '}
                                {rule.adjustment}%
                              </div>
                              <div className="mt-1 text-sm">
                                <span className="font-medium">Priority: </span>
                                {rule.priority}
                              </div>
                            </div>
                          ))}
                          
                          {validationResult.conflictingRules.length === 0 && (
                            <div className="p-4 text-center text-muted-foreground">
                              No conflicting rules found. This rule is safe to implement.
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}