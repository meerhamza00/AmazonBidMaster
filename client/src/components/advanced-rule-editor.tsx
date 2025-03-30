
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { ruleSchema, metricOperatorSchema, timeframeSchema, type InsertRule } from "@shared/schema";
import { 
  AlertTriangle, 
  PlusCircle, 
  MinusCircle, 
  Clock, 
  Calendar, 
  ChevronRight, 
  ChevronDown,
  Trash2,
  Info,
  AlertCircle,
  ChevronsUpDown,
  Zap,
  LineChart,
  Settings,
  BarChart4
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TimeInput } from "../components/ui/time-input";

interface AdvancedRuleEditorProps {
  onSubmit: (data: InsertRule) => void;
  defaultValues?: Partial<InsertRule>;
  campaigns?: any[];
}

// Predefined metrics with labels, descriptions, and examples
const AVAILABLE_METRICS = [
  { value: "acos", label: "ACOS", 
    description: "Advertising Cost of Sales - Total ad spend divided by attributed sales", 
    example: "ACOS > 30% indicates high advertising costs relative to sales",
    format: (value: number) => `${value}%`,
    icon: <LineChart className="h-4 w-4 mr-2" />,
    color: "text-orange-500"
  },
  { value: "roas", label: "ROAS", 
    description: "Return on Ad Spend - Attributed sales divided by ad spend", 
    example: "ROAS < 3 means you're getting less than $3 in sales for every $1 in ad spend",
    format: (value: number) => `${value}x`,
    icon: <BarChart4 className="h-4 w-4 mr-2" />,
    color: "text-emerald-500"
  },
  { value: "ctr", label: "CTR", 
    description: "Click-Through Rate - Percentage of impressions that resulted in clicks", 
    example: "CTR < 0.3% may indicate poor ad relevance or copy",
    format: (value: number) => `${value}%`,
    icon: <ChevronsUpDown className="h-4 w-4 mr-2" />,
    color: "text-blue-500"
  },
  { value: "spend", label: "Spend", 
    description: "Total amount spent on advertising", 
    example: "Spend > $50/day may exceed your budget",
    format: (value: number) => `$${value}`,
    icon: <Zap className="h-4 w-4 mr-2" />,
    color: "text-red-500"
  },
  { value: "impressions", label: "Impressions", 
    description: "Number of times your ad was displayed", 
    example: "Impressions < 1000/day indicates low visibility",
    format: (value: number) => `${value.toLocaleString()}`,
    icon: <Settings className="h-4 w-4 mr-2" />,
    color: "text-purple-500"
  },
  { value: "clicks", label: "Clicks", 
    description: "Number of clicks on your ad", 
    example: "Clicks < 10/day indicates low engagement",
    format: (value: number) => `${value.toLocaleString()}`,
    icon: <ChevronsUpDown className="h-4 w-4 mr-2" />,
    color: "text-yellow-500"
  },
];

// Operator definitions
const METRIC_OPERATORS = [
  { value: "greater_than", label: "Greater Than (>)", description: "Triggers when metric exceeds the specified value" },
  { value: "less_than", label: "Less Than (<)", description: "Triggers when metric falls below the specified value" },
  { value: "equal_to", label: "Equal To (=)", description: "Triggers when metric equals the specified value" },
  { value: "not_equal_to", label: "Not Equal To (≠)", description: "Triggers when metric does not equal the specified value" },
  { value: "between", label: "Between", description: "Triggers when metric is between the specified range" },
];

// Timeframe definitions
const TIMEFRAMES = [
  { value: "last_24_hours", label: "Last 24 Hours", description: "Compare data from the past 24 hours" },
  { value: "last_7_days", label: "Last 7 Days", description: "Compare data from the past 7 days" },
  { value: "last_30_days", label: "Last 30 Days", description: "Compare data from the past 30 days" },
  { value: "custom_range", label: "Custom Range", description: "Define your own date range" },
];

// Day of week options
const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

// Actions with explanations
const ACTIONS = [
  { value: "increase_bid", label: "Increase Bid", description: "Automatically increase the bid by the specified percentage" },
  { value: "decrease_bid", label: "Decrease Bid", description: "Automatically decrease the bid by the specified percentage" },
  { value: "pause_campaign", label: "Pause Campaign", description: "Automatically pause the campaign when conditions are met" },
];

// Helper component for conditional inputs
function ConditionalValueInput({ field, operator, metric, index }: { 
  field: any, 
  operator: string, 
  metric: string,
  index: number
}) {
  const metricInfo = AVAILABLE_METRICS.find(m => m.value === metric);
  const metricLabel = metricInfo?.label || metric.toUpperCase();
  const formatValue = metricInfo?.format || ((v: number) => `${v}`);
  
  if (operator === "between") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <FormField
            name={`conditions.${index}.value`}
            render={({ field: valueField }) => (
              <FormItem>
                <FormLabel className="text-xs">Min Value</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder={`Min ${metricLabel}`}
                    {...valueField}
                    onChange={(e) => valueField.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <span className="text-xs text-muted-foreground mt-1">
            {formatValue(parseFloat(field.value) || 0)}
          </span>
        </div>
        <div className="flex flex-col">
          <FormField
            name={`conditions.${index}.value2`}
            render={({ field: value2Field }) => (
              <FormItem>
                <FormLabel className="text-xs">Max Value</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder={`Max ${metricLabel}`}
                    value={value2Field.value || ''}
                    onChange={(e) => value2Field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <span className="text-xs text-muted-foreground mt-1">
            {formatValue(parseFloat(field.value2) || 0)}
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col">
      <FormControl>
        <Input 
          type="number" 
          step="0.01"
          placeholder={`Target ${metricLabel}`}
          {...field}
          onChange={(e) => field.onChange(parseFloat(e.target.value))}
        />
      </FormControl>
      <span className="text-xs text-muted-foreground mt-1">
        {formatValue(parseFloat(field.value) || 0)}
      </span>
    </div>
  );
}

// Single condition component
function SingleCondition({ 
  groupIndex, 
  conditionIndex, 
  control, 
  remove,
  register
}: {
  groupIndex: number;
  conditionIndex: number;
  control: any;
  remove: (index: number) => void;
  register: any;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 items-start bg-muted/30 p-3 rounded-md border border-border relative">
      {conditionIndex > 0 && (
        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-muted px-2 py-1 rounded-full text-xs">
          {groupIndex === 0 ? "AND" : "OR"}
        </div>
      )}
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-background shadow-sm border border-border hover:bg-destructive hover:text-destructive-foreground"
        onClick={() => remove(conditionIndex)}
      >
        <MinusCircle className="h-4 w-4" />
      </Button>
      
      <div className="col-span-3">
        <FormField
          control={control}
          name={`conditions.${groupIndex}.conditions.${conditionIndex}.metric`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Metric</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AVAILABLE_METRICS.map((metric) => (
                    <SelectItem key={metric.value} value={metric.value}>
                      <div className="flex items-center">
                        <span className={cn("mr-2", metric.color)}>{metric.icon}</span>
                        {metric.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-4 w-4 absolute right-2 top-7">
                      <Info className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" className="max-w-xs">
                    {AVAILABLE_METRICS.find(m => m.value === field.value)?.description || "Select a metric"}
                    <div className="mt-1 text-xs text-muted-foreground">
                      Example: {AVAILABLE_METRICS.find(m => m.value === field.value)?.example}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormItem>
          )}
        />
      </div>
      
      <div className="col-span-3">
        <FormField
          control={control}
          name={`conditions.${groupIndex}.conditions.${conditionIndex}.operator`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Operator</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {METRIC_OPERATORS.map((operator) => (
                    <SelectItem key={operator.value} value={operator.value}>
                      {operator.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="col-span-3">
        <FormField
          control={control}
          name={`conditions.${groupIndex}.conditions.${conditionIndex}.value`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Value</FormLabel>
              <ConditionalValueInput 
                field={field} 
                operator={control._formValues.conditions[groupIndex].conditions[conditionIndex].operator}
                metric={control._formValues.conditions[groupIndex].conditions[conditionIndex].metric}
                index={conditionIndex}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="col-span-3">
        <FormField
          control={control}
          name={`conditions.${groupIndex}.conditions.${conditionIndex}.timeframe`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Timeframe</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TIMEFRAMES.map((timeframe) => (
                    <SelectItem key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

// Condition group component
function ConditionGroup({ 
  groupIndex, 
  form, 
  removeGroup 
}: {
  groupIndex: number;
  form: any;
  removeGroup: (index: number) => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `conditions.${groupIndex}.conditions`,
  });

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">
            {groupIndex === 0 ? "Primary Conditions" : `Alternative Conditions ${groupIndex}`}
          </CardTitle>
          {groupIndex > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => removeGroup(groupIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription className="text-xs">
          {groupIndex === 0 
            ? "All of these conditions must be true (AND logic)" 
            : "Any of these conditions can be true (OR logic)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name={`conditions.${groupIndex}.operator`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Match Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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
              <FormDescription className="text-xs">
                {field.value === "AND" 
                  ? "All conditions in this group must be true for the rule to trigger" 
                  : "Any condition in this group can be true for the rule to trigger"}
              </FormDescription>
            </FormItem>
          )}
        />

        {fields.length > 0 ? (
          <div className="space-y-6 mt-2">
            {fields.map((field, index) => (
              <SingleCondition
                key={field.id}
                groupIndex={groupIndex}
                conditionIndex={index}
                control={form.control}
                remove={remove}
                register={form.register}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-4 border border-dashed rounded-md">
            <p className="text-sm text-muted-foreground">No conditions added yet.</p>
          </div>
        )}
        
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => append({
              metric: "acos",
              operator: "greater_than",
              value: 30,
              timeframe: "last_24_hours"
            })}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Time constraints component
function TimeConstraints({ control }: { control: any }) {
  const [showTimeConstraints, setShowTimeConstraints] = useState(false);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Time-Based Rules</h3>
          <p className="text-xs text-muted-foreground">Configure when this rule should be active</p>
        </div>
        <Switch 
          checked={showTimeConstraints} 
          onCheckedChange={setShowTimeConstraints} 
          className="data-[state=checked]:bg-[#ff6b00]" 
        />
      </div>
      
      {showTimeConstraints && (
        <Card>
          <CardContent className="pt-6 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  control={control}
                  name="timeConstraints.startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <TimeInput
                          value={field.value || '08:00'}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Rule will be active from this time
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <FormField
                  control={control}
                  name="timeConstraints.endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <TimeInput
                          value={field.value || '20:00'}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Rule will be inactive after this time
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <FormField
                control={control}
                name="timeConstraints.daysOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Active Days</FormLabel>
                      <FormDescription>
                        Select which days of the week this rule should be active
                      </FormDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <FormItem
                          key={day.value}
                          className="flex flex-row items-start space-x-2 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(day.value)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                return checked
                                  ? field.onChange([...currentValue, day.value])
                                  : field.onChange(
                                      currentValue.filter((value: number) => value !== day.value)
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {day.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Rule impact simulation component
function RuleImpactSimulation({ rule, campaigns }: { rule: any, campaigns?: any[] }) {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  
  // Sample data for visualization - would be calculated based on rule and campaign data
  const impactData = [
    { label: "Current Spend", value: 1250, color: "bg-blue-500" },
    { label: "Projected Spend", value: 1050, color: "bg-green-500", change: -16 },
    { label: "Current ACOS", value: 32, color: "bg-blue-500" },
    { label: "Projected ACOS", value: 26.5, color: "bg-green-500", change: -17 },
    { label: "Current ROAS", value: 3.1, color: "bg-blue-500" },
    { label: "Projected ROAS", value: 3.8, color: "bg-green-500", change: 22 },
  ];
  
  // Sample affected campaigns
  const affectedCampaigns = campaigns?.slice(0, 3) || [
    { id: 1, name: "Auto - bestseller", budget: 25, status: "active" },
    { id: 2, name: "Comp Keywords", budget: 15, status: "active" },
    { id: 3, name: "Brand Defense", budget: 10, status: "active" },
  ];
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Rule Impact Simulation</CardTitle>
        <CardDescription>
          Estimate how this rule will affect your campaigns
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-1">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Simulate for:</label>
            <Select 
              value={selectedCampaign} 
              onValueChange={setSelectedCampaign}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Affected Campaigns</SelectItem>
                {affectedCampaigns.map(campaign => (
                  <SelectItem key={campaign.id} value={campaign.id.toString()}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {impactData.map((item, index) => (
              <div key={index} className="bg-muted/40 rounded-md p-3">
                <div className="text-sm text-muted-foreground">{item.label}</div>
                <div className="text-2xl font-bold mt-1">
                  {item.label.includes("ACOS") ? `${item.value}%` : 
                   item.label.includes("ROAS") ? `${item.value}x` : 
                   `$${item.value}`}
                </div>
                {item.change && (
                  <div className={cn(
                    "text-xs mt-1",
                    item.change < 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Affected Campaigns</h4>
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
              {affectedCampaigns.map(campaign => (
                <div key={campaign.id} className="flex items-center justify-between bg-muted/40 rounded-md p-2 text-sm">
                  <div>{campaign.name}</div>
                  <Badge variant="outline">
                    Budget: ${campaign.budget}/day
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pt-2 pb-4">
        <div className="text-xs text-muted-foreground text-center max-w-xs">
          <AlertCircle className="h-3 w-3 inline-block mr-1" />
          This is a simulation based on historical data. Actual results may vary.
        </div>
      </CardFooter>
    </Card>
  );
}

export default function AdvancedRuleEditor({ onSubmit, defaultValues, campaigns }: AdvancedRuleEditorProps) {
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
              value: 30,
              timeframe: "last_24_hours",
            },
          ],
        },
      ],
      action: "decrease_bid",
      adjustment: "10",
      isActive: true,
      priority: 10,
      timeConstraints: {
        startTime: "08:00",
        endTime: "20:00",
        daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
      },
      ...defaultValues,
    },
  });
  
  const { fields: conditionGroups, append: appendGroup, remove: removeGroup } = 
    useFieldArray({
      control: form.control,
      name: "conditions",
    });
  
  const watchedRule = form.watch();
  
  // Rule strength calculation (simplified example)
  const calculateRuleStrength = (rule: any) => {
    // Count number of conditions, check for time constraints, etc.
    let strength = 0;
    
    // Base points for having conditions
    if (rule.conditions && rule.conditions.length > 0) {
      // Add points for each condition group
      strength += Math.min(rule.conditions.length * 20, 60);
      
      // Add points for each condition within groups
      let totalConditions = 0;
      rule.conditions.forEach((group: any) => {
        if (group.conditions) {
          totalConditions += group.conditions.length;
        }
      });
      
      strength += Math.min(totalConditions * 5, 20);
    }
    
    // Points for time constraints
    if (rule.timeConstraints) {
      strength += 10;
      
      // More points for specific day targeting
      if (rule.timeConstraints.daysOfWeek && rule.timeConstraints.daysOfWeek.length > 0) {
        // More specific (fewer days) is stronger
        strength += Math.max(0, 10 - (rule.timeConstraints.daysOfWeek.length * 2));
      }
    }
    
    // Cap at 100%
    return Math.min(strength, 100);
  };
  
  const ruleStrength = calculateRuleStrength(watchedRule);
  
  return (
    <div className="space-y-8">
      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Rule Builder</TabsTrigger>
          <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
          <TabsTrigger value="json">JSON Preview</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="builder" className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Rule Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rule Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., High ACOS Reduction" />
                            </FormControl>
                            <FormMessage />
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
                                  placeholder="Explain what this rule does and when it should be triggered"
                                  className="resize-none min-h-[100px]"
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                  value={safeValue}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                      
                      <div className="pt-2">
                        <FormField
                          control={form.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Rule Status</FormLabel>
                                <FormDescription className="text-xs">
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
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Action Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="action"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rule Action</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select action" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ACTIONS.map(action => (
                                  <SelectItem key={action.value} value={action.value}>
                                    {action.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-xs">
                              {ACTIONS.find(a => a.value === field.value)?.description}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {(form.watch('action') === 'increase_bid' || form.watch('action') === 'decrease_bid') && (
                        <FormField
                          control={form.control}
                          name="adjustment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adjustment Amount (%)</FormLabel>
                              <div className="flex items-center gap-4">
                                <FormControl className="flex-1">
                                  <Input 
                                    type="number" 
                                    step="0.1" 
                                    min="0"
                                    max="100"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
                                </FormControl>
                                <Slider
                                  defaultValue={[Number(field.value) || 10]}
                                  max={50}
                                  step={1}
                                  className="flex-1"
                                  onValueChange={(values) => field.onChange(values[0].toString())}
                                />
                              </div>
                              <FormDescription className="text-xs">
                                {form.watch('action') === 'increase_bid' 
                                  ? `Bids will be increased by ${field.value}%`
                                  : `Bids will be decreased by ${field.value}%`}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rule Priority</FormLabel>
                            <div className="flex items-center gap-4">
                              <FormControl className="flex-1">
                                <Input 
                                  type="number" 
                                  min="0"
                                  max="100"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <Slider
                                defaultValue={[field.value]}
                                max={100}
                                step={5}
                                className="flex-1"
                                onValueChange={(values) => field.onChange(values[0] || 0)}
                              />
                            </div>
                            <FormDescription className="text-xs">
                              Higher priority rules are evaluated first (0-100)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="rounded-lg bg-muted p-3 mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Rule Strength</h4>
                          <span className="text-xs text-muted-foreground">{ruleStrength}%</span>
                        </div>
                        <div className="h-2 bg-muted-foreground/20 rounded-full">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              ruleStrength < 30 ? "bg-red-500" : 
                              ruleStrength < 70 ? "bg-yellow-500" : 
                              "bg-green-500"
                            )}
                            style={{ width: `${ruleStrength}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {ruleStrength < 30 ? (
                            <span className="flex items-center text-red-500">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Weak rule. Add more conditions or time constraints.
                            </span>
                          ) : ruleStrength < 70 ? (
                            <span className="flex items-center text-yellow-500">
                              <Info className="h-3 w-3 mr-1" />
                              Moderate rule. Consider adding more specific conditions.
                            </span>
                          ) : (
                            <span className="flex items-center text-green-500">
                              <Info className="h-3 w-3 mr-1" />
                              Strong rule with good specificity.
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium">Rule Conditions</h3>
                      {conditionGroups.length < 3 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendGroup({
                            operator: "OR",
                            conditions: [{ metric: "acos", operator: "greater_than", value: 30, timeframe: "last_24_hours" }]
                          })}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Condition Group
                        </Button>
                      )}
                    </div>
                    
                    {conditionGroups.length > 1 && (
                      <div className="bg-muted/40 border border-border rounded-md p-3">
                        <div className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-orange-400 mr-2 mt-0.5" />
                          <div className="text-sm text-muted-foreground">
                            <p className="font-medium text-foreground mb-1">Using Multiple Condition Groups</p>
                            <p className="text-xs">
                              The first group uses AND logic (all conditions must match). Additional groups use OR logic - 
                              if any group's conditions are met, the rule will trigger.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-6">
                        {conditionGroups.map((group, index) => (
                          <ConditionGroup
                            key={group.id}
                            groupIndex={index}
                            form={form}
                            removeGroup={removeGroup}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  <TimeConstraints control={form.control} />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <Button type="button" variant="outline">Cancel</Button>
                <Button type="submit">Save Rule</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="impact" className="py-4">
              <RuleImpactSimulation 
                rule={watchedRule}
                campaigns={campaigns}
              />
            </TabsContent>
            
            <TabsContent value="json" className="py-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Rule JSON Preview</CardTitle>
                  <CardDescription>
                    Technical view of your rule configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted rounded-md p-4 overflow-auto whitespace-pre-wrap text-xs">
                    {JSON.stringify(watchedRule, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
