import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Calculator, ArrowRight, CheckCircle } from 'lucide-react';

const basePrice = 2500;

const features = [
  { id: 'cms', label: 'CMS Integration', price: 1500 },
  { id: 'ecommerce', label: 'E-commerce', price: 3000 },
  { id: 'seo', label: 'SEO Optimization', price: 800 },
  { id: 'analytics', label: 'Analytics Dashboard', price: 600 },
  { id: 'multilang', label: 'Multi-language', price: 1200 },
  { id: 'auth', label: 'User Authentication', price: 1000 },
];

const CostCalculator = () => {
  const [pages, setPages] = useState([5]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [timeline, setTimeline] = useState([4]);
  const [showQuote, setShowQuote] = useState(false);
  const { toast } = useToast();

  const calculateTotal = () => {
    const pagesCost = pages[0] * 300;
    const featuresCost = selectedFeatures.reduce((acc, id) => {
      const feature = features.find(f => f.id === id);
      return acc + (feature?.price || 0);
    }, 0);
    const timelineMultiplier = timeline[0] <= 2 ? 1.5 : timeline[0] <= 4 ? 1 : 0.9;
    
    return Math.round((basePrice + pagesCost + featuresCost) * timelineMultiplier);
  };

  const handleFeatureToggle = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleGetQuote = () => {
    setShowQuote(true);
    toast({
      title: 'Estimate Ready!',
      description: `Your project estimate is $${calculateTotal().toLocaleString()}`,
    });
  };

  const total = calculateTotal();
  const minPrice = 2500;
  const maxPrice = 15000;
  const progress = ((total - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <section className="py-24 bg-background" id="calculator">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium mb-3">Cost Calculator</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
            Estimate Your Project
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Get an instant estimate based on your project requirements. 
            Final quotes may vary based on specific needs.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 space-y-8"
            >
              {/* Pages Slider */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="font-medium text-foreground">Number of Pages</label>
                  <span className="text-primary font-semibold">{pages[0]} pages</span>
                </div>
                <Slider
                  value={pages}
                  onValueChange={setPages}
                  min={1}
                  max={20}
                  step={1}
                />
              </div>

              {/* Timeline Slider */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="font-medium text-foreground">Timeline</label>
                  <span className="text-primary font-semibold">{timeline[0]} weeks</span>
                </div>
                <Slider
                  value={timeline}
                  onValueChange={setTimeline}
                  min={2}
                  max={12}
                  step={1}
                />
                <p className="text-xs text-text-secondary mt-2">
                  Rush projects (≤2 weeks) have a 50% surcharge. Extended timelines save 10%.
                </p>
              </div>

              {/* Features Checkboxes */}
              <div>
                <label className="font-medium text-foreground block mb-3">Additional Features</label>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature.id}
                        checked={selectedFeatures.includes(feature.id)}
                        onCheckedChange={() => handleFeatureToggle(feature.id)}
                      />
                      <label
                        htmlFor={feature.id}
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        {feature.label}
                        <span className="text-primary ml-1">+${feature.price.toLocaleString()}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Estimate Display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 flex flex-col justify-center"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <p className="text-text-secondary text-sm mb-2">Estimated Range</p>
                <p className="text-4xl md:text-5xl font-display font-bold text-foreground">
                  ${total.toLocaleString()}
                </p>
                <p className="text-text-secondary text-sm mt-2">
                  Starting from ${basePrice.toLocaleString()} base price
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2 mb-6">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Base Price</span>
                  <span className="font-medium">${basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Pages ({pages[0]} × $300)</span>
                  <span className="font-medium">${(pages[0] * 300).toLocaleString()}</span>
                </div>
                {selectedFeatures.map(id => {
                  const feature = features.find(f => f.id === id);
                  return feature ? (
                    <div key={id} className="flex justify-between">
                      <span className="text-text-secondary">{feature.label}</span>
                      <span className="font-medium">${feature.price.toLocaleString()}</span>
                    </div>
                  ) : null;
                })}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total Estimate</span>
                    <span className="font-bold text-primary">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full"
                onClick={handleGetQuote}
              >
                Get Exact Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {showQuote && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-50 rounded-lg text-center"
                >
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 text-sm">
                    Thanks! We'll send a detailed quote to your email within 24 hours.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostCalculator;
