import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, Plus, Save, Trash2, AlertCircle, Filter, ArrowRight, PenLine } from 'lucide-react';

export default function RuleCustomization() {
  const [activeTab, setActiveTab] = useState('visual');
  const [targetAcos, setTargetAcos] = useState<number[]>([20]);
  const [minRoas, setMinRoas] = useState<number[]>([3]);
  const [activeRuleType, setActiveRuleType] = useState('bidding');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('default');
  
  const ruleTypes = [
    { id: 'bidding', name: 'Bid Adjustment', icon: <PenLine className="h-4 w-4" /> },
    { id: 'targeting', name: 'Keyword Targeting', icon: <Filter className="h-4 w-4" /> },
    { id: 'budget', name: 'Budget Control', icon: <Plus className="h-4 w-4" /> }
  ];
  
  const rulePresets = [
    { id: 'default', name: 'Standard PPC Optimization', description: 'Balanced bid adjustments based on ACoS and ROAS targets' },
    { id: 'aggressive', name: 'Aggressive Growth', description: 'Focus on maximizing impressions and clicks, higher spend allowed' },
    { id: 'conservative', name: 'Conservative Efficiency', description: 'Prioritize ROAS and profitability over growth' }
  ];
  
  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    
    // Update rule parameters based on preset
    switch (preset) {
      case 'aggressive':
        setTargetAcos([25]);
        setMinRoas([2.5]);
        break;
      case 'conservative':
        setTargetAcos([15]);
        setMinRoas([4]);
        break;
      default:
        setTargetAcos([20]);
        setMinRoas([3]);
        break;
    }
  };
  
  // Sample rule condition components
  const renderConditions = () => {
    if (activeRuleType === 'bidding') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Target ACoS (%)</Label>
              <span className="text-sm font-medium">{targetAcos[0]}%</span>
            </div>
            <Slider
              value={targetAcos}
              min={5}
              max={50}
              step={1}
              onValueChange={setTargetAcos}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Lower (more profitable)</span>
              <span>Higher (more growth)</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Minimum ROAS</Label>
              <span className="text-sm font-medium">{minRoas[0].toFixed(1)}x</span>
            </div>
            <Slider
              value={minRoas}
              min={1}
              max={6}
              step={0.1}
              onValueChange={setMinRoas}
              className="w-full"
            />
          </div>
          
          {showAdvancedOptions && (
            <>
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">Advanced Bid Adjustment Options</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="bid-cap">Maximum bid increase</Label>
                      <p className="text-xs text-gray-400">Limit how much bids can increase</p>
                    </div>
                    <Select defaultValue="25">
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="25">25%</SelectItem>
                        <SelectItem value="50">50%</SelectItem>
                        <SelectItem value="100">100%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lookback">Lookback period</Label>
                      <p className="text-xs text-gray-400">Data timeframe for decisions</p>
                    </div>
                    <Select defaultValue="14">
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="frequency">Adjustment frequency</Label>
                      <p className="text-xs text-gray-400">How often to update bids</p>
                    </div>
                    <Select defaultValue="daily">
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">Rule Exclusions</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="min-clicks">Minimum clicks</Label>
                      <p className="text-xs text-gray-400">Skip items with low data</p>
                    </div>
                    <Input id="min-clicks" type="number" className="w-24" placeholder="10" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="min-spend">Minimum spend ($)</Label>
                      <p className="text-xs text-gray-400">Statistical significance threshold</p>
                    </div>
                    <Input id="min-spend" type="number" className="w-24" placeholder="25" />
                  </div>
                </div>
              </div>
            </>
          )}
          
          <Button
            variant="outline"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="w-full mt-2"
          >
            {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
          </Button>
        </div>
      );
    } else if (activeRuleType === 'targeting') {
      return (
        <div className="space-y-4">
          <div className="border rounded-md p-3 bg-gray-900/30">
            <h4 className="text-sm font-medium mb-2">Keyword Performance Thresholds</h4>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="target-acos">ACoS Threshold</Label>
                  <div className="flex mt-1">
                    <Select defaultValue="above">
                      <SelectTrigger className="rounded-r-none w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Above</SelectItem>
                        <SelectItem value="below">Below</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input id="target-acos" type="number" className="rounded-l-none" placeholder="25" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="target-ctr">CTR Threshold</Label>
                  <div className="flex mt-1">
                    <Select defaultValue="below">
                      <SelectTrigger className="rounded-r-none w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Above</SelectItem>
                        <SelectItem value="below">Below</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input id="target-ctr" type="number" className="rounded-l-none" placeholder="0.3" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="min-conversions">Min. Conversions</Label>
                  <Input id="min-conversions" type="number" placeholder="1" />
                </div>
                
                <div>
                  <Label htmlFor="min-impressions">Min. Impressions</Label>
                  <Input id="min-impressions" type="number" placeholder="1000" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-3 bg-gray-900/30">
            <h4 className="text-sm font-medium mb-2">Action to Take</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input type="radio" id="action-pause" name="action" className="rounded-full" defaultChecked />
                <Label htmlFor="action-pause">Pause underperforming keywords</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="radio" id="action-negative" name="action" className="rounded-full" />
                <Label htmlFor="action-negative">Add as negative keywords</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="radio" id="action-decrease" name="action" className="rounded-full" />
                <Label htmlFor="action-decrease">Decrease bids by percentage</Label>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div className="border rounded-md p-3 bg-gray-900/30">
            <h4 className="text-sm font-medium mb-2">Budget Control Rules</h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="daily-budget">Maximum Daily Budget</Label>
                <div className="flex mt-1">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-gray-800 text-gray-400 text-sm">
                    $
                  </span>
                  <Input id="daily-budget" type="number" className="rounded-l-none" placeholder="50" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="budget-increase">Automatic Budget Increases</Label>
                <Select defaultValue="10">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="5">Increase by 5% if ROAS &gt; target</SelectItem>
                    <SelectItem value="10">Increase by 10% if ROAS &gt; target</SelectItem>
                    <SelectItem value="20">Increase by 20% if ROAS &gt; target</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emergency-pause">Emergency pause</Label>
                  <p className="text-xs text-gray-400">
                    Pause campaigns if ACoS exceeds 40%
                  </p>
                </div>
                <Switch id="emergency-pause" />
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-3 bg-gray-900/30">
            <h4 className="text-sm font-medium mb-2">Budget Allocation Strategy</h4>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="radio" id="allocation-even" name="allocation" className="rounded-full" />
                <Label htmlFor="allocation-even">Even distribution</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="radio" id="allocation-performance" name="allocation" className="rounded-full" defaultChecked />
                <Label htmlFor="allocation-performance">Based on performance (ROAS)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="radio" id="allocation-custom" name="allocation" className="rounded-full" />
                <Label htmlFor="allocation-custom">Custom weights</Label>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  
  // Rule code preview (for code tab)
  const getRuleCode = () => {
    if (activeRuleType === 'bidding') {
      return `// Bid Adjustment Rule
{
  "name": "Auto Bid Optimization",
  "enabled": true,
  "type": "bidding",
  "conditions": [
    {
      "metric": "acos",
      "operator": "greaterThan",
      "value": ${targetAcos[0]}
    },
    {
      "metric": "roas",
      "operator": "lessThan",
      "value": ${minRoas[0]}
    },
    {
      "metric": "clicks",
      "operator": "greaterThan",
      "value": 10
    }
  ],
  "actions": [
    {
      "type": "adjustBid",
      "value": -5,
      "unit": "percent"
    }
  ],
  "schedule": {
    "frequency": "daily",
    "timeOfDay": "09:00"
  }
}`;
    } else if (activeRuleType === 'targeting') {
      return `// Keyword Targeting Rule
{
  "name": "Underperforming Keyword Control",
  "enabled": true,
  "type": "targeting",
  "conditions": [
    {
      "metric": "acos", 
      "operator": "greaterThan",
      "value": 35
    },
    {
      "metric": "ctr",
      "operator": "lessThan",
      "value": 0.3
    },
    {
      "metric": "impressions",
      "operator": "greaterThan",
      "value": 1000
    }
  ],
  "actions": [
    {
      "type": "pauseKeyword"
    }
  ],
  "schedule": {
    "frequency": "weekly",
    "timeOfDay": "10:00",
    "dayOfWeek": "monday"
  }
}`;
    } else {
      return `// Budget Control Rule
{
  "name": "Budget Optimization",
  "enabled": true,
  "type": "budget",
  "conditions": [
    {
      "metric": "roas",
      "operator": "greaterThan",
      "value": 4
    },
    {
      "metric": "spend",
      "operator": "lessThan",
      "value": 45
    }
  ],
  "actions": [
    {
      "type": "adjustBudget",
      "value": 10,
      "unit": "percent",
      "max": 50
    }
  ],
  "schedule": {
    "frequency": "daily",
    "timeOfDay": "06:00"
  }
}`;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Advanced Rule Customization Interface</CardTitle>
        <CardDescription>
          Create sophisticated automation rules with visual or code-based editing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {ruleTypes.map((type) => (
              <div
                key={type.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors
                  ${activeRuleType === type.id ? 'bg-orange-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                onClick={() => setActiveRuleType(type.id)}
              >
                {type.icon}
                <span className="whitespace-nowrap">{type.name}</span>
                {activeRuleType === type.id && <Check className="h-4 w-4" />}
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-1/3">
              <h3 className="text-sm font-medium mb-2">Rule Presets</h3>
              <div className="space-y-2">
                {rulePresets.map((preset) => (
                  <div
                    key={preset.id}
                    className={`p-3 rounded-md cursor-pointer border border-gray-800
                      ${selectedPreset === preset.id ? 'bg-gray-800 border-orange-500' : 'bg-gray-900 hover:bg-gray-800'}`}
                    onClick={() => handlePresetChange(preset.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{preset.name}</h4>
                      {selectedPreset === preset.id && <Check className="h-4 w-4 text-orange-500" />}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{preset.description}</p>
                  </div>
                ))}
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Custom Preset
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Rule Preset</DialogTitle>
                    <DialogDescription>
                      Create a custom rule preset with your own parameters
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="preset-name">Preset Name</Label>
                      <Input id="preset-name" placeholder="My Custom Preset" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preset-desc">Description</Label>
                      <Input id="preset-desc" placeholder="Custom rule parameters for my campaign strategy" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Target ACoS</Label>
                      <Input type="number" placeholder="20" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Target ROAS</Label>
                      <Input type="number" placeholder="3.0" />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Save Preset</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="sm:w-2/3">
              <Tabs defaultValue="visual" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="visual">Visual Editor</TabsTrigger>
                  <TabsTrigger value="code">Code Editor</TabsTrigger>
                </TabsList>
                
                <TabsContent value="visual" className="mt-0">
                  <div className="rounded-md border p-4 bg-gray-900/50">
                    {renderConditions()}
                  </div>
                </TabsContent>
                
                <TabsContent value="code" className="mt-0">
                  <div className="rounded-md border overflow-hidden">
                    <div className="bg-gray-900 p-2 border-b border-gray-800 flex justify-between items-center">
                      <span className="text-xs font-mono">rule.json</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Save className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <pre className="bg-black p-4 text-xs overflow-auto max-h-80 font-mono">
                      <code className="text-gray-300">{getRuleCode()}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 flex justify-between">
                <Button variant="outline" className="gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Validate Rule
                </Button>
                
                <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Apply Rule
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}