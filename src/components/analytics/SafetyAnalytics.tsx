
import React from 'react';
import { Calendar, Info, Map, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SafetyAnalytics: React.FC = () => {
  // Sample data - will be replaced with real API data later
  const hourlyData = [
    { hour: '6 AM', score: 92 },
    { hour: '9 AM', score: 88 },
    { hour: '12 PM', score: 75 },
    { hour: '3 PM', score: 80 },
    { hour: '6 PM', score: 65 },
    { hour: '9 PM', score: 45 },
    { hour: '12 AM', score: 30 },
  ];
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="glass-card p-2 text-xs">
          <p className="text-white font-medium">{data.hour}</p>
          <p className="text-naari-purple">Safety: {data.score}/100</p>
        </div>
      );
    }
    
    return null;
  };
  
  // Function to determine color based on safety score
  const getBarColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 50) return '#FBBF24';
    return '#EF4444';
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <h1 className="text-2xl font-bold text-gradient mb-2">Safety Analytics</h1>
      <p className="text-sm text-gray-400 mb-6">
        AI-powered insights for your personal safety
      </p>
      
      <div className="glass-card rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-naari-purple w-5 h-5" />
            <span className="text-white font-medium">Safety Trends</span>
          </div>
          <button className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <Info className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="hour" 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} 
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} 
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                radius={[4, 4, 0, 0]}
                barSize={20}
                animationDuration={1500}
                fill="#8884d8"
                // Using the getBarColor function with proper syntax for the fill
                fillOpacity={1}
                isAnimationActive={true}
                // Using a render prop to apply different colors based on data
                shape={(props) => {
                  const { x, y, width, height, value } = props;
                  return (
                    <rect 
                      x={x} 
                      y={y} 
                      width={width} 
                      height={height} 
                      fill={getBarColor(value)} 
                      rx={4}
                      ry={4}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-card rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Map className="text-naari-teal w-4 h-4" />
            <span className="text-white text-sm font-medium">Area Insights</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Current Location</span>
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Medium</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Recent Route</span>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">High</span>
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-naari-purple w-4 h-4" />
            <span className="text-white text-sm font-medium">Time Insights</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Safest Hours</span>
              <span className="text-xs text-white">8AM - 5PM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Caution Time</span>
              <span className="text-xs text-white">After 9PM</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-4 mb-6">
        <h3 className="text-white font-medium mb-3">Personalized Safety Suggestions</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-naari-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-naari-purple text-lg">1</span>
            </div>
            <div>
              <p className="text-sm text-gray-300">Avoid south downtown area after 10 PM</p>
              <p className="text-xs text-gray-500">Based on recent safety reports</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-naari-teal/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-naari-teal text-lg">2</span>
            </div>
            <div>
              <p className="text-sm text-gray-300">Consider alternative route to work</p>
              <p className="text-xs text-gray-500">20% safer based on community data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyAnalytics;
