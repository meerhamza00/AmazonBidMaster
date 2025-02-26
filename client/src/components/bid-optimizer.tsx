import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { BidPrediction } from "@shared/ml/bidOptimizer";
import { ArrowUpCircle, ArrowDownCircle, AlertCircle } from "lucide-react";

export default function BidOptimizer({ campaignId }: { campaignId: number }) {
  const { data: prediction, isLoading } = useQuery<BidPrediction>({
    queryKey: [`/api/campaigns/${campaignId}/bid-prediction`],
  });

  if (isLoading) {
    return <div>Loading predictions...</div>;
  }

  if (!prediction) {
    return null;
  }

  const bidDifference = prediction.suggestedBid - prediction.currentBid;
  const percentChange = (bidDifference / prediction.currentBid) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Bid Optimization</CardTitle>
        <p className="text-sm text-muted-foreground">
          AI-powered bid recommendations based on historical performance metrics and market trends
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium mb-2">Current Performance Metrics:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">ACOS</span>
                <p className="text-lg font-semibold">{prediction.metrics.predictedAcos.toFixed(2)}%</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">ROAS</span>
                <p className="text-lg font-semibold">{prediction.metrics.predictedRoas.toFixed(2)}x</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
            <span className="text-sm font-medium">Current Bid</span>
            <span className="text-sm font-bold">${prediction.currentBid.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Suggested Bid</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm">${prediction.suggestedBid.toFixed(2)}</span>
              {Math.abs(percentChange) > 1 && (
                <span className={`text-xs ${percentChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {percentChange > 0 ? (
                    <ArrowUpCircle className="h-4 w-4" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4" />
                  )}
                  {Math.abs(percentChange).toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Prediction Confidence</span>
              <span className="text-sm">{prediction.confidence.toFixed(1)}%</span>
            </div>
            <Progress value={prediction.confidence} className="h-2 bg-muted" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>
                Predicted metrics with suggested bid:
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium">ACOS</div>
                <div>{prediction.metrics.predictedAcos.toFixed(1)}%</div>
              </div>
              <div>
                <div className="font-medium">ROAS</div>
                <div>{prediction.metrics.predictedRoas.toFixed(1)}x</div>
              </div>
              <div>
                <div className="font-medium">CTR</div>
                <div>{prediction.metrics.predictedCtr.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}