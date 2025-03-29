import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import confetti from 'canvas-confetti';
import { Trophy, Award, TrendingUp, Star, Share, Download, Send } from 'lucide-react';

export default function SuccessCelebration() {
  const [confettiPlayed, setConfettiPlayed] = useState(false);
  
  const launchConfetti = () => {
    if (!confettiPlayed) {
      // Use the default confetti without creating a new instance
      // First blast - center spread
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // After a slight delay, add two more angled blasts
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 }
        });
      }, 250);
      
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 }
        });
      }, 400);
      
      setConfettiPlayed(true);
    }
  };
  
  // Sample achievement metrics for a successful campaign
  const achievement = {
    campaignName: "Summer Promo Sponsored Products",
    targetAcos: 25,
    actualAcos: 18.3,
    improvement: 26.8,
    revenue: 12580,
    revenueIncrease: 42,
    conversions: 157,
    conversionIncrease: 35
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personalized Campaign Success Celebration</CardTitle>
        <CardDescription>
          Celebrate and share campaign wins with personalized achievement modals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold">Campaign Success Notification</h3>
            <p className="text-sm text-gray-400 mt-1">
              Your campaign has reached its target metrics! Click below to celebrate this achievement.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-md p-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Target ACoS</p>
                <p className="font-semibold">{achievement.targetAcos}%</p>
              </div>
              <Target className="h-10 w-10 text-gray-600" />
            </div>
            
            <div className="bg-gray-800 rounded-md p-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Actual ACoS</p>
                <p className="font-semibold text-green-500">{achievement.actualAcos}%</p>
              </div>
              <Award className="h-10 w-10 text-green-500" />
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white" 
                onClick={() => {
                  // Set a brief timeout to ensure modal is open before confetti
                  setTimeout(launchConfetti, 300);
                }}
              >
                <Trophy className="h-4 w-4 mr-2" />
                View Achievement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-orange-500">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-center justify-center mb-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <span className="text-center">Campaign Goal Achieved!</span>
                </DialogTitle>
                <DialogDescription>
                  <div className="py-6 flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Star className="h-12 w-12 text-yellow-500" />
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4">
                <h3 className="font-semibold text-center text-lg">{achievement.campaignName}</h3>
                
                <div className="bg-gray-900 rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-400">ACoS Improvement</p>
                      <p className="text-xl font-bold text-green-500">
                        {achievement.improvement}%
                        <TrendingUp className="h-4 w-4 inline ml-1" />
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Revenue</p>
                      <p className="text-xl font-bold">
                        ${achievement.revenue.toLocaleString()}
                        <span className="text-green-500 text-sm ml-1">
                          +{achievement.revenueIncrease}%
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Conversions</p>
                      <p className="text-xl font-bold">
                        {achievement.conversions}
                        <span className="text-green-500 text-sm ml-1">
                          +{achievement.conversionIncrease}%
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="text-xl font-bold text-green-500">
                        Exceeding Goals
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-sm text-gray-400 mt-2">
                  Congratulations! This campaign has exceeded its target ACoS by {achievement.improvement}%. 
                  Would you like to save this report or share it with your team?
                </p>
              </div>
              
              <DialogFooter className="flex justify-between sm:justify-between mt-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Save Report
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  Share
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Apply Strategy
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

// Small target icon component
function Target({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  );
}