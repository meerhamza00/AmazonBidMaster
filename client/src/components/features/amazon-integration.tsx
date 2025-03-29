import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  RefreshCw, 
  Database, 
  Shield, 
  Key, 
  CheckCircle2, 
  Clock, 
  Link as LinkIcon,
  Settings
} from 'lucide-react';

export default function AmazonIntegration() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  
  const handleConnect = () => {
    setConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setConnected(true);
      setConnecting(false);
    }, 2000);
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate refresh process
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  // Amazon Advertising account profiles
  const profiles = [
    { id: 1, name: 'Example Brand Store', type: 'Vendor', marketplace: 'United States', campaigns: 12 },
    { id: 2, name: 'Example Global Seller', type: 'Seller', marketplace: 'Europe (5 countries)', campaigns: 28 }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Integration with Amazon Advertising API
          {connected && <CheckCircle2 className="h-4 w-4 text-green-500" />}
        </CardTitle>
        <CardDescription>
          Connect directly to your Amazon Advertising account for real-time data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="connect">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connect">Connection</TabsTrigger>
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect">
            <div className="space-y-4 mt-4">
              {!connected ? (
                <>
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                    <h3 className="font-medium text-sm flex items-center gap-2 mb-3">
                      <Key className="h-4 w-4 text-orange-500" />
                      Amazon Advertising API Credentials
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="grid gap-2">
                        <Label htmlFor="clientId">Client ID</Label>
                        <Input 
                          id="clientId" 
                          placeholder="amzn1.application-oa2-client.xxxxxxxx" 
                          type="password"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="clientSecret">Client Secret</Label>
                        <Input 
                          id="clientSecret" 
                          placeholder="••••••••••••••••••••••••••••••" 
                          type="password"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="refreshToken">Refresh Token</Label>
                        <Input 
                          id="refreshToken" 
                          placeholder="Amzn.XXXXXXXX..." 
                          type="password"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={handleConnect}
                        disabled={connecting}
                      >
                        {connecting ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Connect to Amazon Advertising
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-400">
                      <p className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Your credentials are stored securely and never shared.
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-orange-950/20 border border-orange-900/50 rounded-lg">
                    <div className="flex gap-2 text-sm">
                      <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-orange-500">Amazon API Access Required</p>
                        <p className="mt-1 text-gray-400">
                          To use this feature, you'll need to create an Amazon Advertising API account and generate credentials.
                          Follow the <a href="#" className="text-orange-500 hover:underline">API Access Guide</a> to set up your account.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-green-950/20 border border-green-900/50 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-green-500">Successfully Connected!</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Your Amazon Advertising account is now connected. Data will be synchronized automatically.
                      </p>
                      
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">Last synced: Just now</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-xs"
                          onClick={handleRefresh}
                          disabled={refreshing}
                        >
                          <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                          {refreshing ? 'Syncing...' : 'Sync now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 space-y-3">
                    <h3 className="font-medium text-sm flex items-center gap-2">
                      <Database className="h-4 w-4 text-orange-500" />
                      Synchronized Data Types
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[
                        'Campaigns', 'Ad Groups', 'Keywords', 'Product Ads', 
                        'Negative Keywords', 'Performance Metrics', 'Targeting', 'Budgets'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="profiles">
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                <h3 className="font-medium text-sm mb-3">Available Advertising Profiles</h3>
                
                {profiles.map((profile) => (
                  <div 
                    key={profile.id} 
                    className="p-3 border border-gray-800 rounded-md mb-3 last:mb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{profile.name}</h4>
                        <p className="text-xs text-gray-400">
                          {profile.type} • {profile.marketplace}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                        <Database className="h-3 w-3" />
                        {profile.campaigns} campaigns
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        View Details
                      </Button>
                      <Button variant="default" size="sm" className="h-7 text-xs bg-orange-500 hover:bg-orange-600">
                        Select Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                <h3 className="font-medium text-sm flex items-center gap-2 mb-3">
                  <Settings className="h-4 w-4 text-orange-500" />
                  API Integration Settings
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-sync">Auto-sync data</Label>
                      <p className="text-xs text-gray-400">
                        Automatically sync data every 6 hours
                      </p>
                    </div>
                    <Switch 
                      id="auto-sync" 
                      checked={autoSync}
                      onCheckedChange={setAutoSync}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Sync notifications</Label>
                      <p className="text-xs text-gray-400">
                        Get notified when data sync completes
                      </p>
                    </div>
                    <Switch id="notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="historical">Historical data</Label>
                      <p className="text-xs text-gray-400">
                        Import past 90 days of campaign data
                      </p>
                    </div>
                    <Switch id="historical" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                <h3 className="font-medium text-sm mb-3">Data Retention</h3>
                
                <div className="space-y-2">
                  <div className="grid gap-2">
                    <Label htmlFor="retention">Keep data for</Label>
                    <select 
                      id="retention" 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="180" selected>180 days</option>
                      <option value="365">365 days</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-gray-500">
          This integration requires an Amazon Advertising API access. 
          Your account must have the appropriate permissions to access the API.
        </p>
      </CardFooter>
    </Card>
  );
}