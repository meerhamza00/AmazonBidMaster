import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AlertCircle, 
  LineChart, 
  Settings, 
  DollarSign, 
  BookOpen, 
  BarChart3,
  ChevronRight,
  Lightbulb,
  Zap,
  Upload,
  Sparkles,
  Award,
  Wrench // Added Wrench icon
} from "lucide-react";

export default function Documentation() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Complete guide for Amazon PPC Bid Optimization & Analytics Tool
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="usage">Usage Guide</TabsTrigger>
          <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-6 w-6 text-orange-500 mr-2" />
                What is Amazon PPC Optimizer?
              </CardTitle>
              <CardDescription>
                A comprehensive tool for Amazon PPC campaign management and optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  <strong>Amazon PPC Optimizer</strong> is an end-to-end bid optimization and analytics tool designed specifically for Amazon PPC managers and e-commerce advertisers. This tool is built to streamline campaign analysis, increase efficiency, and optimize advertising performance through data-driven insights and automated rule-based bidding strategies.
                </p>
                <h3>Core Purpose</h3>
                <p>
                  The primary goal of this tool is to help you maximize return on ad spend (ROAS) by providing:
                </p>
                <ul>
                  <li>Comprehensive campaign performance analysis</li>
                  <li>Data-driven bid optimization recommendations</li>
                  <li>Automated rule-based bidding adjustments</li>
                  <li>Advanced performance visualization and forecasting</li>
                  <li>AI-powered PPC expert mentorship</li>
                </ul>
                <p>
                  Whether you're managing a single Amazon store or multiple client accounts, this tool is designed to save you time, reduce wasted ad spend, and maximize your advertising outcomes.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <LineChart className="h-5 w-5 text-orange-500 mr-2" />
                      Data Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Process and visualize campaign data to identify trends, opportunities, and areas for improvement.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Settings className="h-5 w-5 text-orange-500 mr-2" />
                      Optimization Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Create custom bidding rules based on performance metrics to automate bid adjustments.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <DollarSign className="h-5 w-5 text-orange-500 mr-2" />
                      Advanced Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Leverage AI and machine learning capabilities for deeper insights and predictive optimization.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-6 w-6 text-orange-500 mr-2" />
                Why Use This Tool?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <h3>For PPC Managers</h3>
                <p>
                  Managing multiple Amazon PPC campaigns can be overwhelming. This tool helps you:
                </p>
                <ul>
                  <li><strong>Save time</strong> through automated analysis and bid adjustments</li>
                  <li><strong>Reduce costs</strong> by identifying underperforming keywords and campaigns</li>
                  <li><strong>Increase ROAS</strong> through data-driven optimization strategies</li>
                  <li><strong>Make better decisions</strong> with comprehensive performance visualizations</li>
                  <li><strong>Improve client outcomes</strong> with accurate forecasting and reporting</li>
                </ul>

                <h3>For Business Owners</h3>
                <p>
                  If you're running your own Amazon store, this tool helps you:
                </p>
                <ul>
                  <li><strong>Compete effectively</strong> against larger sellers with bigger budgets</li>
                  <li><strong>Optimize your limited ad spend</strong> for maximum return</li>
                  <li><strong>Identify profitable keywords</strong> and audience segments</li>
                  <li><strong>Reduce time spent</strong> on manual campaign management</li>
                  <li><strong>Make confident decisions</strong> with AI-powered guidance</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FEATURES TAB */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-6 w-6 text-orange-500 mr-2" />
                Key Features
              </CardTitle>
              <CardDescription>
                Comprehensive overview of all tool capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium">
                    Dashboard & Campaign Analysis
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <p>
                        The Dashboard provides a comprehensive overview of your Amazon PPC campaign performance with the following key components:
                      </p>
                      
                      <h4>Campaign Table</h4>
                      <p>
                        A sortable, filterable table displaying all your campaigns with critical metrics:
                      </p>
                      <ul>
                        <li><strong>Name:</strong> Campaign identifier</li>
                        <li><strong>Spend:</strong> Total ad spend</li>
                        <li><strong>Sales:</strong> Revenue generated</li>
                        <li><strong>ACoS:</strong> Advertising Cost of Sale percentage</li>
                        <li><strong>ROAS:</strong> Return on Ad Spend ratio</li>
                        <li><strong>Impressions:</strong> Number of ad views</li>
                        <li><strong>Clicks:</strong> Number of ad clicks</li>
                        <li><strong>CTR:</strong> Click-Through Rate percentage</li>
                      </ul>
                      <p>
                        The table allows for sorting on any column and includes a search function to quickly locate specific campaigns.
                      </p>
                      
                      <h4>KPI Cards</h4>
                      <p>
                        At-a-glance performance indicators showing aggregate metrics across all campaigns:
                      </p>
                      <ul>
                        <li><strong>Total Spend:</strong> Sum of all campaign expenditures</li>
                        <li><strong>Total Sales:</strong> Combined revenue from all campaigns</li>
                        <li><strong>Average ACoS:</strong> Overall advertising cost percentage</li>
                        <li><strong>Average ROAS:</strong> Overall return on ad spend</li>
                      </ul>
                      <p>
                        Each KPI card includes a trend indicator showing performance change over the selected time period.
                      </p>
                      
                      <h4>Performance Charts</h4>
                      <p>
                        Interactive visualizations of campaign performance data:
                      </p>
                      <ul>
                        <li><strong>Time-Series Analysis:</strong> Track metrics over time to identify trends</li>
                        <li><strong>Metric Comparison:</strong> Compare multiple campaigns across key performance indicators</li>
                        <li><strong>Filter Options:</strong> View all campaigns, top 10, or bottom 10 based on selected metrics</li>
                      </ul>
                      <p>
                        Charts are interactive with hover tooltips providing detailed data points.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium">
                    Bid Optimization & Rule Engine
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <p>
                        The Optimization Rules section allows you to create automated bidding rules based on campaign performance metrics:
                      </p>
                      
                      <h4>Rule Editor</h4>
                      <p>
                        Create custom bidding rules with the following components:
                      </p>
                      <ul>
                        <li><strong>Rule Name:</strong> Identifier for the rule</li>
                        <li><strong>Description:</strong> Detailed explanation of the rule's purpose</li>
                        <li><strong>Condition Builder:</strong> Set trigger conditions based on metrics like ACoS, ROAS, CTR, etc.</li>
                        <li><strong>Action Settings:</strong> Define bid adjustments (increase, decrease, or set to specific amount)</li>
                        <li><strong>Schedule:</strong> Set when and how often the rule should run</li>
                      </ul>
                      
                      <h4>Advanced Rule Customization</h4>
                      <p>
                        Our advanced rule customization interface provides sophisticated control over your bid optimization strategies. These powerful features enable you to create precisely targeted rules that respond to complex market conditions and campaign performance patterns.
                      </p>
                      
                      <h5>Why Use Advanced Rule Customization?</h5>
                      <p>
                        Standard rule-based optimization is effective for basic scenarios, but Amazon PPC campaigns often require more nuanced approaches for these reasons:
                      </p>
                      <ul>
                        <li><strong>Market Complexity:</strong> Amazon's marketplace has daily, weekly, and seasonal fluctuations that require adaptive bidding strategies</li>
                        <li><strong>Multi-Factor Decision Making:</strong> Optimal bidding often depends on the interplay of multiple metrics simultaneously (e.g., both ACoS and CTR)</li>
                        <li><strong>Time Sensitivity:</strong> Different bidding approaches may be needed during peak shopping hours versus off-hours</li>
                        <li><strong>Campaign Lifecycle:</strong> Optimal strategies differ between new product launches, established products, and seasonal items</li>
                      </ul>
                      
                      <h5>Key Advanced Features</h5>
                      <ul>
                        <li>
                          <strong>Multi-Condition Logic:</strong> Create sophisticated rules with nested AND/OR operators that evaluate multiple metrics simultaneously. 
                          <p className="text-sm text-gray-400 mt-1">
                            <em>Example:</em> Increase bids by 10% when (ACoS &lt; 20% AND CTR &gt; 0.5%) OR (ROAS &gt; 5 AND Impressions &lt; 1000)
                          </p>
                        </li>
                        <li>
                          <strong>Conditional Groups:</strong> Organize related conditions into logical groups for clearer rule structure and more complex decision trees.
                          <p className="text-sm text-gray-400 mt-1">
                            <em>Why it matters:</em> This enables you to create sophisticated bidding strategies that can handle complex scenarios like "increase bids for high-performing products but only if they also have sufficient profit margin"
                          </p>
                        </li>
                        <li>
                          <strong>Time Constraints:</strong> Apply rules only during specific days of the week or hours of the day.
                          <p className="text-sm text-gray-400 mt-1">
                            <em>Example use case:</em> Increase bids by 15% on weekends when conversion rates are historically higher, or reduce bids during late-night hours when clicks rarely convert to sales
                          </p>
                        </li>
                        <li>
                          <strong>Rule Impact Simulation:</strong> Preview how your rule will affect campaigns before activating it.
                          <p className="text-sm text-gray-400 mt-1">
                            <em>Business benefit:</em> Test rule effectiveness without risk by seeing which campaigns would be affected and how metrics would change, avoiding unexpected bid adjustments that could waste budget
                          </p>
                        </li>
                        <li>
                          <strong>Granular Metric Selection:</strong> Choose from an expanded set of performance indicators including lifetime metrics, recent trend data, and custom calculated values.
                          <p className="text-sm text-gray-400 mt-1">
                            <em>Strategic advantage:</em> This allows for more precise targeting of campaigns that need adjustment, rather than applying broad rules that might affect well-performing campaigns unnecessarily
                          </p>
                        </li>
                        <li>
                          <strong>JSON Rule Visualization:</strong> For technical users, view and edit the complete rule structure in JSON format.
                          <p className="text-sm text-gray-400 mt-1">
                            <em>Technical benefit:</em> Enables power users to create extremely complex rules beyond what the UI can easily represent, and facilitates rule copying across different accounts
                          </p>
                        </li>
                      </ul>
                      
                      <h5>When to Use Advanced Rules vs. Basic Rules</h5>
                      <table className="border-collapse table-auto w-full">
                        <thead>
                          <tr>
                            <th className="border-b border-slate-700 p-2">Scenario</th>
                            <th className="border-b border-slate-700 p-2">Recommended Approach</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border-b border-slate-700 p-2">New to Amazon PPC</td>
                            <td className="border-b border-slate-700 p-2">Start with basic rules to establish benchmarks</td>
                          </tr>
                          <tr>
                            <td className="border-b border-slate-700 p-2">Stable product with predictable performance</td>
                            <td className="border-b border-slate-700 p-2">Basic rules are typically sufficient</td>
                          </tr>
                          <tr>
                            <td className="border-b border-slate-700 p-2">Seasonal products with varying demand</td>
                            <td className="border-b border-slate-700 p-2">Advanced rules with time constraints</td>
                          </tr>
                          <tr>
                            <td className="border-b border-slate-700 p-2">Competitive product categories</td>
                            <td className="border-b border-slate-700 p-2">Advanced rules with multiple condition groups</td>
                          </tr>
                          <tr>
                            <td className="border-b border-slate-700 p-2">High-value products with narrow profit margins</td>
                            <td className="border-b border-slate-700 p-2">Advanced rules with precise metric targeting</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <h5>Performance Expectations</h5>
                      <p>
                        Clients using advanced rule customization typically report:
                      </p>
                      <ul>
                        <li><strong>10-15% improvement in ROAS</strong> compared to basic rule optimization</li>
                        <li><strong>Reduced bid volatility</strong> through more precise targeting conditions</li>
                        <li><strong>Lower wasted ad spend</strong> by automatically adjusting bids during low-converting periods</li>
                        <li><strong>More consistent performance</strong> across seasonal fluctuations</li>
                      </ul>
                      
                      <div className="bg-orange-950/30 p-4 rounded-lg border border-orange-500/30 mt-4">
                        <h5 className="flex items-center text-orange-400">
                          <Lightbulb className="h-5 w-5 mr-2" />
                          Pro Tip
                        </h5>
                        <p className="text-sm mt-1">
                          Start by creating a duplicate of your best-performing basic rule, then enhance it with advanced conditions. Run both rules in parallel (on different campaigns) to compare performance before fully transitioning to advanced rules.
                        </p>
                      </div>
                      
                      
                      <h4>Bid Optimizer</h4>
                      <p>
                        AI-powered bid recommendation system:
                      </p>
                      <ul>
                        <li><strong>Suggested Bids:</strong> ML-generated optimal bid recommendations</li>
                        <li><strong>Impact Forecasting:</strong> Projected effects of bid changes on key metrics</li>
                        <li><strong>Confidence Scoring:</strong> Reliability indicator for each recommendation</li>
                        <li><strong>One-Click Application:</strong> Apply recommendations directly to campaigns</li>
                      </ul>
                      
                      <h4>Rule Management</h4>
                      <p>
                        Tools for organizing and controlling your optimization rules:
                      </p>
                      <ul>
                        <li><strong>Rule List:</strong> View all created rules with status indicators</li>
                        <li><strong>Enable/Disable:</strong> Toggle rules on or off without deleting them</li>
                        <li><strong>Edit/Delete:</strong> Modify existing rules or remove them</li>
                        <li><strong>Rule History:</strong> Review past rule executions and their impacts</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium">
                    Forecasting & Predictive Analytics
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <p>
                        The forecasting capabilities help predict future campaign performance and optimize strategy:
                      </p>
                      
                      <h4>Campaign Forecast</h4>
                      <p>
                        Predictive analytics for individual campaigns:
                      </p>
                      <ul>
                        <li><strong>Performance Projections:</strong> Estimated future metrics based on historical data</li>
                        <li><strong>Confidence Intervals:</strong> Range of potential outcomes with probability indicators</li>
                        <li><strong>Metric Forecasts:</strong> Predictions for spend, sales, ACoS, ROAS, impressions, and CTR</li>
                        <li><strong>Time Range Selection:</strong> Adjustable forecast period (7, 14, 30, or 90 days)</li>
                      </ul>
                      
                      <h4>Trend Analysis</h4>
                      <p>
                        Identification of patterns and seasonal factors:
                      </p>
                      <ul>
                        <li><strong>Seasonality Detection:</strong> Recognition of periodic performance patterns</li>
                        <li><strong>Trend Visualization:</strong> Graphical representation of directional movements</li>
                        <li><strong>Anomaly Highlighting:</strong> Identification of unusual data points</li>
                        <li><strong>Comparative Analysis:</strong> Historical vs. projected performance</li>
                      </ul>
                      
                      <h4>Scenario Modeling</h4>
                      <p>
                        "What-if" analysis for strategy planning:
                      </p>
                      <ul>
                        <li><strong>Bid Adjustment Scenarios:</strong> Impact projections for different bidding strategies</li>
                        <li><strong>Budget Allocation Modeling:</strong> Optimal distribution of advertising spend</li>
                        <li><strong>Target Metric Achievement:</strong> Recommended actions to reach specific goals</li>
                        <li><strong>Risk Assessment:</strong> Evaluation of potential downside scenarios</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium">
                    Advanced Visualization Features
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>Data Point Highlighting</h4>
                      <p>
                        Intelligent system that emphasizes important trends and anomalies:
                      </p>
                      <ul>
                        <li><strong>Anomaly Detection:</strong> Automatic identification of outlier data points</li>
                        <li><strong>Trend Spotting:</strong> Visualization of significant performance shifts</li>
                        <li><strong>Threshold Alerts:</strong> Visual indicators when metrics cross defined thresholds</li>
                        <li><strong>Contextual Information:</strong> Explanatory tooltips for highlighted points</li>
                      </ul>
                      
                      <h4>Color-coded Performance Gradient Visualization</h4>
                      <p>
                        Visual performance indicators using color intensity:
                      </p>
                      <ul>
                        <li><strong>Metric Heatmaps:</strong> Color intensity representing performance levels</li>
                        <li><strong>Performance Spectrum:</strong> Gradient visualization from poor to excellent</li>
                        <li><strong>Comparative Coloring:</strong> Relative performance across campaigns</li>
                        <li><strong>Custom Thresholds:</strong> Adjustable boundaries for color categorization</li>
                      </ul>
                      
                      <h4>Interactive Marketing Tooltips</h4>
                      <p>
                        Contextual guidance embedded within the interface:
                      </p>
                      <ul>
                        <li><strong>Metric Explanations:</strong> Detailed descriptions of what each KPI means</li>
                        <li><strong>Optimization Tips:</strong> Actionable suggestions based on current data</li>
                        <li><strong>Industry Benchmarks:</strong> Comparative data for performance evaluation</li>
                        <li><strong>Best Practices:</strong> Expert recommendations for improvement</li>
                      </ul>
                      
                      <h4>Success Celebration Modal</h4>
                      <p>
                        Positive reinforcement for achieved goals:
                      </p>
                      <ul>
                        <li><strong>Achievement Recognition:</strong> Visual celebration when targets are met</li>
                        <li><strong>Confetti Effects:</strong> Interactive visual feedback for significant improvements</li>
                        <li><strong>Performance Summaries:</strong> Overview of successful optimizations</li>
                        <li><strong>Next-Step Recommendations:</strong> Suggested actions to build on success</li>
                      </ul>
                      
                      <h4>Animated Loading Transitions</h4>
                      <p>
                        Enhanced user experience during data processing:
                      </p>
                      <ul>
                        <li><strong>Progress Indicators:</strong> Visual feedback during data loading and processing</li>
                        <li><strong>Smooth Transitions:</strong> Fluid animations between interface states</li>
                        <li><strong>Skeleton Screens:</strong> Layout placeholders during content loading</li>
                        <li><strong>Interactive Elements:</strong> Responsive interface components</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-medium">
                    PPC Expert AI Chatbot
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <p>
                        The integrated AI chatbot provides personalized guidance and support:
                      </p>
                      
                      <h4>PPC Expert Mentorship</h4>
                      <p>
                        AI-powered assistant specializing in Amazon advertising:
                      </p>
                      <ul>
                        <li><strong>Strategy Advice:</strong> Personalized recommendations based on your campaign data</li>
                        <li><strong>Best Practices:</strong> Industry expertise and optimization guidance</li>
                        <li><strong>Question Answering:</strong> Responsive assistance for PPC-related inquiries</li>
                        <li><strong>Explanations:</strong> Clear descriptions of metrics, trends, and strategies</li>
                      </ul>
                      
                      <h4>Multi-Provider Support</h4>
                      <p>
                        Access to multiple AI services for enhanced capabilities:
                      </p>
                      <ul>
                        <li><strong>OpenAI (GPT-4o):</strong> Advanced reasoning and strategic guidance</li>
                        <li><strong>Anthropic (Claude 3.7 Sonnet):</strong> Nuanced understanding and detailed explanations</li>
                        <li><strong>Google Gemini:</strong> Additional analysis capabilities and diverse perspectives</li>
                        <li><strong>Provider Switching:</strong> Seamless transition between AI services as needed</li>
                      </ul>
                      
                      <h4>Conversation Management</h4>
                      <p>
                        Tools for organizing and retrieving AI interactions:
                      </p>
                      <ul>
                        <li><strong>Conversation History:</strong> Access to past chats and advice</li>
                        <li><strong>Topic Organization:</strong> Categorized conversations for easy reference</li>
                        <li><strong>Search Functionality:</strong> Quick retrieval of specific information</li>
                        <li><strong>Exportable Insights:</strong> Save valuable advice for offline reference</li>
                      </ul>
                      
                      <h4>Contextual Awareness</h4>
                      <p>
                        Intelligent understanding of your specific situation:
                      </p>
                      <ul>
                        <li><strong>Campaign-Specific Advice:</strong> Recommendations tailored to your data</li>
                        <li><strong>Performance Context:</strong> Guidance that considers historical trends</li>
                        <li><strong>Goal Alignment:</strong> Advice oriented toward your stated objectives</li>
                        <li><strong>Clarification Requests:</strong> Proactive questions to better understand your needs</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg font-medium">
                    Data Import & Integration
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>CSV Upload</h4>
                      <p>
                        Easy import of campaign data from Amazon reports:
                      </p>
                      <ul>
                        <li><strong>Drag-and-Drop Interface:</strong> Simple file upload mechanism</li>
                        <li><strong>Template Download:</strong> Sample CSV format for data preparation</li>
                        <li><strong>Validation:</strong> Automatic checking of data format and completeness</li>
                        <li><strong>Error Handling:</strong> Clear feedback for problematic uploads</li>
                      </ul>
                      
                      <h4>Amazon API Integration</h4>
                      <p>
                        Direct connection to Amazon Advertising API:
                      </p>
                      <ul>
                        <li><strong>Authentication:</strong> Secure connection to Amazon advertising accounts</li>
                        <li><strong>Auto-Sync:</strong> Regular updates from the advertising platform</li>
                        <li><strong>Campaign Retrieval:</strong> Automatic import of campaign data</li>
                        <li><strong>Bid Management:</strong> Direct updating of bids through the API</li>
                      </ul>
                      
                      <h4>Data Processing</h4>
                      <p>
                        Transformation of raw data into actionable insights:
                      </p>
                      <ul>
                        <li><strong>Metric Calculation:</strong> Derivation of key performance indicators</li>
                        <li><strong>Data Cleaning:</strong> Handling of missing or inconsistent information</li>
                        <li><strong>Aggregation:</strong> Summarization across campaigns and time periods</li>
                        <li><strong>Historical Storage:</strong> Retention of data for long-term analysis</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USAGE GUIDE TAB */}
        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-6 w-6 text-orange-500 mr-2" />
                Step-by-Step Usage Guide
              </CardTitle>
              <CardDescription>
                Learn how to use each aspect of the Amazon PPC Optimizer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="font-bold">1</span>
                      </div>
                      <h3 className="text-xl font-semibold">Initial Setup & Data Import</h3>
                    </div>
                    <div className="ml-10 space-y-4 prose dark:prose-invert max-w-none">
                      <ol>
                        <li>
                          <strong>Access CSV Upload:</strong>
                          <p>From the Dashboard, locate the "Upload Campaign Data" button or section.</p>
                        </li>
                        <li>
                          <strong>Prepare Your Data:</strong>
                          <p>If needed, download the template CSV file to ensure your data is formatted correctly. The template includes columns for campaign name, spend, sales, impressions, clicks, and date ranges.</p>
                        </li>
                        <li>
                          <strong>Upload Campaign Data:</strong>
                          <p>Either drag and drop your CSV file into the designated area or click to browse and select the file from your computer.</p>
                        </li>
                        <li>
                          <strong>Validate Import:</strong>
                          <p>The system will analyze your file and notify you of any formatting issues or missing data. Fix any highlighted problems and re-upload if necessary.</p>
                        </li>
                        <li>
                          <strong>Confirm Data:</strong>
                          <p>Review the imported campaigns and metrics to ensure everything has been correctly processed before proceeding.</p>
                        </li>
                      </ol>

                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-4 my-4">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-amber-500">Important</h4>
                            <p className="text-sm mt-1">
                              For optimal analysis, ensure your CSV data includes at least 30 days of campaign history. This provides sufficient historical context for accurate forecasting and trend analysis.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="font-bold">2</span>
                      </div>
                      <h3 className="text-xl font-semibold">Exploring the Dashboard</h3>
                    </div>
                    <div className="ml-10 space-y-4 prose dark:prose-invert max-w-none">
                      <p>After importing your data, the Dashboard provides a comprehensive overview of your campaign performance:</p>
                      
                      <ol>
                        <li>
                          <strong>Review KPI Cards:</strong>
                          <p>At the top of the Dashboard, examine the key performance indicators showing total spend, sales, average ACoS, and ROAS across all campaigns.</p>
                        </li>
                        <li>
                          <strong>Explore Campaign Table:</strong>
                          <p>
                            Below the KPIs, you'll find a detailed table of all campaigns with their performance metrics:
                            <ul>
                              <li>Sort campaigns by clicking on column headers</li>
                              <li>Search for specific campaigns using the search box</li>
                              <li>Click on any campaign row to view detailed information</li>
                            </ul>
                          </p>
                        </li>
                        <li>
                          <strong>Analyze Performance Charts:</strong>
                          <p>
                            Interact with the visualization section to understand performance trends:
                            <ul>
                              <li>Select different metrics to visualize from the dropdown menu</li>
                              <li>Choose between "All Campaigns," "Top 10," or "Bottom 10" views</li>
                              <li>Hover over data points to see detailed information</li>
                              <li>Adjust the time period using the date range selector</li>
                            </ul>
                          </p>
                        </li>
                        <li>
                          <strong>Access Campaign Details:</strong>
                          <p>Click on a campaign in the table to expand its detailed view, showing additional metrics, historical performance, and optimization opportunities.</p>
                        </li>
                      </ol>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="font-bold">3</span>
                      </div>
                      <h3 className="text-xl font-semibold">Creating Optimization Rules</h3>
                    </div>
                    <div className="ml-10 space-y-4 prose dark:prose-invert max-w-none">
                      <p>The Rules section allows you to create automated bidding strategies based on performance criteria:</p>
                      
                      <ol>
                        <li>
                          <strong>Navigate to Rules:</strong>
                          <p>Click on "Optimization Rules" in the main navigation menu.</p>
                        </li>
                        <li>
                          <strong>Create New Rule:</strong>
                          <p>Click the "Create Rule" or "+" button to open the rule editor.</p>
                        </li>
                        <li>
                          <strong>Configure Basic Rule Settings:</strong>
                          <p>
                            Fill in the fundamental rule information:
                            <ul>
                              <li>Rule Name: Give your rule a descriptive name (e.g., "Reduce bids for high ACoS campaigns")</li>
                              <li>Description: Add details about the rule's purpose and expected outcomes</li>
                              <li>Apply To: Select which campaigns the rule should affect (all, selected, or filtered)</li>
                            </ul>
                          </p>
                        </li>
                        <li>
                          <strong>Define Conditions:</strong>
                          <p>
                            Set the criteria that will trigger your rule:
                            <ul>
                              <li>Select Metric: Choose the performance indicator (ACoS, ROAS, CTR, etc.)</li>
                              <li>Set Operator: Define the comparison (greater than, less than, equal to, etc.)</li>
                              <li>Enter Value: Specify the threshold value</li>
                              <li>Add multiple conditions using AND/OR logic if needed</li>
                            </ul>
                          </p>
                        </li>
                        <li>
                          <strong>Set Actions:</strong>
                          <p>
                            Define what happens when conditions are met:
                            <ul>
                              <li>Action Type: Choose bid adjustment (increase, decrease, or set to specific amount)</li>
                              <li>Adjustment Value: Enter percentage or fixed amount</li>
                              <li>Maximum/Minimum Bids: Set limits to prevent extreme adjustments</li>
                            </ul>
                          </p>
                        </li>
                        <li>
                          <strong>Configure Schedule:</strong>
                          <p>
                            Determine when the rule should run:
                            <ul>
                              <li>Frequency: How often the rule should evaluate campaigns (daily, weekly, etc.)</li>
                              <li>Time Constraints: Specific days or hours when the rule should apply</li>
                              <li>Start/End Dates: Optional time boundaries for the rule's activity</li>
                            </ul>
                          </p>
                        </li>
                        <li>
                          <strong>Save and Activate:</strong>
                          <p>Click "Save Rule" to create the rule and toggle the activation switch to enable it.</p>
                        </li>
                      </ol>

                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-4 my-4">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-amber-500">Pro Tip</h4>
                            <p className="text-sm mt-1">
                              Start with conservative rules (small bid adjustments) and monitor their impact before implementing more aggressive strategies. This approach helps prevent unwanted performance fluctuations.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="font-bold">4</span>
                      </div>
                      <h3 className="text-xl font-semibold">Using Advanced Features</h3>
                    </div>
                    <div className="ml-10 space-y-4 prose dark:prose-invert max-w-none">
                      <p>Leverage the advanced visualization and analysis capabilities to gain deeper insights:</p>
                      
                      <h4 className="text-lg font-medium mt-4">Advanced Rule Customization</h4>
                      <p className="mb-3">
                        To access and use the advanced rule customization features for sophisticated bid management:
                      </p>
                      <ol className="list-decimal space-y-3">
                        <li>
                          <strong>Navigate to Rules:</strong>
                          <p>Go to the "Rules" section in the main navigation.</p>
                        </li>
                        <li>
                          <strong>Create or Edit a Rule:</strong>
                          <p>Click "Create Rule" or select "Edit" on an existing rule.</p>
                        </li>
                        <li>
                          <strong>Switch to Advanced Editor:</strong>
                          <p>In the rule dialog, select the "Advanced Editor" tab (look for the ✨ sparkles icon).</p>
                        </li>
                        <li>
                          <strong>Build Complex Conditions:</strong>
                          <p>Use the condition builder to create nested logic groups with AND/OR operators.</p>
                          <div className="bg-black/20 p-3 rounded-md mt-2 text-sm">
                            <p className="text-gray-300 italic">Example workflow:</p>
                            <ul className="list-disc mt-1 space-y-1">
                              <li>Add a condition group</li>
                              <li>Select relevant metrics (ACoS, ROAS, CTR, etc.)</li>
                              <li>Choose appropriate operators (greater than, less than, etc.)</li>
                              <li>Set threshold values</li>
                              <li>Add additional conditions with + button</li>
                              <li>Add nested condition groups as needed</li>
                            </ul>
                          </div>
                        </li>
                        <li>
                          <strong>Set Time Constraints:</strong>
                          <p>Specify days of the week and time ranges when the rule should be active.</p>
                          <div className="bg-black/20 p-3 rounded-md mt-2 text-sm">
                            <p>
                              ⚠️ <strong>Important:</strong> Time constraints are particularly valuable for:
                            </p>
                            <ul className="list-disc mt-1 space-y-1 text-gray-300">
                              <li>Products with peak shopping hours (e.g., food delivery during meal times)</li>
                              <li>Different bid strategies for weekdays vs. weekends</li>
                              <li>Seasonal adjustments for holiday periods</li>
                            </ul>
                          </div>
                        </li>
                        <li>
                          <strong>Preview Rule Impact:</strong>
                          <p>Use the Rule Impact Simulator to see how your rule will affect existing campaigns.</p>
                          <div className="bg-orange-500/10 p-3 rounded-md mt-2 text-sm border border-orange-500/20">
                            <p className="text-orange-400 font-medium">Pro Tip:</p>
                            <p className="text-gray-300 mt-1">
                              Always use the Rule Impact Simulator before saving complex rules. This helps identify any unintended consequences and ensures the rule behaves as expected across your campaign portfolio.
                            </p>
                          </div>
                        </li>
                        <li>
                          <strong>Save and Activate:</strong>
                          <p>Once you're satisfied with the rule configuration, save it and toggle it to active status.</p>
                        </li>
                      </ol>
                      
                      <h4 className="text-lg font-medium mt-6">Rule Optimization Strategy</h4>
                      <p className="mb-3">
                        For best results when using advanced rules:
                      </p>
                      <ul className="list-disc space-y-2">
                        <li>
                          <strong>Start Simple:</strong> Begin with one or two condition groups before building more complex rules
                        </li>
                        <li>
                          <strong>Test on Limited Campaigns:</strong> Apply new advanced rules to a subset of campaigns first
                        </li>
                        <li>
                          <strong>Monitor Performance:</strong> Check rule impact after 5-7 days before expanding to more campaigns
                        </li>
                        <li>
                          <strong>Iterate Gradually:</strong> Make incremental improvements rather than dramatic rule changes
                        </li>
                        <li>
                          <strong>Combine with Forecasting:</strong> Use campaign forecasts to validate your rule strategies
                        </li>
                      </ul>
                      
                      <h4 className="text-lg font-medium mt-6">Other Visualization Features</h4>
                      <ol className="list-decimal space-y-3">
                        <li>
                          <strong>Access Advanced Features:</strong>
                          <p>Click on "Advanced Features" in the main navigation or dashboard section.</p>
                        </li>
                        <li>
                          <strong>Explore Data Point Highlighting:</strong>
                          <p>
                            The system automatically identifies significant data points:
                            <ul>
                              <li>Look for highlighted points in charts and graphs</li>
                              <li>Hover over highlighted points to see explanations of their significance</li>
                              <li>Use filters to focus on specific types of anomalies or trends</li>
                            </ul>
                          </p>
                        </li>
                        <li>
                          <strong>Utilize Performance Gradient Visualization:</strong>
                          <p>
                            Interpret color-coded performance indicators:
                            <ul>
                              <li>Understand the color spectrum (typically red to green) indicating performance levels</li>
                              <li>Identify high-performing campaigns (deep green) and problematic ones (deep red)</li>
                              <li>Adjust threshold settings to customize the gradient scale if needed</li>
                            </ul>
                          </p>
                        </li>
                        <li>
                          <strong>Interact with Marketing Tooltips:</strong>
                          <p>
                            Access contextual guidance throughout the interface:
                            <ul>
                              <li>Look for information icons (i) next to metrics and charts</li>
                              <li>Hover over or click these icons to view detailed explanations and optimization tips</li>
                              <li>Use the provided benchmarks to evaluate your performance against industry standards</li>
                            </ul>
                          </p>
                        </li>
                        <li>
                          <strong>Review Campaign Forecasts:</strong>
                          <p>
                            Analyze predictive data for individual campaigns:
                            <ul>
                              <li>Select a campaign and navigate to its forecast section</li>
                              <li>Adjust the forecast period (7, 14, 30, or 90 days) as needed</li>
                              <li>Examine projected metrics and confidence intervals</li>
                              <li>Use scenario modeling to test different strategy approaches</li>
                            </ul>
                          </p>
                        </li>
                      </ol>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="font-bold">5</span>
                      </div>
                      <h3 className="text-xl font-semibold">Consulting the PPC Expert Chatbot</h3>
                    </div>
                    <div className="ml-10 space-y-4 prose dark:prose-invert max-w-none">
                      <p>Get personalized guidance from the AI assistant whenever you need help:</p>
                      
                      <ol>
                        <li>
                          <strong>Open the Chatbot:</strong>
                          <p>Click on the chat icon in the bottom right corner of the interface to open the PPC Expert Chatbot.</p>
                        </li>
                        <li>
                          <strong>Select AI Provider:</strong>
                          <p>
                            Choose your preferred AI service from the available options:
                            <ul>
                              <li>OpenAI (GPT-4o): For comprehensive strategy advice</li>
                              <li>Anthropic (Claude): For detailed explanations and nuanced guidance</li>
                              <li>Google Gemini: For alternative perspectives and analysis</li>
                            </ul>
                          </p>
                        </li>
                        <li>
                          <strong>Ask Questions:</strong>
                          <p>
                            Enter your queries or requests in the chat input field. You can ask about:
                            <ul>
                              <li>Specific metrics or trends in your data</li>
                              <li>Optimization strategies for particular campaigns</li>
                              <li>Explanations of Amazon PPC concepts and best practices</li>
                              <li>Recommendations for improving performance</li>
                              <li>Interpretations of unusual patterns or changes</li>
                            </ul>
                          </p>
                        </li>
                        <li>
                          <strong>Review and Apply Advice:</strong>
                          <p>
                            Evaluate the chatbot's recommendations and implement as appropriate:
                            <ul>
                              <li>Consider the context and confidence level of the advice</li>
                              <li>Test suggestions on a small scale before broader implementation</li>
                              <li>Follow up with specific questions if needed</li>
                            </ul>
                          </p>
                        </li>
                        <li>
                          <strong>Manage Conversations:</strong>
                          <p>
                            Organize your interactions with the chatbot:
                            <ul>
                              <li>Start new conversations for different topics or questions</li>
                              <li>Access conversation history to review previous advice</li>
                              <li>Save important insights for future reference</li>
                            </ul>
                          </p>
                        </li>
                      </ol>

                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-4 my-4">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-amber-500">Maximizing Chatbot Value</h4>
                            <p className="text-sm mt-1">
                              Be specific in your questions to get the most relevant advice. For example, rather than asking "How can I improve my campaigns?", try "What strategies can I use to reduce ACoS for my underperforming beauty product campaigns that have high click rates but low conversion?"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PREREQUISITES TAB */}
        <TabsContent value="prerequisites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChevronRight className="h-6 w-6 text-orange-500 mr-2" />
                Before You Begin
              </CardTitle>
              <CardDescription>
                Requirements and preparation for using the Amazon PPC Optimizer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <h3>Data Requirements</h3>
                <p>
                  To use the Amazon PPC Optimizer effectively, you'll need the following data:
                </p>
                <ul>
                  <li>
                    <strong>Campaign Reports:</strong> Historical data from your Amazon Advertising console (minimum 30 days recommended)
                  </li>
                  <li>
                    <strong>Required Metrics:</strong> Campaign name, spend, sales, impressions, clicks, and date ranges at minimum
                  </li>
                  <li>
                    <strong>Data Format:</strong> CSV files exported from Amazon Advertising or formatted according to the provided template
                  </li>
                  <li>
                    <strong>Account Information:</strong> For API integration, you'll need your Amazon Advertising API credentials
                  </li>
                </ul>

                <h3>API Keys for AI Features</h3>
                <p>
                  To use the PPC Expert Chatbot, you'll need at least one of the following API keys:
                </p>
                <ul>
                  <li>
                    <strong>OpenAI API Key:</strong> For access to GPT-4o capabilities
                  </li>
                  <li>
                    <strong>Anthropic API Key:</strong> For access to Claude 3.7 Sonnet capabilities
                  </li>
                  <li>
                    <strong>Google API Key:</strong> For access to Gemini capabilities
                  </li>
                </ul>
                <p>
                  These keys can be obtained from the respective provider websites and added to your account settings.
                </p>

                <h3>System Requirements</h3>
                <p>
                  The Amazon PPC Optimizer is a web-based application with the following requirements:
                </p>
                <ul>
                  <li>
                    <strong>Modern Web Browser:</strong> Chrome, Firefox, Safari, or Edge (latest versions recommended)
                  </li>
                  <li>
                    <strong>Internet Connection:</strong> Stable connection required for data processing and AI features
                  </li>
                  <li>
                    <strong>Screen Resolution:</strong> Minimum 1366x768 for optimal dashboard viewing experience
                  </li>
                </ul>

                <h3>Knowledge Prerequisites</h3>
                <p>
                  While the tool is designed to be user-friendly, basic familiarity with the following concepts will be helpful:
                </p>
                <ul>
                  <li>
                    <strong>Amazon Advertising Fundamentals:</strong> Understanding of campaign types, bidding, and basic metrics
                  </li>
                  <li>
                    <strong>Key Performance Indicators:</strong> Familiarity with ACoS, ROAS, CTR, and other advertising metrics
                  </li>
                  <li>
                    <strong>Basic Data Analysis:</strong> Ability to interpret trends and understand performance visualization
                  </li>
                </ul>
                <p>
                  Don't worry if you're not an expert in these areas — the tool includes explanations and the AI chatbot can provide guidance.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-6 w-6 text-orange-500 mr-2" />
                Data Preparation Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <h3>Exporting Data from Amazon</h3>
                <ol>
                  <li>
                    <strong>Log in to Amazon Advertising:</strong>
                    <p>Access your Amazon Advertising account through Seller Central or the dedicated Advertising Console.</p>
                  </li>
                  <li>
                    <strong>Navigate to Reports:</strong>
                    <p>Find the "Reports" or "Campaign Reports" section in the navigation menu.</p>
                  </li>
                  <li>
                    <strong>Select Report Type:</strong>
                    <p>Choose "Campaign Performance" or a similarly named report that includes all necessary metrics.</p>
                  </li>
                  <li>
                    <strong>Set Date Range:</strong>
                    <p>Select a date range of at least 30 days, preferably including recent data.</p>
                  </li>
                  <li>
                    <strong>Select Metrics:</strong>
                    <p>Ensure all essential metrics are included: Campaign Name, Spend, Sales, ACoS (if available), Impressions, Clicks, CTR, and any other relevant data.</p>
                  </li>
                  <li>
                    <strong>Generate and Download:</strong>
                    <p>Create the report and download it in CSV format.</p>
                  </li>
                </ol>

                <h3>Formatting Your CSV</h3>
                <p>
                  If you're creating a CSV file manually or need to modify an existing file, ensure it follows this structure:
                </p>
                <ul>
                  <li>
                    <strong>Required Columns:</strong>
                    <code>campaign_name,spend,sales,impressions,clicks,date_range_start,date_range_end</code>
                  </li>
                  <li>
                    <strong>Optional Columns:</strong>
                    <code>acos,roas,ctr,cpc,conversions,orders</code> (these will be calculated if not provided)
                  </li>
                  <li>
                    <strong>Data Types:</strong>
                    <ul>
                      <li>Text: campaign_name</li>
                      <li>Numbers: spend, sales, impressions, clicks (no currency symbols)</li>
                      <li>Dates: YYYY-MM-DD format for date_range_start and date_range_end</li>
                    </ul>
                  </li>
                </ul>

                <h3>API Integration Setup</h3>
                <p>
                  For automatic data synchronization, prepare the following:
                </p>
                <ol>
                  <li>
                    <strong>Create API Access:</strong>
                    <p>In Amazon Advertising, navigate to Settings {'>'} API Access to create credentials.</p>
                  </li>
                  <li>
                    <strong>Note Credentials:</strong>
                    <p>Save your Client ID, Client Secret, and Profile ID.</p>
                  </li>
                  <li>
                    <strong>Grant Permissions:</strong>
                    <p>Ensure you've granted read and write permissions for campaign management.</p>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TROUBLESHOOTING TAB */}
        <TabsContent value="troubleshooting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="h-6 w-6 text-orange-500 mr-2" />
                Troubleshooting Common Issues
              </CardTitle>
              <CardDescription>
                Solutions for common problems and errors you might encounter.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="ts-item-1">
                  <AccordionTrigger>
                    CSV data fails to import or shows errors
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      If you're having trouble importing your CSV data, try these steps:
                    </p>
                    <ol className="list-decimal pl-5 mt-2 space-y-1 text-muted-foreground">
                      <li>Ensure your CSV file strictly follows the provided template format. You can download the template from the CSV Upload section.</li>
                      <li>Check for common errors: incorrect column headers, missing required columns (e.g., <code>campaign_name</code>, <code>spend</code>, <code>sales</code>, <code>impressions</code>, <code>clicks</code>, <code>date_range_start</code>, <code>date_range_end</code>), special characters or commas within numeric fields, incorrect date formats (use YYYY-MM-DD).</li>
                      <li>Verify that numeric fields (spend, sales, etc.) do not contain currency symbols or percentage signs.</li>
                      <li>Ensure the file is saved with UTF-8 encoding, especially if it contains non-ASCII characters.</li>
                      <li>If errors persist, try importing a small subset of your data (e.g., a few rows) to isolate the problematic entries.</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="ts-item-2">
                  <AccordionTrigger>
                    Performance charts are not displaying data or look incorrect
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      If your performance charts aren't showing data as expected:
                    </p>
                    <ol className="list-decimal pl-5 mt-2 space-y-1 text-muted-foreground">
                      <li>Verify that campaign data has been successfully imported and processed. Check the Dashboard or Campaign Table for data presence.</li>
                      <li>Ensure you have selected an appropriate date range in the filters that corresponds to the available data.</li>
                      <li>Try refreshing the dashboard data using the "Refresh" button.</li>
                      <li>Clear your browser cache and cookies, or try accessing the tool in an incognito/private browsing window to rule out browser extension conflicts.</li>
                      <li>If using filters (e.g., Top 10, specific metric ranges), ensure the filters are not too restrictive, leading to no data matching the criteria. Try resetting to default filters.</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ TAB */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-6 w-6 text-orange-500 mr-2" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions and answers about the Amazon PPC Optimizer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    How accurate are the bid recommendations?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      The bid recommendations are based on machine learning models trained on historical performance data. Each recommendation includes a confidence score indicating its reliability. Generally, recommendations show higher accuracy when:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                      <li>More historical data is available (ideally 60+ days)</li>
                      <li>Campaign performance has been relatively stable</li>
                      <li>Suggested changes are incremental rather than dramatic</li>
                    </ul>
                    <p className="mt-3 text-muted-foreground">
                      For new campaigns or those with limited data, the system will indicate lower confidence and provide more conservative recommendations.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Can I undo changes made by optimization rules?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Yes, all changes made by automated rules are logged in the system. You can:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                      <li>View a complete history of rule executions and resulting bid changes</li>
                      <li>Manually revert any specific bid adjustment</li>
                      <li>Disable rules that are not performing as expected</li>
                      <li>Set up "safety" rules that can automatically reverse changes if performance declines</li>
                    </ul>
                    <p className="mt-3 text-muted-foreground">
                      We recommend setting conservative bid adjustment limits (e.g., maximum 10-15% change per execution) to prevent any major unexpected impacts.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How often should I update my campaign data?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      For optimal performance, we recommend:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                      <li><strong>Daily updates:</strong> For high-spend accounts or during critical periods (holiday seasons, product launches)</li>
                      <li><strong>Weekly updates:</strong> For most established accounts with moderate spend</li>
                      <li><strong>Monthly updates:</strong> Minimum frequency for low-spend accounts or very stable campaigns</li>
                    </ul>
                    <p className="mt-3 text-muted-foreground">
                      If you set up the Amazon API integration, data can be updated automatically according to your preferred schedule without manual CSV uploads.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    What's the difference between the AI providers in the chatbot?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      The PPC Expert Chatbot supports multiple AI providers, each with different strengths:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                      <li><strong>OpenAI (GPT-4o):</strong> Excellent for strategic guidance, creative solutions, and comprehensive explanations. Often provides the most actionable advice for complex scenarios.</li>
                      <li><strong>Anthropic (Claude 3.7 Sonnet):</strong> Particularly strong in nuanced explanation, careful analysis, and attention to detail. Tends to provide more cautious and thoroughly reasoned recommendations.</li>
                      <li><strong>Google Gemini:</strong> Strong in fact-based responses and can excel at specific analytical tasks. Often provides concise, direct answers.</li>
                    </ul>
                    <p className="mt-3 text-muted-foreground">
                      You can switch between providers at any time, even within the same conversation. This allows you to get diverse perspectives or use a backup option if one service has availability issues.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    What metrics should I focus on for optimization?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      The most important metrics depend on your business goals, but generally:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                      <li><strong>Profitability Focus:</strong> Prioritize ACoS (aim for below your profit margin) and ROAS (target above 3-4x for most products)</li>
                      <li><strong>Growth Focus:</strong> Consider impressions, CTR, and conversion rate to expand reach efficiently</li>
                      <li><strong>Brand Awareness:</strong> Pay attention to impressions and CPM (cost per thousand impressions)</li>
                      <li><strong>Product Launch:</strong> Monitor impressions and click volume to ensure adequate exposure</li>
                    </ul>
                    <p className="mt-3 text-muted-foreground">
                      The tool's marketing tooltips provide context-specific guidance on interpreting metrics for your particular campaigns. The PPC Expert Chatbot can also provide personalized advice on which metrics matter most for your specific situation.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>
                    How can I integrate with my current PPC management process?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      The Amazon PPC Optimizer is designed to complement your existing workflow:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                      <li><strong>Use as an analytical layer:</strong> Import your campaign data to gain insights while managing bids elsewhere</li>
                      <li><strong>Partial automation:</strong> Start with monitoring-only rules that suggest changes without implementing them</li>
                      <li><strong>Gradual implementation:</strong> Begin by automating routine adjustments for stable campaigns while manually managing others</li>
                      <li><strong>Full integration:</strong> Once comfortable, leverage the complete suite of optimization tools</li>
                    </ul>
                    <p className="mt-3 text-muted-foreground">
                      Many users begin by using the tool for visualization and insights, then gradually increase reliance on automation as they build confidence in the system's recommendations.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7">
                  <AccordionTrigger>
                    What should I do after implementing optimization rules?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      After setting up your optimization rules, follow these best practices:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                      <li><strong>Monitor performance closely:</strong> Check daily for the first week to ensure rules are behaving as expected</li>
                      <li><strong>Review rule execution logs:</strong> Understand which rules are activating and their impact</li>
                      <li><strong>Start with limited scope:</strong> Apply rules to a subset of campaigns initially to validate effectiveness</li>
                      <li><strong>Adjust gradually:</strong> Refine rule conditions and actions based on observed results</li>
                      <li><strong>Document performance changes:</strong> Track before/after metrics to quantify improvement</li>
                    </ul>
                    <p className="mt-3 text-muted-foreground">
                      Give rules at least 7-14 days to show results before making major adjustments, as Amazon's attribution can have delays and advertising performance often needs time to stabilize after changes.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8">
                  <AccordionTrigger>
                    Is my data secure with this tool?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Yes, data security is a top priority:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                      <li><strong>Data encryption:</strong> All campaign data is encrypted both in transit and at rest</li>
                      <li><strong>Private environment:</strong> Your data is isolated from other users' information</li>
                      <li><strong>Minimal data collection:</strong> Only essential campaign metrics are stored; no sensitive customer information is required</li>
                      <li><strong>API security:</strong> When using API integration, secured connections with Amazon's advertising platform follow industry best practices</li>
                      <li><strong>Local processing option:</strong> For highly sensitive accounts, data can be processed locally without cloud storage</li>
                    </ul>
                    <p className="mt-3 text-muted-foreground">
                      The tool does not require access to your Amazon seller account credentials, only to CSV exports or API credentials with specific permissions for advertising management.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger>
                    How long does it take to see results from bid optimizations?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      The time to see results from bid optimizations can vary. Typically, you might start noticing changes in performance metrics like ACoS or ROAS within 7-14 days. Amazon's advertising platform has attribution delays (often up to 72 hours), and it takes time for bid changes to influence auction dynamics and gather enough new performance data. For significant strategic shifts, allow 2-4 weeks to assess the full impact. Consistent monitoring and incremental adjustments yield the best long-term results.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger>
                    Can I use this tool for multiple Amazon marketplaces (e.g., US, EU, JP)?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Currently, the tool is optimized for a single marketplace per instance. If you manage campaigns across multiple Amazon marketplaces (e.g., Amazon.com, Amazon.co.uk, Amazon.de), you would typically handle each marketplace's data separately. Future updates may include features for consolidated multi-marketplace views or easier switching between marketplace data sets. Please refer to the "Prerequisites" section for data preparation specific to your marketplace.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-11">
                  <AccordionTrigger>
                    What kind of support is available if I encounter issues?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      We offer several support channels. You can consult this documentation, particularly the FAQ and Usage Guide sections. For technical issues or specific questions not covered here, you can typically reach out via a support email or a contact form provided on our website or within the application (if applicable). The integrated PPC Expert Chatbot can also assist with many common questions and troubleshooting steps related to PPC strategy and tool usage.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
