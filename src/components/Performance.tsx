"use client";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Excellent", value: 92, fill: "url(#excellentGradient)" },
  { name: "Needs Improvement", value: 8, fill: "url(#improvementGradient)" },
];

const Performance = () => {
  return (
    <div className="card-modern p-6 h-80 hover:shadow-glow transition-all duration-300 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-secondary to-brand-primary opacity-5 rounded-full -mr-12 -mt-12"></div>
      
      <div className="relative z-10 h-full flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-text-primary">Academic Performance</h2>
              <p className="text-sm text-dark-text-secondary">Overall student achievement</p>
            </div>
          </div>
          
          <button className="bg-dark-elevated hover:bg-dark-elevated/80 text-dark-text-secondary hover:text-dark-text-primary px-3 py-2 rounded-lg text-xs transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
        
        {/* CHART AREA */}
        <div className="flex-1 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="excellentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
                <linearGradient id="improvementGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                stroke="none"
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* CENTER SCORE */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="bg-dark-elevated/80 backdrop-blur-sm border border-dark-border-secondary/50 rounded-2xl px-4 py-3 shadow-glow">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-success to-accent-emerald bg-clip-text text-transparent tabular-nums">9.2</h1>
              <p className="text-xs text-dark-text-secondary font-medium">of 10 max GPA</p>
            </div>
          </div>
        </div>
        
        {/* FOOTER */}
        <div className="mt-4 pt-4 border-t border-dark-border-secondary/30">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-dark-elevated/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full"></div>
              <span className="text-xs font-semibold text-dark-text-secondary">2024/25 Academic Year</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-brand-success to-accent-emerald rounded-full"></div>
                <span className="text-xs text-brand-success font-medium">Excellent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-accent-amber to-accent-red rounded-full"></div>
                <span className="text-xs text-accent-amber font-medium">Improvement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
