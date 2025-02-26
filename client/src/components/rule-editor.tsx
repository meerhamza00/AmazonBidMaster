import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ruleSchema, metricOperatorSchema, timeframeSchema, type InsertRule } from "@shared/schema";
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
} from "@/components/ui/card";
import { PlusCircle, MinusCircle, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface RuleEditorProps {
  onSubmit: (data: InsertRule) => void;
  defaultValues?: Partial<InsertRule>;
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Explain what this rule does and when it should be triggered.
              </FormDescription>
            </FormItem>
          )}
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

        <Button type="submit">Save Rule</Button>
      </form>
    </Form>
  );
}