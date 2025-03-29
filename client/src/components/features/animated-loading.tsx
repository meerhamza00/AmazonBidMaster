import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { SlidersHorizontal, RefreshCw, CheckCircle, PieChart, BarChart3, LineChart } from 'lucide-react';

export default function AnimatedLoading() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loaded, setLoaded] = useState(false);
  
  const loadingSteps = [
    'Fetching campaign data...',
    'Processing metrics...',
    'Calculating performance indicators...',
    'Preparing visualizations...',
    'Optimizing dashboard...'
  ];
  
  const handleSimulateLoading = () => {
    setLoading(true);
    setProgress(0);
    setLoadingStep(0);
    setLoaded(false);
    
    // Reset animation after finishing
    setTimeout(() => {
      setLoaded(true);
      
      // Reset for next demo
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setLoadingStep(0);
        setLoaded(false);
      }, 3000);
    }, 5000);
  };
  
  // Progress animation
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (loading && progress < 100) {
      interval = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = prevProgress + 1;
          
          // Update loading step based on progress
          if (newProgress === 20) setLoadingStep(1);
          if (newProgress === 40) setLoadingStep(2);
          if (newProgress === 60) setLoadingStep(3);
          if (newProgress === 80) setLoadingStep(4);
          
          return newProgress;
        });
      }, 50);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, progress]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Animated Dashboard Loading Transitions</CardTitle>
        <CardDescription>
          Smooth, informative loading animations when data is being processed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          <Button 
            onClick={handleSimulateLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Simulate Dashboard Loading'}
          </Button>
        </div>
        
        {loading && (
          <div className="space-y-4">
            <div className="p-4 border border-gray-800 rounded-lg bg-gray-900/50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Dashboard Loading</h3>
                <span className="text-xs text-gray-400">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="mt-2 text-sm text-orange-500">{loadingSteps[loadingStep]}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className={`h-4 w-24 bg-gray-800 ${progress > i * 20 ? 'animate-pulse' : ''}`} />
                  <Skeleton className={`h-32 w-full bg-gray-800 ${progress > i * 25 ? 'animate-pulse' : ''}`} />
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className={`h-4 w-1/3 bg-gray-800 ${progress > 60 ? 'animate-pulse' : ''}`} />
                  <Skeleton className={`h-4 w-1/4 bg-gray-800 ${progress > 70 ? 'animate-pulse' : ''}`} />
                </div>
                <Skeleton className={`h-40 w-full bg-gray-800 ${progress > 75 ? 'animate-pulse' : ''}`} />
              </div>
              <div className="space-y-3">
                <Skeleton className={`h-4 w-1/2 bg-gray-800 ${progress > 80 ? 'animate-pulse' : ''}`} />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className={`h-18 w-full bg-gray-800 ${progress > 85 ? 'animate-pulse' : ''}`} />
                  <Skeleton className={`h-18 w-full bg-gray-800 ${progress > 90 ? 'animate-pulse' : ''}`} />
                  <Skeleton className={`h-18 w-full bg-gray-800 ${progress > 90 ? 'animate-pulse' : ''}`} />
                  <Skeleton className={`h-18 w-full bg-gray-800 ${progress > 95 ? 'animate-pulse' : ''}`} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {loaded && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 border border-green-500/30 rounded-lg bg-gray-900/50 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-green-500">Dashboard Loaded Successfully</h3>
                <p className="text-xs text-gray-400">All components and data are now ready</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <PieChart className="h-4 w-4 mr-2 text-orange-500" />
                    Campaign Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-28 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-28 flex flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <div className="h-4 bg-blue-500/20 rounded-full w-full"></div>
                      <div className="h-4 bg-blue-500/40 rounded-full w-full"></div>
                    </div>
                    <div className="flex justify-between gap-2">
                      <div className="h-4 bg-blue-500/60 rounded-full w-full"></div>
                      <div className="h-4 bg-blue-500/80 rounded-full w-full"></div>
                    </div>
                    <div className="flex justify-between gap-2">
                      <div className="h-4 bg-blue-500/30 rounded-full w-full"></div>
                      <div className="h-4 bg-blue-500/50 rounded-full w-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <LineChart className="h-4 w-4 mr-2 text-green-500" />
                    Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-28 flex items-end justify-between">
                    <div className="h-10 w-3 bg-green-500/30 rounded-t"></div>
                    <div className="h-16 w-3 bg-green-500/40 rounded-t"></div>
                    <div className="h-8 w-3 bg-green-500/50 rounded-t"></div>
                    <div className="h-20 w-3 bg-green-500/60 rounded-t"></div>
                    <div className="h-14 w-3 bg-green-500/70 rounded-t"></div>
                    <div className="h-24 w-3 bg-green-500/80 rounded-t"></div>
                    <div className="h-10 w-3 bg-green-500/90 rounded-t"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center text-sm text-gray-400">
              <p>The dashboard loading animations enhance user experience by providing visual feedback during data processing.</p>
              <p className="mt-1">Click the button above to see the animation again.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}