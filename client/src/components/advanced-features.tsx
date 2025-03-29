import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DataPointHighlighting from './features/data-point-highlighting';
import GradientVisualization from './features/gradient-visualization';
import MarketingTooltips from './features/marketing-tooltips';
import SuccessCelebration from './features/success-celebration';
import AnimatedLoading from './features/animated-loading';
import AmazonIntegration from './features/amazon-integration';
import RuleCustomization from './features/rule-customization';

export default function AdvancedFeatures() {
  const [showFeatures, setShowFeatures] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'dataHighlighting',
      title: 'Micro-interactions for data point highlighting',
      component: <DataPointHighlighting />
    },
    {
      id: 'gradientViz',
      title: 'Color-coded performance gradient visualization',
      component: <GradientVisualization />
    },
    {
      id: 'marketingTooltips',
      title: 'Interactive tooltips with marketing wisdom',
      component: <MarketingTooltips />
    },
    {
      id: 'successModal',
      title: 'Personalized campaign success celebration modal',
      component: <SuccessCelebration />
    },
    {
      id: 'loadingAnimations',
      title: 'Animated dashboard loading transitions',
      component: <AnimatedLoading />
    },
    {
      id: 'amazonApi',
      title: 'Integration with Amazon Advertising API',
      component: <AmazonIntegration />
    },
    {
      id: 'ruleCustomization',
      title: 'Advanced rule customization interface',
      component: <RuleCustomization />
    }
  ];

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(featureId === activeFeature ? null : featureId);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2">
        {showFeatures ? (
          <>
            {features.map(feature => (
              <Button
                key={feature.id}
                variant="secondary"
                className={`${
                  activeFeature === feature.id ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
                onClick={() => handleFeatureClick(feature.id)}
              >
                {feature.title}
              </Button>
            ))}
            <Button
              variant="secondary"
              className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2"
              onClick={() => {
                setShowFeatures(false);
                setActiveFeature(null);
              }}
            >
              <ChevronUp className="h-4 w-4" /> Show less
            </Button>
          </>
        ) : (
          <Button
            variant="secondary"
            className="bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2"
            onClick={() => setShowFeatures(true)}
          >
            <ChevronDown className="h-4 w-4" /> Show advanced features
          </Button>
        )}
      </div>

      {/* Feature demonstration area */}
      {activeFeature && (
        <div className="mt-6 animate-fadeIn">
          {features.find(f => f.id === activeFeature)?.component}
        </div>
      )}

      {/* Show overview when no feature is selected but features are shown */}
      {showFeatures && !activeFeature && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Advanced Visualization Tools</h3>
            <p className="text-gray-400 mb-3">
              Enhance your data analysis with interactive visualizations, micro-animations, and contextual insights.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-sm">Data point highlighting with anomaly detection</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-sm">Color-coded performance gradients</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-sm">Interactive tooltips with expert insights</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Advanced Campaign Controls</h3>
            <p className="text-gray-400 mb-3">
              Take precise control of your Amazon PPC campaigns with powerful tools and integrations.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-sm">Direct Amazon Advertising API integration</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-sm">Advanced rule customization interface</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-sm">Performance celebration and notification system</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}