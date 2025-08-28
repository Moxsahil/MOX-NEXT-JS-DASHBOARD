"use client";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
  const data = [
    {
      name: "Total",
      count: boys + girls,
      fill: "transparent",
    },
    {
      name: "Girls",
      count: girls,
      fill: "url(#girlsGradient)",
    },
    {
      name: "Boys",
      count: boys,
      fill: "url(#boysGradient)",
    },
  ];

  return (
    <div className="space-y-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-dark-text-primary">Student Distribution</h3>
            <p className="text-sm text-dark-text-secondary">Boys vs Girls ratio</p>
          </div>
        </div>
        <button className="bg-dark-elevated hover:bg-dark-elevated/80 text-dark-text-secondary hover:text-dark-text-primary px-3 py-2 rounded-lg text-xs transition-colors duration-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Chart */}
      <div className="relative w-full h-64">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="45%"
            outerRadius="90%"
            barSize={20}
            data={data}
          >
            <defs>
              <linearGradient id="girlsGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
              <linearGradient id="boysGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <RadialBar 
              background={{ fill: '#1e293b', fillOpacity: 0.2 }} 
              dataKey="count"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        
        {/* Center Content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="bg-dark-elevated/80 backdrop-blur-sm p-4 rounded-full shadow-glow border border-dark-border-secondary/50">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-xl font-bold text-dark-text-primary">{boys + girls}</div>
            <div className="text-xs text-dark-text-secondary font-medium">Total</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary"></div>
          <span className="text-sm font-medium text-dark-text-secondary">Boys: {boys}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent-pink to-accent-rose"></div>
          <span className="text-sm font-medium text-dark-text-secondary">Girls: {girls}</span>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
