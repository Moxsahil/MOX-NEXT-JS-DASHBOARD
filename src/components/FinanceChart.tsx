"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", income: 4000, expense: 2400 },
  { name: "Feb", income: 3000, expense: 1398 },
  { name: "Mar", income: 2000, expense: 9800 },
  { name: "Apr", income: 2780, expense: 3908 },
  { name: "May", income: 1890, expense: 4800 },
  { name: "Jun", income: 2390, expense: 3800 },
  { name: "Jul", income: 3490, expense: 4300 },
  { name: "Aug", income: 3490, expense: 4300 },
  { name: "Sep", income: 3490, expense: 4300 },
  { name: "Oct", income: 3490, expense: 4300 },
  { name: "Nov", income: 3490, expense: 4300 },
  { name: "Dec", income: 3490, expense: 4300 },
];

const FinanceChart = () => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-elevated/95 backdrop-blur-lg p-4 rounded-xl shadow-glow border border-dark-border-secondary/50">
          <p className="font-semibold text-dark-text-primary mb-2">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-dark-text-secondary">
                {`${entry.dataKey}: $${entry.value.toLocaleString()}`}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-4 h-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-elevated/30 border border-dark-border-secondary/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-gradient-to-r from-brand-success to-accent-emerald rounded-full"></div>
            <div className="text-xs text-dark-text-secondary font-medium">Total Income</div>
          </div>
          <div className="text-lg font-bold text-brand-success">${totalIncome.toLocaleString()}</div>
        </div>
        <div className="bg-dark-elevated/30 border border-dark-border-secondary/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-gradient-to-r from-accent-red to-accent-rose rounded-full"></div>
            <div className="text-xs text-dark-text-secondary font-medium">Total Expenses</div>
          </div>
          <div className="text-lg font-bold text-accent-red">${totalExpense.toLocaleString()}</div>
        </div>
        <div className={`bg-dark-elevated/30 border border-dark-border-secondary/30 rounded-xl p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${netProfit >= 0 ? 'bg-gradient-to-r from-brand-success to-accent-emerald' : 'bg-gradient-to-r from-accent-red to-accent-rose'}`}></div>
            <div className="text-xs text-dark-text-secondary font-medium">Net Profit</div>
          </div>
          <div className={`text-lg font-bold ${netProfit >= 0 ? 'text-brand-success' : 'text-accent-red'}`}>${Math.abs(netProfit).toLocaleString()}</div>
        </div>
      </div>


      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
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
            tickMargin={20}
            tickFormatter={(value) => `$${(value / 1000)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "0px", paddingBottom: "20px" }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#10b981' }}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: '#ef4444' }}
            name="Expense"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
