"use client";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AttendanceChart = ({
  data,
}: {
  data: { name: string; present: number; absent: number }[];
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-elevated/95 backdrop-blur-lg p-4 rounded-xl shadow-glow border border-dark-border-secondary/50">
          <p className="font-semibold text-dark-text-primary mb-2">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-accent-emerald to-accent-teal rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-dark-text-primary">Attendance Overview</h3>
            <p className="text-sm text-dark-text-secondary">Daily attendance tracking</p>
          </div>
        </div>
        <button className="bg-dark-elevated hover:bg-dark-elevated/80 text-dark-text-secondary hover:text-dark-text-primary px-3 py-2 rounded-lg text-xs transition-colors duration-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart width={500} height={300} data={data} barSize={24} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis 
            axisLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 12 }} 
            tickLine={false}
            tickMargin={15}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "0px", paddingBottom: "30px" }}
            iconType="circle"
          />
          <Bar
            dataKey="present"
            fill="url(#presentGradient)"
            name="Present"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill="url(#absentGradient)"
            name="Absent"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
