
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function AdvancedRuleEditor({ onSave }) {
  const [conditions, setConditions] = useState([]);
  
  const addCondition = () => {
    setConditions([...conditions, {
      metric: "acos",
      operator: "greater_than",
      value: 0,
      timeframe: "last_24_hours"
    }]);
  };

  const metrics = ["acos", "roas", "ctr", "cpc", "impressions", "clicks"];
  const operators = ["greater_than", "less_than", "equal_to", "between"];
  const timeframes = ["last_24_hours", "last_7_days", "last_30_days"];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Rule Conditions</h3>
        <Button onClick={addCondition}>Add Condition</Button>
      </div>
      
      {conditions.map((condition, index) => (
        <div key={index} className="grid grid-cols-4 gap-4">
          <Select
            value={condition.metric}
            onChange={(e) => {
              const newConditions = [...conditions];
              newConditions[index].metric = e.target.value;
              setConditions(newConditions);
            }}
          >
            {metrics.map(m => (
              <option key={m} value={m}>{m.toUpperCase()}</option>
            ))}
          </Select>
          
          <Select
            value={condition.operator}
            onChange={(e) => {
              const newConditions = [...conditions];
              newConditions[index].operator = e.target.value;
              setConditions(newConditions);
            }}
          >
            {operators.map(o => (
              <option key={o} value={o}>{o.replace("_", " ")}</option>
            ))}
          </Select>
          
          <Input
            type="number"
            value={condition.value}
            onChange={(e) => {
              const newConditions = [...conditions];
              newConditions[index].value = parseFloat(e.target.value);
              setConditions(newConditions);
            }}
          />
          
          <Select
            value={condition.timeframe}
            onChange={(e) => {
              const newConditions = [...conditions];
              newConditions[index].timeframe = e.target.value;
              setConditions(newConditions);
            }}
          >
            {timeframes.map(t => (
              <option key={t} value={t}>{t.replace("_", " ")}</option>
            ))}
          </Select>
        </div>
      ))}
      
      <Button onClick={() => onSave(conditions)}>Save Rule</Button>
    </div>
  );
}
