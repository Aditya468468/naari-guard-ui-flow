import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, X, Volume2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

// Default safety keywords organized by category
const DEFAULT_KEYWORDS = {
  emergency: ['help', 'help me', 'save me', 'danger', 'emergency', 'urgent', 'scared', 'afraid'],
  violence: ['attack', 'assault', 'hit', 'hurt', 'violence', 'abuse', 'harass', 'stalking'],
  threats: ['die', 'kill', 'murder', 'death', 'weapon', 'gun', 'knife', 'shoot'],
  distress: ['crying', 'screaming', 'please stop', 'leave me alone', 'get away', 'don\'t touch me'],
  medical: ['medical emergency', 'heart attack', 'can\'t breathe', 'chest pain', 'unconscious'],
  location: ['dark alley', 'abandoned', 'isolated', 'following me', 'stranger danger']
};

interface SafetyKeywordsConfigProps {
  onKeywordsChange?: (keywords: string[]) => void;
  initialKeywords?: string[];
}

const SafetyKeywordsConfig: React.FC<SafetyKeywordsConfigProps> = ({
  onKeywordsChange,
  initialKeywords = []
}) => {
  const { toast } = useToast();
  const [customKeywords, setCustomKeywords] = useState<string[]>(initialKeywords);
  const [newKeyword, setNewKeyword] = useState('');
  const [enabledCategories, setEnabledCategories] = useState<Record<string, boolean>>({
    emergency: true,
    violence: true,
    threats: true,
    distress: true,
    medical: true,
    location: true
  });
  const [isTestMode, setIsTestMode] = useState(false);

  const getAllActiveKeywords = () => {
    const activeDefaults = Object.entries(enabledCategories)
      .filter(([_, enabled]) => enabled)
      .flatMap(([category, _]) => DEFAULT_KEYWORDS[category as keyof typeof DEFAULT_KEYWORDS]);
    
    return [...activeDefaults, ...customKeywords];
  };

  useEffect(() => {
    if (onKeywordsChange) {
      onKeywordsChange(getAllActiveKeywords());
    }
  }, [customKeywords, enabledCategories, onKeywordsChange]);

  const addCustomKeyword = () => {
    if (newKeyword.trim() && !customKeywords.includes(newKeyword.trim().toLowerCase())) {
      const keyword = newKeyword.trim().toLowerCase();
      setCustomKeywords(prev => [...prev, keyword]);
      setNewKeyword('');
      toast({
        title: "Keyword Added",
        description: `"${keyword}" has been added to your safety keywords.`,
      });
    }
  };

  const removeCustomKeyword = (keyword: string) => {
    setCustomKeywords(prev => prev.filter(k => k !== keyword));
    toast({
      title: "Keyword Removed",
      description: `"${keyword}" has been removed from your safety keywords.`,
    });
  };

  const toggleCategory = (category: string) => {
    setEnabledCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const testKeywordDetection = () => {
    const allKeywords = getAllActiveKeywords();
    toast({
      title: "Keyword Detection Test",
      description: `Currently monitoring ${allKeywords.length} safety keywords. Try saying one of your keywords to test the detection.`,
      duration: 5000,
    });
    setIsTestMode(true);
    
    // Reset test mode after 30 seconds
    setTimeout(() => setIsTestMode(false), 30000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency': return '🆘';
      case 'violence': return '⚠️';
      case 'threats': return '🚨';
      case 'distress': return '😰';
      case 'medical': return '🏥';
      case 'location': return '📍';
      default: return '🔍';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'violence': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'threats': return 'bg-red-100 text-red-800 border-red-200';
      case 'distress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'medical': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'location': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <CardTitle>Safety Keywords Configuration</CardTitle>
        </div>
        <CardDescription>
          Configure words and phrases that will trigger safety alerts and notify your trust circle.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories">Default Categories</TabsTrigger>
            <TabsTrigger value="custom">Custom Keywords</TabsTrigger>
            <TabsTrigger value="test">Test & Monitor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-4">
            <div className="space-y-4">
              {Object.entries(DEFAULT_KEYWORDS).map(([category, keywords]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(category)}</span>
                      <Label className="text-sm font-medium capitalize">{category} Keywords</Label>
                      <Badge variant="secondary" className="text-xs">
                        {keywords.length} words
                      </Badge>
                    </div>
                    <Switch
                      checked={enabledCategories[category]}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                  </div>
                  
                  {enabledCategories[category] && (
                    <div className="flex flex-wrap gap-1 pl-7">
                      {keywords.map((keyword, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className={`text-xs ${getCategoryColor(category)}`}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom safety keyword..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomKeyword()}
                  className="flex-1"
                />
                <Button onClick={addCustomKeyword} size="sm">
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
              
              {customKeywords.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Your Custom Keywords</Label>
                  <div className="flex flex-wrap gap-2">
                    {customKeywords.map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-200"
                      >
                        {keyword}
                        <button
                          onClick={() => removeCustomKeyword(keyword)}
                          className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="test" className="space-y-4">
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-blue-500" />
                  <Label className="font-medium">Keyword Detection Status</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Keywords:</span>
                    <span className="ml-2 font-medium">{getAllActiveKeywords().length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Active Categories:</span>
                    <span className="ml-2 font-medium">
                      {Object.values(enabledCategories).filter(Boolean).length}/6
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button 
                    onClick={testKeywordDetection} 
                    variant={isTestMode ? "secondary" : "default"}
                    className="w-full"
                    disabled={isTestMode}
                  >
                    {isTestMode ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Test Mode Active (30s)
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        Test Keyword Detection
                      </>
                    )}
                  </Button>
                  
                  {isTestMode && (
                    <div className="text-sm text-muted-foreground text-center">
                      Try speaking one of your safety keywords to test the detection system.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-amber-800">Important Notes</p>
                    <ul className="text-xs text-amber-700 space-y-1">
                      <li>• Keywords are detected in real-time during audio recording</li>
                      <li>• Your trust circle will be automatically notified when keywords are detected</li>
                      <li>• Keep your keywords specific but comprehensive for best results</li>
                      <li>• Test regularly to ensure the system works as expected</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SafetyKeywordsConfig;