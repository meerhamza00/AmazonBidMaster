import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { BidPrediction } from "@shared/ml/bidOptimizer";
import { ArrowUpCircle, ArrowDownCircle, AlertCircle, Download, Info } from "lucide-react";
import { ExportMenu } from "@/components/ui/export-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <Card className="bg-background border">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Bid Optimization</CardTitle>
        <p className="text-sm text-muted-foreground">
          AI-powered bid recommendations based on historical performance metrics and market trends
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg mb-4 border border-border">
            <h4 className="text-sm font-medium mb-2 text-foreground">Current Performance Metrics:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">ACOS</span>
                <p className="text-lg font-semibold text-foreground">{prediction.metrics.predictedAcos.toFixed(2)}%</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">ROAS</span>
                <p className="text-lg font-semibold text-foreground">{prediction.metrics.predictedRoas.toFixed(2)}x</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg border border-primary/20">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm font-medium text-foreground inline-flex items-center gap-1 cursor-help">
                    Current Bid <Info className="h-3 w-3" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>The bid currently set for this campaign or ad group in Amazon Advertising.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-sm font-bold text-foreground">${prediction.currentBid.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
             <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm font-medium text-foreground whitespace-nowrap inline-flex items-center gap-1 cursor-help">
                    Suggested Bid <Info className="h-3 w-3" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>The bid recommended by the AI based on performance data and optimization goals. The percentage change from the current bid is shown next to it.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-foreground">${prediction.suggestedBid.toFixed(2)}</span>
              {Math.abs(percentChange) > 1 && (
                <span className={`text-xs flex items-center ${percentChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {percentChange > 0 ? (
                    <ArrowUpCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  )}
                  <span className="whitespace-nowrap">{Math.abs(percentChange).toFixed(1)}%</span>
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm font-medium text-foreground whitespace-nowrap inline-flex items-center gap-1 cursor-help">
                      Prediction Confidence <Info className="h-3 w-3" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Indicates the AI's confidence level (0-100%) in this bid suggestion, based on data quality and prediction stability. Higher confidence suggests a more reliable recommendation.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-sm text-foreground">{prediction.confidence.toFixed(1)}%</span>
            </div>
            <Progress value={prediction.confidence} className="h-2 bg-muted [&>div]:bg-primary" />
          </div>

          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-sm text-muted-foreground cursor-help">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-wrap break-words">
                      Predicted metrics with suggested bid:
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Estimated performance metrics (ACoS, ROAS, CTR) if the suggested bid is applied. These are projections based on historical data.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* Removed misplaced closing div from here */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-foreground whitespace-nowrap">ACOS</div>
                <div className="text-foreground truncate">{prediction.metrics.predictedAcos.toFixed(1)}%</div>
              </div>
              <div>
                <div className="font-medium text-foreground whitespace-nowrap">ROAS</div>
                <div className="text-foreground truncate">{prediction.metrics.predictedRoas.toFixed(1)}x</div>
              </div>
              <div>
                <div className="font-medium text-foreground whitespace-nowrap">CTR</div>
                <div className="text-foreground truncate">{prediction.metrics.predictedCtr.toFixed(1)}%</div>
              </div>
            </div>
          </div> {/* This now correctly closes the space-y-2 div */}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 flex justify-between items-center px-6 py-3">
        <span className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
          Last updated: {new Date().toLocaleString()}
        </span>
        <ExportMenu
          reportType="bid-optimization"
          data={{ 
            recommendations: [
              {
                campaignId: prediction.campaignId,
                currentBid: prediction.currentBid,
                suggestedBid: prediction.suggestedBid,
                confidence: prediction.confidence,
                metrics: prediction.metrics
              }
            ]
          }}
          metrics={['currentBid', 'suggestedBid', 'confidence', 'acos', 'roas', 'ctr']}
          triggerClassName="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
        />
      </CardFooter>
    </Card>
  );
}
